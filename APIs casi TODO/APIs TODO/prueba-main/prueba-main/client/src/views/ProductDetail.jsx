import { useMemo, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ProductsSection from "../components/ProductsSection";
import { API_BASE } from "../lib/api";
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

function ProductDetail({ products = [], categories = [] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const userRole = getUserRole(token);
  const isAdmin = userRole === "ADMIN";

  const product = useMemo(
    () => products.find((p) => String(p.id) === String(id)),
    [products, id]
  );

  const [qty, setQty] = useState(1);
  const dec = () => setQty((n) => Math.max(1, n - 1));
  const inc = () => setQty((n) => n + 1);

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

  if (!product) {
    return (
      <main className="container" style={{ padding: "24px 0" }}>
        <p>Producto no encontrado.</p>
        <button onClick={() => navigate(-1)}>Volver</button>
      </main>
    );
  }

  const category = categories.find((c) => c.id === product.categoryId);
  const related = useMemo(
    () =>
      products
        .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
        .slice(0, 4),
    [products, product]
  );


  const productTitle = product.title || product.name || "Producto";

  const images = (() => {

    if (Array.isArray(product.image)) return product.image;
    if (Array.isArray(product.images)) return product.images;
    if (product.image) return [product.image];
    if (product.images) return product.images;

  if (product.id) return [`${API_BASE}/products/${product.id}/image`];
    return [];
  })();

  const [mainImage, setMainImage] = useState("");
  useEffect(() => {
    setMainImage(images[0] || "");
  }, [images]);

  return (
    <main className="container" style={{ padding: "18px 0 36px" }}>
      <nav style={{ fontSize: 14, marginBottom: 12, color: "#64748b" }}>
        <Link to="/products">Productos</Link> {">"} {" "}
        <Link to={`/products?cat=${product.categoryId}`}>{category?.name || "Categoría"}</Link>{" "}
        {">"} <span style={{ color: "#111827" }}>{productTitle}</span>
      </nav>

      <section style={{ marginTop: 18 }}>
        <div style={kioskWrap}>
          <div style={imageCard}>
            {product.badge && <div style={imageBadge}>{product.badge}</div>}
            <div style={mainImageWrap}>
              {mainImage ? (
                <img
                  src={mainImage.startsWith("http") || mainImage.startsWith("/") ? mainImage : `/${mainImage}`}
                  alt={product.title}
                  style={mainImg}
                />
              ) : (
                <div style={noImage}>Imagen no disponible</div>
              )}
            </div>
            {images.length > 1 && (
              <div style={thumbsRow}>
                {images.map((img, i) => {
                  const src = img.startsWith("http") || img.startsWith("/") ? img : `/${img}`;
                  return (
                    <button
                      key={i}
                      onClick={() => setMainImage(img)}
                      style={{
                        ...thumbBtn,
                        boxShadow: mainImage === img ? "0 0 0 2px #22c55e inset" : "none",
                      }}
                      aria-label={`Ver imagen ${i + 1}`}
                    >
                      <img src={src} alt={`${product.title} ${i + 1}`} style={thumbImg} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div style={detailCard}>
            <h2 style={{ margin: 0 }}>{productTitle}</h2>

            <div style={metaRow}>
              <span style={categoryPill}>{category?.name || "Categoría"}</span>
              {product.soldOut && <span style={soldOut}>Producto agotado</span>}
            </div>

            <div style={priceRow}>
              {product.oldPrice && (
                <div style={priceOld}>${product.oldPrice.toLocaleString("es-AR")}</div>
              )}
              <div style={priceCurrent}>${product.price.toLocaleString("es-AR")}</div>
              {Number(product.discount) > 0 && <div style={discountBadge}>-{Number(product.discount)}%</div>}
            </div>

            <div style={{ marginTop: 12, color: "#374151" }}>
              <strong>Descripción</strong>
              <p style={{ marginTop: 8, color: "#6b7280" }}>{product.description || product.desc || "Sin descripción."}</p>
            </div>

            {isAdmin ? (
              <div style={{
                marginTop: 16,
                background: "#fef3c7",
                color: "#92400e",
                padding: "16px",
                borderRadius: "8px",
                textAlign: "center",
                fontWeight: 600
              }}>
                ⛔ Los administradores no pueden realizar compras
              </div>
            ) : (
              <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center" }}>
                <div>
                  <div style={{ marginBottom: 6, fontWeight: 600 }}>Cantidad</div>
                  <div style={qtyControl}>
                    <button onClick={dec} style={qtyBtn}>–</button>
                    <div style={qtyDisplay}>{qty}</div>
                    <button onClick={inc} style={qtyBtn}>+</button>
                  </div>
                </div>

                <button onClick={handleAdd} style={addBtn}>🛒 Agregar al carrito</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section style={{ marginTop: 28 }}>
          <ProductsSection title="Otros productos" products={related} categories={categories} />
        </section>
      )}
    </main>
  );
}

const layout = {
  display: "grid",
  gridTemplateColumns: "1fr 320px",
  gap: 24,
  alignItems: "start",
};
const side = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 16,
  background: "#fff",
  position: "sticky",
  top: 110,
};
const badge = {
  display: "inline-block",
  background: "#ef4444",
  color: "#fff",
  borderRadius: 8,
  padding: "4px 8px",
  marginTop: 8,
  fontSize: 12,
};
const qtyBox = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  border: "1px solid #e5e7eb",
  borderRadius: 999, 
  padding: "6px 10px",
  minWidth: 90,
  justifyContent: "space-between",
};

const qtyBtn = {
  border: "none",
  background: "transparent",
  fontSize: 18,
  cursor: "pointer",
  color: "#111827",
};
const addBtn = {
  marginTop: 12,
  width: "100%",
  border: "none",
  background: "#22c55e",
  color: "#fff",
  padding: "12px 14px",
  borderRadius: 10,
  fontSize: 16,
  cursor: "pointer",
};


const gallery = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};
const mainImageWrap = {
  width: "100%",
  maxWidth: 600,
  margin: "0 auto",
  borderRadius: 12,
  overflow: "hidden",
  border: "1px solid #e5e7eb",
  background: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 320,
};
const mainImg = {
  width: "100%",
  height: "auto",
  display: "block",
  objectFit: "contain",
};
const noImage = {
  color: "#64748b",
};
const thumbsRow = {
  display: "flex",
  gap: 8,
  justifyContent: "center",
  flexWrap: "wrap",
};
const thumbBtn = {
  border: "none",
  padding: 0,
  background: "transparent",
  borderRadius: 8,
  cursor: "pointer",
};
const thumbImg = {
  width: 72,
  height: 72,
  objectFit: "cover",
  borderRadius: 6,
  display: "block",
};


const kioskWrap = {
  display: "grid",
  gridTemplateColumns: "480px 1fr",
  gap: 24,
  alignItems: "start",
};
const imageCard = {
  borderRadius: 12,
  padding: 12,
  background: "#fff",
  border: "1px solid #e5e7eb",
  position: "relative",
};
const imageBadge = {
  position: "absolute",
  right: 18,
  top: 12,
  background: "#ef4444",
  color: "#fff",
  padding: "6px 10px",
  borderRadius: 20,
  fontSize: 12,
  zIndex: 3,
};
const detailCard = {
  background: "#f9fafb",
  borderRadius: 12,
  padding: 20,
  border: "1px solid #e6edf3",
};
const metaRow = {
  marginTop: 10,
  display: "flex",
  gap: 8,
  alignItems: "center",
};
const categoryPill = {
  background: "#fff",
  padding: "6px 10px",
  borderRadius: 999,
  border: "1px solid #e5e7eb",
  color: "#374151",
  fontSize: 12,
};
const soldOut = {
  color: "#ef4444",
  fontWeight: 600,
};
const priceRow = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginTop: 12,
};
const priceOld = {
  textDecoration: "line-through",
  color: "#9ca3af",
};
const priceCurrent = {
  fontSize: 28,
  fontWeight: 800,
  color: "#111827",
};
const discountBadge = {
  background: "#16a34a",
  color: "#fff",
  padding: "6px 8px",
  borderRadius: 8,
  fontSize: 12,
};
const qtyControl = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  border: "1px solid #e5e7eb",
  padding: "6px",
  borderRadius: 8,
};
const qtyDisplay = {
  minWidth: 36,
  textAlign: "center",
  fontWeight: 600,
};

export default ProductDetail;