import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE } from "../lib/api";

export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      if (!token) throw new Error("No hay token de autenticación");
      
      const response = await fetch(`${API_BASE}/orders/user/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Error al obtener órdenes");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("No hay token de autenticación");

      const response = await fetch(`${API_BASE}/orders`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Error al obtener órdenes");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async ({ orderData, token }, { rejectWithValue }) => {
    try {
      if (!token) throw new Error("No hay token de autenticación");

      const response = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Error al crear orden");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createOrderDetail = createAsyncThunk(
  "orders/createOrderDetail",
  async ({ detailData, token }, { rejectWithValue }) => {
    try {
      if (!token) throw new Error("No hay token de autenticación");

      const response = await fetch(`${API_BASE}/order-details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(detailData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Error al crear detalle de orden");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPayment = createAsyncThunk(
  "orders/createPayment",
  async ({ paymentData, token }, { rejectWithValue }) => {
    try {
      if (!token) throw new Error("No hay token de autenticación");

      const response = await fetch(`${API_BASE}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Error al crear pago");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrderState = createAsyncThunk(
  "orders/updateOrderState",
  async ({ orderId, newState, token }, { rejectWithValue }) => {
    try {
      if (!token) throw new Error("No hay token de autenticación");

      const response = await fetch(
        `${API_BASE}/orders/${orderId}/state?state=${newState}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Error al actualizar estado");
      }

      const data = await response.json();
      return { orderId, newState, data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    userOrders: [],
    allOrders: [],
    currentOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearOrdersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderState.fulfilled, (state, action) => {
        const { orderId, newState } = action.payload;
        const order = state.allOrders.find((o) => o.id === orderId);
        if (order) {
          order.state = newState;
        }
      });
  },
});

export const { clearCurrentOrder, clearOrdersError } = ordersSlice.actions;
export default ordersSlice.reducer;
