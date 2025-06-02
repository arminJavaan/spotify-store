// frontend/src/pages/About.jsx

import React from "react";
import { motion } from "framer-motion";
import {
  FiMusic,
  FiUsers,
  FiStar,
  FiShield,
  FiHeadphones,
  FiHeart,
} from "react-icons/fi";

export default function About() {
  return (
    <main className="mt-12 text-gray-light min-h-screen py-16 px-6">
      {/* Hero Section */}
      <motion.section
        className="max-w-4xl mx-auto text-center space-y-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-primary">دربارهٔ ما</h1>
        <p className="text-lg">
          در SpotifyStore دنیای جدیدی از خرید آنلاین موسیقی و محصولات دیجیتال را تجربه کنید.  
          ما با شور و اشتیاق بی‌پایان تلاش می‌کنیم بهترین خدمات را به شما ارائه دهیم.
        </p>
      </motion.section>

      {/* Mission & Vision */}
      <motion.section
        className="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        }}
      >
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-primary flex items-center space-x-2">
            <FiMusic className="text-2xl" />
            ماموریت ما
          </h2>
          <p className="text-gray-light leading-relaxed">
            ما معتقدیم موسیقی روح زندگی را زنده نگه می‌دارد.  
            SpotifyStore در تلاش است تا با گردآوری بهترین آلبوم‌ها و محصولات دیجیتال،  
            دسترسی آسان، امن و سریع به دنیای موسیقی را برای همه امکان‌پذیر کند.
          </p>
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-primary flex items-center space-x-2">
            <FiUsers className="text-2xl" />
            چشم‌انداز ما
          </h2>
          <p className="text-gray-light leading-relaxed">
            تلاش می‌کنیم بستری پویا و کاربرپسند بسازیم تا هر عاشق موسیقی در هر نقطه‌ای  
            از جهان بتواند با چند کلیک ساده به آثار هنرمندان مورد علاقه‌اش دسترسی داشته باشد  
            و از تجربه خرید لذت ببرد.
          </p>
        </div>
      </motion.section>

      {/* Core Values */}
      <motion.section
        className="mt-16 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, staggerChildren: 0.2 },
          },
        }}
      >
        <motion.div
          className="bg-dark1 p-6 rounded-lg border border-gray-med hover:border-primary transition"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <div className="flex items-center justify-center bg-primary text-dark2 w-12 h-12 rounded-md mb-4 mx-auto">
            <FiStar className="text-xl" />
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">کیفیت برتر</h3>
          <p className="text-gray-light text-center">
            از بین بهترین‌های صنعت موسیقی گزینش می‌کنیم تا شما از کیفیت عالی لذت ببرید.
          </p>
        </motion.div>

        <motion.div
          className="bg-dark1 p-6 rounded-lg border border-gray-med hover:border-primary transition"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <div className="flex items-center justify-center bg-primary text-dark2 w-12 h-12 rounded-md mb-4 mx-auto">
            <FiShield className="text-xl" />
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">امنیت و اعتماد</h3>
          <p className="text-gray-light text-center">
            اطلاعات شخصی و تراکنش‌های شما در بستری کاملاً امن و رمزگذاری‌شده پردازش می‌شود.
          </p>
        </motion.div>

        <motion.div
          className="bg-dark1 p-6 rounded-lg border border-gray-med hover:border-primary transition"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <div className="flex items-center justify-center bg-primary text-dark2 w-12 h-12 rounded-md mb-4 mx-auto">
            <FiHeadphones className="text-xl" />
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">پشتیبانی بی‌وقفه</h3>
          <p className="text-gray-light text-center">
            تیم پشتیبانی ما در هر ساعت از شبانه‌روز آماده پاسخگویی به سوالات و مشکلات شماست.
          </p>
        </motion.div>

        <motion.div
          className="bg-dark1 p-6 rounded-lg border border-gray-med hover:border-primary transition"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <div className="flex items-center justify-center bg-primary text-dark2 w-12 h-12 rounded-md mb-4 mx-auto">
            <FiHeart className="text-xl" />
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">علاقه‌مندی کاربران</h3>
          <p className="text-gray-light text-center">
            با بررسی نظرات شما، همواره خود را بهبود می‌دهیم تا هر بار تجربه بهتری ارائه دهیم.
          </p>
        </motion.div>

        <motion.div
          className="bg-dark1 p-6 rounded-lg border border-gray-med hover:border-primary transition"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <div className="flex items-center justify-center bg-primary text-dark2 w-12 h-12 rounded-md mb-4 mx-auto">
            <FiUsers className="text-xl" />
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">جامعهٔ پویا</h3>
          <p className="text-gray-light text-center">
            با ایجاد فضایی دوستانه، شما می‌توانید دیدگاه‌های خود را به اشتراک بگذارید و همفکران خود را پیدا کنید.
          </p>
        </motion.div>

        <motion.div
          className="bg-dark1 p-6 rounded-lg border border-gray-med hover:border-primary transition"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <div className="flex items-center justify-center bg-primary text-dark2 w-12 h-12 rounded-md mb-4 mx-auto">
            <FiMusic className="text-xl" />
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">تنوع بی‌پایان</h3>
          <p className="text-gray-light text-center">
            آرشیوی گسترده از ژانرهای مختلف موسیقی و محصولات دیجیتال برای هر سلیقه‌ای گردآوری شده است.
          </p>
        </motion.div>
      </motion.section>

      {/* Call-to-Action */}
      <motion.section
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-primary mb-4">
          همراه ما باشید!
        </h2>
        <p className="text-gray-light mb-6">
          امروز به جمع SpotifyStore بپیوندید و از پیشنهادات ویژه و آخرین آلبوم‌ها بهره‌مند شوید.
        </p>
        <motion.a
          href="/register"
          className="inline-block bg-primary text-dark2 px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
          whileHover={{ scale: 1.05 }}
        >
          ثبت نام و شروع خرید
        </motion.a>
      </motion.section>
    </main>
  );
}
