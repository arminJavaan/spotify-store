import React, { useEffect, useState } from "react";
import API from "../api";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Clock,
  Paperclip,
  CheckCircle,
  XCircle,
  Loader,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserTickets() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  const fetchTickets = async () => {
    try {
      const res = await API.get("/support/me");
      setTickets(res.data);
      setFilteredTickets(res.data);
    } catch (err) {
      setError("خطا در دریافت تیکت‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    let filtered = tickets;
    if (search.trim()) {
      filtered = filtered.filter((t) =>
        t.subject.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }
    setFilteredTickets(filtered);
  }, [search, statusFilter, tickets]);

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
          <MessageSquare /> تیکت‌های پشتیبانی من
        </h2>

        {/* فیلتر و جستجو */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="جستجو بر اساس موضوع..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 bg-dark1 text-black border border-gray-600 rounded-lg focus:outline-none focus:border-primary text-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-48 px-4 py-2 bg-black text-white border border-gray-600 rounded-lg focus:outline-none focus:border-primary text-sm"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="open">در انتظار</option>
            <option value="answered">پاسخ‌داده‌شده</option>
            <option value="closed">بسته‌شده</option>
          </select>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 animate-pulse">
            <Loader size={18} className="inline animate-spin ml-1" />
            در حال بارگذاری...
          </p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredTickets.length === 0 ? (
          <p className="text-center text-gray-400">
            تیکتی با این شرایط پیدا نشد.
          </p>
        ) : (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-dark3">
            {filteredTickets.map((ticket) => (
              <motion.div
                key={ticket._id}
                onClick={() => navigate(`/tickets/${ticket._id}`)}
                className="bg-dark3 border border-gray-600 p-5 rounded-2xl shadow hover:shadow-xl cursor-pointer transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-primary truncate">
                    {ticket.subject}
                  </h3>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={14} />
                    {new Date(ticket.createdAt).toLocaleString("fa-IR")}
                  </span>
                </div>

                <p className="text-sm text-gray-300 whitespace-pre-line mb-3 line-clamp-3">
                  {ticket.message}
                </p>

                <div className="flex justify-between items-center text-xs">
                  {ticket.attachment ? (
                    <a
                      href={ticket.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Paperclip size={14} /> مشاهده فایل ضمیمه
                    </a>
                  ) : (
                    <div />
                  )}

                  <span
                    className={`flex items-center gap-1 ${getStatusColor(
                      ticket.status
                    )}`}
                  >
                    {ticket.status === "answered" && <CheckCircle size={14} />}
                    {ticket.status === "closed" && <XCircle size={14} />}
                    وضعیت:{" "}
                    {ticket.status === "open"
                      ? "در انتظار"
                      : ticket.status === "answered"
                      ? "پاسخ داده شده"
                      : "بسته شده"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </main>
  );
}
