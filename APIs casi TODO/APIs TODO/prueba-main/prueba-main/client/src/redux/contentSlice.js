import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API_BASE } from "../lib/api";

export const fetchBanners = createAsyncThunk(
  "content/fetchBanners",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/content/banners`);
      if (!response.ok) throw new Error("Error al cargar banners");
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPromos = createAsyncThunk(
  "content/fetchPromos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/content/promos`);
      if (!response.ok) throw new Error("Error al cargar promos");
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWelcomeText = createAsyncThunk(
  "content/fetchWelcomeText",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await fetch(`${API_BASE}/api/content/welcome-texts`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!response.ok) throw new Error("Error al cargar texto de bienvenida");
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBrands = createAsyncThunk(
  "content/fetchBrands",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/content/brands`);
      if (!response.ok) throw new Error("Error al cargar marcas");
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPaymentMethods = createAsyncThunk(
  "content/fetchPaymentMethods",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/content/payment-methods`);
      if (!response.ok) throw new Error("Error al cargar métodos de pago");
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchShippingMethods = createAsyncThunk(
  "content/fetchShippingMethods",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/content/shipping-methods`);
      if (!response.ok) throw new Error("Error al cargar métodos de envío");
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchContactInfo = createAsyncThunk(
  "content/fetchContactInfo",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await fetch(`${API_BASE}/contact/info`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!response.ok) throw new Error("Error al cargar información de contacto");
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendContactMessage = createAsyncThunk(
  "content/sendContactMessage",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/contact/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error(`Error ${response.status}`);
      return { success: true };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchContactMessages = createAsyncThunk(
  "content/fetchContactMessages",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await fetch(`${API_BASE}/contact/all`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateContactInfo = createAsyncThunk(
  "content/updateContactInfo",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await fetch(`${API_BASE}/contact/info`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createBanner = createAsyncThunk(
  "content/createBanner",
  async ({ bannerData, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/content/banners`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bannerData),
      });
      if (!response.ok) throw new Error("Error al crear banner");

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else {

        const text = await response.text();
        try {
          return JSON.parse(text);
        } catch {
  
          return { ...bannerData, id: Date.now(), active: true };
        }
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBanner = createAsyncThunk(
  "content/updateBanner",
  async ({ id, bannerData, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/content/banners/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bannerData),
      });
      if (!response.ok) throw new Error("Error al actualizar banner");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteBanner = createAsyncThunk(
  "content/deleteBanner",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/content/banners/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al eliminar banner");
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadBannerImage = createAsyncThunk(
  "content/uploadBannerImage",
  async ({ id, file, token }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`${API_BASE}/api/content/banners/${id}/upload-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) throw new Error("Error al subir imagen");
      
    
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else {
        
        const text = await response.text();
        return { id, message: text };
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPromo = createAsyncThunk(
  "content/createPromo",
  async ({ promoData, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/content/promos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(promoData),
      });
      if (!response.ok) throw new Error("Error al crear promo");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePromo = createAsyncThunk(
  "content/updatePromo",
  async ({ id, promoData, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/content/promos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(promoData),
      });
      if (!response.ok) throw new Error("Error al actualizar promo");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePromo = createAsyncThunk(
  "content/deletePromo",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/content/promos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al eliminar promo");
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createWelcomeText = createAsyncThunk(
  "content/createWelcomeText",
  async ({ textData, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/content/welcome-texts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(textData),
      });
      if (!response.ok) throw new Error("Error al crear texto");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateWelcomeText = createAsyncThunk(
  "content/updateWelcomeText",
  async ({ id, textData, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/content/welcome-texts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(textData),
      });
      if (!response.ok) throw new Error("Error al actualizar texto");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteWelcomeText = createAsyncThunk(
  "content/deleteWelcomeText",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/content/welcome-texts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al eliminar texto");
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createBrand = createAsyncThunk(
  "content/createBrand",
  async ({ brandData, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/content/brands`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(brandData),
      });
      if (!response.ok) throw new Error("Error al crear marca");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteBrand = createAsyncThunk(
  "content/deleteBrand",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/content/brands/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al eliminar marca");
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBrand = createAsyncThunk(
  "content/updateBrand",
  async ({ id, brandData, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/content/brands/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(brandData),
      });
      if (!response.ok) throw new Error("Error al actualizar marca");
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadBrandImage = createAsyncThunk(
  "content/uploadBrandImage",
  async ({ id, file, token }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`${API_BASE}/api/content/brands/${id}/upload-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al subir imagen de marca");
      }
      

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPaymentMethod = createAsyncThunk(
  "content/createPaymentMethod",
  async ({ methodData, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/content/payment-methods`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(methodData),
      });
      if (!response.ok) throw new Error("Error al crear método de pago");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePaymentMethod = createAsyncThunk(
  "content/deletePaymentMethod",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/content/payment-methods/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al eliminar método de pago");
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePaymentMethod = createAsyncThunk(
  "content/updatePaymentMethod",
  async ({ id, methodData, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/content/payment-methods/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(methodData),
      });
      if (!response.ok) throw new Error("Error al actualizar método de pago");
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadPaymentMethodImage = createAsyncThunk(
  "content/uploadPaymentMethodImage",
  async ({ id, file, token }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`${API_BASE}/api/content/payment-methods/${id}/upload-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al subir imagen");
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createShippingMethod = createAsyncThunk(
  "content/createShippingMethod",
  async ({ methodData, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/content/shipping-methods`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(methodData),
      });
      if (!response.ok) throw new Error("Error al crear método de envío");
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteShippingMethod = createAsyncThunk(
  "content/deleteShippingMethod",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/content/shipping-methods/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al eliminar método de envío");
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateShippingMethod = createAsyncThunk(
  "content/updateShippingMethod",
  async ({ id, methodData, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE}/api/content/shipping-methods/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(methodData),
      });
      if (!response.ok) throw new Error("Error al actualizar método de envío");
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const uploadShippingMethodImage = createAsyncThunk(
  "content/uploadShippingMethodImage",
  async ({ id, file, token }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`${API_BASE}/api/content/shipping-methods/${id}/upload-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al subir imagen");
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const contentSlice = createSlice({
  name: "content",
  initialState: {
    banners: [],
    promos: [],
    welcomeText: [],
    brands: [],
    paymentMethods: [],
    shippingMethods: [],
    contactInfo: null,
    contactMessages: [],
    messageSent: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearContentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPromos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPromos.fulfilled, (state, action) => {
        state.loading = false;
        state.promos = action.payload;
      })
      .addCase(fetchPromos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchWelcomeText.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWelcomeText.fulfilled, (state, action) => {
        state.loading = false;
        state.welcomeText = action.payload;
      })
      .addCase(fetchWelcomeText.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentMethods = action.payload;
      })
      .addCase(fetchPaymentMethods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
   
      .addCase(fetchShippingMethods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShippingMethods.fulfilled, (state, action) => {
        state.loading = false;
        state.shippingMethods = action.payload;
      })
      .addCase(fetchShippingMethods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
   
      .addCase(fetchContactInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.contactInfo = action.payload;
      })
      .addCase(fetchContactInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    
      .addCase(sendContactMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.messageSent = false;
      })
      .addCase(sendContactMessage.fulfilled, (state) => {
        state.loading = false;
        state.messageSent = true;
      })
      .addCase(sendContactMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.messageSent = false;
      })
      .addCase(createBanner.fulfilled, (state, action) => {
        state.banners.push(action.payload);
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        const idx = state.banners.findIndex(b => b.id === action.payload.id);
        if (idx !== -1) state.banners[idx] = action.payload;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.banners = state.banners.filter(b => b.id !== action.payload);
      })
      .addCase(uploadBannerImage.fulfilled, (state, action) => {
        const idx = state.banners.findIndex(b => b.id === action.payload.id);
        if (idx !== -1) state.banners[idx] = action.payload;
      })
      .addCase(createPromo.fulfilled, (state, action) => {
        state.promos.push(action.payload);
      })
      .addCase(updatePromo.fulfilled, (state, action) => {
        const idx = state.promos.findIndex(p => p.id === action.payload.id);
        if (idx !== -1) state.promos[idx] = action.payload;
      })
      .addCase(deletePromo.fulfilled, (state, action) => {
        state.promos = state.promos.filter(p => p.id !== action.payload);
      })
      .addCase(createWelcomeText.fulfilled, (state, action) => {
        if (!Array.isArray(state.welcomeText)) state.welcomeText = [];
        state.welcomeText.push(action.payload);
      })
      .addCase(updateWelcomeText.fulfilled, (state, action) => {
        const idx = state.welcomeText.findIndex(w => w.id === action.payload.id);
        if (idx !== -1) state.welcomeText[idx] = action.payload;
      })
      .addCase(deleteWelcomeText.fulfilled, (state, action) => {
        state.welcomeText = state.welcomeText.filter(w => w.id !== action.payload);
      })
      .addCase(createBrand.fulfilled, (state, action) => {
        state.brands.push(action.payload);
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.brands = state.brands.filter(b => b.id !== action.payload);
      })
      .addCase(updateBrand.fulfilled, (state, action) => {
        const idx = state.brands.findIndex(b => b.id === action.payload.id);
        if (idx !== -1) state.brands[idx] = action.payload;
      })
      .addCase(uploadBrandImage.fulfilled, (state, action) => {
        const idx = state.brands.findIndex(b => b.id === action.payload.id);
        if (idx !== -1) state.brands[idx] = action.payload;
      })
      .addCase(createPaymentMethod.fulfilled, (state, action) => {
        state.paymentMethods.push(action.payload);
      })
      .addCase(deletePaymentMethod.fulfilled, (state, action) => {
        state.paymentMethods = state.paymentMethods.filter(p => p.id !== action.payload);
      })
      .addCase(updatePaymentMethod.fulfilled, (state, action) => {
        const idx = state.paymentMethods.findIndex(p => p.id === action.payload.id);
        if (idx !== -1) state.paymentMethods[idx] = action.payload;
      })
      .addCase(uploadPaymentMethodImage.fulfilled, (state, action) => {
        const idx = state.paymentMethods.findIndex(p => p.id === action.payload.id);
        if (idx !== -1) state.paymentMethods[idx] = action.payload;
      })
      .addCase(createShippingMethod.fulfilled, (state, action) => {
        state.shippingMethods.push(action.payload);
      })
      .addCase(deleteShippingMethod.fulfilled, (state, action) => {
        state.shippingMethods = state.shippingMethods.filter(s => s.id !== action.payload);
      })
      .addCase(updateShippingMethod.fulfilled, (state, action) => {
        const idx = state.shippingMethods.findIndex(s => s.id === action.payload.id);
        if (idx !== -1) state.shippingMethods[idx] = action.payload;
      })
      .addCase(uploadShippingMethodImage.fulfilled, (state, action) => {
        const idx = state.shippingMethods.findIndex(s => s.id === action.payload.id);
        if (idx !== -1) state.shippingMethods[idx] = action.payload;
      })
  
      .addCase(fetchContactMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.contactMessages = action.payload;
      })
      .addCase(fetchContactMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateContactInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContactInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.contactInfo = action.payload;
      })
      .addCase(updateContactInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearContentError } = contentSlice.actions;
export default contentSlice.reducer;
