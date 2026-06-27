import { NavLink, useNavigate } from "react-router-dom";
import {
  FaThLarge,
  FaUsers,
  FaBriefcase,
  FaEnvelope,
  FaFileAlt,
  FaCalendarAlt,
  FaCreditCard,
  FaFileInvoiceDollar,
  FaEdit,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaTasks,
  FaSyncAlt,
  FaHeadset,
  FaTimes
} from "react-icons/fa";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const role = user?.role || "guest";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    if (onClose) onClose();
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  // ================= ADMIN MENU (Matches Image Exactly) =================
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
    { path: "/admin/reports", label: "Reports", icon: <FaChartBar /> },
    { path: "/admin/settings", label: "System Settings", icon: <FaCog /> },
  ];

  // ================= STAFF MENU =================
  const staffMenu = [
    { path: "/staff/dashboard", label: "Dashboard", icon: <FaThLarge /> },
    { path: "/staff/enquiries", label: "Assigned Enquiries", icon: <FaEnvelope /> },
    { path: "/staff/events", label: "Assigned Events", icon: <FaCalendarAlt /> },
    { path: "/staff/tasks", label: "Tasks", icon: <FaTasks /> },
    { path: "/staff/schedule", label: "Event Schedule", icon: <FaCalendarAlt /> },
    { path: "/staff/status", label: "Status Updates", icon: <FaSyncAlt /> },
    { path: "/staff/profile", label: "Profile", icon: <FaUser /> },
  ];

  // ================= CUSTOMER MENU =================
  const customerMenu = [
    { path: "/customer/dashboard", label: "Dashboard", icon: <FaThLarge /> },
    { path: "/customer/enquiries", label: "My Enquiries", icon: <FaEnvelope /> },
    { path: "/customer/quotations", label: "Quotations", icon: <FaFileAlt /> },
    {
      path: "/customer/bookings",
      label: "Bookings",
      icon: <FaCalendarAlt />
      },
    { path: "/customer/payments", label: "Payments", icon: <FaCreditCard /> },
    { path: "/customer/invoices", label: "Invoices", icon: <FaFileInvoiceDollar /> },
    { path: "/customer/profile", label: "Profile", icon: <FaUser /> },
    { path: "/customer/support", label: "Support", icon: <FaHeadset /> },
  ];

  let menuItems;
  if (role === "admin") menuItems = adminMenu;
  else if (role === "staff") menuItems = staffMenu;
  else if (role === "customer") menuItems = customerMenu;
  else return null;

  return (
    <div className={`dashboard-sidebar ${isOpen ? "open" : ""}`}>
      {/* Brand / Logo */}
      <div className="sidebar-brand-container">
        <div className="d-flex align-items-center gap-2">
          <div className="sidebar-brand-logo">
            {/* Custom green leaf/wave brand SVG to match image */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="12" fill="#00a884" />
              <path d="M12 5C10 8 7 9 7 13C7 16 9.5 18 12 18C14.5 18 17 16 17 13C17 9 14 8 12 5ZM12 16C10.5 16 9.5 15 9.5 13.5C9.5 12 10.5 11 12 10C13.5 11 14.5 12 14.5 13.5C14.5 15 13.5 16 12 16Z" fill="white" />
            </svg>
          </div>
          <div className="sidebar-brand-text">
            <h1 className="sidebar-brand-name">Vevora</h1>
            <p className="sidebar-brand-sub">Admin Panel</p>
          </div>
        </div>
        {/* Mobile close button */}
        <button onClick={onClose} className="sidebar-close-btn d-lg-none" aria-label="Close sidebar">
          <FaTimes />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={handleLinkClick}
            className={({ isActive }) => `sidebar-item-link ${isActive ? "active" : ""}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <button onClick={handleLogout} className="sidebar-logout-btn">
        <FaSignOutAlt />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;