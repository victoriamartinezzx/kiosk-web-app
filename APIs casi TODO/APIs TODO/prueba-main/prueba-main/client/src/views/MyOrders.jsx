import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserOrders } from "../redux/ordersSlice";

function getUserIdFromToken(token) {
  try {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
  } catch {
    return null;
  }
}

const orderStateConfig = {
  PENDIENTE: { label: "⏳ Pendiente", color: "#f59e0b", bg: "#fef3c7" },
  PAGADO: { label: "✅ Pagado", color: "#10b981", bg: "#d1fae5" },
  ENVIADO: { label: "🚚 En camino", color: "#3b82f6", bg: "#dbeafe" },
  ENTREGADO: { label: "📦 Entregado", color: "#8b5cf6", bg: "#ede9fe" },
  CANCELADO: { label: "❌ Cancelado", color: "#ef4444", bg: "#fee2e2" }
};

const deliveryMethodLabels = {
  ENVIO_DOMICILIO: "🏠 Envío a domicilio",
  RETIRO_SUCURSAL: "🏪 Retiro en sucursal"
};

function MyOrders() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { userOrders: orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    const userId = getUserIdFromToken(token);
    if (userId && token) {
      dispatch(fetchUserOrders({ userId, token }));
    }
  }, [token, dispatch]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS"
    }).format(price);
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <div style={{ fontSize: "24px" }}>⏳ Cargando pedidos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#ef4444" }}>
        <div style={{ fontSize: "20px", marginBottom: "20px" }}>{error}</div>
        <Link to="/auth" style={{ color: "#3b82f6", textDecoration: "underline" }}>
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: "1200px", 
      margin: "0 auto", 
      padding: "20px",
      minHeight: "70vh"
    }}>
      <h1 style={{ 
        fontSize: "32px", 
        fontWeight: "bold", 
        marginBottom: "30px",
        color: "#1f2937"
      }}>
        📦 Mis Pedidos
      </h1>

      {orders.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          background: "#f9fafb",
          borderRadius: "12px"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>🛒</div>
          <h2 style={{ fontSize: "24px", color: "#6b7280", marginBottom: "10px" }}>
            No tenés pedidos aún
          </h2>
          <p style={{ color: "#9ca3af", marginBottom: "20px" }}>
            ¡Explorá nuestros productos y realizá tu primera compra!
          </p>
          <Link
            to="/products"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              background: "#10b981",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600"
            }}
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {orders.map((order) => {
            const stateConfig = orderStateConfig[order.state] || orderStateConfig.PENDIENTE;
            
            return (
              <div
                key={order.id}
                style={{
                  background: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "24px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                  paddingBottom: "16px",
                  borderBottom: "1px solid #e5e7eb"
                }}>
                  <div>
                    <div style={{ fontSize: "18px", fontWeight: "bold", color: "#1f2937" }}>
                      Pedido #{order.number}
                    </div>
                    <div style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "8px 16px",
                      borderRadius: "20px",
                      background: stateConfig.bg,
                      color: stateConfig.color,
                      fontWeight: "600",
                      fontSize: "14px"
                    }}
                  >
                    {stateConfig.label}
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <div style={{ 
                    fontSize: "14px", 
                    color: "#6b7280",
                    marginBottom: "8px"
                  }}>
                    <strong>Método de entrega:</strong> {deliveryMethodLabels[order.deliveryMethod] || order.deliveryMethod}
                  </div>
                </div>

                {order.orderDetails && order.orderDetails.length > 0 && (
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ 
                      fontSize: "14px", 
                      fontWeight: "600", 
                      color: "#374151",
                      marginBottom: "12px"
                    }}>
                      Productos:
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {order.orderDetails.map((detail, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "12px",
                            background: "#f9fafb",
                            borderRadius: "8px"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            {detail.product?.imageUrl && (
                              <img
                                src={`${API_BASE}${detail.product.imageUrl}`}
                                alt={detail.product.name}
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                  borderRadius: "6px"
                                }}
                              />
                            )}
                            <div>
                              <div style={{ fontWeight: "500", color: "#1f2937" }}>
                                {detail.product?.name || "Producto"}
                              </div>
                              <div style={{ fontSize: "14px", color: "#6b7280" }}>
                                Cantidad: {detail.quantity}
                              </div>
                            </div>
                          </div>
                          <div style={{ fontWeight: "600", color: "#1f2937" }}>
                            {formatPrice(detail.subtotal)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "16px",
                  borderTop: "1px solid #e5e7eb"
                }}>
                  <div style={{ fontSize: "18px", fontWeight: "bold", color: "#1f2937" }}>
                    Total:
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: "bold", color: "#10b981" }}>
                    {formatPrice(order.totalAmount)}
                  </div>
                </div>

                {order.payment && (
                  <div style={{
                    marginTop: "12px",
                    padding: "12px",
                    background: "#f0fdf4",
                    borderRadius: "8px",
                    fontSize: "14px",
                    color: "#166534"
                  }}>
                    💳 Pagado con: {order.payment.method === "EFECTIVO" ? "Efectivo" : 
                      order.payment.method === "TARJETA_DE_CRÉDITO" ? "Tarjeta de crédito" :
                      order.payment.method === "TARJETA_DE_DÉBITO" ? "Tarjeta de débito" :
                      order.payment.method === "MERCADO_PAGO" ? "Mercado Pago" : order.payment.method}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
