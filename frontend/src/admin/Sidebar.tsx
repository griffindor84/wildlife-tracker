import { NavLink } from "react-router-dom";

type SidebarProps = {
  collapsed: boolean;
};

const Sidebar = ({ collapsed }: SidebarProps) => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "sidebar-link active" : "sidebar-link";

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
      </nav>
    </aside>
  );
};

export default Sidebar;