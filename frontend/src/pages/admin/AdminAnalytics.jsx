import React, { useEffect, useState } from "react";
import API from "../../api";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";
import { motion } from "framer-motion";

export default function AdminAnalytics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/admin/analytics")
      .then(res => setData(res.data))
      .catch(err => console.error("خطا در دریافت آمار:", err));
  }, []);

  return (
    <main className="p-6 mt-20 min-h-screen text-gray-light font-vazir">
      <h2 className="text-2xl font-bold text-primary mb-8">📊 داشبورد آماری فروش</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* نمودار فروش */}
        <motion.div
          className="bg-dark3 p-6 rounded-2xl shadow border border-gray-700"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-lg font-bold text-white mb-4">نمودار فروش (تومان)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <Line type="monotone" dataKey="totalSales" stroke="#1db954" strokeWidth={3} />
              <CartesianGrid stroke="#444" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* نمودار سفارش */}
        <motion.div
          className="bg-dark3 p-6 rounded-2xl shadow border border-gray-700"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-lg font-bold text-white mb-4">تعداد سفارش‌ها</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <Bar dataKey="orderCount" fill="#1db954" />
              <CartesianGrid stroke="#444" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </main>
  );
}
