import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import {
  FaBuilding,
  FaPercent,
  FaCreditCard,
  FaBell,
  FaWhatsapp,
  FaShieldAlt,
  FaFileInvoice 
} from "react-icons/fa";

import BusinessProfile from "./BusinessProfile";
import GSTConfiguration from "./GSTConfiguration";
import PaymentGateway from "./PaymentGateway";
import NotificationTemplates from "./NotificationTemplates";
import WhatsAppSMS from "./WhatsAppSMS";
import Security from "./Security";

import {
  getBusinessSettings,
  updateBusinessSettings,
} from "./../../../services/settingsService";

const AdminSettings = () => {
  const [activeSection, setActiveSection] = useState("business");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ---------- Business State ----------
  const [business, setBusiness] = useState({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    website: "",
    logo: "",
     removeLogo: false,
    address: "",
    language: "English",
    currency: "INR",
   // darkMode: false,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ---------- Business Handlers ----------
  const handleBusinessChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
  if (files && files.length > 0) {
    setBusiness((prev) => ({
      ...prev,
      [name]: files[0],
      removeLogo: false,
    }));
  } else {
    setBusiness((prev) => ({
      ...prev,
      [name]: null,
      removeLogo: true,
    }));
  }
} else {
      setBusiness((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const fetchBusinessSettings = async () => {
    try {
      const res = await getBusinessSettings();
      const data = res?.data || res;
      if (data) {
        setBusiness({
          companyName: data.companyName || "",
          companyEmail: data.companyEmail || "",
          companyPhone: data.companyPhone || "",
          website: data.website || "",
          logo: data.logo || "",
           removeLogo: false,
          address: data.address || "",
          language: data.language || "English",
          currency: data.currency || "INR",
          darkMode: data.darkMode || false,
        });
      }
    } catch (error) {
      console.error("Error fetching business settings", error);
    }
  };

 const handleBusinessSave = async () => {
  setSaving(true);

  try {
    const formData = new FormData();

    formData.append("companyName", business.companyName);
    formData.append("companyEmail", business.companyEmail);
    formData.append("companyPhone", business.companyPhone);
    formData.append("website", business.website);
    formData.append("address", business.address);
    formData.append("language", business.language);
    formData.append("currency", business.currency);
    formData.append("darkMode", business.darkMode);
    formData.append("removeLogo", business.removeLogo);

  if (business.logo && typeof business.logo !== "string") {
  formData.append("logo", business.logo);
}

    const response = await updateBusinessSettings(formData);

    fetchBusinessSettings();

    alert(response.data?.message || "Business profile updated successfully");
  } catch (error) {
    console.error("Error saving business settings", error);

    alert(
      error.response?.data?.message ||
      "Failed to update business profile."
    );
  } finally {
    setSaving(false);
  }
};

  // ---------- Load Data ----------
  useEffect(() => {
    fetchBusinessSettings();
  }, []);
 
useEffect(() => {
  document.body.classList.toggle("dark-mode", business.darkMode);

  // Save preference
  localStorage.setItem("darkMode", business.darkMode);
}, [business.darkMode]);
  // ---------- Menu ----------
  const menu = [
    { key: "business", label: "Business Profile", icon: <FaBuilding /> },
    { key: "gst", label: "GST Configuration", icon: <FaFileInvoice /> },
    { key: "payment", label: "Payment Gateway", icon: <FaCreditCard /> },
    { key: "notification", label: "Notification Templates", icon: <FaBell /> },
    { key: "whatsapp", label: "WhatsApp / SMS Setup", icon: <FaWhatsapp /> },
    { key: "security", label: "Security", icon: <FaShieldAlt /> },
  ];

  const handleMenuItemClick = (key) => {
    setActiveSection(key);
    setSidebarOpen(false);
  };

  const renderPage = () => {
    switch (activeSection) {
      case "business":
        return (
          <BusinessProfile
            business={business}
            handleBusinessChange={handleBusinessChange}
            handleBusinessSave={handleBusinessSave}
            saving={saving}
            fetchBusinessSettings={fetchBusinessSettings}
          />
        );
      case "gst":
        return <GSTConfiguration />;
      case "payment":
        return <PaymentGateway />;
      case "notification":
        return <NotificationTemplates />;
      case "whatsapp":
        return <WhatsAppSMS />;
      case "security":
        return <Security />;
      default:
        return <PaymentGateway />;
    }
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', width: '100%' }}>
      <Row className="g-0" style={{ position: 'relative', minHeight: '100vh' }}>
        
        {/* Mobile Hamburger - visible on small screens */}
        <div className="d-md-none" style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 1050, 
          backgroundColor: '#fff', 
          padding: '12px 16px', 
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          width: '100%'
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              border: 'none',
              background: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px 8px',
              color: '#374151'
            }}
          >
            ☰
          </button>
          <h6 style={{ margin: 0, fontWeight: '600', color: '#111827' }}>
            System Settings
          </h6>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.3)',
              zIndex: 1049,
            }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile Drawer */}
        <div
          className="d-md-none"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            width: '280px',
            backgroundColor: '#FFFFFF',
            zIndex: 1050,
            transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s ease',
            overflowY: 'auto',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
            borderRight: '1px solid #f3f4f6'
          }}
        >
          <div className="px-3 py-3 border-bottom d-flex justify-content-between align-items-center" style={{ borderBottom: '1px solid #f3f4f6' }}>
            <div>
              <h6 className="fw-semibold mb-1" style={{ color: '#111827' }}>System Settings</h6>
              <small className="text-muted" style={{ fontSize: "12px", color: '#6b7280' }}>
                Manage platform configurations
              </small>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                border: 'none',
                background: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '4px 8px',
                color: '#6b7280'
              }}
            >
              ✕
            </button>
          </div>
          <div className="list-group list-group-flush" style={{ padding: '8px 0' }}>
            {menu.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => handleMenuItemClick(item.key)}
                style={{
                  fontSize: '14px',
                  cursor: 'pointer',
                  background: activeSection === item.key ? '#f0fdfa' : 'transparent',
                  borderLeft: activeSection === item.key ? '4px solid #00a884' : '4px solid transparent',
                  fontWeight: activeSection === item.key ? '600' : '400',
                  padding: '12px 18px',
                  border: 'none',
                  width: '100%',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: activeSection === item.key ? '#00a884' : '#4b5563',
                  transition: 'all 0.2s ease',
                  borderRadius: '0',
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== item.key) {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                    e.currentTarget.style.color = '#111827';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== item.key) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#4b5563';
                  }
                }}
              >
                <span style={{ fontSize: '18px', display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Sidebar - always visible on md and up */}
        <Col
          md={3}
          lg={3}
          xl={2}
          className="bg-white border-end d-none d-md-block"
          style={{
            maxWidth: "240px",
            minWidth: "240px",
            minHeight: "100vh",
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflowY: 'auto',
            padding: '0',
            borderRight: '1px solid #f3f4f6',
            boxShadow: 'none',
          }}
        >
          <div className="px-3 py-3 border-bottom" style={{ borderBottom: '1px solid #f3f4f6' }}>
            <h6 className="fw-semibold mb-1" style={{ color: '#111827', fontSize: '16px' }}>System Settings</h6>
            <small className="text-muted" style={{ fontSize: "12px", color: '#6b7280' }}>
              Manage platform configurations
            </small>
          </div>
          <div className="list-group list-group-flush" style={{ padding: '8px 0' }}>
            {menu.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveSection(item.key)}
                style={{
                  fontSize: '14px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  background: activeSection === item.key ? '#f0fdfa' : 'transparent',
                  borderLeft: activeSection === item.key ? '4px solid #00a884' : '4px solid transparent',
                  fontWeight: activeSection === item.key ? '600' : '400',
                  padding: '10px 18px',
                  border: 'none',
                  width: '100%',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s ease',
                  color: activeSection === item.key ? '#00a884' : '#4b5563',
                  borderRadius: '0',
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== item.key) {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                    e.currentTarget.style.color = '#111827';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== item.key) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#4b5563';
                  }
                }}
              >
                <span style={{ fontSize: '20px', display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </Col>

        {/* Content - takes full width on mobile */}
        <Col
          xs={12}
          md={9}
          lg={9}
          xl={10}
          style={{
            flex: 1,
            overflowX: 'hidden',
            minHeight: '100vh',
            backgroundColor: '#F8FAFC',
            padding: '20px 24px',
          }}
        >
          {renderPage()}
        </Col>

      </Row>
    </div>
  );
};

export default AdminSettings;