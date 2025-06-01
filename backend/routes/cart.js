const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @route   GET /api/cart
// @desc    دریافت سبد خرید کاربر لاگین کرده
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) {
      // اگر سبد وجود ندارد، یکی بساز
      cart = new Cart({ user: req.user.id, items: [] });
      await cart.save();
      cart = await cart.populate('items.product');
    }
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('خطای سرور');
  }
});

// @route   POST /api/cart
// @desc    افزودن آیتم به سبد خرید یا افزایش تعداد
// @access  Private
router.post(
  '/',
  [
    auth,
    check('productId', 'شناسه محصول الزامی‌ست').isMongoId(),
    check('quantity', 'تعداد باید عدد بزرگ‌تر از ۰ باشد').isInt({ min: 1 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { productId, quantity } = req.body;
    try {
      const product = await Product.findById(productId);
      if (!product)
        return res.status(404).json({ msg: 'محصول یافت نشد' });

      let cart = await Cart.findOne({ user: req.user.id });
      if (!cart) {
        cart = new Cart({ user: req.user.id, items: [] });
      }

      const existingItem = cart.items.find(item => item.product.toString() === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
      cart = await cart.populate('items.product');
      res.json(cart);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('خطای سرور');
    }
  }
);

// @route   PUT /api/cart
// @desc    به‌روزرسانی تعداد آیتم‌های سبد (با body: { productId, quantity })
// @access  Private
router.put(
  '/',
  [
    auth,
    check('productId', 'شناسه محصول الزامی‌ست').isMongoId(),
    check('quantity', 'تعداد باید عدد باشد').isInt()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { productId, quantity } = req.body;
    try {
      let cart = await Cart.findOne({ user: req.user.id });
      if (!cart)
        return res.status(400).json({ msg: 'سبد خرید یافت نشد' });

      const item = cart.items.find(item => item.product.toString() === productId);
      if (!item)
        return res.status(400).json({ msg: 'آیتم در سبد یافت نشد' });

      if (quantity <= 0) {
        // اگر تعداد ۰ یا کمتر، حذف شود
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
  }
);

// @route   DELETE /api/cart/:productId
// @desc    حذف یک آیتم از سبد
// @access  Private
router.delete('/:productId', auth, async (req, res) => {
  try {
    const productId = req.params.productId;
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(400).json({ msg: 'سبد خرید یافت نشد' });

    cart.items = cart.items.filter(i => i.product.toString() !== productId);
    await cart.save();
    cart = await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('خطای سرور');
  }
});

// @route   DELETE /api/cart
// @desc    خالی کردن کل سبد
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(400).json({ msg: 'سبد خرید یافت نشد' });

    cart.items = [];
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('خطای سرور');
  }
});

module.exports = router;
