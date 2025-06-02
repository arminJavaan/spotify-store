// frontend/src/pages/AdminDiscounts.jsx

import React, { useEffect, useState } from 'react'
import API from '../api'
import { FiCheckCircle, FiXCircle, FiUser, FiTrash2, FiPercent, FiGift } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function AdminDiscounts() {
  const [discounts, setDiscounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(null)

  // واکشی همهٔ کدهای تخفیف
  const fetchDiscounts = async () => {
    setLoading(true)
    try {
      const res = await API.get('/admin/discounts')
      setDiscounts(res.data)
      setError(null)
    } catch (err) {
      console.error(err)
      setError('خطا در دریافت کدهای تخفیف')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDiscounts()
  }, [])

  // فعال/غیرفعال کردن یک کد
  const toggleActive = async (code, active) => {
    setUpdating(code)
    try {
      const endpoint = active ? 'deactivate' : 'activate'
      await API.put(`/admin/discounts/${code}/${endpoint}`)
      await fetchDiscounts()
    } catch (err) {
      console.error(err)
      alert('خطا در به‌روزرسانی وضعیت کد')
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark2 text-gray-light">
        <p>در حال بارگذاری...</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-red-500">
        {error}
      </div>
    )
  }

  // دسته‌بندی کدها بر اساس نوع
  const personalCodes = discounts.filter(d => d.type === 'personal')
  const reward70Codes = discounts.filter(d => d.type === 'reward70')
  const freeAccountCodes = discounts.filter(d => d.type === 'freeAccount')

  const renderTable = (list, title) => (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-primary mb-4">{title}</h2>
      {list.length === 0 ? (
        <p className="text-gray-light">— هیچ کدی یافت نشد —</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-dark1 rounded-lg shadow-lg">
            <thead>
              <tr className="text-gray-light border-b border-gray-med">
                <th className="p-3 text-start">کد</th>
                <th className="p-3 text-start">کاربر صاحب</th>
                <th className="p-3 text-start">ایمیل کاربر</th>
                <th className="p-3 text-start">تعداد استفاده</th>
                <th className="p-3 text-center">فعّال؟</th>
                <th className="p-3 text-center">اقدام</th>
              </tr>
            </thead>
            <tbody>
              {list.map((d) => (
                <tr key={d.code} className="hover:bg-dark2 transition">
                  <td className="px-3 py-2 text-gray-light">{d.code}</td>
                  <td className="px-3 py-2 text-gray-light">
                    {d.owner ? d.owner.name : '— کاربر حذف‌شده'}
                  </td>
                  <td className="px-3 py-2 text-gray-light">
                    {d.owner ? d.owner.email : '—'}
                  </td>
                  <td className="px-3 py-2 text-gray-light">{d.uses}</td>
                  <td className="px-3 py-2 text-center">
                    {d.active ? (
                      <FiCheckCircle className="text-green-500 mx-auto" />
                    ) : (
                      <FiXCircle className="text-red-500 mx-auto" />
                    )}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      onClick={() => toggleActive(d.code, d.active)}
                      disabled={updating === d.code}
                      className={`px-4 py-1 rounded-lg text-sm transition ${
                        d.active
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      } ${updating === d.code ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {d.active ? 'غیرفعال کن' : 'فعّال کن'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )

  return (
    <main className="bg-dark2 text-gray-light py-20 px-6 min-h-screen">
      <motion.h1
        className="text-3xl font-bold text-center mb-12 text-primary"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        مدیریت کدهای تخفیف
      </motion.h1>
      <div className="container mx-auto">
        {renderTable(personalCodes, 'کدهای تخفیف ۱۵٪ (شخصی)')}
        {renderTable(reward70Codes, 'کدهای تخفیف ۷۰٪ (جایزه)')}
        {renderTable(freeAccountCodes, 'کدهای اکانت رایگان')}
      </div>
    </main>
  )
}
