// backend/routes/wallet.js

import express from "express";
const router = express.Router();

import auth from "../middleware/auth.js";
import Wallet from "../models/Wallet.js";
import WalletTopupRequest from "../models/WalletTopupRequest.js";
import requireRole from "../middleware/roles.js";

// @route   GET /api/wallet
// @desc    دریافت موجودی و تراکنش‌ها (کاربر لاگین‌شده)
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet)
      return res.status(404).json({ msg: "کیف پول شما یافت نشد" });

    return res.json({
      balance: wallet.balance,
      transactions: wallet.transactions.reverse(),
    });
  } catch (err) {
    console.error("GET /wallet error:", err);
    return res.status(500).json({ msg: "خطا در سرور" });
  }
});

// @route   GET /api/wallet/admin/:userId
// @desc    دریافت موجودی و تراکنش‌های کیف پول یک کاربر خاص (فقط ادمین)
// @access  Admin
router.get("/admin/:userId", auth, requireRole("admin"), async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.params.userId });
    if (!wallet)
      return res.status(404).json({ msg: "کیف پول یافت نشد" });

    return res.json({
      balance: wallet.balance,
      transactions: wallet.transactions.sort((a, b) => b.createdAt - a.createdAt),
    });
  } catch (err) {
    console.error("GET /wallet/admin/:userId error:", err);
    return res.status(500).json({ msg: "خطا در سرور" });
  }
});

// @route   POST /api/wallet/charge
// @desc    شارژ کیف پول (فعلاً تستی)
// @access  Private
router.post("/charge", auth, async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0)
    return res.status(400).json({ msg: "مبلغ نامعتبر است" });

  try {
    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet)
      return res.status(404).json({ msg: "کیف پول شما یافت نشد" });

    wallet.balance += amount;
    wallet.transactions.push({
      type: "increase",
      amount,
      description: "شارژ دستی کیف پول توسط کاربر",
    });

    await wallet.save();
    return res.json({ msg: "کیف پول شارژ شد", balance: wallet.balance });
  } catch (err) {
    console.error("POST /wallet/charge error:", err);
    return res.status(500).json({ msg: "خطای سرور" });
  }
});

// @route   POST /api/wallet/admin-adjust
// @desc    افزایش/کاهش دستی موجودی توسط ادمین
// @access  Admin
router.post("/admin-adjust", auth, requireRole("admin"), async (req, res) => {
  const { userId, amount, description } = req.body;

  if (!userId || typeof amount !== "number")
    return res.status(400).json({ msg: "اطلاعات ناقص است" });

  try {
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet)
      return res.status(404).json({ msg: "کیف پول یافت نشد" });

    wallet.balance += amount;
    wallet.transactions.push({
      type: amount >= 0 ? "increase" : "decrease",
      amount: Math.abs(amount),
      description: description || "تنظیم دستی توسط ادمین",
    });

    await wallet.save();
    return res.json({ msg: "موجودی به‌روزرسانی شد", balance: wallet.balance });
  } catch (err) {
    console.error("POST /wallet/admin-adjust error:", err);
    return res.status(500).json({ msg: "خطای سرور" });
  }
});

// @route   POST /api/wallet/topup
// @desc    ثبت درخواست شارژ دستی کیف پول توسط کاربر (کارت به کارت)
// @access  Private
router.post("/topup", auth, async (req, res) => {
  const { method, amount } = req.body;
  if (!method || !amount || amount <= 0)
    return res.status(400).json({ msg: "اطلاعات ناقص است" });

  try {
    const request = await WalletTopupRequest.create({
      user: req.user.id,
      method,
      amount,
      status: "pending",
    });
    return res.json({ msg: "درخواست شارژ ثبت شد و پس از بررسی ادمین حساب شما شارژ می‌شود.", request });
  } catch (err) {
    console.error("POST /wallet/topup error:", err);
    return res.status(500).json({ msg: "خطا در ثبت درخواست شارژ" });
  }
});

// @route   GET /api/wallet/topup-requests
// @desc    دریافت لیست درخواست‌های شارژ کارت به کارت (فقط ادمین)
// @access  Admin
router.get("/topup-requests", auth, requireRole("admin"), async (req, res) => {
  try {
    const requests = await WalletTopupRequest.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    return res.json(requests);
  } catch (err) {
    console.error("GET /wallet/topup-requests error:", err);
    return res.status(500).json({ msg: "خطا در دریافت درخواست‌ها" });
  }
});

// @route   POST /api/wallet/admin-topup-action
// @desc    تأیید یا رد درخواست شارژ کیف پول
// @access  Admin
router.post("/admin-topup-action", auth, requireRole("admin"), async (req, res) => {
  const { id, status } = req.body;
  if (!id || !["approved", "rejected"].includes(status)) {
    return res.status(400).json({ msg: "درخواست نامعتبر است" });
  }

  try {
    const request = await WalletTopupRequest.findById(id);
    if (!request) return res.status(404).json({ msg: "درخواست یافت نشد" });
    if (request.status !== "pending") return res.status(400).json({ msg: "درخواست قبلاً بررسی شده است" });

    request.status = status;
    await request.save();

    if (status === "approved") {
      const wallet = await Wallet.findOne({ user: request.user });
      if (!wallet) return res.status(404).json({ msg: "کیف پول کاربر یافت نشد" });

      wallet.balance += request.amount;
      wallet.transactions.push({
        type: "increase",
        amount: request.amount,
        description: "شارژ توسط ادمین پس از تایید درخواست",
      });
      await wallet.save();
    }

    return res.json({ msg: "وضعیت درخواست بروزرسانی شد" });
  } catch (err) {
    console.error("POST /wallet/admin-topup-action error:", err);
    return res.status(500).json({ msg: "خطای سرور در بروزرسانی درخواست" });
  }
});


export default router;