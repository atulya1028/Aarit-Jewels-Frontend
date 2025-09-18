import { Link } from "react-router-dom";
import { Package, ShoppingBag, Tag } from "lucide-react";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2 className="text-4xl font-serif font-bold text-center text-indigo-900 mb-12">
          Admin Dashboard
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Products */}
          <Link
            to="/admin/products"
            className="bg-white border border-indigo-100 rounded-2xl shadow-md hover:shadow-xl hover:border-indigo-400 transition transform hover:-translate-y-1 p-8 flex flex-col items-center text-center"
          >
            <div className="bg-indigo-100 p-4 rounded-full mb-5">
              <Package className="w-10 h-10 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Manage Products
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Add, edit, and organize jewelry items
            </p>
          </Link>

          {/* Orders */}
          <Link
            to="/admin/orders"
            className="bg-white border border-indigo-100 rounded-2xl shadow-md hover:shadow-xl hover:border-indigo-400 transition transform hover:-translate-y-1 p-8 flex flex-col items-center text-center"
          >
            <div className="bg-indigo-100 p-4 rounded-full mb-5">
              <ShoppingBag className="w-10 h-10 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Manage Orders
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Track, update, and fulfill customer orders
            </p>
          </Link>

          {/* Coupons */}
          <Link
            to="/admin/coupons"
            className="bg-white border border-indigo-100 rounded-2xl shadow-md hover:shadow-xl hover:border-indigo-400 transition transform hover:-translate-y-1 p-8 flex flex-col items-center text-center"
          >
            <div className="bg-indigo-100 p-4 rounded-full mb-5">
              <Tag className="w-10 h-10 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Manage Coupons
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              Create and track promotional offers
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
