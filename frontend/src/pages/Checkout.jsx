// frontend/src/pages/Checkout.jsx
import React, { useContext, useState, useEffect } from 'react'
import { CartContext } from '../contexts/CartContext'
import API from '../api'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext)
  const navigate = useNavigate()
  const [method, setMethod] = useState('shaparak')
  const [cryptoType, setCryptoType] = useState('ETH_BASE')
  const [cardNumber, setCardNumber] = useState('')
  const [bankName, setBankName] = useState('')

  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate('/cart')
    }
  }, [cart])

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const submitOrder = async () => {
    try {
      const paymentDetails = {}
      if (method === 'crypto') {
        paymentDetails.cryptoType = cryptoType
      } else if (method === 'card-to-card') {
        paymentDetails.cardNumber = cardNumber
        paymentDetails.bankName = bankName
      } else if (method === 'shaparak') {
        paymentDetails.placeholder = 'پرداخت اینترنتی شاپرک'
      }
      const res = await API.post('/orders', { paymentMethod: method, paymentDetails })
      if (method === 'whatsapp') {
        window.open(res.data.order.whatsappOrderUrl, '_blank')
      } else {
        alert('سفارش شما با موفقیت ثبت شد.')
        clearCart()
        navigate('/orders')
      }
    } catch (err) {
      console.error(err)
      alert('خطا در ثبت سفارش: ' + (err.response?.data.msg || err.message))
    }
  }

  return (
    <main className="bg-dark2 text-gray-light py-20 px-6 min-h-screen">
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
          <h3 className="text-xl font-semibold text-gray-light mb-4">خلاصهٔ سفارش</h3>
          {cart.map((item) => (
            <div key={item.product._id} className="flex justify-between mb-2 text-gray-light">
              <span>
                {item.product.name} × {item.quantity}
              </span>
              <span>{(item.product.price * item.quantity).toLocaleString('fa-IR')} تومان</span>
            </div>
          ))}
          <div className="flex justify-between items-center mt-4 border-t border-gray-med pt-4">
            <span className="text-lg font-semibold">مبلغ کل:</span>
            <span className="text-lg font-bold">{total.toLocaleString('fa-IR')} تومان</span>
          </div>
        </motion.div>

        <motion.div
          className="bg-dark1 p-6 rounded-2xl shadow-lg space-y-6"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <label htmlFor="paymentMethod" className="block text-gray-light mb-2">
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

          {method === 'shaparak' && (
            <motion.div
              className="bg-dark2 p-4 rounded transition-opacity"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-gray-light mb-2">درگاه پرداخت شاپرک فعال است.</p>
              <button
                onClick={submitOrder}
                className="bg-primary hover:bg-opacity-90 text-dark2 font-semibold py-2 px-6 rounded transition"
              >
                پرداخت با شاپرک
              </button>
            </motion.div>
          )}

          {method === 'crypto' && (
            <motion.div
              className="bg-dark2 p-4 rounded transition-opacity"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <label htmlFor="cryptoSelect" className="block text-gray-light mb-2">
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

          {method === 'card-to-card' && (
            <motion.div
              className="bg-dark2 p-4 rounded transition-opacity"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <label htmlFor="cardNumber" className="block text-gray-light mb-2">
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
              <p className="mt-2 text-gray-med text-sm">پس از واریز وجه، رسید را ارسال کنید.</p>
            </motion.div>
          )}

          {method === 'whatsapp' && (
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

          {method !== 'whatsapp' && (
            <button
              onClick={submitOrder}
              className="w-full bg-primary hover:bg-opacity-90 text-dark2 font-semibold py-3 rounded transition"
            >
              ثبت نهایی سفارش
            </button>
          )}
        </motion.div>
      </div>
    </main>
  )
}
