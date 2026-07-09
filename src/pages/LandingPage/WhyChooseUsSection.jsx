import React, { useEffect, useState } from "react";
import { getCmsSection } from "../../services/cmsService";

const WhyChooseUsSection = () => {
  const [cms, setCms] = useState(null);

  useEffect(() => {
    fetchCms();
  }, []);

  const fetchCms = async () => {
    try {
      const res = await getCmsSection("why-choose-us");

      if (res.data?.data?.content) {
        const content = res.data.data.content;

        setCms({
          ...content,

          customerPoints:
            typeof content.customerPoints === "string"
              ? JSON.parse(content.customerPoints)
              : content.customerPoints || [],

          businessPoints:
            typeof content.businessPoints === "string"
              ? JSON.parse(content.businessPoints)
              : content.businessPoints || [],

          benefitPoints:
            typeof content.benefitPoints === "string"
              ? JSON.parse(content.benefitPoints)
              : content.benefitPoints || [],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!cms) return null;
  return (
    <section
      id="why-choose-us"
      style={{
        padding: "80px 0 60px 10px",
        scrollMarginTop: "90px",
        fontFamily: "Manrope, sans-serif",
        overflow: "hidden",
      }}
    >
      <div className="container px-4 px-lg-5">
        
        {/* Section Title */}
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
           {cms.badge}
          </span>
          <h1
            className="fw-bold"
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
            {cms.title}
          </h1>
        </div>

        {/* Content Row */}
        <div className="row align-items-center justify-content-center  g-3">
          
          {/* Left Arch Image */}
          <div className="col-lg-3 d-none d-lg-flex justify-content-center">
            <div
            style={{
              width: "260px",
              height: "430px",
              borderRadius: "0 0 120px 120px",
              borderLeft: "10px solid #0a8484",
              borderBottom: "10px solid #0a8484",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              marginTop: "-180px",
            }}
          >
            <img
              src={
                cms?.leftImage ||
                "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80"
              }

              alt="Creativity Singer"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          </div>

          {/* Middle List Content */}
          <div className="col-lg-6 col-md-7 px-lg-5">
            <h2
              className="mb-4"
              style={{
                fontSize: "clamp(36px, 5vw, 56px)",
                color: "#111827",
                fontWeight: 200,
                fontFamily: "Manrope, sans-serif",
                lineHeight: "1.1",
                letterSpacing: "-1.5px",
                textShadow: "0.5px 0 0 currentColor",
                paddingLeft: "10px",
              }}
            >
             {cms.heading?.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
            </h2>

            {/* Customers Section */}
            <div className="mb-4">
              <span 
                className=" d-block mb-3" 
                 style={{
                color: "#14B8A6",
                fontSize: "18px",
                fontWeight: "400",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
              >
                {cms.customerTitle}
              </span>
              <div className="d-flex flex-column gap-3">
               {cms.customerPoints?.map((item, index) => (
                <div className="d-flex align-items-center gap-3" key={index}>
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(10,132,132,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      width="10"
                      height="8"
                      viewBox="0 0 12 9"
                      fill="none"
                    >
                      <path
                        d="M10.6667 1L3.99997 7.66667L1.3333 5"
                        stroke="#0a8484"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <span
                    className="fw-semibold"
                    style={{ color: "#334155", fontSize: "12px" }}
                  >
                    {item}
                  </span>
                </div>
              ))}
              </div>
            </div>

            {/* Business Owners Section */}
            <div className="mb-4">
              <span 
                className=" d-block mb-3" 
                 style={{
                color: "#14B8A6",
                fontSize: "18px",
                fontWeight: "400",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
              >
               {cms.businessTitle}
              </span>
              <div className="d-flex flex-column gap-3">
                {cms.businessPoints?.map((item, index) => (
                  <div className="d-flex align-items-center gap-3" key={index}>
                    <div 
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(10, 132, 132, 0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}
                    >
                      <svg width="10" height="8" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.6667 1L3.99997 7.66667L1.3333 5" stroke="#0a8484" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="fw-semibold" style={{ color: "#334155", fontSize: "12px" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Overall Benefits Section */}
            <div>
              <span 
                className=" d-block mb-3" 
                 style={{
                color: "#14B8A6",
                fontSize: "18px",
                fontWeight: "400",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
              >
               {cms.benefitTitle}
              </span>
              <div className="d-flex flex-column gap-3">
                {cms.benefitPoints?.map((item, index) => (
                  <div className="d-flex align-items-center gap-3" key={index}>
                    <div 
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(10, 132, 132, 0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}
                    >
                      <svg width="10" height="8" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.6667 1L3.99997 7.66667L1.3333 5" stroke="#0a8484" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="fw-semibold" style={{ color: "#334155", fontSize: "12px" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Arch Image */}
         <div className="col-lg-3 d-none d-lg-flex justify-content-center">
            <div
              style={{
                width: "260px",
                height: "400px",
                borderRadius: "120px 120px 0 0",
                borderLeft: "10px solid #0a8484",
                borderTop: "10px solid #0a8484",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                marginTop: "320px",
              }}
            >
              <img
              src={
                cms?.rightImage ||
                "https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&w=600&q=80"
              }
                alt="Excellence Event Lights"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default WhyChooseUsSection;
