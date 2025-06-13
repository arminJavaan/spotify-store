import React from "react";
import {
  useCustom,
} from "@refinedev/core";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { DatePicker } from "antd";
import { FiRefreshCw } from "react-icons/fi";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

const COLORS = ["#1db954", "#22c55e", "#16a34a", "#15803d", "#166534"];

export default function AdminAnalytics() {
  const { data, refetch, isLoading } = useCustom({
    url: "/admin/analytics",
    method: "get",
    config: {
      query: {
        enabled: true,
      },
    },
  });

  const [dateRange, setDateRange] = React.useState(null);

  const summary = data?.data?.summary;
  const stats = data?.data?.monthlyStats || [];

  const filteredData = dateRange
    ? stats.filter((item) => {
        const date = dayjs(item.month + "-01");
        return date.isBetween(dateRange[0], dateRange[1], null, "[]");
      })
    : stats;

  return (
    <main className="p-6 mt-20 min-h-screen text-gray-light font-vazir">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl font-bold text-primary">📊 داشبورد آماری فروش</h2>
        <div className="flex items-center gap-4">
          <DatePicker.RangePicker
            format="YYYY-MM-DD"
            onChange={(dates) => setDateRange(dates)}
            className="!bg-dark3 !border-gray-700 !text-white"
          />
          <button
            onClick={() => refetch()}
            className="text-sm flex items-center gap-2 text-gray-300 hover:text-white"
          >
            <FiRefreshCw /> بروزرسانی
          </button>
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-dark3 p-4 rounded-xl text-center border border-gray-700">
            <p className="text-xs text-gray-400">فروش کل (تومان)</p>
            <p className="text-lg font-bold text-green-400">
              {summary.totalSales.toLocaleString("fa-IR")}
            </p>
          </div>
          <div className="bg-dark3 p-4 rounded-xl text-center border border-gray-700">
            <p className="text-xs text-gray-400">تعداد سفارش‌ها</p>
            <p className="text-lg font-bold text-blue-400">{summary.totalOrders}</p>
          </div>
          <div className="bg-dark3 p-4 rounded-xl text-center border border-gray-700">
            <p className="text-xs text-gray-400">میانگین سفارش</p>
            <p className="text-lg font-bold text-orange-400">
              {summary.avgOrder.toLocaleString("fa-IR")}
            </p>
          </div>
          <div className="bg-dark3 p-4 rounded-xl text-center border border-gray-700">
            <p className="text-xs text-gray-400">مشتری‌ها</p>
            <p className="text-lg font-bold text-purple-400">{summary.users}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-dark3 p-6 rounded-2xl shadow border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">نمودار فروش (تومان)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredData}>
              <Line type="monotone" dataKey="totalSales" stroke="#1db954" strokeWidth={3} />
              <CartesianGrid stroke="#444" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-dark3 p-6 rounded-2xl shadow border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">تعداد سفارش‌ها</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredData}>
              <Bar dataKey="orderCount" fill="#1db954" />
              <CartesianGrid stroke="#444" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-dark3 p-6 rounded-2xl shadow border border-gray-700 col-span-1 lg:col-span-2">
          <h3 className="text-lg font-bold text-white mb-4">ترکیب پلن‌های فروخته‌شده</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={summary?.plansBreakdown || []}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {(summary?.plansBreakdown || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}
