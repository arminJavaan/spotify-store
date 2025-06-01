// frontend/src/contexts/CartContext.jsx

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react'
import { AuthContext } from './AuthContext'
import API from '../api'

export const CartContext = createContext()

export default function CartProvider({ children }) {
  const { user } = useContext(AuthContext)
  const [cart, setCart] = useState([])

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart([])
      return
    }
    try {
      const res = await API.get('/cart')
      setCart(res.data.items || [])
    } catch (err) {
      console.error('Error fetching cart:', err.response?.data || err.message)
      setCart([])
    }
  }, [user])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const addToCart = async (productId) => {
    if (!user) {
      throw new Error('برای افزودن به سبد، ابتدا باید وارد شوید.')
    }
    try {
      const res = await API.post('/cart', { productId })
      setCart(res.data.items || [])
    } catch (err) {
      console.error('Error adding to cart:', err.response?.data || err.message)
      throw err
    }
  }

  const updateQuantity = async (productId, quantity) => {
    if (!user) return
    if (quantity <= 0) {
      return removeFromCart(productId)
    }
    try {
      const res = await API.put('/cart', { productId, quantity })
      setCart(res.data.items || [])
    } catch (err) {
      console.error('Error updating quantity:', err.response?.data || err.message)
    }
  }

  const removeFromCart = async (productId) => {
    if (!user) return
    try {
      const res = await API.delete(`/cart/${productId}`)
      setCart(res.data.items || [])
    } catch (err) {
      console.error('Error removing from cart:', err.response?.data || err.message)
    }
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        fetchCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
