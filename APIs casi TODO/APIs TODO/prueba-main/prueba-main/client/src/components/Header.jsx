import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import kioscofull from "../assets/kioscofull.png";
import { toast } from "react-toastify";
import { API_BASE } from "../lib/api";
import { logout } from "../redux/authSlice";
import { clearCart } from "../redux/cartSlice";
import { searchProducts } from "../redux/productsSlice";

function getUserFromToken(token) {
  try {
    if (!token) return null;
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;
    const decodedPayload = JSON.parse(atob(payloadBase64));
    
    return {
      id: decodedPayload.id,
      email: decodedPayload.sub || decodedPayload.email,
      name: decodedPayload.name, 
      userType: decodedPayload.userType || decodedPayload.role
    };
  } catch {
    return null;
  }
}

export default function Header({ onSearch, onCartClick }) {
  const dispatch = useDispatch();
  

  const { items: cartItems } = useSelector((state) => state.cart);
  const { token, isAuthenticated, user: reduxUser } = useSelector((state) => state.auth);
  const { searchResults: reduxSearchResults, searchLoading } = useSelector((state) => state.products);
  
 
  const [q, setQ] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

 
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  

  const user = getUserFromToken(token) || reduxUser;
  const userRole = user?.userType || user?.role || null;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (q.trim().length > 0) {
        try {
          await dispatch(searchProducts(q)).unwrap();
          setShowResults(true);
        } catch (err) {
          console.error("Error buscando productos:", err);
        }
      } else {
        setShowResults(false);
      }
    }, 300); 

    return () => clearTimeout(delaySearch);
  }, [q, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  
    toast.success("Has cerrado sesión correctamente 🟢");
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(q);
  };

  const handleProductClick = (productId) => {
    setShowResults(false);
    setQ("");
    navigate(`/product/${productId}`);
  };

  return (
    <header style={styles.wrap}>
      <Link to="/" style={styles.logoWrap}>
        <img src={kioscofull} alt="Kiosco" style={styles.logo} />
      </Link>

    
      {token && (
        <>
          <Link to="/mi-perfil" style={{ marginLeft: 12, fontSize: 20 }} title="Mi Perfil">
            🏠
          </Link>
          {userRole === "CLIENTE" && (
            <Link to="/my-orders" style={{ marginLeft: 12, fontWeight: 600 }}>
              📦 Mis Pedidos
            </Link>
          )}
          {userRole === "ADMIN" && (
            <Link to="/admin/mensajes" style={{ marginLeft: 12, fontWeight: 600 }}>
              📬 Mensajes de Contacto
            </Link>
          )}
        </>
      )}

      <div ref={searchRef} style={{ position: "relative", flex: 1, maxWidth: "700px" }}>
        <form onSubmit={handleSearch} style={styles.searchWrap}>
          <label htmlFor="header-search" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
            Buscar productos
          </label>
          <input
            id="header-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="¿Qué producto buscas?"
            style={styles.input}
          />
          <button type="submit" style={styles.searchBtn}>
            🔍
          </button>
        </form>

        {showResults && (
          <div style={styles.searchResults}>
            {searchLoading ? (
              <div style={styles.searchLoading}>Buscando...</div>
            ) : reduxSearchResults.length > 0 ? (
              reduxSearchResults.map((product) => (
                <div
                  key={product.id}
                  style={styles.searchResultItem}
                  onClick={() => handleProductClick(product.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f9fafb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div style={styles.resultImageWrap}>
                    {product.image ? (
                      <img
                        src={`${API_BASE}/products/${product.id}/image`}
                        alt={product.name}
                        style={styles.resultImage}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div style={styles.resultImagePlaceholder}>📦</div>
                    )}
                  </div>
                  <div style={styles.resultInfo}>
                    <div style={styles.resultName}>{product.name}</div>
                    <div style={styles.resultPrice}>
                      ${product.finalPrice?.toFixed(2) || product.price?.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.searchEmpty}>
                No se encontraron productos para "{q}"
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {!isAuthenticated ? (
          <Link to="/auth" style={styles.loginLink}>
            Iniciar sesión
          </Link>
        ) : (
          <>
            {user && (
              <span style={{ 
                color: "#166534", 
                fontWeight: 700, 
                fontSize: "1.1rem",
                textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                letterSpacing: "0.3px"
              }}>
                ¡Hola, {user.name || "usuario"}! 👋
              </span>
            )}

            {userRole === "ADMIN" && (
              <div style={styles.dropdownWrap}>
                <button
                  style={styles.dropdownBtn}
                  onClick={() => setShowMenu((prev) => !prev)}
                >
                  ⚙️ Administración ▾
                </button>

                {showMenu && (
                  <div style={styles.dropdownContent}>
                    <Link to="/admin/products" style={styles.dropdownItem}>
                      🛠️ Gestionar productos
                    </Link>
                    <Link to="/admin/categories" style={styles.dropdownItem}>
                      📂 Gestionar categorías
                    </Link>
                    <Link to="/admin/users" style={styles.dropdownItem}>
                      👥 Gestionar usuarios
                    </Link>
                    <Link to="/admin/orders" style={styles.dropdownItem}>
                      📦 Gestionar pedidos
                    </Link>
                    <Link to="/admin/content" style={styles.dropdownItem}>
                      🖼️ Gestionar contenido
                    </Link>
                    <Link to="/admin/contact" style={styles.dropdownItem}>
                      📞 Gestionar contacto
                    </Link>
                
                  </div>
                )}
              </div>
            )}

            {userRole === "CLIENTE" && (
              <button onClick={onCartClick} style={styles.cartBtn}>
                🛒
                {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
              </button>
            )}

            <button onClick={handleLogout} style={styles.logoutBtn}>
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </header>
  );
}

const styles = {
  wrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 20px",
    background: "#bbf7d0",
    position: "relative",
    top: 0,
    zIndex: 9999,
    gap: "20px",
  },
  logoWrap: { display: "flex", alignItems: "center" },
  logo: { height: 40 },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    background: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    width: "100%",
  },
  input: {
    flex: 1,
    border: "none",
    padding: "8px 10px",
    outline: "none",
    fontSize: "14px",
  },
  searchBtn: {
    border: "none",
    background: "transparent",
    fontSize: 18,
    cursor: "pointer",
    color: "#2a7928ff",
    paddingRight: "8px",
  },
  searchResults: {
    position: "absolute",
    top: "calc(100% + 5px)",
    left: 0,
    right: 0,
    background: "#fff",
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    maxHeight: "400px",
    overflowY: "auto",
    zIndex: 10000,
  },
  searchLoading: {
    padding: "20px",
    textAlign: "center",
    color: "#666",
  },
  searchEmpty: {
    padding: "20px",
    textAlign: "center",
    color: "#666",
  },
  searchResultItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    borderBottom: "1px solid #f0f0f0",
    cursor: "pointer",
    transition: "background 0.2s ease",
  },
  resultImageWrap: {
    width: 50,
    height: 50,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f5f5",
    borderRadius: 6,
    overflow: "hidden",
  },
  resultImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  resultImagePlaceholder: {
    fontSize: 24,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#333",
    marginBottom: 4,
  },
  resultPrice: {
    fontSize: "13px",
    color: "#16a34a",
    fontWeight: 600,
  },
  dropdownWrap: { position: "relative", display: "inline-block" },
  dropdownBtn: {
    background: "#2563eb",
    color: "white",
    border: "2px solid white",
    borderRadius: 8,
    padding: "8px 14px",
    cursor: "pointer",
    fontWeight: 600,
  },
  dropdownContent: {
    position: "absolute",
    top: "110%",
    right: 0,
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    padding: "8px 0",
    minWidth: 200,
    zIndex: 9999,
  },
  dropdownItem: {
    display: "block",
    padding: "10px 14px",
    textDecoration: "none",
    color: "#333",
    fontWeight: 500,
    borderBottom: "1px solid #eee",
  },
  cartBtn: {
    position: "relative",
    fontSize: 20,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "white",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -10,
    background: "#000",
    color: "#fff",
    borderRadius: 999,
    fontSize: 12,
    padding: "2px 6px",
  },
  loginLink: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: 600,
    background: "#166534",
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid #fff",
  },
  logoutBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: 6,
    padding: "6px 10px",
    cursor: "pointer",
    fontWeight: 600,
  },
};




