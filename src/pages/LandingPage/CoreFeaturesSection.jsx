import React, { useEffect, useState } from "react";
import { getCmsSection } from "../../services/cmsService";
{/* 
const coreFeatures = [
  {
    icon: "bi bi-journal-text ",
    title: "Service & Event Catalog",
    desc: "Browse event categories, view service details and inclusions, image galleries and pricing insights",
  },
  {
    icon: "bi bi-chat-dots ",
    title: "Event Enquiry System",
    desc: "Submit detailed enquiries capturing event type, date, location, and budget. Track enquiry status",
  },
  {
    icon:" bi bi-file-earmark-plus ",
    title: "Quotation Management",
    desc: "Generate detailed quotes with service-wise pricing, automatic discounts & GST calculations, and enable customers to approve or reject proposals with ease.",
  },
  {
    icon:"bi bi-calendar-check ",
    title: "Booking Management",
    desc: "Booking confirmation, event scheduling, staff assignment, and real-time booking status tracking.",
  },
  {
    icon: "bi bi-credit-card ",
    title: "Payment Management",
    desc: "Advance and full payments via UPI, cards, net banking, cash or bank transfer with receipts.",
  },
  {
    icon: "bi bi-receipt ",
    title: "Invoice & GST Management",
    desc: "Auto-generated invoices with GST breakdown, downloadable PDFs, and payment receipts.",
  },
  {
    icon: "bi bi-speedometer2 ",
    title: "Customer Dashboard",
    desc: "View enquiries, track event progress, access quotations, invoices, and payment history",
  },
  {
    icon: "bi bi-gear",
    title: "Admin Panel",
    desc: "Manage enquiries, bookings, create quotations, manage payments, invoices, and website content.",
  },
  {
    icon: "bi bi-pencil-square ",
    title: "Content Management",
    desc: "Manage banners, pages, services, galleries, testimonials, and contact information.",
  },
];
*/}
const CoreFeaturesSection = () => {
  const [coreFeature, setCoreFeature] = useState({
  badge: "",
  title: "",
  description: "",
  cards: [],
});

useEffect(() => {
  fetchCoreFeatures();
}, []);

const fetchCoreFeatures = async () => {
  try {
    const res = await getCmsSection("core-features");

    if (res.data?.data?.content) {
      const content = res.data.data.content;

      let cards = [];

      if (Array.isArray(content.cards)) {
        cards = content.cards;
      } else if (typeof content.cards === "string") {
        cards = JSON.parse(content.cards);
      }

      setCoreFeature({
        badge: content.badge || "",
        title: content.title || "",
        description: content.description || "",
        cards,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
  return (
    <section
      id="features"
      style={{
        backgroundColor: "#f4fbfb", // Light background for contrast
        padding: "80px 0 60px 10px",
        scrollMarginTop: "90px",
        fontFamily: "Manrope, sans-serif",
         scrollMarginTop: "200px"
      }}
    >
      <div className="container px-4 px-lg-5">
        
        {/* Section Header */}
        <div className="text-center mb-5">
          <span 
            className=" mb-3 d-inline-block" 
            style={{
                color: "#14B8A6",
                fontSize: "18px",
                fontWeight: "400",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
          >
            {coreFeature.badge}
          </span>
          <h1
            className="fw-bold mb-3"
            style={{
                fontSize: "clamp(36px, 5vw, 56px)",
                color: "#111827",
                fontWeight: 700,
                fontFamily: "Manrope, sans-serif",
                lineHeight: "1.1",
                letterSpacing: "-1.5px",
                textShadow: "0.5px 0 0 currentColor",
                paddingLeft:"10px"

              }}
          >
            {coreFeature.title}
          </h1>
          <p 
            className=" mx-auto" 
             style={{
                fontSize: "16px",
                  fontWeight: "400",
                  color: "#374151",
                lineHeight: "1.7",
                maxWidth: "520px",
              }}
          >
           {coreFeature.description}
          </p>
        </div>

        {/* 9 Cards Grid */}
        <div className="row g-4 mt-2">
         {coreFeature.cards.map((item, index) => (
            <div className="col-lg-4 col-md-6" key={index}>
              <div
                style={{
                  backgroundColor: "#f4fbfb",
                  border: "1.5px solid #0D9488",
                  borderRadius: "16px",
                  padding: "30px",
                  height: "100%",
                  transition: "all 0.3s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#c2e7e7";
                  e.currentTarget.style.boxShadow = "0 10px 30px #0D9488";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#14B8A6";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Icon Circle Container */}
                <div
                  className="d-flex align-items-center gap-3 mb-3"
                >
                  <div
                    style={{
                        width: "36px",
                        height: "36px",
                        background: "#0D9488",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        }}
                  >
                    <i
                        className={item.icon}
                        style={{
                            color: "#FFFFFF",
                            fontSize: "18px",
                        }}
                        />
                  </div>

                  <h3
                    className="fw-bold m-0"
                    style={{
                      color: "#0f172a",
                      fontWeight: "400",
                      fontSize: "16px",
                    }}
                  >
                    {item.title}
                  </h3>
                </div>

                {/* Description */}
                <p 
                  className="mb-0 text-muted"
                  style={{ 
                    fontSize: "14px",
                    lineHeight: "1.6"
                  }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CoreFeaturesSection;
