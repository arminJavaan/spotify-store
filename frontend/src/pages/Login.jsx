// frontend/src/pages/Login.jsx
import React, { useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { motion } from 'framer-motion'

export default function Login() {
  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!email.trim() || !password) {
      setError('لطفاً اطلاعات را کامل وارد کنید.')
      return
    }
    setLoading(true)
    try {
      await login({ email: email.trim(), password })
    } catch (err) {
      const serverMsg = err.response?.data?.msg || err.response?.data?.errors?.[0]?.msg || err.message
      setError(serverMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="bg-dark2 text-gray-light flex items-center justify-center min-h-screen px-6">
      <motion.div
        className="w-full max-w-md bg-dark1 rounded-2xl shadow-lg p-8 space-y-6 animate-fadeInUp"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-primary text-center mb-4">ورود</h2>
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ایمیل"
            className="w-full px-4 py-2 bg-dark2 text-gray-light border border-gray-med rounded focus:outline-none focus:border-primary"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="رمز عبور"
            className="w-full px-4 py-2 bg-dark2 text-gray-light border border-gray-med rounded focus:outline-none focus:border-primary"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary hover:bg-opacity-90 text-dark2 font-semibold py-2 rounded transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>
      </motion.div>
    </main>
  )
}
