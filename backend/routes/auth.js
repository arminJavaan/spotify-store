// backend/routes/auth.js

const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const auth = require('../middleware/auth')
const User = require('../models/User')

// ------------------------------------------------------
// POST  /api/auth/register
//   ثبت‌نام کاربر جدید با name, email, password, phone
// ------------------------------------------------------
router.post(
  '/register',
  [
    check('name', 'نام الزامی‌ست').notEmpty(),
    check('email', 'لطفاً ایمیل معتبر وارد کنید').isEmail(),
    check('password', 'پسورد حداقل 6 کاراکتر باشد').isLength({ min: 6 }),
    check('phone', 'شماره تلفن الزامی‌ست').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password, phone } = req.body

    try {
      let user = await User.findOne({ email })
      if (user) {
        return res.status(400).json({ msg: 'این ایمیل قبلاً ثبت‌نام شده است' })
      }

      user = new User({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        phone: phone.trim()
      })

      await user.save()

      const payload = {
        user: {
          id: user.id,
          role: user.role
        }
      }

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '7d' },
        (err, token) => {
          if (err) throw err
          return res.json({ token })
        }
      )
    } catch (err) {
      console.error('Error in POST /auth/register:', err)
      return res.status(500).json({ msg: 'خطا در سرور' })
    }
  }
)

// ------------------------------------------------------
// POST  /api/auth/login
//   ورود کاربر با email + password
// ------------------------------------------------------
router.post(
  '/login',
  [
    check('email', 'لطفاً ایمیل معتبر وارد کنید').isEmail(),
    check('password', 'پسورد الزامی‌ست').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { email, password } = req.body

    try {
      const user = await User.findOne({ email: email.toLowerCase() })
      if (!user) {
        return res.status(400).json({ msg: 'اطلاعات ورود نادرست است' })
      }

      const isMatch = await user.comparePassword(password)
      if (!isMatch) {
        return res.status(400).json({ msg: 'اطلاعات ورود نادرست است' })
      }

      const payload = {
        user: {
          id: user.id,
          role: user.role
        }
      }

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '7d' },
        (err, token) => {
          if (err) throw err
          return res.json({ token })
        }
      )
    } catch (err) {
      console.error('Error in POST /auth/login:', err)
      return res.status(500).json({ msg: 'خطا در سرور' })
    }
  }
)

// ------------------------------------------------------
// GET  /api/auth/me
//   بازگرداندن اطلاعات کاربر فعلی (name, email, role, phone)
// ------------------------------------------------------
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) {
      return res.status(404).json({ msg: 'کاربر یافت نشد' })
    }
    return res.json(user)
  } catch (err) {
    console.error('Error in GET /auth/me:', err)
    return res.status(500).json({ msg: 'خطا در سرور' })
  }
})

// ------------------------------------------------------
// PUT  /api/auth/profile
//   به‌روزرسانی پروفایل خودِ کاربر (email, password, phone, name)
// ------------------------------------------------------
router.put(
  '/profile',
  auth,
  [
    check('name', 'نام الزامی‌ست').optional().notEmpty(),
    check('email', 'لطفاً ایمیل معتبر وارد کنید').optional().isEmail(),
    check('password', 'پسورد حداقل 6 کاراکتر باشد').optional().isLength({ min: 6 }),
    check('phone', 'شماره تلفن الزامی‌ست').optional().notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { name, email, password, phone } = req.body

    try {
      const user = await User.findById(req.user.id)
      if (!user) {
        return res.status(404).json({ msg: 'کاربر یافت نشد' })
      }

      if (name) user.name = name.trim()
      if (email) user.email = email.toLowerCase().trim()
      if (phone) user.phone = phone.trim()
      if (password) user.password = password // pre('save') آن را هش خواهد کرد

      await user.save()
      const updatedUser = await User.findById(req.user.id).select('-password')
      return res.json(updatedUser)
    } catch (err) {
      console.error('Error in PUT /auth/profile:', err)
      if (err.code === 11000 && err.keyPattern.email) {
        return res.status(400).json({ msg: 'این ایمیل قبلاً استفاده شده است' })
      }
      return res.status(500).json({ msg: 'خطا در به‌روزرسانی پروفایل' })
    }
  }
)

module.exports = router
