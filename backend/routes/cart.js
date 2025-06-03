// backend/routes/cart.js

import express from 'express';
const router = express.Router();

import mongoose from 'mongoose';
import { check, validationResult } from 'express-validator';
import authMiddleware from '../middleware/auth.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// GET /api/cart
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.product');
    if (!user) return res.status(404).json({ msg: 'کاربر یافت نشد.' });
    return res.json({ items: user.cart });
  } catch (err) {
    console.error('Error in GET /api/cart:', err);
    return res.status(500).json({ msg: 'خطای سرور' });
  }
});

// POST /api/cart
router.post(
  '/',
  [
    authMiddleware,
    check('productId', 'شناسه محصول معتبر نیست').isMongoId()
  ],
  async (req, res) => {
    console.log('--- وارد POST /api/cart شدم ---');
    console.log('req.user:', req.user);
    console.log('req.body:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { productId } = req.body;
      console.log('productId to add:', productId);

      const product = await Product.findById(productId);
      console.log('found product:', product);
      if (!product) {
        console.log('محصول پیدا نشد.');
        return res.status(404).json({ msg: 'محصول یافت نشد.' });
      }

      const user = await User.findById(req.user.id);
      console.log('found user:', user);
      if (!user) {
        console.log('کاربر پیدا نشد.');
        return res.status(404).json({ msg: 'کاربر یافت نشد.' });
      }

      console.log('current user.cart:', user.cart);

      const existingIndex = user.cart.findIndex(item =>
        item.product.toString() === productId
      );
      console.log('existingIndex:', existingIndex);

      if (existingIndex !== -1) {
        user.cart[existingIndex].quantity += 1;
      } else {
        user.cart.push({ product: new mongoose.Types.ObjectId(productId), quantity: 1 });
      }

      await user.save();
      await user.populate('cart.product');
      console.log('updated cart:', user.cart);

      return res.json({ items: user.cart });
    } catch (err) {
      console.error('Error in POST /api/cart:', err);
      return res.status(500).json({ msg: 'خطای سرور' });
    }
  }
);

// PUT /api/cart
router.put(
  '/',
  [
    authMiddleware,
    check('productId', 'شناسه محصول معتبر نیست').isMongoId(),
    check('quantity', 'کمیت نامعتبر است').isInt({ min: 0 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { productId, quantity } = req.body;
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ msg: 'کاربر یافت نشد.' });

      const index = user.cart.findIndex(item =>
        item.product.toString() === productId
      );
      if (index === -1) return res.status(404).json({ msg: 'این محصول در سبد وجود ندارد.' });

      if (quantity <= 0) {
        user.cart.splice(index, 1);
      } else {
        user.cart[index].quantity = quantity;
      }

      await user.save();
      await user.populate('cart.product');
      return res.json({ items: user.cart });
    } catch (err) {
      console.error('Error in PUT /api/cart:', err);
      return res.status(500).json({ msg: 'خطای سرور' });
    }
  }
);

// DELETE /api/cart/:productId
router.delete('/:productId', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId))
      return res.status(400).json({ msg: 'شناسه محصول نامعتبر است.' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'کاربر یافت نشد.' });

    user.cart = user.cart.filter(item =>
      item.product.toString() !== productId
    );

    await user.save();
    await user.populate('cart.product');
    return res.json({ items: user.cart });
  } catch (err) {
    console.error('Error in DELETE /api/cart/:productId:', err);
    return res.status(500).json({ msg: 'خطای سرور' });
  }
});

export default router;
