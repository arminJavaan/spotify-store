import React, { useEffect, useState } from "react";
import API from "../api";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, Paperclip, Send, Clock } from "lucide-react";
import { toast } from "react-hot-toast";

export default function TicketDetails() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [reply, setReply] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const fetchTicket = async () => {
    try {
      const res = await API.get(`/support/tickets/${id}`);
      setTicket(res.data);
    } catch (err) {
      setError("خطا در دریافت اطلاعات تیکت");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const handleReply = async () => {
    if (!reply.trim()) return toast.error("لطفاً متن پیام را وارد کنید.");

    const formData = new FormData();
    formData.append("message", reply.trim());
    if (attachment) formData.append("attachment", attachment);

    try {
      setSending(true);
      await API.post(`/support/tickets/${id}/reply`, formData);
      toast.success("پاسخ با موفقیت ارسال شد");
      setReply("");
      setAttachment(null);
      fetchTicket();
    } catch (err) {
      toast.error("خطا در ارسال پاسخ");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-400 mt-20 font-vazir animate-pulse">
        در حال دریافت جزئیات تیکت...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-20 font-vazir">{error}</div>
    );
  }

  return (
    <main className="min-h-screen px-4 py-20 font-vazir mt-10 text-gray-light">
      <motion.div
        className="max-w-4xl mx-auto bg-dark2 rounded-3xl p-8 border border-gray-700 shadow-xl space-y-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <MessageCircle /> {ticket.subject}
          </h2>
          <p className="text-sm text-gray-400 flex items-center gap-1">
            <Clock size={14} />
            {new Date(ticket.createdAt).toLocaleString("fa-IR")}
          </p>
          <p className="text-sm text-gray-300 whitespace-pre-line">
            {ticket.message}
          </p>
          {ticket.attachment && (
            <a
              href={ticket.attachment}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 underline flex items-center gap-1"
            >
              <Paperclip size={14} /> مشاهده فایل ضمیمه
            </a>
          )}
        </div>

        <div className="border-t border-gray-700 pt-6 space-y-6">
          <h3 className="text-sm text-gray-400 font-bold">پاسخ‌ها</h3>
          {ticket.replies?.length > 0 ? (
            ticket.replies.map((r, idx) => (
              <div
                key={idx}
                className={`rounded-xl p-4 border text-sm shadow ${
                  r.from === "admin"
                    ? "bg-green-800/10 border-green-500 text-green-100"
                    : "bg-dark3 border-gray-600 text-gray-300"
                }`}
              >
                <div className="flex justify-between text-xs mb-2">
                  <span>{r.from === "admin" ? "پشتیبانی" : "شما"}</span>
                  <span>{new Date(r.createdAt).toLocaleString("fa-IR")}</span>
                </div>
                <p className="whitespace-pre-line mb-2">{r.message}</p>
                {r.attachmentUrl && (
                  <a
                    href={r.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline flex items-center gap-1 text-blue-400"
                  >
                    <Paperclip size={14} /> فایل ضمیمه
                  </a>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">پاسخی ثبت نشده است.</p>
          )}
        </div>

        {/* فرم پاسخ‌دهی */}

        {ticket.status === "closed" ? (
          <p className="text-red-400 text-sm">
            این تیکت توسط پشتیبانی بسته شده است.
          </p>
        ) : (
          <div className="border-t border-gray-700 pt-6 space-y-4">
            <h3 className="text-sm text-gray-400 font-bold mb-1">
              ارسال پاسخ جدید
            </h3>
            <textarea
              rows={4}
              className="w-full bg-dark3 border border-gray-600 p-3 rounded-lg text-sm text-black focus:outline-none focus:border-primary resize-none"
              placeholder="متن پاسخ شما..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />

            <input
              type="file"
              accept="image/*,.pdf,.zip"
              onChange={(e) => setAttachment(e.target.files[0])}
              className="text-xs text-gray-400 file:mr-3 file:bg-primary file:border-0 file:px-4 file:py-1 file:text-sm file:text-black file:rounded-lg file:cursor-pointer"
            />

            <button
              onClick={handleReply}
              disabled={sending}
              className="bg-primary text-dark1 font-bold py-2 px-6 rounded-xl flex items-center gap-2 hover:bg-opacity-90 transition disabled:opacity-60"
            >
              <Send size={16} />
              {sending ? "در حال ارسال..." : "ارسال پاسخ"}
            </button>
          </div>
        )}
      </motion.div>
    </main>
  );
}
