import React from 'react'

export default function ProductCard({ product, onAdd }) {
  return (
    <div className="bg-dark1 text-gray2 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform transition duration-300 ease-in-out hover:scale-105 animate-fadeIn animate-slideIn">
      {/* Image Container */}
      <div className="h-48 flex items-center justify-center bg-dark2 overflow-hidden">
        <img
          src={product.bannerUrl}
          alt={product.name}
          className="h-full w-auto object-contain transition-transform duration-300 ease-in-out hover:scale-110 hover:opacity-90"
        />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col justify-between">
        {/* Title & Description */}
        <div className="space-y-2 text-center">
          <h3 className="text-xl font-semibold text-primary">{product.name}</h3>
          <p className="text-gray2 text-sm leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Button */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-primary font-bold text-lg">
            {Number(product.price).toLocaleString('fa-IR')} تومان
          </span>
          <button
            onClick={() => onAdd(product._id)}
            className="px-4 py-2 bg-primary text-dark2 font-medium rounded-lg hover:bg-[#148c3c] transition-colors"
          >
            افزودن به سبد
          </button>
        </div>
      </div>
    </div>
  )
}
