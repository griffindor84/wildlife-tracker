import type { ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../Admin.css";

type AdminLayoutProps = {
  children: ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="admin-container">
      <Sidebar />
      <div className="admin-content">
        <Topbar />
        <main>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
