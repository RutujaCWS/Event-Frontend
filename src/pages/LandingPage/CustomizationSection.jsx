import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

const features = [
  {
    icon: "bi-calendar2-check",
    title: "Submit Enquiry",
    description: "Wedding, birthday, corporate, custom events",
  },
  {
    icon: "bi-patch-check",
    title: "Service Packages",
    description: "Decor, catering, entertainment, logistics",
  },
  {
    icon: "bi-currency-dollar",
    title: "Budget & Pricing",
    description: "Flexible packages with custom quotes",
  },
  {
    icon: "bi-calendar-week",
    title: "Event Details",
    description: "Date, location, guest count",
  },
  {
    icon: "bi-bell",
    title: "Notifications",
    description: "Updates and reminders",
  },
  {
    icon: "bi-bar-chart-line",
    title: "Reports & Dashboard",
    description: "Event tracking and insights",
  },
];

const CustomizationSection = () => {
  return (
    <>
      {/* Top Stroke Band */}
      <div
        style={{
          width: "100%",
          height: "150px",
          background: "#E2E8F0",
        }}
      />

      <section
        style={{
          background: "#F9FAFB",
          padding: "80px 0",
          fontFamily: "Manrope, sans-serif",
        }}
      >
        <div className="container">
          {/* Header */}
          <div className="row justify-content-between align-items-start mb-5">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <span  className=" mb-3 d-inline-block" 
                style={{
                color: "#14B8A6",
                fontSize: "18px",
                fontWeight: "400",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
              >
                CUSTOMIZATION
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

              }}
              >
                Designed Around Your Fully Needs
              </h1>
            </div>

            <div className="col-lg-4">
              <p
                className="text-muted mx-auto" 
             style={{
                fontSize: "16px",
                  fontWeight: "400",
                  color: "#374151",
                lineHeight: "1.7",
                maxWidth: "520px",
              }}
              >
                Every event is unique. Customize services, budgets, and requirements to match your vision. A flexible platform designed to bring your event vision to life.
              </p>
            </div>
          </div>

          {/* Cards */}
          <div className="row g-4">
            {features.map((item, index) => (
              <div className="col-lg-4 col-md-6" key={index}>
                <div
                  style={{
                    border: "1px solid #99F6E4",
                    borderRadius: "12px",
                    padding: "24px",
                    background: "#FFFFFF",
                    height: "100%",
                    minHeight: "150px",
                    transition: "all 0.3s ease",
                  }}
                >
                  {/* Icon */}
                  <div
                    className="d-flex align-items-center gap-3 mb-3"
                    >
                    {/* Icon */}
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

                    {/* Title */}
                    <h3 className="fw-bold m-0"
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
    </>
  );
};

export default CustomizationSection;