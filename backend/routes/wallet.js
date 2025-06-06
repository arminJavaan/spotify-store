import express from "express";
const router = express.Router();

import auth from "../middleware/auth.js";
import Wallet from "../models/Wallet.js";
import WalletTopupRequest from "../models/WalletTopupRequest.js";
import requireRole from "../middleware/roles.js";

// دریافت کیف پول کاربر
router.get("/", auth, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) return res.status(404).json({ msg: "کیف پول شما یافت نشد" });

    res.json({
      balance: wallet.balance,
      transactions: wallet.transactions.sort(
        (a, b) => b.createdAt - a.createdAt
      ),
    });
  } catch (err) {
    console.error("GET /wallet error:", err);
    res.status(500).json({ msg: "خطا در دریافت کیف پول" });
  }
});

// دریافت کیف پول کاربر خاص (ادمین)
router.get("/admin/:userId", auth, requireRole("admin"), async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.params.userId });
    if (!wallet) return res.status(404).json({ msg: "کیف پول یافت نشد" });

    res.json({
      balance: wallet.balance,
      transactions: wallet.transactions.sort(
        (a, b) => b.createdAt - a.createdAt
      ),
    });
  } catch (err) {
    console.error("GET /wallet/admin/:userId error:", err);
    res.status(500).json({ msg: "خطا در دریافت اطلاعات کیف پول" });
  }
});

// شارژ دستی تستی توسط کاربر
router.post("/charge", auth, async (req, res) => {
  const { amount } = req.body;
  if (!amount || typeof amount !== "number" || amount <= 0)
    return res.status(400).json({ msg: "مبلغ نامعتبر است" });

  try {
    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) return res.status(404).json({ msg: "کیف پول یافت نشد" });

    wallet.balance += amount;
    wallet.transactions.push({
      type: "increase",
      amount,
      description: "شارژ دستی توسط کاربر",
    });
    await wallet.save();

    res.json({ msg: "کیف پول شارژ شد", balance: wallet.balance });
  } catch (err) {
    console.error("POST /wallet/charge error:", err);
    res.status(500).json({ msg: "خطا در شارژ کیف پول" });
  }
});

// تنظیم دستی کیف پول توسط ادمین
router.post("/admin-adjust", auth, requireRole("admin"), async (req, res) => {
  const { userId, amount, description } = req.body;
  if (!userId || typeof amount !== "number")
    return res.status(400).json({ msg: "ورودی ناقص یا نامعتبر است" });

  try {
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) return res.status(404).json({ msg: "کیف پول یافت نشد" });

    wallet.balance += amount;
    wallet.transactions.push({
      type: amount >= 0 ? "increase" : "decrease",
      amount: Math.abs(amount),
      description: description || "تنظیم توسط ادمین",
    });
    await wallet.save();

    res.json({ msg: "موجودی به‌روزرسانی شد", balance: wallet.balance });
  } catch (err) {
    console.error("POST /wallet/admin-adjust error:", err);
    res.status(500).json({ msg: "خطا در ویرایش موجودی" });
  }
});

// ثبت درخواست کارت‌به‌کارت توسط کاربر
router.post("/topup", auth, async (req, res) => {
  const { method, amount } = req.body;
  if (!method || !amount || typeof amount !== "number" || amount <= 0)
    return res.status(400).json({ msg: "اطلاعات نامعتبر است" });

  try {
    const request = await WalletTopupRequest.create({
      user: req.user.id,
      method,
      amount,
      status: "pending",
    });

    res.json({
      msg: "درخواست شما ثبت شد و در انتظار تایید است.",
      request,
    });
  } catch (err) {
    console.error("POST /wallet/topup error:", err);
    res.status(500).json({ msg: "خطا در ثبت درخواست" });
  }
});

// لیست تمام درخواست‌های شارژ برای ادمین
router.get("/topup-requests", auth, requireRole("admin"), async (req, res) => {
  try {
    const requests = await WalletTopupRequest.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error("GET /wallet/topup-requests error:", err);
    res.status(500).json({ msg: "خطا در دریافت لیست درخواست‌ها" });
  }
});

// تایید یا رد درخواست کارت به کارت توسط ادمین
router.post(
  "/admin-topup-action",
  auth,
  requireRole("admin"),
  async (req, res) => {
    const { id, status } = req.body;
    if (!id || !["approved", "rejected"].includes(status))
      return res.status(400).json({ msg: "درخواست نامعتبر است" });

    try {
      const request = await WalletTopupRequest.findById(id);
      if (!request) return res.status(404).json({ msg: "درخواست یافت نشد" });
      if (request.status !== "pending")
        return res.status(400).json({ msg: "درخواست قبلاً بررسی شده" });

      request.status = status;
      await request.save();

      if (status === "approved") {
        const wallet = await Wallet.findOne({ user: request.user });
        if (!wallet) return res.status(404).json({ msg: "کیف پول یافت نشد" });

        wallet.balance += request.amount;
        wallet.transactions.push({
          type: "increase",
          amount: request.amount,
          description: "شارژ توسط ادمین پس از تایید درخواست",
        });
        await wallet.save();
      }

      res.json({ msg: "وضعیت درخواست بروزرسانی شد" });
    } catch (err) {
      console.error("POST /wallet/admin-topup-action error:", err);
      res.status(500).json({ msg: "خطا در بروزرسانی درخواست" });
    }
  }
);

export default router;
