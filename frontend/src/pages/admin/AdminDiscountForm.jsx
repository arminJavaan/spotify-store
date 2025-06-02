import { useState } from 'react';
import axios from 'axios';
import { BadgePercent, Info } from 'lucide-react';

export default function AdminDiscountForm({ fetchDiscounts }) {
  const [code, setCode] = useState('');
  const [percentage, setPercentage] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateDiscount = async () => {
    try {
      if (!code || !percentage) return alert('لطفاً کد و درصد را وارد کنید');
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.post(
        '/api/admin/discounts',
        { code, percentage, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.msg);
      setCode('');
      setPercentage('');
      setDescription('');
      fetchDiscounts();
    } catch (err) {
      alert(err?.response?.data?.msg || 'خطا در ساخت کد');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#212121] p-6 rounded-2xl shadow-lg max-w-xl mx-auto mt-28">
      <div className="flex items-center gap-2 mb-4">
        <BadgePercent className="text-[#1db954]" />
        <h2 className="text-white text-xl font-semibold">ایجاد کد تخفیف سفارشی</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">کد تخفیف</label>
          <input
            type="text"
            className="w-full bg-[#121212] border border-[#333] text-white p-2 rounded focus:outline-none focus:border-[#1db954]"
            placeholder="مثلاً: SPRING2025"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">درصد تخفیف</label>
          <input
            type="number"
            min={1}
            max={100}
            className="w-full bg-[#121212] border border-[#333] text-white p-2 rounded focus:outline-none focus:border-[#1db954]"
            placeholder="مثلاً: 20"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
          />
        </div>


        <button
          disabled={loading}
          onClick={handleCreateDiscount}
          className="w-full bg-[#1db954] text-black font-bold py-2 rounded hover:bg-opacity-90 transition"
        >
          {loading ? 'در حال ثبت...' : 'ایجاد کد تخفیف'}
        </button>
      </div>
    </div>
  );
}
