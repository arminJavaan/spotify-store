// frontend/src/pages/admin/UsersAdmin.jsx

import React, { useEffect, useState } from 'react'
import API from '../../api'
import { FiUserCheck, FiUserX, FiTrash2 } from 'react-icons/fi'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await API.get('/admin/users')
      setUsers(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const changeRole = async (id, role) => {
    try {
      await API.put(`/admin/users/${id}/role`, { role })
      fetchUsers()
    } catch (err) {
      console.error(err)
      alert('خطا در تغییر نقش کاربر')
    }
  }

  const deleteUser = async id => {
    if (!window.confirm('آیا از حذف این کاربر مطمئن هستید؟')) return
    try {
      await API.delete(`/admin/users/${id}`)
      fetchUsers()
    } catch (err) {
      console.error(err)
      alert('خطا در حذف کاربر')
    }
  }

  if (loading) {
    return <p className="text-center text-gray2 py-10">در حال بارگذاری ...</p>
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-primary mb-8 text-center animate-fadeIn">
        مدیریت کاربران
      </h2>

      {users.length === 0 ? (
        <p className="text-center text-gray2">هیچ کاربری ثبت نشده است.</p>
      ) : (
        <div className="space-y-6">
          {users.map(user => (
            <div
              key={user._id}
              className="bg-dark1 p-6 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center animate-slideIn"
            >
              <div className="mb-4 md:mb-0">
                <h3 className="text-xl font-semibold text-primary">
                  {user.name}
                </h3>
                <p className="text-gray2 text-sm">{user.email}</p>
                <p className="mt-1 text-gray2 text-sm">
                  نقش: <span className="text-primary font-medium">{user.role}</span>
                </p>
              </div>
              <div className="flex space-x-3">
                {user.role !== 'admin' && (
                  <button
                    onClick={() => changeRole(user._id, 'admin')}
                    className="flex items-center px-4 py-2 bg-green-600 text-dark2 rounded-lg hover:bg-green-700 transition"
                  >
                    <FiUserCheck className="ml-1" /> ارتقا به ادمین
                  </button>
                )}
                {user.role !== 'user' && (
                  <button
                    onClick={() => changeRole(user._id, 'user')}
                    className="flex items-center px-4 py-2 bg-yellow-500 text-dark2 rounded-lg hover:bg-yellow-600 transition"
                  >
                    <FiUserX className="ml-1" /> تنزل به کاربر عادی
                  </button>
                )}
                <button
                  onClick={() => deleteUser(user._id)}
                  className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  <FiTrash2 className="ml-1" /> حذف کاربر
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
