import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../../api'
import { FiPackage, FiUsers, FiShoppingCart, FiHome } from 'react-icons/fi'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/admin/stats')
        setStats(res.data)
        setError(null)
      } catch (err) {
        console.error(err)
        setError('خطا در بارگذاری آمار')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <p className="text-gray2 animate-fadeIn">در حال بارگذاری آمار...</p>
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
        داشبورد ادمین
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-slideIn">
        <Link
          to="/admin/users"
          className="bg-dark1 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition flex flex-col items-center"
        >
          <FiUsers className="text-4xl text-primary mb-2" />
          <span className="text-lg font-semibold text-gray2 mb-1">کاربران</span>
          <span className="text-2xl font-bold text-gray2">{stats.totalUsers}</span>
        </Link>

        <Link
          to="/admin/products"
          className="bg-dark1 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition flex flex-col items-center"
        >
          <FiPackage className="text-4xl text-primary mb-2" />
          <span className="text-lg font-semibold text-gray2 mb-1">محصولات</span>
          <span className="text-2xl font-bold text-gray2">{stats.totalProducts}</span>
        </Link>

        <Link
          to="/admin/orders"
          className="bg-dark1 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition flex flex-col items-center"
        >
          <FiShoppingCart className="text-4xl text-primary mb-2" />
          <span className="text-lg font-semibold text-gray2 mb-1">سفارش‌ها</span>
          <span className="text-2xl font-bold text-gray2">{stats.totalOrders}</span>
        </Link>

        <Link
          to="/"
          className="bg-dark1 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition flex flex-col items-center"
        >
          <FiHome className="text-4xl text-primary mb-2" />
          <span className="text-lg font-semibold text-gray2">بازگشت به سایت</span>
        </Link>
      </div>
    </div>
  )
}
