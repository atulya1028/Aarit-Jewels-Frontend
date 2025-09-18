import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`/api/products/${id}`)
      .then((res) => {
        if (res.data && res.data.product) {
          setProduct(res.data.product);
        } else {
          toast.error('Product not found');
        }
      })
      .catch((err) => {
        console.error('Error fetching product:', err);
        toast.error('Error fetching product');
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({ productId: product._id, quantity }));
    toast.success(`${product.name} added to cart`);
  };

  if (!product) return <div className="text-center mt-16">Loading...</div>;

  return (
    <div className="min-h-screen bg-white px-6 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-2xl shadow-lg p-8 border border-indigo-100">
        {/* Product Image */}
        <div className="flex justify-center items-center">
          <img
            src={
              product.images && product.images.length > 0
                ? product.images[0]
                : '/placeholder.png'
            }
            alt={product.name}
            className="w-full h-[450px] object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <h2 className="text-4xl font-serif font-bold text-indigo-800">
            {product.name}
          </h2>
          <p className="text-2xl text-indigo-600 font-semibold mt-2">
            ₹{product.price}
          </p>
          <p className="mt-4 text-gray-700 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity + Cart */}
          <div className="mt-6 flex items-center space-x-4">
            <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-500 hover:text-white transition"
              >
                −
              </button>
              <span className="px-4 py-2 text-gray-900 font-medium">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-500 hover:text-white transition"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-indigo-500 text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-indigo-600 transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
