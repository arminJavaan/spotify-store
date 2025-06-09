// frontend/src/pages/admin/AdminDiscountForm.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import { BadgePercent } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export default function AdminDiscountForm({ fetchDiscounts }) {
  const [code, setCode] = useState("");
  const [percentage, setPercentage] = useState("");
  const [description, setDescription] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [allowedProducts, setAllowedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const [showPersonalModal, setShowPersonalModal] = useState(false);
  const [showReward70Modal, setShowReward70Modal] = useState(false);
  const [showFreeModal, setShowFreeModal] = useState(false);
  const [personalSettings, setPersonalSettings] = useState([]);
  const [reward70Settings, setReward70Settings] = useState([]);
  const [freeSettings, setFreeSettings] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/admin/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllProducts(res.data);
      } catch (err) {
        console.error("خطا در دریافت محصولات:", err);
      }
    };
    fetchProducts();
  }, []);

  const toggleProduct = (id, settings, setSettings) => {
    if (settings.includes(id)) {
      setSettings(settings.filter((p) => p !== id));
    } else {
      setSettings([...settings, id]);
    }
  };

  const fetchSettings = async (type) => {
    try {
      const token = localStorage.getItem("token");
      const urlMap = {
        personal: "/api/admin/settings/personal-discount-products",
        reward70: "/api/admin/settings/discount-products",
        free: "/api/admin/settings/free-discount-products",
      };
      const res = await axios.get(urlMap[type], {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (type === "personal") setPersonalSettings(res.data);
      if (type === "reward70") setReward70Settings(res.data);
      if (type === "free") setFreeSettings(res.data);
    } catch {
      toast.error("خطا در دریافت تنظیمات");
    }
  };

  const saveSettings = async (type, values, onClose) => {
    try {
      const token = localStorage.getItem("token");
      const urlMap = {
        personal: "/api/admin/settings/personal-discount-products",
        reward70: "/api/admin/settings/discount-products",
        free: "/api/admin/settings/free-discount-products",
      };
      await axios.put(urlMap[type], { productIds: values }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("تنظیمات ذخیره شد");
      onClose(false);
    } catch {
      toast.error("خطا در ذخیره تنظیمات");
    }
  };

  const renderSettingModal = (type, visible, setVisible, settings, setSettings) => (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="bg-dark2 p-6  rounded-2xl w-full max-w-lg text-white ">
            <h3 className="text-lg font-bold mb-4 text-center">
              محصولات مجاز برای کد {type === "personal" ? "15٪" : type === "reward70" ? "70٪" : "رایگان"}
            </h3>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
              {allProducts.map((p) => (
                <label key={p._id} className="flex items-center gap-2 p-2">
                  <input
                    type="checkbox"
                    checked={settings.includes(p._id)}
                    onChange={() => toggleProduct(p._id, settings, setSettings)}
                  />
                  <span>{p.name}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-between gap-4 mt-6">
              <button
                onClick={() => setVisible(false)}
                className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
              >
                انصراف
              </button>
              <button
                onClick={() => saveSettings(type, settings, setVisible)}
                className="flex-1 py-2 bg-primary text-dark1 font-bold rounded-lg hover:bg-opacity-90"
              >
                ذخیره تنظیمات
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

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
      const filtered = allowedProducts.filter(Boolean);
      const res = await axios.post("/api/admin/discounts", {
        code: code.trim().toUpperCase(),
        percentage: percentageValue,
        description: description.trim(),
        expiresAt,
        allowedProducts: filtered,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data.msg || "کد تخفیف با موفقیت ایجاد شد");
      setCode("");
      setPercentage("");
      setDescription("");
      setExpiresAt("");
      setAllowedProducts([]);
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
            <input type="text" className="w-full bg-dark3 border border-gray-600 px-4 py-2 rounded-xl focus:outline-none focus:border-primary text-black" placeholder="مثلاً: VIP25" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
          </div>

          <div>
            <label className="block mb-1">درصد تخفیف</label>
            <input type="number" min={1} max={100} className="w-full bg-dark3 border border-gray-600 px-4 py-2 rounded-xl focus:outline-none focus:border-primary text-black" placeholder="مثلاً: 15" value={percentage} onChange={(e) => setPercentage(e.target.value)} />
          </div>

          <div>
            <label className="block mb-1">توضیحات (اختیاری)</label>
            <input type="text" className="w-full bg-dark3 border border-gray-600 px-4 py-2 rounded-xl focus:outline-none focus:border-primary text-black" placeholder="مثلاً: فقط برای کاربران ویژه" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div>
            <label className="block mb-1">تاریخ انقضا</label>
            <input type="date" className="w-full bg-dark3 border border-gray-600 px-4 py-2 rounded-xl focus:outline-none focus:border-primary text-black" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
          </div>

          <div>
            <label className="block mb-1">اعمال روی چه محصولاتی؟</label>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1 bg-white p-4 rounded-xl">
              {allProducts.map((p) => (
                <label key={p._id} className="flex items-center gap-2 text-black">
                  <input
                    type="checkbox"
                    checked={allowedProducts.includes(p._id)}
                    onChange={() => toggleProduct(p._id, allowedProducts, setAllowedProducts)}
                  />
                  <span>{p.name}</span>
                </label>
              ))}
            </div>
          </div>

          <button onClick={handleCreateDiscount} disabled={loading} className="w-full bg-primary text-dark1 font-bold py-2 rounded-xl hover:bg-opacity-90 transition disabled:opacity-60">
            {loading ? "در حال ثبت..." : "ایجاد کد تخفیف"}
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-6">
            <button onClick={() => { fetchSettings("personal"); setShowPersonalModal(true); }} className="bg-dark3 text-primary py-2 rounded-xl text-sm border border-primary">تنظیم کد 15٪</button>
            <button onClick={() => { fetchSettings("reward70"); setShowReward70Modal(true); }} className="bg-dark3 text-yellow-400 py-2 rounded-xl text-sm border border-yellow-400">تنظیم کد 70٪</button>
            <button onClick={() => { fetchSettings("free"); setShowFreeModal(true); }} className="bg-dark3 text-red-400 py-2 rounded-xl text-sm border border-red-800">تنظیم کد رایگان</button>
          </div>
        </div>
      </motion.div>

      {renderSettingModal("personal", showPersonalModal, setShowPersonalModal, personalSettings, setPersonalSettings)}
      {renderSettingModal("reward70", showReward70Modal, setShowReward70Modal, reward70Settings, setReward70Settings)}
      {renderSettingModal("free", showFreeModal, setShowFreeModal, freeSettings, setFreeSettings)}
    </main>
  );
}
