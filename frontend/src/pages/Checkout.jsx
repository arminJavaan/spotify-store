// frontend/src/pages/Checkout.jsx

import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../contexts/CartContext";
import API from "../api";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isTopup =
    new URLSearchParams(location.search).get("mode") === "wallet-topup";

  const [method, setMethod] = useState("shaparak");
  const [cardNumber, setCardNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountError, setDiscountError] = useState(null);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [freeAccount, setFreeAccount] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (!cart?.length && !isTopup) navigate("/cart");
  }, [cart, navigate, isTopup]);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await API.get("/wallet");
        setWalletBalance(res.data.balance);
      } catch (err) {
        console.error("خطا در دریافت موجودی کیف پول:", err);
      }
    };
    if (method === "wallet") fetchWallet();
  }, [method]);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const res = await API.get("/auth/me");
        setUserEmail(res.data.email);
      } catch (err) {
        console.error("خطا در دریافت ایمیل کاربر:", err);
      }
    };
    fetchEmail();
  }, []);

  const generateMessage = (email, amount) =>
    encodeURIComponent(
      `سلام !\nمن میخوام کیف پولمو توی وبسایت به مبلغ ${(+(
        amount || 0
      )).toLocaleString(
        "fa-IR"
      )} تومان شارژ کنم\nایمیل اکانتم توی سایتتون ${email} هستش\nاینم رسید واریزی من به کارتی که اعلام کرده بودید\n\nممنونم !!`
    );

  const total =
    cart?.reduce((sum, item) => sum + item.product.price * item.quantity, 0) ||
    0;
  let discountAmount = Math.floor((total * discountPercentage) / 100);
  if (discountAmount > 200000) discountAmount = 200000;
  const finalTotal = total - discountAmount;

  const applyDiscount = async () => {
    setDiscountError(null);
    if (!discountCode.trim()) {
      setDiscountError("لطفاً کد تخفیف را وارد کنید.");
      return;
    }
    try {
      const res = await API.get(`/discounts/verify/${discountCode.trim()}`);
      setDiscountPercentage(res.data.percentage || 0);
      setFreeAccount(res.data.freeAccount === true);
    } catch (err) {
      const msg = err.response?.data?.msg || "کد تخفیف معتبر نیست";
      setDiscountError(msg);
      setDiscountPercentage(0);
      setFreeAccount(false);
    }
  };

  const submitOrder = async () => {
    setError(null);
    setLoading(true);
    const payloadDiscountCode = discountCode.trim() || null;

    if (freeAccount) {
      const isSingleItem = cart.length === 1 && cart[0].quantity === 1;
      if (!isSingleItem) {
        setError(
          "کد تخفیف رایگان فقط برای یک محصول خاص با تعداد ۱ قابل استفاده است."
        );
        setLoading(false);
        return;
      }
    }

    try {
      const paymentDetails = {};
      if (method === "card-to-card") {
        paymentDetails.cardNumber = cardNumber.trim();
        paymentDetails.bankName = bankName.trim();
      } else if (method === "shaparak") {
        paymentDetails.placeholder = "پرداخت اینترنتی شاپرک";
      }

      const res = await API.post("/orders", {
        paymentMethod: method,
        paymentDetails,
        discountCode: payloadDiscountCode,
      });

      if (method === "wallet") alert("سفارش شما با موفقیت از کیف پول ثبت شد.");
      else if (method === "whatsapp")
        window.open(res.data.order.whatsappOrderUrl, "_blank");
      else alert("سفارش شما با موفقیت ثبت شد.");

      clearCart();
      navigate(`/order/${res.data.order._id}`);
    } catch (err) {
      const msg = err.response?.data?.msg || err.message;
      setError("خطا در ثبت سفارش: " + msg);
    } finally {
      setLoading(false);
    }
  };

  const submitTopup = async () => {
  setError(null);
  setLoading(true);

  if (!amount || isNaN(amount) || +amount <= 0) {
    setError("لطفاً مبلغ معتبر وارد کنید.");
    setLoading(false);
    return;
  }

  try {
    await API.post("/wallet/topup", {
      amount: +amount,
      method,
    });

    alert("درخواست شارژ ثبت شد. لطفاً فیش واریزی را در واتساپ یا تلگرام ارسال کنید.");
    navigate("/dashboard");
  } catch (err) {
    const msg = err.response?.data?.msg || err.message;
    setError("خطا در ثبت درخواست شارژ: " + msg);
  } finally {
    setLoading(false);
  }
};


  return (
    <main className="text-gray-light py-20 px-6 min-h-screen mt-12 font-vazir">
      <motion.h2
        className="text-3xl font-extrabold text-primary mb-10 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {isTopup ? "شارژ کیف پول" : "اطلاعات سفارش و پرداخت"}
      </motion.h2>

      <div className="w-full max-w-3xl mx-auto mb-14">
        <div className="w-full bg-dark2 h-2.5 rounded-full overflow-hidden">
          <motion.div
            className="bg-primary h-full rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1 }}
          />
        </div>
        <p className="text-center text-sm text-gray-med mt-2">
          مرحله ۲ از ۲: پرداخت
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-10">
        {!isTopup && (
          <motion.div
            className="bg-dark1/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-bold text-white mb-4">
              🧾 خلاصه سفارش
            </h3>
            <div className="space-y-2 text-sm text-gray-light">
              {cart.map((item) => (
                <div key={item.product._id} className="flex justify-between">
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>
                    {(item.product.price * item.quantity).toLocaleString(
                      "fa-IR"
                    )}{" "}
                    تومان
                  </span>
                </div>
              ))}
              {discountPercentage > 0 && (
                <div className="flex justify-between mt-3 text-green-400 font-bold">
                  <span>تخفیف ({discountPercentage}%):</span>
                  <span>- {discountAmount.toLocaleString("fa-IR")} تومان</span>
                </div>
              )}
              {discountAmount === 200000 && (
                <div className="text-xs text-yellow-400">
                  (سقف تخفیف اعمال شد)
                </div>
              )}
              <div className="flex justify-between items-center mt-4 border-t border-gray-700 pt-3">
                <span className="text-base font-semibold">💳 مبلغ نهایی:</span>
                <span className="text-lg font-bold text-primary">
                  {freeAccount
                    ? "رایگان"
                    : `${finalTotal.toLocaleString("fa-IR")} تومان`}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* فرم تخفیف + پرداخت */}
        <motion.div
          className="bg-dark1/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl space-y-6"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* کد تخفیف */}
          {!isTopup && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-light">
                🎁 کد تخفیف:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="مثلاً: VIP2025"
                  className="flex-1 px-4 py-2 bg-dark2 text-white border border-gray-600 rounded focus:outline-none focus:border-primary"
                />
                <button
                  onClick={applyDiscount}
                  className="bg-primary text-dark1 px-4 py-2 rounded-lg font-bold hover:bg-opacity-90 transition "
                >
                  اعمال
                </button>
              </div>
              {discountError && (
                <p className="text-red-500 text-sm">{discountError}</p>
              )}
            </div>
          )}

          {/* روش پرداخت */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-light">
              💼 روش پرداخت:
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-4 py-2 bg-dark2 text-white border border-gray-600 rounded focus:outline-none focus:border-primary text-sm"
            >
              <option value="shaparak">درگاه اینترنتی (شاپرک)</option>
              <option value="card-to-card">کارت به کارت</option>
              {!isTopup && (
                <>
                  <option value="crypto">پرداخت ارز دیجیتال</option>
                  <option value="wallet">پرداخت با کیف پول</option>
                  <option value="whatsapp">سفارش از طریق واتساپ</option>
                </>
              )}
            </select>
          </div>

          {/* حالت کیف پول */}
          <AnimatePresence>
            {method === "wallet" && walletBalance !== null && (
              <motion.div
                className="bg-dark2 p-4 rounded text-sm text-gray-light space-y-2 border border-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <p>
                  💰 موجودی فعلی: {walletBalance.toLocaleString("fa-IR")} تومان
                </p>
                <p>
                  {walletBalance >= finalTotal
                    ? `✅ موجودی بعد از خرید: ${(
                        walletBalance - finalTotal
                      ).toLocaleString("fa-IR")} تومان`
                    : "❌ موجودی برای این خرید کافی نیست"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* حالت کارت به کارت */}
          <AnimatePresence>
            {method === "card-to-card" && (
              <motion.div
                className="bg-dark2 p-4 rounded space-y-4 text-sm border border-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <p>
                  🔢 شماره کارت:{" "}
                  <span className="text-primary font-bold">
                    8163-7075-8610-6219
                  </span>
                </p>
                <p>🏦 بانک: سامان</p>
                <p>👤 به نام: کیارش آتشی</p>
                <p>پس از واریز، فیش را ارسال کنید:</p>
                <div className="flex flex-col gap-2">
                  <a
                    href={`https://wa.me/989158184550?text=${generateMessage(
                      userEmail,
                      amount || finalTotal
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-green-500 text-white text-center py-2 rounded hover:bg-green-600 transition"
                  >
                    ارسال فیش در واتساپ
                  </a>
                  <a
                    href={`https://t.me/sepotifyadmin/url?url=&text=${generateMessage(
                      userEmail,
                      amount || finalTotal
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-500 text-white text-center py-2 rounded hover:bg-blue-600 transition"
                  >
                    ارسال فیش در تلگرام
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ارور کلی */}
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          {/* دکمه اصلی */}
          {isTopup ? (
            <div className="space-y-4">
              <label className="text-sm text-gray-light">
                مبلغ شارژ (تومان):
              </label>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                placeholder="مثلاً 50000"
                className="w-full px-4 py-2 bg-dark2 text-gray-light border border-gray-600 rounded"
              />
              <button
                onClick={submitTopup}
                className="w-full bg-primary text-dark2 font-semibold py-3 rounded-lg hover:bg-opacity-90 transition"
              >
                ادامه و پرداخت
              </button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              {freeAccount && (
                <p className="text-green-500 font-semibold">
                  این سفارش به صورت رایگان پردازش خواهد شد 🎁
                </p>
              )}
              <button
                onClick={submitOrder}
                disabled={loading}
                className="w-full bg-primary text-dark2 font-semibold py-3 rounded-lg hover:bg-opacity-90 transition"
              >
                {loading ? "در حال پردازش..." : "ثبت سفارش نهایی"}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
