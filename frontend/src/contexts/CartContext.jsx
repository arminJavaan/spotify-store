// frontend/src/contexts/CartContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react'
import { AuthContext } from './AuthContext'

export const CartContext = createContext()

export default function CartProvider({ children }) {
  const { user } = useContext(AuthContext)
  const [cart, setCart] = useState([])

  // -----------------------------
  // ۱. دریافت سبد خرید برای کاربر لاگین‌شده
  // -----------------------------
  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart([])
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      setCart([])
      return
    }

    try {
      const res = await fetch('http://localhost:5000/api/cart', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) {
        if (res.status === 401) {
          setCart([])
          return
        }
        throw new Error(`خطا در دریافت سبد (کد: ${res.status})`)
      }
      const data = await res.json() // { items: [...] }
      setCart(data.items || [])
    } catch (err) {
      console.error('Error fetching cart:', err.message)
      setCart([])
    }
  }, [user])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  // -----------------------------
  // ۲. اضافه کردن به سبد خرید
  // -----------------------------
  const addToCart = async (productId) => {
    if (!user) {
      throw new Error('برای افزودن به سبد، ابتدا باید وارد شوید.')
    }
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('توکن یافت نشد. لطفاً مجدداً وارد شوید.')
    }

    try {
      const res = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      })

      if (!res.ok) {
        if (res.status === 401) {
          setCart([])
          throw new Error('اعتبارسنجی انجام نشد. لطفاً مجدداً وارد شوید.')
        }
        let errorMsg = `خطا در افزودن به سبد (کد: ${res.status})`
        try {
          const errData = await res.json()
          if (errData.msg) errorMsg = errData.msg
        } catch {}
        throw new Error(errorMsg)
      }

      const data = await res.json() // { items: [...] }
      setCart(data.items || [])
    } catch (err) {
      console.error('Error adding to cart:', err.message)
      throw err
    }
  }

  // -----------------------------
  // ۳. بروزرسانی کمیت آیتم در سبد
  // -----------------------------
  const updateQuantity = async (productId, quantity) => {
    if (!user) return
    const token = localStorage.getItem('token')
    if (!token) {
      console.warn('توکن یافت نشد. سبد خالی می‌شود.')
      setCart([])
      return
    }
    if (quantity <= 0) {
      return removeFromCart(productId)
    }
    try {
      const res = await fetch('http://localhost:5000/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      })
      if (!res.ok) {
        if (res.status === 401) {
          setCart([])
          return
        }
        console.error(`خطا در به‌روزرسانی کمیت (کد: ${res.status})`)
        return
      }
      const data = await res.json()
      setCart(data.items || [])
    } catch (err) {
      console.error('Error updating quantity:', err.message)
    }
  }

  // -----------------------------
  // ۴. حذف یک آیتم از سبد
  // -----------------------------
  const removeFromCart = async (productId) => {
    if (!user) return
    const token = localStorage.getItem('token')
    if (!token) {
      console.warn('توکن یافت نشد. سبد خالی می‌شود.')
      setCart([])
      return
    }
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) {
        if (res.status === 401) {
          setCart([])
          return
        }
        console.error(`خطا در حذف آیتم (کد: ${res.status})`)
        return
      }
      const data = await res.json()
      setCart(data.items || [])
    } catch (err) {
      console.error('Error removing from cart:', err.message)
    }
  }

  // -----------------------------
  // ۵. پاک کردن کل سبد
  // -----------------------------
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
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
