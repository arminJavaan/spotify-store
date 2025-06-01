// frontend/src/components/Navbar.jsx
import React, { useState, useContext, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { FiMenu, FiX, FiShoppingCart, FiUser, FiHome } from 'react-icons/fi';
import { motion } from 'framer-motion';

// کامپوننت NavLink برای یکپارچه‌سازی لینک‌ها
const NavLink = ({ to, children, onClick, className = '' }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center text-gray-light hover:text-primary transition-colors duration-200 ${
        isActive ? 'text-primary font-semibold' : ''
      } ${className}`}
      aria-label={children.toString()}
    >
      {children}
    </Link>
  );
};

export default function Navbar() {
  const { cart } = useContext(CartContext);
  const { user, loading, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  // بهینه‌سازی تابع toggleMenu با useCallback
  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);

  // حالت بارگذاری
  if (loading) {
    return (
      <header className="bg-dark1 shadow-md px-6 py-8 flex items-center justify-between">
        <div className="text-2xl font-bold text-primary">SpotifyStore</div>
        <div className="text-gray-light">در حال بارگذاری...</div>
      </header>
    );
  }

  return (
    <header className="bg-dark1 bg-opacity-80 backdrop-blur-md shadow-lg fixed w-full top-0 z-50">
      <div className="container mx-auto px-6 py-8 flex justify-between items-center relative">
        {/* گزینه‌های چپ */}
        <nav className="hidden md:flex space-x-16 items-center absolute left-6">
          <NavLink to="/">
            <FiHome className="ml-2" /> خانه
          </NavLink>
          <NavLink to="/products">محصولات</NavLink>
        </nav>

        {/* لوگو در وسط */}
        <Link
          to="/"
          className="text-2xl font-bold text-primary hover:text-primary-dark transition-colors absolute left-1/2 transform -translate-x-1/2"
        >
          SpotifyStore
        </Link>

        {/* گزینه‌های راست */}
        <nav className="hidden md:flex space-x-16 items-center absolute right-6">
          {!user ? (
            <NavLink to="/login">ورود / ثبت‌نام</NavLink>
          ) : (
            <>
              <NavLink to="/dashboard">
                <FiUser className="ml-2" /> داشبورد
              </NavLink>
              {user.role === 'admin' && <NavLink to="/admin">پنل ادمین</NavLink>}
              <button
                onClick={logout}
                className="text-gray-light hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded"
              >
                خروج
              </button>
            </>
          )}
          <Link to="/cart" className="relative text-gray-light hover:text-primary transition-colors">
            <FiShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-primary text-dark2 text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>

        {/* دکمه منوی موبایل */}
        <button
          className="md:hidden text-gray-light hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded"
          onClick={toggleMenu}
          aria-label={menuOpen ? 'بستن منو' : 'باز کردن منو'}
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* ناوبری موبایل */}
      {menuOpen && (
        <motion.nav
          className="md:hidden bg-dark1 border-t border-gray-med"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ul className="flex flex-col px-6 py-4 space-y-4">
            <li>
              <NavLink to="/" onClick={toggleMenu}>
                <FiHome className="ml-2" /> خانه
              </NavLink>
            </li>
            <li>
              <NavLink to="/products" onClick={toggleMenu}>
                محصولات
              </NavLink>
            </li>
            {!user ? (
              <li>
                <NavLink to="/login" onClick={toggleMenu}>
                  ورود / ثبت‌نام
                </NavLink>
              </li>
            ) : (
              <>
                <li>
                  <NavLink to="/dashboard" onClick={toggleMenu}>
                    <FiUser className="ml-2" /> داشبورد
                  </NavLink>
                </li>
                {user.role === 'admin' && (
                  <li>
                    <NavLink to="/admin" onClick={toggleMenu}>
                      پنل ادمین
                    </NavLink>
                  </li>
                )}
                <li>
                  <button
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                    className="text-gray-light hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded"
                  >
                    خروج
                  </button>
                </li>
              </>
            )}
            <li>
              <Link
                to="/cart"
                onClick={toggleMenu}
                className="relative text-gray-light hover:text-primary transition-colors flex items-center"
              >
                <FiShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-3 bg-primary text-dark2 text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </motion.nav>
      )}
    </header>
  );
}