import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

// ✅ Always ensure base URL ends with /
const API_URL =
  (import.meta.env.VITE_API_URL || "https://aarit-jewels-backend.vercel.app") +
  "/";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [categories] = useState(["All", "Bracelets", "Earrings", "Pendants", "Rings" ]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortOrder, setSortOrder] = useState(""); // asc | desc

  // ✅ Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}api/products`);
        if (Array.isArray(res.data.products)) {
          setProducts(res.data.products.slice(0, 12));
          setFilteredProducts(res.data.products.slice(0, 12));
        } else {
          setProducts([]);
          toast.error("Failed to load products");
        }
      } catch (err) {
        console.error("Error fetching products:", err.message);
        setProducts([]);
        toast.error("Error fetching products");
      }
    };
    fetchProducts();
  }, []);

  // ✅ Filtering + Sorting
  useEffect(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Price filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sorting
    if (sortOrder === "asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, priceRange, sortOrder, products]);

  return (
    <div className="font-sans space-y-16 bg-white">
      {/* 🔽 Compact Filter Section */}
      <section className="px-6 md:px-60">
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (₹{priceRange[0]} - ₹{priceRange[1]})
            </label>
            <input
              type="range"
              min="0"
              max="100000"
              step="5000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, Number(e.target.value)])}
              className="w-full accent-indigo-500"
            />
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Default</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* Hero Banner */}
      <section className="relative w-full">
        <div className="h-[40vh] max-w-6xl mx-auto bg-gradient-to-r from-indigo-100 via-purple-100 to-blue-100 flex items-center justify-center">
          <div className="text-center text-gray-900 px-6">
            <h1 className="text-5xl font-serif font-bold">
              Discover the Royal Touch
            </h1>
            <p className="mt-3 text-lg text-gray-700">
              Timeless Jewelry Crafted for Every Occasion
            </p>
            <Link
              to="/products"
              className="mt-6 inline-block bg-indigo-400 hover:bg-indigo-500 text-white font-semibold py-3 px-8 rounded-full shadow-md transition"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-6 md:px-16">
        <h2 className="text-3xl font-serif font-bold text-center mb-10 text-indigo-800">
          Featured Products
        </h2>
        {filteredProducts.length === 0 ? (
          <p className="text-gray-600 text-center">No products found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="group border rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-white"
              >
                <div className="relative">
                  <img
                    src={product.images?.[0] || "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-2 left-2 bg-indigo-400 text-xs px-2 py-1 rounded text-white font-semibold">
                    New
                  </span>
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mt-1">₹{product.price}</p>
                  <Link
                    to={`/product/${product._id}`}
                    className="mt-3 inline-block bg-indigo-400 text-white py-2 px-5 rounded-full hover:bg-indigo-500 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* About Section */}
      <section className="bg-indigo-50 py-16 px-6 md:px-20 text-center">
        <h2 className="text-3xl font-serif font-bold text-indigo-800">
          The Aarit Legacy
        </h2>
        <p className="max-w-2xl mx-auto mt-4 text-gray-700 leading-relaxed">
          At Aarit Jewels, every piece tells a story of passion and craftsmanship.
          With heritage-inspired designs and modern artistry, we create jewelry
          that symbolizes elegance, love, and timeless beauty.
        </p>
      </section>
    </div>
  );
};

export default Home;
