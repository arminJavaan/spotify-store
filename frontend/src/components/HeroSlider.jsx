// frontend/src/components/HeroSlider.jsx

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

const slides = [
  {
    title: "خرید اکانت پرمیوم Spotify با امنیت بالا",
    desc: "سریع، مطمئن و کم‌هزینه‌ترین روش برای تهیه اکانت رسمی اسپاتیفای",
  },
  {
    title: "تحویل فوری، پشتیبانی ۲۴ ساعته",
    desc: "اکانت در کمترین زمان، همراه با پشتیبانی تلگرامی",
  },
  {
    title: "انواع پلن‌ها برای هر نیاز",
    desc: "پلن‌های Individual، Family، Duo و ... با قیمت مناسب",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (dir) => {
    setIndex((prev) =>
      dir === "next" ? (prev + 1) % slides.length : (prev - 1 + slides.length) % slides.length
    );
  };

  return (
    <section className="relative overflow-hidden min-h-[100vh] flex items-center bg-dark2">
      {/* بک‌گراند چرخشی */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-[-25%] left-[-25%] w-[150%] h-[150%] bg-gradient-to-br from-primary to-cyan-600 opacity-10 rounded-full filter blur-3xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 md:px-10 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="max-w-screen-md mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-4 sm:mb-6 leading-tight">
              {slides[index].title.split("Spotify").map((part, i) => (
                <React.Fragment key={i}>
                  {part}
                  {i !== slides[index].title.split("Spotify").length - 1 && (
                    <span className="text-primary">Spotify</span>
                  )}
                </React.Fragment>
              ))}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 sm:mb-10 leading-relaxed">
              {slides[index].desc}
            </p>

            <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 justify-center items-center">
              <Link
                to="/products"
                className="bg-primary hover:bg-opacity-90 text-dark2 text-sm sm:text-base font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg shadow-md transition-transform hover:scale-105 w-full xs:w-auto text-center"
              >
                مشاهده محصولات
              </Link>
              <a
                href="#features"
                className="border-2 border-primary hover:bg-primary hover:text-dark2 text-primary text-sm sm:text-base font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg transition hover:scale-105 w-full xs:w-auto text-center"
              >
                ویژگی‌ها
              </a>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* فلش‌های ناوبری */}
        {/* <div className="absolute bottom-6 xs:bottom-10 left-4 right-4 flex justify-between items-center z-20">
          <button
            onClick={() => goTo("prev")}
            className="text-primary hover:text-white bg-white/10 hover:bg-white/20 p-2 sm:p-3 rounded-full transition"
          >
            <FaChevronRight size={16} />
          </button>
          <button
            onClick={() => goTo("next")}
            className="text-primary hover:text-white bg-white/10 hover:bg-white/20 p-2 sm:p-3 rounded-full transition"
          >
            <FaChevronLeft size={16} />
          </button>
        </div> */}
      </div>
    </section>
  );
}
