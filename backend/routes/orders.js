// backend/routes/orders.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @route   POST /api/orders
// @desc    ایجاد سفارش جدید بر اساس سبد کاربر
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { paymentMethod, paymentDetails } = req.body;

    // ۱. اول سبد خرید را واکشی می‌کنیم
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: 'سبد خرید شما خالی است' });
    }

    // ۲. محاسبه مبلغ کل
    const totalAmount = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    // ۳. ایجاد سفارش
    const orderData = {
      user: req.user.id,
      items: cart.items.map(i => ({ product: i.product._id, quantity: i.quantity })),
      totalAmount,
      paymentMethod,
      paymentDetails,
      status: 'pending'
    };

    // اگر روش واتساپ باشد، در سمت سرور یک لینک واتساپ می‌سازیم
    if (paymentMethod === 'whatsapp') {
      // شماره واتساپ را به این صورت فرض می‌کنیم:
      const whatsappNumber = '+989158184550'; // بعداً جایگزین کنید
      // ساخت متن پیام پیش‌پرشده
      let text = `سلام! من می‌خوام اکانت(ها) رو سفارش بدم:\n`;
      cart.items.forEach(item => {
        text += `• ${item.product.name} ×${item.quantity}\n`;
      });
      text += `مبلغ کل: ${totalAmount.toLocaleString('fa-IR')} تومان`;
      const url = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
      orderData.whatsappOrderUrl = url;
    }

    const newOrder = new Order(orderData);
    await newOrder.save();

    // ۴. پس از ایجاد سفارش می‌توان سبد را خالی کرد
    cart.items = [];
    await cart.save();

    res.json({ 
      msg: 'سفارش با موفقیت ثبت شد',
      order: newOrder 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('خطای سرور');
  }
});

// @route   GET /api/orders
// @desc    دریافت لیست سفارش‌های کاربر لاگین کرده
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.product');
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('خطای سرور');
  }
});

module.exports = router;
