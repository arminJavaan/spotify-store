// frontend/src/pages/admin/OrderAdmin.jsx

import React, { useEffect, useState } from 'react'
import API from '../../api'
import {
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiUser,
  FiMail,
  FiDollarSign
} from 'react-icons/fi'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingOrderId, setUpdatingOrderId] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await API.get('/admin/orders')
      setOrders(res.data)
      setError(null)
    } catch (err) {
      console.error(err)
      setError('خطا در دریافت سفارش‌ها')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId, newStatus) => {
    if (!window.confirm(`آیا مطمئنید وضعیت سفارش را "${newStatus}" کنید؟`)) return
    setUpdatingOrderId(orderId)
    try {
      await API.put(`/admin/orders/${orderId}/status`, { status: newStatus })
      fetchOrders()
    } catch (err) {
      console.error(err)
      alert('خطا در به‌روزرسانی وضعیت سفارش')
    } finally {
      setUpdatingOrderId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <p className="text-gray2 animate-fadeIn">در حال بارگذاری سفارش‌ها...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-primary mb-8 text-center animate-fadeIn">
        مدیریت سفارش‌ها
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray2">هیچ سفارشی ثبت نشده است.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => {
            const isPending = order.status === 'pending'
            const isCompleted = order.status === 'completed'
            const isCancelled = order.status === 'cancelled'

            return (
              <div
                key={order._id}
                className="bg-dark1 p-6 rounded-2xl shadow-lg animate-slideIn"
              >
                {/* هدر با شماره و تاریخ سفارش */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-primary">
                    سفارش #{order._id.slice(-6)}
                  </h3>
                  <span className="text-gray2 text-sm">
                    {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                  </span>
                </div>

                {/* اطلاعات کاربر سفارش‌دهنده */}
                <div className="mb-4 flex flex-col sm:flex-row sm:justify-between">
                  <div className="flex items-center mb-2 sm:mb-0">
                    <FiUser className="text-gray2 ml-1" />
                    <span className="text-gray2">{order.user.name}</span>
                  </div>
                  <div className="flex items-center mb-2 sm:mb-0">
                    <FiMail className="text-gray2 ml-1" />
                    <span className="text-gray2">{order.user.email}</span>
                  </div>
                  <div className="flex items-center">
                    <FiDollarSign className="text-gray2 ml-1" />
                    <span className="text-gray2">
                      {Number(order.totalAmount).toLocaleString('fa-IR')} تومان
                    </span>
                  </div>
                </div>

                {/* آیتم‌های سفارش */}
                <div className="mb-4 border-t border-gray1 pt-4 space-y-2">
                  {order.items.map(item => (
                    <div
                      key={item.product._id}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray2">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="text-gray2">
                        {Number(item.product.price * item.quantity).toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                  ))}
                </div>

                {/* روش پرداخت و لینک واتساپ */}
                <div className="mb-4">
                  <p className="text-gray2 mb-1">
                    روش پرداخت:{' '}
                    <span className="text-primary font-medium">
                      {order.paymentMethod === 'whatsapp' ? 'واتساپ' : order.paymentMethod}
                    </span>
                  </p>
                  {order.paymentMethod === 'whatsapp' && order.whatsappOrderUrl && (
                    <a
                      href={order.whatsappOrderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-green-600 text-dark2 rounded-lg hover:bg-green-700 transition"
                    >
                      مشاهده واتساپ
                    </a>
                  )}
                </div>

                {/* وضعیت فعلی و دکمه‌های تغییر */}
                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
                  <div className="flex items-center mb-4 sm:mb-0">
                    {isPending && (
                      <span className="text-yellow-500 flex items-center">
                        <FiClock className="ml-1" /> در انتظار
                      </span>
                    )}
                    {isCompleted && (
                      <span className="text-green-500 flex items-center">
                        <FiCheckCircle className="ml-1" /> تکمیل شده
                      </span>
                    )}
                    {isCancelled && (
                      <span className="text-red-500 flex items-center">
                        <FiXCircle className="ml-1" /> لغو شده
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-2 flex-wrap">
                    {!isCompleted && (
                      <button
                        onClick={() => updateStatus(order._id, 'completed')}
                        disabled={updatingOrderId === order._id}
                        className="px-4 py-2 bg-green-600 text-dark2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        علامت‌گذاری به عنوان «تکمیل شده»
                      </button>
                    )}
                    {!isPending && (
                      <button
                        onClick={() => updateStatus(order._id, 'pending')}
                        disabled={updatingOrderId === order._id}
                        className="px-4 py-2 bg-yellow-500 text-dark2 rounded-lg hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        علامت‌گذاری به عنوان «در انتظار»
                      </button>
                    )}
                    {!isCancelled && (
                      <button
                        onClick={() => updateStatus(order._id, 'cancelled')}
                        disabled={updatingOrderId === order._id}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        لغو سفارش
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
