import express from "express";
const router = express.Router();

import auth from "../middleware/auth.js";
import DiscountCode from "../models/DiscountCode.js";

// GET /api/discounts/me
router.get("/me", auth, async (req, res) => {
  try {
    let personal = await DiscountCode.findOne({
      owner: req.user.id,
      type: "personal",
    });
    if (!personal) {
      const newCode = Math.random().toString(36).substr(2, 8).toUpperCase();
      personal = await DiscountCode.create({
        code: newCode,
        owner: req.user.id,
        uses: 0,
        active: true,
        generatedBySystem: true,
        type: "personal",
      });
    }

    const usedCount = personal.uses;
    const nextReward70 = 5 - (usedCount % 5);
    const nextFree = 10 - (usedCount % 10);
    const now = new Date();
    const expiry = new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000);

    if (usedCount > 0 && usedCount % 5 === 0) {
      const recentReward = await DiscountCode.findOne({
        owner: req.user.id,
        type: "reward70",
        createdAt: { $gt: new Date(Date.now() - 86400000) },
      });
      if (!recentReward) {
        await DiscountCode.create({
          code: Math.random().toString(36).substr(2, 8).toUpperCase(),
          owner: req.user.id,
          uses: 0,
          active: true,
          generatedBySystem: true,
          type: "reward70",
          expiresAt: expiry,
        });
        personal.uses = 0;
        await personal.save();
      }
    }

    if (usedCount > 0 && usedCount % 10 === 0) {
      const recentFree = await DiscountCode.findOne({
        owner: req.user.id,
        type: "freeAccount",
        createdAt: { $gt: new Date(Date.now() - 86400000) },
      });
      if (!recentFree) {
        await DiscountCode.create({
          code: Math.random().toString(36).substr(2, 8).toUpperCase(),
          owner: req.user.id,
          uses: 0,
          active: true,
          generatedBySystem: true,
          type: "freeAccount",
          expiresAt: expiry,
        });
        personal.uses = 0;
        await personal.save();
      }
    }

    const codes = await DiscountCode.find({ owner: req.user.id }).sort({
      createdAt: -1,
    });
    const reward70Count = codes.filter((c) => c.type === "reward70").length;
    const freeCount = codes.filter((c) => c.type === "freeAccount").length;

    res.json({
      code: personal.code,
      uses: personal.uses,
      nextReward70,
      nextFree,
      reward70Count,
      freeCount,
      codes,
    });
  } catch (err) {
    console.error("Error in /discounts/me:", err);
    res.status(500).json({ msg: "خطا در دریافت اطلاعات کد تخفیف" });
  }
});

// GET /api/discounts/verify/:code
router.get("/verify/:code", auth, async (req, res) => {
  try {
    const dc = await DiscountCode.findOne({
      code: req.params.code,
      active: true,
    });
    if (!dc)
      return res
        .status(404)
        .json({ valid: false, msg: "کد معتبر نیست یا غیرفعال شده" });

    if (
      (dc.type === "reward70" || dc.type === "freeAccount") &&
      dc.owner.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ valid: false, msg: "این کد فقط برای شما قابل استفاده است" });
    }

    if (dc.type === "personal" && dc.owner.toString() === req.user.id) {
      return res
        .status(403)
        .json({
          valid: false,
          msg: "نمی‌توانید از کد تخفیف شخصی خودتان استفاده کنید",
        });
    }

    res.json({
      valid: true,
      code: dc.code,
      type: dc.type,
      percentage:
        dc.percentage ??
        (dc.type === "personal"
          ? 15
          : dc.type === "reward70"
            ? 70
            : dc.type === "freeAccount"
              ? 100
              : 0),
      freeAccount: dc.type === "freeAccount",
    });
  } catch (err) {
    console.error("Error in /discounts/verify:", err);
    res.status(500).json({ msg: "خطا در اعتبارسنجی کد" });
  }
});

export default router;
