import React, { useEffect, useState } from "react";
import { getCmsSection } from "../../services/cmsService";
import "./EventLandingPage.css";
const SolutionSection = () => {
  const [solutionData, setSolutionData] = useState({
  badge: "",
  title: "",
  description: "",
  feature1: "",
  feature2: "",
  feature3: "",
  feature4: "",
  image: "",
});
useEffect(() => {
  fetchSolutionData();
}, []);

const fetchSolutionData = async () => {
  try {
    const res = await getCmsSection("solution");

    if (res.data?.data?.content) {
      setSolutionData(res.data.data.content);
    }
  } catch (error) {
    console.log(error);
  }
};
  return (
    <section
      id="solution"
      style={{
        backgroundColor: "#f4fbfb", // Light minty background
        fontFamily: "Manrope, sans-serif",
        padding: "80px 0 60px 0",
        overflow: "hidden",
      }}
    >
      <div className="container px-4 px-lg-5">
        <div className="row align-items-center g-5">
          
          {/* Left Image Column */}
          <div className="col-lg-6 mt-4 mt-lg-0">
            <div className="solution-image"
              style={{
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
                height: "380px",
              }}
            >
             <img
                src={
                  solutionData.image ||
                  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1000&q=80"
                }
                alt="Digital Event Solution" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>

          {/* Right Content Column */}
          <div className="col-lg-6 solution-content" style={{
                position: "relative",
                margin: "20px 0",
                
            }}>
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
             {solutionData.badge}
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
              {solutionData.title}
            </h1>

            {/* Paragraph */}
            <p 
              className="mb-5"
               style={{
                fontSize: "16px",
                  fontWeight: "400",
                  color: "#374151",
                lineHeight: "1.7",
                maxWidth: "520px",
              }}
            >
              {solutionData.description}
            </p>

            {/* Teal check list (Grid of 4 items) */}
            <div className="row g-4">
              {[
                  solutionData.feature1,
                  solutionData.feature2,
                  solutionData.feature3,
                  solutionData.feature4,
                ]
                  .filter(Boolean)
                  .map((item, index) => (
                <div className="col-md-6" key={index}>
                  <div className="d-flex align-items-center gap-3">
                    <div 
                       style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                         backgroundColor: "#CCFBF1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                         marginTop: "-8px",

                      }}
                    >
                      <svg 
                        width="12" 
                        height="9" 
                        viewBox="0 0 12 9" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          d="M10.6667 1L3.99997 7.66667L1.3333 5" 
                          stroke="#14B8A6" 
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
                        lineHeight: "1.4"
                      }}
                    >
                      {item}
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
        
      </div>
      
    </section>
    
  );
};

export default SolutionSection;
