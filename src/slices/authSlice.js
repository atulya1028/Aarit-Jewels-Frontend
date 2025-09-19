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

export const registerUser = createAsyncThunk('auth/registerUser', async (userData, { rejectWithValue }) => {
  try {
    console.log('registerUser: Sending request with data:', userData); // Debug log
    const res = await axios.post(`${API_URL}/api/auth/register`, userData, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('registerUser: Response:', res.data); // Debug log
    localStorage.setItem('token', res.data.token);
    console.log('registerUser: Token stored in localStorage:', res.data.token); // Debug log
    return res.data.user;
  } catch (err) {
    const message = err.response?.data?.message || 'Registration failed. Please try again.';
    console.error('registerUser: Error:', err.response?.data || err); // Debug log
    return rejectWithValue(message);
  }
});

export const loginUser = createAsyncThunk('auth/loginUser', async (userData, { rejectWithValue }) => {
  try {
    console.log('loginUser: Sending request with data:', userData); // Debug log
    const res = await axios.post(`${API_URL}/api/auth/login`, userData, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('loginUser: Response:', res.data); // Debug log
    localStorage.setItem('token', res.data.token);
    console.log('loginUser: Token stored in localStorage:', res.data.token); // Debug log
    return res.data.user;
  } catch (err) {
    const message = err.response?.data?.message || 'Login failed. Please try again.';
    console.error('loginUser: Error:', err.response?.data || err); // Debug log
    return rejectWithValue(message);
  }
});

export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async (_, { rejectWithValue }) => {
  const token = localStorage.getItem('token');
  console.log('getCurrentUser: Retrieved token from localStorage:', token); // Debug log
  if (!token) {
    console.log('getCurrentUser: No token found in localStorage'); // Debug log
    return rejectWithValue('No token found');
  }
  try {
    console.log('getCurrentUser: Sending request to /api/auth/me with token'); // Debug log
    const res = await axios.get(`${API_URL}/api/auth/me`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('getCurrentUser: Response:', res.data); // Debug log
    return res.data.user;
  } catch (err) {
    console.error('getCurrentUser: Error:', err.response?.data || err); // Debug log
    localStorage.removeItem('token');
    console.log('getCurrentUser: Token removed from localStorage due to error'); // Debug log
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch user');
  }
});

export const changePassword = createAsyncThunk('auth/changePassword', async (passwordData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    console.log('changePassword: Retrieved token:', token); // Debug log
    if (!token) throw new Error('No token found. Please log in.');
    const res = await axios.put(`${API_URL}/api/auth/change-password`, passwordData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('changePassword: Response:', res.data); // Debug log
    return res.data;
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Failed to change password';
    console.error('changePassword: Error:', err.response?.data || err); // Debug log
    return rejectWithValue(message);
  }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    console.log('forgotPassword: Sending request for email:', email); // Debug log
    const res = await axios.post(`${API_URL}/api/auth/forgot-password`, { email }, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('forgotPassword: Response:', res.data); // Debug log
    return res.data;
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to send reset email';
    console.error('forgotPassword: Error:', err.response?.data || err); // Debug log
    return rejectWithValue(message);
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ token, password }, { rejectWithValue }) => {
  try {
    console.log('resetPassword: Sending request with token:', token); // Debug log
    const res = await axios.put(`${API_URL}/api/auth/reset-password/${token}`, { password }, {
      headers: { 'Content-Type': 'application/json' },
    });
    console.log('resetPassword: Response:', res.data); // Debug log
    return res.data;
  } catch (err) {
    const message = err.response?.data?.message || 'Failed to reset password';
    console.error('resetPassword: Error:', err.response?.data || err); // Debug log
    return rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
      console.log('logout: Token removed from localStorage'); // Debug log
      toast.success('Logged out successfully');
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      console.log('setUser: User set:', action.payload); // Debug log
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        console.log('registerUser: Pending'); // Debug log
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        console.log('registerUser: Fulfilled, user:', action.payload); // Debug log
        toast.success('Registered successfully');
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.log('registerUser: Rejected, error:', action.payload); // Debug log
        toast.error(action.payload);
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        console.log('loginUser: Pending'); // Debug log
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        console.log('loginUser: Fulfilled, user:', action.payload); // Debug log
        toast.success('Logged in successfully');
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.log('loginUser: Rejected, error:', action.payload); // Debug log
        toast.error(action.payload);
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        console.log('getCurrentUser: Pending'); // Debug log
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        console.log('getCurrentUser: Fulfilled, user:', action.payload); // Debug log
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
        console.log('getCurrentUser: Rejected, error:', action.payload); // Debug log
      })
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        console.log('changePassword: Pending'); // Debug log
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        console.log('changePassword: Fulfilled'); // Debug log
        toast.success('Password changed successfully');
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.log('changePassword: Rejected, error:', action.payload); // Debug log
        toast.error(action.payload);
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        console.log('forgotPassword: Pending'); // Debug log
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        console.log('forgotPassword: Fulfilled'); // Debug log
        toast.success('Reset email sent successfully');
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.log('forgotPassword: Rejected, error:', action.payload); // Debug log
        toast.error(action.payload);
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        console.log('resetPassword: Pending'); // Debug log
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        console.log('resetPassword: Fulfilled'); // Debug log
        toast.success('Password reset successfully');
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.log('resetPassword: Rejected, error:', action.payload); // Debug log
        toast.error(action.payload);
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;