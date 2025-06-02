// backend/routes/discounts.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const DiscountCode = require('../models/DiscountCode');

// @route   GET /api/discounts/me
// @desc    دریافت یا ایجاد خودکارِ کد تخفیفِ شخصی ۱۵٪ برای کاربر و برگرداندن آمارِ آن
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // 1) بررسی وجود کدِ شخصی برای کاربر
    let personal = await DiscountCode.findOne({
      owner: req.user.id,
      type: 'personal'
    });

    // 2) اگر وجود نداشت، اولین بار بسازیم:
    if (!personal) {
      const newCode = Math.random().toString(36).substr(2, 8).toUpperCase();
      personal = await DiscountCode.create({
        code: newCode,
        owner: req.user.id,
        uses: 0,
        active: true,
        generatedBySystem: true,
        type: 'personal'
      });
    }

    // 3) آمار استفاده:
    const usedCount = personal.uses;

    // 4) “تا ۷۰٪ بعدی”: (۵ بار استفاده از personal → یک کد reward70)
    const nextReward70 = usedCount < 5 ? 5 - usedCount : 0;

    // 5) “تا اکانت رایگان بعدی”: (۱۰ بار استفاده از personal → یک کد freeAccount)
    const nextFree = usedCount < 10 ? 10 - usedCount : 0;

    // 6) آمار تعداد اکانت‌های رایگانِ استفاده‌شده توسط این کاربر
    const freeCount = await DiscountCode.countDocuments({
      owner: req.user.id,
      type: 'freeAccount'
    });

    // 7) آمار تعداد کدهای reward70 که سیستم برای این کاربر تولید کرده
    const reward70Count = await DiscountCode.countDocuments({
      owner: req.user.id,
      type: 'reward70'
    });

    // 8) در نهایت اطلاعات زیر را ارسال می‌کنیم:
    return res.json({
      code: personal.code,
      uses: usedCount,
      nextReward70,
      nextFree,
      freeCount,
      reward70Count
    });
  } catch (err) {
    console.error('Error in GET /discounts/me:', err);
    return res.status(500).json({ msg: 'خطا در دریافت اطلاعات کد تخفیف' });
  }
});

// @route   GET /api/discounts/verify/:code
// @desc    اعتبارسنجی یک کدِ تخفیف قبل از خرید (برای نمایش تخفیف روی UI)
// @access  Private
router.get('/verify/:code', auth, async (req, res) => {
  try {
    const { code } = req.params;
    const dc = await DiscountCode.findOne({ code, active: true });

    if (!dc) {
      return res.status(404).json({ valid: false, msg: 'کد معتبر نیست یا غیرفعال شده' });
    }

    if (dc.owner.toString() === req.user.id) {
      return res
        .status(400)
        .json({ valid: false, msg: 'نمیتوانید از کد تخفیف خودتان استفاده کنید' });
    }

    if (dc.type === 'personal') {
      return res.json({ valid: true, percentage: 15 });
    }
    if (dc.type === 'reward70') {
      return res.json({ valid: true, percentage: 70 });
    }
    if (dc.type === 'freeAccount') {
      return res.json({ valid: true, percentage: 100, freeAccount: true });
    }

    return res.status(400).json({ valid: false, msg: 'کد غیرقابل قبول است' });
  } catch (err) {
    console.error('Error in GET /discounts/verify/:code:', err);
    return res.status(500).json({ msg: 'خطا در اعتبارسنجی کد' });
  }
});

module.exports = router;
