// backend/routes/discounts.js

const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const DiscountCode = require('../models/DiscountCode')

// @route   GET /api/discounts/me
// @desc    دریافت یا ایجاد خودکار کد شخصی ۱۵٪ برای کاربر و آمارِ آن
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // بررسی وجود کدِ شخصی برای کاربر
    let personal = await DiscountCode.findOne({
      owner: req.user.id,
      type: 'personal'
    })
    if (!personal) {
      // اگر وجود ندارد، بسازیم
      const newCode = Math.random().toString(36).substr(2, 8).toUpperCase()
      personal = await DiscountCode.create({
        code: newCode,
        owner: req.user.id,
        uses: 0,
        active: true,
        generatedBySystem: false,
        type: 'personal'
      })
    }

    // تعداد دفعات استفاده از کد شخصی
    const usedCount = personal.uses

    // چند تای بعدی مانده تا ۷۰٪؟
    const nextReward70 = usedCount < 5 ? 5 - usedCount : 0

    // چند تای بعدی مانده تا اکانت رایگان؟
    const nextFree = usedCount < 10 ? 10 - usedCount : 0

    // آمار تعداد اکانت‌های رایگان که تا کنون دریافت شده
    const freeCount = await DiscountCode.countDocuments({
      owner: req.user.id,
      type: 'freeAccount'
    })

    // آمار تعداد کدهای reward70 که سیستم برای این کاربر ایجاد کرده
    const reward70Count = await DiscountCode.countDocuments({
      owner: req.user.id,
      type: 'reward70'
    })

    return res.json({
      code: personal.code,
      uses: usedCount,
      nextReward70,
      nextFree,
      freeCount,
      reward70Count
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ msg: 'خطا در دریافت اطلاعات کد تخفیف' })
  }
})

// @route   GET /api/discounts/verify/:code
// @desc    اعتبارسنجی یک کدِ تخفیف قبل از خرید (برای نمایش تخفیف روی UI)
// @access  Private
router.get('/verify/:code', auth, async (req, res) => {
  try {
    const { code } = req.params
    const dc = await DiscountCode.findOne({ code, active: true })
    if (!dc) {
      return res.status(404).json({ valid: false, msg: 'کد معتبر نیست یا غیرفعال شده' })
    }
    if (dc.owner.toString() === req.user.id) {
      return res.status(400).json({ valid: false, msg: 'نمی‌توانید از کد تخفیف خودتان استفاده کنید' })
    }
    // فقط ۱۵٪ برای کد شخصی ⇒ ثابت است
    if (dc.type === 'personal') {
      return res.json({ valid: true, percentage: 15 })
    }
    // کد ۷۰٪ (تا زمانِ استفاده یک‌بار) ⇒ percentage: 70
    if (dc.type === 'reward70') {
      return res.json({ valid: true, percentage: 70 })
    }
    // کد freeAccount ⇒ درصد لحاظ نمی‌شود، فقط اعتبارسنجی
    if (dc.type === 'freeAccount') {
      return res.json({ valid: true, percentage: 100, freeAccount: true })
    }
    return res.status(400).json({ valid: false, msg: 'کد غیرقابل قبول است' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ msg: 'خطا در اعتبارسنجی کد' })
  }
})

module.exports = router
