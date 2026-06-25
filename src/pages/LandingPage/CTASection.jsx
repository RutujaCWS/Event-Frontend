import React from "react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section
      style={{
         padding: "80px 0 60px 10px",
        fontFamily: "Manrope, sans-serif",
      }}
    >
      <div className="container px-4 px-lg-5">
        <div
          style={{
            position: "relative",
            borderRadius: "20px",
            overflow: "hidden",
            minHeight: "420px",
            backgroundImage:
              "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(rgba(13,148,136,0.75), rgba(13,148,136,0.75))",
            }}
          />

          {/* Content */}
          <div
            className="d-flex flex-column justify-content-center align-items-center text-center"
            style={{
              position: "relative",
              zIndex: 2,
              minHeight: "420px",
              padding: "40px 20px",
            }}
          >
            <h1
              style={{
                color: "#FFFFFF",
                fontSize: "clamp(36px, 5vw, 56px)",
                fontWeight: 500,
                lineHeight: "1.2",
                maxWidth: "700px",
                marginBottom: "24px",
                lineHeight: "1.1",
                letterSpacing: "-1.5px",
                textShadow: "0.5px 0 0 currentColor",
              }}
            >
              Start Planning Your Event Today
            </h1>

            <p
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: "16px",
                lineHeight: "1.8",
                maxWidth: "650px",
                marginBottom: "40px",
              }}
            >
              From idea to execution manage everything seamlessly
              with one powerful platform
            </p>

            <div className="d-flex flex-column flex-sm-row gap-3">
              <button
                onClick={() => navigate("/contact")}
                className="btn"
                style={{
                  minWidth: "300px",
                  height: "56px",
                  borderRadius: "8px",
                  border: "1px solid #FFFFFF",
                  background: "transparent",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  fontSize: "16px",
                }}
              >
                Book a Consultation
              </button>

              <button
                onClick={() => navigate("/services")}
                className="btn"
                style={{
                  minWidth: "160px",
                  height: "56px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#0D9488",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  fontSize: "16px",
                }}
              >
                Plan Your Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;