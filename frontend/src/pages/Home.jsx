import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import HeroSlider from '../components/HeroSlider'

export default function Home() {
  return (
    <main className="text-gray-light font-vazir">
      {/* Hero Section */}
<HeroSlider/>

  {/* INSTALL PROMO SECTION */}
      <section id="install-section" className="relative bg-gradient-to-br from-[#1db95422] via-[#12121266] to-[#1db95411] py-20 px-6 overflow-hidden min-h-[80vh] scroll-mt-24">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              اپلیکیشن اختصاصی ما رو نصب کن!
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              با نصب اپلیکیشن تحت وب ما (PWA)، تجربه سریع‌تر، ساده‌تر و امن‌تری از خرید اکانت پرمیوم اسپاتیفای داشته باش.
              نسخه موبایل، دسکتاپ و اپ اصلی Spotify هم اونجا هست.
            </p>
            <Link
              to="/install"
              className="inline-block bg-primary text-dark1 font-bold py-3 px-6 rounded-xl hover:bg-opacity-90 transition"
            >
              📲 ورود به صفحه نصب اپلیکیشن
            </Link>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <img
              src="/pwa-512x512.png"
              alt="App Preview"
              className="w-64 h-64 mx-auto drop-shadow-2xl rounded-2xl"
            />
          </motion.div>
        </div>
      </section>


      {/* Features */}
      <section
        id="features"
        className="container mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-3 gap-12"
      >
        {[
          {
            icon: "🔒",
            title: "تحویل فوری",
            desc: "اطلاعات اکانت در کمترین زمان برای شما ارسال می‌شود."
          },
          {
            icon: "💳",
            title: "پرداخت آسان",
            desc: "از طریق شاپرک، ارز دیجیتال یا کارت به کارت پرداخت کنید."
          },
          {
            icon: "📞",
            title: "پشتیبانی ۲۴/۷",
            desc: "با واتساپ یا تلگرام تیم ما پاسخگو شماست."
          }
        ].map((f, idx) => (
          <motion.div
            key={idx}
            className="bg-dark1 rounded-3xl p-8 flex flex-col items-center shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-transform"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.3, duration: 0.6 }}
          >
            <div className="bg-primary text-dark2 rounded-full w-16 h-16 flex items-center justify-center text-3xl mb-5 shadow-md">
              {f.icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
            <p className="text-gray-400 text-center text-sm">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Steps */}
      <section className="py-20 px-6 bg-dark2/70">
        <div className="container mx-auto text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-extrabold text-primary mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            نحوهٔ خرید
          </motion.h2>
          <motion.p
            className="text-gray-400 max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            در سه مرحله ساده، اکانت خود را سفارش داده و دریافت کنید.
          </motion.p>
        </div>

        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { step: 1, title: "انتخاب محصول", desc: "پلن مورد نظر خود را از لیست محصولات انتخاب کنید." },
            { step: 2, title: "پرداخت", desc: "از روش‌های متنوع پرداخت نظیر شاپرک یا ارز دیجیتال استفاده کنید." },
            { step: 3, title: "دریافت اکانت", desc: "پس از تأیید، اکانت پرمیوم اسپاتیفای به ایمیل یا واتساپ شما ارسال می‌شود." }
          ].map((s, i) => (
            <motion.div
              key={i}
              className="bg-dark1 p-8 rounded-3xl flex flex-col items-center shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-transform"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
            >
              <div className="bg-primary text-dark2 rounded-full w-16 h-16 flex items-center justify-center text-2xl mb-4 shadow">
                {s.step}
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{s.title}</h4>
              <p className="text-gray-400 text-center text-sm">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="container mx-auto flex flex-col items-center bg-dark1 rounded-3xl p-12 shadow-xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            آماده‌ای برای شروع؟
          </motion.h2>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Link
              to="/products"
              className="bg-primary hover:bg-opacity-90 text-dark2 font-bold py-4 px-10 rounded-lg shadow-lg transition-transform hover:scale-105"
            >
              خرید اکانت اسپاتیفای
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
