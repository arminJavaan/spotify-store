// frontend/src/components/ProductCard.jsx
import React from 'react'
import { motion } from 'framer-motion'

export default function ProductCard({ product, onAdd }) {
  // در این تابع، try/catch می‌کنیم تا اگر کاربر لاگین نبود،
  // خطا گرفته شود و به کاربر اطلاع دهیم.
  const handleAdd = async () => {
    try {
      await onAdd(product._id)
      // در صورت موفقیت، می‌توانید یک انیمیشن کوتاه یا پیام موفقیت بدهید
      // برای مثال: alert('محصول به سبد اضافه شد')
    } catch (err) {
      // ارور از addToCart برگردانده شده (مثلاً "ابتدا وارد شوید.")
      alert(err.message)
    }
  }

  return (
    <motion.div
      className="bg-dark1 rounded-2xl shadow-lg overflow-hidden flex flex-col"
      whileHover={{ y: -5, boxShadow: '0px 15px 30px rgba(29, 185, 84, 0.2)' }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-48 bg-gray-med flex items-center justify-center overflow-hidden">
        <img
          src={product.bannerUrl}
          alt={product.name}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-light mb-2">{product.name}</h3>
        <p className="text-gray-light text-sm flex-grow leading-relaxed">{product.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-primary font-bold">
            {Number(product.price).toLocaleString('fa-IR')} تومان
          </span>
          <button
            onClick={handleAdd}
            className="bg-primary hover:bg-opacity-90 text-dark2 px-4 py-2 rounded-lg font-medium transition"
          >
            افزودن به سبد
          </button>
        </div>
      </div>
    </motion.div>
  )
}
