import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { API_BASE, apiUrl } from "../lib/api";
import { addToCart } from "../redux/cartSlice";

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

function ProductCard({ product, categories = [] }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  
  const [qty, setQty] = useState(1);

  const userRole = getUserRole(token);
  const isAdmin = userRole === "ADMIN";

  const dec = () => setQty((n) => Math.max(1, n - 1));
  const inc = () => setQty((n) => Math.max(1, Math.min(product.stock, n + 1)));

  const handleAdd = () => {

    if (isAdmin) {
      toast.error("⛔ Los administradores no pueden realizar compras", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

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
        toast.success("Producto agregado al carrito 🛒", {
          position: "top-center",
          autoClose: 2000,
        });
      })
      .catch((error) => {
        toast.error(error || "Error al agregar al carrito", {
          position: "top-center",
          autoClose: 3000,
        });
      });
  };

  const hasDiscount = Number(product.discount) > 0;
  const finalPrice =
    product.finalPrice ??
    (hasDiscount
      ? product.price - product.price * (product.discount / 100)
      : product.price);

  const isOutOfStock = product.stock === 0;

  const categoryName = product.category?.name || "Categoría";

  return (
    <article
      style={styles.card}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.00)")}
    >
      <div style={styles.mediaWrap}>
        {isOutOfStock && (
          <span style={{...styles.badge, background: "#ef4444", top: 10, left: 10}}>
            ❌ SIN STOCK
          </span>
        )}
        {!isOutOfStock && hasDiscount && (
          <span style={styles.badge}>🔥 {Number(product.discount)}% OFF</span>
        )}

        <Link to={`/product/${product.id}`}>
          <img
            src={`${API_BASE}/products/${product.id}/image`}
            alt={product.name}
            style={{...styles.image, opacity: isOutOfStock ? 0.5 : 1}}
            onError={(e) =>
              (e.target.src =
                "https://via.placeholder.com/200x150?text=Sin+Imagen")
            }
          />
        </Link>
      </div>

      <div style={styles.body}>
        <Link to={`/product/${product.id}`} style={styles.link}>
          <h3 style={styles.title}>{product.name}</h3>
        </Link>

        <div style={styles.categoryPill}>{categoryName}</div>

        <p style={{ color: "#555", fontSize: 14, minHeight: 40 }}>
          {product.description || "Sin descripción"}
        </p>

        <div style={{ marginTop: 8 }}>
          {hasDiscount ? (
            <>
              <div style={styles.oldPrice}>
                ${product.price.toLocaleString("es-AR")}
              </div>
              <div style={styles.newPrice}>
                ${finalPrice.toLocaleString("es-AR")}
              </div>
            </>
          ) : (
            <div style={styles.price}>
              ${product.price.toLocaleString("es-AR")}
            </div>
          )}
        </div>

        {isOutOfStock ? (
          <div style={{
            background: "#fee2e2",
            color: "#dc2626",
            padding: "12px",
            borderRadius: "8px",
            textAlign: "center",
            fontWeight: 600,
            marginTop: 12
          }}>
            ❌ Producto agotado
          </div>
        ) : isAdmin ? (
          <div style={{
            background: "#fef3c7",
            color: "#92400e",
            padding: "12px",
            borderRadius: "8px",
            textAlign: "center",
            fontWeight: 600,
            marginTop: 12
          }}>
            ⛔ Los administradores no pueden comprar
          </div>
        ) : (
          <>
            <div style={styles.qtyRow}>
              <span>Cantidad:</span>
              <div style={styles.qtyBox}>
                <button onClick={dec} style={styles.qtyBtn}>
                  –
                </button>
                <span>{qty}</span>
                <button onClick={inc} style={styles.qtyBtn}>
                  +
                </button>
              </div>
            </div>
            <div style={{ fontSize: "0.85rem", color: "#666", marginTop: 4 }}>
              Stock disponible: {product.stock}
            </div>

            <button
              type="button"
              onClick={handleAdd}
              style={styles.addBtn}
            >
              🛒 Agregar
            </button>
          </>
        )}
      </div>
    </article>
  );
}

const styles = {
  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 8, 
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)", 
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
    position: "relative",
    maxWidth: "280px",  
  },
  mediaWrap: { position: "relative", overflow: "hidden" },
  badge: {
    position: "absolute",
    top: 6, 
    left: 6, 
    background: "#22c55e",
    color: "#fff",
    padding: "3px 6px", 
    borderRadius: 6, 
    fontSize: 11, 
    fontWeight: 600,
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
    zIndex: 1,
  },
  image: {
    width: "100%",
    height: 140, 
    objectFit: "cover",
    borderRadius: 6, 
    transition: "opacity 0.3s ease",
  },

  body: { padding: 12, display: "grid", gap: 8 }, 
  link: { textDecoration: "none", color: "inherit" },
  title: { margin: 0, fontSize: 14, fontWeight: 600 }, 
  categoryPill: {
    display: "inline-block",
    background: "#22c55e",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 8,
    border: "2px solid #16a34a",
  },
  price: { color: "#16a34a", fontWeight: 700, fontSize: 16 },  
  oldPrice: {
    color: "#9ca3af",
    textDecoration: "line-through",
    fontSize: 12, 
  },
  newPrice: {
    color: "#16a34a",
    fontWeight: 700,
    fontSize: 18,
    marginTop: 2,
  },
  qtyRow: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  qtyBox: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    border: "1px solid #e5e7eb",
    borderRadius: 999,
    padding: "6px 10px",
    background: "#fff",
    minWidth: 90,
    justifyContent: "space-between",
  },
  qtyBtn: {
    background: "transparent",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
    color: "#111827",
  },
  addBtn: {
    border: "none",
    background: "#22c55e",
    color: "#fff",
    fontSize: 16,
    padding: "10px 14px",
    borderRadius: 10,
    cursor: "pointer",
    transition: "background 0.2s",
  },
};

export default ProductCard;


