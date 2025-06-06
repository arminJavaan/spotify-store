// frontend/src/pages/admin/Dashboard.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api";
import {
  FiPackage,
  FiUsers,
  FiShoppingCart,
  FiHome,
  FiGift,
  FiDollarSign,
  FiBarChart,
} from "react-icons/fi";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/admin/stats");
        setStats(res.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("خطا در بارگذاری آمار");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <p className="text-gray2 animate-pulse">در حال بارگذاری آمار...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 mt-16">
      <h2 className="text-3xl font-extrabold text-primary text-center mb-12 animate-fadeIn">
        🛠️ داشبورد مدیریت سپاتیفای
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-slideInUp">
        <AdminCard
          to="/admin/users"
          icon={<FiUsers />}
          title="کاربران"
          value={stats.totalUsers}
        />
        <AdminCard
          to="/admin/products"
          icon={<FiPackage />}
          title="محصولات"
          value={stats.totalProducts}
        />
        <AdminCard
          to="/admin/discounts"
          icon={<FiGift />}
          title="کدهای تخفیف"
          value={stats.totaldiscounts}
        />
        <AdminCard
          to="/admin/orders"
          icon={<FiShoppingCart />}
          title="سفارش‌ها"
          value={stats.totalOrders}
        />
        <AdminCard
          to="/admin/wallets"
          icon={<FiDollarSign />}
          title="کیف پول کاربران"
        />
        <AdminCard
          to="/admin/wallet-topups"
          icon={<FiDollarSign />}
          title="درخواست‌های شارژ کیف پول"
        />
        <AdminCard
          icon={<FiBarChart />}
          to="/admin/analytics"
          title=" آمار و گزارشات فروش"
          className="text-sm text-gray-light bg-dark3 py-2 px-4 rounded-xl hover:bg-dark2 transition block"
        >
          📈 آمار و نمودار فروش
        </AdminCard>

        <AdminCard to="/" icon={<FiHome />} title="بازگشت به سایت" />
      </div>
    </div>
  );
}

const AdminCard = ({ to, icon, title, value }) => {
  return (
    <Link
      to={to}
      className="bg-gradient-to-tr from-dark1 to-dark2 p-6 rounded-3xl shadow-xl hover:shadow-2xl border border-white/10 transition-all duration-300 group text-center"
    >
      <div className="text-4xl text-primary mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="text-lg font-bold text-gray-light mb-1">{title}</div>
      {value !== undefined && (
        <div className="text-2xl font-extrabold text-gray-light animate-fadeIn">
          {value.toLocaleString("fa-IR")}
        </div>
      )}
    </Link>
  );
};
