// frontend/src/pages/Cart.jsx

import React, { useContext, useEffect, useState } from 'react'
import { CartContext } from '../contexts/CartContext'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, fetchCart } = useContext(CartContext)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    fetchCart().then(() => setLoading(false))
  }, [user])

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const listItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({ opacity: 1, y: 0, transition: { delay: i * 0.1 } })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark2 text-gray-light">
        <p>در حال بارگذاری...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-dark2 px-4">
        <motion.p
          className="text-center text-gray-light text-lg mb-6 animate-fadeIn"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          برای مشاهدهٔ سبد خرید و ادامهٔ فرایند، ابتدا باید وارد حساب کاربری خود شوید.
        </motion.p>
        <button
          onClick={() => navigate('/login')}
          className="bg-primary hover:bg-opacity-90 text-dark2 font-semibold py-2 px-6 rounded-lg transition"
        >
          ورود / ثبت‌نام
        </button>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <main className="bg-dark2 min-h-screen py-12 px-4">
        <motion.h2
          className="text-3xl font-bold text-white mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          سبد خرید شما
        </motion.h2>
        <motion.div
          className="text-center text-gray-light py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <p>سبد خرید شما خالی است.</p>
          <button
            onClick={() => navigate('/products')}
            className="mt-6 bg-primary hover:bg-green-600 text-dark2 font-semibold py-3 px-8 rounded-lg shadow-md transition"
          >
            مشاهده محصولات
          </button>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="bg-dark2 min-h-screen py-12 px-4">
      <motion.h2
        className="text-3xl font-bold text-white mb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        سبد خرید شما
      </motion.h2>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          {cart.map((item, index) => (
            <motion.div
              key={item.product._id}
              className="bg-dark1 flex flex-col md:flex-row items-center md:justify-between p-6 rounded-2xl shadow-lg"
              custom={index}
              initial="hidden"
              animate="visible"
              variants={listItemVariants}
            >
              <div className="flex items-center space-x-4 w-full md:w-2/3">
                <div className="w-20 h-20 bg-gray-med rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.product.bannerUrl}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {item.product.name}
                  </h3>
                  <p className="text-gray-light text-sm mt-1">
                    قیمت واحد: {item.product.price.toLocaleString('fa-IR')} تومان
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-4 md:mt-0">
                <button
                  onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                  className="bg-gray-med hover:bg-gray-light text-dark2 font-bold w-8 h-8 flex items-center justify-center rounded transition"
                >
                  -
                </button>
                <span className="text-gray-light">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                  className="bg-gray-med hover:bg-gray-light text-dark2 font-bold w-8 h-8 flex items-center justify-center rounded transition"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className="ml-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg transition"
                >
                  حذف
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="bg-dark1 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="text-white text-xl font-semibold mb-4 md:mb-0">
            مبلغ کل:{' '}
            <span className="text-primary">
              {total.toLocaleString('fa-IR')} تومان
            </span>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="bg-primary hover:bg-green-600 text-dark2 font-semibold py-3 px-8 rounded-lg shadow-md transition"
          >
            اقدام به پرداخت
          </button>
        </motion.div>
      </div>
    </main>
  )
}
