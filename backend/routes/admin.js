// backend/routes/admin.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/roles');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const multer = require('multer');
const path = require('path');

// ============================================
// تنظیمات multer برای ذخیره فایل‌ها در uploads/
// ============================================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    // filename را با timestamp و نام اصلی فایل می‌سازیم تا یکتا شود
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/\s+/g, '_');
    const filename = `${basename}_${Date.now()}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // حداکثر 2 مگابایت (اختیاری)
  },
  fileFilter: function (req, file, cb) {
    // فقط تصاویر مجاز است
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('لطفاً فقط یک تصویر آپلود کنید.'));
    }
    cb(null, true);
  }
});

// همه مسیرهای admin با auth و requireRole('admin')
router.use(auth, requireRole('admin'));

// -------------------------------
// مدیریت محصولات (Products)
// -------------------------------

// GET /api/admin/products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('خطای سرور');
  }
});

// POST /api/admin/products
// اینجا upload.single('banner') داریم تا فایل فرم‌دیتای key='banner' را دریافت کند
router.post('/products', upload.single('banner'), async (req, res) => {
  try {
    // در فرم‌دیتا فیلدهای متنی (name, description, price, maxDevices, duration) هستند
    const { name, description, price, maxDevices, duration } = req.body;

    // بررسی‌های اولیه
    if (!name || !description || !price || !maxDevices || !duration) {
      return res.status(400).json({ msg: 'لطفاً همه فیلدها را تکمیل کنید.' });
    }
    if (!req.file) {
      return res.status(400).json({ msg: 'لطفاً یک تصویر بنر آپلود کنید.' });
    }

    // مسیر فایل آپلودشده:
    const bannerUrl = `/uploads/${req.file.filename}`;

    const newProduct = new Product({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      maxDevices: Number(maxDevices),
      duration: duration.trim(),
      bannerUrl
    });

    const saved = await newProduct.save();
    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).send('خطای سرور');
  }
});

// PUT /api/admin/products/:id
// برای ویرایش هم از upload.single استفاده می‌کنیم، اما اگر فایل ارسال نشد، bannerUrl تغییر نمی‌کند
router.put('/products/:id', upload.single('banner'), async (req, res) => {
  try {
    const { name, description, price, maxDevices, duration } = req.body;
    const updatedFields = {};

    if (name) updatedFields.name = name.trim();
    if (description) updatedFields.description = description.trim();
    if (price) updatedFields.price = Number(price);
    if (maxDevices) updatedFields.maxDevices = Number(maxDevices);
    if (duration) updatedFields.duration = duration.trim();
    if (req.file) {
      // اگر فایل جدید آپلود شد، مسیر آن را در bannerUrl ذخیره کن
      updatedFields.bannerUrl = `/uploads/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ msg: 'محصول یافت نشد' });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'محصول یافت نشد' });
    }
    res.status(500).send('خطای سرور');
  }
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'محصول یافت نشد' });
    }
    await product.remove();
    res.json({ msg: 'محصول حذف شد' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'محصول یافت نشد' });
    }
    res.status(500).send('خطای سرور');
  }
});


// -------------------------------
// 3. مدیریت سفارش‌ها (Orders)
// -------------------------------

// GET /api/admin/orders
// دریافت همه سفارش‌ها (ادمین می‌تواند همه را ببیند)
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('خطای سرور');
  }
});

// PUT /api/admin/orders/:id/status
// ویرایش وضعیت سفارش (کد آن قبلاً در routes/orders.js قرار دارد، اینجا صرفاً mirror است)
router.put('/orders/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ msg: 'وضعیت نامعتبر است' });
  }
  try {
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
