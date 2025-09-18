// src/pages/ContactUs.jsx
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || '';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.name.trim()) return 'Please enter your name';
    if (!form.email.trim()) return 'Please enter your email';
    // simple email regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(form.email)) return 'Please enter a valid email';
    if (!form.message.trim()) return 'Please enter a message';
    return null;
  };

  const openMailClient = () => {
    const subject = encodeURIComponent(`Contact from website — ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
    window.location.href = `mailto:aaritjewels@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);

    setLoading(true);
    try {
      // POST to backend contact endpoint
      const res = await axios.post(
        `${API_URL}/api/contact`,
        { ...form },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (res?.data?.success) {
        toast.success('Message sent! We will get back to you soon.');
        setForm({ name: '', email: '', message: '' });
      } else {
        // fallback to mailto if backend responds but doesn't confirm
        toast('Backend did not confirm sending — opening mail client...', { icon: '✉️' });
        openMailClient();
      }
    } catch (error) {
      // If backend unavailable or fails, fallback to mailto but inform user
      console.error('Contact submit error:', error);
      toast.error('Failed to send via server — opening your email client as a fallback.');
      openMailClient();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-serif font-bold text-indigo-800 mb-4">Contact Us</h1>
      <p className="text-gray-700 mb-6">
        Have questions or need assistance? Reach out — we’ll respond as soon as possible.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-2xl shadow-md border border-indigo-50">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your full name"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            name="message"
            rows="6"
            value={form.message}
            onChange={handleChange}
            placeholder="How can we help?"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            required
          />
        </div>

        <div className="flex gap-3 items-center mx-auto">
          <button
            type="button"
            onClick={openMailClient}
            className="border border-indigo-200 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-50 transition"
          >
            Send Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactUs;
