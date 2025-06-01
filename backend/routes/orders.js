const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const dotenv = require('dotenv');
dotenv.config();

// @route   POST /api/orders
// @desc    ثبت سفارش جدید بر اساس سبد خرید
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { paymentMethod, paymentDetails } = req.body;

    // واکشی سبد کاربر
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ msg: 'سبد خرید شما خالی است' });

    // محاسبه مبلغ کل
    let totalAmount = 0;
    for (let item of cart.items) {
      totalAmount += item.product.price * item.quantity;
    }

    // آماده‌سازی داده‌های سفارش
    const orderData = {
      user: req.user.id,
      items: cart.items.map(i => ({
        product: i.product._id,
        quantity: i.quantity
      })),
      totalAmount,
      paymentMethod,
      paymentDetails,
      status: paymentMethod === 'whatsapp' ? 'pending' : 'pending'
    };

    // اگر روش واتساپ باشد، ساخت لینک
    if (paymentMethod === 'whatsapp') {
      const whatsappNumber = process.env.WHATSAPP_NUMBER || '+989000000000';
      let text = `سلام! من می‌خوام این سفارش رو ثبت کنم:\n`;
      cart.items.forEach(item => {
        text += `• ${item.product.name} × ${item.quantity}\n`;
      });
      text += `مبلغ کل: ${totalAmount.toLocaleString('fa-IR')} تومان`;
      const url = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
      orderData.whatsappOrderUrl = url;
    }

    // ذخیره سفارش
    const newOrder = new Order(orderData);
    await newOrder.save();

    // خالی کردن سبد
    cart.items = [];
    await cart.save();

    res.json({ msg: 'سفارش با موفقیت ثبت شد', order: newOrder });
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
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('خطای سرور');
  }
});

// @route   GET /api/orders/:id
// @desc    دریافت جزئیات یک سفارش (User only own orders / Admin can access any)
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order)
      return res.status(404).json({ msg: 'سفارش یافت نشد' });

    // اگر کاربر نقش admin نداشته باشد، باید مالک سفارش باشد
    if (req.user.role !== 'admin' && order.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'دسترسی کافی نیست' });
    }

    res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId')
      return res.status(404).json({ msg: 'سفارش یافت نشد' });
    res.status(500).send('خطای سرور');
  }
});

// @route   PUT /api/orders/:id/status
// @desc    به‌روزرسانی وضعیت سفارش (Admin only)
// @access  Private, Admin
const requireRole = require('../middleware/roles');
router.put('/:id/status', auth, requireRole('admin'), async (req, res) => {
  try {
    const { status } = req.body; // expects 'pending', 'completed', or 'cancelled'
    if (!['pending', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ msg: 'وضعیت نامعتبر است' });
    }

    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ msg: 'سفارش یافت نشد' });

    order.status = status;
    await order.save();
    res.json({ msg: 'وضعیت سفارش به‌روزرسانی شد', order });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId')
      return res.status(404).json({ msg: 'سفارش یافت نشد' });
    res.status(500).send('خطای سرور');
  }
});

module.exports = router;
