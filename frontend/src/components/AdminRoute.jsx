// frontend/src/components/AdminRoute.jsx

import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

export default function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray2 animate-fadeIn">در حال بارگذاری...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'admin') {
    return <Navigate to="/products" replace />
  }

  return children
}
