// backend/routes/products.js

const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const Product = require('../models/Product')
const auth = require('../middleware/auth')
const requireRole = require('../middleware/roles')

router.post(
  '/',
  [
    auth,
    requireRole('admin'),
    check('name', 'نام محصول الزامی‌ست').notEmpty(),
    check('bannerUrl', 'لینک بنر باید URL باشد').isURL(),
    check('description', 'شرح محصول الزامی‌ست').notEmpty(),
    check('price', 'قیمت باید عدد باشد').isNumeric(),
    check('maxDevices', 'حداکثر دستگاه عدد باشد').isInt({ min: 1 }),
    check('duration', 'مدت اشتراک الزامی‌ست').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    try {
      const { name, bannerUrl, description, price, maxDevices, duration } = req.body
      const newProduct = new Product({
        name: name.trim(),
        bannerUrl: bannerUrl.trim(),
        description: description.trim(),
        price: Number(price),
        maxDevices: Number(maxDevices),
        duration: duration.trim()
      })
      const saved = await newProduct.save()
      return res.json(saved)
    } catch (err) {
      console.error(err.message)
      return res.status(500).json({ msg: 'خطای سرور' })
    }
  }
)

router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 })
    return res.json(products)
  } catch (err) {
    console.error(err.message)
    return res.status(500).json({ msg: 'خطای سرور' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ msg: 'محصول یافت نشد' })
    return res.json(product)
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'محصول یافت نشد' })
    return res.status(500).json({ msg: 'خطای سرور' })
  }
})

router.put(
  '/:id',
  [
    auth,
    requireRole('admin'),
    check('bannerUrl', 'لینک بنر باید URL باشد').optional().isURL(),
    check('price', 'قیمت باید عدد باشد').optional().isNumeric(),
    check('maxDevices', 'حداکثر دستگاه عدد باشد').optional().isInt({ min: 1 })
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    try {
      const updatedFields = {}
      const fields = ['name', 'bannerUrl', 'description', 'price', 'maxDevices', 'duration']
      fields.forEach(f => {
        if (req.body[f] !== undefined) {
          if (f === 'price' || f === 'maxDevices') {
            updatedFields[f] = Number(req.body[f])
          } else {
            updatedFields[f] = req.body[f].trim ? req.body[f].trim() : req.body[f]
          }
        }
      })

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: updatedFields },
        { new: true }
      )
      if (!product) return res.status(404).json({ msg: 'محصول یافت نشد' })
      return res.json(product)
    } catch (err) {
      console.error(err.message)
      if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'محصول یافت نشد' })
      return res.status(500).json({ msg: 'خطای سرور' })
    }
  }
)

router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ msg: 'محصول یافت نشد' })
    await product.remove()
    return res.json({ msg: 'محصول با موفقیت حذف شد' })
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'محصول یافت نشد' })
    return res.status(500).json({ msg: 'خطای سرور' })
  }
})

module.exports = router
