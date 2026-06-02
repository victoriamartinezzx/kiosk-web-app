import { NavLink } from "react-router-dom";

function Navigation({ onLoginClick }) {
  return (
    <nav style={styles.nav}>
      <ul style={styles.list}>
        {["Inicio", "Productos", "Contacto", "Carrito"].map((item, i) => (
          <li key={i} style={styles.listItem}>
            <NavLink
              to={
                item === "Inicio"
                  ? "/home"
                  : item === "Productos"
                  ? "/products"
                  : item === "Contacto"
                  ? "/contact"
                  : "/cart"
              }
              style={({ isActive }) => ({
                ...styles.link,
                ...(isActive ? styles.active : {}),
              })}
            >
              {item}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const styles = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 50px",
    background: "#166534", 
    boxShadow: "0 3px 10px rgba(0, 0, 0, 0.15)",
  },

  list: {
    display: "flex",
    gap: 0,
    listStyle: "none",
    margin: 0,
    padding: 0,
  },

  listItem: {
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    borderRight: "1px solid rgba(255,255,255,0.3)",
  },

  link: {
    textDecoration: "none",
    color: "white",
    fontSize: 18,
    fontWeight: 600,
    padding: "8px 6px",
    position: "relative",
    transition: "all 0.25s ease",
  },

  active: {
    color: "#bbf7d0",
  },

  actions: {
    display: "flex",
    gap: 12,
  },

  adminBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 16px",
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 500,
    transition: "0.3s",
  },

  logoutBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 16px",
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 500,
    transition: "0.3s",
  },
};

const addHoverEffect = () => {
  const style = document.createElement("style");
  style.innerHTML = `
    a:hover {
      color: #bbf7d0 !important;
      transform: scale(1.07);
    }
    a::after {
      content: "";
      position: absolute;
      width: 0%;
      height: 2px;
      bottom: -4px;
      left: 0;
      background-color: #bbf7d0;
      transition: width 0.3s ease;
    }
    a:hover::after {
      width: 100%;
    }
    li:last-child {
      border-right: none !important;
    }
  `;
  document.head.appendChild(style);
};
addHoverEffect();

export default Navigation;

