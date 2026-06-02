import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchContactInfo, updateContactInfo } from "../redux/contentSlice";


export default function AdminContact() {
  const dispatch = useDispatch();
  const { contactInfo, loading } = useSelector((state) => state.content);
  const [form, setForm] = useState({
    email: "",
    telefono: "",
    direccion: "",
    horario: "",
  });



  useEffect(() => {
    if (contactInfo) {
      setForm({
        email: contactInfo.email || "",
        telefono: contactInfo.telefono || "",
        direccion: contactInfo.direccion || "",
        horario: contactInfo.horario || "",
      });
    }
  }, [contactInfo]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateContactInfo(form)).unwrap();
      toast.success("Información actualizada correctamente ✅");
    } catch (err) {
      console.error("Error al guardar info:", err);
      toast.error("No se pudo guardar la información 😞");
    }
  };

  return (
    <main style={S.page}>
      <h1 style={S.title}>Gestionar Información de Contacto</h1>

      <form onSubmit={handleSave} style={S.form}>
        <label htmlFor="admin-contact-email" style={S.label}>Email:</label>
        <input
          id="admin-contact-email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={S.input}
        />

        <label htmlFor="admin-contact-telefono" style={S.label}>Teléfono:</label>
        <input
          id="admin-contact-telefono"
          type="text"
          value={form.telefono}
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          style={S.input}
        />

        <label htmlFor="admin-contact-direccion" style={S.label}>Dirección:</label>
        <input
          id="admin-contact-direccion"
          type="text"
          value={form.direccion}
          onChange={(e) => setForm({ ...form, direccion: e.target.value })}
          style={S.input}
        />

        <label htmlFor="admin-contact-horario" style={S.label}>Horario:</label>
        <input
          id="admin-contact-horario"
          type="text"
          value={form.horario}
          onChange={(e) => setForm({ ...form, horario: e.target.value })}
          style={S.input}
        />

        <button type="submit" style={S.button}>
          Guardar cambios
        </button>
      </form>
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
  form: {
    display: "grid",
    gap: 12,
    width: 350,
    margin: "0 auto",
    background: "#dcfce7",
    padding: 24,
    borderRadius: 12,
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },
  label: {
    fontWeight: 600,
    color: "#14532d",
  },
  input: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #9fd8a5",
    fontSize: 14,
    background: "#fff",
  },
  button: {
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 14px",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    transition: "background 0.3s ease",
    marginTop: 10,
  },
};
