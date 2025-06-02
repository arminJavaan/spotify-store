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

    // واکشی کاربر به همراه سبد خرید
    const user = await User.findById(req.user.id).populate("cart.product");
    if (!user || !user.cart || user.cart.length === 0) {
      return res.status(400).json({ msg: "سبد خرید شما خالی است" });
    }

    // محاسبه مبلغ کل (به تومان)
    let totalAmount = user.cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // مقدار نهایی تخفیف (به تومان)
    let appliedDiscount = 0;

    if (discountCode) {
      // جستجوی کد تخفیف و اعتبارسنجی
      const dc = await DiscountCode.findOne({
        code: discountCode,
        active: true
      });
      if (!dc) {
        return res
          .status(404)
          .json({ msg: "کد تخفیف معتبر نیست یا غیرفعال شده" });
      }
      // کاربر نمی‌تواند از کد خودش استفاده کند
      if (dc.owner.toString() === req.user.id) {
        return res
          .status(400)
          .json({ msg: "شما مجاز به استفاده از کد تخفیف خودتان نیستید" });
      }

      // تعیین نوع کد تخفیف و درصد یا وضعیت freeAccount
      let percentage = dc.percentage || 0;
      let freeAccount = false;
      if (dc.type === "personal") {
        percentage = 15;
      } else if (dc.type === "reward70") {
        percentage = 70;
      } else if (dc.type === "freeAccount") {
        freeAccount = true;
      }

      if (freeAccount) {
        // اگر freeAccount باشد، کل مبلغ صفر می‌شود
        appliedDiscount = totalAmount;
        totalAmount = 0;

        // freeAccount فقط یک بار مجاز است
        dc.active = false;
      } else {
        // اگر درصدی باشد
        appliedDiscount = Math.floor(totalAmount * (percentage / 100));
        totalAmount -= appliedDiscount;

        // اگر از نوع reward70 باشد، فقط یک بار مجاز است
        if (dc.type === "reward70") {
          dc.active = false;
        }
      }

      // افزایش شمارش تعداد استفاده
      dc.uses += 1;
      await dc.save();

      // اگر از نوع personal بوده و تعداد استفاده به ۵ رسید → تولید خودکار کد reward70
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
          type: "reward70"
        });
      }

      // اگر از نوع personal بوده و تعداد استفاده به ۱۰ رسید → تولید خودکار کد freeAccount
      if (dc.type === "personal" && dc.uses === 10) {
        const freeCode = Math.random().toString(36).substr(2, 24).toUpperCase();
        await DiscountCode.create({
          code: freeCode,
          owner: dc.owner,
          uses: 0,
          active: true,
          generatedBySystem: true,
          type: "freeAccount"
        });
        // (در ادامه، ادمین می‌تواند این کد را مشاهده و تبدیل به حساب رایگان کند)
      }
    }

    // ساخت اطلاعات سفارش
    const orderData = {
      user: req.user.id,
      items: user.cart.map((i) => ({
        product: i.product._id,
        quantity: i.quantity
      })),
      totalAmount,
      discountCode: discountCode || null,
      discountAmount: appliedDiscount,
      paymentMethod,
      paymentDetails,
      status: "pending"
    };

    // اگر روش واتساپ باشد، لینک واتساپ را می‌سازیم
    if (paymentMethod === "whatsapp") {
      const whatsappNumber = process.env.WHATSAPP_NUMBER || "+989000000000";
      let text = `سلام! من می‌خوام این سفارش رو ثبت کنم:\n`;
      user.cart.forEach((item) => {
        text += `• ${item.product.name} × ${item.quantity}\n`;
      });
      text += `مبلغ کل: ${totalAmount.toLocaleString("fa-IR")} تومان`;
      const url = `https://wa.me/${whatsappNumber.replace(
        /\D/g,
        ""
      )}?text=${encodeURIComponent(text)}`;
      orderData.whatsappOrderUrl = url;
    }

    // ذخیره سفارش جدید
    const newOrder = new Order(orderData);
    await newOrder.save();

    // خالی کردن سبد خرید پس از ثبت سفارش
    user.cart = [];
    await user.save();

    return res.json({ msg: "سفارش با موفقیت ثبت شد", order: newOrder });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: "خطای سرور" });
  }
});

// @route   GET /api/orders
// @desc    دریافت لیست سفارش‌های کاربر لاگین کرده
// @access  Private
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

// @route   GET /api/orders/:id
// @desc    دریافت جزئیات یک سفارش (User only own orders / Admin can access any)
// @access  Private
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

// @route   PUT /api/orders/:id/status
// @desc    به‌روزرسانی وضعیت سفارش (Admin only)
// @access  Private, Admin
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
