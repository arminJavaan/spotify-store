// backend/routes/admin.js

const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const requireRole = require('../middleware/roles')
const User = require('../models/User')
const Product = require('../models/Product')
const Order = require('../models/Order')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const DiscountCode = require('../models/DiscountCode')

// مطمئن می‌شویم که پوشهٔ uploads وجود دارد
const uploadsDir = path.join(__dirname, '../../frontend/uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

router.use(auth, requireRole('admin'))

router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalProducts = await Product.countDocuments()
    const totalOrders = await Order.countDocuments()
    return res.json({ totalUsers, totalProducts, totalOrders })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ msg: 'خطا در دریافت آمار' })
  }
})

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const basename = path.basename(file.originalname, ext).replace(/\s+/g, '_')
    const filename = `${basename}_${Date.now()}${ext}`
    cb(null, filename)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('لطفاً فقط یک تصویر آپلود کنید.'))
    }
    cb(null, true)
  }
})

router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 })
    return res.json(products)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ msg: 'خطا در دریافت محصولات' })
  }
})

router.post('/products', upload.single('banner'), async (req, res) => {
  try {
    const { name, description, price, maxDevices, duration } = req.body
    if (!name || !description || !price || !maxDevices || !duration)
      return res.status(400).json({ msg: 'لطفاً همه فیلدها را تکمیل کنید.' })
    if (!req.file) return res.status(400).json({ msg: 'لطفاً یک تصویر بنر آپلود کنید.' })

    // مسیر نسبت به فولدر استاتیک
    const bannerUrl = `/uploads/${req.file.filename}`
    const newProduct = new Product({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      maxDevices: Number(maxDevices),
      duration: duration.trim(),
      bannerUrl
    })
    const saved = await newProduct.save()
    return res.json(saved)
  } catch (err) {
    console.error('Error in POST /admin/products:', err)
    return res.status(500).json({ msg: 'خطا در ایجاد محصول' })
  }
})

router.put('/products/:id', upload.single('banner'), async (req, res) => {
  try {
    const { name, description, price, maxDevices, duration } = req.body
    const updatedFields = {}
    if (name) updatedFields.name = name.trim()
    if (description) updatedFields.description = description.trim()
    if (price) updatedFields.price = Number(price)
    if (maxDevices) updatedFields.maxDevices = Number(maxDevices)
    if (duration) updatedFields.duration = duration.trim()
    if (req.file) {
      updatedFields.bannerUrl = `/uploads/${req.file.filename}`
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    )
    if (!product) return res.status(404).json({ msg: 'محصول یافت نشد' })
    return res.json(product)
  } catch (err) {
    console.error('Error in PUT /admin/products/:id:', err)
    return res.status(500).json({ msg: 'خطا در به‌روزرسانی محصول' })
  }
})

router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ msg: 'محصول یافت نشد' })
    // حذف سند با متد deleteOne
    await product.deleteOne()
    return res.json({ msg: 'محصول حذف شد' })
  } catch (err) {
    console.error('Error in DELETE /admin/products/:id:', err)
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'محصول یافت نشد' })
    return res.status(500).json({ msg: 'خطا در حذف محصول' })
  }
})

router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ date: -1 })
    return res.json(users)
  } catch (err) {
    console.error('Error in GET /api/admin/users:', err)
    return res.status(500).json({ msg: 'خطا در دریافت کاربران' })
  }
})

router.put('/users/:id/role', async (req, res) => {
  const { role } = req.body
  if (!['user', 'admin'].includes(role))
    return res.status(400).json({ msg: 'نقش نامعتبر است' })

  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ msg: 'کاربر یافت نشد' })
    user.role = role
    await user.save()
    return res.json({
      msg: 'نقش کاربر به‌روزرسانی شد',
      user: { id: user.id, name: user.name, email: user.email, role }
    })
  } catch (err) {
    console.error(err)
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'کاربر یافت نشد' })
    return res.status(500).json({ msg: 'خطا در تغییر نقش کاربر' })
  }
})

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ msg: 'کاربر یافت نشد' })
    await user.deleteOne()
    return res.json({ msg: 'کاربر حذف شد' })
  } catch (err) {
    console.error(err)
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'کاربر یافت نشد' })
    return res.status(500).json({ msg: 'خطا در حذف کاربر' })
  }
})

router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 })
    return res.json(orders)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ msg: 'خطا در دریافت سفارش‌ها' })
  }
})

router.put('/orders/:id/status', async (req, res) => {
  const { status } = req.body
  if (!['pending', 'completed', 'cancelled'].includes(status))
    return res.status(400).json({ msg: 'وضعیت نامعتبر است' })

  try {
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ msg: 'سفارش یافت نشد' })
    order.status = status
    await order.save()
    return res.json({ msg: 'وضعیت سفارش به‌روزرسانی شد', order })
  } catch (err) {
    console.error(err)
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'سفارش یافت نشد' })
    return res.status(500).json({ msg: 'خطا در به‌روزرسانی وضعیت سفارش' })
  }
})


// ============ بخش مدیریت کدهای تخفیف =================

// @route   GET /api/admin/discounts
// @desc    لیست همهٔ کدهای تخفیف (شخصی، ۷۰٪، اکانت رایگان)
// @access  Private, Admin
router.get('/discounts', async (req, res) => {
  try {
    const list = await DiscountCode.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
    return res.json(list)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ msg: 'خطا در دریافت لیست کدهای تخفیف' })
  }
})

// @route   PUT /api/admin/discounts/:code/activate
// @desc    فعال‌سازی یک کدِ تخفیف
// @access  Private, Admin
router.put('/discounts/:code/activate', async (req, res) => {
  try {
    const dc = await DiscountCode.findOne({ code: req.params.code })
    if (!dc) return res.status(404).json({ msg: 'کد پیدا نشد' })
    dc.active = true
    await dc.save()
    return res.json({ msg: 'کد فعال شد', discount: dc })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ msg: 'خطا در فعال‌سازی کد' })
  }
})

// @route   PUT /api/admin/discounts/:code/deactivate
// @desc    غیرفعال‌سازی یک کدِ تخفیف
// @access  Private, Admin
router.put('/discounts/:code/deactivate', async (req, res) => {
  try {
    const dc = await DiscountCode.findOne({ code: req.params.code })
    if (!dc) return res.status(404).json({ msg: 'کد پیدا نشد' })
    dc.active = false
    await dc.save()
    return res.json({ msg: 'کد غیرفعال شد', discount: dc })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ msg: 'خطا در غیرفعال‌سازی کد' })
  }
})

// ============ پایان بخش مدیریت کدهای تخفیف ================


module.exports = router
