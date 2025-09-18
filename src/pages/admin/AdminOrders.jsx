import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch orders");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(
        `${API_URL}/api/orders/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Order status updated");
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status } : order
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update order");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        <h2 className="text-3xl font-serif font-bold text-indigo-900 mb-10 text-center">
          Manage Orders
        </h2>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow-md text-center">
            <p className="text-gray-600">No orders found</p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-indigo-100 rounded-xl shadow-sm hover:shadow-md transition p-6"
              >
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-semibold text-indigo-700">{order._id}</p>
                  </div>
                  <div className="mt-3 md:mt-0">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "Processing"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "Shipped"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* User Info */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium text-gray-900">
                    {order.user.name} ({order.user.email})
                  </p>
                </div>

                {/* Total */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-semibold text-indigo-600 text-lg">
                    ₹{order.total}
                  </p>
                </div>

                {/* Items */}
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Items</p>
                  <ul className="space-y-2">
                    {order.items.map((item) => (
                      <li
                        key={item.product._id}
                        className="flex justify-between text-gray-700"
                      >
                        <span>
                          {item.product.name} × {item.quantity}
                        </span>
                        <span className="font-medium">
                          ₹{item.product.price * item.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Status Update */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Update Status
                  </label>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
