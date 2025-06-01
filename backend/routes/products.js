// backend/routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// @route   GET /api/products
// @desc    دریافت لیست همه‌ی محصولات
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('خطای سرور');
  }
});

// @route   POST /api/products
// @desc    اضافه کردن محصول جدید (در صورت نیاز UID ادمین یا محدودیت)
// @access  Public (برای تست) یا می‌توانید محدودش کنید
router.post('/', async (req, res) => {
  const { name, price, duration, maxDevices, description, logoUrl } = req.body;
  try {
    const product = new Product({
      name,
      price,
      duration,
      maxDevices,
      description,
      logoUrl
    });
    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('خطای سرور');
  }
});

module.exports = router;
