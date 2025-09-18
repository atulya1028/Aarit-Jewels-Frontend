import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../slices/authSlice';

const Header = () => {
  const { user, isLoading } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleProfile = () => setIsProfileOpen((prev) => !prev);

  // Handle search
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <nav className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-serif font-bold tracking-wide text-indigo-900"
        >
          Aarit <span className="text-indigo-500">Jewels</span>
        </Link>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 mx-10 max-w-xl relative"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search jewelry..."
            className="w-full border border-gray-300 rounded-full py-2 px-5 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
          >
            🔍
          </button>
        </form>

        {/* Navigation + Profile */}
        <div className="flex items-center space-x-6">
          <ul className="flex space-x-6 text-gray-800 font-medium">
            <li>
              <Link to="/products" className="hover:text-indigo-600 transition">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-indigo-600 transition">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/locate-us" className="hover:text-indigo-600 transition">
                Locate Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-indigo-600 transition">
                Contact Us
              </Link>
            </li>
            {user && (
              <li>
                <Link
                  to="/cart"
                  className="relative hover:text-indigo-600 transition"
                >
                  Cart
                  {items.length > 0 && (
                    <span className="absolute -top-2 -right-4 bg-indigo-500 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow">
                      {items.length}
                    </span>
                  )}
                </Link>
              </li>
            )}
            {user?.role === 'admin' && (
              <li>
                <Link to="/admin" className="hover:text-indigo-600 transition">
                  Admin
                </Link>
              </li>
            )}
          </ul>

          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={toggleProfile}
              className="flex items-center space-x-2 px-3 py-2 rounded-full border hover:border-indigo-400 transition"
              aria-label="Profile menu"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {isLoading ? (
                <span className="text-gray-400 animate-pulse">Loading...</span>
              ) : (
                user && <span className="text-gray-700">{user.name}</span>
              )}
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white border rounded-lg shadow-lg p-5 z-20">
                {user ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Hello, {user.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Manage your account & orders
                    </p>
                    <div className="space-y-2">
                      <Link
                        to="/orders"
                        className="block w-full text-center bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Orders
                      </Link>
                      <Link
                        to="/change-password"
                        className="block w-full text-center border py-2 rounded hover:bg-indigo-50 transition"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Change Password
                      </Link>
                      <button
                        onClick={() => {
                          dispatch(logout());
                          setIsProfileOpen(false);
                        }}
                        className="block w-full text-center border py-2 rounded text-red-600 hover:bg-red-50 transition"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Your Account
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Access account & manage your orders
                    </p>
                    <div className="flex justify-between space-x-3">
                      <Link
                        to="/register"
                        className="flex-1 bg-indigo-500 text-white text-center py-2 rounded hover:bg-indigo-600 transition"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Sign Up
                      </Link>
                      <Link
                        to="/login"
                        className="flex-1 border text-center py-2 rounded hover:bg-indigo-50 transition"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Log In
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
