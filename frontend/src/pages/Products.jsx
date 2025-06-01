import React, { useState, useEffect, useContext } from 'react'
import API from '../api'
import ProductCard from '../components/ProductCard'
import { CartContext } from '../contexts/CartContext'
import { FiSearch } from 'react-icons/fi'

export default function Products() {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const { addToCart } = useContext(CartContext)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get('/products')
        setProducts(res.data)
        setFiltered(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFiltered(products)
    } else {
      const term = searchTerm.trim().toLowerCase()
      setFiltered(
        products.filter(p =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
        )
      )
    }
  }, [searchTerm, products])

  return (
    <main className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-primary mb-6 text-center animate-fadeIn">
        محصولات ما
      </h2>

      {/* Search Bar */}
      <div className="relative max-w-md mx-auto mb-10 animate-slideIn">
        <FiSearch className="absolute top-1/2 right-3 -translate-y-1/2 text-gray2" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="جست‌وجو در محصولات..."
          className="w-full px-4 py-3 pr-10 bg-dark2 text-gray2 border border-gray1 rounded-lg focus:outline-none focus:border-primary transition"
        />
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="text-center text-gray2 py-16 animate-fadeIn">
          <p>هیچ محصولی با این مشخصات یافت نشد.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
          {filtered.map(prod => (
            <ProductCard key={prod._id} product={prod} onAdd={addToCart} />
          ))}
        </div>
      )}
    </main>
  )
}
