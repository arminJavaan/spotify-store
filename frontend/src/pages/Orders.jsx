// frontend/src/pages/Orders.jsx
import React, { useEffect, useState } from 'react'
import API from '../api'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/orders')
        setOrders(res.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching orders:', err.response?.data || err.message)
        setError('لطفاً ابتدا وارد شوید.')
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) {
    return <p className="text-center text-gray-light py-20">در حال بارگذاری...</p>
  }

  return (
    <main className="bg-dark2 text-gray-light py-20 px-4 min-h-screen">
      <motion.h2
        className="text-3xl font-bold text-primary mb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        سفارش‌های من
      </motion.h2>

      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-light">شما هنوز سفارشی ثبت نکرده‌اید.</p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8">
          {orders.map((order, idx) => {
            const isPending = order.status === 'pending'
            const isCompleted = order.status === 'completed'
            const isCancelled = order.status === 'cancelled'
            return (
              <motion.div
                key={order._id}
                className="bg-dark1 p-6 rounded-2xl shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-light">
                    سفارش #{order._id.slice(-6)}
                  </h3>
                  <span className="text-gray-med text-sm">
                    {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item) => (
                    <div
                      key={item.product._id}
                      className="flex justify-between text-gray-light text-sm"
                    >
                      <span>
                        {item.product.name} × {item.quantity}
                      </span>
                      <span>
                        {Number(item.product.price * item.quantity).toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-light text-sm">
                    <strong>مبلغ کل:</strong> {Number(order.totalAmount).toLocaleString('fa-IR')} تومان
                  </span>
                  <span className="flex items-center space-x-2">
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
                  </span>
                </div>

                <p className="text-gray-light text-sm mb-2">
                  <strong>روش پرداخت:</strong>{' '}
                  {order.paymentMethod === 'whatsapp' ? 'واتساپ' : order.paymentMethod}
                </p>
                {order.paymentMethod === 'whatsapp' && order.whatsappOrderUrl && (
                  <a
                    href={order.whatsappOrderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-primary hover:bg-opacity-90 text-dark2 px-4 py-2 rounded-lg text-sm transition"
                  >
                    مشاهده در واتساپ
                  </a>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </main>
  )
}
