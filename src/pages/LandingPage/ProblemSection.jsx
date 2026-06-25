import React from "react";
import "./EventLandingPage.css";
const ProblemSection = () => {
  return (
    <section
      id="problem"
      style={{
        backgroundColor: "#f4fbfb",
        padding: "80px 0 60px 0",
        overflow: "hidden",
        fontFamily: "Manrope, sans-serif",

      }}
    >
      <div className="container px-4 px-lg-5">
        <div className="row align-items-center g-5">
          
          {/* Left Content Column */}
          <div className="col-lg-6">
            {/* Small Badge */}
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
              The Problem
            </span>

            {/* Title */}
            <h1
              className="fw-bold mb-4"
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
              Planning Events Is Time Consuming and Stressful
            </h1>

            {/* Paragraph */}
            <p 
              className="text-muted mb-5"
              style={{
                fontSize: "16px",
                  fontWeight: "400",
                  color: "#374151",
                lineHeight: "1.7",
                maxWidth: "520px",
              }}
            >
              Managing vendors, budgets, and coordination manually leads to confusion and delays. Poor planning leads to stressful experiences and inconsistent event quality.
            </p>

            {/* Red X list (Grid of 6 items) */}
            <div className="row g-4">
              {[
                "Difficulty finding reliable service providers",
                "Budget management issues",
                "No clear pricing or quotations",
                "Lack of centralized event tracking",
                "Multiple follow-ups and communication gaps",
                "Time-consuming manual coordination"
              ].map((item, index) => (
                <div className="col-md-6" key={index}>
                  <div className="d-flex align-items-center gap-3">
                    <div 
                       style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(209, 146, 146, 0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                         marginTop: "-8px",

                      }}
                    >
                      <svg 
                        width="10" 
                        height="10" 
                        viewBox="0 0 10 10" 
                        
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          d="M9 1L1 9M1 1L9 9" 
                          stroke="#EF4444" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span
                    className="fw-semibold"
                    style={{
                      color: "#14B8A6",
                      fontSize: "12px",
                      lineHeight: "1.2",
                      
                    }}
                  >
                    {item}
                  </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Image Column */}
          <div className="col-lg-6 mt-4 mt-lg-0">
            <div
              className="problem-image"
              style={{
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
                height: "380px",
              }}
            >
              <img 
                src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80" 
                alt="Crowded Stressful Event" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
