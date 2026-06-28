import React from "react";
import { FaSearch, FaBars } from "react-icons/fa";
import NotificationBell from "./NotificationBell";   

const Header = ({ onToggleSidebar }) => {
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Rahul Kapoor",
    role: "admin"
  };

  const getInitials = (name) => {
    if (!name) return "RK";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const displayName = user?.fullName || user?.name || "Rahul Kapoor";
  const displayRole = user?.role === "admin" ? "Owner / Admin" : user?.role === "staff" ? "Staff" : "Customer";
  const initials = getInitials(displayName);

  return (
    <header className="dashboard-header">
      {/* Hamburger Toggle */}
      <button
        onClick={onToggleSidebar}
        className="header-toggle-btn d-lg-none"
        aria-label="Toggle Menu"
      >
        <FaBars />
      </button>

      <div className="header-title-container">
        <span className="header-title-main">{displayRole}</span>
        <div className="header-title-divider d-none d-sm-block"></div>
        <div className="header-breadcrumb d-none d-sm-flex">
          <span>Home</span>
          <span>/</span>
          <span className="header-breadcrumb-active">Overview</span>
        </div>
      </div>

      <div className="header-search-bar">
        <FaSearch className="header-search-icon" />
        <input
          type="text"
          className="header-search-input"
          placeholder="Search..."
        />
      </div>

      <div className="header-right">
        <NotificationBell />

        <div className="header-divider-vertical"></div>

        <div className="header-user-profile">
          <div className="header-user-info d-none d-md-block">
            <h4 className="header-user-name">{displayName}</h4>
            <p className="header-user-role">{displayRole}</p>
          </div>
          <div className="header-user-avatar">{initials}</div>
        </div>
      </div>
    </header>
  );
};

export default Header;