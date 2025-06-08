import React, { useEffect, useState } from 'react'
import API from '../api'
import {
  FiCheckCircle,
  FiXCircle,
  FiUser,
  FiPercent,
  FiGift,
  FiSearch,
  FiRefreshCcw,
  FiClock
} from 'react-icons/fi'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function AdminDiscounts() {
  const [discounts, setDiscounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

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

  const toggleActive = async (code, active) => {
    setUpdating(code)
    try {
      const endpoint = active ? 'deactivate' : 'activate'
      await API.put(`/admin/discounts/${code}/${endpoint}`)
      await fetchDiscounts()
    } catch (err) {
      console.error(err)
      toast.error('خطا در به‌روزرسانی وضعیت کد')
    } finally {
      setUpdating(null)
    }
  }

  const deleteDiscount = async (code) => {
    if (!window.confirm(`آیا از حذف کد "${code}" مطمئنی؟`)) return
    setUpdating(code)
    try {
      await API.delete(`/admin/discounts/${code}`)
      await fetchDiscounts()
    } catch (err) {
      console.error(err)
      toast.error('خطا در حذف کد تخفیف')
    } finally {
      setUpdating(null)
    }
  }

  const filterByType = (list) => {
    if (filterType === 'all') return list
    return list.filter(d => d.type === filterType)
  }

  const filterByEmail = (list) => {
    if (!searchTerm.trim()) return list
    const term = searchTerm.toLowerCase()
    return list.filter(d => d.owner?.email?.toLowerCase().includes(term))
  }

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
    <main className="text-gray-light py-16 px-4 min-h-screen mt-12">
      <motion.h1
        className="text-4xl font-extrabold text-center mb-8 text-primary"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        مدیریت کدهای تخفیف
      </motion.h1>

      <div className="max-w-4xl mx-auto mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      <div className="overflow-x-auto max-w-6xl mx-auto">
        <table className="w-full bg-dark1 rounded-lg shadow-lg">
          <thead>
            <tr className="text-gray-light border-b border-gray-med">
              <th className="p-4 text-start">کد</th>
              <th className="p-4 text-start">نوع</th>
              <th className="p-4 text-start">کاربر</th>
              <th className="p-4 text-start">ایمیل</th>
              <th className="p-4 text-start">استفاده</th>
              <th className="p-4 text-start">انقضا</th>
              <th className="p-4 text-center">فعّال؟</th>
              <th className="p-4 text-center">اقدام</th>
            </tr>
          </thead>
          <tbody>
            {filteredDiscounts.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-light">
                  «کدی مطابق فیلترها یافت نشد»
                </td>
              </tr>
            ) : (
              filteredDiscounts.map((d) => (
                <tr key={d.code} className="hover:bg-dark2 transition">
                  <td className="px-4 py-3 text-gray-light">{d.code}</td>
                  <td className="px-4 py-3 text-gray-light flex items-center space-x-3">
                    {d.type === 'personal' && <><FiPercent className="text-yellow-400 text-lg" /><span>۱۵٪ شخصی</span></>}
                    {d.type === 'reward70' && <><FiGift className="text-green-400 text-lg" /><span>۷۰٪ جایزه</span></>}
                    {d.type === 'freeAccount' && <><FiGift className="text-blue-400 text-lg" /><span>رایگان</span></>}
                    {d.type === 'custom' && <><FiPercent className="text-purple-400 text-lg" /><span>{d.percentage}% سفارشی</span></>}
                  </td>
                  <td className="px-4 py-3 text-gray-light flex items-center space-x-2">
                    <FiUser className="text-primary text-lg" />
                    <span className="truncate">{d.owner?.name || '—'}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-light truncate max-w-[150px]">
                    {d.owner?.email || '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-light">{d.uses}</td>
                  <td className="px-4 py-3 text-gray-light whitespace-nowrap">
                    {d.expiresAt ? new Date(d.expiresAt).toLocaleDateString('fa-IR') : '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {d.active ? <FiCheckCircle className="text-green-500 text-xl mx-auto" /> : <FiXCircle className="text-red-500 text-xl mx-auto" />}
                  </td>
                  <td className="px-4 py-3 text-center space-x-2 flex justify-center">
                    <button
                      onClick={() => toggleActive(d.code, d.active)}
                      disabled={updating === d.code}
                      className={`px-4 py-1 rounded-md text-sm font-medium transition ${d.active ? 'bg-red-500' : 'bg-green-600'} text-white hover:opacity-90 ${updating === d.code ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {d.active ? 'غیرفعال' : 'فعّال'}
                    </button>
                    <button
                      onClick={() => deleteDiscount(d.code)}
                      disabled={updating === d.code}
                      className="px-3 py-1 rounded-md text-sm font-medium bg-gray-600 text-white hover:bg-red-600 transition disabled:opacity-50"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-center mt-10">
        <Link
          to="/admin/discounts/add"
          className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          + ساخت کد تخفیف جدید
        </Link>
      </div>
    </main>
  )
}