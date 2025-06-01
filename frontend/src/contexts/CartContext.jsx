import React, { createContext, useState, useEffect, useContext } from 'react'
import API from '../api'
import { AuthContext } from './AuthContext'

export const CartContext = createContext()

export default function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const { user } = useContext(AuthContext)

  const fetchCart = async () => {
    if (!user) return
    try {
      const res = await API.get('/cart')
      setCart(res.data.items)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [user])

  const addToCart = async (productId) => {
    try {
      const res = await API.post('/cart', { productId })
      setCart(res.data.items)
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await API.put('/cart', { productId, quantity })
      setCart(res.data.items)
    } catch (err) {
      console.error(err)
    }
  }

  const removeFromCart = async (productId) => {
    try {
      const res = await API.delete(`/cart/${productId}`)
      setCart(res.data.items)
    } catch (err) {
      console.error(err)
    }
  }

  const clearCart = () => setCart([])

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart, fetchCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}
