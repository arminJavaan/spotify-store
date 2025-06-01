// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react'
import API from '../api'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // هنگام mount شدن، بررسی وضعیت لاگین
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }
      try {
        // axios (API) باید توکن را از localStorage در header بگذارد
        const res = await API.get('/auth/me')
        setUser(res.data)
      } catch (err) {
        console.error('Error fetching /auth/me:', err.response?.data || err.message)
        localStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  const register = async ({ name, email, password, phone }) => {
    try {
      const res = await API.post('/auth/register', {
        name,
        email,
        password,
        phone,
      })
      localStorage.setItem('token', res.data.token)
      setLoading(true)
      try {
        const me = await API.get('/auth/me')
        setUser(me.data)
        navigate('/dashboard')
      } catch (err) {
        console.error('Error fetching /auth/me after register:', err.response?.data || err.message)
      } finally {
        setLoading(false)
      }
    } catch (err) {
      console.error('Error in register():', err.response?.data || err.message)
      throw err
    }
  }

  const login = async ({ email, password }) => {
    try {
      const res = await API.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      setLoading(true)
      try {
        const me = await API.get('/auth/me')
        setUser(me.data)
        navigate('/dashboard')
      } catch (err) {
        console.error('Error fetching /auth/me after login:', err.response?.data || err.message)
      } finally {
        setLoading(false)
      }
    } catch (err) {
      console.error('Error in login():', err.response?.data || err.message)
      throw err
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
