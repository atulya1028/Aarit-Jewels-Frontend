import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// ✅ Strip trailing slashes so no double `//api/...`
const API_URL = (import.meta.env.VITE_API_URL || "https://vercel.com/atulya1028s-projects/aarit-jewels-backend").replace(/\/+$/, "");

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({ code: "", discount: "", expiryDate: "" });

  // 🔑 Auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // ✅ Fetch coupons
  const fetchCoupons = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/coupons`, {
        headers: getAuthHeaders(),
      });
      setCoupons(res.data);
    } catch (err) {
      console.error("Fetch coupons error:", err);
      toast.error(err.response?.data?.message || "Failed to load coupons");
    }
  };

  // ✅ Create coupon
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, code: form.code.toUpperCase() };
      await axios.post(`${API_URL}/api/coupons`, payload, {
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      });
      setForm({ code: "", discount: "", expiryDate: "" });
      fetchCoupons();
      toast.success("Coupon created successfully");
    } catch (err) {
      console.error("Create coupon error:", err);
      toast.error(err.response?.data?.message || "Failed to create coupon");
    }
  };

  // ✅ Delete coupon
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/coupons/${id}`, {
        headers: getAuthHeaders(),
      });
      fetchCoupons();
      toast.success("Coupon deleted successfully");
    } catch (err) {
      console.error("Delete coupon error:", err);
      toast.error(err.response?.data?.message || "Failed to delete coupon");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-white px-6 py-12">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Coupon Form */}
        <div className="bg-white shadow-lg rounded-2xl p-8 border border-indigo-100 hover:shadow-xl transition">
          <h2 className="text-3xl font-serif font-bold text-indigo-900 mb-8">
            Create Coupon
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Coupon Code
              </label>
              <input
                type="text"
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value.toUpperCase() })
                }
                placeholder="e.g. DIWALI20"
                className="mt-2 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Discount (%)
              </label>
              <input
                type="number"
                value={form.discount}
                onChange={(e) =>
                  setForm({ ...form, discount: e.target.value })
                }
                placeholder="Enter discount"
                className="mt-2 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                min="0"
                max="100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="date"
                value={form.expiryDate}
                onChange={(e) =>
                  setForm({ ...form, expiryDate: e.target.value })
                }
                className="mt-2 p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-500 text-white font-semibold py-3 rounded-lg hover:bg-indigo-600 transition"
            >
              Create Coupon
            </button>
          </form>
        </div>

        {/* Coupons List */}
        <div>
          <h2 className="text-3xl font-serif font-bold text-indigo-900 mb-8">
            Active Coupons
          </h2>
          {coupons.length === 0 ? (
            <p className="text-gray-600">No coupons available</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {coupons.map((coupon) => (
                <div
                  key={coupon._id}
                  className="bg-white border border-indigo-100 rounded-2xl shadow-md hover:shadow-lg transition p-6"
                >
                  <h3 className="text-xl font-semibold text-indigo-700">
                    {coupon.code}
                  </h3>
                  <p className="mt-2 text-gray-700">
                    Discount: <span className="font-medium">{coupon.discount}%</span>
                  </p>
                  <p className="mt-1 text-gray-500 text-sm">
                    Expiry:{" "}
                    {coupon.expiryDate
                      ? new Date(coupon.expiryDate).toLocaleDateString()
                      : "No expiry"}
                  </p>
                  <button
                    onClick={() => handleDelete(coupon._id)}
                    className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCoupons;
