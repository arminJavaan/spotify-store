import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function VerifyPhone() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const hasSentRef = useRef(false); // ✅ به‌جای useState

  useEffect(() => {
    const phoneFromQuery = params.get("phone");
    if (phoneFromQuery) {
      setPhone(phoneFromQuery);
      if (!hasSentRef.current && resendTimer === 0) {
        handleSendCodeOnce(phoneFromQuery);
      }
    }
  }, [params]);

  const handleSendCodeOnce = async (phoneParam = phone) => {
    if (hasSentRef.current) return;
    hasSentRef.current = true; // ✅ مستقیم آپدیت می‌دیم
    await handleSendCode(phoneParam);
  };

  const handleSendCode = async (phoneParam = phone) => {
    setError(null);
    setMessage(null);
    if (!phoneParam) {
      setError("شماره موبایل معتبر نیست");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/send-code", { phone: phoneParam });
      setMessage(res.data.msg);
      startTimer();
    } catch (err) {
      setError(
        err.response?.data?.msg ||
        err.response?.data?.errors?.[0]?.msg ||
        "خطا در ارسال کد"
      );
      hasSentRef.current = false; // اگر خطا بود اجازه بده دوباره تلاش کنه
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError(null);
    setMessage(null);
    if (!code.trim()) {
      setError("کد تایید را وارد کنید");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/verify-code", { phone, code });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setMessage("احراز هویت با موفقیت انجام شد");
        navigate("/dashboard");
      } else {
        setMessage(res.data.msg || "احراز هویت انجام شد");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "کد وارد شده اشتباه است");
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-dark2 px-4">
      <motion.div
        className="bg-dark1 w-full max-w-md p-8 rounded-2xl shadow-xl text-gray-light"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl font-bold text-primary text-center mb-6">
          تأیید شماره موبایل
        </h2>

        {error && (
          <p className="bg-red-100 text-red-700 border border-red-300 px-4 py-2 rounded text-sm mb-4">
            {error}
          </p>
        )}
        {message && (
          <p className="bg-green-100 text-green-700 border border-green-300 px-4 py-2 rounded text-sm mb-4">
            {message}
          </p>
        )}

        <p className="text-sm text-gray-light mb-2">
          کد ارسال‌شده به شماره <span className="text-primary">{phone}</span> را وارد کنید
        </p>
        <input
          type="text"
          placeholder="کد تایید"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full px-4 py-2 mb-4 bg-dark2 text-gray-light border border-gray-med rounded focus:outline-none focus:border-primary"
        />
        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-primary text-dark2 py-2 rounded font-semibold hover:bg-opacity-90 transition"
        >
          {loading ? "در حال بررسی..." : "تأیید کد"}
        </button>
        {resendTimer > 0 ? (
          <p className="text-center text-xs mt-4 text-gray-med">
            ارسال مجدد تا {resendTimer} ثانیه دیگر
          </p>
        ) : (
          <button
            onClick={handleSendCode}
            className="w-full text-xs mt-4 text-primary underline hover:text-primary/80"
          >
            ارسال مجدد کد
          </button>
        )}
      </motion.div>
    </main>
  );
}