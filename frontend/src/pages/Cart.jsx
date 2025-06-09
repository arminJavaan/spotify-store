// Cart.jsx (ری‌دیزاین کامل با استایل به‌روز و المان‌های تعاملی)

import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, fetchCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return setLoading(false);
    fetchCart().then(() => setLoading(false));
  }, [user, fetchCart]);

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const ProgressBar = () => (
    <div className="relative w-full mt-12 mb-10">
      <div className="w-full bg-dark3 rounded-full h-2.5">
        <div className="bg-primary h-2.5 rounded-full w-1/2 transition-all duration-500"></div>
      </div>
      <p className="text-center text-sm text-gray-med mt-2">مرحله ۱ از ۲: سبد خرید</p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-light">
        در حال بارگذاری...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <motion.p
          className="text-center text-gray-light text-lg mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          ابتدا باید وارد حساب کاربری شوید.
        </motion.p>
        <button
          onClick={() => navigate('/login')}
          className="bg-primary text-dark2 px-6 py-2 rounded-lg font-semibold transition hover:bg-opacity-90"
        >
          ورود / ثبت‌نام
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen py-12 px-4 text-center">
        <motion.h2
          className="text-3xl font-bold text-white mb-8 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          سبد خرید شما
        </motion.h2>
        <ProgressBar />
        <motion.div
          className="text-gray-light py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <p>سبد خرید شما خالی است.</p>
          <button
            onClick={() => navigate('/products')}
            className="mt-6 bg-primary text-dark2 px-8 py-3 rounded-lg shadow-md hover:bg-opacity-90 transition"
          >
            مشاهده محصولات
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-12 px-4 font-vazir">
      <motion.h2
        className="text-3xl font-bold text-white mb-8 text-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        سبد خرید شما
      </motion.h2>

      <ProgressBar />

      <div className="max-w-5xl mx-auto space-y-10">
        <div className="space-y-6">
          {cart.map((item, index) => (
            <motion.div
              key={item.product._id}
              className="bg-dark1 p-6 rounded-3xl border border-gray-700 shadow-xl hover:shadow-2xl transition-all flex flex-col md:flex-row items-center md:justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-5 w-full md:w-2/3">
                <img
                  src={item.product.bannerUrl}
                  alt={item.product.name}
                  className="w-24 h-24 rounded-xl object-cover border border-gray-600"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{item.product.name}</h3>
                  <p className="text-sm text-gray-400">
                    قیمت: {item.product.price.toLocaleString('fa-IR')} تومان
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <button
                  onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                  className="w-8 h-8 rounded bg-gray-700 text-white hover:bg-gray-500"
                >
                  −
                </button>
                <span className="text-white text-base font-semibold px-2">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                  className="w-8 h-8 rounded bg-gray-700 text-white hover:bg-gray-500"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className="ml-4 px-4 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm"
                >
                  حذف
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="bg-dark1 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-center border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-white text-lg font-semibold mb-4 md:mb-0">
            مبلغ کل:
            <span className="text-primary mx-2 text-xl">
              {total.toLocaleString('fa-IR')} تومان
            </span>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="bg-primary hover:bg-green-600 text-dark2 font-bold py-3 px-8 rounded-xl shadow-md transition"
          >
            ادامه خرید
          </button>
        </motion.div>
      </div>
    </main>
  );
}
