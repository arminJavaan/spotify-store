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
    // اگر کاربر لاگین نشده باشد، سبد را خالی می‌کنیم و فرمان داده نمی‌شود
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
      const res = await fetch('/api/cart', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) {
        // اگر خطای 401 (توکن نامعتبر یا منقضی) باشد،
        // سبد را خالی و خاتمه می‌دهیم
        if (res.status === 401) {
          setCart([])
          return
        }
        // سایر خطاها
        throw new Error(`خطا در دریافت سبد (کد: ${res.status})`)
      }
      const data = await res.json() // { items: [ { product: {...}, quantity: n }, ... ] }
      setCart(data.items || [])
    } catch (err) {
      console.error('Error fetching cart:', err.message)
      setCart([]) // در صورت خطا، سبد را خالی کن
    }
  }, [user])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  // -----------------------------
  // ۲. اضافه کردن به سبد خرید
  // -----------------------------
  const addToCart = async (productId) => {
    // اگر هنوز کاربر لاگین نکرده باشد، به صراحت خطا می‌دهیم
    if (!user) {
      throw new Error('برای افزودن به سبد، ابتدا باید وارد شوید.')
    }

    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('توکن یافت نشد. لطفاً مجدداً وارد شوید.')
    }

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      })
      if (!res.ok) {
        if (res.status === 401) {
          setCart([]) // اگر توکن نامعتبر بود، سبد خالی شود
          throw new Error('اعتبارسنجی انجام نشد. لطفاً مجدداً وارد شوید.')
        }
        const errorData = await res.json()
        throw new Error(errorData.msg || `خطا در افزودن به سبد (کد: ${res.status})`)
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

    // اگر کمیت صفر یا منفی شد، آیتم را حذف کن
    if (quantity <= 0) {
      return removeFromCart(productId)
    }

    try {
      const res = await fetch('/api/cart', {
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
      const data = await res.json() // { items: [...] }
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
      const res = await fetch(`/api/cart/${productId}`, {
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
      const data = await res.json() // { items: [...] }
      setCart(data.items || [])
    } catch (err) {
      console.error('Error removing from cart:', err.message)
    }
  }

  // -----------------------------
  // ۵. پاک کردن کل سبد (پس از نهایی کردن سفارش مثلاً)
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
