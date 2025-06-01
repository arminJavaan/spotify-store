// frontend/src/components/AdminRoute.jsx

import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

export default function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    // تا وقتی اطلاعات کاربر از سرور نیامده، هیچ چیزی نمایش نده (یا یک Spinner ساده)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray2 animate-fadeIn">در حال بارگذاری...</p>
      </div>
    )
  }

  if (!user) {
    // وقتی loading تمام شد و user همچنان null است، به /login بفرست
    return <Navigate to="/login" />
  }

  if (user.role !== 'admin') {
    // وقتی user وجود دارد ولی نقش admin نیست
    return <Navigate to="/products" />
  }

  // در غیر این صورت (کاربر لاگین کرده و نقش‌اش admin است)، اجازه‌ی نمایش محتوای children داده می‌شود
  return children
}
