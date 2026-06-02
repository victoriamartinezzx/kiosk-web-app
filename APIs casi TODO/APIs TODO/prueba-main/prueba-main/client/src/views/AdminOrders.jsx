import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateOrderState } from "../redux/ordersSlice";
import { API_BASE } from "../lib/api";

const orderStateConfig = {
  PENDIENTE: { 
    label: "⏳ Pendiente", 
    color: "#f59e0b", 
    bg: "#fef3c7",
    canChangeTo: ["PAGADO", "CANCELADO"]
  },
  PAGADO: { 
    label: "✅ Pagado", 
    color: "#10b981", 
    bg: "#d1fae5",
    canChangeTo: ["ENVIADO"]
  },
  ENVIADO: { 
    label: "🚚 En camino", 
    color: "#3b82f6", 
    bg: "#dbeafe",
    canChangeTo: ["ENTREGADO"]
  },
  ENTREGADO: { 
    label: "📦 Entregado", 
    color: "#8b5cf6", 
    bg: "#ede9fe",
    canChangeTo: []
  },
  CANCELADO: { 
    label: "❌ Cancelado", 
    color: "#ef4444", 
    bg: "#fee2e2",
    canChangeTo: []
  }
};

const deliveryMethodLabels = {
  ENVIO_DOMICILIO: "🏠 Envío a domicilio",
  RETIRO_SUCURSAL: "🏪 Retiro en sucursal"
};

function AdminOrders() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { allOrders, loading } = useSelector((state) => state.orders);
  
  const [filterState, setFilterState] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);


  const changeOrderState = async (orderId, newState) => {
    try {
      await dispatch(updateOrderState({ orderId, newState, token })).unwrap();
      toast.success(`Estado actualizado a ${orderStateConfig[newState].label}`);
    } catch (err) {
      console.error("Error:", err);
      toast.error(err || "No se pudo cambiar el estado del pedido");
    }
  };

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

  const sortedOrders = [...allOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const filteredOrders = filterState === "all" 
    ? sortedOrders 
    : sortedOrders.filter(order => order.state === filterState);

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <div style={{ fontSize: "24px" }}>⏳ Cargando pedidos...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: "1400px", 
      margin: "0 auto", 
      padding: "20px",
      minHeight: "70vh"
    }}>
      <h1 style={{ 
        fontSize: "32px", 
        fontWeight: "bold", 
        marginBottom: "20px",
        color: "#1f2937"
      }}>
        🛍️ Gestión de Pedidos
      </h1>
      <div style={{ 
        display: "flex", 
        gap: "10px", 
        marginBottom: "30px",
        flexWrap: "wrap"
      }}>
        <button
          onClick={() => setFilterState("all")}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: filterState === "all" ? "2px solid #3b82f6" : "1px solid #e5e7eb",
            background: filterState === "all" ? "#dbeafe" : "white",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          Todos ({allOrders.length})
        </button>
        {Object.entries(orderStateConfig).map(([state, config]) => {
          const count = allOrders.filter(o => o.state === state).length;
          return (
            <button
              key={state}
              onClick={() => setFilterState(state)}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: filterState === state ? `2px solid ${config.color}` : "1px solid #e5e7eb",
                background: filterState === state ? config.bg : "white",
                cursor: "pointer",
                fontWeight: "600",
                color: filterState === state ? config.color : "#6b7280"
              }}
            >
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {filteredOrders.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          background: "#f9fafb",
          borderRadius: "12px"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>📦</div>
          <h2 style={{ fontSize: "24px", color: "#6b7280" }}>
            No hay pedidos en este estado
          </h2>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {filteredOrders.map((order) => {
            const stateConfig = orderStateConfig[order.state];
            const isExpanded = expandedOrder === order.id;
            const canChange = stateConfig.canChangeTo.length > 0;
            
            return (
              <div
                key={order.id}
                style={{
                  background: "white",
                  border: "2px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "24px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                  paddingBottom: "16px",
                  borderBottom: "2px solid #e5e7eb"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <div>
                      <div style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937" }}>
                        Pedido #{order.number}
                      </div>
                      <div style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "10px 20px",
                        borderRadius: "20px",
                        background: stateConfig.bg,
                        color: stateConfig.color,
                        fontWeight: "700",
                        fontSize: "15px"
                      }}
                    >
                      {stateConfig.label}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      background: "white",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}
                  >
                    {isExpanded ? "▲ Ocultar" : "▼ Ver detalles"}
                  </button>
                </div>

                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "16px",
                  marginBottom: "16px"
                }}>
                  <div>
                    <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>
                      Cliente
                    </div>
                    <div style={{ fontWeight: "600", color: "#1f2937" }}>
                      {order.user?.name} {order.user?.surname}
                    </div>
                    <div style={{ fontSize: "14px", color: "#6b7280" }}>
                      {order.user?.email}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>
                      Entrega
                    </div>
                    <div style={{ fontWeight: "600", color: "#1f2937" }}>
                      {deliveryMethodLabels[order.deliveryMethod] || order.deliveryMethod}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>
                      Total
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: "bold", color: "#10b981" }}>
                      {formatPrice(order.totalAmount)}
                    </div>
                  </div>

                  {order.payment && (
                    <div>
                      <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>
                        Método de pago
                      </div>
                      <div style={{ fontWeight: "600", color: "#1f2937" }}>
                        {order.payment.method === "EFECTIVO" ? "💵 Efectivo" : 
                         order.payment.method === "TARJETA_DE_CRÉDITO" ? "💳 Tarjeta de crédito" :
                         order.payment.method === "TARJETA_DE_DÉBITO" ? "💳 Tarjeta de débito" :
                         order.payment.method === "MERCADO_PAGO" ? "💚 Mercado Pago" : order.payment.method}
                      </div>
                    </div>
                  )}
                </div>

                {isExpanded && (
                  <div style={{ 
                    marginTop: "20px", 
                    paddingTop: "20px", 
                    borderTop: "2px solid #e5e7eb" 
                  }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "12px" }}>
                      Productos del pedido:
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {order.orderDetails?.map((detail, idx) => (
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
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                  border: "1px solid #e5e7eb"
                                }}
                              />
                            )}
                            <div>
                              <div style={{ fontWeight: "600", color: "#1f2937" }}>
                                {detail.product?.name || "Producto"}
                              </div>
                              <div style={{ fontSize: "14px", color: "#6b7280" }}>
                                Cantidad: {detail.quantity} × {formatPrice(detail.product?.price || 0)}
                              </div>
                            </div>
                          </div>
                          <div style={{ fontWeight: "700", fontSize: "16px", color: "#1f2937" }}>
                            {formatPrice(detail.subtotal)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {canChange && (
                  <div style={{ 
                    marginTop: "20px", 
                    paddingTop: "20px", 
                    borderTop: "2px solid #e5e7eb" 
                  }}>
                    <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", color: "#374151" }}>
                      Cambiar estado a:
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      {stateConfig.canChangeTo.map(newState => {
                        const newStateConfig = orderStateConfig[newState];
                        return (
                          <button
                            key={newState}
                            onClick={() => {
                              toast.info(
                                <div>
                                  <p style={{ marginBottom: '12px' }}>¿Cambiar estado a {newStateConfig.label}?</p>
                                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    <button
                                      onClick={() => toast.dismiss()}
                                      style={{
                                        padding: '6px 12px',
                                        border: '1px solid #ccc',
                                        background: 'white',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      Cancelar
                                    </button>
                                    <button
                                      onClick={() => {
                                        toast.dismiss();
                                        changeOrderState(order.id, newState);
                                      }}
                                      style={{
                                        padding: '6px 12px',
                                        border: 'none',
                                        background: newStateConfig.color,
                                        color: 'white',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      Confirmar
                                    </button>
                                  </div>
                                </div>,
                                {
                                  position: "top-center",
                                  autoClose: false,
                                  closeButton: false,
                                  closeOnClick: false,
                                  draggable: false,
                                }
                              );
                            }}
                            style={{
                              padding: "12px 24px",
                              borderRadius: "8px",
                              border: "none",
                              background: newStateConfig.color,
                              color: "white",
                              cursor: "pointer",
                              fontWeight: "700",
                              fontSize: "14px",
                              transition: "transform 0.2s"
                            }}
                            onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                            onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                          >
                            {newStateConfig.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {!canChange && (
                  <div style={{
                    marginTop: "16px",
                    padding: "12px",
                    background: stateConfig.bg,
                    borderRadius: "8px",
                    color: stateConfig.color,
                    fontSize: "14px",
                    fontWeight: "600",
                    textAlign: "center"
                  }}>
                    {order.state === "ENTREGADO" 
                      ? "✅ Pedido completado - No se pueden realizar más cambios" 
                      : "❌ Pedido cancelado - No se pueden realizar más cambios"}
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

export default AdminOrders;
