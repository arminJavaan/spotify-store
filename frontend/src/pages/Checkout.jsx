// frontend/src/pages/Checkout.jsx

import React, { useContext, useState, useEffect } from 'react'
import { CartContext } from '../contexts/CartContext'
import API from '../api'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext)
  const navigate = useNavigate()
  const [method, setMethod] = useState('shaparak')
  const [cardNumber, setCardNumber] = useState('')
  const [bankName, setBankName] = useState('')
  const [discountCode, setDiscountCode] = useState('')
  const [discountError, setDiscountError] = useState(null)
  const [discountPercentage, setDiscountPercentage] = useState(0)
  const [freeAccount, setFreeAccount] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate('/cart')
    }
  }, [cart, navigate])

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const discountAmount = Math.floor((total * discountPercentage) / 100)
  const finalTotal = total - discountAmount

  const ProgressBar = () => (
    <div className="w-full bg-dark2 rounded-full h-2.5 mb-20 mt-12">
      <div className="bg-primary h-2.5 rounded-full w-full transition-all duration-500" />
      <div className="text-center text-sm text-gray-med mt-2">مرحله ۲ از ۲: پرداخت</div>
    </div>
  )

  const applyDiscount = async () => {
    setDiscountError(null)
    if (!discountCode.trim()) {
      setDiscountError('لطفاً کد تخفیف را وارد کنید.')
      return
    }
    try {
      const res = await API.get(`/discounts/verify/${discountCode.trim()}`)
      setDiscountPercentage(res.data.percentage || 0)
      setFreeAccount(res.data.freeAccount === true)
    } catch (err) {
      const msg = err.response?.data?.msg || 'کد تخفیف معتبر نیست'
      setDiscountError(msg)
      setDiscountPercentage(0)
      setFreeAccount(false)
    }
  }

  const submitOrder = async () => {
    setError(null)
    setLoading(true)
    const payloadDiscountCode = discountCode.trim() || null

    try {
      if (method === 'crypto') {
        const orderRes = await API.post('/orders', {
          paymentMethod: 'crypto',
          paymentDetails: {},
          discountCode: payloadDiscountCode,
        })
        const orderId = orderRes.data.order._id
        const usdAmount = (freeAccount ? 0 : finalTotal / 42000).toFixed(2)
        const chargeRes = await API.post('/crypto/create-charge', {
          orderId,
          amount: usdAmount,
          currency: 'USD',
        })
        window.location.href = chargeRes.data.hostedUrl
        return
      }

      const paymentDetails = {}
      if (method === 'card-to-card') {
        paymentDetails.cardNumber = cardNumber.trim()
        paymentDetails.bankName = bankName.trim()
      } else if (method === 'shaparak') {
        paymentDetails.placeholder = 'پرداخت اینترنتی شاپرک'
      }

      const res = await API.post('/orders', {
        paymentMethod: method,
        paymentDetails,
        discountCode: payloadDiscountCode,
      })

      if (method === 'whatsapp') {
        window.open(res.data.order.whatsappOrderUrl, '_blank')
      } else {
        alert('سفارش شما با موفقیت ثبت شد.')
        clearCart()
        navigate('/orders')
      }
    } catch (err) {
      const msg = err.response?.data?.msg || err.message
      setError('خطا در ثبت سفارش: ' + msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="text-gray-light py-20 px-6 min-h-screen mt-12">
      <motion.h2
        className="text-3xl font-bold text-primary mb-8 text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        اطلاعات سفارش و پرداخت
      </motion.h2>

      <ProgressBar />

      <div className="max-w-3xl mx-auto space-y-8">
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
              <span>{(item.product.price * item.quantity).toLocaleString('fa-IR')} تومان</span>
            </div>
          ))}
          {discountPercentage > 0 && (
            <div className="flex justify-between mt-3 text-green-400">
              <span>تخفیف ({discountPercentage}%):</span>
              <span>- {discountAmount.toLocaleString('fa-IR')} تومان</span>
            </div>
          )}
          <div className="flex justify-between items-center mt-4">
            <span className="text-lg font-semibold">مبلغ نهایی:</span>
            <span className="text-lg font-bold text-primary">
              {freeAccount ? 'رایگان' : `${finalTotal.toLocaleString('fa-IR')} تومان`}
            </span>
          </div>
        </motion.div>

        <motion.div
          className="bg-dark1 p-6 rounded-2xl shadow-xl space-y-6"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* تخفیف */}
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

          {/* روش پرداخت */}
          <div>
            <label className="text-sm text-gray-light mb-2 block">روش پرداخت:</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-4 py-2 bg-dark2 text-gray-light border border-gray-med rounded focus:outline-none focus:border-primary"
            >
              <option value="shaparak">درگاه اینترنتی (شاپرک)</option>
              <option value="crypto">پرداخت ارز دیجیتال</option>
              <option value="card-to-card">کارت به کارت</option>
              <option value="whatsapp">سفارش از طریق واتساپ</option>
            </select>
          </div>

          <AnimatePresence>
            {method === 'card-to-card' && (
              <motion.div
                className="bg-dark2 p-4 rounded space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <input
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  type="text"
                  placeholder="شماره کارت"
                  className="w-full px-4 py-2 bg-dark1 text-gray-light border border-gray-med rounded"
                />
                <input
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  type="text"
                  placeholder="نام بانک"
                  className="w-full px-4 py-2 bg-dark1 text-gray-light border border-gray-med rounded"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-center space-y-4">
            {error && <p className="text-red-500">{error}</p>}
            {freeAccount && (
              <p className="text-green-500 font-semibold">این سفارش به صورت رایگان پردازش خواهد شد 🎁</p>
            )}
            <button
              onClick={submitOrder}
              disabled={loading}
              className="w-full bg-primary text-dark2 font-semibold py-3 rounded-lg hover:bg-opacity-90 transition"
            >
              {loading ? 'در حال پردازش...' : 'ثبت سفارش نهایی'}
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
