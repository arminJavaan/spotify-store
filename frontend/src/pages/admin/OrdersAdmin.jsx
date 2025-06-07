
// ✅ نسخه بهینه‌شده AdminOrders.jsx با طراحی بهتر، کلاس‌های خواناتر، باکس مرتب، سوییچ وضعیت سفارش‌ها و قابلیت جستجو
// مسیر: frontend/src/pages/admin/OrdersAdmin.jsx

import React, { useEffect, useState } from 'react'
import API from '../../api'
import {
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiUser,
  FiMail,
  FiDollarSign,
  FiSearch
} from 'react-icons/fi'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingOrderId, setUpdatingOrderId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

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
      await fetchOrders()
    } catch (err) {
      console.error(err)
      alert('خطا در به‌روزرسانی وضعیت سفارش')
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const filteredOrders = orders.filter(order =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <main className="px-6 py-10 text-gray-light mt-16">
      <h2 className="text-2xl font-bold text-primary mb-6 text-center">
        مدیریت سفارش‌ها
      </h2>

      <div className="max-w-md mx-auto mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="جستجو بر اساس Order ID..."
            className="w-full px-4 py-2 pr-10 bg-dark2 border border-gray-700 rounded-full text-sm placeholder-gray-400"
          />
          <FiSearch className="absolute top-2.5 right-3 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-400 animate-pulse">در حال بارگذاری...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-center text-gray-400">سفارشی یافت نشد.</p>
      ) : (
        <div className="space-y-6 max-w-5xl mx-auto">
          {filteredOrders.map(order => {
            const user = order.user || {}
            const isPending = order.status === 'pending'
            const isCompleted = order.status === 'completed'
            const isCancelled = order.status === 'cancelled'

            return (
              <div key={order._id} className="bg-dark1 border border-gray-700 p-5 rounded-2xl shadow-md">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-primary font-bold text-sm font-mono">#{order._id.slice(-6)}</h3>
                  <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString("fa-IR")}</span>
                </div>

                <div className="text-sm text-gray-300 space-y-1">
                  <div className="flex flex-wrap gap-4 mb-2">
                    <span className="flex items-center gap-1"><FiUser /> {user.name || "کاربر حذف‌شده"}</span>
                    <span className="flex items-center gap-1"><FiMail /> {user.email || "—"}</span>
                    <span className="flex items-center gap-1"><FiDollarSign /> {order.totalAmount.toLocaleString("fa-IR")} تومان</span>
                  </div>

                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between border-t border-gray-700 pt-2">
                      <span>{item.product.name} × {item.quantity}</span>
                      <span>{(item.product.price * item.quantity).toLocaleString("fa-IR")} تومان</span>
                    </div>
                  ))}

                  <div className="mt-3">
                    روش پرداخت: <span className="text-primary font-semibold">{order.paymentMethod}</span>
                    {order.paymentMethod === 'whatsapp' && order.whatsappOrderUrl && (
                      <a href={order.whatsappOrderUrl} target="_blank" rel="noreferrer" className="ml-4 text-green-400 underline text-xs">
                        مشاهده در واتساپ
                      </a>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4 justify-between">
                  <div className="text-sm flex items-center gap-1">
                    {isPending && <span className="text-yellow-400 flex items-center"><FiClock /> در انتظار</span>}
                    {isCompleted && <span className="text-green-400 flex items-center"><FiCheckCircle /> تکمیل شده</span>}
                    {isCancelled && <span className="text-red-400 flex items-center"><FiXCircle /> لغو شده</span>}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {!isCompleted && (
                      <button onClick={() => updateStatus(order._id, 'completed')} disabled={updatingOrderId === order._id} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm">
                        علامت‌گذاری به عنوان «تکمیل شده»
                      </button>
                    )}
                    {!isPending && (
                      <button onClick={() => updateStatus(order._id, 'pending')} disabled={updatingOrderId === order._id} className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-dark1 rounded text-sm">
                        بازگشت به «در انتظار»
                      </button>
                    )}
                    {!isCancelled && (
                      <button onClick={() => updateStatus(order._id, 'cancelled')} disabled={updatingOrderId === order._id} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm">
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
    </main>
  )
}
