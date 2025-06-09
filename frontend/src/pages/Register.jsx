import React, { useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneRegex = /^09\d{9}$/
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&+_\-])[A-Za-z\d@$!%*?&+_\-]{8,}$/

  const calculateStrength = (pass) => {
    let score = 0
    if (pass.length >= 8) score++
    if (/[A-Z]/.test(pass)) score++
    if (/[a-z]/.test(pass)) score++
    if (/\d/.test(pass)) score++
    if (/[@$!%*?&+_\-]/.test(pass)) score++
    return score
  }

  const handlePasswordChange = (e) => {
    const val = e.target.value
    setPassword(val)
    setPasswordStrength(calculateStrength(val))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !email.trim() || !password || !phone.trim()) {
      setError('لطفاً همه فیلدها را تکمیل کنید.')
      return
    }
    if (!emailRegex.test(email)) {
      setError('فرمت ایمیل معتبر نیست.')
      return
    }
    if (!phoneRegex.test(phone)) {
      setError('شماره موبایل باید با 09 شروع شود و 11 رقم باشد.')
      return
    }
    if (!passwordRegex.test(password)) {
      setError('رمز عبور باید حداقل ۸ کاراکتر، شامل عدد، حرف و یک کاراکتر ویژه باشد.')
      return
    }
    if (password !== confirmPassword) {
      setError('رمز عبور و تکرار آن یکسان نیستند.')
      return
    }

    setLoading(true)
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim()
      })
      navigate(`/verify-phone?phone=${phone.trim()}`)
    } catch (err) {
      const serverMsg = err.response?.data?.msg || err.response?.data?.errors?.[0]?.msg || err.message
      setError(serverMsg)
    } finally {
      setLoading(false)
    }
  }

  const strengthLabels = ['ضعیف', 'متوسط', 'قوی', 'خیلی قوی', 'امن']
  const strengthColors = ['bg-red-500', 'bg-yellow-400', 'bg-green-400', 'bg-green-500', 'bg-primary']
  const inputClass = "w-full px-4 py-2 bg-dark2 text-gray-light border border-gray-med rounded focus:outline-none focus:border-primary"

  return (
    <main className="relative min-h-screen text-gray-light overflow-hidden mt-20 px-4 flex items-center justify-center">
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute top-[-30%] left-[-30%] w-[160%] h-[160%] bg-gradient-to-br from-primary to-cyan-600 opacity-10 rounded-full filter blur-3xl" />
      </motion.div>

      <motion.div
        className="w-full max-w-md bg-dark1 rounded-2xl shadow-lg p-8 space-y-6 animate-fadeInUp"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-primary text-center mb-4">ثبت‌نام</h2>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p>نام و نام خانوادگی</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="نام و نام خانوادگی"
              className={inputClass}
              required
            />
          </div>
          <div>
            <p>ایمیل</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ایمیل"
              className={inputClass}
              required
            />
          </div>
          <div>
            <p>شماره تلفن</p>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="شماره تلفن (مثال: 09123456789)"
              className={inputClass}
              required
            />
          </div>
          <div>
            <p className='mb-4'>رمز عبور</p>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="رمز عبور (حداقل ۸ کاراکتر، عدد، حرف و نماد)"
              className={inputClass}
              required
            />
            {password && (
              <>
                <div className="mt-2 w-full h-2 rounded bg-gray-700">
                  <div
                    className={`h-2 rounded ${strengthColors[passwordStrength - 1] || 'bg-gray-500'}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-light mt-1">
                  قدرت رمز عبور: {strengthLabels[passwordStrength - 1] || 'خیلی ضعیف'}
                </p>
              </>
            )}
          </div>
          <div>
            <p>تکرار رمز عبور</p>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="تکرار رمز عبور"
              className={inputClass}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary hover:bg-opacity-90 text-dark2 font-semibold py-2 rounded transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
          </button>
          <div className='text-center mb-4'>
            <p className="text-gray-light text-sm">
              حساب کاربری دارید؟{' '}
              <a href="/login" className="text-primary hover:underline">
                وارد شوید
              </a>
            </p>
          </div>
        </form>
      </motion.div>
    </main>
  )
}
