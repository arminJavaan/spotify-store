// frontend/src/api.js

import axios from "axios";

// ایجاد اینستنس axios با baseURL پیش‌فرض
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// اضافه کردن توکن به همهٔ درخواست‌ها
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// مدیریت متمرکز خطاهای پاسخ‌ها (آماده برای toast یا redirect در آینده)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // مثال: نمایش نوتیفیکیشن یا logout خودکار
    // if (error.response?.status === 401) logout();
    return Promise.reject(error);
  }
);

// -----------------------------
// 📦 APIهای کیف پول
// -----------------------------

export const fetchWallet = () => API.get("/api/wallet");
export const chargeWallet = (amount) =>
  API.post("/wallet/charge", { amount });
export const adminAdjustWallet = (userId, amount, description) =>
  API.post("/wallet/admin-adjust", { userId, amount, description });

export default API;
