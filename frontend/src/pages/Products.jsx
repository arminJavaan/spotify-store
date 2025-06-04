// frontend/src/pages/Products.jsx

import React, { useEffect, useState, useContext, useMemo } from 'react'
import API from '../api'
import ProductCard from '../components/ProductCard'
import { CartContext } from '../contexts/CartContext'
import { motion } from 'framer-motion'

export default function Products() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const { addToCart } = useContext(CartContext)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get('/products')
        let list = []
        const payload = res.data
        if (Array.isArray(payload)) {
          list = payload
        } else if (Array.isArray(payload.products)) {
          list = payload.products
        } else {
          const arr = Object.values(payload).find((val) => Array.isArray(val))
          if (Array.isArray(arr)) {
            list = arr
          } else {
            console.warn('Unexpected /products response:', payload)
          }
        }
        setProducts(list)
      } catch (err) {
        console.error('Error fetching products:', err.response?.data || err.message)
        setProducts([])
      }
    }
    fetchProducts()
  }, [])

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return products
    const term = searchTerm.trim().toLowerCase()
    return products.filter((p) => p.name.toLowerCase().includes(term))
  }, [products, searchTerm])

  return (
    <main className="relative min-h-screen bg-dark2 text-gray-light mt-12 overflow-hidden font-vazir">
      {/* گرادینت چرخشی در پس‌زمینه */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute top-[-30%] left-[-30%] w-[160%] h-[160%] bg-gradient-to-br from-primary to-cyan-600 opacity-10 rounded-full filter blur-3xl" />
      </motion.div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* عنوان صفحه */}
        <motion.h2
          className="text-4xl font-extrabold text-center mb-12 text-primary"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🎧 لیست پلن های اسپاتیفای
        </motion.h2>

        {/* سرچ‌بار فانتزی */}
        <motion.div
          className="max-w-md mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center bg-dark1 rounded-full shadow-xl ring-1 ring-white/10 overflow-hidden">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجوی پلن اسپاتیفای..."
              className="w-full px-5 py-3 bg-transparent text-sm sm:text-base text-gray-light placeholder-gray-med focus:outline-none"
            />
            <svg
              className="w-6 h-6 text-gray-med mr-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
          </div>
        </motion.div>

        {/* گرید محصولات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filtered.map((prod, idx) => (
            <motion.div
              key={prod._id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
            >
              <ProductCard product={prod} onAdd={addToCart} />
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <motion.p
              className="col-span-full text-center text-gray-med mt-16 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              😕 محصولی با این نام یافت نشد.
            </motion.p>
          )}
        </div>
      </div>
    </main>
  )
}
