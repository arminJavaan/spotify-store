// frontend/src/api.js

import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const fetchWallet = () => API.get('/wallet')
export const chargeWallet = (amount) => API.post('/wallet/charge', { amount })
export const adminAdjustWallet = (userId, amount, description) =>
  API.post('/wallet/admin-adjust', { userId, amount, description })


export default API
