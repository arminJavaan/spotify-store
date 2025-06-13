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
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function SupportTicketsAdmin() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

        {loading ? (
          <p className="text-center text-gray-400 animate-pulse">
            در حال دریافت اطلاعات...
          </p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : tickets.length === 0 ? (
          <p className="text-center text-gray-400">موردی یافت نشد.</p>
        ) : (
          <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-dark3">
            {tickets.map((ticket) => (
              <motion.div
                key={ticket._id}
                className="bg-dark3 border border-gray-600 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/tickets/${ticket._id}`)}
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
                  {ticket.replies[0]?.message}
                </p>

                {ticket.user && (
                  <p className="text-xs text-gray-400 mt-1">
                    👤 {ticket.user.name} | {ticket.user.email}
                  </p>
                )}

                {ticket.attachment && (
                  <a
                    href={ticket.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 underline flex items-center gap-1 mt-2"
                  >
                    <Paperclip size={14} /> مشاهده فایل ضمیمه
                  </a>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`text-xs flex items-center gap-1 ${
                      ticket.status === "answered"
                        ? "text-green-400"
                        : ticket.status === "closed"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {ticket.status === "answered" && <CheckCircle size={14} />}
                    {ticket.status === "closed" && <XCircle size={14} />}
                    وضعیت: {ticket.status === "answered" ? "پاسخ داده شده" : ticket.status === "closed" ? "بسته شده" : "در انتظار پاسخ"}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const confirmClose = window.confirm("آیا از بستن این تیکت مطمئن هستید؟");
                      if (!confirmClose) return;
                      API.patch(`/support/tickets/${ticket._id}/close`).then(fetchTickets);
                    }}
                    className="text-xs bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded-lg"
                  >
                    بستن تیکت
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </main>
  );
}
