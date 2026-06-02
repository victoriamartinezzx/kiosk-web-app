import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function Cart({
  items = [],           
  inc, dec, remove,     
  subtotal = 0,        
  onCheckout,          
  clearCart,            
}) {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);


  useEffect(() => {
    if (!token) {
      toast.error("Debe iniciar sesión para acceder al carrito");
      navigate("/auth", { state: { from: "/cart" } });
    }
  }, [token, navigate]);


  const [delivery, setDelivery] = useState("home");
  
 
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [floor, setFloor] = useState("");
  const [department, setDepartment] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postal, setPostal] = useState("");
  const [phone, setPhone] = useState("");
  const [dni, setDni] = useState("");

  const shipping = delivery === "home" ? 300 : 0;
  const discount = 0; 

  const total = Math.max(0, subtotal + shipping - discount);


  const handleCheckout = () => {
    if (!dni.trim()) {
      toast.error("Por favor completá tu DNI");
      return;
    }

    if (delivery === "home" && (!street.trim() || !number.trim() || !city.trim() || !province.trim() || !postal.trim() || !phone.trim())) {
      toast.error("Por favor completá todos los campos de dirección");
      return;
    }

    const checkoutData = {
      items,
      delivery,
      subtotal,
      shipping,
      discount,
      total,
      address: delivery === "home" ? {
        street,
        number: parseInt(number),
        floor: floor ? parseInt(floor) : 0,
        department: department ? parseInt(department) : 0,
        city,
        province,
        codigoPostal: parseInt(postal),
        country: "Argentina",
        phone
      } : null,
      dni
    };

    onCheckout?.(checkoutData);

    clearCart?.();

    navigate("/checkout", { state: checkoutData, replace: true });
  };

  return (
    <main
      className="container"
      style={{
        padding: "40px 30px 0px 30px",
        backgroundColor: "#d1f5d1",
        minHeight: "80vh",
      }}
    >
      <h1 style={{ marginBottom: 18 }}>🛒 Carrito de Compras</h1>

      <section style={{ display: "grid", gap: 16, marginBottom: 32 }}>
        {items.length === 0 ? (
          <div style={{ color: "#64748b" }}>Tu carrito está vacío.</div>
        ) : (
          items.map((it) => (
            <div
              key={it.id}
              style={{
                ...row,
                background: "#fafffa",
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
              }}
            >
              <img
                src={
                  it.image && (it.image.startsWith("http") || it.image.startsWith("/"))
                    ? it.image
                    : `${API_BASE}/products/${it.id}/image`
                }
                alt={it.title}
                style={thumb}
                onError={(e) => (e.target.src = "https://via.placeholder.com/56?text=Sin+Imagen")}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{it.title}</div>
                <div style={{ color: "#16a34a", fontWeight: 700 }}>
                  ${(it.price || 0).toLocaleString("es-AR")}
                </div>
                <div style={{ color: "#64748b", fontSize: 13 }}>
                  {it.qty} {it.qty === 1 ? "unidad" : "unidades"}
                </div>
              </div>

              <div style={qtyBox}>
                <button onClick={() => dec(it.id)} style={qtyBtn}>–</button>
                <span>{it.qty}</span>
                <button onClick={() => inc(it.id)} style={qtyBtn}>+</button>
              </div>

              <div style={{ width: 90, textAlign: "right", fontWeight: 600 }}>
                ${(it.price * it.qty).toLocaleString("es-AR")}
              </div>

              <button
                onClick={() => remove(it.id)}
                style={removeBtn}
                title="Quitar"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </section>

      <section
        style={{
          background: "#e9ffe9",
          borderRadius: 16,
          padding: 24,
          marginBottom: 28,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          maxWidth: 700,
        }}
      >
        <h3 style={{ marginBottom: 20 }}>Datos del comprador</h3>
        <div>
          <label htmlFor="cart-dni" style={label}>DNI</label>
          <input
            id="cart-dni"
            type="number"
            placeholder="Ej: 40123123"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            style={inputLg}
            required
          />
        </div>
      </section>

      <section
        style={{
          background: "#e9ffe9",
          borderRadius: 16,
          padding: 24,
          marginBottom: 28,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          maxWidth: 700,
        }}
      >
        <h3 style={{ marginBottom: 20 }}>Método de Entrega</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <label style={opt}>
            <input
              type="radio"
              name="delivery"
              value="pickup"
              checked={delivery === "pickup"}
              onChange={(e) => setDelivery(e.target.value)}
            />
            Retiro en tienda
          </label>
          <label style={opt}>
            <input
              type="radio"
              name="delivery"
              value="home"
              checked={delivery === "home"}
              onChange={(e) => setDelivery(e.target.value)}
            />
            Envío a domicilio
          </label>
        </div>

        {delivery === "home" && (
          <div style={{ marginTop: 20, display: "grid", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
              <div>
                <label htmlFor="cart-street" style={label}>Calle</label>
                <input
                  id="cart-street"
                  type="text"
                  placeholder="Ej: Av. Rivadavia"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  style={inputLg}
                />
              </div>
              <div>
                <label htmlFor="cart-number" style={label}>Número</label>
                <input
                  id="cart-number"
                  type="number"
                  placeholder="1234"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  style={inputLg}
                />
              </div>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label htmlFor="cart-floor" style={label}>Piso (opcional)</label>
                <input
                  id="cart-floor"
                  type="number"
                  placeholder="Ej: 5"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  style={inputLg}
                />
              </div>
              <div>
                <label htmlFor="cart-department" style={label}>Departamento (opcional)</label>
                <input
                  id="cart-department"
                  type="number"
                  
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={inputLg}
                />
              </div>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label htmlFor="cart-city" style={label}>Ciudad</label>
                <input
                  id="cart-city"
                  type="text"
                  placeholder="Ej: Buenos Aires"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={inputLg}
                />
              </div>
              <div>
                <label htmlFor="cart-province" style={label}>Provincia</label>
                <input
                  id="cart-province"
                  type="text"
                  placeholder="Ej: Buenos Aires"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  style={inputLg}
                />
              </div>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <label htmlFor="cart-postal" style={label}>Código Postal</label>
                <input
                  id="cart-postal"
                  type="text"
                  placeholder="Ej: 1414"
                  value={postal}
                  onChange={(e) => setPostal(e.target.value)}
                  style={inputLg}
                />
              </div>
              <div>
                <label htmlFor="cart-phone" style={label}>Teléfono</label>
                <input
                  id="cart-phone"
                  type="tel"
                  placeholder="Ej: 1122334455"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={inputLg}
                />
              </div>
            </div>
          </div>
        )}
      </section>

      <section
        style={{
          display: "grid",
          gap: 10,
          maxWidth: 420,
          background: "#e9ffe9",
          borderRadius: 16,
          padding: 20,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <h3 style={{ margin: 0 }}>Resumen del Pedido</h3>
        <Row label="Subtotal" value={subtotal} />
        <Row label="Envío" value={shipping} />
        <hr style={{ border: "none", borderTop: "1px solid #b8dfb8" }} />
        <Row label="Total" value={total} bold />
      </section>

      <button
        onClick={handleCheckout}
        disabled={items.length === 0}
        style={{
          ...checkoutBtn,
          opacity: items.length === 0 ? 0.6 : 1,
          cursor: items.length === 0 ? "not-allowed" : "pointer",
        }}
      >
        Continuar al Pago
      </button>
    </main>
  );
}


function Row({ label, value, bold }) {
  return (
    <div style={sumRow}>
      <span>{label}</span>
      <strong style={{ fontSize: bold ? 18 : 14 }}>
        {value < 0 ? "-" : ""}${Math.abs(value).toLocaleString("es-AR")}
      </strong>
    </div>
  );
}

const row = {
  display: "grid",
  gridTemplateColumns: "56px 1fr auto auto auto",
  gap: 12,
  alignItems: "center",
  padding: 10,
  border: "1px solid #b8dfb8",
  borderRadius: 12,
  background: "#f7fff7",
};

const thumb = {
  width: 56,
  height: 56,
  objectFit: "cover",
  borderRadius: 10,
  border: "1px solid #e5e7eb",
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
};

const removeBtn = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
};

const opt = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: "12px 14px",
  background: "#fff",
};

const input = {
  width: "100%",
  maxWidth: 420,
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: "12px 14px",
  outline: "none",
};

const sumRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const checkoutBtn = {
  marginTop: 20,
  border: "none",
  background: "#22c55e",
  color: "#fff",
  padding: "14px 18px",
  borderRadius: 12,
  fontSize: 16,
  transition: "all 0.25s ease",
};

const label = { marginBottom: 6, fontWeight: 600, color: "#1f2937" };

const inputLg = {
  width: "100%",
  border: "1px solid #d1e7d3",
  background: "#f8fff8",
  borderRadius: 12,
  padding: "14px 16px",
  outline: "none",
  fontSize: 16,
};

export default Cart;

