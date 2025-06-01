const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/roles');

// @route   POST /api/products
// @desc    ایجاد محصول جدید (Admin only)
// @access  Private, Admin
router.post(
  '/',
  [
    auth,
    requireRole('admin'),
    check('name', 'نام محصول الزامی‌ست').notEmpty(),
    check('logoUrl', 'لینک لوگو الزامی‌ست').isURL(),
    check('description', 'شرح محصول الزامی‌ست').notEmpty(),
    check('price', 'قیمت باید عدد باشد').isNumeric(),
    check('maxDevices', 'حداکثر دستگاه عدد باشد').isInt({ min: 1 }),
    check('duration', 'مدت اشتراک الزامی‌ست').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { name, logoUrl, description, price, maxDevices, duration } = req.body;
      const newProduct = new Product({ name, logoUrl, description, price, maxDevices, duration });
      const saved = await newProduct.save();
      res.json(saved);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('خطای سرور');
    }
  }
);

// @route   GET /api/products
// @desc    دریافت لیست همه‌ی محصولات
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('خطای سرور');
  }
});

// @route   GET /api/products/:id
// @desc    دریافت یک محصول بر اساس آی‌دی
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ msg: 'محصول یافت نشد' });

    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId')
      return res.status(404).json({ msg: 'محصول یافت نشد' });
    res.status(500).send('خطای سرور');
  }
});

// @route   PUT /api/products/:id
// @desc    ویرایش محصول (Admin only)
// @access  Private, Admin
router.put(
  '/:id',
  [
    auth,
    requireRole('admin'),
    check('name', 'نام محصول الزامی‌ست').optional().notEmpty(),
    check('logoUrl', 'لینک لوگو باید URL باشد').optional().isURL(),
    check('description', 'شرح محصول الزامی‌ست').optional().notEmpty(),
    check('price', 'قیمت باید عدد باشد').optional().isNumeric(),
    check('maxDevices', 'حداکثر دستگاه عدد باشد').optional().isInt({ min: 1 }),
    check('duration', 'مدت اشتراک الزامی‌ست').optional().notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const updatedFields = {};
      const fields = ['name', 'logoUrl', 'description', 'price', 'maxDevices', 'duration'];
      fields.forEach(f => {
        if (req.body[f] !== undefined) updatedFields[f] = req.body[f];
      });

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: updatedFields },
        { new: true }
      );

      if (!product)
        return res.status(404).json({ msg: 'محصول یافت نشد' });

      res.json(product);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId')
        return res.status(404).json({ msg: 'محصول یافت نشد' });
      res.status(500).send('خطای سرور');
    }
  }
);

// @route   DELETE /api/products/:id
// @desc    حذف محصول (Admin only)
// @access  Private, Admin
router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ msg: 'محصول یافت نشد' });

    await product.remove();
    res.json({ msg: 'محصول با موفقیت حذف شد' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId')
      return res.status(404).json({ msg: 'محصول یافت نشد' });
    res.status(500).send('خطای سرور');
  }
});

module.exports = router;
