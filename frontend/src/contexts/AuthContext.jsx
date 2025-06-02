// frontend/src/contexts/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await API.get('/auth/me');
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching /auth/me:', err.response?.data || err.message);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const register = async ({ name, email, password, phone }) => {
    try {
      // ارسال درخواست ثبت‌نام
      const res = await API.post('/auth/register', { name, email, password, phone });
      // دریافت توکن و کد تخفیف شخصی از سرور
      const { token, personalCode } = res.data;
      localStorage.setItem('token', token);

      // حالا که توکن را داریم، اطلاعات /auth/me را بگیریم
      setLoading(true);
      const me = await API.get('/auth/me');
      setUser(me.data);

      // بعد از ثبت‌نام، ریدایرکت می‌کنیم به داشبورد (یا هر صفحه‌ای که در نظر دارید)
      navigate('/dashboard');

      // برگرداندن personalCode به کامپوننت ارسال‌کننده
      return personalCode;
    } catch (err) {
      console.error('Error in register():', err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      const { token } = res.data;
      localStorage.setItem('token', token);

      setLoading(true);
      const me = await API.get('/auth/me');
      setUser(me.data);

      navigate('/dashboard');
    } catch (err) {
      console.error('Error in login():', err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
