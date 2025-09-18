import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "Earrings",
    images: [],
  });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products`);
      setProducts(res.data.products || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch products");
    }
  };

  // Submit create/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (key === "images") {
        form.images.forEach((file) => formData.append("images", file));
      } else {
        formData.append(key, form[key]);
      }
    });

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in as admin");
        navigate("/login");
        return;
      }
      if (editingId) {
        await axios.put(`${API_URL}/api/products/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Product updated successfully");
      } else {
        await axios.post(`${API_URL}/api/products`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Product created successfully");
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save product");
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      category: "Earrings",
      images: [],
    });
    setEditingId(null);
  };

  // Edit product
  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      images: [],
    });
    setEditingId(product._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete product
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in as admin");
        navigate("/login");
        return;
      }
      await axios.delete(`${API_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted");
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete product");
    }
  };

  // Image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/200x200.png?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_URL}${imagePath}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-white px-6 py-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Product Form */}
        <div className="bg-white shadow-md rounded-2xl p-8 border border-indigo-100">
          <h2 className="text-2xl font-serif font-bold text-indigo-900 mb-6">
            {editingId ? "✏️ Edit Product" : "➕ Add Product"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Product name"
                className="mt-1 p-3 w-full border rounded-lg focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="Product price"
                className="mt-1 p-3 w-full border rounded-lg focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Product description"
                rows="3"
                className="mt-1 p-3 w-full border rounded-lg focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="mt-1 p-3 w-full border rounded-lg focus:ring-2 focus:ring-indigo-400"
              >
                <option value="Earrings">Earrings</option>
                <option value="Bracelets">Bracelets</option>
                <option value="Pendants">Pendants</option>
                <option value="Necklaces">Necklaces</option>
                <option value="Rings">Rings</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Images</label>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png"
                onChange={(e) =>
                  setForm({ ...form, images: Array.from(e.target.files).slice(0, 5) })
                }
                className="mt-1 p-2 w-full border rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">Max 5 images (JPEG/PNG)</p>
            </div>
            <div className="md:col-span-2 flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-indigo-500 text-white font-semibold py-3 rounded-lg hover:bg-indigo-600 transition"
              >
                {editingId ? "Update Product" : "Create Product"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Products Grid */}
        <div>
          <h2 className="text-2xl font-serif font-bold text-indigo-900 mb-6">All Products</h2>
          {products.length === 0 ? (
            <p className="text-gray-600">No products available</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white border rounded-xl shadow-sm hover:shadow-lg transition p-5 flex flex-col"
                >
                  <img
                    src={
                      product.images && product.images.length > 0
                        ? getImageUrl(product.images[0])
                        : "https://via.placeholder.com/200x200.png?text=No+Image"
                    }
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-indigo-600 font-medium">₹{product.price}</p>
                  <p className="text-sm text-gray-500 truncate mt-1">{product.description}</p>
                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
