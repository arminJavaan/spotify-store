// ✅ صفحه تأیید ایمیل در فرانت‌اند با استفاده از React و نمایش وضعیت

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('pending');
  const [message, setMessage] = useState('در حال تایید ایمیل...');

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`/api/auth/verify-email/${token}`);
        setStatus('success');
        setMessage(res.data.msg || 'ایمیل با موفقیت تایید شد!');
      } catch (err) {
        setStatus('error');
        const msg = err.response?.data?.msg || 'خطایی در تایید ایمیل رخ داد';
        setMessage(msg);
      }
    };
    verify();
  }, [token]);

  return (
    <main className="flex items-center justify-center min-h-screen bg-dark2 px-4">
      <motion.div
        className="bg-dark1 text-gray-light p-8 rounded-2xl shadow-lg max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className={`text-2xl font-bold mb-4 ${status === 'success' ? 'text-green-400' : status === 'error' ? 'text-red-400' : 'text-primary'}`}>
          {status === 'pending' && 'در حال تایید...'}
          {status === 'success' && '✅ تایید موفق'}
          {status === 'error' && '❌ تایید ناموفق'}
        </h2>
        <p className="text-lg leading-relaxed">{message}</p>
        {status === 'success' && (
          <a
            href="/login"
            className="inline-block mt-6 px-6 py-2 bg-primary text-dark1 font-semibold rounded hover:bg-opacity-90 transition"
          >
            ورود به حساب کاربری
          </a>
        )}
      </motion.div>
    </main>
  );
}
