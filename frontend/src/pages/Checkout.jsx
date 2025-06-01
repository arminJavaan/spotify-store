import React, { useContext, useState, useEffect } from 'react'
import { CartContext } from '../contexts/CartContext'
import API from '../api'
import { useNavigate } from 'react-router-dom'

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext)
  const navigate = useNavigate()
  const [method, setMethod] = useState('shaparak')
  const [cryptoType, setCryptoType] = useState('ETH_BASE')
  const [cardNumber, setCardNumber] = useState('')
  const [bankName, setBankName] = useState('')

  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate('/cart')
    }
  }, [cart])

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const submitOrder = async () => {
    try {
      const paymentDetails = {}
      if (method === 'crypto') {
        paymentDetails.cryptoType = cryptoType
      } else if (method === 'card-to-card') {
        paymentDetails.cardNumber = cardNumber
        paymentDetails.bankName = bankName
      } else if (method === 'shaparak') {
        paymentDetails.placeholder = 'پرداخت اینترنتی شاپرک'
      }
      const res = await API.post('/orders', { paymentMethod: method, paymentDetails })

      if (method === 'whatsapp') {
        window.open(res.data.order.whatsappOrderUrl, '_blank')
      } else {
        alert('سفارش شما با موفقیت ثبت شد.')
        clearCart()
        navigate('/orders')
      }
    } catch (err) {
      console.error(err)
      alert('خطا در ثبت سفارش: ' + (err.response?.data.msg || err.message))
    }
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-primary mb-8 text-center animate-fadeIn">
        اطلاعات سفارش و پرداخت
      </h2>

      {/* Order Summary Card */}
      <div className="bg-dark1 rounded-2xl shadow-lg p-6 mb-8 animate-slideIn">
        <h3 className="text-xl font-semibold text-gray2 mb-4">خلاصه سبد خرید</h3>
        <div className="space-y-2">
          {cart.map(item => (
            <div
              key={item.product._id}
              className="flex justify-between items-center text-gray2"
            >
              <span>{item.product.name} × {item.quantity}</span>
              <span>{(item.product.price * item.quantity).toLocaleString('fa-IR')} تومان</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-4 border-t border-gray1 pt-4">
          <span className="text-lg font-semibold text-gray2">مبلغ کل:</span>
          <span className="text-lg font-bold text-gray2">{total.toLocaleString('fa-IR')} تومان</span>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6 animate-fadeIn">
        <label htmlFor="paymentMethod" className="block text-gray2 mb-2">
          انتخاب روش پرداخت:
        </label>
        <select
          id="paymentMethod"
          value={method}
          onChange={e => setMethod(e.target.value)}
          className="w-full px-4 py-2 bg-dark1 text-gray2 border border-gray1 rounded focus:outline-none focus:border-primary"
        >
          <option value="shaparak">پرداخت اینترنتی (شاپرک)</option>
          <option value="crypto">پرداخت ارز دیجیتال</option>
          <option value="card-to-card">کارت به کارت</option>
          <option value="whatsapp">ثبت سفارش واتساپی</option>
        </select>
      </div>

      {/* Shaparak Section */}
      {method === 'shaparak' && (
        <div className="mb-6 bg-dark1 p-6 rounded-2xl shadow-lg animate-slideIn">
          <p className="text-gray2 mb-4">درگاه پرداخت شاپرک (اطلاعات API بعداً قرار می‌گیرد)</p>
          <button
            onClick={submitOrder}
            className="w-full px-6 py-3 bg-primary text-dark2 font-semibold rounded-lg hover:bg-[#148c3c] transition"
          >
            پرداخت با شاپرک
          </button>
        </div>
      )}

      {/* Crypto Section */}
      {method === 'crypto' && (
        <div className="mb-6 bg-dark1 p-6 rounded-2xl shadow-lg animate-slideIn">
          <label htmlFor="cryptoSelect" className="block text-gray2 mb-2">
            انتخاب ارز:
          </label>
          <select
            id="cryptoSelect"
            value={cryptoType}
            onChange={e => setCryptoType(e.target.value)}
            className="w-full px-4 py-2 bg-dark2 text-gray2 border border-gray1 rounded focus:outline-none focus:border-primary"
          >
            <option value="ETH_BASE">ETH (BASE)</option>
            <option value="ETH_ARB">ETH (ARB)</option>
            <option value="TRX">TRX</option>
            <option value="USDT_TRX">USDT (TRX)</option>
            <option value="S_SONIC">S (SONIC)</option>
          </select>
          <p className="mt-3 text-gray2 text-sm">بعداً آدرس ولت مربوطه برای شما نمایش داده می‌شود.</p>
          <button
            onClick={submitOrder}
            className="mt-6 w-full px-6 py-3 bg-primary text-dark2 font-semibold rounded-lg hover:bg-[#148c3c] transition"
          >
            ادامه و ثبت سفارش
          </button>
        </div>
      )}

      {/* Card-to-Card Section */}
      {method === 'card-to-card' && (
        <div className="mb-6 bg-dark1 p-6 rounded-2xl shadow-lg animate-slideIn">
          <label className="block text-gray2 mb-2">اطلاعات کارت به کارت:</label>
          <input
            id="cardNumber"
            value={cardNumber}
            onChange={e => setCardNumber(e.target.value)}
            type="text"
            placeholder="شماره کارت"
            className="w-full px-4 py-2 bg-dark2 text-gray2 border border-gray1 rounded mb-4 focus:outline-none focus:border-primary"
          />
          <input
            id="bankName"
            value={bankName}
            onChange={e => setBankName(e.target.value)}
            type="text"
            placeholder="نام بانک"
            className="w-full px-4 py-2 bg-dark2 text-gray2 border border-gray1 rounded mb-4 focus:outline-none focus:border-primary"
          />
          <p className="text-gray2 text-sm mb-4">پس از انتقال وجه، رسید را از طریق واتساپ ارسال کنید.</p>
          <button
            onClick={submitOrder}
            className="w-full px-6 py-3 bg-primary text-dark2 font-semibold rounded-lg hover:bg-[#148c3c] transition"
          >
            ثبت نهایی سفارش
          </button>
        </div>
      )}

      {/* WhatsApp Section */}
      {method === 'whatsapp' && (
        <div className="mb-6 bg-dark1 p-6 rounded-2xl shadow-lg animate-slideIn">
          <p className="text-gray2 mb-4">برای ثبت سفارش، روی دکمه زیر کلیک کنید تا به واتساپ هدایت شوید:</p>
          <button
            onClick={submitOrder}
            className="w-full px-6 py-3 bg-green-600 text-dark2 font-semibold rounded-lg hover:bg-green-700 transition"
          >
            ارسال سفارش در واتساپ
          </button>
        </div>
      )}

      {/* Fallback Button */}
      {(method !== 'shaparak' && method !== 'whatsapp' && method !== 'crypto' && method !== 'card-to-card') && (
        <button
          onClick={submitOrder}
          className="mt-4 w-full px-6 py-3 bg-primary text-dark2 font-semibold rounded-lg hover:bg-[#148c3c] transition"
        >
          ثبت نهایی سفارش
        </button>
      )}
    </main>
  )
}
