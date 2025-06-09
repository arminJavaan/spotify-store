import React from "react";
import { motion } from "framer-motion";
import { FiUser, FiUsers, FiHome, FiUserCheck, FiChevronRight } from "react-icons/fi";

export default function PlanComparison() {
  const plans = [
    {
      title: "اکانت پرمیوم تکی (Individual)",
      icon: <FiUser className="text-xl" />,
      desc: "یه دنیا موسیقی، فقط برای خودت.",
      features: [
        "پخش نامحدود بدون تبلیغ",
        "دانلود و گوش دادن آفلاین",
        "کیفیت صدای بالا",
        "حساب کاملاً شخصی",
      ],
      tip: "برای افرادی که تنهایی گوش می‌دن و سلیقه‌شون براشون مهمه.",
    },
    {
      title: "اکانت پرمیوم دو نفره (Duo)",
      icon: <FiUsers className="text-xl" />,
      desc: "دو نفر، دوتا حساب، نصف هزینه.",
      features: [
        "دو اکانت جداگانه",
        "پلی‌لیست مشترک",
        "بدون تبلیغ و با کیفیت بالا",
        "دانلود آفلاین برای هر نفر",
      ],
      tip: "برای زوج‌ها یا دوستانی که باهم موزیک گوش می‌دن ولی حساب شخصی می‌خوان.",
    },
    {
      title: "اکانت پرمیوم خانواده (Family)",
      icon: <FiHome className="text-xl" />,
      desc: "موزیک برای همه اعضای خانواده، بدون دردسر.",
      features: [
        "تا ۶ اکانت با یک آدرس مشترک",
        "کنترل والدین و حساب کودک",
        "بدون تبلیغ و کیفیت بالا",
        "پلی‌لیست خانوادگی",
      ],
      tip: "برای خانواده‌ها یا دوستانی که می‌خوان هزینه رو تقسیم کنن.",
    },
    {
      title: "عضویت در خانواده (Family Member)",
      icon: <FiUserCheck className="text-xl" />,
      desc: "تمام امکانات پرمیوم، با نصف هزینه.",
      features: [
        "اکانت شخصی و مستقل",
        "بدون تبلیغ",
        "دانلود آفلاین",
        "نیاز نداشتن به مدیریت فمیلی",
      ],
      tip: "اقتصادی‌ترین پلن برای کسانی که فقط استفاده می‌خوان، نه مدیریت.",
    },
  ];

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-20 text-gray-light bg-dark2 min-h-screen">
      <motion.h1
        className="text-center text-3xl md:text-4xl font-bold text-primary mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        مقایسه پلن‌های پرمیوم اسپاتیفای
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            className="bg-dark1 p-6 rounded-xl border border-gray-700 hover:border-primary transition duration-300 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <div className="flex items-center gap-3 text-primary mb-4">
              {plan.icon}
              <h2 className="text-xl font-bold">{plan.title}</h2>
            </div>
            <p className="text-sm text-gray-400 mb-3">{plan.desc}</p>
            <ul className="list-disc pr-5 space-y-1 text-sm text-gray-300">
              {plan.features.map((f, idx) => (
                <li key={idx}>{f}</li>
              ))}
            </ul>
            <div className="mt-4 text-xs text-primary/80 italic border-t border-gray-700 pt-2">
              💡 {plan.tip}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-16">
        <motion.a
          href="/products"
          className="inline-flex items-center gap-2 bg-primary text-dark2 px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
          whileHover={{ scale: 1.05 }}
        >
          خرید پلن دلخواه
          <FiChevronRight />
        </motion.a>
      </div>
    </main>
  );
}
