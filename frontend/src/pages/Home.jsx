import React from "react";
import { Link } from "react-router-dom";


export default function Home() {
  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Background Image */}
        <img
          src="../assets/images/bgspotify.jpg"
          alt="Spotify background"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-60"
          loading="eager"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark2/80 to-dark2/60" />
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 animate-fadeIn">
            خرید اکانت پرمیوم اسپاتیفای
          </h1>
          <p className="text-gray2 text-base sm:text-lg md:text-xl lg:text-2xl mb-6 animate-slideIn max-w-2xl">
            به‌روزترین پلن‌ها با بهترین قیمت و تحویل آنی. تجربه‌ی موسیقی بی‌نقص
            را با اشتراک پرمیوم اسپاتیفای داشته باشید.
          </p>
          <Link
            to="/products"
            className="px-6 py-3 bg-primary text-dark2 rounded-full font-semibold hover:bg-[#148c3c] transition-transform transform hover:scale-105 animate-fadeIn"
          >
            مشاهده محصولات
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center animate-fadeIn">
            <div className="text-6xl text-primary mb-3">🔒</div>
            <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-100">
              تحویل آنی بعد از خرید
            </h3>
            <p className="text-gray2 max-w-xs">
              پس از پرداخت، تمام اطلاعات اکانت در کمتر از ۵ دقیقه برای شما ارسال
              می‌شود.
            </p>
          </div>
          <div className="flex flex-col items-center text-center animate-fadeIn delay-200">
            <div className="text-6xl text-primary mb-3">💳</div>
            <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-100">
              ۳ روش پرداخت متنوع
            </h3>
            <p className="text-gray2 max-w-xs">
              پرداخت اینترنتی شاپرک، ارز دیجیتال یا کارت به کارت + ثبت سفارش
              واتساپی
            </p>
          </div>
          <div className="flex flex-col items-center text-center animate-fadeIn delay-400">
            <div className="text-6xl text-primary mb-3">📱</div>
            <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-100">
              پشتیبانی ۲۴ ساعته
            </h3>
            <p className="text-gray2 max-w-xs">
              در هر لحظه که نیاز داشتید از طریق واتساپ یا تیکت با ما در ارتباط
              باشید.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
