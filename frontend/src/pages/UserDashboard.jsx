// frontend/src/pages/UserDashboard.jsx

import React, { useContext, useEffect, useState } from "react";
import API from "../api";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEdit2,
  FiSave,
  FiHome,
  FiUser,
  FiMail,
  FiPhone,
  FiClock,
  FiXCircle,
  FiCheckCircle,
  FiGift,
  FiPercent,
  FiCalendar,
} from "react-icons/fi";

export default function UserDashboard() {
  const { user, loading: userLoading, logout } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [discountInfo, setDiscountInfo] = useState(null);
  const [discountLoading, setDiscountLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      navigate("/login");
      return;
    }
    setFormData({ name: user.name, email: user.email, phone: user.phone });
    fetchOrders();
    fetchDiscountInfo();
  }, [user, userLoading]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await API.get("/orders");
      setOrders(res.data);
    } catch {
      setOrdersError("خطا در دریافت سفارش‌ها");
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchDiscountInfo = async () => {
    setDiscountLoading(true);
    try {
      const res = await API.get("/discounts/me");
      setDiscountInfo(res.data);
    } catch {
      setDiscountInfo({ error: "خطا در دریافت اطلاعات تخفیف" });
    } finally {
      setDiscountLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError(null);
    setEditing(false);
    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
    };
    if (password.trim()) payload.password = password;
    try {
      await API.put("/auth/profile", payload);
      window.location.reload();
    } catch (err) {
      setProfileError(err.response?.data?.msg || "خطا در به‌روزرسانی پروفایل");
    }
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark2 text-gray-light">
        <p>در حال بارگذاری...</p>
      </div>
    );
  }
  if (!user) return null;

  return (
    <main className="mt-12 min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="space-y-8">
          {/* Header */}
          <motion.div
            className="flex items-center justify-between m-5 rounded-2xl shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-primary">خوش آمدی، {user.name}</h2>
            <button
              onClick={logout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              <FiHome className="text-lg" />
              <span>خروج</span>
            </button>
          </motion.div>

          {/* Profile */}
          <motion.section
            className="bg-dark1 p-6 rounded-2xl shadow-lg"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold flex items-center text-gray-light">
                <FiUser className="ml-2 text-primary" /> پروفایل من
              </h3>
              <button
                onClick={() => setEditing((prev) => !prev)}
                className="bg-primary hover:bg-opacity-90 text-dark2 px-3 py-1 rounded-lg transition flex items-center"
              >
                {editing ? <><FiXCircle /><span>لغو</span></> : <><FiEdit2 /><span>ویرایش</span></>}
              </button>
            </div>

            <AnimatePresence>
              {editing ? (
                <motion.form
                  onSubmit={handleProfileSubmit}
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <input name="name" value={formData.name} onChange={handleChange} placeholder="نام" className="input" required />
                  <input name="email" value={formData.email} onChange={handleChange} placeholder="ایمیل" className="input" required />
                  <input name="phone" value={formData.phone} onChange={handleChange} placeholder="تلفن" className="input" required />
                  <input name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="رمز جدید (اختیاری)" className="input" type="password" />
                  {profileError && <p className="text-red-500 text-sm">{profileError}</p>}
                  <button type="submit" className="w-full bg-primary text-dark2 py-2 rounded-lg flex justify-center items-center"><FiSave className="ml-2" /> ذخیره تغییرات</button>
                </motion.form>
              ) : (
                <motion.div className="space-y-3 text-gray-light" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                  <div className="flex items-center space-x-2"><FiUser className="text-primary text-lg" /><span>{user.name}</span></div>
                  <div className="flex items-center space-x-2"><FiMail className="text-primary text-lg" /><span>{user.email}</span></div>
                  <div className="flex items-center space-x-2"><FiPhone className="text-primary text-lg" /><span>{user.phone}</span></div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

          {/* Discount Section */}

          <motion.section
            className="bg-dark1 p-6 rounded-2xl shadow-lg "
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-xl font-semibold text-gray-light mb-4 flex items-center">
              <FiPercent className="ml-2 text-primary text-lg" />
              کدهای تخفیف من
            </h3>

            {discountLoading ? (
              <p className="text-center text-gray-light">در حال بارگذاری...</p>
            ) : discountInfo && !discountInfo.error ? (
              <motion.div
                className="space-y-4 text-gray-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="bg-dark2 rounded-lg p-4 border border-gray-med">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-primary">کد ۱۵٪ شخصی:</span>
                    <span className="text-lg font-mono">{discountInfo.code}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>تعداد استفاده: {discountInfo.uses}</span>
                    {discountInfo.expiresAt && (
                      <span className="flex items-center">
                        <FiCalendar className="ml-1" />
                        انقضا: {new Date(discountInfo.expiresAt).toLocaleDateString("fa-IR")}
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-dark2 rounded-lg p-4 border border-gray-med">
                  <div className="font-bold text-green-400 mb-1">کدهای ۷۰٪ دریافتی: {discountInfo.reward70Count}</div>
                  <div>تا کد بعدی مانده: {discountInfo.nextReward70}</div>
                </div>

                <div className="bg-dark2 rounded-lg p-4 border border-gray-med">
                  <div className="font-bold text-blue-400 mb-1">اکانت‌های رایگان دریافتی: {discountInfo.freeCount}</div>
                  <div>تا اکانت بعدی مانده: {discountInfo.nextFree}</div>
                </div>
              </motion.div>
            ) : (
              <p className="text-red-500 text-center">
                {discountInfo?.error || "خطایی رخ داده است."}
              </p>
            )}
          </motion.section>        </div>

        {/* Orders */}
        <div className="lg:col-span-2">
          <motion.section
            className="bg-dark1 p-6 rounded-2xl shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold text-gray-light mb-4 flex items-center ">
              <FiClock className="ml-2 text-primary text-lg" /> سفارش‌های من
            </h3>

            {ordersLoading ? (
              <p className="text-center text-gray-light py-6">در حال بارگذاری...</p>
            ) : ordersError ? (
              <p className="text-red-500 text-center py-6">{ordersError}</p>
            ) : orders.length === 0 ? (
              <p className="text-center text-gray-light py-6">شما هنوز سفارشی ثبت نکرده‌اید.</p>
            ) : (
              <div className="space-y-6 max-h-[83.5vh] overflow-y-auto pr-2">
                {orders.map((order) => (
                  <motion.div
                    key={order._id}
                    className="bg-dark2 p-6 rounded-lg shadow-md hover:shadow-xl transition"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-primary font-semibold">#{order._id.slice(-6)}</span>
                      <span className="text-gray-med text-sm">{new Date(order.createdAt).toLocaleDateString("fa-IR")}</span>
                    </div>
                    <div className="mt-4 space-y-2">
                      {order.items.map((item) => (
                        <div key={item.product._id} className="flex justify-between text-gray-light text-sm">
                          <span>{item.product.name} × {item.quantity}</span>
                          <span>{(item.product.price * item.quantity).toLocaleString("fa-IR")} تومان</span>
                        </div>
                      ))}
                      <div className="border-t border-gray-med pt-3 flex justify-between text-sm">
                        <span>مبلغ کل: {order.totalAmount.toLocaleString("fa-IR")} تومان</span>
                        {order.discountAmount > 0 && <span className="text-green-400">تخفیف: {order.discountAmount.toLocaleString("fa-IR")} تومان</span>}
                      </div>
                      <div className="text-sm text-gray-light mt-2">
                        روش پرداخت: {order.paymentMethod === "whatsapp" ? "واتساپ" : order.paymentMethod}
                        {order.whatsappOrderUrl && (
                          <a href={order.whatsappOrderUrl} className="block mt-1 text-primary underline" target="_blank" rel="noopener noreferrer">
                            مشاهده در واتساپ
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </main>
  );
}
