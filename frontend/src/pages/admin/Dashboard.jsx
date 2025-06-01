// frontend/src/pages/admin/Dashboard.jsx

import React from 'react'
import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-primary mb-8 text-center animate-fadeIn">
        پنل ادمین
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-slideIn">
        <Link
          to="/admin/products"
          className="bg-dark1 p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition"
        >
          <span className="block text-4xl mb-2 text-primary">📦</span>
          <h3 className="text-xl font-semibold text-gray2">مدیریت محصولات</h3>
        </Link>
        <Link
          to="/admin/orders"
          className="bg-dark1 p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition"
        >
          <span className="block text-4xl mb-2 text-primary">📝</span>
          <h3 className="text-xl font-semibold text-gray2">مدیریت سفارش‌ها</h3>
        </Link>
        <Link
          to="/admin/users"
          className="bg-dark1 p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition"
        >
          <span className="block text-4xl mb-2 text-primary">👥</span>
          <h3 className="text-xl font-semibold text-gray2">مدیریت کاربران</h3>
        </Link>
        <Link
          to="/"
          className="bg-dark1 p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition"
        >
          <span className="block text-4xl mb-2 text-primary">🏠</span>
          <h3 className="text-xl font-semibold text-gray2">بازگشت به سایت</h3>
        </Link>
      </div>
    </div>
  )
}
