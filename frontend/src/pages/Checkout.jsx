// frontend/src/pages/Checkout.jsx

import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../contexts/CartContext";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [method, setMethod] = useState("shaparak");
  const [cryptoType, setCryptoType] = useState("ETH_BASE");
  const [cardNumber, setCardNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [discountError, setDiscountError] = useState(null);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [freeAccount, setFreeAccount] = useState(false);

  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discountAmount = Math.floor((rawTotal * discountPercentage) / 100);
  const finalTotal = rawTotal - discountAmount;

  const submitOrder = async () => {
    try {
      const paymentDetails = {};
      if (method === "crypto") {
        paymentDetails.cryptoType = cryptoType;
      } else if (method === "card-to-card") {
        paymentDetails.cardNumber = cardNumber.trim();
        paymentDetails.bankName = bankName.trim();
      } else if (method === "shaparak") {
        paymentDetails.placeholder = "پرداخت اینترنتی شاپرک";
      }
      // اگر کد تخفیف FreeAccount است (فری اکانت) ⇒ نباید مبلغی پرداخت شود
      let payloadDiscountCode = null;
      if (discountCode) {
        payloadDiscountCode = discountCode.trim();
      }
      const res = await API.post("/orders", {
        paymentMethod: method,
        paymentDetails,
        discountCode: payloadDiscountCode,
      });

      if (method === "whatsapp") {
        window.open(res.data.order.whatsappOrderUrl, "_blank");
      } else {
        alert("سفارش شما با موفقیت ثبت شد.");
        clearCart();
        navigate("/orders");
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.msg || err.message;
      alert("خطا در ثبت سفارش: " + msg);
    }
  };

  // تابع اعتبارسنجی کد
  const applyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError("لطفاً کد تخفیف را وارد کنید.");
      return;
    }
    try {
      const res = await API.get(`/discounts/verify/${discountCode.trim()}`);
      setDiscountPercentage(res.data.percentage || 0);
      setFreeAccount(res.data.freeAccount === true);
      setDiscountError(null);
    } catch (err) {
      const msg = err.response?.data?.msg || "کد تخفیف معتبر نیست";
      setDiscountError(msg);
      setDiscountPercentage(0);
      setFreeAccount(false);
    }
  };

  return (
    <main className=" text-gray-light py-20 px-6 min-h-screen">
      <motion.h2
        className="text-3xl font-bold text-primary mb-8 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        اطلاعات سفارش و پرداخت
      </motion.h2>

      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div
          className="bg-dark1 p-6 rounded-2xl shadow-lg"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-gray-light mb-4">
            خلاصهٔ سفارش
          </h3>
          {cart.map((item) => (
            <div
              key={item.product._id}
              className="flex justify-between mb-2 text-gray-light"
            >
              <span>
                {item.product.name} × {item.quantity}
              </span>
              <span>
                {(item.product.price * item.quantity).toLocaleString("fa-IR")}{" "}
                تومان
              </span>
            </div>
          ))}

          {/* نمایش تخفیف در صورت فعال شدن */}
          {discountPercentage > 0 && (
            <div className="flex justify-between mt-3 text-gray-light">
              <span>تخفیف ({discountPercentage}%):</span>
              <span>- {discountAmount.toLocaleString("fa-IR")} تومان</span>
            </div>
          )}
          <div className="flex justify-between items-center mt-4 border-t border-gray-med pt-4">
            <span className="text-lg font-semibold">مبلغ نهایی:</span>
            <span className="text-lg font-bold">
              {freeAccount
                ? "رایگان"
                : finalTotal.toLocaleString("fa-IR") + " تومان"}
            </span>
          </div>

          <div className="flex justify-between items-center mt-4 border-t border-gray-med pt-4">
            <span className="text-lg font-semibold">مبلغ کل:</span>
            <span className="text-lg font-bold">
              {total.toLocaleString("fa-IR")} تومان
            </span>
          </div>
        </motion.div>

        <motion.div
          className="bg-dark1 p-6 rounded-2xl shadow-lg space-y-6"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* بخش کد تخفیف */}
          <div className="space-y-2">
            <label className="block text-gray-light mb-2">کد تخفیف:</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                placeholder="مثال: ABCD1234"
                className="flex-1 px-4 py-2 bg-dark2 text-gray-light border border-gray-med rounded focus:outline-none focus:border-primary"
              />
              <button
                onClick={applyDiscount}
                className="bg-primary hover:bg-opacity-90 text-dark2 px-4 py-2 rounded-lg transition"
              >
                اعمال کد
              </button>
            </div>
            {discountError && (
              <p className="text-red-500 text-sm mt-1">{discountError}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="paymentMethod"
              className="block text-gray-light mb-2"
            >
              انتخاب روش پرداخت:
            </label>
            <select
              id="paymentMethod"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-4 py-2 bg-dark2 text-gray-light border border-gray-med rounded focus:outline-none focus:border-primary"
            >
              <option value="shaparak">پرداخت اینترنتی (شاپرک)</option>
              <option value="crypto">پرداخت ارز دیجیتال</option>
              <option value="card-to-card">کارت به کارت</option>
              <option value="whatsapp">ثبت سفارش واتساپی</option>
            </select>
          </div>

          {method === "shaparak" && (
            <motion.div
              className="bg-dark2 p-4 rounded transition-opacity"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-gray-light mb-2">
                درگاه پرداخت شاپرک فعال است.
              </p>
              <button
                onClick={submitOrder}
                className="bg-primary hover:bg-opacity-90 text-dark2 font-semibold py-2 px-6 rounded transition"
              >
                پرداخت با شاپرک
              </button>
            </motion.div>
          )}

          {method === "crypto" && (
            <motion.div
              className="bg-dark2 p-4 rounded transition-opacity"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <label
                htmlFor="cryptoSelect"
                className="block text-gray-light mb-2"
              >
                انتخاب ارز:
              </label>
              <select
                id="cryptoSelect"
                value={cryptoType}
                onChange={(e) => setCryptoType(e.target.value)}
                className="w-full px-4 py-2 bg-dark1 text-gray-light border border-gray-med rounded focus:outline-none focus:border-primary"
              >
                <option value="ETH_BASE">ETH (BASE)</option>
                <option value="ETH_ARB">ETH (ARB)</option>
                <option value="TRX">TRX</option>
                <option value="USDT_TRX">USDT (TRX)</option>
                <option value="S_SONIC">S (SONIC)</option>
              </select>
              <p className="mt-2 text-gray-med text-sm">
                پس از ثبت سفارش، آدرس ولت برای شما نمایش داده می‌شود.
              </p>
            </motion.div>
          )}

          {method === "card-to-card" && (
            <motion.div
              className="bg-dark2 p-4 rounded transition-opacity"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <label
                htmlFor="cardNumber"
                className="block text-gray-light mb-2"
              >
                شماره کارت
              </label>
              <input
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                type="text"
                placeholder="XXXX-XXXX-XXXX-XXXX"
                className="w-full px-4 py-2 bg-dark1 text-gray-light border border-gray-med rounded mb-4 focus:outline-none focus:border-primary"
              />
              <label htmlFor="bankName" className="block text-gray-light mb-2">
                نام بانک
              </label>
              <input
                id="bankName"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                type="text"
                placeholder="بانک مورد نظر"
                className="w-full px-4 py-2 bg-dark1 text-gray-light border border-gray-med rounded focus:outline-none focus:border-primary"
              />
              <p className="mt-2 text-gray-med text-sm">
                پس از واریز وجه، رسید را ارسال کنید.
              </p>
            </motion.div>
          )}

          {method === "whatsapp" && (
            <motion.div
              className="bg-dark2 p-4 rounded transition-opacity"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-gray-light mb-2">
                برای ثبت سفارش، دکمهٔ زیر را فشار دهید تا به واتساپ هدایت شوید:
              </p>
              <button
                onClick={submitOrder}
                className="bg-primary hover:bg-opacity-90 text-dark2 font-semibold py-2 px-6 rounded transition"
              >
                ارسال در واتساپ
              </button>
            </motion.div>
          )}

          {method !== "whatsapp" && (
            <button
              onClick={submitOrder}
              className="w-full bg-primary hover:bg-opacity-90 text-dark2 font-semibold py-3 rounded transition"
            >
              ثبت نهایی سفارش
            </button>
          )}
          {freeAccount && (
            <p className="text-green-500 text-center font-semibold mt-4">
              با استفاده از کد رایگان، این سفارش رایگان پردازش خواهد شد.
            </p>
          )}
        </motion.div>
      </div>
    </main>
  );
}
