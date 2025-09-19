import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../slices/cartSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const API_URL = (import.meta.env.VITE_API_URL || "https://aarit-jewels-backend.vercel.app").replace(/\/+$/, "");

const Checkout = () => {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
  });

  const total = items.reduce(
    (acc, item) =>
      acc + (item.product?.price || 0) * (item.quantity || 0),
    0
  );

  useEffect(() => {
    fetchCoupons();
    fetchAddresses();
  }, []);

  // ✅ Fetch coupons
  const fetchCoupons = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/coupons/public`);
      setAvailableCoupons(res.data);
    } catch {
      toast.error("Failed to load coupons");
    }
  };

  // ✅ Fetch saved addresses
  const fetchAddresses = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAddresses(res.data.user.addresses || []);
    } catch {
      toast.error("Failed to load addresses");
    }
  };

  // ✅ Save new address
  const handleSaveAddress = async () => {
    if (!newAddress.name || !newAddress.street || !newAddress.city) {
      return toast.error("Please fill all required fields");
    }
    try {
      await axios.post(`${API_URL}/api/auth/address`, newAddress, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Address saved");
      setNewAddress({
        name: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        phone: "",
      });
      fetchAddresses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save address");
    }
  };

  // ✅ Apply coupon
  const handleApplyCoupon = async (code = couponCode) => {
    if (!code) return toast.error("Enter or select a coupon");
    try {
      const res = await axios.post(
        `${API_URL}/api/coupons/apply`,
        { code, total },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setAppliedCoupon(res.data);
      setCouponCode(code);
      toast.success(`Coupon ${code} applied`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid coupon");
    }
  };

  // ✅ Razorpay loader
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // ✅ Payment
  const handlePayment = async () => {
    if (!selectedAddress)
      return toast.error("Please select a shipping address");

    const res = await loadRazorpay();
    if (!res) return toast.error("Razorpay failed to load");

    try {
      const amount = appliedCoupon ? appliedCoupon.totalAfterDiscount : total;
      const { data } = await axios.post(
        `${API_URL}/api/orders/razorpay`,
        { amount },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      const options = {
        key: "rzp_test_RH3VXrZ9DbNdsw",
        amount: data.amount,
        currency: data.currency,
        name: "Aarit Jewels",
        order_id: data.id,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              `${API_URL}/api/orders/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                couponCode,
                address: selectedAddress,
              },
              { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            toast.success(verifyRes.data.message);

            // ✅ Clear cart & redirect to orders page
            dispatch(clearCart());
            navigate("/orders");
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        theme: { color: "#4F46E5" }, // Indigo theme
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        {/* Title */}
        <h2 className="text-3xl font-serif font-bold text-indigo-900 mb-6 text-center">
          Checkout
        </h2>
        <p className="mb-8 text-lg text-center font-medium text-gray-700">
          Order Total:{" "}
          <span className="text-indigo-600 font-bold">₹{total}</span>
        </p>

        {/* Saved Addresses */}
        <div className="mb-8 bg-indigo-50 p-5 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-indigo-800 mb-4">
            Select Shipping Address
          </h3>
          {addresses.length === 0 ? (
            <p className="text-gray-600">No saved addresses. Add one below.</p>
          ) : (
            <ul className="space-y-3">
              {addresses.map((addr, idx) => (
                <li
                  key={idx}
                  className="border border-indigo-100 p-3 rounded-lg bg-white shadow-sm flex items-start hover:shadow-md transition"
                >
                  <input
                    type="radio"
                    name="selectedAddress"
                    className="mt-1 mr-3 text-indigo-600 focus:ring-indigo-500"
                    checked={
                      selectedAddress &&
                      selectedAddress.street === addr.street
                    }
                    onChange={() => setSelectedAddress(addr)}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{addr.name}</p>
                    <p className="text-gray-600">
                      {addr.street}, {addr.city}, {addr.state} - {addr.zip}
                    </p>
                    <p className="text-gray-600 text-sm">Phone: {addr.phone}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Add New Address */}
        <div className="mb-8 bg-indigo-50 p-5 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-indigo-800 mb-4">
            Add New Address
          </h3>
          {["name", "street", "city", "state", "zip", "phone"].map((field) => (
            <input
              key={field}
              type={field === "phone" ? "tel" : "text"}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={newAddress[field]}
              onChange={(e) =>
                setNewAddress({ ...newAddress, [field]: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-2 mb-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          ))}
          <button
            onClick={handleSaveAddress}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Save Address
          </button>
        </div>

        {/* Coupon Section */}
        <div className="mb-8 bg-indigo-50 p-5 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-indigo-800 mb-3">
            Apply Coupon
          </h3>
          <div className="flex">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              className="flex-grow border border-gray-300 rounded-l-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              onClick={() => handleApplyCoupon()}
              className="bg-indigo-600 text-white px-4 rounded-r-lg hover:bg-indigo-700 transition"
            >
              Apply
            </button>
          </div>

          {appliedCoupon && (
            <div className="mt-4 text-green-600 font-medium">
              <p>Applied: {appliedCoupon.code}</p>
              <p>Discount: ₹{appliedCoupon.discountAmount}</p>
              <p>
                New Total:{" "}
                <span className="font-bold">
                  ₹{appliedCoupon.totalAfterDiscount}
                </span>
              </p>
            </div>
          )}

          {/* Available Coupons */}
          <div className="mt-6">
            <h4 className="text-md font-semibold mb-2 text-gray-800">
              Available Coupons
            </h4>
            {availableCoupons.length === 0 ? (
              <p className="text-gray-600">No coupons available</p>
            ) : (
              <div className="grid gap-3">
                {availableCoupons.map((c) => (
                  <div
                    key={c._id}
                    className="border border-indigo-200 rounded-lg p-3 flex justify-between items-center bg-white shadow-sm hover:shadow-md transition"
                  >
                    <div>
                      <p className="font-bold text-indigo-700">{c.code}</p>
                      <p className="text-sm text-gray-600">{c.discount}% off</p>
                    </div>
                    <button
                      onClick={() => handleApplyCoupon(c.code)}
                      className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition"
                    >
                      Apply
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pay Button */}
        <div className="text-center">
          <button
            onClick={handlePayment}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
