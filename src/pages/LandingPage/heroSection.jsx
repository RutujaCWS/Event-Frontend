import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCmsSection } from "../../services/cmsService";


const HeroSection = () => {
  const navigate = useNavigate();
  const [heroData, setHeroData] = useState(null);
  

useEffect(() => {
  fetchHeroSection();
}, []);
useEffect(() => {
  console.log("Hero Data Updated:", heroData);
}, [heroData]);

const fetchHeroSection = async () => {
  try {
    const response = await getCmsSection("home");

    console.log("CMS Response:", response);

    setHeroData(response?.data?.data?.content);
  } catch (error) {
    console.error(error);
  }
};
  return (
    <section
      id="home"
      style={{
       //backgroundColor: "#F9FAFB",
        fontFamily: "Manrope, sans-serif",
        padding: "80px 0 60px 0",
        position: "relative",
        overflow: "hidden",
        scrollMarginTop: "90px",
        
      }}
    >
      <div className="container px-4 px-lg-6 mt-3">
        <div className="row align-items-center g-5">
          
          {/* Left Content */}
          <div className="col-lg-6" >
            {/* Trusted Badge */}
           <div className="d-inline-flex align-items-center gap-2 mb-4">
            <i
              className="bi bi-lock-fill"
              style={{
                color: "#14B8A6",
                fontSize: "18px",
               
              }}
            ></i>

            <span
             
              style={{
                color: "#14B8A6",
                fontSize: "18px",
                fontWeight: "400",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
               {heroData?.badgeText}
            </span>
          </div>

            {/* Heading */}
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
            {heroData?.bannerTitle}
            </h1>

            {/* Subtext */}
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
             {heroData?.bannerDescription}
            </p>
            {/* CTAs */}
            <div className="d-flex flex-wrap gap-3 mb-5">
              <button
                onClick={() => navigate("/contact")}
                className="btn text-white px-4 py-3"
                style={{
                  backgroundColor: "#0D9488",
                  borderRadius: "50px",
                  fontWeight: "400",
                  fontSize: "16px",
                  height: "54px",
                  minWidth: "180px",
                  border: "none",
                   fontFamily: "Manrope, sans-serif",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(10, 132, 132, 0.2)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#14B8A6";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#0D9488";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
              {heroData?.button1}
              </button>

              <button
                onClick={() => navigate("/contact")}
                className="btn px-4 py-3"
                style={{
                  backgroundColor: "transparent",
                  color: "#0D9488",
                  border: "2px solid #0D9488",
                  borderRadius: "50px",
                  fontWeight: "400",
                  fontSize: "16px",
                  height: "54px",
                  minWidth: "180px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(10, 132, 132, 0.05)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {heroData?.button2}
              </button>
            </div>
          </div>

          {/* Right Collage Column */}
          <div className="col-lg-6 d-none d-lg-flex justify-content-center align-items-center">
            
            {/* Collage Container */}
            <div 
              style={{ 
                position: "relative", 
                width: "480px", 
                height: "440px",
                margin: "20px 0",
                 transform: "translateX(100px)",
                
              }}
            >
              {/* Couple Circle Image */}
              <div
                style={{
                  position: "absolute",
                  left: "0px",
                  top: "20px",
                  width: "170px",
                  height: "210px",
                  borderRadius: "95px", // Creates semicircle top & bottom
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  zIndex: 2,
                }}
              >
                <img
                  src={
                    heroData?.heroImage1 ||
                    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80"
                  }
                  alt="Hero 1"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              {/* Singer Arch Image (Tall, Right) */}
              <div
                style={{
                  position: "absolute",
                  right: "0px",
                  top: "10px",
                  width: "270px",
                  height: "500px",
                  borderRadius: "135px 135px 20px 20px",
                  overflow: "hidden",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.12)",

                  borderTop: "10px solid #0D9488",
                  borderLeft: "10px solid #0D9488",
                  borderBottom: "10px solid #0D9488",
                  borderRight: "none",
                  
                  zIndex: 3,
                }}
              >
               <img
                src={
                  heroData?.heroImage2 ||
                  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80"
                }
                alt="Hero 2"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              </div>

              {/* Concert Arch Image (Bottom Left) */}
              <div
                style={{
                  position: "absolute",
                  left: "0px",
                  top: "245px", // Adjust based on your layout
                  width: "170px",
                  height: "260px", // Increased from 210px
                  borderRadius: "95px 95px 20px 20px",
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  zIndex: 1,
                }}
              >
                <img
                  src={
                    heroData?.heroImage3 ||
                    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80"
                  }
                  alt="Hero 3"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              {/* Hand Drawn Sparkles/Stars using SVGs */}
              
              {/* Star Top-Left of Couple */}
              <svg 
                style={{ position: "absolute", left: "-20px", top: "-10px", zIndex: 4 }}
                width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17 0C17 9.38883 9.38883 17 0 17C9.38883 17 17 24.6112 17 34C17 24.6112 24.6112 17 34 17C24.6112 17 17 9.38883 17 0Z" fill="#F59E0B" />
              </svg>

              {/* Star Middle-Top (orange outline star) */}
              <svg 
                style={{ position: "absolute", left: "210px", top: "-10px", zIndex: 4 }}
                width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 0L15.09 8.5L24 9.54L17.27 15.18L19.18 24L12 19.3L4.82 24L6.73 15.18L0 9.54L8.91 8.5L12 0Z" stroke="#F59E0B" strokeWidth="2" fill="none" />
              </svg>

              {/* Sparkle Above Singer */}
              <svg 
                style={{ position: "absolute", right: "-10px", top: "-20px", zIndex: 4 }}
                width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18 0C18 9.94113 9.94113 18 0 18C9.94113 18 18 26.0589 18 36C18 26.0589 26.0589 18 36 18C26.0589 18 18 9.94113 18 0Z" fill="#F59E0B" />
              </svg>

              {/* Red Swoosh Bottom Center */}
              <svg
                style={{
                  position: "absolute",
                  left: "180px",
                  bottom: "-110px", // was -30px
                  zIndex: 4,
                }}
                width="50"
                height="40"
                viewBox="0 0 50 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 15C10 5 25 -2 38 12C45 20 48 32 42 38C35 44 26 30 22 22C18 14 28 28 32 30"
                  stroke="#F59E0B"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>

            </div>
          </div>

        </div>

        {/* Footer info bar */}
        <div
          className="mt-5 d-flex align-items-center gap-2 flex-wrap"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <span
            className="text-muted"
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#374151",
            }}
          >
            {heroData?.welcomeMessage}
          </span>

          <a
          href="tel:+910222123456"
          className="d-flex align-items-center gap-2 fw-bold"
          style={{
            color: "#0D9488",
            fontWeight: "800",
            textDecoration: "none",
            fontSize: "16px",
          }}
        >
          <i
          className="bi bi-telephone"
          style={{
            color: "#0D9488",
            fontSize: "20px",
            textShadow: "0.4px 0 currentColor",
          }}
        ></i>

           {heroData?.phoneNumber}
        </a>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;