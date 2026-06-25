import React, { useState } from "react";
import HomeManagement from "./HomeManagemen";

import ContactManagement from "./ContactManagement";
import GalleryManagement from "./GalleryManagement";
import ServiceManagement from "./ServiceManagement";
import VisibilityManagement from "./VisibilityManagement";
import LogoManagement from "./LogoManagement";
import AboutManagement from "./AboutManagement/AboutManagement";

const CmsPage = () => {
  const [activeTab, setActiveTab] = useState("home");

  const tabs = [
    { id: "home", label: "Home" },
    { id: "about", label: "About Us" },
    { id: "services", label: "Services" },
    { id: "gallery", label: "Gallery" },
    { id: "contact", label: "Contact Us" },
    { id: "logo", label: "Company Logo" },
    { id: "footer", label: "Footer" },
    { id: "banner", label: "Banner" },
    { id: "testimonial", label: "Testimonials" },
    { id: "faq", label: "FAQ" },
    { id: "inquiry", label: "Inquiries" },
    { id: "visibility", label: "Visibility" },
    { id: "announcement", label: "Announcement" },
    { id: "logs", label: "Activity Logs" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return  <HomeManagement />;

      case "about":
        return <AboutManagement/>;

      case "services":
        return <ServiceManagement/>

      case "gallery":
        return <GalleryManagement/>

      case "contact":
        return <ContactManagement/>

      case "logo":
        return <LogoManagement/>

      case "footer":
        return (
          <div>
            <h4>Footer Management</h4>
            <textarea
              className="form-control"
              placeholder="Footer Content"
            />
          </div>
        );

      case "banner":
        return (
          <div>
            <h4>Banner Management</h4>
            <input
              className="form-control mb-2"
              placeholder="Banner Title"
            />
            <input type="file" className="form-control" />
          </div>
        );

      case "testimonial":
        return (
          <div>
            <h4>Testimonial Management</h4>
            <input
              className="form-control mb-2"
              placeholder="Customer Name"
            />
            <textarea
              className="form-control"
              placeholder="Review"
            />
          </div>
        );

      case "faq":
        return (
          <div>
            <h4>FAQ Management</h4>
            <input
              className="form-control mb-2"
              placeholder="Question"
            />
            <textarea
              className="form-control"
              placeholder="Answer"
            />
          </div>
        );

      case "inquiry":
        return (
          <div>
            <h4>Contact Inquiry Management</h4>
            <p>List of website inquiries will appear here.</p>
          </div>
        );

      case "visibility":
        return <VisibilityManagement/>

      case "announcement":
        return (
          <div>
            <h4>Announcement Bar</h4>
            <input
              className="form-control mb-2"
              placeholder="Announcement Text"
            />
            <button className="btn btn-primary">
              Publish
            </button>
          </div>
        );

      case "logs":
        return (
          <div>
            <h4>Activity Logs</h4>
            <p>Admin activity history will be displayed here.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
  <div className="container-fluid p-4">
    {/* Heading */}
    <h2 className="text-center fw-bold mb-4">
      Content Management System
    </h2>

    {/* Toggle Buttons */}
    <div
      className="d-flex flex-wrap justify-content-center gap-3 mb-4"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`btn ${
            activeTab === tab.id
              ? "btn-primary"
              : "btn-outline-primary"
          }`}
          style={{
            borderRadius: "30px",
            padding: "10px 22px",
            minWidth: "140px",
            fontWeight: "600",
            transition: "all 0.3s ease",
            boxShadow:
              activeTab === tab.id
                ? "0 4px 12px rgba(13,110,253,0.3)"
                : "none",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>

    {/* Content Card */}
    <div
      className="card shadow border-0"
      style={{
        borderRadius: "20px",
        overflow: "hidden",
      }}
    >
      <div className="card-header bg-primary text-white py-3">
        <h5 className="mb-0 text-center">
          {tabs.find((tab) => tab.id === activeTab)?.label}
        </h5>
      </div>

      <div className="card-body p-4">
        {renderContent()}
      </div>
    </div>
  </div>
);
};

export default CmsPage;