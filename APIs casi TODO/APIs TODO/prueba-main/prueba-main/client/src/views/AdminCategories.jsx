import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { 
  fetchCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from "../redux/categoriesSlice";

function getRoleFromToken(token) {
  try {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userType || payload.role || null;
  } catch {
    return null;
  }
}

function AdminCategories() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { items: categories } = useSelector((state) => state.categories);
  
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const role = getRoleFromToken(token);
    setIsAdmin(role === "ADMIN");
    

  }, [token]);

  if (!isAdmin) {
    return (
      <main style={{ padding: 40 }}>
        <h2>Acceso denegado 🚫</h2>
        <p>Solo los administradores pueden gestionar categorías.</p>
      </main>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim()) {
      toast.error("Completá todos los campos");
      return;
    }
    setLoading(true);

    try {
      if (editingId) {
        await dispatch(updateCategory({ id: editingId, categoryData: form, token })).unwrap();
        toast.success("Categoría actualizada correctamente");
      } else {
        await dispatch(createCategory({ categoryData: form, token })).unwrap();
        toast.success("Categoría creada ✅");
      }

      setForm({ name: "", description: "" });
      setEditingId(null);
    } catch {
      toast.error("Error al guardar la categoría");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, description: cat.description });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    toast.info(
      <div>
        <p style={{ marginBottom: '12px' }}>¿Seguro que querés eliminar esta categoría?</p>
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
            onClick={async () => {
              toast.dismiss();
              try {
                await dispatch(deleteCategory({ id, token })).unwrap();
                toast.success("Categoría eliminada 🗑️");
              } catch {
                toast.error("Error al eliminar la categoría");
              }
            }}
            style={{
              padding: '6px 12px',
              border: 'none',
              background: '#ef4444',
              color: 'white',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Eliminar
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
  };

  return (
    <main style={S.page}>
      <h1 style={S.title}>Gestión de Categorías 📂</h1>

      <form onSubmit={handleSubmit} style={S.form}>
        <label htmlFor="admin-category-name" style={{ fontWeight: 600, fontSize: 14, color: "#166534" }}>
          Nombre
        </label>
        <input
          id="admin-category-name"
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={S.input}
        />
        <label htmlFor="admin-category-description" style={{ fontWeight: 600, fontSize: 14, color: "#166534" }}>
          Descripción
        </label>
        <input
          id="admin-category-description"
          placeholder="Descripción"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={S.input}
        />
        <button
          type="submit"
          style={{
            ...S.button,
            background: editingId ? "#facc15" : "#16a34a",
          }}
          disabled={loading}
        >
          {loading
            ? "Guardando..."
            : editingId
            ? "Guardar cambios"
            : "Agregar categoría"}
        </button>
      </form>

      <section style={S.tableWrap}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>ID</th>
              <th style={S.th}>Nombre</th>
              <th style={S.th}>Descripción</th>
              <th style={{ ...S.th, textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, i) => (
              <tr
                key={cat.id}
                style={{
                  background: i % 2 === 0 ? "#f7fff7" : "#ffffff",
                  transition: "0.25s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#d9f7d9")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    i % 2 === 0 ? "#f7fff7" : "#ffffff")
                }
              >
                <td style={S.td}>{cat.id}</td>
                <td style={S.td}>{cat.name}</td>
                <td style={S.td}>{cat.description}</td>
                <td style={{ ...S.td, textAlign: "center" }}>
                  <button onClick={() => handleEdit(cat)} style={S.editBtn}>
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(cat.id)} style={S.delBtn}>
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

const S = {
  page: {
    background: "#d1f5d1",
    minHeight: "0vh",
    padding: "40px 0 80px",
  },
  title: { textAlign: "center", fontSize: "2rem", marginBottom: 30 },
  form: {
    display: "grid",
    gap: 12,
    maxWidth: 600,
    margin: "0 auto 40px",
    background: "#e9ffe9",
    padding: 24,
    borderRadius: 14,
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
  input: {
    padding: 12,
    borderRadius: 10,
    border: "1px solid #b8dfb8",
    outline: "none",
    fontSize: 15,
  },
  button: {
    border: "none",
    borderRadius: 10,
    color: "#fff",
    padding: "12px 14px",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 15,
  },
  tableWrap: {
    maxWidth: 800,
    margin: "0 auto",
    background: "#e9ffe9",
    padding: 20,
    borderRadius: 14,
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: 8, borderBottom: "2px solid #16a34a", color: "#14532d" },
  td: { padding: 10, borderBottom: "1px solid #b8dfb8" },
  editBtn: {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "6px 8px",
    marginRight: 4,
    cursor: "pointer",
  },
  delBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "6px 8px",
    cursor: "pointer",
  },
};

export default AdminCategories;

