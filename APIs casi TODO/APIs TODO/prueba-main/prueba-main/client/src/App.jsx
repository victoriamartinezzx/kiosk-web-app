import { useMemo, useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import "./App.css";

import PromoBar from "./components/PromoBar";
import Header from "./components/Header";
import Navigation from "./views/Navigation";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";

import Home from "./views/Home";
import Products from "./views/Products";
import ProductDetail from "./views/ProductDetail";
import Cart from "./views/Cart";
import Checkout from "./views/Checkout";
import Auth from "./views/Auth";
import AdminProducts from "./views/AdminProducts";
import AdminCategories from "./views/AdminCategories";
import AdminUsers from "./views/AdminUsers";
import AdminContent from "./views/AdminContent";
import UserHome from "./views/UserHome";
import Contact from "./views/Contact";
import AdminContact from "./views/AdminContact";
import AdminContactMessages from "./views/AdminContactMessages";
import MyOrders from "./views/MyOrders";
import AdminOrders from "./views/AdminOrders";

import { fetchCart, addToCart, incrementQty, decrementQty, removeFromCart, clearCart, loadUserCart } from "./redux/cartSlice";
import { fetchProducts, setSelectedCategory, setSearchQuery } from "./redux/productsSlice";
import { fetchCategories } from "./redux/categoriesSlice";
import { fetchAllUsers } from "./redux/usersSlice";
import { fetchAllOrders } from "./redux/ordersSlice";
import { 
  fetchBanners, 
  fetchPromos, 
  fetchWelcomeText, 
  fetchBrands, 
  fetchPaymentMethods, 
  fetchShippingMethods,
  fetchContactInfo 
} from "./redux/contentSlice";

import { API_BASE } from "./lib/api";

function getUserRole(token) {
  try {
    if (!token) return null;
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;
    const decodedPayload = JSON.parse(atob(payloadBase64));
    return decodedPayload.userType || decodedPayload.role;
  } catch {
    return null;
  }
}
function ClientOnlyRoute({ children }) {
  const { token } = useSelector((state) => state.auth);
  const userRole = getUserRole(token);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (userRole === "ADMIN") {
      toast.error("⛔ Los administradores no tienen acceso al carrito", {
        position: "top-center",
        autoClose: 3000,
        toastId: "admin-no-cart"
      });
      navigate("/", { replace: true });
    }
  }, [userRole, navigate]);
  
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  
  if (userRole === "ADMIN") {
    return null;
  }
  
  return children;
}

function App() {
  const dispatch = useDispatch();
  const { items: cartItems, subtotal, loading: cartLoading } = useSelector((state) => state.cart);
  const { items: products, selectedCategory, searchQuery } = useSelector((state) => state.products);
  const { items: categories } = useSelector((state) => state.categories);
  const { token, isAuthenticated, user } = useSelector((state) => state.auth);

  const [isCartOpen, setCartOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = location.pathname === "/auth";


  useEffect(() => {

    dispatch(fetchCart());
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    

    dispatch(fetchAllUsers());
    dispatch(fetchAllOrders());

    dispatch(fetchBanners());
    dispatch(fetchPromos());
    dispatch(fetchWelcomeText());
    dispatch(fetchBrands());
    dispatch(fetchPaymentMethods());
    dispatch(fetchShippingMethods());
    dispatch(fetchContactInfo());
  }, [dispatch]); 

  useEffect(() => {
    const userId = user?.id || null;
    if (userId) {
      dispatch(loadUserCart(userId));
    }
  }, [user?.id, dispatch]);

  const totalQty = useMemo(() => cartItems.reduce((a, it) => a + it.qty, 0), [cartItems]);

  const inc = (id) => {
    dispatch(incrementQty({ id, token }))
      .unwrap()
      .catch((error) => {
        toast.error(error || "Error al actualizar la cantidad", {
          position: "top-center",
          autoClose: 3000,
        });
      });
  };

  const dec = (id) => {
    dispatch(decrementQty({ id, token }))
      .unwrap()
      .catch((error) => {
        console.error("Error al decrementar cantidad:", error);
      });
  };

  const remove = (id) => {
    dispatch(removeFromCart({ id, token }))
      .unwrap()
      .catch((error) => {
        console.error("Error al quitar del carrito:", error);
      });
  };

  const handleAdd = (product, qty) => {
    if (!token) {
      toast.info("Debes iniciar sesión para agregar productos al carrito", {
        position: "top-center",
        autoClose: 3000,
      });
      navigate("/auth");
      return;
    }

    dispatch(addToCart({ product, qty, token }))
      .unwrap()
      .then(() => {
        setCartOpen(true);
      })
      .catch((error) => {
        toast.error(error || "Error al agregar al carrito", {
          position: "top-center",
          autoClose: 4000,
        });
      });
  };

  const handleClearCart = () => {
    dispatch(clearCart())
      .unwrap()
      .catch((error) => {
        console.error("Error al limpiar carrito:", error);
      });
  };

  const norm = (s) =>
    s ? s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";

  const filtered = useMemo(() => {
    if (!products?.length) return [];

    const base =
      selectedCategory === "all"
        ? products
        : products.filter((p) => {
            const productCatId = p.category?.id?.toString();
            const selectedCat = selectedCategory.toString();
            return productCatId === selectedCat;
          });

    const t = norm(searchQuery.trim());
    if (!t) return base;

    return base.filter((p) => norm(p.name).includes(t));
  }, [selectedCategory, searchQuery, products]);

  function getRoleFromToken() {
    try {
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.userType || payload.role || null;
    } catch {
      return null;
    }
  }


  const goToLogin = () => navigate("/auth", { state: { from: location.pathname } });

  const handleCartClick = () => {
    const userRole = getUserRole(token);
    if (userRole === "ADMIN") {
      toast.warning("⛔ Los administradores no tienen acceso al carrito", {
        toastId: "admin-no-cart"
      });
      return;
    }
    setCartOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#bbf7d0' }}>
      {!isAuthPage && <PromoBar />}
        {!isAuthPage && (
          <Header
            cartCount={totalQty}
            onSearch={(q) => dispatch(setSearchQuery(q))}
            onCartClick={handleCartClick}
          />
        )}
        {!isAuthPage && <Navigation onLoginClick={goToLogin} />}

        <div style={{ flex: 1, background: '#bbf7d0' }}>
          <Routes>

  <Route path="/" element={<Home />} />

  <Route path="/auth" element={<Auth />} />

  <Route path="/home" element={<Home />} />

  <Route path="/admin/contact" element={<AdminContact />} />
  <Route path="/admin/mensajes" element={<AdminContactMessages />} />

  <Route
    path="/products"
    element={
      <Products
        categories={categories}
        cat={selectedCategory}
        setCat={(cat) => dispatch(setSelectedCategory(cat))}
        filtered={filtered}
      />
    }
  />
  


  <Route
    path="/product/:id"
    element={
      <ProductDetail
        products={products}
        categories={categories}
      />
    }
  />

  <Route
    path="/cart"
    element={
      <ClientOnlyRoute>
        <Cart
          items={cartItems}
          inc={inc}
          dec={dec}
          remove={remove}
          subtotal={subtotal}
          clearCart={handleClearCart}
        />
      </ClientOnlyRoute>
    }
  />

  <Route
    path="/checkout"
    element={
      <ClientOnlyRoute>
        <Checkout />
      </ClientOnlyRoute>
    }
  />

  <Route
    path="/my-orders"
    element={token ? <MyOrders /> : <Navigate to="/auth" replace />}
  />

  <Route path="/contact" element={<Contact />} />


  <Route
    path="/admin/products"
    element={
      getRoleFromToken() === "ADMIN" ? (
        <AdminProducts />
      ) : (
        <div style={{ padding: 40 }}>
          <h2>Acceso denegado 🚫</h2>
          <p>Solo los administradores pueden acceder a esta sección.</p>
        </div>
      )
    }
  />

  <Route
    path="/admin/users"
    element={
      getRoleFromToken() === "ADMIN" ? (
        <AdminUsers />
      ) : (
        <div style={{ padding: 40 }}>
          <h2>Acceso denegado 🚫</h2>
          <p>Solo los administradores pueden acceder a esta sección.</p>
        </div>
      )
    }
  />

  <Route
    path="/admin/categories"
    element={
      getRoleFromToken() === "ADMIN" ? (
        <AdminCategories />
      ) : (
        <div style={{ padding: 40 }}>
          <h2>Acceso denegado 🚫</h2>
          <p>Solo los administradores pueden acceder a esta sección.</p>
        </div>
      )
    }
  />

  <Route
    path="/admin/content"
    element={
      getRoleFromToken() === "ADMIN" ? (
        <AdminContent />
      ) : (
        <div style={{ padding: 40 }}>
          <h2>Acceso denegado 🚫</h2>
          <p>Solo los administradores pueden acceder a esta sección.</p>
        </div>
      )
    }
  />

  <Route
    path="/admin/orders"
    element={
      getRoleFromToken() === "ADMIN" ? (
        <AdminOrders />
      ) : (
        <div style={{ padding: 40 }}>
          <h2>Acceso denegado 🚫</h2>
          <p>Solo los administradores pueden acceder a esta sección.</p>
        </div>
      )
    }
  />

  <Route path="*" element={<Navigate to="/" replace />} />
  <Route
    path="/mi-perfil"
    element={token ? <UserHome /> : <Navigate to="/auth" replace />}
  />

</Routes>
        </div>

        {!isAuthPage && <Footer />}
        {!isAuthPage && getUserRole(token) === "CLIENTE" && (
          <CartDrawer
            open={isCartOpen}
            onClose={() => setCartOpen(false)}
            items={cartItems}
            inc={inc}
            dec={dec}
            remove={remove}
            subtotal={subtotal}
          />
        )}
        <ToastContainer position="top-center" autoClose={2500} hideProgressBar theme="colored" />
      </div>
  );
}

export default App;
