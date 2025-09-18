import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, updateCart, clearCart } from '../slices/cartSlice';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const total = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-indigo-50 px-6 py-10">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        {/* Title */}
        <h2 className="text-4xl font-serif font-bold text-indigo-900 mb-10 text-center">
          Your Shopping Bag
        </h2>

        {/* Empty Cart */}
        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 mb-6 text-lg">Your cart is empty</p>
            <Link
              to="/products"
              className="bg-indigo-500 text-white px-8 py-3 rounded-full font-medium hover:bg-indigo-600 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="grid gap-6">
              {items.map((item) => (
                <div
                  key={item.product._id}
                  className="flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                >
                  {/* Product Info */}
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        item.product.images?.[0] || '/placeholder.png'
                      }
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg shadow"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        ₹{item.product.price} each
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        dispatch(
                          updateCart({
                            productId: item.product._id,
                            quantity: item.quantity - 1,
                          })
                        )
                      }
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-indigo-500 hover:text-white flex items-center justify-center transition"
                    >
                      −
                    </button>
                    <span className="font-semibold text-gray-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        dispatch(
                          updateCart({
                            productId: item.product._id,
                            quantity: item.quantity + 1,
                          })
                        )
                      }
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-indigo-500 hover:text-white flex items-center justify-center transition"
                    >
                      +
                    </button>
                  </div>

                  {/* Price */}
                  <p className="font-bold text-indigo-700 text-lg">
                    ₹{item.product.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>

            {/* Total & Actions */}
            <div className="mt-10 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
              <div className="bg-indigo-100 border border-indigo-200 rounded-xl px-6 py-4 text-center md:text-left shadow-sm">
                <p className="text-lg font-medium text-gray-700">Total</p>
                <p className="text-2xl font-bold text-indigo-800">₹{total}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => dispatch(clearCart())}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition"
                >
                  Clear Cart
                </button>
                <Link
                  to="/checkout"
                  className="bg-indigo-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-600 transition text-center"
                >
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
