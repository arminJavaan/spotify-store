import express from "express";
const router = express.Router();

import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import dotenv from "dotenv";
dotenv.config();

import auth from "../middleware/auth.js";
import User from "../models/User.js";
import DiscountCode from "../models/DiscountCode.js";
import Wallet from "../models/Wallet.js";
import { sendSMSCode, verifySMSCode } from "../utils/sms.js";

// @route   POST /api/auth/register
router.post(
  "/register",
  [
    check("name", "نام الزامی‌ست").notEmpty(),
    check("email", "لطفاً ایمیل معتبر وارد کنید").isEmail(),
    check("password", "پسورد حداقل 6 کاراکتر باشد").isLength({ min: 6 }),
    check("phone", "شماره تلفن الزامی‌ست").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password, phone } = req.body;

    try {
      let existingEmail = await User.findOne({
        email: email.toLowerCase().trim(),
      });
      let existingPhone = await User.findOne({ phone: phone.trim() });

      if (existingEmail)
        return res.status(400).json({ msg: "این ایمیل قبلاً ثبت‌نام شده است" });
      if (existingPhone)
        return res
          .status(400)
          .json({ msg: "این شماره موبایل قبلاً استفاده شده است" });

      let user = new User({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        phone: phone.trim(),
        isVerified: false,
      });

      await user.save();

      const wallet = new Wallet({
        user: user._id,
        balance: 0,
        transactions: [],
      });
      await wallet.save();

      user.wallet = wallet._id;
      await user.save();

      const personalCode = Math.random()
        .toString(36)
        .substr(2, 8)
        .toUpperCase();
      await DiscountCode.create({
        code: personalCode,
        owner: user._id,
        uses: 0,
        active: true,
        generatedBySystem: true,
        type: "personal",
      });

      const payload = { user: { id: user.id, role: user.role } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.json({ token, personalCode });
    } catch (err) {
      console.error("Error in POST /auth/register:", err);
      return res.status(500).json({ msg: "خطا در سرور" });
    }
  }
);

// @route   POST /api/auth/send-code
router.post(
  "/send-code",
  [
    check("phone", "شماره موبایل الزامی است").notEmpty(),
    check("phone", "شماره موبایل معتبر نیست").matches(/^09\d{9}$/),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("❌ Validation Errors:", errors.array()); // برای دیباگ
      return res.status(400).json({ errors: errors.array() });
    }

    const { phone } = req.body;
    console.log("📞 Phone received for SMS:", phone); // دیباگ

    console.log("BODY RECEIVED:", req.body);
    console.log("VALIDATION ERRORS:", validationResult(req).array());

    try {
      const result = await sendSMSCode(phone);
      res.status(result.success ? 200 : 400).json({ msg: result.Message });
    } catch (err) {
      console.error("❌ Error in /send-code:", err);
      res.status(500).json({ msg: "خطا در ارسال پیامک" });
    }
  }
);

// @route   POST /api/auth/verify-code
router.post(
  "/verify-code",
  [
    check("phone", "شماره موبایل الزامی است").notEmpty(),
    check("code", "کد تایید الزامی است").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { phone, code } = req.body;

    try {
      const result = await verifySMSCode(phone, code);
      if (!result.Success) {
        return res.status(400).json({ msg: result.Message });
      }

      const user = await User.findOne({ phone });
      if (!user) {
        return res.status(404).json({ msg: "کاربر با این شماره پیدا نشد" });
      }

      user.isVerified = true;
      await user.save();

      const payload = { user: { id: user.id, role: user.role } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.json({ msg: "احراز هویت موفق", token });
    } catch (err) {
      console.error("Error in POST /verify-code:", err);
      return res.status(500).json({ msg: "خطا در سرور" });
    }
  }
);

// @route   POST /api/auth/login
router.post(
  "/login",
  [
    check("email", "لطفاً ایمیل معتبر وارد کنید").isEmail(),
    check("password", "پسورد الزامی‌ست").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user)
        return res.status(400).json({ msg: "اطلاعات ورود نادرست است" });

      const isMatch = await user.comparePassword(password);
      if (!isMatch)
        return res.status(400).json({ msg: "اطلاعات ورود نادرست است" });

      if (!user.isVerified) {
        return res
          .status(403)
          .json({ msg: "برای ورود ابتدا شماره خود را تأیید کنید." });
      }

      const payload = { user: { id: user.id, role: user.role } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.json({ token });
    } catch (err) {
      console.error("Error in POST /auth/login:", err);
      return res.status(500).json({ msg: "خطا در سرور" });
    }
  }
);

// @route   GET /api/auth/me
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "کاربر یافت نشد" });
    return res.json(user);
  } catch (err) {
    console.error("Error in GET /auth/me:", err);
    return res.status(500).json({ msg: "خطا در سرور" });
  }
});

// @route   PUT /api/auth/profile
router.put(
  "/profile",
  auth,
  [
    check("name", "نام الزامی‌ست").optional().notEmpty(),
    check("email", "لطفاً ایمیل معتبر وارد کنید").optional().isEmail(),
    check("password", "پسورد حداقل 6 کاراکتر باشد")
      .optional()
      .isLength({ min: 6 }),
    check("phone", "شماره تلفن الزامی‌ست").optional().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password, phone } = req.body;

    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ msg: "کاربر یافت نشد" });

      if (name) user.name = name.trim();
      if (email) user.email = email.toLowerCase().trim();
      if (phone) user.phone = phone.trim();
      if (password) user.password = password;

      await user.save();
      const updatedUser = await User.findById(req.user.id).select("-password");
      return res.json(updatedUser);
    } catch (err) {
      console.error("Error in PUT /auth/profile:", err);
      if (err.code === 11000 && err.keyPattern.email) {
        return res.status(400).json({ msg: "این ایمیل قبلاً استفاده شده است" });
      }
      return res.status(500).json({ msg: "خطا در به‌روزرسانی پروفایل" });
    }
  }
);

export default router;
