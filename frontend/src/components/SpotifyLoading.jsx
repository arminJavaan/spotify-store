// frontend/src/components/SpotifyLoading.jsx

import React from "react";
import { motion } from "framer-motion";

export default function SpotifyLoading() {
  const barVariants = {
    animate: {
      scaleY: [1, 2.5, 1],
      transition: {
        duration: 1,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#191414]">
      {/* Animated Bars */}
      <div className="flex space-x-2 mb-6">
        <motion.div
          className="w-2 h-8 bg-[#1DB954] rounded"
          variants={barVariants}
          animate="animate"
          style={{ originY: 1 }}
          transition={{ delay: 0 }}
        />
        <motion.div
          className="w-2 h-8 bg-[#1DB954] rounded"
          variants={barVariants}
          animate="animate"
          style={{ originY: 1 }}
          transition={{ delay: 0.15 }}
        />
        <motion.div
          className="w-2 h-8 bg-[#1DB954] rounded"
          variants={barVariants}
          animate="animate"
          style={{ originY: 1 }}
          transition={{ delay: 0.3 }}
        />
        <motion.div
          className="w-2 h-8 bg-[#1DB954] rounded"
          variants={barVariants}
          animate="animate"
          style={{ originY: 1 }}
          transition={{ delay: 0.45 }}
        />
        <motion.div
          className="w-2 h-8 bg-[#1DB954] rounded"
          variants={barVariants}
          animate="animate"
          style={{ originY: 1 }}
          transition={{ delay: 0.6 }}
        />
      </div>

      {/* Animated Site Name */}
      <motion.h1
        className="text-2xl font-extrabold text-[#1DB954] tracking-wider"
        initial="hidden"
        animate="visible"
        variants={textVariants}
      >
        سپاتیفای
      </motion.h1>
    </div>
  );
}
