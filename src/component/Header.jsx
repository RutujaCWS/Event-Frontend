import React from "react";
import { FaSearch, FaRegBell, FaBars } from "react-icons/fa";

const Header = ({ onToggleSidebar }) => {
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Rahul Kapoor",
    role: "admin"
  };

  // Helper to extract initials (e.g. Rahul Kapoor -> RK)
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
      {/* Hamburger Toggle Button - hidden on desktop, visible on mobile/tablet */}
      <button
        onClick={onToggleSidebar}
        className="header-toggle-btn d-lg-none"
        aria-label="Toggle Menu"
      >
        <FaBars />
      </button>

      {/* Title & Breadcrumbs */}
      <div className="header-title-container">
        <span className="header-title-main">Admin</span>
        <div className="header-title-divider d-none d-sm-block"></div>
        <div className="header-breadcrumb d-none d-sm-flex">
          <span>Home</span>
          <span>/</span>
          <span className="header-breadcrumb-active">Overview</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="header-search-bar">
        <FaSearch className="header-search-icon" />
        <input
          type="text"
          className="header-search-input"
          placeholder="Search..."
        />
      </div>

      {/* User Info & Actions */}
      <div className="header-right">
        {/* Notifications */}
        <button className="header-notification-btn" aria-label="Notifications">
          <FaRegBell />
          <span className="header-notification-dot"></span>
        </button>

        {/* Divider */}
        <div className="header-divider-vertical"></div>

        {/* Profile Card */}
        <div className="header-user-profile">
          <div className="header-user-info d-none d-md-block">
            <h4 className="header-user-name">{displayName}</h4>
            <p className="header-user-role">{displayRole}</p>
          </div>
          <div className="header-user-avatar">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;