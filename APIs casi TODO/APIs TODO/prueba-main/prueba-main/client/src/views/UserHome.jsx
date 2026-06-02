import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { fetchUserProfile, updateUserProfile } from "../redux/usersSlice";
import { login } from "../redux/authSlice";

export default function UserHome() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { currentUserProfile, loading } = useSelector((state) => state.users);
  
  const [user, setUser] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    birthDate: "",
    gender: "",
  });

  useEffect(() => {
    if (token) {
      dispatch(fetchUserProfile())
        .unwrap()
        .catch((err) => {
          console.error(err);
          toast.error("No se pudieron cargar tus datos");
        });
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (currentUserProfile) {
      const formattedData = {
        ...currentUserProfile,
        birthDate: currentUserProfile.birthDate || "",
        gender: currentUserProfile.gender || "",
      };
      setUser(formattedData);
    }
  }, [currentUserProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    dispatch(updateUserProfile(user))
      .unwrap()
      .then((data) => {
   
        if (data.token) {
          dispatch(login({ token: data.token, user: data }));
        }
        
        toast.success("Datos actualizados correctamente ✅");

        window.dispatchEvent(new Event("loginChange"));
      })
      .catch((err) => {
        toast.error(err || "Error al actualizar datos");
      });
  };

  return (
    <main style={S.page}>
      <h1 style={S.title}>Mi Perfil 👤</h1>

      <form onSubmit={handleSubmit} style={S.form}>
        <label htmlFor="user-name" style={{ fontSize: "14px", color: "#166534", fontWeight: 600 }}>
          Nombre
        </label>
        <input
          id="user-name"
          name="name"
          placeholder="Nombre"
          value={user.name || ""}
          onChange={handleChange}
          style={S.input}
          required
        />
        <label htmlFor="user-surname" style={{ fontSize: "14px", color: "#166534", fontWeight: 600 }}>
          Apellido
        </label>
        <input
          id="user-surname"
          name="surname"
          placeholder="Apellido"
          value={user.surname || ""}
          onChange={handleChange}
          style={S.input}
          required
        />
        <label htmlFor="user-email" style={{ fontSize: "14px", color: "#166534", fontWeight: 600 }}>
          Correo electrónico
        </label>
        <input
          id="user-email"
          name="email"
          placeholder="Email"
          type="email"
          value={user.email || ""}
          onChange={handleChange}
          style={S.input}
          required
        />
        <label htmlFor="user-phone" style={{ fontSize: "14px", color: "#166534", fontWeight: 600 }}>
          Teléfono (opcional)
        </label>
        <input
          id="user-phone"
          name="phone"
          placeholder="Teléfono (opcional)"
          type="tel"
          value={user.phone || ""}
          onChange={handleChange}
          style={S.input}
        />
        <label htmlFor="user-birthdate" style={{ fontSize: "14px", color: "#166534", fontWeight: 600 }}>
          Fecha de nacimiento (opcional)
        </label>
        <input
          id="user-birthdate"
          name="birthDate"
          type="date"
          value={user.birthDate || ""}
          onChange={handleChange}
          style={S.input}
        />
        <label htmlFor="user-gender" style={{ fontSize: "14px", color: "#166534", fontWeight: 600 }}>
          Género
        </label>
        <select
          id="user-gender"
          name="gender"
          value={user.gender || ""}
          onChange={handleChange}
          style={S.input}
          required
        >
          <option value="">Seleccionar...</option>
          <option value="MASCULINO">Masculino</option>
          <option value="FEMENINO">Femenino</option>
          <option value="OTROS">Otros</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...S.button,
            background: "#16a34a",
          }}
        >
          {loading ? "Guardando..." : "Actualizar datos"}
        </button>
      </form>
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
    gap: 14,
    maxWidth: 500,
    margin: "0 auto",
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
};
