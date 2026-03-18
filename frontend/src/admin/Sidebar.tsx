import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type SidebarProps = {
  collapsed: boolean;
};

const Sidebar = ({ collapsed }: SidebarProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "sidebar-link active" : "sidebar-link";

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/login';
  };

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">{collapsed ? "AP" : "Admin Panel"}</h2>

      <nav className="sidebar-nav">
        <NavLink className={linkClass} to="/admin/dashboard">
          <span className="sidebar-icon">📊</span>
          {!collapsed && <span className="sidebar-label">Dashboard</span>}
        </NavLink>

        <NavLink className={linkClass} to="/admin/users">
          <span className="sidebar-icon">👤</span>
          {!collapsed && <span className="sidebar-label">Users</span>}
        </NavLink>

        <NavLink className={linkClass} to="/admin/wildlife">
          <span className="sidebar-icon">🐘</span>
          {!collapsed && <span className="sidebar-label">Wildlife</span>}
        </NavLink>

        <NavLink className={linkClass} to="/admin/reports">
          <span className="sidebar-icon">📄</span>
          {!collapsed && <span className="sidebar-label">Reports</span>}
        </NavLink>

        <NavLink className={linkClass} to="/admin/settings">
          <span className="sidebar-icon">⚙️</span>
          {!collapsed && <span className="sidebar-label">Settings</span>}
        </NavLink>

        {/* Back to main app */}
        <NavLink className={linkClass} to="/">
          <span className="sidebar-icon">🏠</span>
          {!collapsed && <span className="sidebar-label">Back to App</span>}
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout}>
          <span className="sidebar-icon">🚪</span>
          {!collapsed && <span className="sidebar-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;