import express from 'express';
const router = express.Router();

import auth from '../middleware/auth.js';
import DiscountCode from '../models/DiscountCode.js';

// @route   GET /api/discounts/me
// @desc    دریافت یا ایجاد خودکارِ کد تخفیفِ شخصی ۱۵٪ برای کاربر و برگرداندن آمارِ آن
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    let personal = await DiscountCode.findOne({
      owner: req.user.id,
      type: 'personal'
    });

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

    const usedCount = personal.uses;
    let nextReward70 = 5 - (usedCount % 5);
    let nextFree = 10 - (usedCount % 10);

    // اگر دقیقا به 5 یا 10 رسید، کد جدید بساز و ریست کن
    const now = new Date();
    const fortyDaysLater = new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000);

    if (usedCount > 0 && usedCount % 5 === 0) {
      const hasReward = await DiscountCode.findOne({
        owner: req.user.id,
        type: 'reward70',
        createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // طی 1 روز گذشته
      });
      if (!hasReward) {
        await DiscountCode.create({
          code: Math.random().toString(36).substr(2, 8).toUpperCase(),
          owner: req.user.id,
          uses: 0,
          active: true,
          generatedBySystem: true,
          type: 'reward70',
          expiresAt: fortyDaysLater
        });
        personal.uses = 0;
        await personal.save();
      }
    }

    if (usedCount > 0 && usedCount % 10 === 0) {
      const hasFree = await DiscountCode.findOne({
        owner: req.user.id,
        type: 'freeAccount',
        createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      });
      if (!hasFree) {
        await DiscountCode.create({
          code: Math.random().toString(36).substr(2, 8).toUpperCase(),
          owner: req.user.id,
          uses: 0,
          active: true,
          generatedBySystem: true,
          type: 'freeAccount',
          expiresAt: fortyDaysLater
        });
        personal.uses = 0;
        await personal.save();
      }
    }

    const codes = await DiscountCode.find({ owner: req.user.id }).sort({ createdAt: -1 });

    const reward70Count = codes.filter((c) => c.type === 'reward70').length;
    const freeCount = codes.filter((c) => c.type === 'freeAccount').length;

    return res.json({
      code: personal.code,
      uses: personal.uses,
      nextReward70,
      nextFree,
      reward70Count,
      freeCount,
      codes
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

    if (dc.type === 'reward70' || dc.type === 'freeAccount') {
      if (dc.owner.toString() !== req.user.id) {
        return res.status(400).json({
          valid: false,
          msg: 'این کد فقط توسط صاحب آن قابل استفاده است'
        });
      }
    } else {
      if (dc.owner.toString() === req.user.id && dc.type === 'personal') {
        return res.status(400).json({
          valid: false,
          msg: 'نمیتوانید از کد تخفیف خودتان استفاده کنید'
        });
      }
    }

    if (dc.type === 'personal') return res.json({ valid: true, percentage: 15 });
    if (dc.type === 'reward70') return res.json({ valid: true, percentage: 70 });
    if (dc.type === 'freeAccount') return res.json({ valid: true, percentage: 100, freeAccount: true });
    if (dc.type === 'custom' && dc.percentage) return res.json({ valid: true, percentage: dc.percentage });

    return res.status(400).json({ valid: false, msg: 'کد غیرقابل قبول است' });
  } catch (err) {
    console.error('Error in GET /discounts/verify/:code:', err);
    return res.status(500).json({ msg: 'خطا در اعتبارسنجی کد' });
  }
});

export default router;
