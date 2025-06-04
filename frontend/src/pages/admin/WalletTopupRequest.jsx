// frontend/src/pages/admin/WalletTopupRequests.jsx

import React, { useEffect, useState } from "react";
import API from "../../api";
import { motion } from "framer-motion";
import { format } from "timeago.js";

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

  return (
    <main className="px-6 py-10 text-gray-light mt-16">
      <h2 className="text-2xl font-bold text-primary mb-6">
        درخواست‌های شارژ کیف پول
      </h2>
      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : requests.length === 0 ? (
        <p>درخواستی ثبت نشده است.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <motion.div
              key={r._id}
              className="bg-dark1 p-4 rounded shadow border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex justify-between flex-wrap gap-2">
                <div>
                  <p>
                    <span className="font-bold">کاربر:</span>{" "}
                    {r.user ? `${r.user.name} (${r.user.email})` : "نامشخص"}
                  </p>

                  <p>
                    <span className="font-bold">مبلغ:</span>{" "}
                    {r.amount.toLocaleString("fa-IR")} تومان
                  </p>
                  <p>
                    <span className="font-bold">روش:</span> {r.method}
                  </p>
                  <p>
                    <span className="font-bold">وضعیت:</span>{" "}
                    <span
                      className={
                        r.status === "pending"
                          ? "text-yellow-400"
                          : r.status === "approved"
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {r.status === "pending"
                        ? "در انتظار"
                        : r.status === "approved"
                        ? "تأیید شده"
                        : "رد شده"}
                    </span>
                  </p>
                  {r.adminNote && (
                    <p>
                      <span className="font-bold">یادداشت مدیر:</span>{" "}
                      {r.adminNote}
                    </p>
                  )}
                  <p className="text-sm text-gray-400">
                    درخواست: {format(r.createdAt)}
                  </p>
                </div>
                {r.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(r._id, "approved")}
                      className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white"
                    >
                      تایید و شارژ
                    </button>
                    <button
                      onClick={() => handleAction(r._id, "rejected")}
                      className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
                    >
                      رد درخواست
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
