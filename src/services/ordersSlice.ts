import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '../utils/types';
import { getFeedsApi, getOrdersApi } from '../utils/burger-api';

type TOrdersState = {
  orders: TOrder[];
  userOrders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  userOrdersLoading: boolean;
  error: string | null;
  userOrdersError: string | null;
};

const initialState: TOrdersState = {
  orders: [],
  userOrders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  userOrdersLoading: false,
  error: null,
  userOrdersError: null
};

export const fetchFeeds = createAsyncThunk('orders/fetchFeeds', async () => {
  const response = await getFeedsApi();
  return response;
});

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUserOrdersError: (state) => {
      state.userOrdersError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.error = null;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.userOrdersLoading = true;
        state.userOrdersError = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrdersLoading = false;
        state.userOrders = action.payload;
        state.userOrdersError = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.userOrdersLoading = false;
        state.userOrdersError =
          action.error.message || 'Failed to fetch user orders';
      });
  },
  selectors: {
    getOrders: (state) => state.orders,
    getUserOrders: (state) => state.userOrders,
    getFeedStats: (state) => ({
      total: state.total,
      totalToday: state.totalToday
    }),
    getOrdersLoading: (state) => state.loading,
    getUserOrdersLoading: (state) => state.userOrdersLoading,
    getOrdersError: (state) => state.error,
    getUserOrdersError: (state) => state.userOrdersError
  }
});

export const { clearError, clearUserOrdersError } = ordersSlice.actions;

export const {
  getOrders,
  getUserOrders,
  getFeedStats,
  getOrdersLoading,
  getUserOrdersLoading,
  getOrdersError,
  getUserOrdersError
} = ordersSlice.selectors;

export default ordersSlice.reducer;
