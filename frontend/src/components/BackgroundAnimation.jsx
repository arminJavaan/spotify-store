// frontend/src/components/BackgroundAnimation.jsx

import React from 'react'
import { motion } from 'framer-motion'

export default function BackgroundAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <motion.div
        className="absolute top-[-25%] left-[-25%] w-[150%] h-[150%] bg-gradient-to-br from-primary to-cyan-600 opacity-10 rounded-full filter blur-3xl"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}
