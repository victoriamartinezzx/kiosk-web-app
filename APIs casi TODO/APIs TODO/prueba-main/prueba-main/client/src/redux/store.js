import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";
import productsReducer from "./productsSlice";
import contentReducer from "./contentSlice";
import ordersReducer from "./ordersSlice";
import usersReducer from "./usersSlice";
import categoriesReducer from "./categoriesSlice";

const createUserCartStorage = {
  async getItem(key) {
    try {
      const allCartsJson = await storage.getItem('userCarts');
      if (!allCartsJson) return null;
      
      const allCarts = JSON.parse(allCartsJson);
      const authJson = await storage.getItem('persist:root');
      
      if (!authJson) return null;
      
      const persistedData = JSON.parse(authJson);
      const auth = persistedData.auth ? JSON.parse(persistedData.auth) : null;
      const userId = auth?.user?.id;
      
      if (!userId) return null;
      

      const userCart = allCarts[userId];
      if (!userCart) return null;
      
      const FORTY_EIGHT_HOURS = 48 * 60 * 60 * 1000;
      const now = Date.now();
      if (userCart._timestamp && (now - userCart._timestamp) > FORTY_EIGHT_HOURS) {
        return null; 
      }
      
      return JSON.stringify(userCart);
    } catch {
      return null;
    }
  },
  
  async setItem(key, value) {
    try {
      const authJson = await storage.getItem('persist:root');
      if (!authJson) return;
      
      const persistedData = JSON.parse(authJson);
      const auth = persistedData.auth ? JSON.parse(persistedData.auth) : null;
      const userId = auth?.user?.id;
      
      if (!userId) return;
      
      const allCartsJson = await storage.getItem('userCarts') || '{}';
      const allCarts = JSON.parse(allCartsJson);
      
      const cartData = JSON.parse(value);
      allCarts[userId] = {
        ...cartData,
        _userId: userId,
        _timestamp: Date.now()
      };
      
      await storage.setItem('userCarts', JSON.stringify(allCarts));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  },
  
  async removeItem(key) {
    try {
      const authJson = await storage.getItem('persist:root');
      if (!authJson) return;
      
      const persistedData = JSON.parse(authJson);
      const auth = persistedData.auth ? JSON.parse(persistedData.auth) : null;
      const userId = auth?.user?.id;
      
      if (!userId) return;
      
      const allCartsJson = await storage.getItem('userCarts') || '{}';
      const allCarts = JSON.parse(allCartsJson);
      delete allCarts[userId];
      await storage.setItem('userCarts', JSON.stringify(allCarts));
    } catch (error) {
      console.error('Error removing cart:', error);
    }
  }
};

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const cartPersistConfig = {
  key: "cart",
  storage: createUserCartStorage,
  whitelist: ["items", "subtotal", "_userId", "_timestamp"],
};

const rootReducer = combineReducers({
  cart: persistReducer(cartPersistConfig, cartReducer), 
  auth: authReducer,
  products: productsReducer,
  content: contentReducer,
  orders: ordersReducer,
  users: usersReducer,
  categories: categoriesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
export { store };