import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import HeroSlider from '../components/HeroSlider'
import ProductSliderSection from '../components/ProductSliderSection'
import { FaCheckCircle, FaCreditCard, FaHeadset, FaListOl, FaMoneyBillWave, FaRocket } from 'react-icons/fa';

export default function Home() {
  return (
    <main className="text-gray-light font-vazir">
      {/* Hero Section */}
<HeroSlider/>
<ProductSliderSection />
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


<section  id='features' className="py-24 px-6">
      <div className="container mx-auto text-center mb-14">
        <motion.h2
          className="text-3xl md:text-4xl font-extrabold text-primary mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          چرا ما را انتخاب کنید؟
        </motion.h2>
        <motion.p
          className="text-gray-400 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          ما تجربه‌ای سریع، مطمئن و پشتیبانی‌شده از خرید اکانت اسپاتیفای را برایتان فراهم کرده‌ایم.
        </motion.p>
      </div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            icon: <FaRocket className="text-4xl text-primary" />, 
            title: "تحویل فوری",
            desc: "اطلاعات اکانت پس از پرداخت در کمترین زمان برایتان ارسال می‌شود."
          },
          {
            icon: <FaCreditCard className="text-4xl text-primary" />, 
            title: "پرداخت ایمن",
            desc: "پرداخت از طریق درگاه شاپرک، کارت به کارت یا کریپتو به‌صورت کاملاً ایمن انجام می‌شود."
          },
          {
            icon: <FaHeadset className="text-4xl text-primary" />, 
            title: "پشتیبانی شبانه‌روزی",
            desc: "تیم پشتیبانی ما در تلگرام و واتساپ، همیشه در کنار شماست."
          }
        ].map((item, i) => (
          <motion.div
            key={i}
            className="bg-gradient-to-b from-dark2 to-dark3 rounded-3xl p-8 text-center flex flex-col items-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-transform"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
          >
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary bg-opacity-10 mb-5">
              {item.icon}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
      {/* مراحل سفارش */}
<section className="py-24 px-6 bg-gradient-to-br from-dark2 to-dark3">
      <div className="container mx-auto text-center mb-16">
        <motion.h2
          className="text-3xl md:text-4xl font-extrabold text-primary mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          مراحل ثبت سفارش
        </motion.h2>
        <motion.p
          className="text-gray-400 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          خرید اکانت اسپاتیفای تنها در ۳ مرحله ساده
        </motion.p>
      </div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {[ 
          {
            icon: <FaListOl className="text-4xl text-primary" />, 
            title: "انتخاب پلن",
            desc: "یکی از پلن‌های فردی، دو نفره یا خانواده را از لیست محصولات انتخاب کنید."
          },
          {
            icon: <FaMoneyBillWave className="text-4xl text-primary" />, 
            title: "پرداخت سریع",
            desc: "روش پرداخت دلخواه خود را انتخاب کرده و پرداخت را انجام دهید."
          },
          {
            icon: <FaCheckCircle className="text-4xl text-primary" />, 
            title: "تحویل فوری",
            desc: "اکانت پرمیوم شما در کمترین زمان به ایمیل یا واتساپتان ارسال می‌شود."
          }
        ].map((step, i) => (
          <motion.div
            key={i}
            className="bg-gradient-to-b from-dark3 to-dark2 p-8 rounded-3xl text-center flex flex-col items-center shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-transform"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
          >
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary bg-opacity-10 mb-5">
              {step.icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
      {/* Call to Action */}
      <section className="py-24 px-6">
        <div className="container mx-auto bg-gradient-to-br from-dark2 to-dark1 rounded-3xl p-12 shadow-2xl text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            همین حالا پرمیوم شو 🎧
          </motion.h2>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
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
  );
}