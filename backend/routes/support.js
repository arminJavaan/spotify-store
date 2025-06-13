// ویرایش‌شده بر اساس مدل جدید و حذف کامل فیلد message
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

import auth from "../middleware/auth.js";
import requireRole from "../middleware/roles.js";
import SupportTicket from "../models/SupportTicket.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadPath = path.join(__dirname, "../../frontend/uploads/support");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const name = `${Date.now()}-${Math.floor(Math.random() * 10000)}${path.extname(file.originalname)}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".webp", ".pdf", ".zip"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) return cb(new Error("فرمت فایل مجاز نیست"));
    cb(null, true);
  },
});

// ✅ ایجاد تیکت جدید
router.post("/", auth, upload.single("attachment"), async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) return res.status(400).json({ msg: "موضوع و پیام الزامی است" });

    const newTicket = new SupportTicket({
      user: req.user.id,
      subject: subject.trim(),
      attachment: req.file ? `/uploads/support/${req.file.filename}` : null,
      replies: [
        {
          message: message.trim(),
          from: "user",
          attachmentUrl: req.file ? `/uploads/support/${req.file.filename}` : null,
        },
      ],
    });

    await newTicket.save();
    res.json({ msg: "تیکت با موفقیت ثبت شد", ticket: newTicket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "خطا در ثبت تیکت" });
  }
});

// ✅ دریافت تیکت‌های کاربر
router.get("/me", auth, async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ msg: "خطا در دریافت تیکت‌ها" });
  }
});

// ✅ دریافت همه تیکت‌ها (ادمین)
router.get("/all", auth, requireRole("admin"), async (req, res) => {
  try {
    const tickets = await SupportTicket.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ msg: "خطا در دریافت تیکت‌ها" });
  }
});

// ✅ دریافت تیکت خاص
router.get("/tickets/:id", auth, async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id).populate("user", "name email");
    if (!ticket) return res.status(404).json({ msg: "تیکت پیدا نشد" });

    const isOwner = ticket.user._id.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) return res.status(403).json({ msg: "دسترسی غیرمجاز" });

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ msg: "خطا در دریافت تیکت" });
  }
});

// ✅ ارسال پاسخ جدید
router.post("/tickets/:id/reply", auth, upload.single("attachment"), async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ msg: "تیکت پیدا نشد" });

    const { message } = req.body;
    if (!message || !message.trim()) return res.status(400).json({ msg: "متن پاسخ الزامی است" });

    const isOwner = ticket.user.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) return res.status(403).json({ msg: "دسترسی غیرمجاز" });

    ticket.replies.push({
      message: message.trim(),
      from: isAdmin ? "admin" : "user",
      admin: isAdmin ? req.user.id : null,
      attachmentUrl: req.file ? `/uploads/support/${req.file.filename}` : null,
      createdAt: new Date(),
    });

    ticket.status = isAdmin ? "answered" : "open";
    ticket.repliedAt = new Date();
    await ticket.save();

    res.json({ msg: "پاسخ ثبت شد", ticket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "خطا در ثبت پاسخ" });
  }
});

// ✅ بستن تیکت
router.patch("/tickets/:id/close", auth, requireRole("admin"), async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ msg: "تیکت پیدا نشد" });

    ticket.status = "closed";
    await ticket.save();

    res.json({ msg: "تیکت بسته شد", ticket });
  } catch (err) {
    res.status(500).json({ msg: "خطا در بستن تیکت" });
  }
});

export default router;
