// frontend/src/pages/admin/UserAdmin.jsx

import React, { useEffect, useState } from 'react'
import API from '../../api'
import toast from "react-hot-toast";
import { FiUserCheck, FiUserX, FiTrash2, FiUser, FiMail } from 'react-icons/fi'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingUserId, setUpdatingUserId] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await API.get('/admin/users')
      setUsers(res.data)
      setError(null)
    } catch (err) {
      console.error(err)
      setError('خطا در دریافت کاربران')
    } finally {
      setLoading(false)
    }
  }

  const changeRole = async (id, role) => {
    if (!window.confirm(`آیا از تغییر نقش به "${role}" مطمئن هستید؟`)) return
    setUpdatingUserId(id)
    try {
      await API.put(`/admin/users/${id}/role`, { role })
      await fetchUsers()
    } catch (err) {
      console.error(err)
      toast.error('خطا در تغییر نقش کاربر')
    } finally {
      setUpdatingUserId(null)
    }
  }

 const confirmDelete = () => {
  return new Promise((resolve) => {
    toast.custom((t) => (
      <div className="bg-dark2 text-gray-200 border border-red-500/40 rounded-xl shadow-xl px-5 py-4 w-full max-w-sm font-vazir">
        <p className="text-sm mb-3">❗ آیا از حذف این کاربر مطمئن هستید؟</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              resolve(false);
            }}
            className="px-3 py-1 text-xs rounded bg-gray-700 hover:bg-gray-600 transition"
          >
            لغو
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              resolve(true);
            }}
            className="px-3 py-1 text-xs rounded bg-red-500 hover:bg-red-600 text-white font-bold transition"
          >
            تایید حذف
          </button>
        </div>
      </div>
    ));
  });
};

const deleteUser = async (id) => {
  const confirmed = await confirmDelete();
  if (!confirmed) return;

  setUpdatingUserId(id);
  try {
    await API.delete(`/admin/users/${id}`);
    await fetchUsers();
    toast.success("کاربر با موفقیت حذف شد.");
  } catch (err) {
    console.error(err);
    toast.error("خطا در حذف کاربر");
  } finally {
    setUpdatingUserId(null);
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <p className="text-gray2 animate-fadeIn">در حال بارگذاری کاربران...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 mt-12">
      <h2 className="text-3xl font-bold text-primary mb-8 text-center animate-fadeIn">
        مدیریت کاربران
      </h2>

      {users.length === 0 ? (
        <p className="text-center text-gray2">هیچ کاربری ثبت نشده است.</p>
      ) : (
        <div className="space-y-6">
          {users.map((user) => {
            const { _id, name, email, role, date } = user
            const isUpdating = updatingUserId === _id

            return (
              <div
                key={_id}
                className="p-6 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center animate-slideIn"
              >
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center mb-1">
                    <FiUser className="text-gray2 ml-1" />
                    <span className="text-gray2 font-medium">{name}</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <FiMail className="text-gray2 ml-1" />
                    <span className="text-gray2">{email}</span>
                  </div>
                  <p className="text-gray2 text-sm">
                    نقش:{' '}
                    <span className="text-primary font-medium capitalize">{role}</span>
                  </p>
                  <p className="text-gray2 text-xs mt-1">
                    تاریخ ثبت‌نام: {new Date(date).toLocaleDateString('fa-IR')}
                  </p>
                </div>

                <div className="flex space-x-3 flex-wrap">
                  {role !== 'admin' && (
                    <button
                      onClick={() => changeRole(_id, 'admin')}
                      disabled={isUpdating}
                      className="flex items-center px-4 py-2 bg-green-600 text-dark2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiUserCheck className="ml-1" /> ارتقا به ادمین
                    </button>
                  )}
                  {role !== 'user' && (
                    <button
                      onClick={() => changeRole(_id, 'user')}
                      disabled={isUpdating}
                      className="flex items-center px-4 py-2 bg-yellow-500 text-dark2 rounded-lg hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiUserX className="ml-1" /> تنزل به کاربر
                    </button>
                  )}
                  <button
                    onClick={() => deleteUser(_id)}
                    disabled={isUpdating}
                    className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiTrash2 className="ml-1" /> حذف کاربر
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
