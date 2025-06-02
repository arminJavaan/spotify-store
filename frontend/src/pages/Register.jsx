// frontend/src/pages/Register.jsx

import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

export default function Register() {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // مقدار کد تخفیف شخصی که از API برمی‌گردد
  const [personalCode, setPersonalCode] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // اعتبارسنجی اولیه فرم
    if (!name.trim() || !email.trim() || !password || !phone.trim()) {
      setError('لطفاً همه فیلدها را تکمیل کنید.');
      return;
    }

    setLoading(true);

    try {
      // فراخوانی متد register در AuthContext
      const code = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim()
      });
      // دریافت personalCode و ذخیره برای نمایش
      setPersonalCode(code);
    } catch (err) {
      const serverMsg =
        err.response?.data?.msg ||
        err.response?.data?.errors?.[0]?.msg ||
        err.message;
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-dark2 text-gray-light mt-12 overflow-hidden">
      {/* پس‌زمینهٔ متحرک */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute top-[-30%] left-[-30%] w-[160%] h-[160%] bg-gradient-to-br from-primary to-cyan-600 opacity-10 rounded-full filter blur-3xl" />
      </motion.div>

      <main className="text-gray-light flex items-center justify-center min-h-screen px-4">
        <motion.div
          className="w-full max-w-md bg-dark1 rounded-2xl shadow-lg p-8 space-y-6 animate-fadeInUp"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-primary text-center mb-4">
            ثبت‌نام
          </h2>

          {/* نمایش خطا در صورت وجود */}
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded">
              {error}
            </div>
          )}

          {/* نمایش کد تخفیف شخصی پس از ثبت موفق */}
          {personalCode && (
            <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded text-center">
              <p>ثبت‌نام با موفقیت انجام شد!</p>
              <p>
                کد تخفیف شخصی شما: <strong>{personalCode}</strong>
              </p>
            </div>
          )}

          {/* فرم ثبت‌نام (مگر اینکه personalCode وجود داشته باشد) */}
          {!personalCode && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="نام و نام خانوادگی"
                className="w-full px-4 py-2 bg-dark2 text-gray-light border border-gray-med rounded focus:outline-none focus:border-primary"
                required
              />
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
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="شماره تلفن"
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
                {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
              </button>
              <div className="text-center mb-4">
                <p className="text-gray-light mb-2">
                  حساب کاربری دارید؟{' '}
                  <a href="/login" className="text-primary hover:underline">
                    وارد شوید
                  </a>
                </p>
              </div>
            </form>
          )}
        </motion.div>
      </main>
    </main>
  );
}
