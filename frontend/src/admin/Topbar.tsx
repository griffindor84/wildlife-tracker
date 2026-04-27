import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

type TopbarProps = {
  onToggleSidebar: () => void;
};

const Topbar = ({ onToggleSidebar }: TopbarProps) => {
  const { user, signOut } = useAuth();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/login';
  };

  return (
    <header className="topbar">
      <button className="collapse-btn" onClick={onToggleSidebar}>☰</button>

      <h1>Admin Dashboard</h1>

      <div className="topbar-right">
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        {user && (
          <span className="topbar-username">
            👤 {user.user_metadata?.full_name || user.email}
          </span>
        )}

        <button onClick={handleLogout} className="topbar-logout-btn">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;