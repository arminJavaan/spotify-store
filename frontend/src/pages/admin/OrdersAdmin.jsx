// frontend/src/pages/admin/OrdersAdmin.jsx

import React, { useEffect, useState } from 'react'
import API from '../../api'
import { FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await API.get('/admin/orders')
      setOrders(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/admin/orders/${id}/status`, { status })
      fetchOrders()
    } catch (err) {
      console.error(err)
      alert('خطا در به‌روزرسانی وضعیت سفارش')
    }
  }

  if (loading) {
    return <p className="text-center text-gray2 py-10">در حال بارگذاری ...</p>
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
          {orders.map(order => (
            <div
              key={order._id}
              className="bg-dark1 p-6 rounded-2xl shadow-lg animate-slideIn"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-primary">
                  سفارش #{order._id.slice(-6)}
                </h3>
                <span className="text-gray2 text-sm">
                  {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-gray2">
                  کاربر: {order.user.name} ({order.user.email})
                </p>
                <p className="text-gray2">
                  مبلغ کل: {Number(order.totalAmount).toLocaleString('fa-IR')} تومان
                </p>
                <p className="text-gray2">
                  روش پرداخت: <span className="text-primary">{order.paymentMethod}</span>
                </p>
                <p className="text-gray2">
                  وضعیت فعلی:
                  {order.status === 'pending' && (
                    <span className="text-yellow-500 ml-2 flex items-center">
                      <FiClock className="ml-1" /> در انتظار
                    </span>
                  )}
                  {order.status === 'completed' && (
                    <span className="text-green-500 ml-2 flex items-center">
                      <FiCheckCircle className="ml-1" /> تکمیل شده
                    </span>
                  )}
                  {order.status === 'cancelled' && (
                    <span className="text-red-500 ml-2 flex items-center">
                      <FiXCircle className="ml-1" /> لغو شده
                    </span>
                  )}
                </p>
              </div>
              <div className="flex space-x-3">
                {order.status !== 'completed' && (
                  <button
                    onClick={() => updateStatus(order._id, 'completed')}
                    className="px-4 py-2 bg-green-600 text-dark2 rounded-lg hover:bg-green-700 transition"
                  >
                    علامت‌گذاری به عنوان تکمیل شده
                  </button>
                )}
                {order.status !== 'pending' && (
                  <button
                    onClick={() => updateStatus(order._id, 'pending')}
                    className="px-4 py-2 bg-yellow-500 text-dark2 rounded-lg hover:bg-yellow-600 transition"
                  >
                    علامت‌گذاری به عنوان در انتظار
                  </button>
                )}
                {order.status !== 'cancelled' && (
                  <button
                    onClick={() => updateStatus(order._id, 'cancelled')}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    لغو سفارش
                  </button>
                )}
                {order.paymentMethod === 'whatsapp' && order.whatsappOrderUrl && (
                  <a
                    href={order.whatsappOrderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-green-600 text-dark2 rounded-lg hover:bg-green-700 transition"
                  >
                    مشاهده واتساپ
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
