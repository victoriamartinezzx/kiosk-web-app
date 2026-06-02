import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { createOrder, createOrderDetail, createPayment } from "../redux/ordersSlice";


function getUserIdFromToken(token) {
  try {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
  } catch {
    return null;
  }
}


const styles = {
  paymentButton: {
    flex: 1,
    padding: "12px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    background: "#fff",
    cursor: "pointer",
    transition: "all 0.2s",
    fontSize: "14px"
  },
  formGroup: {
    marginBottom: "16px",
    width: "100%"
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "14px",
    color: "#374151"
  },
  input: {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  }
};

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation() || {};
  const { token } = useSelector((state) => state.auth);


  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardData, setCardData] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: ""
  });


  const items     = state?.items ?? [];
  const delivery  = state?.delivery ?? "home";
  const coupon    = state?.coupon ?? "";
  const subtotal  = state?.subtotal ?? 0;
  const shipping  = state?.shipping ?? (delivery === "home" ? 300 : 0);
  const discount  = state?.discount ?? 0;
  const total     = state?.total ?? Math.max(0, subtotal + shipping - discount);
  const address   = state?.address ?? null; 


  const handleCardInput = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleFinishPurchase = async () => {
    try {
      const userId = getUserIdFromToken(token);

      if (!userId) {
        toast.error("Debe iniciar sesión para completar la compra");
        navigate("/auth");
        return;
      }

      if (!paymentMethod) {
        toast.error("Seleccione un método de pago");
        return;
      }


      if ((paymentMethod === "card" || paymentMethod === "mercadopago") && 
          (!cardData.cardName || !cardData.cardNumber || !cardData.expiry || !cardData.cvv)) {
        toast.error("Complete todos los datos de la tarjeta");
        return;
      }


      const deliveryMethodEnum = delivery === "home" ? "ENVIO_DOMICILIO" : "RETIRO_SUCURSAL";

      
      const dniValue = state?.dni ? parseInt(state.dni) : 0;
      const orderPayload = {
        userId: userId,
        deliveryMethod: deliveryMethodEnum,
        dniUser: dniValue,
       
        address: delivery === "home" && address ? address : null
      };

      const order = await dispatch(createOrder({ orderData: orderPayload, token })).unwrap();

      
      for (const item of items) {
        const detailPayload = {
          orderId: order.id,
          productId: item.id,
          quantity: item.qty
        };

        await dispatch(createOrderDetail({ detailData: detailPayload, token })).unwrap();
      }

     
      const paymentMethodMap = {
        "cash": "EFECTIVO",
        "card": "TARJETA_DE_CRÉDITO",
        "mercadopago": "MERCADO_PAGO"
      };

      const paymentPayload = {
        orderId: order.id,
        paymentMethod: paymentMethodMap[paymentMethod] || "EFECTIVO",
        amount: total,
        dni: parseInt(state?.dni) || 0
      };

      await dispatch(createPayment({ paymentData: paymentPayload, token })).unwrap();

      toast.success("¡Compra realizada exitosamente! 🎉");
      setTimeout(() => navigate("/my-orders"), 1500);
    } catch (error) {
      console.error("Error completo:", error);
      toast.error(error.message || "Error al procesar la compra. Intente nuevamente.");
    }
  };

  return (
    <main className="container" style={{ padding: "32px 0 40px" }}>
      <h1>¡Gracias por tu compra! 🛍️</h1>

      <section style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, marginTop: 0 }}>
        <h3>Resumen del pedido</h3>
        <ul style={{ marginTop: 12 }}>
          <li><strong>Artículos:</strong> {items.length}</li>
          <li><strong>Entrega:</strong> {delivery === "home" ? "A domicilio" : "Retiro en tienda"}</li>
          {coupon && <li><strong>Cupón:</strong> {coupon}</li>}
          <li><strong>Subtotal:</strong> ${subtotal.toLocaleString("es-AR")}</li>
          <li><strong>Envío:</strong> ${shipping.toLocaleString("es-AR")}</li>
          <li><strong>Descuento:</strong> -${discount.toLocaleString("es-AR")}</li>
          <li style={{ marginTop: 8, fontSize: 18 }}>
            <strong>Total:</strong> ${total.toLocaleString("es-AR")}
          </li>
        </ul>
      </section>

      {/* Método de pago */}
      <section style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, marginTop: 20 }}>
        <h3>Método de pago</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <button
              onClick={() => setPaymentMethod("cash")}
              style={{
                padding: "12px",
                flex: 1,
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                background: paymentMethod === "cash" ? "#dcfce7" : "#fff",
                cursor: "pointer",
                transition: "all 0.2s",
                fontSize: "14px"
              }}
            >
              Efectivo
            </button>
            <button
              onClick={() => setPaymentMethod("card")}
              style={{
                padding: "12px",
                flex: 1,
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                background: paymentMethod === "card" ? "#dcfce7" : "#fff",
                cursor: "pointer",
                transition: "all 0.2s",
                fontSize: "14px"
              }}
            >
              Tarjeta de crédito/débito
            </button>
            <button
              onClick={() => setPaymentMethod("mercadopago")}
              style={{
                padding: "12px",
                flex: 1,
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                background: paymentMethod === "mercadopago" ? "#dcfce7" : "#fff",
                cursor: "pointer",
                transition: "all 0.2s",
                fontSize: "14px"
              }}
            >
              Mercado Pago
            </button>
          </div>

      
          {(paymentMethod === "card" || paymentMethod === "mercadopago") && (
            <div style={{ 
              marginTop: 20, 
              padding: 20, 
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              background: "#f9fafb"
            }}>
              <div style={{ marginBottom: 16 }}>
                <label htmlFor="checkout-card-name" style={{ 
                  display: "block",
                  marginBottom: 6,
                  fontSize: 14,
                  color: "#374151"
                }}>
                  Nombre en la tarjeta
                </label>
                <input
                  id="checkout-card-name"
                  type="text"
                  name="cardName"
                  value={cardData.cardName}
                  onChange={handleCardInput}
                  placeholder="Como aparece en la tarjeta"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 6,
                    fontSize: 14
                  }}
                />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label htmlFor="checkout-card-number" style={{ 
                  display: "block",
                  marginBottom: 6,
                  fontSize: 14,
                  color: "#374151"
                }}>
                  Número de tarjeta
                </label>
                <input
                  id="checkout-card-number"
                  type="text"
                  name="cardNumber"
                  value={cardData.cardNumber}
                  onChange={handleCardInput}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "1px solid #e5e7eb",
                    borderRadius: 6,
                    fontSize: 14
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <label htmlFor="checkout-card-expiry" style={{ 
                    display: "block",
                    marginBottom: 6,
                    fontSize: 14,
                    color: "#374151"
                  }}>
                    MM/YY
                  </label>
                  <input
                    id="checkout-card-expiry"
                    type="text"
                    name="expiry"
                    value={cardData.expiry}
                    onChange={handleCardInput}
                    placeholder="MM/YY"
                    maxLength="5"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: 6,
                      fontSize: 14
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label htmlFor="checkout-card-cvv" style={{ 
                    display: "block",
                    marginBottom: 6,
                    fontSize: 14,
                    color: "#374151"
                  }}>
                    CVV
                  </label>
                  <input
                    id="checkout-card-cvv"
                    type="text"
                    name="cvv"
                    value={cardData.cvv}
                    onChange={handleCardInput}
                    placeholder="123"
                    maxLength="4"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: 6,
                      fontSize: 14
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      
      <button
        onClick={handleFinishPurchase}
        style={{ 
          border: "none", 
          background: "#22c55e", 
          color: "#fff", 
          padding: "12px 18px", 
          borderRadius: 10, 
          marginTop: 16, 
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "600"
        }}
      >
        Confirmar y pagar
      </button>
    </main>
  );
}

export default Checkout;