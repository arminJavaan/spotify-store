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
  const isTopup = new URLSearchParams(location.search).get("mode") === "wallet-topup";

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
      `سلام !\nمن میخوام کیف پولمو توی وبسایت به مبلغ ${(+(amount || 0)).toLocaleString("fa-IR")} تومان شارژ کنم\nایمیل اکانتم توی سایتتون ${email} هستش\nاینم رسید واریزی من به کارتی که اعلام کرده بودید\n\nممنونم !!`
    );

  const total = cart?.reduce((sum, item) => sum + item.product.price * item.quantity, 0) || 0;
  const discountAmount = Math.floor((total * discountPercentage) / 100);
  const finalTotal = total - discountAmount;

  const ProgressBar = () => (
    <div className="w-full bg-dark2 rounded-full h-2.5 mb-20 mt-12">
      <div className="bg-primary h-2.5 rounded-full w-full transition-all duration-500" />
      <div className="text-center text-sm text-gray-med mt-2">مرحله ۲ از ۲: پرداخت</div>
    </div>
  );

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

  const submitTopup = async () => {
    if (!amount.trim() || isNaN(+amount) || +amount <= 0) {
      setError("مبلغ معتبر وارد کنید");
      return;
    }

    try {
      if (method === "shaparak") {
        alert("اتصال به درگاه برای شارژ کیف پول");
        // اتصال به درگاه
      } else if (method === "card-to-card") {
        await API.post("/wallet/topup", {
          method: "card-to-card",
          amount: +amount,
        });
        alert("درخواست شارژ کیف پول ثبت شد و پس از بررسی ادمین حساب شما شارژ می‌شود.");
        navigate("/wallet");
      }
    } catch (err) {
      const msg = err.response?.data?.msg || err.message;
      setError("خطا در ثبت درخواست شارژ: " + msg);
    }
  };

  const submitOrder = async () => {
    setError(null);
    setLoading(true);
    const payloadDiscountCode = discountCode.trim() || null;

    try {
      if (method === "crypto") {
        const orderRes = await API.post("/orders", {
          paymentMethod: "crypto",
          paymentDetails: {},
          discountCode: payloadDiscountCode,
        });
        const orderId = orderRes.data.order._id;
        const usdAmount = (freeAccount ? 0 : finalTotal / 42000).toFixed(2);
        const chargeRes = await API.post("/crypto/create-charge", {
          orderId,
          amount: usdAmount,
          currency: "USD",
        });
        window.location.href = chargeRes.data.hostedUrl;
        return;
      }

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
      else if (method === "whatsapp") window.open(res.data.order.whatsappOrderUrl, "_blank");
      else alert("سفارش شما با موفقیت ثبت شد.");

      clearCart();
      navigate("/orders");
    } catch (err) {
      const msg = err.response?.data?.msg || err.message;
      setError("خطا در ثبت سفارش: " + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="text-gray-light py-20 px-6 min-h-screen mt-12">
      <motion.h2
        className="text-3xl font-bold text-primary mb-8 text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {isTopup ? "شارژ کیف پول" : "اطلاعات سفارش و پرداخت"}
      </motion.h2>

      <ProgressBar />

      <div className="max-w-3xl mx-auto space-y-8">
        {!isTopup && (
          <motion.div
            className="bg-dark1 p-6 rounded-2xl shadow-xl"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold text-gray-light mb-4">خلاصهٔ سفارش</h3>
            {cart.map((item) => (
              <div key={item.product._id} className="flex justify-between mb-2 text-gray-light">
                <span>{item.product.name} × {item.quantity}</span>
                <span>{(item.product.price * item.quantity).toLocaleString("fa-IR")} تومان</span>
              </div>
            ))}
            {discountPercentage > 0 && (
              <div className="flex justify-between mt-3 text-green-400">
                <span>تخفیف ({discountPercentage}%):</span>
                <span>- {discountAmount.toLocaleString("fa-IR")} تومان</span>
              </div>
            )}
            <div className="flex justify-between items-center mt-4">
              <span className="text-lg font-semibold">مبلغ نهایی:</span>
              <span className="text-lg font-bold text-primary">
                {freeAccount ? "رایگان" : `${finalTotal.toLocaleString("fa-IR")} تومان`}
              </span>
            </div>
          </motion.div>
        )}

        <motion.div
          className="bg-dark1 p-6 rounded-2xl shadow-xl space-y-6"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {!isTopup && (
            <div className="space-y-2">
              <label className="text-sm text-gray-light">کد تخفیف:</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="مثال: ABCD1234"
                  className="flex-1 px-4 py-2 bg-dark2 text-gray-light border border-gray-med rounded focus:outline-none focus:border-primary"
                />
                <button
                  onClick={applyDiscount}
                  className="bg-primary text-dark2 px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition"
                >
                  اعمال
                </button>
              </div>
              {discountError && <p className="text-red-500 text-sm">{discountError}</p>}
            </div>
          )}

          <div>
            <label className="text-sm text-gray-light mb-2 block">روش پرداخت:</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-4 py-2 bg-dark2 text-gray-light border border-gray-med rounded focus:outline-none focus:border-primary"
            >
              <option value="shaparak">درگاه اینترنتی (شاپرک)</option>
              <option value="card-to-card">کارت به کارت</option>
              {!isTopup && <>
                <option value="crypto">پرداخت ارز دیجیتال</option>
                <option value="wallet">پرداخت با کیف پول</option>
                <option value="whatsapp">سفارش از طریق واتساپ</option>
              </>}
            </select>
          </div>

          <AnimatePresence>
            {method === "wallet" && walletBalance !== null && (
              <motion.div
                className="bg-dark2 p-4 rounded text-sm text-gray-light space-y-2 border border-gray-med"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <p>💰 موجودی فعلی کیف پول: {walletBalance.toLocaleString("fa-IR")} تومان</p>
                <p>
                  {walletBalance >= finalTotal
                    ? `✅ پس از این خرید، موجودی شما: ${(walletBalance - finalTotal).toLocaleString("fa-IR")} تومان`
                    : "❌ موجودی شما برای این خرید کافی نیست."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {method === "card-to-card" && (
              <motion.div
                className="bg-dark2 p-4 rounded space-y-4 text-sm border border-gray-med"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <p>🔢 شماره کارت: <span className="text-primary font-bold">6037-9975-XXXX-XXXX</span></p>
                <p>🏦 بانک: ملت</p>
                <p>لطفاً پس از کارت به کارت، فیش واریزی را ارسال کنید:</p>
                <div className="flex flex-col gap-2">
                  <a
                    href={`https://wa.me/989158184550?text=${generateMessage(userEmail, amount || finalTotal)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-green-500 text-white text-center py-2 rounded hover:bg-green-600 transition"
                  >
                    ارسال فیش در واتساپ
                  </a>
                  <a
                    href={`https://t.me/sepotifyadmin/url?url=&text=${generateMessage(userEmail, amount || finalTotal)}`}
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

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          {isTopup ? (
            <div className="space-y-4">
              <label className="text-sm text-gray-light">مبلغ شارژ (تومان):</label>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                placeholder="مثلاً 50000"
                className="w-full px-4 py-2 bg-dark2 text-gray-light border border-gray-med rounded"
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
              {freeAccount && <p className="text-green-500 font-semibold">این سفارش به صورت رایگان پردازش خواهد شد 🎁</p>}
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
