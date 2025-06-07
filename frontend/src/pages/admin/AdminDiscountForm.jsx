// frontend/src/pages/admin/AdminDiscountForm.jsx

import { useState } from "react";
import axios from "axios";
import { BadgePercent } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function AdminDiscountForm({ fetchDiscounts }) {
  const [code, setCode] = useState("");
  const [percentage, setPercentage] = useState("");
  const [description, setDescription] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateDiscount = async () => {
    if (!code.trim() || !percentage) {
      toast.error("کد و درصد تخفیف الزامی هستند.");
      return;
    }

    const percentageValue = Number(percentage);
    if (percentageValue < 1 || percentageValue > 100) {
      toast.error("درصد تخفیف باید بین ۱ تا ۱۰۰ باشد.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/admin/discounts",
        {
          code: code.trim().toUpperCase(),
          percentage: percentageValue,
          description: description.trim(),
          expiresAt,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.msg || "کد تخفیف با موفقیت ایجاد شد");
      setCode("");
      setPercentage("");
      setDescription("");
      setExpiresAt("");
      fetchDiscounts();
    } catch (err) {
      toast.error(err?.response?.data?.msg || "خطا در ایجاد کد تخفیف");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-16 px-4 font-vazir mt-14">
      <motion.div
        className="bg-gradient-to-br from-dark1 to-dark2 p-8 rounded-3xl shadow-2xl border border-gray-700 max-w-xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <BadgePercent className="text-primary" />
          <h2 className="text-white text-2xl font-bold">ایجاد کد تخفیف سفارشی</h2>
        </div>

        <div className="space-y-5 text-sm text-gray-300">
          <div>
            <label className="block mb-1">کد تخفیف</label>
            <input
              type="text"
              className="w-full bg-dark3 border border-gray-600 px-4 py-2 rounded-xl focus:outline-none focus:border-primary text-white"
              placeholder="مثلاً: VIP25"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
          </div>

          <div>
            <label className="block mb-1">درصد تخفیف</label>
            <input
              type="number"
              min={1}
              max={100}
              className="w-full bg-dark3 border border-gray-600 px-4 py-2 rounded-xl focus:outline-none focus:border-primary text-white"
              placeholder="مثلاً: 15"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">توضیحات (اختیاری)</label>
            <input
              type="text"
              className="w-full bg-dark3 border border-gray-600 px-4 py-2 rounded-xl focus:outline-none focus:border-primary text-white"
              placeholder="مثلاً: فقط برای کاربران ویژه"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">تاریخ انقضا</label>
            <input
              type="date"
              className="w-full bg-dark3 border border-gray-600 px-4 py-2 rounded-xl focus:outline-none focus:border-primary text-white"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>

          <button
            onClick={handleCreateDiscount}
            disabled={loading}
            className="w-full bg-primary text-dark1 font-bold py-2 rounded-xl hover:bg-opacity-90 transition disabled:opacity-60"
          >
            {loading ? "در حال ثبت..." : "ایجاد کد تخفیف"}
          </button>
        </div>
      </motion.div>
    </main>
  );
}
