import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaTelegram,
  FaHeart,
} from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-t from-dark3 to-dark2 text-gray-light pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 pb-12">
        {/* برند و شبکه‌های اجتماعی */}
        <div className="space-y-4">
          <h2 className="text-2xl font-extrabold text-primary">سپاتیفای</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            تجربه‌ای ساده، سریع و امن از خرید اکانت پرمیوم اسپاتیفای .
          </p>
          <div className="flex gap-4 mt-2">
            <a
              href="https://t.me/SepotifyAdmin"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary p-2 rounded-md hover:bg-opacity-90 transition"
            >
              <FaTelegram className="text-sm" />
            </a>
            <a
              href="https://twitter.com/armin_np_"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary p-2 rounded-md hover:bg-opacity-90 transition"
            >
              <FaTwitter className="text-sm" />
            </a>
            <a
              href="https://www.instagram.com/sepotifyir/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary p-2 rounded-md hover:bg-opacity-90 transition"
            >
              <FaInstagram className="text-sm" />
            </a>
            <a
              href="https://www.linkedin.com/in/armin-javan-b25a18334/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary p-2 rounded-md hover:bg-opacity-90 transition"
            >
              <FaLinkedinIn className="text-sm" />
            </a>
          </div>
        </div>

        {/* لینک‌های سریع */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">لینک‌های سریع</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/" className="hover:text-primary transition">صفحه اصلی</Link></li>
            <li><Link to="/products" className="hover:text-primary transition">محصولات</Link></li>
            <li><Link to="/about" className="hover:text-primary transition">درباره ما</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition">تماس با ما</Link></li>
            <li><Link to="/faq" className="hover:text-primary transition">سوالات متداول</Link></li>
          </ul>
        </div>

        {/* خبرنامه */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">عضویت در خبرنامه</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            برای دریافت اخبار، تخفیف‌ها و محصولات جدید، ایمیل خود را وارد کنید.
          </p>
          <form className="flex items-center gap-2">
            <input
              type="email"
              placeholder="ایمیل شما"
              className="flex-1 px-3 py-2 bg-dark2 text-gray-light border border-gray-med rounded-md focus:outline-none focus:border-primary text-sm"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-opacity-90 text-dark2 px-4 py-2 rounded-md text-sm transition"
            >
              ارسال
            </button>
          </form>
        </div>
      </div>

      {/* کپی‌رایت و توسعه‌دهنده */}
      <div className="border-t border-gray-700 py-6 text-center text-xs text-gray-500 space-y-2">
        <p>
          ساخته‌شده با <FaHeart className="inline text-red-500 mx-1" /> توسط{' '}
          <a href="https://www.arminjavan.site" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold">
            Armin Javan
          </a>
        </p>
        <p>&copy; {currentYear} Sepotify.ir - تمامی حقوق محفوظ است.</p>
      </div>
    </footer>
  );
}
