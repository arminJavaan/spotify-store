import React, { useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { FiUser, FiMail, FiLock } from 'react-icons/fi'
import { Link } from 'react-router-dom'

export default function Register() {
  const { register } = useContext(AuthContext)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register({ name, email, password })
    } catch (err) {
      alert('خطا در ثبت‌نام: ' + (err.response?.data.msg || err.message))
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-dark2 px-4">
      <div className="w-full max-w-sm bg-dark1 rounded-2xl shadow-xl p-8 space-y-6 animate-fadeIn">
        <h2 className="text-3xl font-bold text-primary text-center">ثبت‌نام در اسپاتیفای</h2>
        <p className="text-gray2 text-sm text-center">
          اگر قبلاً حساب دارید،{' '}
          <Link to="/login" className="text-primary hover:underline">
            وارد شوید
          </Link>
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <FiUser className="absolute top-1/2 right-3 -translate-y-1/2 text-gray2" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="نام و نام خانوادگی"
              className="w-full px-4 py-3 pl-11 bg-dark2 text-gray2 border border-gray1 rounded-lg focus:outline-none focus:border-primary transition"
            />
          </div>
          <div className="relative">
            <FiMail className="absolute top-1/2 right-3 -translate-y-1/2 text-gray2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ایمیل"
              className="w-full px-4 py-3 pl-11 bg-dark2 text-gray2 border border-gray1 rounded-lg focus:outline-none focus:border-primary transition"
            />
          </div>
          <div className="relative">
            <FiLock className="absolute top-1/2 right-3 -translate-y-1/2 text-gray2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="رمز عبور"
              className="w-full px-4 py-3 pl-11 bg-dark2 text-gray2 border border-gray1 rounded-lg focus:outline-none focus:border-primary transition"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-primary text-dark2 font-semibold rounded-lg hover:bg-[#148c3c] transition animate-slideIn"
          >
            ثبت‌نام
          </button>
        </form>
      </div>
    </div>
  )
}
