import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import {
  FaBuilding,
  FaPercent,
  FaCreditCard,
  FaBell,
  FaWhatsapp,
  FaShieldAlt,
} from "react-icons/fa";

import BusinessProfile from "./BusinessProfile";
import GSTConfiguration from "./GSTConfiguration";
import PaymentGateway from "./PaymentGateway";
import NotificationTemplates from "./NotificationTemplates";
import WhatsAppSMS from "./WhatsAppSMS";
import Security from "./Security";

const AdminSettings = () => {
  const [activeSection, setActiveSection] = useState("business");

  const menu = [
    {
      key: "business",
      label: "Business Profile",
      icon: <FaBuilding />,
    },
    {
      key: "gst",
      label: "GST Configuration",
      icon: <FaPercent />,
    },
    {
      key: "payment",
      label: "Payment Gateway",
      icon: <FaCreditCard />,
    },
    {
      key: "notification",
      label: "Notification Templates",
      icon: <FaBell />,
    },
    {
      key: "whatsapp",
      label: "WhatsApp / SMS Setup",
      icon: <FaWhatsapp />,
    },
    {
      key: "security",
      label: "Security",
      icon: <FaShieldAlt />,
    },
  ];

  const renderPage = () => {
    switch (activeSection) {
      case "business":
        return <BusinessProfile />;

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
        return <BusinessProfile />;
    }
  };

  return (
    <Row className="g-0">

      {/* Sidebar */}
      <Col
        lg={3} 
        className="bg-white border-end"
        style={{ maxWidth: "210px",minHeight: "calc(100vh - 70px)" }}
      >
        <div className="px-3 py-3 border-bottom">
          <h6 className="fw-semibold mb-1">
            System Settings
          </h6>

          <small
            className="text-muted"
            style={{ fontSize: "12px" }}
          >
            Manage platform configurations
          </small>
        </div>

        <div className="list-group list-group-flush">

          {menu.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveSection(item.key)}
              className={`list-group-item list-group-item-action border-0 rounded-0 d-flex align-items-center gap-2 py-2 px-3 ${
                activeSection === item.key
                  ? "bg-info-subtle border-start border-4 border-info text-dark"
                  : "text-secondary"
              }`}
            >
              <span className="fs-6">
                {item.icon}
              </span>

              <span
                className={
                  activeSection === item.key
                    ? "fw-semibold"
                    : "fw-normal"
                }
                style={{ fontSize: "14px" }}
              >
                {item.label}
              </span>
            </button>
          ))}

        </div>
      </Col>

      {/* Right Content */}
      <Col style={{ flex: 1 }} className="ps-4 pt-4">
        {renderPage()}
      </Col>

    </Row>
  );
};

export default AdminSettings;