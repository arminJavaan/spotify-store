// frontend/src/contexts/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react'
import API from '../api'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // ↔️ اضافه‌شدن حالت loading
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const res = await API.get('/auth/me')
        setUser(res.data) // { id, name, email, role }
      } catch (err) {
        console.error(err)
        localStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const register = async ({ name, email, password }) => {
    const res = await API.post('/auth/register', { name, email, password })
    localStorage.setItem('token', res.data.token)
    setLoading(true)
    try {
      const me = await API.get('/auth/me')
      setUser(me.data)
      navigate('/products')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const login = async ({ email, password }) => {
    const res = await API.post('/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    setLoading(true)
    try {
      const me = await API.get('/auth/me')
      setUser(me.data)
      navigate('/products')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
