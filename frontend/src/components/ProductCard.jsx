// ProductCard با طراحی دقیق مشابه تصویر ارسالی، با گوشه‌های پایین پاره‌شده، بک‌گراند قیمت کاملاً مشابه و دکمه سبز

import React from 'react';
import { motion } from 'framer-motion';

export default function ProductCard({ product, onAdd }) {
  const handleAdd = async () => {
    try {
      await onAdd(product._id);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <motion.div
      className="bg-[#2c2c2c] rounded-2xl overflow-hidden shadow-lg border border-gray-700 flex flex-col"
      whileHover={{ scale: 1.01 }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* تصویر بنر */}
      <div className="w-full h-48 overflow-hidden">
        <img
          src={product.bannerUrl}
          alt={product.name}
          className="object-cover w-full h-full"
        />
      </div>

      {/* نام و توضیحات */}
      <div className="px-4 sm:px-6 pt-5 pb-4 flex flex-col gap-3 text-right">
        <h3 className="text-gray-100 font-bold text-[15px] sm:text-base leading-tight group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line group-hover:text-gray-200 transition-colors duration-300">
          {product.description}
        </p>
      </div>

      {/* افکت خط نقطه‌چین کامل */}
      <div className="relative w-full px-6">
        <div className="w-full border-t-2 border-dashed border-gray-500"></div>
      </div>

      {/* ناحیه پایین کارت */}
      <div className="bg-[#1c1c1c] flex items-center justify-between px-6 py-4 relative rounded-b-2xl">
        <div className="bg-gradient-to-r from-[#04220e] to-[#1db954] px-6 py-2 pl-40 rounded-md text-sm text-white font-bold shadow-md">
          {Number(product.price).toLocaleString('fa-IR')} تومان
        </div>
        <button
          onClick={handleAdd}
          className="bg-[#1db954] text-white text-sm font-bold px-6 py-2 rounded-md hover:bg-[#1ed760] transition"
        >
          افزودن به سبد
        </button>
        
      </div>
    </motion.div>
  );
}