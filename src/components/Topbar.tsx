import { useEffect, useState } from "react";

const Topbar = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <header className="topbar">
      <h1>Admin Dashboard</h1>

      <div className="topbar-right">
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
        <span>Admin</span>
        <button>Logout</button>
      </div>
    </header>
  );
};

export default Topbar;
