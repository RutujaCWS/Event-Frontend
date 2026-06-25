import React, { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import Header from "../component/Header";

const MainLayout = () => {
  const token = localStorage.getItem("token") || "mock-token";
  const userStr = localStorage.getItem("user") || JSON.stringify({ name: "Rahul Kapoor", role: "admin" });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="main-wrapper d-flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Main content - controlled by responsive class instead of fixed inline margin */}
      <div className={`main-content-wrapper ${sidebarOpen ? "sidebar-open" : ""}`}>
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="main-content-body p-3 p-md-4">
          <Outlet />
        </div>
      </div>
      {/* Backdrop overlay for mobile/tablet drawer */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />
    </div>
  );
};

export default MainLayout;