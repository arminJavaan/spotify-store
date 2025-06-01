// backend/routes/cart.js

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { check, validationResult } = require('express-validator')
const authMiddleware = require('../middleware/auth') // تغییر مسیر به auth.js
const Product = require('../models/Product')
const User = require('../models/User')

// GET /api/cart
// دریافت آیتم‌های سبد برای کاربر لاگین‌شده
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId).populate('cart.product')
    if (!user) {
      return res.status(404).json({ msg: 'کاربر یافت نشد.' })
    }
    return res.json({ items: user.cart })
  } catch (err) {
    console.error('Error in GET /api/cart:', err)
    return res.status(500).json({ msg: 'خطای سرور' })
  }
})

// POST /api/cart
// افزودن محصول یا افزایش کمیت در سبد
router.post(
  '/',
  [
    authMiddleware,
    check('productId', 'شناسه محصول معتبر نیست').isMongoId(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    try {
      const userId = req.user.id
      const { productId } = req.body

      // بررسی موجود بودن محصول
      const product = await Product.findById(productId)
      if (!product) {
        return res.status(404).json({ msg: 'محصول یافت نشد.' })
      }

      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({ msg: 'کاربر یافت نشد.' })
      }

      // اگر محصول قبلاً در سبد هست، کمیت را افزایش بده
      const existingIndex = user.cart.findIndex((item) =>
        item.product.toString() === productId
      )

      if (existingIndex !== -1) {
        // افزایش کمیت
        user.cart[existingIndex].quantity += 1
      } else {
        // افزودن آیتم جدید
        user.cart.push({ product: mongoose.Types.ObjectId(productId), quantity: 1 })
      }

      await user.save()
      await user.populate('cart.product')
      return res.json({ items: user.cart })
    } catch (err) {
      console.error('Error in POST /api/cart:', err)
      return res.status(500).json({ msg: 'خطای سرور' })
    }
  }
)

// PUT /api/cart
// آپدیت کمیت آیتم (در صورت صفر یا منفی، آیتم حذف می‌شود)
router.put(
  '/',
  [
    authMiddleware,
    check('productId', 'شناسه محصول معتبر نیست').isMongoId(),
    check('quantity', 'کمیت نامعتبر است').isInt({ min: 0 }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    try {
      const userId = req.user.id
      const { productId, quantity } = req.body

      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({ msg: 'کاربر یافت نشد.' })
      }

      const index = user.cart.findIndex((item) =>
        item.product.toString() === productId
      )
      if (index === -1) {
        return res.status(404).json({ msg: 'این محصول در سبد وجود ندارد.' })
      }

      if (quantity <= 0) {
        // حذف آیتم
        user.cart.splice(index, 1)
      } else {
        // تنظیم کمیت جدید
        user.cart[index].quantity = quantity
      }

      await user.save()
      await user.populate('cart.product')
      return res.json({ items: user.cart })
    } catch (err) {
      console.error('Error in PUT /api/cart:', err)
      return res.status(500).json({ msg: 'خطای سرور' })
    }
  }
)

// DELETE /api/cart/:productId
// حذف کامل یک آیتم از سبد
router.delete('/:productId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id
    const { productId } = req.params

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ msg: 'شناسه محصول نامعتبر است.' })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ msg: 'کاربر یافت نشد.' })
    }

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    )

    await user.save()
    await user.populate('cart.product')
    return res.json({ items: user.cart })
  } catch (err) {
    console.error('Error in DELETE /api/cart/:productId:', err)
    return res.status(500).json({ msg: 'خطای سرور' })
  }
})

module.exports = router
