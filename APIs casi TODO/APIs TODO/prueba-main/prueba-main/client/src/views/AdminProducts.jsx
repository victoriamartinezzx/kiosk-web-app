import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { 
  fetchProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  uploadProductImage 
} from "../redux/productsSlice"; 

function getRoleFromToken(token) {
  try {
    if (!token) return null;
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;
    const decodedPayload = JSON.parse(atob(payloadBase64));
    return decodedPayload.userType || decodedPayload.role || null;
  } catch {
    return null;
  }
}

function AdminProducts() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { items: products } = useSelector((state) => state.products);
  const { items: categories } = useSelector((state) => state.categories);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    discount: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
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
        <p>Solo los administradores pueden gestionar productos.</p>
      </main>
    );
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.name.trim() || !newProduct.price || !newProduct.categoryId) {
      toast.error("Completá los campos obligatorios");
      return;
    }

    setLoading(true);

    try {
      const productData = {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock, 10) || 0,
        discount: newProduct.discount ? parseFloat(newProduct.discount) : 0,
        categoryId: parseInt(newProduct.categoryId, 10),
      };

      let saved;
      if (editingId) {
        saved = await dispatch(updateProduct({ id: editingId, productData, token })).unwrap();
        toast.success("Producto actualizado correctamente ✅");
      } else {
        saved = await dispatch(createProduct({ productData, token })).unwrap();
        toast.success("Producto agregado correctamente ✅");
      }

      if (newProduct.image) {
        await dispatch(uploadProductImage({ id: saved.id, imageFile: newProduct.image, token })).unwrap();
      }

      setNewProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
        discount: "",
        image: null,
      });
      setPreview(null);
      setEditingId(null);
    } catch (err) {
      toast.error("Error: " + err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (prod) => {
    setEditingId(prod.id);
    setNewProduct({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      stock: prod.stock,
      discount: prod.discount || "",
      categoryId: prod.category?.id || "",
      image: null,
    });
    setPreview(prod.imageUrl || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    toast.info(
      <div>
        <p style={{ marginBottom: '12px' }}>¿Seguro que querés eliminar este producto?</p>
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
                await dispatch(deleteProduct({ id, token })).unwrap();
                toast.success("Producto eliminado 🗑️");
                
              } catch (err) {
                toast.error("Error: " + err);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewProduct({ ...newProduct, image: file });
    setPreview(URL.createObjectURL(file));
  };

  return (
    <main style={S.page}>
      <h1 style={S.title}>Gestión de Productos 🛠️</h1>

      {editingId && (
        <div style={{
          background: "#fef3c7",
          border: "2px solid #facc15",
          borderRadius: 12,
          padding: "12px 20px",
          marginBottom: 20,
          textAlign: "center",
          fontWeight: "bold",
          color: "#92400e",
          maxWidth: 600,
          margin: "0 auto 20px auto",
        }}>
          ✏️ Editando producto #{editingId}
        </div>
      )}

      <form onSubmit={handleSubmit} style={S.form}>
        <label htmlFor="admin-product-name" style={{ fontWeight: 600, fontSize: 14, color: "#166534" }}>
          Nombre
        </label>
        <input
          id="admin-product-name"
          placeholder="Nombre"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          style={S.input}
          required
        />
        <label htmlFor="admin-product-description" style={{ fontWeight: 600, fontSize: 14, color: "#166534" }}>
          Descripción
        </label>
        <textarea
          id="admin-product-description"
          placeholder="Descripción"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          style={{ ...S.input, minHeight: 60 }}
        />
        <label htmlFor="admin-product-price" style={{ fontWeight: 600, fontSize: 14, color: "#166534" }}>
          Precio ($)
        </label>
        <input
          id="admin-product-price"
          type="number"
          placeholder="Precio ($)"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          style={S.input}
          required
        />
        <label htmlFor="admin-product-stock" style={{ fontWeight: 600, fontSize: 14, color: "#166534" }}>
          Stock
        </label>
        <input
          id="admin-product-stock"
          type="number"
          placeholder="Stock"
          value={newProduct.stock}
          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
          style={S.input}
        />
        <label htmlFor="admin-product-category" style={{ fontWeight: 600, fontSize: 14, color: "#166534" }}>
          Categoría
        </label>
        <select
          id="admin-product-category"
          value={newProduct.categoryId}
          onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
          style={S.input}
          required
        >
          <option value="">Seleccioná una categoría</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <label htmlFor="admin-product-discount" style={{ fontWeight: 600, fontSize: 14, color: "#166534" }}>
          Descuento (%)
        </label>
        <input
          id="admin-product-discount"
          type="number"
          placeholder="Descuento (%)"
          value={newProduct.discount}
          onChange={(e) => setNewProduct({ ...newProduct, discount: e.target.value })}
          style={S.input}
        />
        <label htmlFor="admin-product-image" style={{ fontWeight: 600, fontSize: 14, color: "#166534" }}>
          Imagen del producto
        </label>
        <input 
          id="admin-product-image"
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
          style={S.input} 
        />

        {preview && (
          <img
            src={preview}
            alt="Vista previa"
            style={{
              maxWidth: 200,
              borderRadius: 12,
              border: "1px solid #b8dfb8",
              marginTop: 10,
            }}
          />
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="submit"
            style={{
              ...S.button,
              background: editingId ? "#facc15" : "#16a34a",
              flex: 1,
            }}
            disabled={loading}
          >
            {loading
              ? "Guardando..."
              : editingId
              ? "Guardar cambios"
              : "Agregar producto"}
          </button>
          
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setNewProduct({
                  name: "",
                  description: "",
                  price: "",
                  stock: "",
                  categoryId: "",
                  discount: "",
                  image: null,
                });
                setPreview(null);
              }}
              style={{
                ...S.button,
                background: "#6b7280",
                flex: 0,
                minWidth: 120,
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <section style={S.tableWrap}>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={S.th}>ID</th>
              <th style={S.th}>Nombre</th>
              <th style={S.th}>Precio</th>
              <th style={S.th}>Stock</th>
              <th style={S.th}>Descuento</th>
              <th style={S.th}>Categoría</th>
              <th style={{ ...S.th, textAlign: "center" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr
                key={p.id}
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
                <td style={S.td}>{p.id}</td>
                <td style={S.td}>{p.name}</td>
                <td style={S.td}>${p.price}</td>
                <td style={S.td}>{p.stock}</td>
                <td style={S.td}>{p.discount ? `${p.discount}%` : "-"}</td>
                <td style={S.td}>{p.category?.name || "-"}</td>
                <td style={{ ...S.td, textAlign: "center" }}>
                  <button onClick={() => handleEdit(p)} style={S.editBtn}>
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(p.id)} style={S.delBtn}>
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
    minHeight: "100vh",
    padding: "40px 0 80px",
  },
  title: { textAlign: "center", fontSize: "2rem", marginBottom: 30 },
  form: {
    display: "grid",
    gap: 12,
    maxWidth: 700,
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
    background: "#fff",
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
    maxWidth: 950,
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

export default AdminProducts;
