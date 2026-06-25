import React from "react";
import "./EventLandingPage.css";
const BuildToScaleSection = () => {
  const features = [
    "Mobile Apps (Android & iOS)",
    "Live Chat Support",
    "Event Package Builder",
    "AI-Based Recommendations",
  ];

  return (
    <section
      style={{
        background: "linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)",
        padding: "80px 0 60px 10px",
        fontFamily: "Manrope, sans-serif",
      }}
    >
      <div className="container px-4 px-lg-5">
        <div className="row align-items-center g-5">
          
          {/* Left Content */}
          <div className="col-lg-6">
            <span  className=" mb-3 d-inline-block" 
             
                style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "18px",
                fontWeight: "400",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Build To Scale
            </span>

            <h1  className=" mb-3"
            
              style={{
                fontSize: "clamp(36px, 5vw, 56px)",
                color: "#FFFFFF",
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

            <p
              
              
             style={{
                fontSize: "16px",
                fontWeight: "400",
                color: "#FFFFFF",
                lineHeight: "1.7",
                maxWidth: "520px",
                marginTop:"50px"
              }}
            >
              Expand your platform with advanced features coming
              soon designed for the next generation.
            </p>
          </div>

          {/* Right Features */}
          <div className="col-lg-6">
            <div className="d-flex flex-column gap-3">
              {features.map((feature, index) => (
                <div
                    key={index}
                    className="d-flex justify-content-between align-items-center build-scale-card"
                    style={{
                        background: "rgba(255,255,255,0.12)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: "16px",
                        padding: "8px 22px",
                    }}
                    >
                  <span
                    style={{
                      color: "#FFFFFF",
                      fontSize: "16px",
                      fontWeight: 400,
                    }}
                  >
                    {feature}
                  </span>

                  <span
                    style={{
                      background: "rgba(255,255,255,0.18)",
                      color: "#FFFFFF",
                      fontSize: "12px",
                      fontWeight: 600,
                      padding: "6px 14px",
                      borderRadius: "999px",
                    }}
                  >
                    Coming Soon
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BuildToScaleSection;