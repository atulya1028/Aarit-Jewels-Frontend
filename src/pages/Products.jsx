import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || "https://aarit-jewels-backend.vercel.app";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/products`)
      .then((res) => {
        if (Array.isArray(res.data.products)) {
          setProducts(res.data.products);
        } else {
          console.error('Expected an array but received:', res.data);
          setProducts([]);
          toast.error('Failed to load products');
        }
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setProducts([]);
        toast.error('Error fetching products');
      });
  }, []);

  const getImageUrl = (img) => {
    if (!img) return "/placeholder.png";
    return img.startsWith("http") ? img : `${API_URL}${img}`;
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2 className="text-3xl font-serif font-bold text-indigo-800 mb-10 text-center">
          Our Collection
        </h2>

        {/* Empty State */}
        {products.length === 0 ? (
          <div className="bg-indigo-50 border border-indigo-200 shadow-md rounded-xl p-12 text-center">
            <p className="text-gray-600">
              No products available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white border rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden group"
              >
                {/* Image */}
                <div className="relative">
                  <img
                    src={getImageUrl(product.images?.[0])}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Badge */}
                  <span className="absolute top-2 left-2 bg-indigo-400 text-xs px-2 py-1 rounded text-white font-semibold shadow">
                    New
                  </span>
                </div>

                {/* Details */}
                <div className="p-5 text-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mt-1">₹{product.price}</p>

                  <Link
                    to={`/product/${product._id}`}
                    className="mt-4 inline-block bg-indigo-500 text-white font-medium py-2 px-6 rounded-full hover:bg-indigo-600 transition shadow"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
