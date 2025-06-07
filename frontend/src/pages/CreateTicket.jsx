import React, { useState } from "react";
import API from "../api";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Plus, Paperclip, MessageSquare, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CreateTicket() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!subject.trim() || message.trim().length < 10) {
      toast.error("موضوع و پیام باید حداقل ۱۰ کاراکتر باشند.");
      return;
    }

    if (attachment && attachment.size > 5 * 1024 * 1024) {
      toast.error("حجم فایل ضمیمه باید کمتر از ۵ مگابایت باشد.");
      return;
    }

    const formData = new FormData();
    formData.append("subject", subject.trim());
    formData.append("message", message.trim());
    if (attachment) formData.append("attachment", attachment);

    try {
      setSubmitting(true);
      await API.post("/support", formData);
      toast.success("تیکت با موفقیت ثبت شد.");
      navigate("/my-tickets");
    } catch (err) {
      toast.error(err?.response?.data?.msg || "خطا در ثبت تیکت");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen py-16 px-4 font-vazir mt-10 text-gray-light">
      <motion.div
        className="max-w-3xl mx-auto bg-dark2 p-8 rounded-3xl border border-gray-700 shadow-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
          <Plus /> ثبت تیکت جدید
        </h2>

        <div className="space-y-5 text-sm">
          <div>
            <label className="block text-gray-300 mb-1">موضوع تیکت</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-dark3 border border-gray-600 p-3 rounded-lg text-black focus:outline-none focus:border-primary"
              placeholder="مثلاً: مشکل در فعال‌سازی اکانت"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">پیام</label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-dark3 border border-gray-600 p-3 rounded-lg text-black focus:outline-none focus:border-primary resize-none"
              placeholder="شرح مشکل یا سوال شما..."
              maxLength={1000}
            />
            <p className="text-xs text-gray-500 mt-1 text-left">
              {message.length}/1000
            </p>
          </div>

          <div>
            <label className="block text-gray-300 mb-1">فایل ضمیمه (اختیاری)</label>
            <input
              type="file"
              accept="image/*,.pdf,.zip"
              onChange={(e) => setAttachment(e.target.files[0])}
              className="text-xs text-gray-400 file:mr-3 file:bg-primary file:border-0 file:px-4 file:py-1 file:text-sm file:text-black file:rounded-lg file:cursor-pointer"
            />
            {attachment && (
              <p className="text-xs mt-2 flex items-center gap-1 text-blue-400">
                <Paperclip size={14} /> {attachment.name} ({(attachment.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-primary text-dark1 font-bold py-2 rounded-xl hover:bg-opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader className="animate-spin" size={16} />
                در حال ارسال...
              </>
            ) : (
              <>
                <MessageSquare size={16} />
                ارسال تیکت
              </>
            )}
          </button>
        </div>
      </motion.div>
    </main>
  );
}
