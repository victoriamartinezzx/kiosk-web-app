import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { API_BASE } from "../lib/api";

function Footer({
  navLinks = [
    { to: "/contact", label: "Contacto" },
    { to: "/legal/privacy", label: "Políticas de Privacidad de Datos" },
  ],
}) {
  const dispatch = useDispatch();
  const { items: categories } = useSelector((state) => state.categories);
  const { 
    paymentMethods, 
    shippingMethods, 
    brands,
    contactInfo 
  } = useSelector((state) => state.content);


  return (
    <footer style={S.wrap}>
      <div style={S.container}>
        <div style={S.grid}>
          <div>
            <h4 style={S.h4}>Categorías</h4>
            <ul style={S.ul}>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link to={`/products?category=${c.id}`} style={S.link}>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={S.h4}>Navegación</h4>
            <ul style={S.ul}>
              {navLinks.map((n) => (
                <li key={n.label}><Link to={n.to} style={S.link}>{n.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={S.h4}>Contactános</h4>
            {contactInfo ? (
              <div style={S.contactBox}>
                <div style={S.contactItem}>
                  <span style={S.contactIcon}>✉️</span>
                  <div>
                    <strong style={S.contactLabel}>Email:</strong>
                    <div style={S.contactValue}>{contactInfo.email || "admin@kiosco.com"}</div>
                  </div>
                </div>
                
                <div style={S.contactItem}>
                  <span style={S.contactIcon}>📞</span>
                  <div>
                    <strong style={S.contactLabel}>Teléfono:</strong>
                    <div style={S.contactValue}>{contactInfo.telefono || "11 5813-2326"}</div>
                  </div>
                </div>
                
                <div style={S.contactItem}>
                  <span style={S.contactIcon}>📍</span>
                  <div>
                    <strong style={S.contactLabel}>Dirección:</strong>
                    <div style={S.contactValue}>{contactInfo.direccion || "Av. Monserrat 2346"}</div>
                  </div>
                </div>
                
                <div style={S.contactItem}>
                  <span style={S.contactIcon}>🕐</span>
                  <div>
                    <strong style={S.contactLabel}>Horario:</strong>
                    <div style={S.contactValue}>{contactInfo.horario || "de 13:00hs - 17:00hs"}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={S.contactBox}>
                <div style={S.text}>Cargando...</div>
              </div>
            )}
          </div>
        </div>

        <hr style={S.hr} />

        {(brands || []).length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={S.stripTitle}>Nuestras Marcas</div>
            <div style={S.logoRow}>
              {(brands || []).map((brand) => (
                <img
                  key={brand.id}
                  src={`${API_BASE}/api/content/brands/${brand.id}/image?t=${Date.now()}`}
                  alt={brand.name}
                  style={S.logo}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ))}
            </div>
          </div>
        )}

        <div style={S.strips}>
          <div>
            <div style={S.stripTitle}>Medios de pago</div>
            <div style={S.logoRow}>
              {(paymentMethods || []).map((method) => (
                <img
                  key={method.id}
                  src={`${API_BASE}/api/content/payment-methods/${method.id}/image?t=${Date.now()}`}
                  alt={method.name}
                  style={S.logo}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ))}
            </div>
          </div>

          <div>
            <div style={S.stripTitle}>Medios de envío</div>
            <div style={S.logoRow}>
              {(shippingMethods || []).map((method) => (
                <img
                  key={method.id}
                  src={`${API_BASE}/api/content/shipping-methods/${method.id}/image?t=${Date.now()}`}
                  alt={method.name}
                  style={S.logo}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

const green = "#4ba14aff";
const greenDark = "#1f5f1f"; 

const S = {
  wrap: { 
    background: greenDark, 
    color: "#fff", 
    marginTop: 0, 
    paddingTop: 0,
    width: "100%",
  },
  topStrip: {
    background: "#955a5a00",
    display: "flex", justifyContent: "center", gap: 16, padding: "18px 0",
  },
  circleIcon: {
    width: 46, height: 46, borderRadius: 999, display: "inline-flex",
    alignItems: "center", justifyContent: "center",
    background: "#ffffff22", color: "#fff", textDecoration: "none", fontWeight: 700
  },

  container: { 
    maxWidth: 1200, 
    margin: "0 auto", 
    padding: "20px 20px 30px" 
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 24,
  },
  h4: { margin: "10px 0 16px", textTransform: "uppercase", letterSpacing: .5 },
  ul: { listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 },
  link: { color: "#fff", textDecoration: "none", opacity: .95 },
  text: { opacity: .95 },

  contactBox: {
    background: "#d1f4e0",
    padding: "16px",
    borderRadius: "8px",
    border: "2px solid #86efac",
    color: "#1f5f1f",
  },
  contactItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    marginBottom: "12px",
  },
  contactIcon: {
    fontSize: "18px",
    marginTop: "2px",
  },
  contactLabel: {
    display: "block",
    color: "#0f4c0f",
    fontSize: "14px",
    fontWeight: 700,
    marginBottom: "2px",
  },
  contactValue: {
    color: "#1f5f1f",
    fontSize: "14px",
    fontWeight: 500,
  },

  hr: { border: "none", borderTop: "1px solid #ffffff33", margin: "24px 0" },

  strips: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 24,
  },
  stripTitle: { marginBottom: 10, fontWeight: 600 },
  logoRow: { display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" },
  logo: { height: 26, objectFit: "contain"}, 
};

export default Footer;