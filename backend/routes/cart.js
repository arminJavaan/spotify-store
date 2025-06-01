// backend/routes/cart.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @route   GET /api/cart
// @desc    دریافت سبد خرید کاربر لاگین کرده
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) {
      // اگر سبد وجود ندارد، یک داکیومنت خالی بسازید
      cart = new Cart({ user: req.user.id, items: [] });
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('خطای سرور');
  }
});

// @route   POST /api/cart
// @desc    اضافه کردن یا افزایش تعداد یک آیتم به سبد
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }
    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ product: productId, quantity: 1 });
    }
    await cart.save();
    cart = await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('خطای سرور');
  }
});

// @route   PUT /api/cart
// @desc    به‌روزرسانی تعداد آیتم (مثلاً با body: { productId, quantity })
// @access  Private
router.put('/', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(400).json({ msg: 'سبد خرید یافت نشد' });

    const item = cart.items.find(item => item.product.toString() === productId);
    if (!item) return res.status(400).json({ msg: 'آیتم در سبد یافت نشد' });

    // اگر کم‌تر یا مساوی ۰ شد، حذف می‌کنیم
    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i.product.toString() !== productId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    cart = await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('خطای سرور');
  }
});

// @route   DELETE /api/cart/:productId
// @desc    حذف کامل یک آیتم از سبد
// @access  Private
router.delete('/:productId', auth, async (req, res) => {
  try {
    const productId = req.params.productId;
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(400).json({ msg: 'سبد خرید یافت نشد' });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    cart = await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('خطای سرور');
  }
});

module.exports = router;
