import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { FaSearch, FaBars } from "react-icons/fa";
import NotificationBell from "./NotificationBell";
import { useAuth } from "../Context/Auth/AuthContext";

// Map routes to page titles (used on the left side)
const PAGE_TITLES = {
  "/admin/dashboard": "Admin Dashboard",
  "/admin/users": "User Management",
  "/admin/services": "Services",
  "/admin/enquiries": "Enquiries Management",
  "/admin/quotations": "Quotations Management",
  "/admin/bookings": "Bookings Management",
  "/admin/payments": "Payments Management",
  "/admin/invoices": "Invoice & GST Management",
  "/admin/CmsPage": "CMS Management",
  "/admin/reports": "Reports Management",
  "/admin/settings": "System Settings",

  "/staff/dashboard": "Staff Dashboard",
  "/staff/enquiries": "Assigned Enquiries",
  "/staff/events": "Assigned Events",
  "/staff/tasks": "Tasks",
  "/staff/schedule": "Event Schedule",
  "/staff/status": "Status Updates",
  "/staff/profile": "Profile",

  "/customer/dashboard": "Customer Dashboard",
  "/customer/enquiries": "My Enquiries",
  "/customer/quotations": "Quotations",
  "/customer/bookings": "Bookings",
  "/customer/payments": "Payments",
  "/customer/invoices": "Invoices",
  "/customer/profile": "Profile Management",
};

// Routes where we show the user name + role on the right side
const DASHBOARD_ROUTES = [
  "/admin/dashboard",
  "/staff/dashboard",
  "/customer/dashboard",
];

const Header = ({ onToggleSidebar }) => {
  const location = useLocation();
  const { user } = useAuth();

  // Left‑side page title (always the page name)
  const pageTitle = useMemo(() => {
    const path = location.pathname;
    if (PAGE_TITLES[path]) return PAGE_TITLES[path];
    const matchedKey = Object.keys(PAGE_TITLES).find(key => path.startsWith(key));
    if (matchedKey) return PAGE_TITLES[matchedKey];
    const segments = path.split("/").filter(Boolean);
    const last = segments.length ? segments[segments.length - 1] : "Overview";
    return last.charAt(0).toUpperCase() + last.slice(1);
  }, [location.pathname]);

  // Check if we are on a dashboard page
  const isDashboard = DASHBOARD_ROUTES.includes(location.pathname);

  // User info for the right side
  const getInitials = (name) => {
    if (!name) return "RK";
    const parts = name.split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const displayName = user?.fullName || user?.name || "Rahul Kapoor";
  const displayRole = user?.role === "admin" ? "Admin" : user?.role === "staff" ? "Staff" : "Customer";
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

      {/* Left: Page Title + Breadcrumb */}
      <div className="header-title-container">
        <span className="header-title-main">{pageTitle}</span>
        <div className="header-title-divider d-none d-sm-block"></div>
        <div className="header-breadcrumb d-none d-sm-flex">
          <span>Home</span>
          <span>/</span>
          <span className="header-breadcrumb-active">{pageTitle}</span>
        </div>
      </div>

      <div
        className="header-right-group"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginLeft: "auto",
        }}
      >
        {/* Search Bar */}
        <div className="header-search-bar" style={{ display: "flex", alignItems: "center" }}>
          <FaSearch className="header-search-icon" />
          <input
            type="text"
            className="header-search-input"
            placeholder="Search..."
            style={{ marginLeft: "8px" }}
          />
        </div>

        {/* Notification Bell */}
        <NotificationBell />

        <div
          className="header-divider-vertical"
          style={{
            backgroundColor: "#0D9488",
            width: "2px",
            height: "30px",
            borderRadius: "2px",
            alignSelf: "center",
            flexShrink: 0,
          }}
        />

        {/* User Profile – name & role visible ONLY on dashboard pages */}
        <div className="header-user-profile" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {isDashboard && (
            <div className="header-user-info d-none d-md-block">
              <h4 className="header-user-name">{displayName}</h4>
              <p className="header-user-role">{displayRole}</p>
            </div>
          )}
          <div className="header-user-avatar">{user?.profileImage ? (
          <img
            src={user.profileImage}
            alt="Profile"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          initials
        )}</div>
        </div>
      </div>
    </header>
  );
};

export default Header;