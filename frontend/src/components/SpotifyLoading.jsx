// frontend/src/components/Loading.jsx

import React from "react";
import { motion } from "framer-motion";
import { FaSpotify } from "react-icons/fa";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-black via-dark2 to-dark1 text-center text-gray-light font-vazir">
      
      {/* لوگو Spotify */}
      <motion.div
        className="bg-primary p-6 rounded-full shadow-lg animate-pulse mb-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <FaSpotify className="text-dark2 text-5xl" />
      </motion.div>

      {/* نوشته سپاتیفای */}
      <motion.h2
        className="text-2xl sm:text-3xl font-extrabold text-primary tracking-wider mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        سپاتیفای
      </motion.h2>

      {/* انیمیشن موزیک پلیر */}
      <motion.div
        className="flex items-end justify-center gap-2 h-20"
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
            className="w-2 sm:w-3 rounded bg-primary"
            variants={{
              hidden: { height: 5 },
              visible: {
                height: [10, 35, 20, 45, 15][i],
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
    </div>
  );
}
