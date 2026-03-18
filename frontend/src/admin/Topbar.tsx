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

        <span>
          👤 {user?.user_metadata?.full_name || user?.email || 'Admin'}
        </span>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default Topbar;