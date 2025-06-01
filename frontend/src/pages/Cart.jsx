import React, { useContext, useEffect } from 'react'
import { CartContext } from '../contexts/CartContext'
import { useNavigate } from 'react-router-dom'

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, fetchCart } = useContext(CartContext)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCart()
  }, [])

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <main className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-primary mb-8 text-center animate-fadeIn">
        سبد خرید شما
      </h2>

      {cart.length === 0 ? (
        <div className="text-center text-gray2 py-10 animate-fadeIn">
          <p>سبد خرید شما خالی است.</p>
          <button
            onClick={() => navigate('/products')}
            className="mt-6 px-6 py-3 bg-primary text-dark2 font-medium rounded-lg hover:bg-[#148c3c] transition"
          >
            مشاهده محصولات
          </button>
        </div>
      ) : (
        <>
          {/* Items List */}
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.product._id}
                className="flex flex-col md:flex-row justify-between items-center bg-dark1 rounded-2xl p-6 shadow-lg animate-slideIn"
              >
                {/* Product Info */}
                <div className="flex items-center space-x-4 w-full md:w-2/3">
                  <div className="h-20 w-20 flex-shrink-0 bg-dark2 rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={item.product.logoUrl}
                      alt={item.product.name}
                      className="h-full w-auto object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-lg font-semibold text-primary">
                      {item.product.name}
                    </h4>
                    <p className="text-gray2 text-sm mt-1">
                      قیمت واحد: {item.product.price.toLocaleString('fa-IR')} تومان
                    </p>
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex items-center space-x-3 mt-4 md:mt-0 md:w-1/3 justify-end">
                  <button
                    onClick={() =>
                      updateQuantity(item.product._id, item.quantity - 1)
                    }
                    className="px-3 py-1 bg-gray1 text-gray2 rounded-lg hover:bg-[#444] transition"
                  >
                    -
                  </button>
                  <span className="text-gray2 text-lg font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product._id, item.quantity + 1)
                    }
                    className="px-3 py-1 bg-gray1 text-gray2 rounded-lg hover:bg-[#444] transition"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="ml-4 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary & Checkout */}
          <div className="mt-10 max-w-md mx-auto md:mx-0 bg-dark1 p-6 rounded-2xl shadow-xl animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-semibold text-primary">مبلغ کل:</span>
              <span className="text-xl font-bold text-gray2">
                {total.toLocaleString('fa-IR')} تومان
              </span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full px-6 py-3 bg-primary text-dark2 font-semibold rounded-lg hover:bg-[#148c3c] transition"
            >
              اقدام به پرداخت
            </button>
          </div>
        </>
      )}
    </main>
  )
}
