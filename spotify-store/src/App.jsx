import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthProvider from './contexts/AuthContext';
import CartProvider from './contexts/CartContext';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <main className="min-h-screen bg-gray-50 p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
              <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
            </Routes>
          </main>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
