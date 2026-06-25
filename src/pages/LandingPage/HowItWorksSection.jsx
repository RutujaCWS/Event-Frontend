import React from "react";

const steps = [
  {
    no: "1",
    title: "Submit Enquiry",
    desc: "Share your event details and requirements",
  },
  {
    no: "2",
    title: "Receive Quotation",
    desc: "Get a customized quote based on your needs",
  },
  {
    no: "3",
    title: "Confirm Booking",
    desc: "Approve the quote and make payment",
  },
  {
    no: "4",
    title: "Event Planning",
    desc: "Our team coordinates and prepares everything",
  },
  {
    no: "5",
    title: "Event Execution",
    desc: "Enjoy a seamless, memorable event",
  },
];

const HowItWorksSection = () => {
  return (
    <section
      id="how-it-works"
      style={{
        backgroundColor: "#ffffff",
        fontFamily: "Manrope, sans-serif",
        padding: "80px 0 60px 0",
        scrollMarginTop: "90px"
      }}
    >
      <div className="container px-4 px-lg-5">
        
        {/* Section Header */}
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
            Process
          </span>
          <h2
            className=" mb-3"
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
            How It Works
          </h2>
          <p 
            className="text-muted mx-auto" 
             style={{
                fontSize: "16px",
                  fontWeight: "400",
                  color: "#374151",
                lineHeight: "1.7",
                maxWidth: "520px",
              }}
          >
            From intimate celebrations to grand corporate gatherings we have the expertise to make every event extraordinary.
          </p>
        </div>

        {/* Timeline Row */}
        <div className="position-relative mt-5">

            {/* Connecting Line */}
            <div
                className="d-none d-md-block"
                style={{
                position: "absolute",
                top: "28px",
                left: "8%",
                right: "8%",
                height: "2px",
                background: "#9FD8D2",
                zIndex: 1,
                }}
            />

            <div
                className="row justify-content-between text-center position-relative"
                style={{ zIndex: 2 }}
            >
                {steps.map((item, index) => (
                <div
                    className="col"
                    key={index}
                    style={{
                    minWidth: "180px",
                    }}
                >
                    {/* Circle */}
                    <div
                    style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "50%",
                        background:
                        "linear-gradient(180deg, #0D9488 0%, #0A6D68 100%)",
                        color: "#fff",
                        fontSize: "24px",
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 18px",
                        boxShadow: "0 4px 12px rgba(13,148,136,0.25)",
                    }}
                    >
                    {item.no}
                    </div>

                    {/* Title */}
                    <h5
                    style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#111827",
                        marginBottom: "10px",
                    }}
                    >
                    {item.title}
                    </h5>

                    {/* Description */}
                    <p
                    style={{
                        fontSize: "12px",
                        color: "#6B7280",
                        lineHeight: "1.6",
                        maxWidth: "150px",
                        margin: "0 auto",
                    }}
                    >
                    {item.desc}
                    </p>
                </div>
                ))}
            </div>
            </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;
