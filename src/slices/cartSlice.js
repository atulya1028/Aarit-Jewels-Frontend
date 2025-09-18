import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import toast from 'react-hot-toast'

const initialState = {
  items: [],
  isLoading: false,
}

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('/api/cart', { headers: { Authorization: `Bearer ${token}` } })
    return res.data.items || []
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message)
  }
})

export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, quantity }, thunkAPI) => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.post('/api/cart', { productId, quantity }, { headers: { Authorization: `Bearer ${token}` } })
    toast.success('Added to cart')
    return res.data.items
  } catch (err) {
    toast.error(err.response.data.message)
    return thunkAPI.rejectWithValue(err.response.data.message)
  }
})

export const updateCart = createAsyncThunk('cart/updateCart', async ({ productId, quantity }, thunkAPI) => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.put('/api/cart', { productId, quantity }, { headers: { Authorization: `Bearer ${token}` } })
    toast.success('Cart updated')
    return res.data.items
  } catch (err) {
    toast.error(err.response.data.message)
    return thunkAPI.rejectWithValue(err.response.data.message)
  }
})

export const clearCart = createAsyncThunk('cart/clearCart', async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem('token')
    await axios.delete('/api/cart', { headers: { Authorization: `Bearer ${token}` } })
    toast.success('Cart cleared')
    return []
  } catch (err) {
    toast.error(err.response.data.message)
    return thunkAPI.rejectWithValue(err.response.data.message)
  }
})

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => { state.items = action.payload })
      .addCase(addToCart.fulfilled, (state, action) => { state.items = action.payload })
      .addCase(updateCart.fulfilled, (state, action) => { state.items = action.payload })
      .addCase(clearCart.fulfilled, (state, action) => { state.items = action.payload })
  },
})

export default cartSlice.reducer