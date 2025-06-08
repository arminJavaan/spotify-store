// frontend/src/components/Navbar.jsx

import React, { useState, useContext, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext";
import { FiMenu, FiX, FiShoppingCart, FiUser, FiHome } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { FaSpotify } from "react-icons/fa";

const NavLink = ({ to, children, onClick, className = "" }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center px-4 py-2 rounded-xl transition-all font-medium tracking-tight ${
        isActive
          ? "text-primary bg-white/20 backdrop-blur-sm"
          : "text-gray-light hover:text-primary hover:bg-white/10"
      } ${className}`}
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

  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);

  if (loading) {
    return (
      <header className="fixed w-full top-0 z-50 bg-white/10 backdrop-blur-lg shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">سپاتیفای</div>
          <div className="text-gray-light">در حال بارگذاری...</div>
        </div>
      </header>
    );
  }

  const isVerified = user?.isVerified;

  return (
    <header className="fixed w-full top-0 z-50 bg-gradient-to-r from-dark2/90 to-dark1/90 backdrop-blur-md shadow-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Desktop Left Nav */}
        <nav className="hidden md:flex space-x-4 items-center">
          <NavLink to="/">
            <FiHome className="ml-2" /> خانه
          </NavLink>
          <NavLink to="/products">محصولات</NavLink>
        </nav>

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-primary drop-shadow hover:text-primary-dark transition-colors"
        >
          <div className="flex items-center gap-2 font-bold text-primary">
            <FaSpotify className="text-3xl" />
            <span className="hidden sm:inline text-lg text-gray-light font-vazir">
              Sepotify
            </span>
          </div>
        </Link>

        {/* Desktop Right Nav */}
        <nav className="hidden md:flex space-x-4 items-center">
          {!user ? (
            <NavLink to="/login">ورود / ثبت‌نام</NavLink>
          ) : isVerified ? (
            <>
              <NavLink to="/dashboard">
                <FiUser className="ml-2" /> داشبورد
              </NavLink>
              {user.role === "admin" && (
                <NavLink to="/admin">پنل ادمین</NavLink>
              )}
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl text-gray-light hover:text-primary hover:bg-white/10 transition focus:outline-none"
              >
                خروج
              </button>
            </>
          ) : null}
          {isVerified && (
            <Link
              to="/cart"
              className="relative flex items-center px-4 py-2 rounded-xl text-gray-light hover:text-primary hover:bg-white/10 transition"
            >
              <FiShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-dark2 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-ping">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-light hover:text-primary focus:outline-none"
          onClick={toggleMenu}
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-dark1/90 border-t border-gray-800 overflow-hidden backdrop-blur-sm"
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
              ) : isVerified ? (
                <>
                  <li>
                    <NavLink to="/dashboard" onClick={toggleMenu}>
                      <FiUser className="ml-2" /> داشبورد
                    </NavLink>
                  </li>
                  {user.role === "admin" && (
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
                      className="w-full text-left px-4 py-2 rounded-xl text-gray-light hover:text-primary hover:bg-white/10"
                    >
                      خروج
                    </button>
                  </li>
                </>
              ) : null}
              {isVerified && (
                <li>
                  <Link
                    to="/cart"
                    onClick={toggleMenu}
                    className="relative flex items-center px-4 py-2 rounded-xl text-gray-light hover:text-primary hover:bg-white/10"
                  >
                    <FiShoppingCart size={20} />
                    {totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary text-dark2 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                </li>
              )}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
