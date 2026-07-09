import React, { useState } from "react";
import HomeManagement from "./HomeManagemen";

import ContactManagement from "./ContactManagement";
import GalleryManagement from "./GalleryManagement";
//import ServiceManagement from "./ServiceManagement";
import VisibilityManagement from "./VisibilityManagement";
import LogoManagement from "./LogoManagement";
import AboutManagement from "./AboutManagement/AboutManagement";
import JourneyManagement from "./JourneyManagement";
import ProblemSolutionManagement from "./ProblemSolutionManagement";
import CustomizationManagement from "./CustomizationManagement";
import CoreFeatureManagement from "./CoreFeatureManagement";
import WhyChooseUsManagement from "./WhyChooseUsManagement";

const CmsPage = () => {
  const [activeTab, setActiveTab] = useState("home");

  const tabs = [
    { id: "home", label: "Home" },
   { id: "journey", label: "Journey Section" },
   { id: "problem-solution", label: "Problem & Solution" },
     { id: "customization", label: "Customization" },
     { id: "core-features", label: "Core Features" }, 
     { id: "why-choose-us", label: "Why Choose Us" },
    { id: "about", label: "About Us" },
    { id: "services", label: "Services" },
    { id: "gallery", label: "Gallery" },
    { id: "contact", label: "Contact Us" },
    { id: "logo", label: "Company Logo" },
    { id: "testimonial", label: "Testimonials" },
    { id: "faq", label: "FAQ" },
    { id: "visibility", label: "Visibility" },
   
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return  <HomeManagement />;
      case "journey":
         return <JourneyManagement />;

      case "problem-solution":
         return <ProblemSolutionManagement />;
      case "customization":
         return <CustomizationManagement />;
      case "core-features":
         return <CoreFeatureManagement />;
      case "why-choose-us":
          return <WhyChooseUsManagement />;

      case "about":
        return <AboutManagement/>;
{/* 
      case "services":
        return <ServiceManagement/>
*/}
      case "gallery":
        return <GalleryManagement/>

      case "contact":
        return <ContactManagement/>

      case "logo":
        return <LogoManagement/>

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


      case "visibility":
        return <VisibilityManagement/>


     
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