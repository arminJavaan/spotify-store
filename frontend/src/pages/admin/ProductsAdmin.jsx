// frontend/src/pages/admin/ProductsAdmin.jsx

import React, { useEffect, useState, useRef } from 'react'
import API from '../../api'
import { FiPlusCircle, FiEdit2, FiTrash2 } from 'react-icons/fi'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    maxDevices: '',
    duration: ''
  })
  const [bannerFile, setBannerFile] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const fileInputRef = useRef()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await API.get('/admin/products')
      setProducts(res.data)
      setErrorMsg(null)
    } catch (err) {
      console.error('Error fetching products:', err.response?.data || err.message)
      setErrorMsg('خطا در دریافت محصولات')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('لطفاً یک فایل تصویری معتبر انتخاب کنید.')
        fileInputRef.current.value = ''
        return
      }
      setBannerFile(file)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      maxDevices: '',
      duration: ''
    })
    setBannerFile(null)
    fileInputRef.current.value = ''
    setEditingId(null)
    setErrorMsg(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { name, description, price, maxDevices, duration } = formData

    if (!name.trim() || !description.trim() || !price || !maxDevices || !duration) {
      return alert('لطفاً همه فیلدها را تکمیل کنید.')
    }
    if (!editingId && !bannerFile) {
      return alert('لطفاً یک تصویر بنر انتخاب کنید.')
    }

    setLoading(true)
    try {
      const payload = new FormData()
      payload.append('name', name.trim())
      payload.append('description', description.trim())
      payload.append('price', Number(price))
      payload.append('maxDevices', Number(maxDevices))
      payload.append('duration', duration.trim())
      if (bannerFile) {
        payload.append('banner', bannerFile)
      }

      if (editingId) {
        await API.put(`/admin/products/${editingId}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        await API.post('/admin/products', payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }

      resetForm()
      fetchProducts()
    } catch (err) {
      console.error(
        'Error saving product:',
        err.response?.status,
        err.response?.data || err.message
      )
      const serverMsg = err.response?.data?.msg || err.response?.data?.error || err.message
      setErrorMsg(`خطا در ذخیره‌سازی محصول: ${serverMsg}`)
      alert(`خطا در ذخیره‌سازی محصول:\n${serverMsg}`)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product) => {
    setEditingId(product._id)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      maxDevices: product.maxDevices,
      duration: product.duration
    })
    setBannerFile(null)
    fileInputRef.current.value = ''
    setErrorMsg(null)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('آیا از حذف این محصول مطمئن هستید؟')) return

    try {
      await API.delete(`/admin/products/${id}`)
      fetchProducts()
    } catch (err) {
      console.error('Error deleting product:', err.response?.data || err.message)
      const serverMsg = err.response?.data?.msg || err.message
      setErrorMsg(`خطا در حذف محصول: ${serverMsg}`)
      alert(`خطا در حذف محصول:\n${serverMsg}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-primary mb-8 text-center animate-fadeIn">
        مدیریت محصولات
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-dark1 p-6 rounded-2xl shadow-lg mb-10 animate-slideIn"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="نام محصول"
            className="w-full px-4 py-3 bg-dark2 text-gray2 border border-gray1 rounded-lg focus:outline-none focus:border-primary transition"
          />
          <input
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="قیمت (تومان)"
            type="number"
            className="w-full px-4 py-3 bg-dark2 text-gray2 border border-gray1 rounded-lg focus:outline-none focus:border-primary transition"
          />
          <input
            name="maxDevices"
            value={formData.maxDevices}
            onChange={handleChange}
            placeholder="حداکثر دستگاه (عدد)"
            type="number"
            className="w-full px-4 py-3 bg-dark2 text-gray2 border border-gray1 rounded-lg focus:outline-none focus:border-primary transition"
          />
          <input
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="مدت اشتراک (مثلاً 1 ماه)"
            className="w-full px-4 py-3 bg-dark2 text-gray2 border border-gray1 rounded-lg focus:outline-none focus:border-primary transition"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="توضیح کامل محصول"
            rows="3"
            className="w-full col-span-1 md:col-span-2 px-4 py-3 bg-dark2 text-gray2 border border-gray1 rounded-lg focus:outline-none focus:border-primary transition resize-none"
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="w-full col-span-1 md:col-span-2 text-gray2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`mt-6 w-full px-6 py-3 flex items-center justify-center bg-primary text-dark2 font-semibold rounded-lg hover:bg-[#148c3c] transition ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <FiPlusCircle className="ml-2 text-xl" />
          {editingId ? 'ذخیره تغییرات' : 'ایجاد محصول جدید'}
        </button>
      </form>

      {errorMsg && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded mb-6">
          {errorMsg}
        </div>
      )}

      {loading && !products.length ? (
        <p className="text-center text-gray2 py-10">در حال بارگذاری محصولات...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((prod) => (
            <div
              key={prod._id}
              className="bg-dark1 rounded-2xl shadow-lg overflow-hidden animate-fadeIn"
            >
              <div className="w-full h-48 overflow-hidden">
                {prod.bannerUrl ? (
                  <img
                    src={
                      prod.bannerUrl.startsWith('http')
                        ? prod.bannerUrl
                        : `${window.location.origin}${prod.bannerUrl}`
                    }
                    alt={prod.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-dark2 flex items-center justify-center">
                    <span className="text-gray1">بدون تصویر</span>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-2">
                <h3 className="text-xl font-semibold text-primary">{prod.name}</h3>
                <p className="text-gray2 text-sm leading-relaxed">{prod.description}</p>
                <p className="text-gray2 text-sm">
                  قیمت: {Number(prod.price).toLocaleString('fa-IR')} تومان
                </p>
                <p className="text-gray2 text-sm">
                  مدت: {prod.duration} | دستگاه: {prod.maxDevices}
                </p>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleEdit(prod)}
                    className="flex items-center px-4 py-2 bg-yellow-500 text-dark2 rounded-lg hover:bg-yellow-600 transition"
                  >
                    <FiEdit2 className="ml-1" /> ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(prod._id)}
                    className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    <FiTrash2 className="ml-1" /> حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
