// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');

// @route   POST /api/auth/register
// @desc    ثبت‌نام کاربر جدید
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // ۱. بررسی کنید ایمیل از قبل وجود ندارد
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'این ایمیل قبلا ثبت شده است' });
    }

    // ۲. ساخت کاربر جدید
    user = new User({ name, email, password });

    // ۳. هش کردن پسورد
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // ۴. ذخیره در DB
    await user.save();

    // ۵. تولید JWT و ارسال به فرانت
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('خطای سرور');
  }
});

// @route   POST /api/auth/login
// @desc    لاگین کاربر
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // ۱. بررسی وجود کاربر
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'ایمیل یا رمز عبور اشتباه است' });
    }

    // ۲. مقایسه پسورد
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'ایمیل یا رمز عبور اشتباه است' });
    }

    // ۳. تولید JWT
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('خطای سرور');
  }
});

module.exports = router;
