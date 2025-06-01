import React, { useEffect, useState } from 'react'
import API from '../api'
import { useNavigate } from 'react-router-dom'
import { FiPackage, FiCreditCard, FiCheckCircle, FiMessageSquare } from 'react-icons/fi'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/orders')
        setOrders(res.data)
      } catch (err) {
        console.error(err)
        navigate('/login')
      }
    }
    fetchOrders()
  }, [navigate])

  return (
    <main className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-primary mb-8 text-center animate-fadeIn">
        سفارش‌های من
      </h2>

      {orders.length === 0 ? (
        <div className="text-center text-gray2 py-10 animate-fadeIn">
          <p>شما هنوز سفارشی ثبت نکرده‌اید.</p>
          <button
            onClick={() => navigate('/products')}
            className="mt-6 px-6 py-3 bg-primary text-dark2 font-medium rounded-lg hover:bg-[#148c3c] transition"
          >
            مشاهده محصولات
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map(order => (
            <div
              key={order._id}
              className="bg-dark1 p-6 rounded-2xl shadow-xl animate-slideIn"
            >
              <div className="flex items-center mb-4">
                <FiPackage className="text-primary mr-2 text-2xl" />
                <h3 className="text-xl font-semibold text-primary">
                  سفارش #{order._id.slice(-6)}
                </h3>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center">
                  <FiCreditCard className="text-gray2 ml-2" />
                  <span className="text-gray2">
                    مبلغ کل: {Number(order.totalAmount).toLocaleString('fa-IR')} تومان
                  </span>
                </div>
                <div className="flex items-center">
                  <FiCreditCard className="text-gray2 ml-2" />
                  <span className="text-gray2">
                    روش پرداخت: <span className="text-primary font-medium">{order.paymentMethod}</span>
                  </span>
                </div>
                <div className="flex items-center">
                  <FiCheckCircle className={`ml-2 ${order.status === 'pending' ? 'text-yellow-500' : 'text-green-500'}`} />
                  <span className={`font-medium ${order.status === 'pending' ? 'text-yellow-500' : 'text-green-500'}`}>
                    {order.status === 'pending' ? 'در انتظار پرداخت' : 'تکمیل شده'}
                  </span>
                </div>
              </div>
              {order.paymentMethod === 'whatsapp' && order.whatsappOrderUrl && (
                <a
                  href={order.whatsappOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-4 py-2 bg-green-600 text-dark2 rounded-lg hover:bg-green-700 transition"
                >
                  <FiMessageSquare className="ml-2" />
                  مشاهده واتساپ
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
