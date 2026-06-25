import React from "react";

const stats = [
  { value: "500 +", label: "Events Managed" },
  { value: "98%", label: "Customer Satisfaction" },
  { value: "50 +", label: "Service Providers" },
  { value: "24/7", label: "Support Available" },
];

const StatsBar = () => {
  return (
    <section 
      style={{ 
        fontFamily: "Manrope, sans-serif",
        backgroundColor: "#0D9488", 
        padding: "60px 0",
        color: "#ffffff"
      }}
    >
      <div className="container px-4 px-lg-5">
        <div className="row justify-content-center text-center align-items-center g-4">
          {stats.map((item, index) => (
          <div
            key={index}
            className="col-lg col-md-6 position-relative"
          >
            <h3
              className="fw-bold mb-1"
              style={{
                fontSize: "clamp(28px, 4vw, 56px)",
                letterSpacing: "-1px",
              }}
            >
              {item.value}
            </h3>

            <span
              className="fw-semibold"
              style={{
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "#ffffff",
              }}
            >
              {item.label}
            </span>

            {index < stats.length - 1 && (
              <div
                className="d-none d-lg-block position-absolute"
                style={{
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "1px",
                  height: "60px",
                  background: "#ffffff",
                }}
              />
            )}
          </div>
        ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
