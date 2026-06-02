import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FaUsersCog, FaShoppingBag, FaSearch } from "react-icons/fa";

function getRoleFromToken(token) {
  try {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userType || payload.role || null;
  } catch {
    return null;
  }
}

function AdminUsers() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { allUsers, loading: usersLoading } = useSelector((state) => state.users);
  const { allOrders, loading: ordersLoading } = useSelector((state) => state.orders);
  
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState(""); 
  const [isAdmin, setIsAdmin] = useState(false);
  const [userOrders, setUserOrders] = useState({}); 

  useEffect(() => {
    const role = getRoleFromToken(token);
    setIsAdmin(role === "ADMIN");
  }, [token]);


  useEffect(() => {
    if (allUsers.length > 0 && allOrders.length > 0) {
      const ordersByUser = {};
      allOrders.forEach((order) => {
        const userId = order.user?.id;
        if (!userId) return;
        
        if (!ordersByUser[userId]) {
          ordersByUser[userId] = {
            total: 0,
            lastOrder: null,
          };
        }
        
        ordersByUser[userId].total += 1;
        
        if (!ordersByUser[userId].lastOrder || 
            new Date(order.createdAt) > new Date(ordersByUser[userId].lastOrder.createdAt)) {
          ordersByUser[userId].lastOrder = order;
        }
      });
      
      setFiltered(allUsers);
      setUserOrders(ordersByUser);
    }
  }, [allUsers, allOrders]);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(allUsers);
    } else {
      const lower = search.toLowerCase();
      setFiltered(
        allUsers.filter(
          (u) =>
            (u.name && u.name.toLowerCase().includes(lower)) ||
            (u.email && u.email.toLowerCase().includes(lower)) ||
            (u.role && u.role.toLowerCase().includes(lower))
        )
      );
    }
  }, [search, allUsers]);

  if (!isAdmin)
    return (
      <main style={S.page}>
        <h2 style={S.denied}>🚫 Solo los administradores pueden acceder aquí.</h2>
      </main>
    );

  if (usersLoading || ordersLoading)
    return (
      <main style={S.page}>
        <section style={S.card}>
          <h2 style={S.loading}>
            <FaUsersCog style={{ marginRight: 10, color: "#166534" }} />
            Cargando usuarios y pedidos...
          </h2>
        </section>
      </main>
    );

  return (
    <main style={S.page}>
      <section style={S.card}>
        <h1 style={S.title}>
          <FaUsersCog style={{ color: "#166534", marginRight: 10 }} />
          Gestión de Usuarios
        </h1>

        <div style={S.statsContainer}>
          <div style={S.statCard}>
            <div style={S.statLabel}>Total Usuarios</div>
            <div style={S.statValue}>{allUsers.length}</div>
          </div>
          <div style={S.statCard}>
            <div style={S.statLabel}>Total Pedidos</div>
            <div style={S.statValue}>
              {Object.values(userOrders).reduce((sum, u) => sum + u.total, 0)}
            </div>
          </div>
          <div style={S.statCard}>
            <div style={S.statLabel}>Usuarios con Pedidos</div>
            <div style={S.statValue}>
              {Object.keys(userOrders).length}
            </div>
          </div>
        </div>

        <div style={S.searchBar}>
          <FaSearch style={{ marginRight: 8, color: "#166534" }} />
          <label htmlFor="admin-users-search" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>
            Buscar usuarios
          </label>
          <input
            id="admin-users-search"
            type="text"
            placeholder="Buscar por nombre, email o rol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={S.searchInput}
          />
        </div>

        {filtered.length === 0 ? (
          <p style={S.empty}>No hay usuarios que coincidan con la búsqueda.</p>
        ) : (
          <div style={S.tableWrap}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Pedidos totales</th>
                  <th>Estado del pedido actual</th>
                  <th>Fecha de registro</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr
                    key={u.id}
                    style={{
                      background: i % 2 === 0 ? "#f8fff8" : "#ffffff",
                      transition: "0.2s",
                      textAlign: "center",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#dcfce7")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        i % 2 === 0 ? "#f8fff8" : "#ffffff")
                    }
                  >
                    <td>{u.id}</td>
                    <td>{u.name || "-"}</td>
                    <td>{u.email}</td>
                    <td>
                      <span
                        style={{
                          ...S.role,
                          background:
                            u.role === "ADMIN" ? "#fde68a" : "#bbf7d0",
                          color:
                            u.role === "ADMIN" ? "#92400e" : "#166534",
                        }}
                      >
                        {u.role || u.userType}
                      </span>
                    </td>
                    <td>
                      <span style={S.badge}>
                        <FaShoppingBag style={{ marginRight: 6 }} />
                        {userOrders[u.id]?.total || 0}
                      </span>
                    </td>
                    <td>
                      {(() => {
                        const lastOrder = userOrders[u.id]?.lastOrder;
                        const status = lastOrder?.state || null;
                        
                        if (!status) {
                          return (
                            <span style={{
                              ...S.status,
                              background: "#e5e7eb",
                              color: "#6b7280",
                            }}>
                              Sin pedidos
                            </span>
                          );
                        }
                        
                        const statusColors = {
                          PENDIENTE: { bg: "#fef08a", text: "#854d0e" },
                          PAGADO: { bg: "#bfdbfe", text: "#1e40af" },
                          ENVIADO: { bg: "#c7d2fe", text: "#3730a3" },
                          ENTREGADO: { bg: "#bbf7d0", text: "#166534" },
                          CANCELADO: { bg: "#fecaca", text: "#991b1b" },
                        };
                        
                        const colors = statusColors[status] || { bg: "#e5e7eb", text: "#374151" };
                        
                        return (
                          <span style={{
                            ...S.status,
                            background: colors.bg,
                            color: colors.text,
                          }}>
                            {status}
                          </span>
                        );
                      })()}
                    </td>
                    <td>
                      {new Date(
                        u.createdAt || u.registerDate || Date.now()
                      ).toLocaleDateString("es-AR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

const S = {
  page: {
    background: "linear-gradient(180deg, #bbf7d0 0%, #d9f99d 100%)",
    minHeight: "100vh",
    padding: "50px 0",
    display: "flex",
    justifyContent: "center",
  },
  card: {
    background: "#ffffff",
    borderRadius: 16,
    padding: 30,
    width: "95%",
    maxWidth: 1200,
    boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    color: "#14532d",
    fontSize: "1.8rem",
    fontWeight: "700",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 15,
    marginBottom: 25,
  },
  statCard: {
    background: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
    borderRadius: 12,
    padding: 20,
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  statLabel: {
    fontSize: "0.85rem",
    color: "#166534",
    fontWeight: "600",
    marginBottom: 8,
  },
  statValue: {
    fontSize: "2rem",
    color: "#14532d",
    fontWeight: "700",
  },
  searchBar: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #a7f3d0",
    borderRadius: 12,
    padding: "6px 10px",
    marginBottom: 20,
    background: "#ecfdf5",
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "0.95rem",
  },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  role: { padding: "4px 10px", borderRadius: 12, fontWeight: "600" },
  badge: {
    background: "#dcfce7",
    color: "#166534",
    borderRadius: 20,
    padding: "6px 12px",
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  status: {
    padding: "5px 10px",
    borderRadius: 12,
    fontWeight: "600",
    fontSize: "0.9rem",
    textTransform: "capitalize",
  },
  empty: { textAlign: "center", color: "#555", padding: 20 },
  denied: { textAlign: "center", color: "#b91c1c" },
  loading: { 
    textAlign: "center", 
    color: "#166534",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default AdminUsers;



