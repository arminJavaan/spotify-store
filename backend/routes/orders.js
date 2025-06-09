// backend/routes/orders.js

import express from "express";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();

import auth from "../middleware/auth.js";
import requireRole from "../middleware/roles.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Wallet from "../models/Wallet.js";
import DiscountCode from "../models/DiscountCode.js";
import WalletTopupRequest from "../models/WalletTopupRequest.js";
import { sendOrderEmail, sendOrderReceiptEmail } from "../utils/sendEmail.js";
import sendTelegramMessage from "../utils/telegram.js";

router.get("/", auth, async (req, res) => {
  try {
    const [orders, topupRequests] = await Promise.all([
      Order.find({ user: req.user.id })
        .populate("items.product")
        .sort({ createdAt: -1 }),
      WalletTopupRequest.find({ user: req.user.id }).sort({ createdAt: -1 }),
    ]);

    // تبدیل topupRequestها به فرمت مشابه order برای نمایش در فرانت
    const mappedTopups = topupRequests.map((req) => ({
      _id: req._id,
      type: "topup",
      createdAt: req.createdAt,
      amount: req.amount,
      method: req.method,
      status: req.status,
    }));

    // اضافه کردن فیلد type: "order" به هر سفارش
    const mappedOrders = orders.map((o) => ({
      ...o.toObject(),
      type: "order",
    }));

    const combined = [...mappedOrders, ...mappedTopups].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return res.json(combined);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "خطای سرور" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { paymentMethod, paymentDetails, discountCode } = req.body;

    const user = await User.findById(req.user.id).populate("cart.product");
    if (!user || !user.cart || user.cart.length === 0) {
      return res.status(400).json({ msg: "سبد خرید شما خالی است" });
    }

    let totalAmount = user.cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );


    let appliedDiscount = 0;

    if (discountCode) {
      const dc = await DiscountCode.findOne({
        code: discountCode,
        active: true,
      });

      if (!dc)
        return res
          .status(404)
          .json({ msg: "کد تخفیف معتبر نیست یا غیرفعال شده" });

      if (
        (dc.type === "reward70" || dc.type === "freeAccount") &&
        dc.owner?.toString() !== req.user.id
      ) {
        return res
          .status(403)
          .json({ msg: "این کد فقط توسط صاحب آن قابل استفاده است" });
      }

      const validExclusiveIds = [
        "683bb5d9bd6d9f451a5e1532",
        "683c3043743bb8c0ca380977",
      ];
      const cartProductIds = user.cart.map((item) =>
        item.product._id.toString()
      );
      const isSingleValidItem =
        cartProductIds.length === 1 &&
        validExclusiveIds.includes(cartProductIds[0]) &&
        user.cart[0].quantity === 1;

      if (
        (dc.type === "reward70" || dc.type === "freeAccount") &&
        !isSingleValidItem
      ) {
        return res.status(400).json({
          msg: "این کد فقط برای اشتراک individual و family member است و فقط زمانی که یک عدد از آن به‌تنهایی در سبد خرید باشد قابل استفاده است",
        });
      }

      const usedBefore = await Order.findOne({
        user: req.user.id,
        discountCode: dc.code,
      });
      if (usedBefore)
        return res
          .status(400)
          .json({ msg: "شما قبلاً از این کد استفاده کرده‌اید" });

      if (dc.expiresAt && new Date() > dc.expiresAt)
        return res.status(400).json({ msg: "تاریخ انقضای کد تخفیف گذشته است" });

      let percentage = dc.percentage || 0;
      let freeAccount = false;
      if (dc.type === "personal") percentage = 15;
      else if (dc.type === "reward70") percentage = 70;
      else if (dc.type === "freeAccount") freeAccount = true;

      if (freeAccount) {
        appliedDiscount = totalAmount;
        totalAmount = 0;
        dc.active = false;
      } else {
        appliedDiscount = Math.floor(totalAmount * (percentage / 100));
        if (appliedDiscount > 200000) appliedDiscount = 200000;
        totalAmount -= appliedDiscount;
      }

      if (dc.type === "reward70") dc.active = false;
      dc.uses += 1;
      await dc.save();

      if (dc.type === "personal" && dc.uses === 5) {
        const rewardCode = Math.random()
          .toString(36)
          .substr(2, 8)
          .toUpperCase();
        await DiscountCode.create({
          code: rewardCode,
          owner: dc.owner,
          uses: 0,
          active: true,
          generatedBySystem: true,
          type: "reward70",
        });
      }

      if (dc.type === "personal" && dc.uses === 10) {
        const freeCode = Math.random().toString(36).substr(2, 24).toUpperCase();
        await DiscountCode.create({
          code: freeCode,
          owner: dc.owner,
          uses: 0,
          active: true,
          generatedBySystem: true,
          type: "freeAccount",
        });
      }
    }

    if (paymentMethod === "wallet") {
      const wallet = await Wallet.findOne({ user: req.user.id });
      if (!wallet) return res.status(400).json({ msg: "کیف پول شما یافت نشد" });
      if (wallet.balance < totalAmount)
        return res.status(400).json({ msg: "موجودی کیف پول کافی نیست" });

      wallet.balance -= totalAmount;
      wallet.transactions.push({
        type: "purchase",
        amount: totalAmount,
        description: "خرید از کیف پول",
      });
      await wallet.save();
    }

    const orderData = {
      user: req.user.id,
      items: user.cart.map((i) => ({
        product: i.product._id,
        quantity: i.quantity,
      })),
      totalAmount,
      discountCode: discountCode || null,
      discountAmount: appliedDiscount,
      paymentMethod,
      paymentDetails,
      status: "pending",
    };

    if (paymentMethod === "whatsapp") {
      const whatsappNumber = process.env.WHATSAPP_NUMBER || "+989158184550";
      let text = `سلام! من می‌خوام این سفارش رو ثبت کنم:\n`;
      user.cart.forEach((item) => {
        text += `• ${item.product.name} × ${item.quantity}\n`;
      });
      text += `مبلغ کل: ${totalAmount.toLocaleString("fa-IR")} تومان`;
      const url = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
      orderData.whatsappOrderUrl = url;
    }

                // 📌 محاسبه کش‌بک (۵٪ با سقف ۱۰۰هزار تومان)
    let cashbackAmount = 0;
    if (totalAmount > 0) {
      cashbackAmount = Math.floor(totalAmount * 0.05); // ۵٪
      if (cashbackAmount > 100000) cashbackAmount = 100000;

      const wallet = await Wallet.findOne({ user: req.user.id });
      if (wallet) {
        wallet.balance += cashbackAmount;
        wallet.transactions.push({
          type: "increase",
          amount: cashbackAmount,
          description: "کش‌بک سفارش",
        });
        await wallet.save();
      }
    }
    orderData.cashbackAmount = cashbackAmount;


    const newOrder = new Order(orderData);
    await newOrder.save();

    const populatedOrder = await Order.findById(newOrder._id)
      .populate("items.product")
      .populate("user");
    await sendOrderEmail(populatedOrder);
    await sendOrderReceiptEmail(populatedOrder);

    await sendTelegramMessage(`
📦 <b>سفارش جدید دریافت شد!</b>

👤 <b>کاربر:</b> ${user.name || "نام نامشخص"} (${user.email})
📧 <b>ایمیل:</b> ${user.email}
💳 <b>روش پرداخت:</b> ${paymentMethod === "whatsapp" ? "واتساپ" : paymentMethod}

🛒 <b>محصولات سفارش‌داده‌شده:</b>
${populatedOrder.items.map((item) => `• ${item.product.name} × ${item.quantity}`).join("\n")}

💰 <b>مبلغ نهایی:</b> ${populatedOrder.totalAmount.toLocaleString("fa-IR")} تومان
🔖 <b>کد تخفیف:</b> ${populatedOrder.discountCode || "—"}
💸 <b>میزان تخفیف:</b> ${populatedOrder.discountAmount?.toLocaleString("fa-IR") || 0} تومان
💚 <b>کش‌بک:</b> ${populatedOrder.cashbackAmount.toLocaleString("fa-IR")} تومان


🧾 <b>شماره سفارش:</b> ${populatedOrder._id}
🕒 <b>تاریخ ثبت:</b> ${new Date().toLocaleString("fa-IR")}
    `);

    user.cart = [];
    await user.save();

    return res.json({ msg: "سفارش با موفقیت ثبت شد", order: newOrder });
  } catch (err) {
    console.error("🚨 Order Error:", err);
    return res.status(500).json({ msg: "خطای سرور" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product")
      .sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "خطای سرور" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");
    if (!order) return res.status(404).json({ msg: "سفارش یافت نشد" });

    if (req.user.role !== "admin" && order.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "دسترسی کافی نیست" });
    }

    return res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "سفارش یافت نشد" });
    return res.status(500).json({ msg: "خطای سرور" });
  }
});

router.put("/:id/status", auth, requireRole("admin"), async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ msg: "وضعیت نامعتبر است" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: "سفارش یافت نشد" });

    order.status = status;
    await order.save();
    return res.json({ msg: "وضعیت سفارش به‌روزرسانی شد", order });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId")
      return res.status(404).json({ msg: "سفارش یافت نشد" });
    return res.status(500).json({ msg: "خطای سرور" });
  }
});

export default router;
