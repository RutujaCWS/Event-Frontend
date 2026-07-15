import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import Header from "../component/Header";

const MainLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="main-wrapper d-flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={`main-content-wrapper ${sidebarOpen ? "sidebar-open" : ""}`}>
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className={
            location.pathname === "/admin/settings"
              ? "main-content-body p-0"
              : "main-content-body p-3 p-md-4"
          }>
          <Outlet />
        </div>
      </div>
      <div
        className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />
    </div>
  );
};

export default MainLayout;