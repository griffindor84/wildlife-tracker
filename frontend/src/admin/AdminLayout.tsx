import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./Admin.css";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`admin-container ${collapsed ? "collapsed" : ""}`}>
      <Sidebar collapsed={collapsed} />

      <div className="admin-content">
        <Topbar onToggleSidebar={() => setCollapsed((prev) => !prev)} />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;