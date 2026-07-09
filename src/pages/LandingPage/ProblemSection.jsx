import React, { useEffect, useState } from "react";
import { getCmsSection } from "../../services/cmsService";
import "./EventLandingPage.css";
const ProblemSection = () => {
  const [problemData, setProblemData] = useState({
  badge: "",
  title: "",
  description: "",
  point1: "",
  point2: "",
  point3: "",
  point4: "",
  point5: "",
  point6: "",
  image: "",
});
useEffect(() => {
  fetchProblemData();
}, []);

const fetchProblemData = async () => {
  try {
    const res = await getCmsSection("problem");

    if (res.data?.data?.content) {
      setProblemData(res.data.data.content);
    }
  } catch (error) {
    console.log(error);
  }
};
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
             {problemData.badge}
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
              {problemData.title}
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
             {problemData.description}
            </p>

            {/* Red X list (Grid of 6 items) */}
            <div className="row g-4">
            {[
              problemData.point1,
              problemData.point2,
              problemData.point3,
              problemData.point4,
              problemData.point5,
              problemData.point6,
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
                        backgroundColor: "rgba(209, 146, 146, 0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                         marginTop: "-8px",

                      }}
                    >
                     <span
                        style={{
                          color: "#EF4444",
                          fontSize: "14px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <i className="bi bi-x-circle"></i>
                      </span>
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
                 src={
                  problemData.image ||
                  "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80"
                }
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
