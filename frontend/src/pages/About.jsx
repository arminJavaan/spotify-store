import React from "react";
import { motion } from "framer-motion";
import { FiGlobe, FiHeadphones, FiZap, FiShield, FiSmile, FiStar, FiTrendingUp } from "react-icons/fi";

export default function About() {
  return (
    <main className="mt-16 text-gray-light px-4 sm:px-6 lg:px-8 pb-32 relative overflow-hidden">
      {/* پس‌زمینه تزئینی */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-primary/10 rounded-full blur-3xl z-0"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-primary/10 rounded-full blur-3xl z-0"></div>

      {/* Hero */}
      <motion.section
        className="max-w-5xl mx-auto text-center relative z-10 mt-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
          درباره سپاتیفای
        </h1>
        <p className="text-lg leading-relaxed text-gray-400">
          ما در سپاتیفای، یک هدف مشخص داریم:
          <br />
          <span className="text-white font-semibold">
            باز کردن دروازه‌های موسیقی جهانی به روی همه ایرانیان، بدون مرز و محدودیت.
          </span>
        </p>
      </motion.section>

      {/* Core Message */}
      <motion.section
        className="max-w-4xl mx-auto mt-16 bg-dark2 rounded-2xl p-8 border border-gray-700 text-center relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-gray-300 text-base leading-relaxed">
          با توجه به تحریم‌های موجود، بسیاری از کاربران ایرانی نمی‌توانند به‌راحتی از سرویس محبوب اسپاتیفای استفاده کنند. به همین دلیل، ما بستری مطمئن و آسان را فراهم کرده‌ایم تا شما بتوانید با اکانت‌های پرمیوم واقعی با IP ترکیه، تجربه‌ای بی‌دردسر و حرفه‌ای از اسپاتیفای داشته باشید.
        </p>
      </motion.section>

      {/* Highlights */}
      <motion.section
        className="mt-20 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10"
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
        {[
          {
            icon: <FiZap className="text-xl" />, title: "سرعت بالا",
            desc: "تحویل سریع اکانت‌های پرمیوم در کمترین زمان ممکن برای شروع بی‌وقفه موسیقی."
          },
          {
            icon: <FiShield className="text-xl" />, title: "امنیت واقعی",
            desc: "اطلاعات و پرداخت شما در بستری امن و رمزگذاری‌شده انجام می‌شود."
          },
          {
            icon: <FiSmile className="text-xl" />, title: "قیمت منصفانه",
            desc: "بهترین کیفیت خدمات با قیمتی منصفانه و رقابتی برای کاربران ایرانی."
          },
          {
            icon: <FiHeadphones className="text-xl" />, title: "پشتیبانی واقعی",
            desc: "تیم پشتیبانی ما همیشه آنلاین و پاسخگوی سوالات و مشکلات شماست."
          },
          {
            icon: <FiGlobe className="text-xl" />, title: "بدون مرز",
            desc: "اکانت‌های بین‌المللی با آی‌پی ترکیه، قابل استفاده بدون قطعی و دردسر."
          },
          {
            icon: <FiStar className="text-xl" />, title: "رضایت کاربران",
            desc: "با امتیازهای بالا و بازخورد مثبت، افتخار داریم همراه اعتماد شما باشیم."
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="bg-dark1 p-6 rounded-xl border border-gray-700 hover:border-primary/60 shadow-md hover:shadow-primary/10 transition-all"
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <div className="flex items-center justify-center bg-primary text-dark2 w-12 h-12 rounded-md mb-4 mx-auto">
              {item.icon}
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-gray-400 text-center leading-relaxed">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </motion.section>

      {/* Quote */}
      <motion.section
        className="mt-24 max-w-3xl mx-auto text-center relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <blockquote className="text-xl text-gray-300 italic border-l-4 border-primary pl-4">
          🎵 موسیقی تنها زبان بین‌المللی‌ست که همه باید از آن لذت ببرند.
        </blockquote>
        <p className="mt-4 text-gray-400 text-sm">— شعار ما در سپاتیفای</p>
      </motion.section>

      {/* CTA */}
      <motion.section
        className="mt-20 text-center relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
          به سپاتیفای خوش آمدی — جایی برای شنیدن بی‌مرز
        </h2>
        <motion.a
          href="/products"
          className="inline-block bg-primary text-dark2 px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
          whileHover={{ scale: 1.05 }}
        >
          مشاهده پلن‌های اکانت پرمیوم
        </motion.a>
      </motion.section>
    </main>
  );
}