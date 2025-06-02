// frontend/src/pages/AdminDiscounts.jsx

import React, { useEffect, useState } from 'react'
import API from '../api'
import {
  FiCheckCircle,
  FiXCircle,
  FiUser,
  FiPercent,
  FiGift,
  FiSearch,
  FiRefreshCcw
} from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function AdminDiscounts() {
  const [discounts, setDiscounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(null)

  // States for filters
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

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

  // فیلتر بر اساس نوع
  const filterByType = (list) => {
    if (filterType === 'all') return list
    return list.filter(d => d.type === filterType)
  }

  // فیلتر بر اساس ایمیل
  const filterByEmail = (list) => {
    if (!searchTerm.trim()) return list
    const term = searchTerm.toLowerCase()
    return list.filter(d => d.owner?.email?.toLowerCase().includes(term))
  }

  // اعمال همهٔ فیلترها
  const filteredDiscounts = filterByEmail(filterByType(discounts))

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

  return (
    <main className=" text-gray-light py-16 px-4 min-h-screen mt-12">
      <motion.h1
        className="text-4xl font-extrabold text-center mb-8 text-primary"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        مدیریت کدهای تخفیف
      </motion.h1>

      {/* فیلترها */}
      <div className="max-w-4xl mx-auto mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* انتخاب نوع */}
          <div>
            <label className="block text-gray-light mb-1">نوع کد:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-5 py-3 bg-dark1 text-gray-light border border-gray-med rounded-lg focus:outline-none focus:border-primary"
            >
              <option value="all">همه</option>
              <option value="personal">۱۵٪ (شخصی)</option>
              <option value="reward70">۷۰٪ (جایزه)</option>
              <option value="freeAccount">اکانت رایگان</option>
            </select>
          </div>

          {/* جستجوی ایمیل */}
          <div className="relative md:col-span-2">
            <label className="block text-gray-light mb-1">جستجوی ایمیل:</label>
            <FiSearch className="absolute left-4 top-3 text-gray-light" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجوی ایمیل کاربر..."
              className="w-full pl-12 pr-5 py-3 bg-dark1 border border-gray-med rounded-lg focus:outline-none focus:border-primary text-gray-light"
            />
          </div>
        </div>
        {/* دکمهٔ ریفرش */}
        <div className="text-center">
          <button
            onClick={fetchDiscounts}
            disabled={loading}
            className="inline-flex items-center bg-primary hover:bg-opacity-90 text-dark2 font-semibold px-5 py-3 rounded-lg transition"
          >
            <FiRefreshCcw className="ml-2 text-xl" /> بروزرسانی لیست
          </button>
        </div>
      </div>

      {/* جدول کدها */}
      <div className="overflow-x-auto max-w-6xl mx-auto">
        <table className="w-full bg-dark1 rounded-lg shadow-lg">
          <thead>
            <tr className="text-gray-light border-b border-gray-med">
              <th className="p-4 text-start">کد</th>
              <th className="p-4 text-start">نوع</th>
              <th className="p-4 text-start">کاربر صاحب</th>
              <th className="p-4 text-start">ایمیل کاربر</th>
              <th className="p-4 text-start">تعداد استفاده</th>
              <th className="p-4 text-center">فعّال؟</th>
              <th className="p-4 text-center">اقدام</th>
            </tr>
          </thead>
          <tbody>
            {filteredDiscounts.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-6 text-center text-gray-light"
                >
                  «کدی مطابق فیلترها یافت نشد»
                </td>
              </tr>
            ) : (
              filteredDiscounts.map((d) => (
                <tr key={d.code} className="hover:bg-dark2 transition">
                  <td className="px-4 py-3 text-gray-light">{d.code}</td>
                  <td className="px-4 py-3 text-gray-light flex items-center space-x-3">
                    {d.type === 'personal' && (
                      <>
                        <FiPercent className="text-yellow-400 text-lg" />
                        <span className="whitespace-nowrap">۱۵٪ (شخصی)</span>
                      </>
                    )}
                    {d.type === 'reward70' && (
                      <>
                        <FiGift className="text-green-400 text-lg" />
                        <span className="whitespace-nowrap">۷۰٪ (جایزه)</span>
                      </>
                    )}
                    {d.type === 'freeAccount' && (
                      <>
                        <FiGift className="text-blue-400 text-lg" />
                        <span className="whitespace-nowrap">اکانت رایگان</span>
                      </>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-light flex items-center space-x-2">
                    <FiUser className="text-primary text-lg" />
                    <span className="truncate">
                      {d.owner ? d.owner.name : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-light truncate max-w-[150px]">
                    {d.owner ? d.owner.email : '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-light">{d.uses}</td>
                  <td className="px-4 py-3 text-center">
                    {d.active ? (
                      <FiCheckCircle className="text-green-500 text-xl mx-auto" />
                    ) : (
                      <FiXCircle className="text-red-500 text-xl mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleActive(d.code, d.active)}
                      disabled={updating === d.code}
                      className={`px-5 py-2 rounded-lg text-base font-medium transition ${
                        d.active
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      } ${updating === d.code ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {d.active ? 'غیرفعال کن' : 'فعّال کن'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}
