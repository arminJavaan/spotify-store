import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSpotify } from "react-icons/fa";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-dark2 to-dark1 flex flex-col justify-center items-center text-center text-gray-light px-4 py-16 font-vazir overflow-hidden">

      {/* Animated Spotify Icon */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex items-center justify-center mb-8"
      >
        <div className="bg-primary p-6 rounded-full shadow-lg animate-pulse">
          <FaSpotify className="text-dark2 text-5xl" />
        </div>
      </motion.div>

      {/* 404 Title */}
      <motion.h1
        className="text-[120px] sm:text-[150px] font-extrabold text-primary drop-shadow-md leading-none"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        404
      </motion.h1>

      {/* Message */}
      <motion.p
        className="text-xl sm:text-2xl text-gray-300 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        صفحه مورد نظر پیدا نشد!
      </motion.p>

      {/* Description */}
      <motion.p
        className="text-sm text-gray-400 mb-8 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        به نظر می‌رسه داری توی دنیای موزیک گم می‌شی... بیا برگردیم به مسیر اصلی 🎧
      </motion.p>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Link
          to="/"
          className="bg-primary text-dark2 py-3 px-8 rounded-xl font-semibold shadow-lg hover:bg-opacity-90 transition"
        >
          بازگشت به خانه
        </Link>
      </motion.div>

      {/* Fake Music Player Animation */}
      <motion.div
        className="mt-16 flex items-end justify-center gap-2 h-20"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.2,
              repeat: Infinity,
              repeatType: "loop",
            },
          },
        }}
      >
        {[1, 2, 3, 4, 5].map((_, i) => (
          <motion.div
            key={i}
            className="w-3 sm:w-4 rounded bg-primary"
            variants={{
              hidden: { height: 5 },
              visible: {
                height: [5, 30, 10, 40, 5][i],
                transition: {
                  yoyo: Infinity,
                  duration: 0.6 + i * 0.1,
                  repeat: Infinity,
                  repeatType: "reverse",
                },
              },
            }}
          />
        ))}
      </motion.div>
    </main>
  );
}
