import React, { useEffect, useState } from "react";
import { getCmsSection } from "../../services/cmsService";
import "./EventLandingPage.css";
const JourneySection = () => {
  const [journeyData, setJourneyData] = useState({
  badge: "",
  title: "",
  description: "",
  feature1: "",
  feature2: "",
  feature3: "",
  feature4: "",
  image1: "",
  image2: "",
  image3: "",
  image4: "",
});
useEffect(() => {
  fetchJourneyData();
}, []);

const fetchJourneyData = async () => {
  try {
    const res = await getCmsSection("journey");

    if (res.data?.data?.content) {
      setJourneyData(res.data.data.content);
    }
  } catch (error) {
    console.log(error);
  }
};
  return (
    <section
      
      style={{
        backgroundColor: "#ffffff",
        padding: "80px 0",
        overflow: "hidden",
        fontFamily: "Manrope, sans-serif",
      }}
    >
      <div className="container px-4 px-lg-5">
        <div className="row align-items-center g-5">
          
          {/* Left Collage Column */}
          <div className="col-lg-6 d-none d-lg-flex justify-content-center align-items-center">
            <div className="d-flex align-items-stretch gap-4" style={{ height: "500px" }}>
              
              {/* Column 1: Tall Pill */}
              <div 
                style={{ 
                  width: "170px", 
                  borderRadius: "100px", 
                  overflow: "hidden", 
                  boxShadow: "0 10px 25px rgba(0,0,0,0.08)" 
                }}
              >
                <img 
                 src={
                  journeyData.image1 ||
                  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80"
                }
                  alt="Event Stage" 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* Column 2: Circle + Arch */}
              <div className="d-flex flex-column gap-4 justify-content-center" >
                {/* Circle */}
                <div
                  style={{
                      height: "250px",
                    width: "170px",
                    borderRadius: "999px", // semicircle on left & right
                    overflow: "hidden",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                  }}
                >
                  <img
                    src={
                      journeyData.image2 ||
                      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80"
                    }
                    alt="Event Dancer"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {/* Arch */}
                <div 
                  style={{ 
                    flexGrow: 2,
                   borderRadius: "85px 85px 5px 5px",
                    overflow: "hidden",
                     width: "170px",
                     height: "150px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                    marginBottom:"30px"

                  }}
                >
                  <img 
                   src={
                    journeyData.image3 ||
                    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80"
                  }
                    alt="Festival Crowd" 
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              </div>

              {/* Column 3: Tall Pill */}
              <div 
                style={{ 
                   width: "170px", 
                  borderRadius: "100px", 
                  overflow: "hidden", 
                  boxShadow: "0 10px 25px rgba(0,0,0,0.08)" 
                }}
              >
                <img 
                 src={
                    journeyData.image4 ||
                    "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80"
                  }
                  alt="Event Performance" 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

            </div>
          </div>

          {/* Right Content Column */}
          <div
            className="col-lg-6 journey-content"
            style={{
                position: "relative",
                margin: "20px 0",
            }}
            >
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
              {journeyData.badge}
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
              {journeyData.title}
            </h1>

            {/* Paragraph */}
            <p 
              className=" mb-5"
              style={{
                fontSize: "16px",
                  fontWeight: "400",
                  color: "#374151",
                lineHeight: "1.7",
                maxWidth: "520px",
              }}
            >
              {journeyData.description}
            </p>

            {/* Features Checklist */}
            <div className="row g-3 ">
             {[
                journeyData.feature1,
                journeyData.feature2,
                journeyData.feature3,
                journeyData.feature4,
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
                      fontWidth:"400",
                      marginTop: "-10px", 
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

        </div>
      </div>
    </section>
  );
};

export default JourneySection;
