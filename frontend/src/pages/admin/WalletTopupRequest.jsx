import React, { useEffect, useState } from "react";
import API from "../../api";
import { motion } from "framer-motion";
import { format } from "timeago.js";
import { FiClock, FiUser, FiMail, FiDollarSign } from "react-icons/fi";

export default function WalletTopupRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/wallet/topup-requests");
      setRequests(res.data);
    } catch (err) {
      setError("خطا در دریافت درخواست‌ها");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      await API.post("/wallet/admin-topup-action", { id, status });
      fetchRequests();
    } catch {
      alert("خطا در انجام عملیات");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-400 bg-yellow-900/20 border-yellow-500";
      case "approved":
        return "text-green-400 bg-green-900/20 border-green-500";
      case "rejected":
        return "text-red-400 bg-red-900/20 border-red-500";
      default:
        return "text-gray-300 border-gray-600";
    }
  };

  return (
    <main className="px-6 py-10 text-gray-light mt-16 font-vazir">
      <h2 className="text-3xl font-extrabold text-primary mb-8 flex items-center gap-2">
        <FiDollarSign /> درخواست‌های شارژ کیف پول
      </h2>

      {loading ? (
        <p className="text-gray-400 animate-pulse">در حال بارگذاری...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-400">درخواستی ثبت نشده است.</p>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {requests.map((r) => (
            <motion.div
              key={r._id}
              className={`rounded-2xl p-5 border shadow-lg transition-all duration-300 ${getStatusStyle(
                r.status
              )}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-3 text-sm">
                <p className="flex items-center gap-2">
                  <FiUser className="text-primary" />
                  <span className="text-gray-200 font-bold">{r.user?.name || "کاربر ناشناس"}</span>
                </p>
                <p className="flex items-center gap-2">
                  <FiMail className="text-primary" />
                  <span className="text-gray-400">{r.user?.email || "—"}</span>
                </p>
                <p>
                  <span className="text-gray-400">💳 مبلغ:</span>{" "}
                  <span className="text-lg font-bold text-green-400">
                    {r.amount.toLocaleString("fa-IR")} تومان
                  </span>
                </p>
                <p>
                  <span className="text-gray-400">🔄 روش:</span>{" "}
                  <span className="text-gray-200">{r.method}</span>
                </p>
                <p>
                  <span className="text-gray-400">📌 وضعیت:</span>{" "}
                  <span className="font-bold">
                    {r.status === "pending"
                      ? "در انتظار بررسی"
                      : r.status === "approved"
                      ? "تأیید شده"
                      : "رد شده"}
                  </span>
                </p>
                {r.adminNote && (
                  <p>
                    <span className="text-gray-400">📝 یادداشت مدیر:</span>{" "}
                    <span className="text-gray-300">{r.adminNote}</span>
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <FiClock />
                  {format(r.createdAt)}
                </p>
              </div>

              {r.status === "pending" && (
                <div className="flex justify-between gap-2 mt-6">
                  <button
                    onClick={() => handleAction(r._id, "approved")}
                    className="w-full py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
                  >
                    تأیید و شارژ
                  </button>
                  <button
                    onClick={() => handleAction(r._id, "rejected")}
                    className="w-full py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                  >
                    رد درخواست
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
