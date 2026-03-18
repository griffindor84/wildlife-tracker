import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type SidebarProps = {
  collapsed: boolean;
  mobileOpen?: boolean;
  onClose?: () => void;
};

const Sidebar = ({ collapsed, mobileOpen, onClose }: SidebarProps) => {
  const { signOut } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "sidebar-link active" : "sidebar-link";

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/login';
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <h2 className="sidebar-title">{collapsed ? "AP" : "Admin Panel"}</h2>

      <nav className="sidebar-nav">
        <NavLink className={linkClass} to="/admin/dashboard" onClick={handleLinkClick}>
          <span className="sidebar-icon">📊</span>
          {!collapsed && <span className="sidebar-label">Dashboard</span>}
        </NavLink>

        <NavLink className={linkClass} to="/admin/users" onClick={handleLinkClick}>
          <span className="sidebar-icon">👤</span>
          {!collapsed && <span className="sidebar-label">Users</span>}
        </NavLink>

        <NavLink className={linkClass} to="/admin/wildlife" onClick={handleLinkClick}>
          <span className="sidebar-icon">🐘</span>
          {!collapsed && <span className="sidebar-label">Wildlife</span>}
        </NavLink>

        <NavLink className={linkClass} to="/admin/reports" onClick={handleLinkClick}>
          <span className="sidebar-icon">📄</span>
          {!collapsed && <span className="sidebar-label">Reports</span>}
        </NavLink>

        <NavLink className={linkClass} to="/admin/settings" onClick={handleLinkClick}>
          <span className="sidebar-icon">⚙️</span>
          {!collapsed && <span className="sidebar-label">Settings</span>}
        </NavLink>

        <NavLink className={linkClass} to="/" onClick={handleLinkClick}>
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