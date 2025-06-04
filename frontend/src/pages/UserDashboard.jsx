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
  FiGift,
  FiPercent,
  FiCalendar,
  FiArrowRightCircle,
  FiCode,
  FiDollarSign,
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
  const [wallet, setWallet] = useState(null);
  const [walletLoading, setWalletLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (userLoading || !user) return;
    API.get("/wallet")
      .then((res) => setWallet(res.data))
      .catch(() => setWallet(null))
      .finally(() => setWalletLoading(false));
  }, [user, userLoading]);

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

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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
      <div className="flex items-center justify-center h-screen bg-dark2 text-gray-light font-vazir">
        <p>در حال بارگذاری...</p>
      </div>
    );
  }
  if (!user) return null;

  return (
    <main className="mt-12 min-h-screen py-10 px-4 font-vazir">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-6">
          <motion.div
            className="bg-gradient-to-r from-[#1db95433] to-[#1db95411] border border-[#1db95444] backdrop-blur-md p-6 rounded-3xl shadow-xl flex justify-between items-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xl font-extrabold text-primary tracking-tight">
              👋 سلام، {user.name}
            </h2>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-semibold shadow transition flex items-center gap-2"
            >
              <FiHome /> خروج
            </button>
          </motion.div>

          {/* Profile box */}
          <motion.div
            className="bg-dark2 p-6 rounded-3xl shadow-lg border border-gray-700"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-light flex items-center">
                <FiUser className="ml-2 text-primary" /> پروفایل من
              </h3>
              <button
                onClick={() => setEditing(!editing)}
                className="text-xs px-3 py-1 rounded-full bg-primary text-dark1 hover:bg-opacity-90 flex items-center gap-1"
              >
                {editing ? <FiXCircle /> : <FiEdit2 />}
                {editing ? "لغو" : "ویرایش"}
              </button>
            </div>

            <AnimatePresence>
              {editing ? (
                <motion.form
                  onSubmit={handleProfileSubmit}
                  className="space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {["name", "email", "phone"].map((field) => (
                    <input
                      key={field}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      placeholder={
                        field === "name"
                          ? "نام"
                          : field === "email"
                          ? "ایمیل"
                          : "تلفن"
                      }
                      className="w-full px-4 py-2 rounded-xl bg-dark3 text-gray-light border border-gray-600 focus:outline-none focus:border-primary placeholder-gray-500 text-sm"
                      required
                    />
                  ))}
                  <input
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="رمز عبور جدید"
                    type="password"
                    className="w-full px-4 py-2 rounded-xl bg-dark3 text-gray-light border border-gray-600 focus:outline-none focus:border-primary placeholder-gray-500 text-sm"
                  />
                  {profileError && (
                    <p className="text-red-500 text-xs mt-1">{profileError}</p>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-primary text-dark1 py-2 rounded-full font-bold hover:bg-opacity-90"
                  >
                    ذخیره اطلاعات
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  className="space-y-2 text-sm text-gray-light"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center gap-2 text-gray-300">
                    <FiUser className="text-primary" /> {user.name}
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <FiMail className="text-primary" /> {user.email}
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <FiPhone className="text-primary" /> {user.phone}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Wallet Info and Transactions */}
          <motion.div
            className="bg-dark1 p-5 rounded-2xl shadow-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-light flex items-center mb-3">
              <FiDollarSign className="ml-2 text-primary" /> کیف پول من
            </h3>
            {walletLoading ? (
              <p className="text-center text-gray-light">
                در حال دریافت موجودی...
              </p>
            ) : wallet ? (
              <>
                <div className="text-sm text-gray-light space-y-3 mb-4">
                  <p>
                    💰 موجودی فعلی:{" "}
                    <span className="text-primary font-bold">
                      {wallet.balance.toLocaleString("fa-IR")} تومان
                    </span>
                  </p>
                  <button
                    onClick={() => navigate("/checkout?mode=wallet-topup")}
                    className="bg-primary text-dark1 px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition"
                  >
                    شارژ کیف پول
                  </button>
                </div>

                <div className="border-t border-gray-700 pt-3">
                  <h4 className="text-sm font-bold text-gray-light mb-2">
                    تراکنش‌های اخیر:
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {wallet.transactions && wallet.transactions.length > 0 ? (
                      wallet.transactions
                        .slice()
                        .reverse()
                        .map((tx, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded border ${
                              tx.type === "increase"
                                ? "border-green-500 bg-green-900/10"
                                : tx.type === "decrease"
                                ? "border-red-500 bg-red-900/10"
                                : "border-yellow-500 bg-yellow-900/10"
                            } text-sm text-gray-light`}
                          >
                            <div className="flex justify-between">
                              <span className="font-mono text-xs text-gray-400">
                                {new Date(tx.createdAt).toLocaleDateString(
                                  "fa-IR"
                                )}
                              </span>
                              <span
                                className={`font-bold ${
                                  tx.type === "increase"
                                    ? "text-green-400"
                                    : tx.type === "decrease"
                                    ? "text-red-400"
                                    : "text-yellow-300"
                                }`}
                              >
                                {tx.type === "increase"
                                  ? "+"
                                  : tx.type === "decrease"
                                  ? "-"
                                  : ""}{" "}
                                {tx.amount.toLocaleString("fa-IR")} تومان
                              </span>
                            </div>
                            <div className="text-xs mt-1 text-gray-300">
                              {tx.description}
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-gray-500 text-xs">
                        تراکنشی ثبت نشده است.
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-red-500 text-sm">
                خطا در دریافت اطلاعات کیف پول
              </p>
            )}
          </motion.div>

          {/* Discount */}
          <motion.div
            className="bg-dark1 p-5 rounded-2xl shadow-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-light flex items-center mb-3">
              <FiPercent className="ml-2 text-primary" /> کدهای تخفیف
            </h3>
            {discountLoading ? (
              <p className="text-center text-gray-light">در حال بارگذاری...</p>
            ) : discountInfo && !discountInfo.error ? (
              <div className="space-y-2 text-sm text-gray-light">
                <div className="bg-dark2 p-3 rounded border border-gray-med">
                  <div className="flex justify-between mb-1">
                    <span className="text-primary font-bold">کد شخصی:</span>
                    <span className="font-mono">{discountInfo.code}</span>
                  </div>
                  <div className="text-xs flex justify-between">
                    <span>تعداد استفاده: {discountInfo.uses}</span>
                    {discountInfo.expiresAt && (
                      <span className="flex items-center">
                        <FiCalendar className="ml-1" />
                        {new Date(discountInfo.expiresAt).toLocaleDateString(
                          "fa-IR"
                        )}
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-dark2 p-3 rounded border border-gray-med">
                  <div className="text-green-400 font-bold">
                    کدهای ۷۰٪: {discountInfo.reward70Count}
                  </div>
                  <div>تا کد بعدی: {discountInfo.nextReward70}</div>
                </div>

                <div className="bg-dark2 p-3 rounded border border-gray-med">
                  <div className="text-blue-400 font-bold">
                    اکانت رایگان: {discountInfo.freeCount}
                  </div>
                  <div>تا بعدی: {discountInfo.nextFree}</div>
                </div>

                {/* نمایش لیست همه کدهای تولید شده */}
                <div className="mt-4">
                  <h4 className="font-bold text-primary mb-2 flex items-center">
                    <FiCode className="ml-1" /> کدهای تولید شده برای شما
                  </h4>
                  <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                    {discountInfo.codes?.length > 0 ? (
                      discountInfo.codes.map((dc, idx) => (
                        <div
                          key={idx}
                          className="bg-dark2 p-2 rounded border border-gray-med text-xs flex flex-col"
                        >
                          <div className="flex justify-between">
                            <span className="font-mono">{dc.code}</span>
                            <span>
                              {dc.type === "personal"
                                ? "۱۵٪ شخصی"
                                : dc.type === "reward70"
                                ? "۷۰٪ جایزه"
                                : dc.type === "freeAccount"
                                ? "اکانت رایگان"
                                : "کد سفارشی"}
                            </span>
                          </div>
                          <div className="flex justify-between mt-1 text-gray-400">
                            <span>استفاده: {dc.uses}</span>
                            {dc.expiresAt && (
                              <span>
                                انقضا:{" "}
                                {new Date(dc.expiresAt).toLocaleDateString(
                                  "fa-IR"
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm">کدی ثبت نشده است.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-red-500">
                {discountInfo?.error || "خطایی رخ داده است."}
              </p>
            )}
          </motion.div>
        </div>

        {/* سفارش‌ها */}
        <div className="lg:col-span-2">
          <motion.section
            className="bg-dark1 p-6 rounded-2xl shadow-lg"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-gray-light mb-4 flex items-center">
              <FiClock className="ml-2 text-primary text-lg" /> سفارش‌های من
            </h3>
            {ordersLoading ? (
              <p className="text-gray-light text-center">در حال بارگذاری...</p>
            ) : ordersError ? (
              <p className="text-red-500 text-center">{ordersError}</p>
            ) : orders.length === 0 ? (
              <p className="text-center text-gray-light">
                شما هنوز سفارشی ثبت نکرده‌اید.
              </p>
            ) : (
              <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
                {orders.map((order) => (
                  <motion.div
                    key={order._id}
                    className="bg-dark2 p-5 rounded-lg shadow hover:shadow-xl transition"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-primary font-semibold">
                        #{order._id.slice(-6)}
                      </span>
                      <span className="text-gray-med text-xs">
                        {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                      </span>
                    </div>
                    <div className="text-sm text-gray-light space-y-2">
                      {order.items.map((item) => (
                        <div
                          key={item.product._id}
                          className="flex justify-between"
                        >
                          <span>
                            {item.product.name} × {item.quantity}
                          </span>
                          <span>
                            {(
                              item.product.price * item.quantity
                            ).toLocaleString("fa-IR")}{" "}
                            تومان
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-gray-med pt-2 flex justify-between">
                        <span>
                          مبلغ کل: {order.totalAmount.toLocaleString("fa-IR")}{" "}
                          تومان
                        </span>
                        {order.discountAmount > 0 && (
                          <span className="text-green-400">
                            تخفیف:{" "}
                            {order.discountAmount.toLocaleString("fa-IR")} تومان
                          </span>
                        )}
                      </div>
                      <div>
                        روش پرداخت:{" "}
                        {order.paymentMethod === "whatsapp"
                          ? "واتساپ"
                          : order.paymentMethod}
                        {order.whatsappOrderUrl && (
                          <a
                            href={order.whatsappOrderUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-primary underline text-xs mt-1"
                          >
                            مشاهده در واتساپ
                          </a>
                        )}
                        <p className="text-xs mt-1">
                          وضعیت سفارش:{" "}
                          <span
                            className={
                              order.status === "completed"
                                ? "text-green-400"
                                : order.status === "cancelled"
                                ? "text-red-400"
                                : "text-yellow-400"
                            }
                          >
                            {order.status === "completed"
                              ? "تکمیل شده"
                              : order.status === "cancelled"
                              ? "لغو شده"
                              : "در انتظار"}
                          </span>
                        </p>
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
