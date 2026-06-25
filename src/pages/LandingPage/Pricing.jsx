import React from "react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();

  const pricingPlans = [
    {
      price: "₹5,000",
      title: "Basic Package",
      desc: "For small events and simple setups",
      points: [
        "Up to 50 guests",
        "Basic decor setup",
        "Venue coordination",
        "Event enquiry & quotation",
      ],
      popular: false,
    },
    {
      price: "₹10,000",
      title: "Standard Package",
      desc: "For medium-sized events with customization",
      points: [
        "Up to 200 guests",
        "Full venue management",
        "Real-time booking tracking",
        "Payment management",
      ],
      popular: true,
    },
    {
      price: "₹15,000",
      title: "Premium Package",
      desc: "For large and high-end events",
      points: [
        "Unlimited guests",
        "Luxury decor & entertainment",
        "End-to-end coordination",
        "Dedicated event manager",
      ],
      popular: false,
    },
  ];

  return (
    <section 
      id="pricing" 
      style={{ 
        backgroundColor: "#ffffff",
         padding: "80px 0 60px 0",
        scrollMarginTop: "90px",
        fontFamily: "Manrope, sans-serif",
      }}
    >
      <div className="container px-4 px-lg-2">
        
        {/* Header */}
        <div className=" mb-5">
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
            Pricing Plans
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
          Flexible Pricing for
          <br />
          Every Event
        </h1>
        </div>

        {/* Pricing Cards Grid */}
        <div className="row g-4 justify-content-center align-items-stretch mt-4">
          {pricingPlans.map((item, index) => {
            const isPopular = item.popular;
            
            return (
              <div className="col-lg-4 col-md-6" key={index}>
                <div
                  style={{
                    backgroundColor: isPopular ? "#0D9488" : "#f4fbfb",
                    border: isPopular ? "none" : "1.5px solid #e2e8f0",
                    borderRadius: "15px",
                    padding: "40px 30px",
                    height: "100%",
                    width:"100",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    transition: "all 0.3s ease",
                    boxShadow: isPopular ? "0 15px 35px rgba(10, 132, 132, 0.15)" : "0 10px 30px rgba(0,0,0,0.02)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    if (!isPopular) {
                      e.currentTarget.style.borderColor = "#c2e7e7";
                      e.currentTarget.style.boxShadow = "0 15px 35px rgba(10, 132, 132, 0.05)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    if (!isPopular) {
                      e.currentTarget.style.borderColor = "#e2e8f0";
                      e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.02)";
                    }
                  }}
                >
                  
                  {/* Price */}
                  <div className="d-flex align-items-baseline mb-2">
                    <span 
                      style={{ 
                        fontSize: "22px", 
                        fontWeight: "600",
                        color: isPopular ? "#ffffff" : "#0f172a",
                        letterSpacing: "-0.5px"
                      }}
                    >
                      {item.price}
                    </span>
                    <span 
                      className="ms-2"
                      style={{ 
                        fontSize: "16px", 
                        fontWeight: "600",
                        color: isPopular ? "rgba(255, 255, 255, 0.75)" : "#0D9488" 
                      }}
                    >
                      /Month
                    </span>
                  </div>

                  {/* Title */}
                  <h3 
                    className="fw-bold mb-2"
                    style={{ 
                      fontSize: "32px", 
                       fontWeight: "600",
                      color: isPopular ? "#ffffff" : "#0f172a" 
                    }}
                  >
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p 
                    style={{ 
                      color: isPopular ? "rgba(255, 255, 255, 0.8)" : "#64748b",
                      fontSize: "14px",
                      lineHeight: "1.5",
                      marginBottom: "25px",
                      minHeight: "42px"
                    }}
                  >
                    {item.desc}
                  </p>

                  {/* Divider */}
                  <div 
                    style={{
                      height: "1px",
                      backgroundColor: isPopular ? "rgba(255, 255, 255, 0.75)" : "#0D9488",
                      marginBottom: "25px"
                    }}
                  />

                  {/* CUSTOM Header */}
                  <span
                    className="fw-bold d-block mb-3"
                    style={{
                      fontSize: "12px",
                      letterSpacing: "0.05em",
                      color: isPopular ? "rgba(255, 255, 255, 0.75)" : "#0D9488",
                      textTransform: "uppercase"
                    }}
                  >
                    Custom
                  </span>

                  {/* Bullet points */}
                  <ul 
                    className="list-unstyled mb-5"
                    style={{ flexGrow: 1 }}
                  >
                    {item.points.map((point, i) => (
                      <li 
                        key={i} 
                        className="d-flex align-items-center mb-3"
                        style={{ 
                          color: isPopular ? "#ffffff" : "#334155",
                          fontSize: "14px",
                          fontWeight: "600",
                          letterSpacing:"1.4"
                        }}
                      >
                        <span 
                          className="fw-bold me-2"
                          style={{
                            color: isPopular ? "#ffffff" : "#0D9488",
                            fontSize: "14px"
                          }}
                        >
                          •
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    className="btn fw-semibold w-100"
                    onClick={() => navigate("/contact")}
                    style={{
                      backgroundColor: isPopular ? "#ffffff" : "#0D9488",
                      color: isPopular ? "#0D9488" : "#ffffff",
                      borderRadius: "50px",
                      padding: "12px 24px",
                      border: "none",
                      fontSize: "15px",
                      height: "50px",
                      transition: "all 0.3s ease",
                      boxShadow: isPopular ? "0 4px 15px rgba(255, 255, 255, 0.1)" : "0 4px 15px rgba(10, 132, 132, 0.15)"
                    }}
                    onMouseEnter={(e) => {
                      if (isPopular) {
                        e.currentTarget.style.backgroundColor = "#f8fafc";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      } else {
                        e.currentTarget.style.backgroundColor = "#086f6f";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isPopular) {
                        e.currentTarget.style.backgroundColor = "#ffffff";
                        e.currentTarget.style.transform = "translateY(0)";
                      } else {
                        e.currentTarget.style.backgroundColor = "#0a8484";
                        e.currentTarget.style.transform = "translateY(0)";
                      }
                    }}
                  >
                    Get Custom Quote
                  </button>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Pricing;