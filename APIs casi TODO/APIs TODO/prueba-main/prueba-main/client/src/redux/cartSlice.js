import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE } from "../lib/api";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {

      return [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ product, qty, token }, { rejectWithValue, getState }) => {
    try {

      if (!token) {
        throw new Error("Debes iniciar sesión para agregar productos al carrito");
      }

      const stockResponse = await fetch(`${API_BASE}/cart/reservation/available-stock/${product.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!stockResponse.ok) {
        throw new Error("Error al verificar stock");
      }
      
      const stockData = await stockResponse.json();
      const currentCartItem = getState().cart.items.find((p) => p.id === product.id);
      const currentQty = currentCartItem ? currentCartItem.qty : 0;
      const totalRequested = currentQty + qty;
      
      if (totalRequested > stockData.availableStock) {
        throw new Error(`No hay suficiente stock disponible. Stock actual: ${stockData.availableStock} unidades`);
      }
      
      const reserveResponse = await fetch(`${API_BASE}/cart/reservation/reserve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: qty,
        }),
      });
      
      if (!reserveResponse.ok) {
        const errorData = await reserveResponse.json();
        throw new Error(errorData.message || "Error al reservar stock");
      }
      
      const imageUrl = product.image && (String(product.image).startsWith("http") || String(product.image).startsWith("/"))
        ? product.image
        : `${API_BASE}/products/${product.id}/image`;
      

      const userId = getState().auth.user?.id || null;
      const now = Date.now();
      
      return {
        product: {
          id: product.id,
          title: product.title || product.name,
          price: product.price,
          image: imageUrl,
        },
        qty,
        userId,
        timestamp: now
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const incrementQty = createAsyncThunk(
  "cart/incrementQty",
  async ({ id, token }, { rejectWithValue, getState }) => {
    try {
      if (!token) {
        throw new Error("Debes iniciar sesión");
      }

      const item = getState().cart.items.find((it) => it.id === id);
      if (!item) throw new Error("Producto no encontrado");
      
      const response = await fetch(`${API_BASE}/cart/reservation/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: id,
          newQuantity: item.qty + 1,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "No hay suficiente stock disponible");
      }
      
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const decrementQty = createAsyncThunk(
  "cart/decrementQty",
  async ({ id, token }, { rejectWithValue, getState }) => {
    try {
      if (!token) {
        throw new Error("Debes iniciar sesión");
      }

      const item = getState().cart.items.find((it) => it.id === id);
      if (!item || item.qty <= 1) return null;
      
      const response = await fetch(`${API_BASE}/cart/reservation/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: id,
          newQuantity: item.qty - 1,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Error al actualizar reserva");
      }
      
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      if (!token) {
        throw new Error("Debes iniciar sesión");
      }

      const response = await fetch(`${API_BASE}/cart/reservation/release/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        console.warn("Error al liberar reserva del backend");
      }
      
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (token, { rejectWithValue }) => {
    try {
      if (token) {
        const response = await fetch(`${API_BASE}/cart/reservation/release-all`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!response.ok) {
          console.warn("Error al liberar reservas del backend");
        }
      }
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    subtotal: 0,
    loading: false,
    error: null,
    _userId: null, 
    _timestamp: null, 
  },
  reducers: {
    setCartOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    calculateSubtotal: (state) => {
      state.subtotal = state.items.reduce((sum, item) => {
        const price = item.price || item.finalPrice || 0;
        return sum + (price * item.qty);
      }, 0);
    },
  
    loadUserCart: (state, action) => {
      const userId = action.payload;
      if (userId) {
        state._userId = userId;

      }
    },
  },
  extraReducers: (builder) => {
    builder
 
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
     
        state.subtotal = state.items.reduce((sum, item) => {
          const price = item.price || item.finalPrice || 0;
          return sum + (price * item.qty);
        }, 0);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        const { product, qty, userId, timestamp } = action.payload;
        const existingIndex = state.items.findIndex((p) => p.id === product.id);
        
      
        if (userId) {
          state._userId = userId;
        }
        if (timestamp) {
          state._timestamp = timestamp;
        }
        
        if (existingIndex >= 0) {
          state.items[existingIndex].qty += qty;
        } else {
          state.items.push({ ...product, qty });
        }
        

        state.subtotal = state.items.reduce((sum, item) => {
          const price = item.price || item.finalPrice || 0;
          return sum + (price * item.qty);
        }, 0);
        
      
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  
      .addCase(incrementQty.fulfilled, (state, action) => {
        const item = state.items.find((it) => it.id === action.payload);
        if (item) {
          item.qty += 1;
     
          state.subtotal = state.items.reduce((sum, item) => {
            const price = item.price || item.finalPrice || 0;
            return sum + (price * item.qty);
          }, 0);
        
        }
      })
      .addCase(incrementQty.rejected, (state, action) => {
        state.error = action.payload;
      })
  
      .addCase(decrementQty.fulfilled, (state, action) => {
        if (action.payload) {
          const item = state.items.find((it) => it.id === action.payload);
          if (item && item.qty > 1) {
            item.qty -= 1;
      
            state.subtotal = state.items.reduce((sum, item) => {
              const price = item.price || item.finalPrice || 0;
              return sum + (price * item.qty);
            }, 0);
         
          }
        }
      })
      .addCase(decrementQty.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((it) => it.id !== action.payload);
    
        state.subtotal = state.items.reduce((sum, item) => {
          const price = item.price || item.finalPrice || 0;
          return sum + (price * item.qty);
        }, 0);

      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload;
      })
    
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.subtotal = 0;
   
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setCartOpen, calculateSubtotal, loadUserCart } = cartSlice.actions;
export default cartSlice.reducer;
