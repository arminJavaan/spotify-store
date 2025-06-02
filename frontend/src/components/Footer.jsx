// frontend/src/components/Footer.jsx

import React from 'react'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="backdrop-blur-xl text-gray-light py-10 mt-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 ">
        {/* لوگو و توضیح کوتاه */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-primary">SpotifyStore</h2>
          <p className="text-sm text-gray-400">
            تجربه خرید آنلاین موسیقی و محصولات دیجیتال با نمایش ساده و کاربردی.
          </p>
          <div className="flex space-x-3 mt-2 gap-12">
            <a
              href="#"
              className="bg-primary p-2 rounded-md hover:bg-opacity-90 transition"
            >
              <FaFacebookF className="text-sm" />
            </a>
            <a
              href="#"
              className="bg-primary p-2 rounded-md hover:bg-opacity-90 transition "
            >
              <FaTwitter className="text-sm" />
            </a>
            <a
              href="#"
              className="bg-primary p-2 rounded-md hover:bg-opacity-90 transition"
            >
              <FaInstagram className="text-sm" />
            </a>
            <a
              href="#"
              className="bg-primary p-2 rounded-md hover:bg-opacity-90 transition"
            >
              <FaLinkedinIn className="text-sm" />
            </a>
          </div>
        </div>

        {/* لینک‌های سریع */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-light">لینک‌های سریع</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>
              <a href="/" className="hover:text-primary transition">
                صفحه اصلی
              </a>
            </li>
            <li>
              <a href="/products" className="hover:text-primary transition">
                محصولات
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-primary transition">
                درباره ما
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-primary transition">
                تماس با ما
              </a>
            </li>
            <li>
              <a href="/faq" className="hover:text-primary transition">
                سوالات متداول
              </a>
            </li>
          </ul>
        </div>

        {/* عضویت در خبرنامه */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-light">خبرنامه</h3>
          <p className="text-sm text-gray-400">
            ایمیل خود را وارد کنید تا اخبار و تخفیف‌ها را دریافت کنید:
          </p>
          <form className="flex space-x-2">
            <input
              type="email"
              placeholder="ایمیل شما"
              className="flex-1 px-3 py-2 bg-dark2 text-gray-light border border-gray-med rounded-md focus:outline-none focus:border-primary text-sm ml-2"
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

      <div className="mt-8 border-t border-gray-med pt-4 text-center text-xs text-gray-500">
        &copy; {currentYear} SpotifyStore. تمامی حقوق محفوظ است.
      </div>
    </footer>
  )
}
