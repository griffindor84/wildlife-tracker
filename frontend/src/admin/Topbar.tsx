import { useEffect, useState } from "react";

type TopbarProps = {
  onToggleSidebar: () => void;
};

const Topbar = ({ onToggleSidebar }: TopbarProps) => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <header className="topbar">
      {/* 🔥 Collapse button */}
      <button className="collapse-btn" onClick={onToggleSidebar}>
        ☰
      </button>

      <h1>Admin Dashboard</h1>

      <div className="topbar-right">
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        <span>Admin: Enock</span>

        <button>Logout</button>
      </div>
    </header>
  );
};

export default Topbar;