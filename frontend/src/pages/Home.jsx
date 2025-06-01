// frontend/src/pages/Home.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <main className="bg-dark2 text-gray-light">
      {/* Hero */}
      <section className="relative overflow-hidden h-screen flex items-center bg-dark2">
        {/* انیمیشن پس‌زمینه */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-[-25%] left-[-25%] w-[150%] h-[150%] bg-gradient-to-br from-primary to-cyan-600 opacity-10 rounded-full filter blur-3xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            خرید <span className="text-primary">اکانت پرمیوم Spotify</span> با امنیت بالا
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-light mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            سریع، مطمئن و کم‌هزینه‌ترین روش برای تهیه اکانت رسمی اسپاتیفای
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.2 } }
            }}
          >
            <motion.a
              href="/products"
              as={Link}
              className="bg-primary hover:bg-opacity-90 text-dark2 font-semibold py-3 px-8 rounded-lg shadow-lg transition-all"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              مشاهده محصولات
            </motion.a>
            <motion.a
              href="#features"
              className="border border-primary hover:bg-primary hover:text-dark2 text-primary font-semibold py-3 px-8 rounded-lg transition-all"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            >
              ویژگی‌ها
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-12">
        <motion.div
          className="bg-dark1 rounded-2xl p-8 flex flex-col items-center shadow-lg hover:shadow-xl transition transform hover:-translate-y-2"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-primary text-dark2 rounded-full p-4 mb-4">
            <span className="text-3xl">🔒</span>
          </div>
          <h3 className="text-xl font-bold text-gray-light mb-2">تحویل فوری</h3>
          <p className="text-gray-light text-center">
            اطلاعات اکانت در کمتر از ۵ دقیقه برای شما ارسال می‌شود.
          </p>
        </motion.div>

        <motion.div
          className="bg-dark1 rounded-2xl p-8 flex flex-col items-center shadow-lg hover:shadow-xl transition transform hover:-translate-y-2"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="bg-primary text-dark2 rounded-full p-4 mb-4">
            <span className="text-3xl">💳</span>
          </div>
          <h3 className="text-xl font-bold text-gray-light mb-2">پرداخت آسان</h3>
          <p className="text-gray-light text-center">
            از طریق شاپرک، ارز دیجیتال یا کارت به کارت پرداخت کنید.
          </p>
        </motion.div>

        <motion.div
          className="bg-dark1 rounded-2xl p-8 flex flex-col items-center shadow-lg hover:shadow-xl transition transform hover:-translate-y-2"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="bg-primary text-dark2 rounded-full p-4 mb-4">
            <span className="text-3xl">📞</span>
          </div>
          <h3 className="text-xl font-bold text-gray-light mb-2">پشتیبانی ۲۴/۷</h3>
          <p className="text-gray-light text-center">
            با واتساپ یا تیکت پشتیبانی کنید.
          </p>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="bg-dark2 py-20 px-6">
        <div className="container mx-auto text-center mb-12">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-light mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            نحوهٔ خرید
          </motion.h2>
          <motion.p
            className="text-gray-light max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            در سه مرحله ساده، اکانت خود را سفارش داده و دریافت کنید.
          </motion.p>
        </div>

        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="bg-dark1 p-8 rounded-2xl flex flex-col items-center shadow-lg hover:shadow-xl transition transform hover:-translate-y-2"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-primary text-dark2 rounded-full p-5 mb-5">
              <span className="text-4xl">1</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-light mb-2">انتخاب محصول</h4>
            <p className="text-gray-light text-center">
              پلن مورد نظر خود را از لیست محصولات انتخاب کنید.
            </p>
          </motion.div>

          <motion.div
            className="bg-dark1 p-8 rounded-2xl flex flex-col items-center shadow-lg hover:shadow-xl transition transform hover:-translate-y-2"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="bg-primary text-dark2 rounded-full p-5 mb-5">
              <span className="text-4xl">2</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-light mb-2">پرداخت</h4>
            <p className="text-gray-light text-center">
              از روش‌های متنوع پرداخت نظیر شاپرک یا ارز دیجیتال استفاده کنید.
            </p>
          </motion.div>

          <motion.div
            className="bg-dark1 p-8 rounded-2xl flex flex-col items-center shadow-lg hover:shadow-xl transition transform hover:-translate-y-2"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="bg-primary text-dark2 rounded-full p-5 mb-5">
              <span className="text-4xl">3</span>
            </div>
            <h4 className="text-xl font-semibold text-gray-light mb-2">دریافت اکانت</h4>
            <p className="text-gray-light text-center">
              پس از تأیید، اکانت پرمیوم اسپاتیفای به ایمیل یا واتساپ شما ارسال می‌شود.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="container mx-auto flex flex-col items-center bg-dark1 rounded-2xl p-12 shadow-xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-light mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            آماده‌ای برای شروع؟
          </motion.h2>
          <motion.a
            href="/products"
            className="bg-primary hover:bg-opacity-90 text-dark2 font-semibold py-4 px-10 rounded-lg shadow-lg transition-all"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            خرید اکانت اسپاتیفای
          </motion.a>
        </div>
      </section>
    </main>
  )
}
