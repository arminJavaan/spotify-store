// backend/routes/orders.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const requireRole = require("../middleware/roles");
const User = require("../models/User");
const Order = require("../models/Order");
const DiscountCode = require("../models/DiscountCode");
const dotenv = require("dotenv");
dotenv.config();

// @route   POST /api/orders
// @desc    ثبت سفارش جدید بر اساس سبد خرید کاربر
// @access  Private
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

      if (dc.owner?.toString() === req.user.id)
        return res
          .status(400)
          .json({ msg: "شما مجاز به استفاده از کد تخفیف خودتان نیستید" });

      const usedBefore = await Order.findOne({
        user: req.user.id,
        discountCode: dc.code,
      });
      if (usedBefore)
        return res
          .status(400)
          .json({ msg: "شما قبلاً از این کد استفاده کرده‌اید" });

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
        totalAmount -= appliedDiscount;
        if (dc.type === "reward70") dc.active = false;
      }

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
      const whatsappNumber = process.env.WHATSAPP_NUMBER || "+989000000000";
      let text = `سلام! من می‌خوام این سفارش رو ثبت کنم:\n`;
      user.cart.forEach((item) => {
        text += `• ${item.product.name} × ${item.quantity}\n`;
      });
      text += `مبلغ کل: ${totalAmount.toLocaleString("fa-IR")} تومان`;
      const url = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
        text
      )}`;
      orderData.whatsappOrderUrl = url;
    }

    const newOrder = new Order(orderData);
    await newOrder.save();

    // Populate product details for email before sending
    const populatedOrder = await Order.findById(newOrder._id).populate("items.product");
    const sendOrderEmail = require("../utils/sendEmail");
    await sendOrderEmail(populatedOrder);

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

module.exports = router;