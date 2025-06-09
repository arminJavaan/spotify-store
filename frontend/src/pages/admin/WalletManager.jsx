import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiArrowUpRight,
  FiArrowDownLeft,
  FiSearch,
  FiRefreshCw,
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function WalletManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userRes = await axios.get("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const walletRes = await Promise.all(
          userRes.data.map((user) =>
            axios
              .get(`/api/wallet/admin/${user._id}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then((res) => ({ ...user, wallet: res.data }))
              .catch(() => ({ ...user, wallet: null }))
          )
        );

        setUsers(walletRes);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [refresh]);

  const adjustWallet = async (userId, amount, description) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/wallet/admin-adjust",
        { userId, amount, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("موجودی بروزرسانی شد");
      setRefresh(!refresh);
    } catch (err) {
      toast.error("خطا در بروزرسانی موجودی");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto mt-20 text-white">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <h2 className="text-2xl font-bold">مدیریت کیف پول کاربران</h2>
        <div className="flex items-center gap-2 bg-dark1 border border-gray-700 rounded px-3 py-1 w-full md:w-80">
          <FiSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="جستجو بر اساس ایمیل..."
            className="bg-transparent text-white outline-none flex-1 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-400 animate-pulse">در حال بارگذاری...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-dark2 p-5 rounded-2xl border border-gray-700 shadow-lg flex flex-col justify-between"
            >
              <div>
                <p className="text-lg font-semibold">
                  {user.name || "—"} <span className="text-sm text-gray-400">({user.email})</span>
                </p>
                <p className="text-green-400 mt-1 text-sm">
                  موجودی: {user.wallet?.balance?.toLocaleString("fa-IR") || 0} تومان
                </p>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <input
                  type="number"
                  placeholder="مبلغ (+/-)"
                  className="bg-dark1 text-white border border-gray-600 p-2 rounded-lg text-sm"
                  id={`amount-${user._id}`}
                />
                <input
                  type="text"
                  placeholder="توضیح"
                  className="bg-dark1 text-white border border-gray-600 p-2 rounded-lg text-sm"
                  id={`desc-${user._id}`}
                />
                <button
                  className="bg-primary text-black font-semibold py-2 rounded-lg hover:bg-opacity-90 transition text-sm"
                  onClick={() => {
                    const amt = parseInt(document.getElementById(`amount-${user._id}`).value);
                    const desc = document.getElementById(`desc-${user._id}`).value;
                    if (isNaN(amt) || desc.trim() === "") return toast.success("اطلاعات ناقص است");
                    adjustWallet(user._id, amt, desc);
                  }}
                >
                  اعمال تغییر
                </button>
              </div>

              {user.wallet?.transactions?.length > 0 && (
                <div className="mt-4 bg-dark1 p-3 rounded-xl text-sm text-gray-300">
                  <p className="mb-2 font-medium text-white">آخرین تراکنش‌ها:</p>
                  <ul className="space-y-1 max-h-40 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-primary scrollbar-track-dark3">
                    {user.wallet.transactions.slice(0, 5).map((tx, idx) => (
                      <li
                        key={idx}
                        className="flex justify-between items-center border-b border-gray-700 pb-1"
                      >
                        <span className="flex items-center gap-2">
                          {tx.type === "increase" ? (
                            <FiArrowUpRight className="text-green-500" />
                          ) : tx.type === "decrease" ? (
                            <FiArrowDownLeft className="text-red-500" />
                          ) : (
                            <FiArrowDownLeft className="text-yellow-400" />
                          )}
                          {tx.description || "—"}
                        </span>
                        <span>{tx.amount.toLocaleString("fa-IR")}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}