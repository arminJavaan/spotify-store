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
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
    fetchOrders();
    fetchDiscountInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userLoading]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await API.get("/orders");
      setOrders(res.data);
      setOrdersError(null);
    } catch (err) {
      console.error("Error fetching orders:", err.response?.data || err.message);
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
    } catch (err) {
      console.error(
        "Error fetching discount info:",
        err.response?.data || err.message
      );
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
      await fetchUserAgain();
    } catch (err) {
      console.error(
        "Error updating profile:",
        err.response?.data || err.message
      );
      setProfileError(err.response?.data?.msg || "خطا در به‌روزرسانی پروفایل");
    }
  };

  // مجدداً اطلاعات کاربر را از سرور دریافت می‌کنیم
  const fetchUserAgain = async () => {
    try {
      const res = await API.get("/auth/me");
      // تنها setUser در context انجام می‌شود، مثلاً با تغییر دادن state inside AuthContext
      // اما برای سادگی اینجا کل صفحه را Refresh می‌کنیم:
      window.location.reload();
    } catch {
      window.location.reload();
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
        {/* Sidebar: Profile + Discount */}
        <div className="space-y-8">
          {/* Header */}
          <motion.div
            className="flex items-center justify-between m-5 rounded-2xl shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-primary">
              خوش آمدی، {user.name}
            </h2>
            <button
              onClick={logout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              <FiHome className="text-lg" />
              <span>خروج</span>
            </button>
          </motion.div>

          {/* Profile Section */}
          <motion.section
            className="bg-dark1 p-6 rounded-2xl shadow-lg"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold flex items-center text-gray-light">
                <FiUser className="ml-2 text-primary" />
                پروفایل من
              </h3>
              <button
                onClick={() => setEditing((prev) => !prev)}
                className="bg-primary hover:bg-opacity-90 text-dark2 px-3 py-1 rounded-lg transition flex items-center space-x-1"
              >
                {editing ? (
                  <>
                    <FiXCircle />
                    <span>لغو</span>
                  </>
                ) : (
                  <>
                    <FiEdit2 />
                    <span>ویرایش</span>
                  </>
                )}
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
                  <div className="space-y-2">
                    <label className="text-gray-light">نام و نام خانوادگی</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-dark2 text-gray-light border border-gray-med rounded-lg focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-light">ایمیل</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-dark2 text-gray-light border border-gray-med rounded-lg focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-light">شماره تلفن</label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-dark2 text-gray-light border border-gray-med rounded-lg focus:outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-light">
                      رمز عبور جدید (اختیاری)
                    </label>
                    <input
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 bg-dark2 text-gray-light border border-gray-med rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>

                  {profileError && (
                    <p className="text-red-500 text-sm">{profileError}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center bg-primary hover:bg-opacity-90 text-dark2 py-2 rounded-lg transition space-x-1"
                  >
                    <FiSave className="text-lg" />
                    <span>ذخیره تغییرات</span>
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  className="space-y-3 text-gray-light"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center space-x-2">
                    <FiUser className="text-primary text-lg" />
                    <span>نام: {user.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiMail className="text-primary text-lg" />
                    <span>ایمیل: {user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiPhone className="text-primary text-lg" />
                    <span>تلفن: {user.phone}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

          {/* Discount Section */}
          <motion.section
            className="bg-dark1 p-6 rounded-2xl shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-xl font-semibold text-gray-light mb-4 flex items-center">
              <FiPercent className="ml-2 text-primary text-lg" />
              کد تخفیف من
            </h3>

            {discountLoading ? (
              <p className="text-center text-gray-light">در حال بارگذاری...</p>
            ) : discountInfo && !discountInfo.error ? (
              <motion.div
                className="space-y-3 text-gray-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center space-x-2">
                  <FiGift className="text-primary text-lg" />
                  <strong>کد شما:</strong>
                  <span className="text-primary font-medium text-lg">
                    {discountInfo.code}
                  </span>
                </div>
                <div>
                  <strong>تعداد دفعات استفاده شده:</strong>{" "}
                  {discountInfo.uses}
                </div>
                <div>
                  <strong>تا کد ۷۰٪ بعدی مانده:</strong> {discountInfo.nextReward70}
                </div>
                <div>
                  <strong>تا اکانت رایگان مانده:</strong> {discountInfo.nextFree}
                </div>
                <div>
                  <strong>اکانت‌های رایگان دریافت‌شده:</strong> {discountInfo.freeCount}
                </div>
                <div>
                  <strong>کد‌های ۷۰٪ دریافت‌شده:</strong> {discountInfo.reward70Count}
                </div>
              </motion.div>
            ) : (
              <p className="text-red-500 text-center">
                {discountInfo?.error || "خطایی رخ داده است."}
              </p>
            )}
          </motion.section>
        </div>

        {/* Main Content: Orders */}
        <div className="lg:col-span-2">
          <motion.section
            className="bg-dark1 p-6 rounded-2xl shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold text-gray-light mb-4 flex items-center">
              <FiClock className="ml-2 text-primary text-lg" />
              سفارش‌های من
            </h3>

            {ordersLoading ? (
              <p className="text-center text-gray-light py-6">در حال بارگذاری...</p>
            ) : ordersError ? (
              <p className="text-red-500 text-center py-6">{ordersError}</p>
            ) : orders.length === 0 ? (
              <p className="text-center text-gray-light py-6">
                شما هنوز سفارشی ثبت نکرده‌اید.
              </p>
            ) : (
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                {orders.map((order) => {
                  const isPending = order.status === "pending";
                  const isCompleted = order.status === "completed";
                  const isCancelled = order.status === "cancelled";

                  return (
                    <motion.div
                      key={order._id}
                      className="bg-dark2 p-6 rounded-lg shadow-md hover:shadow-xl transition"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6">
                          <span className="text-primary font-semibold">#{order._id.slice(-6)}</span>
                          <span className="text-gray-med text-sm">
                            {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                          </span>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center space-x-3">
                          {isPending && (
                            <>
                              <FiClock className="text-yellow-500 text-lg" />
                              <span className="text-yellow-500">در انتظار</span>
                            </>
                          )}
                          {isCompleted && (
                            <>
                              <FiCheckCircle className="text-green-500 text-lg" />
                              <span className="text-green-500">تکمیل‌شده</span>
                            </>
                          )}
                          {isCancelled && (
                            <>
                              <FiXCircle className="text-red-500 text-lg" />
                              <span className="text-red-500">لغو‌شده</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item.product._id}
                            className="flex justify-between text-gray-light text-sm"
                          >
                            <span>
                              {item.product.name} × {item.quantity}
                            </span>
                            <span>
                              {Number(item.product.price * item.quantity).toLocaleString("fa-IR")} تومان
                            </span>
                          </div>
                        ))}
                        <div className="mt-3 border-t border-gray-med pt-3 flex flex-col md:flex-row md:justify-between">
                          <div>
                            <span className="text-gray-light text-sm">
                              <strong>مبلغ کل:</strong> {Number(order.totalAmount).toLocaleString("fa-IR")} تومان
                            </span>
                            {order.discountAmount > 0 && (
                              <span className="block text-green-400 text-sm mt-1">
                                <strong>تخفیف:</strong> {order.discountAmount.toLocaleString("fa-IR")} تومان
                              </span>
                            )}
                          </div>
                          <div className="mt-3 md:mt-0 flex flex-col items-end space-y-2">
                            <span className="text-gray-light text-sm">
                              <strong>روش پرداخت:</strong>{" "}
                              {order.paymentMethod === "whatsapp" ? "واتساپ" : order.paymentMethod}
                            </span>
                            {order.paymentMethod === "whatsapp" && order.whatsappOrderUrl && (
                              <a
                                href={order.whatsappOrderUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center bg-primary hover:bg-opacity-90 text-dark2 px-4 py-2 rounded-lg text-sm transition space-x-1"
                              >
                                <span>مشاهده در واتساپ</span>
                                <FiGift className="text-lg" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </main>
  );
}
