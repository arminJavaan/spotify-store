// frontend/src/pages/OrderDetails.jsx

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import { motion } from "framer-motion";
import {
  FiArrowRightCircle,
  FiShoppingBag,
  FiPrinter,
  FiDownload,
} from "react-icons/fi";
import html2pdf from "html2pdf.js";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const invoiceRef = useRef();

  useEffect(() => {
    API.get("/orders/" + id)
      .then((res) => setOrder(res.data))
      .catch((err) =>
        setError(err.response?.data?.msg || "خطا در دریافت اطلاعات سفارش")
      );
  }, [id]);

  const handlePrint = () => window.print();

  const handleDownloadPDF = () => {
    const element = invoiceRef.current;
    const opt = {
      margin: 0.5,
      filename: `invoice_${order._id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "cm", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10 font-vazir">{error}</div>
    );
  }

  if (!order) {
    return (
      <div className="text-center text-gray-400 mt-10 font-vazir animate-pulse">
        در حال بارگذاری فاکتور سفارش...
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-16 font-vazir text-gray-light mt-20">
      <motion.div
        ref={invoiceRef}
        className="bg-dark2 p-6 rounded-3xl shadow-xl border border-gray-700 print:border-none print:shadow-none print:bg-white print:text-black"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2 print:text-black">
          <FiShoppingBag className="text-2xl" />
          فاکتور سفارش
        </h2>

        <div className="text-sm text-gray-400 space-y-1 mb-4 print:text-black">
          <p>
            <strong className="text-gray-300 print:text-black">
              شماره سفارش:
            </strong>{" "}
            {order._id}
          </p>
          <p>
            <strong className="text-gray-300 print:text-black">
              تاریخ ثبت:
            </strong>{" "}
            {new Date(order.createdAt).toLocaleString("fa-IR")}
          </p>
          <p>
            <strong className="text-gray-300 print:text-black">
              روش پرداخت:
            </strong>{" "}
            {order.paymentMethod}
          </p>
          <p>
            <strong className="text-gray-300 print:text-black">وضعیت:</strong>{" "}
            <span
              className={
                order.status === "completed"
                  ? "text-green-400 print:text-green-700"
                  : order.status === "cancelled"
                  ? "text-red-400 print:text-red-700"
                  : "text-yellow-400 print:text-yellow-700"
              }
            >
              {order.status === "completed"
                ? "تکمیل شده"
                : order.status === "cancelled"
                ? "لغو شده"
                : "در انتظار"}
            </span>
          </p>
        </div>

        <h3 className="text-lg font-bold text-white mt-6 mb-3 print:text-black">
          محصولات:
        </h3>
        <div className="space-y-2 text-sm print:text-black">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between border-b border-gray-700 pb-2 print:border-black"
            >
              <span>
                {item.product.name} × {item.quantity}
              </span>
              <span>
                {(item.product.price * item.quantity).toLocaleString("fa-IR")}{" "}
                تومان
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 mt-4 pt-4 space-y-1 text-sm text-gray-300 print:border-black print:text-black">
          <p>
            <strong>تخفیف:</strong>{" "}
            {order.discountAmount?.toLocaleString("fa-IR") || 0} تومان
          </p>
          <p>
            <strong>مبلغ نهایی:</strong>{" "}
            <span className="text-lg text-primary font-bold print:text-black">
              {order.totalAmount.toLocaleString("fa-IR")} تومان
            </span>
          </p>
          <p>
            <strong>کد تخفیف:</strong> {order.discountCode || "—"}
          </p>
        </div>
        {order.status === "completed" &&
          order.accountInfo?.email &&
          order.accountInfo?.password && (
            <div className="mt-8 bg-green-900/10 border border-green-700 p-4 rounded-xl text-sm print:text-black print:border-black print:bg-white">
              <h4 className="font-bold text-green-400 mb-2 print:text-black">
                اطلاعات اکانت شما:
              </h4>
              <div className="space-y-1 print:text-black">
                <p>
                  <strong>ایمیل:</strong> {order.accountInfo.email}
                </p>
                <p>
                  <strong>رمز عبور:</strong> {order.accountInfo.password}
                </p>
              </div>
              <p className="text-xs text-yellow-300 mt-2 print:hidden">
                ⚠️ لطفاً این اطلاعات را ذخیره کنید. برای امنیت، از اشتراک‌گذاری
                آن با دیگران خودداری کنید.
              </p>
              {order.cashbackAmount > 0 && (
                <p>
                  <strong>کش‌بک:</strong>{" "}
                  {order.cashbackAmount.toLocaleString("fa-IR")} تومان
                </p>
              )}
            </div>
          )}
      </motion.div>

      <div className="mt-6 flex justify-between gap-4 text-sm text-primary">
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-2 hover:text-green-300 transition"
        >
          <FiArrowRightCircle className="text-lg" />
          بازگشت به لیست سفارش‌ها
        </button>

        <div className="flex gap-4">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 hover:text-green-300 transition"
          >
            <FiPrinter /> چاپ فاکتور
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 hover:text-green-300 transition"
          >
            <FiDownload /> دانلود PDF
          </button>
        </div>
      </div>
    </main>
  );
}
