import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext";
import {
  FiMenu,
  FiX,
  FiHome,
  FiBox,
  FiUser,
  FiLogOut,
  FiShoppingCart,
} from "react-icons/fi";

export default function Navbar() {
  const { cart } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className="bg-dark1 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-extrabold text-primary hover:text-[#14b752] transition-colors"
        >
          Sepatify
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="flex items-center text-gray2 hover:text-primary transition-colors"
          >
            <FiHome className="mr-1" /> خانه
          </Link>
          <Link
            to="/products"
            className="flex items-center text-gray2 hover:text-primary transition-colors"
          >
            <FiBox className="mr-1" /> محصولات
          </Link>
          {!user ? (
            <Link
              to="/login"
              className="flex items-center text-gray2 hover:text-primary transition-colors"
            >
              <FiUser className="mr-1" /> ورود / ثبت‌نام
            </Link>
          ) : (
            <button
              onClick={logout}
              className="flex items-center text-red-600 hover:text-red-900 transition-colors focus:outline-none"
            >
              <FiLogOut className="mr-1" /> خروج
            </button>
          )}
          <Link
            to="/cart"
            className="relative flex items-center text-gray2 hover:text-primary transition-colors"
          >
            <FiShoppingCart className="text-xl" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray2 hover:text-primary transition-colors focus:outline-none"
          onClick={toggleMenu}
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="md:hidden bg-dark1 border-t border-gray1">
          <ul className="flex flex-col space-y-2 px-4 py-4">
            <li>
              <Link
                to="/"
                onClick={toggleMenu}
                className="flex items-center text-gray2 py-2 px-2 rounded hover:bg-dark2 hover:text-primary transition-colors"
              >
                <FiHome className="mr-2" /> خانه
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                onClick={toggleMenu}
                className="flex items-center text-gray2 py-2 px-2 rounded hover:bg-dark2 hover:text-primary transition-colors"
              >
                <FiBox className="mr-2" /> محصولات
              </Link>
            </li>
            <li>
              {!user ? (
                <Link
                  to="/login"
                  onClick={toggleMenu}
                  className="flex items-center text-gray2 py-2 px-2 rounded hover:bg-dark2 hover:text-primary transition-colors"
                >
                  <FiUser className="mr-2" /> ورود / ثبت‌نام
                </Link>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    toggleMenu();
                  }}
                  className="w-full flex items-center text-red-600 py-2 px-2 rounded hover:bg-dark2 hover:text-red-900 transition-colors"
                >
                  <FiLogOut className="mr-2" /> خروج
                </button>
              )}
            </li>
            <li>
              <Link
                to="/cart"
                onClick={toggleMenu}
                className="relative flex items-center text-gray2 py-2 px-2 rounded hover:bg-dark2 hover:text-primary transition-colors"
              >
                <FiShoppingCart className="mr-2" /> سبد خرید
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
