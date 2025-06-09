import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function InstallApp() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
    setIsIOS(isIosDevice && isSafari);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
        setShowButton(false);
      });
    }
  };

  return (
    <main className="relative overflow-hidden max-w-5xl mx-auto px-6 py-20 font-vazir mt-12 text-gray-light">
      {/* Waves background */}
      <svg
        className="absolute top-0 left-0 w-full h-64 text-primary opacity-10"
        viewBox="0 0 1440 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M0,128L60,122.7C120,117,240,107,360,101.3C480,96,600,96,720,106.7C840,117,960,139,1080,138.7C1200,139,1320,117,1380,106.7L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
        ></path>
      </svg>

      <motion.h1
        className="text-4xl font-extrabold text-primary mb-10 text-center relative z-10"
        initial={{ opacity: 0, y: -30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        📲 نصب اپلیکیشن سپاتیفای
      </motion.h1>

      <motion.div
        className="relative z-10 bg-dark2 border border-gray-700 rounded-3xl p-8 space-y-10 shadow-2xl"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
      >
        {/* نصب PWA */}
        <motion.section
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          <h2 className="text-xl font-bold text-white mb-3">💡 نصب به عنوان اپلیکیشن تحت وب</h2>

          {showButton && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleInstallClick}
              className="bg-primary text-dark1 font-bold py-3 px-6 rounded-xl hover:bg-opacity-90 transition text-base mb-4"
            >
              📦 نصب مستقیم PWA (اندروید / دسکتاپ)
            </motion.button>
          )}

          {isIOS && (
            <motion.div
              className="bg-yellow-800/20 text-yellow-300 text-sm p-4 rounded-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <p>📱 کاربران iOS:</p>
              <p>
                ابتدا با Safari وارد سایت شوید، سپس دکمه Share را زده و گزینه {" "}
                <strong>«Add to Home Screen»</strong> را انتخاب کنید تا اپلیکیشن به صفحه اصلی اضافه شود.
              </p>
            </motion.div>
          )}
        </motion.section>

        {/* اپ‌های در حال توسعه */}
        <motion.section
          className="pt-6 border-t border-gray-700"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <h2 className="text-xl font-bold text-white mb-3">📱 اپلیکیشن‌ اندروید (به‌زودی)</h2>
          <br />
          <ul className="list-disc pl-6 text-sm text-gray-400 space-y-1">
            <li>اپ اندروید (در حال توسعه)</li>
          </ul>
        </motion.section>

        {/* لینک‌های رسمی اسپاتیفای */}
        <motion.section
          className="pt-6 border-t border-gray-700"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <h2 className="text-xl font-bold text-white mb-3">🎧 دانلود اپلیکیشن رسمی Spotify</h2>
          <ul className="list-disc pl-6 text-sm text-gray-300 space-y-2">
            <li>
              <a
                href="https://play.google.com/store/apps/details?id=com.spotify.music"
                className="text-primary hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                📱 اندروید (Google Play)
              </a>
            </li>
            <li>
              <a
                href="https://apps.apple.com/app/spotify-music-and-podcasts/id324684580"
                className="text-primary hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                🍏 iOS (App Store)
              </a>
            </li>
            <li>
              <a
                href="https://www.spotify.com/download/windows/"
                className="text-primary hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                🖥 ویندوز
              </a>
            </li>
            <li>
              <a
                href="https://www.spotify.com/download/mac/"
                className="text-primary hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                🍎 macOS
              </a>
            </li>
          </ul>
        </motion.section>
      </motion.div>
    </main>
  );
}
