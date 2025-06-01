// frontend/src/pages/Products.jsx

import React, { useEffect, useState, useContext } from 'react'
import API from '../api'
import ProductCard from '../components/ProductCard'
import { CartContext } from '../contexts/CartContext'
import { motion } from 'framer-motion'

export default function Products() {
  const [products, setProducts] = useState([])
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

  return (
    <main className="bg-dark2 text-gray-light py-20 px-6 min-h-screen">
      <motion.h2
        className="text-3xl font-bold text-center mb-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        لیست محصولات
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((prod) => (
          <ProductCard key={prod._id} product={prod} onAdd={addToCart} />
        ))}
      </div>
    </main>
  )
}
