import { useEffect, useState } from "react";

import { getAllBanners } from "../../../services/bannerService";
import { getGalleryEvents } from "../../../services/galleryService";
import { getServices } from "../../../services/serviceService";
import { getTestimonials } from "../../../services/testimonialService";
import {
  FaImages,
  FaFileAlt,
  FaStar,
  FaImage,
  FaClock,
  FaSearch,
} from "react-icons/fa";
import BannerSection from "./Components/BannerSection";
import GallerySection from "./Components/GallerySection";
import ServiceSection from "./Components/ServiceSection";
import ContactSection from "./Components/ContactSection";
import TestimonialSection from "./Components/TestimonialSection";


const EventCmsPage = () => {
const [dashboardData, setDashboardData] = useState({
  banners: 0,
  services: 0,
  testimonials: 0,
  gallery: 0,
});
const loadDashboardCounts = async () => {
  try {
  const [bannerRes, serviceRes, testimonialRes, galleryRes] =
  await Promise.all([
    getAllBanners(),
    getServices(),
    getTestimonials(),
    getGalleryEvents(),
  ]);

    console.log("Banner:", bannerRes.data);
    console.log("Service:", serviceRes.data);
    console.log("Testimonial:", testimonialRes.data);
    console.log("Gallery:", galleryRes.data);

    setDashboardData({
      banners: bannerRes.data.data.length,
      services: serviceRes.data.data.length,
      testimonials: testimonialRes.data.data.length,
      gallery: galleryRes.data.data.length,
    });
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  loadDashboardCounts();
}, []);

const cards = [
  {
    title: "ACTIVE BANNERS",
    value:dashboardData.banners,
    subTitle: "↗ All live",
    icon: "bi bi-layout-text-window",
    iconBg: "#E8FAF8",
    iconColor: "#14B8A6",
    subColor: "#14B8A6",
  },
  {
    title: "SERVICE PAGES",
    value: dashboardData.services,
    subTitle: "↗ +2 this month",
    icon: "bi bi-file-earmark-text",
    iconBg: "#EEF4FF",
    iconColor: "#3B82F6",
    subColor: "#14B8A6",
  },
  {
    title: "TESTIMONIALS",
    value: dashboardData.testimonials,
    subTitle: "↗ 4.8 avg rating",
    icon: "bi bi-star",
    iconBg: "#FFF7E8",
    iconColor: "#F59E0B",
    subColor: "#14B8A6",
  },
  {
    title: "GALLERY PHOTOS",
    value:  dashboardData.gallery,
    subTitle: "↗ +6 uploaded",
    icon: "bi bi-image",
    iconBg: "#ECFDF5",
    iconColor: "#10B981",
    subColor: "#14B8A6",
  },
  {
    title: "PENDING REVIEW",
    value: dashboardData.testimonials,
    subTitle: "↘ Needs approval",
    icon: "bi bi-clipboard-check",
    iconBg: "#FEF2F2",
    iconColor: "#EF4444",
    subColor: "#EF4444",
  },
];
const [showServiceModal, setShowServiceModal] = useState(false);
const [activeTab, setActiveTab] = useState("all");

const tabs = [
  { id: "all", label: "All" },
  { id: "banner", label: "Home Page Banners" },
  { id: "service", label: "Service Content" },
  { id: "testimonial", label: "Testimonials" },
  { id: "contact", label: "Contact Details" },
  { id: "gallery", label: "Gallery Upload" },
];

  return (
    <div className="container-fluid py-4">




      {/* Cards */}

  <div className="row g-3 mb-4">
  {cards.map((card, index) => (
    <div className="col-xl col-lg-4 col-md-6" key={index}>
      <div
        className="card border-0 h-100"
        style={{
          borderRadius: "14px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          padding: "5px",
        }}
      >
        <div className="card-body d-flex justify-content-between align-items-start">

          <div>
            <h3
              className="fw-semibold mb-2"
              style={{
                fontSize: "28px",
                color: "#111827",
              }}
            >
              {card.value}
            </h3>

            <div
              style={{
                fontSize: "11px",
                color: "#6B7280",
                fontWeight: "600",
                letterSpacing: ".4px",
              }}
            >
              {card.title}
            </div>

            <div
              style={{
                marginTop: "10px",
                fontSize: "12px",
                color: card.subColor,
                fontWeight: "500",
              }}
            >
              {card.subTitle}
            </div>
          </div>

          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              background: card.iconBg,
            }}
          >
            <i
              className={card.icon}
              style={{
                color: card.iconColor,
                fontSize: "18px",
              }}
            ></i>
          </div>

        </div>
      </div>
    </div>
  ))}
</div>
<div className="d-flex justify-content-between align-items-center mb-3">


  <div className="d-flex align-items-center gap-2">

    

  

  </div>
</div>
<div
  className="d-flex flex-wrap gap-2 align-items-center"
  style={{
    background: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: "10px",
    padding: "12px 14px",
  }}
>
  {tabs.map((tab) => (
    <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className="btn"
      style={{
        borderRadius: "50px",
        padding: "5px 16px",
        fontSize: "13px",
        fontWeight: "500",
        lineHeight: "20px",
        background:
          activeTab === tab.id ? "#DFF7F4" : "#FFFFFF",
        color:
          activeTab === tab.id ? "#0F766E" : "#4B5563",
        border:
          activeTab === tab.id
            ? "1px solid #99F6E4"
            : "1px solid #D1D5DB",
        boxShadow: "none",
      }}
    >
      {tab.label}
    </button>
  ))}
</div>

  {activeTab === "all" && (
  <>
    <BannerSection />

    <GallerySection />
 
    <div className="row g-4">
      <div className="col-lg-7">
      <ServiceSection
  allView={true}
  showServiceModal={showServiceModal}
  setShowServiceModal={setShowServiceModal}
/>
      </div>

      <div className="col-lg-5">
        <ContactSection />
      </div>
    </div>

    <TestimonialSection />
  </>
)}
{activeTab === "banner" && <BannerSection />}
{activeTab === "gallery" && <GallerySection />}

{activeTab === "service" &&<ServiceSection />}
{activeTab === "contact" && <ContactSection />}
{activeTab === "testimonial" && <TestimonialSection />}






     </div>
     
    
  );
};

export default EventCmsPage;