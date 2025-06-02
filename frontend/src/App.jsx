// frontend/src/App.jsx

import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import CartProvider from "./contexts/CartContext";
import SpotifyLoading from "./components/SpotifyLoading";
import BackgroundAnimation from "./components/BackgroundAnimation";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminRoute from "./components/AdminRoute";
import PrivateRoute from "./components/PrivateRoute";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/ProductsAdmin";
import AdminOrders from "./pages/admin/OrdersAdmin";
import AdminUsers from "./pages/admin/UsersAdmin";
import AdminDiscounts from "./pages/AdminDiscounts";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminDiscountsForm from "./pages/admin/AdminDiscountForm";


function AppInner() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <SpotifyLoading />;
  }

  return (
    <div className="relative flex flex-col min-h-screen">
      <BackgroundAnimation />

      <Navbar />

      <main className="flex-grow relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/About" element={<About />} />
          <Route path="/contact" element={<Contact />} />
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

          {/* اگر کاربر لاگین کرده باشد، دسترسی به /login و /register مسدود می‌شود */}
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/dashboard" /> : <Register />}
          />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <UserDashboard />
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
          <Route
            path="/admin/discounts"
            element={
              <AdminRoute>
                <AdminDiscounts />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/discounts/add"
            element={
              <AdminRoute>
                <AdminDiscountsForm />
              </AdminRoute>
            }
          />

          {/* مسیر 404 */}
          <Route
            path="*"
            element={
              <h2 className="text-center text-gray-light py-20">
                صفحهٔ مورد نظر یافت نشد
              </h2>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppInner />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
