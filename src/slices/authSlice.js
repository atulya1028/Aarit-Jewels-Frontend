import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'https://aarit-jewels-backend.vercel.app';

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// ✅ Register
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, userData, {
        headers: { 'Content-Type': 'application/json' },
      });

      // ⚠️ Only store token if your backend returns one
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }

      return res.data.user;
    } catch (err) {
      const message =
        err.response?.data?.message || 'Registration failed. Please try again.';
      return rejectWithValue(message);
    }
  }
);

// ✅ Login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, userData, {
        headers: { 'Content-Type': 'application/json' },
      });

      localStorage.setItem('token', res.data.token);
      return res.data.user;
    } catch (err) {
      const message =
        err.response?.data?.message || 'Login failed. Please try again.';
      return rejectWithValue(message);
    }
  }
);

// ✅ Current user
export const getCurrentUser = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) return rejectWithValue('No token found');

    try {
      const res = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.user;
    } catch (err) {
      localStorage.removeItem('token');
      const message = err.response?.data?.message || 'Failed to fetch user';
      return rejectWithValue(message);
    }
  }
);

// ✅ Change password
export const changePassword = createAsyncThunk(
  'auth/change-password',
  async (passwordData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found. Please log in.');

      const res = await axios.put(`${API_URL}/api/auth/change-password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || 'Failed to change password';
      return rejectWithValue(message);
    }
  }
);

// ✅ Forgot password
export const forgotPassword = createAsyncThunk(
  'auth/forgot-password',
  async (email, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/forgot-password`, { email }, {
        headers: { 'Content-Type': 'application/json' },
      });
      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to send reset email';
      return rejectWithValue(message);
    }
  }
);

// ✅ Reset password
export const resetPassword = createAsyncThunk(
  'auth/reset-password',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/api/auth/reset-password/${token}`, { password }, {
        headers: { 'Content-Type': 'application/json' },
      });
      return res.data;
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to reset password';
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      toast.success('Logged out successfully');
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        toast.success('Registered successfully');
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        toast.success('Logged in successfully');
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
      })

      // Change Password
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        toast.success('Password changed successfully');
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Forgot Password
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        toast.success('Reset email sent successfully');
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Reset Password
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        toast.success('Password reset successfully');
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
