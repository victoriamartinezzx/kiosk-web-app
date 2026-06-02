import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_BASE } from "../lib/api";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login, register } from "../redux/authSlice";

function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error } = useSelector((state) => state.auth);
  
  const [tab, setTab] = useState("login");

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const [nameR, setNameR] = useState("");
  const [surnameR, setSurnameR] = useState("");
  const [emailR, setEmailR] = useState("");
  const [passR, setPassR] = useState("");
  const [pass2R, setPass2R] = useState("");
  const [genderR, setGenderR] = useState("");
  const [birthDateR, setBirthDateR] = useState("");

  const from = location.state?.from || "/home";

  const submitLogin = async (e) => {
    e.preventDefault();
    
    dispatch(login({ email, password: pass }))
      .unwrap()
      .then((data) => {
        const decoded = data.user || {};
        toast.success(`¡Bienvenido/a, ${decoded?.name || 'usuario'}! 🟢`);
        navigate("/home", { replace: true });
      })
      .catch((err) => {
        toast.error("Algún dato es incorrecto ❌");
      });
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    if (passR !== pass2R) return toast.error("Las contraseñas no coinciden");
    if (!genderR) return toast.error("Por favor seleccioná un género");
    if (!birthDateR) return toast.error("Por favor ingresá tu fecha de nacimiento");

    const userData = {
      firstname: nameR,
      lastname: surnameR,
      email: emailR,
      password: passR,
      userType: "CLIENTE",
      gender: genderR,
      birthDate: birthDateR,
    };

    dispatch(register(userData))
      .unwrap()
      .then((data) => {
        const decoded = data.user || {};
        toast.success(`¡Bienvenido/a, ${decoded?.name || 'usuario'}! 🟢`);
        navigate("/home", { replace: true });
      })
      .catch((err) => {
        toast.error("Error al registrarse ❌");
      });
  };

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        background: "#bbf7d0",
        padding: 24,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "40px 50px",
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 4px 25px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img
            src="/kioscologo.png" 
            alt="KioscoYa"
            style={{ width: 80, marginBottom: 12 }}
          />
          <h1 style={{ color: "#166534", marginBottom: 10 }}>Bienvenido</h1>
          <p style={{ color: "#374151", marginBottom: 0 }}>
            {tab === "login"
              ? "Ingresá tus datos para acceder"
              : "Completá el formulario para registrarte"}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            borderBottom: "1px solid #e5e7eb",
            marginBottom: 20,
          }}
        >
          <button
            onClick={() => setTab("login")}
            style={{
              border: "none",
              background: "transparent",
              padding: "10px 16px",
              borderBottom: tab === "login" ? "3px solid #16a34a" : "none",
              color: tab === "login" ? "#166534" : "#6b7280",
              fontWeight: tab === "login" ? 600 : 500,
              cursor: "pointer",
            }}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => setTab("register")}
            style={{
              border: "none",
              background: "transparent",
              padding: "10px 16px",
              borderBottom: tab === "register" ? "3px solid #16a34a" : "none",
              color: tab === "register" ? "#166534" : "#6b7280",
              fontWeight: tab === "register" ? 600 : 500,
              cursor: "pointer",
            }}
          >
            Registrarse
          </button>
        </div>

    
        {tab === "login" ? (
          <form
            onSubmit={submitLogin}
            style={{
              display: "grid",
              gap: 12,
            }}
          >
            <label htmlFor="login-email" style={{ fontWeight: 600, marginBottom: -8 }}>
              Correo electrónico
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu correo electrónico"
              style={input}
              required
            />
            <label htmlFor="login-password" style={{ fontWeight: 600, marginBottom: -8 }}>
              Contraseña
            </label>
            <input
              id="login-password"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Ingresa tu contraseña"
              style={input}
              required
            />
            <button
              type="submit"
              style={btn}
              onMouseEnter={(e) => (e.currentTarget.style = Object.entries(btnHover).map(([k, v]) => `${k}:${v}`).join(";"))}
              onMouseLeave={(e) => (e.currentTarget.style = Object.entries(btn).map(([k, v]) => `${k}:${v}`).join(";"))}
              onMouseDown={(e) => (e.currentTarget.style = Object.entries(btnActive).map(([k, v]) => `${k}:${v}`).join(";"))}
              onMouseUp={(e) => (e.currentTarget.style = Object.entries(btnHover).map(([k, v]) => `${k}:${v}`).join(";"))}
            >
              Ingresar
            </button>

            <div style={{ textAlign: "center", marginTop: 16 }}>
              <button
                onClick={() => navigate("/")}
                style={{
                  background: "transparent",
                  border: "2px solid #16a34a",
                  color: "#16a34a",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                  transition: "all 0.3s ease",
                  width: "100%"
                }}
              >
                ← Volver a Inicio
              </button>
            </div>
          </form>
        ) : (
          
          <form
            onSubmit={submitRegister}
            style={{
              display: "grid",
              gap: 12,
            }}
          >
            <label htmlFor="register-name" style={{ fontWeight: 600, marginBottom: -8 }}>
              Nombre
            </label>
            <input
              id="register-name"
              placeholder="Ingresa tu nombre"
              value={nameR}
              onChange={(e) => setNameR(e.target.value)}
              style={input}
              required
            />
            <label htmlFor="register-surname" style={{ fontWeight: 600, marginBottom: -8 }}>
              Apellido
            </label>
            <input
              id="register-surname"
              placeholder="Ingresa tu apellido"
              value={surnameR}
              onChange={(e) => setSurnameR(e.target.value)}
              style={input}
              required
            />
            <label htmlFor="register-email" style={{ fontWeight: 600, marginBottom: -8 }}>
              Correo electrónico
            </label>
            <input
              id="register-email"
              type="email"
              placeholder="Ingresa tu correo electrónico"
              value={emailR}
              onChange={(e) => setEmailR(e.target.value)}
              style={input}
              required
            />
            <label htmlFor="register-password" style={{ fontWeight: 600, marginBottom: -8 }}>
              Contraseña
            </label>
            <input
              id="register-password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={passR}
              onChange={(e) => setPassR(e.target.value)}
              style={input}
              required
            />
            <label htmlFor="register-password2" style={{ fontWeight: 600, marginBottom: -8 }}>
              Repetir contraseña
            </label>
            <input
              id="register-password2"
              type="password"
              placeholder="Repetir contraseña"
              value={pass2R}
              onChange={(e) => setPass2R(e.target.value)}
              style={input}
              required
            />

            <label htmlFor="register-gender" style={{ fontWeight: 600, marginBottom: -8 }}>
              Género
            </label>
            <select
              id="register-gender"
              value={genderR}
              onChange={(e) => setGenderR(e.target.value)}
              style={{
                ...input,
                cursor: "pointer",
              }}
              required
            >
              <option value="">Seleccionar género...</option>
              <option value="FEMENINO">Femenino</option>
              <option value="MASCULINO">Masculino</option>
              <option value="OTROS">Otro</option>
            </select>

            <div style={{ marginTop: 4 }}>
              <label htmlFor="register-birthdate" style={{ fontSize: 14, color: "#374151", marginBottom: 6, display: "block", fontWeight: 600 }}>
                🎂 Fecha de nacimiento
              </label>
              <input
                id="register-birthdate"
                type="date"
                value={birthDateR}
                onChange={(e) => setBirthDateR(e.target.value)}
                style={input}
                required
              />
            </div>

            <button type="submit" style={btn}>
              Crear cuenta
            </button>
          </form>
        )}
      </div>
    </main>
  );
}


const input = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  outline: "none",
  fontSize: 15,
  background: "#f9fafb",
};

const btn = {
  border: "none",
  background: "#22c55e",
  color: "#fff",
  padding: "12px 14px",
  borderRadius: 10,
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.25s ease",
  boxShadow: "0 4px 10px rgba(34, 197, 94, 0.3)",
};


const btnHover = {
  ...btn,
  background: "#16a34a",
  boxShadow: "0 6px 14px rgba(22, 163, 74, 0.4)",
  transform: "translateY(-2px)",
};

const btnActive = {
  ...btn,
  background: "#15803d",
  transform: "translateY(1px)",
  boxShadow: "0 3px 8px rgba(21, 128, 61, 0.4)",
};


export default Auth;
