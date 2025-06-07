import React, { useEffect, useState } from "react";
import API from "../../api";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Clock,
  Paperclip,
  CheckCircle,
  Loader,
  XCircle,
  ShieldCheck,
  Trash2,
} from "lucide-react";

export default function SupportTicketsAdmin() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyingId, setReplyingId] = useState(null);
  const [replyInputs, setReplyInputs] = useState({});
  const [activeTab, setActiveTab] = useState("new");

  const fetchTickets = async () => {
    try {
      const res = await API.get("/support/all");
      setTickets(res.data);
    } catch (err) {
      setError("خطا در دریافت تیکت‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleReply = async (ticketId) => {
    const replyText = replyInputs[ticketId];
    if (!replyText?.trim()) return;

    setReplyingId(ticketId);
    try {
      const formData = new FormData();
      formData.append("message", replyText.trim());
      await API.post(`/support/tickets/${ticketId}/reply`, formData);
      setReplyInputs({ ...replyInputs, [ticketId]: "" });
      fetchTickets();
    } catch {
      alert("خطا در ارسال پاسخ");
    } finally {
      setReplyingId(null);
    }
  };

  const handleCloseTicket = async (ticketId) => {
    const confirmed = window.confirm("آیا از بستن این تیکت مطمئن هستید؟");
    if (!confirmed) return;

    try {
      await API.patch(`/support/tickets/${ticketId}/close`);
      fetchTickets();
    } catch {
      alert("خطا در بستن تیکت");
    }
  };

  const categorized = {
    new: tickets.filter((t) => t.replies.length === 1),
    open: tickets.filter((t) => t.status === "open" && t.replies.length > 1),
    closed: tickets.filter((t) => t.status === "closed"),
  };

  const getStatusColor = (status) => {
    if (status === "open") return "text-yellow-400";
    if (status === "answered") return "text-green-400";
    if (status === "closed") return "text-red-400";
    return "text-gray-400";
  };

  return (
    <main className="min-h-screen px-4 py-20 font-vazir mt-10 text-gray-light">
      <motion.div
        className="max-w-6xl mx-auto bg-dark2 rounded-3xl p-8 border border-gray-700 shadow-xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
          <MessageSquare /> مدیریت تیکت‌های پشتیبانی
        </h2>

        <div className="flex gap-4 mb-8 flex-wrap">
          {[
            { key: "new", label: "تیکت‌های جدید" },
            { key: "open", label: "در حال مکالمه" },
            { key: "closed", label: "بسته شده" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition ${
                activeTab === tab.key
                  ? "bg-primary text-dark1"
                  : "bg-dark1 text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-400 animate-pulse">
            در حال دریافت اطلاعات...
          </p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : categorized[activeTab].length === 0 ? (
          <p className="text-center text-gray-400">موردی یافت نشد.</p>
        ) : (
          <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-dark3">
            {categorized[activeTab].map((ticket) => (
              <motion.div
                key={ticket._id}
                className="bg-dark3 border border-gray-600 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-primary truncate">
                    {ticket.subject}
                  </h3>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={14} />
                    {new Date(ticket.createdAt).toLocaleString("fa-IR")}
                  </span>
                </div>

                <p className="text-sm text-gray-300 whitespace-pre-line mb-2">
                  {ticket.message}
                </p>

                {ticket.attachment && (
                  <a
                    href={ticket.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 underline flex items-center gap-1 mb-2"
                  >
                    <Paperclip size={14} /> مشاهده فایل ضمیمه
                  </a>
                )}

                {ticket.replies?.length > 0 && (
                  <div className="space-y-3 border-t border-dashed border-gray-700 mt-4 pt-4">
                    {ticket.replies.map((reply, index) => (
                      <div
                        key={index}
                        className={`border text-sm p-4 rounded-xl ${
                          reply.from === "admin"
                            ? "bg-green-900/10 border-green-600 text-green-200"
                            : "bg-dark1 border-gray-600 text-gray-300"
                        }`}
                      >
                        <div className="flex justify-between mb-2 text-xs">
                          <span className="flex items-center gap-1">
                            {reply.from === "admin" ? (
                              <>
                                <ShieldCheck size={14} /> پشتیبانی
                              </>
                            ) : (
                              "کاربر"
                            )}
                          </span>
                          <span>
                            {new Date(reply.createdAt).toLocaleString("fa-IR")}
                          </span>
                        </div>
                        <p className="whitespace-pre-line mb-2">{reply.message}</p>
                        {reply.attachmentUrl && (
                          <a
                            href={reply.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-400 underline flex items-center gap-1"
                          >
                            <Paperclip size={14} /> فایل ضمیمه
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {ticket.status !== "closed" && (
                  <div className="mt-6 space-y-3">
                    <textarea
                      rows={3}
                      className="w-full bg-dark1 text-white border border-gray-600 rounded-xl p-3 focus:outline-none focus:border-primary"
                      placeholder="پاسخ خود را بنویسید..."
                      value={replyInputs[ticket._id] || ""}
                      onChange={(e) =>
                        setReplyInputs({
                          ...replyInputs,
                          [ticket._id]: e.target.value,
                        })
                      }
                    />

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleReply(ticket._id)}
                        disabled={
                          replyingId === ticket._id &&
                          !replyInputs[ticket._id]?.trim()
                        }
                        className="bg-primary text-dark1 font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition disabled:opacity-60"
                      >
                        {replyingId === ticket._id ? (
                          <span className="flex items-center gap-2">
                            <Loader className="animate-spin" size={16} /> ارسال...
                          </span>
                        ) : (
                          "ارسال پاسخ"
                        )}
                      </button>

                      <button
                        onClick={() => handleCloseTicket(ticket._id)}
                        className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition"
                      >
                        <Trash2 size={16} /> بستن تیکت
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </main>
  );
}
