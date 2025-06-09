import React from "react";
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
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (id) => {
    const element = document.querySelector(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
    }
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
              <button
                onClick={() => scrollToSection("#features")}
                className="border-2 border-primary hover:bg-primary hover:text-dark2 text-primary text-sm sm:text-base font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg transition hover:scale-105 w-full xs:w-auto text-center"
              >
                ویژگی‌ها
              </button>
              <button
                onClick={() => scrollToSection("#install-section")}
                className="border-2 border-primary hover:bg-primary hover:text-dark2 text-primary text-sm sm:text-base font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg transition hover:scale-105 w-full xs:w-auto text-center"
              >
                📲 نصب اپلیکیشن
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
