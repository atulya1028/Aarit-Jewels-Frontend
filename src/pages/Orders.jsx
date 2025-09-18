import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';

const Orders = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/api/orders/myorders', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setOrders(res.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load orders');
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">
          Your Orders
        </h2>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="bg-white border rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-600">You don’t have any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border rounded-lg shadow-md p-6"
              >
                {/* Order Header */}
                <div className="flex flex-col md:flex-row justify-between md:items-center border-b pb-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID:{' '}
                      <span className="font-medium text-gray-800">
                        {order._id}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Status:{' '}
                      <span
                        className={`font-semibold ${
                          order.status === 'Delivered'
                            ? 'text-green-600'
                            : order.status === 'Pending'
                            ? 'text-yellow-600'
                            : 'text-gray-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mt-3 md:mt-0">
                    Total:{' '}
                    <span className="text-yellow-600">₹{order.total}</span>
                  </p>
                </div>

                {/* Shipping Address */}
                {order.address && (
                  <div className="mb-4 bg-gray-50 border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
                    <p className="text-gray-800 font-medium">{order.address.name}</p>
                    <p className="text-gray-600">{order.address.street}</p>
                    <p className="text-gray-600">
                      {order.address.city}, {order.address.state} - {order.address.zip}
                    </p>
                    <p className="text-gray-600">Phone: {order.address.phone}</p>
                  </div>
                )}

                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Items</h3>
                  <ul className="divide-y divide-gray-100">
                    {order.items.map((item) => (
                      <li
                        key={item.product._id}
                        className="py-3 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            {item.product.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium text-gray-700">
                          ₹{item.product.price * item.quantity}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
