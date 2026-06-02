import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchContactInfo, sendContactMessage } from "../redux/contentSlice";

export default function Contact() {
  const dispatch = useDispatch();
  const { contactInfo } = useSelector((state) => state.content);
  
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    celular: "",
    email: "",
    mensaje: "",
  });

  const [info, setInfo] = useState({
    email: "",
    telefono: "",
    direccion: "",
    horario: "",
  });

  useEffect(() => {
    if (contactInfo) {
      setInfo({
        email: contactInfo.email || "",
        telefono: contactInfo.telefono || contactInfo.phone || "",
        direccion: contactInfo.direccion || contactInfo.address || "",
        horario: contactInfo.horario || contactInfo.schedule || "",
      });
    }
  }, [contactInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.mensaje) {
      toast.warn("Por favor completá los campos obligatorios");
      return;
    }

    try {
      await dispatch(sendContactMessage(form)).unwrap();
      toast.success("Mensaje enviado correctamente ✅");
      setForm({
        nombre: "",
        apellido: "",
        celular: "",
        email: "",
        mensaje: "",
      });
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
      toast.error("No se pudo enviar el mensaje 😞");
    }
  };

  return (
    <main style={S.page}>
      <h1 style={S.title}>Contáctanos 📬</h1>

      <div style={S.container}>
        <form onSubmit={handleSubmit} style={S.form}>
          <label htmlFor="contact-nombre" style={{ fontWeight: 600, fontSize: 14, color: "#166534" }}>
            Nombre
          </label>
          <input
            id="contact-nombre"
            type="text"
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            style={S.input}
            required
          />
          <label htmlFor="contact-apellido" style={{ fontWeight: 600, fontSize: 14, color: "#166534" }}>
            Apellido
          </label>
          <input
            id="contact-apellido"
            type="text"
            placeholder="Apellido"
            value={form.apellido}
            onChange={(e) => setForm({ ...form, apellido: e.target.value })}
            style={S.input}
          />
          <label htmlFor="contact-celular" style={{ fontWeight: 600, fontSize: 14, color: "#166534" }}>
            Celular
          </label>
          <input
            id="contact-celular"
            type="text"
            placeholder="Celular"
            value={form.celular}
            onChange={(e) => setForm({ ...form, celular: e.target.value })}
            style={S.input}
          />
          <label htmlFor="contact-email" style={{ fontWeight: 600, fontSize: 14, color: "#166534" }}>
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={S.input}
            required
          />
          <label htmlFor="contact-mensaje" style={{ fontWeight: 600, fontSize: 14, color: "#166534" }}>
            Mensaje
          </label>
          <textarea
            id="contact-mensaje"
            placeholder="Escribí tu mensaje..."
            value={form.mensaje}
            onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
            style={{ ...S.input, minHeight: 80, resize: "vertical" }}
            required
          />
          <button type="submit" style={S.button}>
            Enviar mensaje
          </button>
        </form>

        <div style={S.infoBox}>
          <h3>Información de contacto</h3>
          <p>
            <strong>Email:</strong> {info.email || "-"}
          </p>
          <p>
            <strong>Teléfono:</strong> {info.telefono || "-"}
          </p>
          <p>
            <strong>Dirección:</strong> {info.direccion || "-"}
          </p>
          <p>
            <strong>Horario:</strong> {info.horario || "-"}
          </p>
        </div>
      </div>
    </main>
  );
}

const S = {
  page: {
    background: "#c7f9cc",
    minHeight: "100vh",
    padding: "40px 0 80px",
  },
  title: {
    textAlign: "center",
    fontSize: "2rem",
    marginBottom: 30,
    fontWeight: 700,
    color: "#14532d",
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 40,
    flexWrap: "wrap",
  },
  form: {
    display: "grid",
    gap: 12,
    background: "#e9ffe9",
    padding: 24,
    borderRadius: 14,
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    width: 300,
  },
  input: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #b8dfb8",
    outline: "none",
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
  },
  infoBox: {
    background: "#e9ffe9",
    padding: 24,
    borderRadius: 14,
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    minWidth: 260,
    height: "fit-content",
  },
};
