import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaThLarge, FaUsers, FaBriefcase, FaEnvelope, FaFileAlt,
  FaCalendarAlt, FaCreditCard, FaFileInvoiceDollar, FaEdit,
  FaChartBar, FaCog, FaSignOutAlt, FaUser, FaTasks,
  FaSyncAlt, FaTimes
} from "react-icons/fa";
import {
  TbLayoutDashboard,
  TbMessageCircle,
  TbReceiptDollar,
  TbCalendarEvent,
  TbCreditCard,
  TbFileInvoice,
  TbUser,
} from "react-icons/tb";
import { useAuth } from "../Context/Auth/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // ---- Debug: log user object to see available fields ----
 

  // ---- Try multiple possible name fields ----
  const name = user?.name || user?.fullName || user?.username || "Rahul Kapoor";
  const role = user?.role || "admin";
  const permissions = user?.permissions || {};

  // ---------- Helper: Initials ----------
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return parts[0][0] + parts[1][0];
    return name.substring(0, 2).toUpperCase();
  };

  // ---------- Logout ----------
  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    setIsLoggingOut(true);
    logout(); // clears context & localStorage, navigates to /login
    if (onClose) onClose();
    setIsLoggingOut(false);
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  // ---------- MENUS ----------
  const adminMenu = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <FaThLarge /> },
    { path: "/admin/users", label: "User Management", icon: <FaUsers /> },
    { path: "/admin/services", label: "Services", icon: <FaBriefcase /> },
    { path: "/admin/enquiries", label: "Enquiries", icon: <FaEnvelope /> },
    { path: "/admin/quotations", label: "Quotations", icon: <FaFileAlt /> },
    { path: "/admin/bookings", label: "Bookings", icon: <FaCalendarAlt /> },
    { path: "/admin/payments", label: "Payments", icon: <FaCreditCard /> },
    { path: "/admin/invoices", label: "Invoice & GST", icon: <FaFileInvoiceDollar /> },
    { path: "/admin/CmsPage", label: "CMS", icon: <FaEdit /> },
{ path: "/admin/event-cms", label: "Event CMS", icon: <FaEdit /> },
    { path: "/admin/reports", label: "Reports", icon: <FaChartBar /> },
    { path: "/admin/settings", label: "System Settings", icon: <FaCog /> },
  ];

  const staffMenu = [
    { path: "/staff/dashboard", label: "Dashboard", icon: <FaThLarge /> },
    permissions?.enquiries !== false && { path: "/staff/enquiries", label: "Assigned Enquiries", icon: <FaEnvelope /> },
    permissions?.events !== false && { path: "/staff/events", label: "Assigned Events", icon: <FaCalendarAlt /> },
    permissions?.tasks !== false && { path: "/staff/tasks", label: "Tasks", icon: <FaTasks /> },
    permissions?.schedule !== false && { path: "/staff/schedule", label: "Event Schedule", icon: <FaCalendarAlt /> },
    permissions?.statusUpdates !== false && { path: "/staff/status", label: "Status Updates", icon: <FaSyncAlt /> },
    { path: "/staff/profile", label: "Profile", icon: <FaUser /> },
  ].filter(Boolean);

  const customerMenu = [
    {
      title: "Overview",
      items: [
        { path: "/customer/dashboard", label: "Dashboard", icon: <TbLayoutDashboard size={22} /> },
      ],
    },
    {
      title: "Business Operations",
      items: [
        { path: "/customer/enquiries", label: "My Enquiries", icon: <TbMessageCircle size={22} /> },
        { path: "/customer/quotations", label: "Quotations", icon: <TbReceiptDollar size={22} /> },
        { path: "/customer/bookings", label: "Bookings", icon: <TbCalendarEvent size={22} /> },
      ],
    },
    {
      title: "Administration",
      items: [
        { path: "/customer/payments", label: "Payments", icon: <TbCreditCard size={22} /> },
        { path: "/customer/invoices", label: "Invoices", icon: <TbFileInvoice size={22} /> },
        { path: "/customer/profile", label: "Profile Management", icon: <TbUser size={22} /> },
      ],
    },
  ];

  let menuItems;
  if (role === "admin") menuItems = adminMenu;
  else if (role === "staff") menuItems = staffMenu;
  else if (role === "customer") menuItems = customerMenu;
  else return null;

  // ---------- RENDER ----------
  return (
    <div className={`dashboard-sidebar ${isOpen ? "open" : ""}`}>
      {/* Brand */}
      <div className="sidebar-brand-container">
        <div className="d-flex align-items-center gap-2">
          <div className="sidebar-brand-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="12" fill="#00a884" />
              <path d="M12 5C10 8 7 9 7 13C7 16 9.5 18 12 18C14.5 18 17 16 17 13C17 9 14 8 12 5ZM12 16C10.5 16 9.5 15 9.5 13.5C9.5 12 10.5 11 12 10C13.5 11 14.5 12 14.5 13.5C14.5 15 13.5 16 12 16Z" fill="white" />
            </svg>
          </div>
          <div className="sidebar-brand-text">
            <h1 className="sidebar-brand-name">Vevora</h1>
            <p className="sidebar-brand-sub">{role} Panel</p>
          </div>
        </div>
        <button onClick={onClose} className="sidebar-close-btn d-lg-none">
          <FaTimes />
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-menu">
        {role === "admin" ? (
          menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={({ isActive }) => `sidebar-item-link ${isActive ? "active" : ""}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))
        ) : role === "customer" ? (
          menuItems.map((section) => (
            <div key={section.title} className="sidebar-section">
              <p className="sidebar-section-title">{section.title}</p>
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `sidebar-item-link ${isActive ? "active" : ""}`
                  }
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))
        ) : (
          menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={({ isActive }) => `sidebar-item-link ${isActive ? "active" : ""}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))
        )}
      </nav>

      {/* ===== DYNAMIC FOOTER – exact user info ===== */}
      <div className="sidebar-footer">
        <div className="sidebar-user-row">
          <div className="sidebar-user-profile">
            <div className="sidebar-user-avatar">{user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={name}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                getInitials(name)
              )}
            </div>
            <div className="sidebar-user-info">
              <p className="sidebar-user-name">{name}</p>
              <p className="sidebar-user-role">
                {role === "admin" ? "Administrator" : role === "staff" ? "Staff" : "Customer"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="sidebar-logout-icon"
            aria-label="Logout"
            disabled={isLoggingOut}
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;