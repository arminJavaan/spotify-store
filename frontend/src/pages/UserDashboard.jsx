import React, { useContext, useEffect, useState } from "react";
import API from "../api";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  const [profileError, setProfileError] = useState(null);
  const [ordersError, setOrdersError] = useState(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [discountInfo, setDiscountInfo] = useState(null);
  const [discountLoading, setDiscountLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !userLoading) navigate("/login");
    if (user) {
      setFormData({ name: user.name, email: user.email, phone: user.phone });
      fetchOrders();
      fetchDiscountInfo();
    }
  }, [user, userLoading, navigate]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await API.get("/orders");
      setOrders(res.data);
      setOrdersError(null);
    } catch (err) {
      console.error(
        "Error fetching orders:",
        err.response?.data || err.message
      );
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
    } finally {
      setDiscountLoading(false);
    }
  };
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    setProfileError(null);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      };
      if (password) payload.password = password;
      await API.put("/auth/profile", payload);
      setEditing(false);
      window.location.reload();
    } catch (err) {
      console.error(
        "Error updating profile:",
        err.response?.data || err.message
      );
      setProfileError(err.response?.data?.msg || "خطا در به‌روزرسانی پروفایل");
    } finally {
      setUpdatingProfile(false);
    }
  };

  if (userLoading) {
    return (
      <p className="text-center text-gray-light py-20">در حال بارگذاری...</p>
    );
  }
  if (!user) return null;

  return (
    <main className="relative min-h-screen py-12 px-6 mt-12">
      <div className="absolute inset-0 bg-opacity-0 -z-10" />
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-dark1 rounded-2xl p-6 shadow-lg">
          <motion.h2
            className="text-3xl font-bold text-primary mb-4 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            خوش آمدی، {user.name}
          </motion.h2>
          <button
            onClick={logout}
            className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            <FiHome className="ml-1" />
            خروج از حساب
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Section */}
          <motion.section
            className="col-span-1 bg-dark1 p-6 rounded-2xl shadow-lg"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold text-gray-light flex items-center">
                <FiUser className="ml-2" /> پروفایل من
              </h3>
              <button
                onClick={() => setEditing(!editing)}
                className="bg-primary hover:bg-opacity-90 text-dark2 px-3 py-1 rounded-lg transition"
              >
                <FiEdit2 className="inline ml-1" />
                {editing ? "لغو" : "ویرایش"}
              </button>
            </div>

            {editing ? (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-gray-light">
                    نام و نام خانوادگی
                  </label>
                  <div className="flex items-center bg-dark2 border border-gray-med rounded-lg">
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-transparent focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-light">ایمیل</label>
                  <div className="flex items-center bg-dark2 border border-gray-med rounded-lg">
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-transparent focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-light">شماره تلفن</label>
                  <div className="flex items-center bg-dark2 border border-gray-med rounded-lg">
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-transparent focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-light">
                    رمز عبور جدید (اختیاری)
                  </label>
                  <div className="flex items-center bg-dark2 border border-gray-med rounded-lg">
                    <input
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                {profileError && (
                  <p className="text-red-500 text-sm">{profileError}</p>
                )}

                <button
                  type="submit"
                  disabled={updatingProfile}
                  className={`w-full flex items-center justify-center bg-primary hover:bg-opacity-90 text-dark2 py-2 rounded-lg transition ${
                    updatingProfile ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <FiSave className="ml-2" />
                  ذخیره تغییرات
                </button>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center">
                  <FiUser className="ml-2 text-primary" />
                  <span>نام: {user.name}</span>
                </div>
                <div className="flex items-center">
                  <FiMail className="ml-2 text-primary" />
                  <span>ایمیل: {user.email}</span>
                </div>
                <div className="flex items-center">
                  <FiPhone className="ml-2 text-primary" />
                  <span>شماره تلفن: {user.phone}</span>
                </div>
              </div>
            )}
          </motion.section>

          {/* Discount Code Section */}
          <motion.section
            className="col-span-1 bg-dark1 p-6 rounded-2xl shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold text-gray-light flex items-center">
                <FiPercent className="ml-2 text-primary" /> کد تخفیف من
              </h3>
            </div>
            {discountLoading ? (
              <p className="text-center text-gray-light">در حال بارگذاری...</p>
            ) : discountInfo ? (
              <div className="space-y-3 text-gray-light">
                <div>
                  <strong>کد شما:</strong>{" "}
                  <span className="text-primary font-medium">
                    {discountInfo.code}
                  </span>
                </div>
                <div>
                  <strong>تعداد دفعات استفاده شده:</strong> {discountInfo.uses}
                </div>
                <div>
                  <strong>تا کد ۷۰٪ باقی‌مانده:</strong>{" "}
                  {discountInfo.nextReward70}
                </div>
                <div>
                  <strong>تا اکانت رایگان باقی‌مانده:</strong>{" "}
                  {discountInfo.nextFree}
                </div>
                <div>
                  <strong>تعداد اکانت رایگان دریافت شده:</strong>{" "}
                  {discountInfo.freeCount}
                </div>
                <div>
                  <strong>تعداد کد ۷۰٪ دریافت شده:</strong>{" "}
                  {discountInfo.reward70Count}
                </div>
              </div>
            ) : (
              <p className="text-red-500 text-center">
                خطا در دریافت اطلاعات تخفیف
              </p>
            )}
          </motion.section>

          {/* Orders Section */}
          <motion.section
            className="col-span-2 bg-dark1 p-6 rounded-2xl shadow-lg"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-semibold text-gray-light mb-4 flex items-center">
              <FiClock className="ml-2" /> سفارش‌های من
            </h3>
            {ordersLoading ? (
              <p className="text-center text-gray-light py-4">
                در حال بارگذاری...
              </p>
            ) : ordersError ? (
              <p className="text-red-500">{ordersError}</p>
            ) : orders.length === 0 ? (
              <p className="text-center text-gray-light">
                شما هنوز سفارشی ثبت نکرده‌اید.
              </p>
            ) : (
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                {orders.map((order, idx) => {
                  const isPending = order.status === "pending";
                  const isCompleted = order.status === "completed";
                  const isCancelled = order.status === "cancelled";

                  return (
                    <div
                      key={order._id}
                      className="bg-dark2 p-4 rounded-lg border border-gray-med flex flex-col md:flex-row justify-between items-start"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-2 md:space-y-0 w-full md:w-auto">
                        <span className="text-primary font-medium">
                          #{order._id.slice(-6)}
                        </span>
                        <span className="text-gray-med text-sm">
                          {new Date(order.createdAt).toLocaleDateString(
                            "fa-IR"
                          )}
                        </span>
                      </div>
                      <div className="mt-3 md:mt-0 flex-1">
                        {order.items.map((item) => (
                          <div
                            key={item.product._id}
                            className="flex justify-between text-gray-light text-sm mb-1"
                          >
                            <span>
                              {item.product.name} × {item.quantity}
                            </span>
                            <span>
                              {Number(
                                item.product.price * item.quantity
                              ).toLocaleString("fa-IR")}{" "}
                              تومان
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 md:mt-0 flex flex-col items-end">
                        <span className="text-gray-light text-sm mb-1">
                          <strong>مبلغ کل:</strong>{" "}
                          {Number(order.totalAmount).toLocaleString("fa-IR")}{" "}
                          تومان
                        </span>
                        {order.discountAmount > 0 && (
                          <span className="text-green-400 text-sm mb-1">
                            <strong>تخفیف:</strong>{" "}
                            {order.discountAmount.toLocaleString("fa-IR")} تومان
                          </span>
                        )}
                        <div className="flex items-center space-x-2 mb-2">
                          {isPending && (
                            <>
                              <FiClock className="text-yellow-500" />
                              <span className="text-yellow-500">در انتظار</span>
                            </>
                          )}
                          {isCompleted && (
                            <>
                              <FiCheckCircle className="text-green-500" />
                              <span className="text-green-500">تکمیل‌شده</span>
                            </>
                          )}
                          {isCancelled && (
                            <>
                              <FiXCircle className="text-red-500" />
                              <span className="text-red-500">لغو‌شده</span>
                            </>
                          )}
                        </div>
                        <span className="text-gray-light text-sm mb-1">
                          <strong>روش پرداخت:</strong>{" "}
                          {order.paymentMethod === "whatsapp"
                            ? "واتساپ"
                            : order.paymentMethod}
                        </span>
                        {order.paymentMethod === "whatsapp" &&
                          order.whatsappOrderUrl && (
                            <a
                              href={order.whatsappOrderUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block bg-primary hover:bg-opacity-90 text-dark2 px-3 py-1 rounded-lg text-sm transition"
                            >
                              مشاهده در واتساپ
                            </a>
                          )}
                      </div>
                    </div>
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
