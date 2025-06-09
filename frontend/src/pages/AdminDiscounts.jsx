// frontend/src/pages/admin/AdminDiscounts.jsx

import React, { useEffect, useState } from 'react';
import API from '../api';
import {
  FiCheckCircle,
  FiXCircle,
  FiUser,
  FiPercent,
  FiGift,
  FiSearch,
  FiRefreshCcw,
  FiClock,
  FiTrash,
  FiEdit2
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function AdminDiscounts() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/discounts');
      setDiscounts(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('خطا در دریافت کدهای تخفیف');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const toggleActive = async (code, active) => {
    setUpdating(code);
    try {
      const endpoint = active ? 'deactivate' : 'activate';
      await API.put(`/admin/discounts/${code}/${endpoint}`);
      await fetchDiscounts();
    } catch (err) {
      console.error(err);
      toast.error('خطا در به‌روزرسانی وضعیت کد');
    } finally {
      setUpdating(null);
    }
  };

  const deleteDiscount = async (code) => {
    if (!window.confirm(`آیا از حذف کد "${code}" مطمئنی؟`)) return;
    setUpdating(code);
    try {
      await API.delete(`/admin/discounts/${code}`);
      await fetchDiscounts();
    } catch (err) {
      console.error(err);
      toast.error('خطا در حذف کد تخفیف');
    } finally {
      setUpdating(null);
    }
  };

  const filterByType = (list) => {
    if (filterType === 'all') return list;
    return list.filter(d => d.type === filterType);
  };

  const filterByEmail = (list) => {
    if (!searchTerm.trim()) return list;
    const term = searchTerm.toLowerCase();
    return list.filter(d => d.owner?.email?.toLowerCase().includes(term));
  };

  const filteredDiscounts = filterByEmail(filterByType(discounts));

  return (
    <main className="text-gray-light py-16 px-4 min-h-screen mt-12">
      <motion.h1
        className="text-4xl font-extrabold text-center mb-10 text-primary"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        مدیریت کدهای تخفیف
      </motion.h1>

      <div className="max-w-5xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1">نوع کد:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-dark1 border border-gray-600 px-4 py-2 rounded-lg text-white"
            >
              <option value="all">همه</option>
              <option value="personal">۱۵٪ (شخصی)</option>
              <option value="reward70">۷۰٪ (جایزه)</option>
              <option value="freeAccount">اکانت رایگان</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm mb-1">جستجوی ایمیل:</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="مثلاً user@email.com"
                className="w-full bg-dark1 border border-gray-600 pl-10 pr-4 py-2 rounded-lg text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={fetchDiscounts}
            className="flex items-center gap-2 bg-primary text-dark1 px-5 py-2 rounded-lg hover:bg-opacity-90"
          >
            <FiRefreshCcw /> بروزرسانی
          </button>

          <Link
            to="/admin/discounts/add"
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
          >
            + ساخت کد تخفیف
          </Link>
        </div>

        {loading ? (
          <p className="text-center mt-20 text-lg">در حال بارگذاری...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredDiscounts.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">هیچ کدی پیدا نشد</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDiscounts.map((d) => (
              <div key={d.code} className="bg-dark1 border border-gray-700 rounded-xl p-5 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">{d.code}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${d.active ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                    {d.active ? 'فعال' : 'غیرفعال'}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-300">
                  <p className="flex items-center gap-2">
                    {d.type === 'personal' && <FiPercent className="text-yellow-400" />} 
                    {d.type === 'reward70' && <FiGift className="text-green-400" />} 
                    {d.type === 'freeAccount' && <FiGift className="text-blue-400" />} 
                    {d.type === 'custom' && <FiPercent className="text-purple-400" />} 
                    <span>{d.percentage ? `${d.percentage}%` : d.type}</span>
                  </p>
                  <p>کاربر: {d.owner?.name || '—'}</p>
                  <p>ایمیل: <span className="text-gray-400">{d.owner?.email || '—'}</span></p>
                  <p>استفاده: {d.uses}</p>
                  <p>انقضا: {d.expiresAt ? new Date(d.expiresAt).toLocaleDateString('fa-IR') : '—'}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => toggleActive(d.code, d.active)}
                    disabled={updating === d.code}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition ${d.active ? 'bg-red-500' : 'bg-green-600'} text-white`}
                  >
                    {d.active ? 'غیرفعال' : 'فعال'}
                  </button>
                  <button
                    onClick={() => deleteDiscount(d.code)}
                    disabled={updating === d.code}
                    className="flex items-center justify-center px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-red-600"
                  >
                    <FiTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}