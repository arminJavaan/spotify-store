// frontend/src/App.jsx

import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { AuthProvider } from './contexts/AuthContext'
import CartProvider from './contexts/CartContext'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'

// صفحات ادمین
import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/ProductsAdmin'
import AdminOrders from './pages/admin/OrdersAdmin'
import AdminUsers from './pages/admin/UsersAdmin'

export default function App() {
  return (
    // این div باعث می‌شود کل اپ حداقل به ارتفاع صفحه برسد
    <div className="flex flex-col min-h-screen">
      <Router>
        <AuthProvider>
          <CartProvider>
            <Navbar />

            {/* این main فضای باقیمانده را پر می‌کند */}
            <main className="flex-grow bg-dark2">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart />} />

                <Route
                  path="/checkout"
                  element={
                    <PrivateRoute>
                      <Checkout />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/orders"
                  element={
                    <PrivateRoute>
                      <Orders />
                    </PrivateRoute>
                  }
                />

                {/* مسیرهای ادمین */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <AdminRoute>
                      <AdminProducts />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <AdminRoute>
                      <AdminOrders />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <AdminRoute>
                      <AdminUsers />
                    </AdminRoute>
                  }
                />
              </Routes>
            </main>

            <Footer />
          </CartProvider>
        </AuthProvider>
      </Router>
    </div>
  )
}
