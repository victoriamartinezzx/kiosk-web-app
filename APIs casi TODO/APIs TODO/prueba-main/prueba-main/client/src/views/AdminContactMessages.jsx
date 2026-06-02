import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContactMessages } from "../redux/contentSlice";

export default function AdminContactMessages() {
  const dispatch = useDispatch();
  const { contactMessages, loading } = useSelector((state) => state.content);

  useEffect(() => {
    dispatch(fetchContactMessages());
  }, [dispatch]);

  return (
    <main style={S.page}>
      <h1 style={S.title}>Mensajes de Contacto 📬</h1>

      {loading ? (
        <p style={{ textAlign: "center" }}>Cargando mensajes...</p>
      ) : (contactMessages || []).length === 0 ? (
        <p style={{ textAlign: "center" }}>No hay mensajes recibidos</p>
      ) : (
        <div style={S.tableContainer}>
          <table style={S.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Celular</th>
                <th>Mensaje</th>
              </tr>
            </thead>
            <tbody>
              {(contactMessages || []).map((msg) => (
                <tr key={msg.id}>
                  <td>{msg.nombre} {msg.apellido}</td>
                  <td>{msg.email}</td>
                  <td>{msg.celular || "-"}</td>
                  <td style={{ maxWidth: 350, whiteSpace: "pre-wrap" }}>{msg.mensaje}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

const S = {
  page: {
    background: "#f0fdf4",
    minHeight: "100vh",
    padding: "40px 0",
  },
  title: {
    textAlign: "center",
    fontSize: "1.8rem",
    marginBottom: 20,
    color: "#166534",
  },
  tableContainer: {
    display: "flex",
    justifyContent: "center",
  },
  table: {
    borderCollapse: "collapse",
    background: "#fff",
    width: "90%",
    maxWidth: 900,
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },
  th: {
    background: "#bbf7d0",
    padding: "10px",
    textAlign: "left",
  },
  td: {
    padding: "10px",
    borderTop: "1px solid #e5e7eb",
  },
};

