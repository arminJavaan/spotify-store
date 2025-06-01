// frontend/src/pages/UserDashboard.jsx

import React, { useContext, useEffect, useState } from 'react'
import API from '../api'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiEdit2, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi'

export default function UserDashboard() {
  const { user, loading: userLoading, logout } = useContext(AuthContext)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })
  const [password, setPassword] = useState('')
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [profileError, setProfileError] = useState(null)
  const [ordersError, setOrdersError] = useState(null)
  const [updatingProfile, setUpdatingProfile] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user && !userLoading) {
      navigate('/login')
    }
    if (user) {
      setFormData({ name: user.name, email: user.email, phone: user.phone })
      fetchOrders()
    }
  }, [user, userLoading, navigate])

  const fetchOrders = async () => {
    setOrdersLoading(true)
    try {
      const res = await API.get('/orders')
      setOrders(res.data)
      setOrdersError(null)
    } catch (err) {
      console.error('Error fetching orders:', err.response?.data || err.message)
      setOrdersError('خطا در دریافت سفارش‌ها')
    } finally {
      setOrdersLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setUpdatingProfile(true)
    setProfileError(null)
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim()
      }
      if (password) payload.password = password

      await API.put('/auth/profile', payload)
      setEditing(false)
      window.location.reload()
    } catch (err) {
      console.error('Error updating profile:', err.response?.data || err.message)
      setProfileError(err.response?.data?.msg || 'خطا در به‌روزرسانی پروفایل')
    } finally {
      setUpdatingProfile(false)
    }
  }

  if (userLoading) {
    return <p className="text-center text-gray-light py-20">در حال بارگذاری...</p>
  }
  if (!user) return null

  return (
    <main className="bg-dark2 text-gray-light py-20 px-4 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <motion.h2
          className="text-3xl font-bold text-primary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          داشبورد کاربر
        </motion.h2>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
        >
          خروج
        </button>
      </div>

      <motion.section
        className="bg-dark1 p-8 rounded-2xl shadow-lg mb-10"
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-gray-light">پروفایل من</h3>
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center bg-primary hover:bg-opacity-90 text-dark2 px-3 py-1 rounded-lg transition"
          >
            <FiEdit2 className="ml-1" />
            {editing ? 'لغو' : 'ویرایش'}
          </button>
        </div>

        {editing ? (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="نام و نام خانوادگی"
                className="w-full px-4 py-2 bg-dark2 text-gray-light border border-gray-med rounded focus:outline-none focus:border-primary"
                required
              />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ایمیل"
                className="w-full px-4 py-2 bg-dark2 text-gray-light border border-gray-med rounded focus:outline-none focus:border-primary"
                required
              />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="شماره تلفن"
                className="w-full px-4 py-2 bg-dark2 text-gray-light border border-gray-med rounded focus:outline-none focus:border-primary"
                required
              />
              <input
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="رمز عبور جدید (اختیاری)"
                className="w-full px-4 py-2 bg-dark2 text-gray-light border border-gray-med rounded focus:outline-none focus:border-primary"
              />
            </div>

            {profileError && <p className="text-red-500 text-sm">{profileError}</p>}

            <button
              type="submit"
              disabled={updatingProfile}
              className={`w-full bg-primary hover:bg-opacity-90 text-dark2 font-semibold py-3 rounded transition ${
                updatingProfile ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              ذخیره تغییرات
            </button>
          </form>
        ) : (
          <div className="space-y-2 text-gray-light">
            <p>
              <strong>نام:</strong> {user.name}
            </p>
            <p>
              <strong>ایمیل:</strong> {user.email}
            </p>
            <p>
              <strong>شماره تلفن:</strong> {user.phone}
            </p>
          </div>
        )}
      </motion.section>

      <motion.section
        className="bg-dark1 p-8 rounded-2xl shadow-lg"
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-2xl font-semibold text-gray-light mb-4">سفارش‌های من</h3>
        {ordersLoading ? (
          <p className="text-center text-gray-light py-4">در حال بارگذاری...</p>
        ) : ordersError ? (
          <p className="text-red-500">{ordersError}</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-light">شما هنوز سفارشی ثبت نکرده‌اید.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order, idx) => {
              const isPending = order.status === 'pending'
              const isCompleted = order.status === 'completed'
              const isCancelled = order.status === 'cancelled'
              return (
                <motion.div
                  key={order._id}
                  className="bg-dark2 p-6 rounded-2xl border border-gray-med"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-primary font-semibold">
                      سفارش #{order._id.slice(-6)}
                    </span>
                    <span className="text-gray-med text-sm">
                      {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                    </span>
                  </div>

                  <div className="space-y-1 mb-2">
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

                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-light text-sm">
                      <strong>مبلغ کل:</strong>{' '}
                      {Number(order.totalAmount).toLocaleString('fa-IR')} تومان
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
                      className="inline-block bg-primary hover:bg-opacity-90 text-dark2 px-3 py-1 rounded-lg text-sm transition"
                    >
                      مشاهده در واتساپ
                    </a>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.section>
    </main>
  )
}
