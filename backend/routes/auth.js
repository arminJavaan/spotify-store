const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcryptjs');

// @route   POST /api/auth/register
// @desc    ثبت‌نام کاربر جدید
// @access  Public
router.post(
  '/register',
  [
    check('name', 'نام و نام خانوادگی الزامی‌ست').notEmpty(),
    check('email', 'ایمیل معتبر وارد کنید').isEmail(),
    check('password', 'حداقل ۶ کاراکتر برای رمز نیاز است').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user)
        return res.status(400).json({ msg: 'کاربری با این ایمیل وجود دارد' });

      user = new User({ name, email, password });
      await user.save();

      const payload = {
        user: {
          id: user.id,
          role: user.role
        }
      };
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
  }
);

// @route   POST /api/auth/login
// @desc    ورود کاربر و دریافت توکن
// @access  Public
router.post(
  '/login',
  [
    check('email', 'ایمیل معتبر وارد کنید').isEmail(),
    check('password', 'رمز عبور الزامی‌ست').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({ msg: 'ایمیل یا رمز عبور اشتباه است' });

      const isMatch = await user.comparePassword(password);
      if (!isMatch)
        return res.status(400).json({ msg: 'ایمیل یا رمز عبور اشتباه است' });

      const payload = {
        user: {
          id: user.id,
          role: user.role
        }
      };
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
  }
);

// @route   GET /api/auth/me
// @desc    اطلاعات کاربر لاگین کرده
// @access  Private
const auth = require('../middleware/auth');
router.get('/me', auth, async (req, res) => {
  try {
    const user = req.userData; // fetched in auth middleware
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('خطای سرور');
  }
});

module.exports = router;
