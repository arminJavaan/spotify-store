// frontend/src/components/SpotifyLoading.jsx

import React from 'react'
import { motion } from 'framer-motion'

export default function SpotifyLoading() {
  const barVariants = {
    animate: {
      scaleY: [1, 2, 1],
      transition: {
        duration: 0.8,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    },
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#191414]">
      <div className="flex space-x-2">
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
          transition={{ delay: 0.2 }}
        />
        <motion.div
          className="w-2 h-8 bg-[#1DB954] rounded"
          variants={barVariants}
          animate="animate"
          style={{ originY: 1 }}
          transition={{ delay: 0.4 }}
        />
        <motion.div
          className="w-2 h-8 bg-[#1DB954] rounded"
          variants={barVariants}
          animate="animate"
          style={{ originY: 1 }}
          transition={{ delay: 0.6 }}
        />
        <motion.div
          className="w-2 h-8 bg-[#1DB954] rounded"
          variants={barVariants}
          animate="animate"
          style={{ originY: 1 }}
          transition={{ delay: 0.8 }}
        />
      </div>
    </div>
  )
}
