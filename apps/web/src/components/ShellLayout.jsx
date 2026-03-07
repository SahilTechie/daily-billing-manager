import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const tabs = [
  { to: "/", label: "Home", icon: "🏠" },
  { to: "/bills", label: "Bills", icon: "📄" },
  { to: "/customers", label: "Customers", icon: "👥" },
  { to: "/pending", label: "Pending", icon: "⏱️" },
];

const ShellLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="avatar">CS</div>
          <div className="brand-title">{user?.shopName || "Chicken Shop"}</div>
        </div>
        <button
          className="logout"
          onClick={() => {
            logout();
            navigate("/login");
          }}
          title="Logout"
        >
          ↪
        </button>
      </header>

      <main className="content">{children}</main>

      <nav className="bottom-nav">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === "/"}
            className={({ isActive }) => `tab ${isActive ? "active" : ""}`}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default ShellLayout;
