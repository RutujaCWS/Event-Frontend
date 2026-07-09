
import { useNavigate } from "react-router-dom";
import "./EventLandingPage.css";
import React, { useEffect, useState } from "react";
import { getCmsSection } from "../../services/cmsService";
import {
  TbHeart,
  TbCake,
  TbBriefcase,
  TbCrown,
  TbSparkles,
} from "react-icons/tb";

const categoryIcons = {
  heart: (
    <TbHeart
      size={20}
      color="#fff"
    />
  ),

  cake: (
    <TbCake
      size={20}
      color="#fff"
    />
  ),

  briefcase: (
    <TbBriefcase
      size={20}
      color="#fff"
    />
  ),

  crown: (
    <TbCrown
      size={20}
      color="#fff"
    />
  ),

  sparkles: (
    <TbSparkles
      size={20}
      color="#fff"
    />
  ),
};
{/* 
const specializeEvents = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7.5" cy="15.5" r="5.5" />
        <circle cx="16.5" cy="15.5" r="5.5" />
        <path d="M12 2C12 2 14.5 5.5 12 9" />
        <path d="M12 9C9.5 5.5 12 2 12 2Z" />
      </svg>
    ),
    title: "Wedding Event",
    desc: "Complete planning for decor, catering, venue, and coordination",
    bgImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
    slug: "wedding-events",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
        <path d="M12 2v2" />
        <path d="M17 5l-1.5 1.5" />
        <path d="M7 5l1.5 1.5" />
      </svg>
    ),
    title: "Birthday Event",
    desc: "Customized packages for celebrations of any size",
    bgImage: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80",
    slug: "birthday-events",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    title: "Corporate Events",
    desc: "Professional event execution for meetings, conferences, parties.",
    bgImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80",
    slug: "corporate-events",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    title: "Cultural Event",
    desc: "Seamless organization for traditional and community events.",
    bgImage: "https://images.unsplash.com/photo-1608976478546-5be97920ec08?auto=format&fit=crop&w=600&q=80",
    slug: "cultural-events",
  },
];
*/}
const PerfectOccasion = () => {
  const navigate = useNavigate();
  const [specializeEvents, setSpecializeEvents] = useState([]);
  useEffect(() => {
  fetchCategories();
}, []);

const fetchCategories = async () => {
  try {
    const response = await getCmsSection("services");

    if (response.data.success) {
      const cms = response.data.data.content;

      setSpecializeEvents(cms.categories || []);
    }
  } catch (error) {
    console.log(error);
  }
};

  return (
    <section 
      id="services" 
      style={{ 
        backgroundColor: "#ffffff",
        padding: "80px 0 60px 10px",
        scrollMarginTop: "90px",
        fontFamily: "Manrope, sans-serif",
        
      }}
    >
      <div className="container px-4 px-lg-6">
        
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
            Industry Use Cases
          </span>
          <h1
            className="fw-bold mb-3"
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
            Events We Specialize In
          </h1>
          <p 
            className=" mx-auto" 
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

        {/* 4 Cards Grid */}
        <div className="row g-4 justify-content-center" >
          {specializeEvents.map((item, index) => (
           <div
              className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 d-flex justify-content-center"
              key={index}
            >
              <div
                onClick={() => navigate(`/services/${item.slug}`)}
                style={{
                  height: "350px",
                  width: "100%",
                  maxWidth: "280px",
                  borderRadius: "24px",
                  backgroundImage: `url(${
                      item.image ||
                      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
                  })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                className="event-specialize-card"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(10, 132, 132, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.05)";
                }}
              >
                {/* Dark Overlay */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.6) 50%, rgba(15, 23, 42, 0.2) 100%)",
                    zIndex: 1,
                  }}
                />

                {/* Content */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    padding: "30px",
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  {/* Teal Icon Box */}
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      backgroundColor: "#0a8484",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "16px",
                      boxShadow: "0 4px 10px rgba(10, 132, 132, 0.3)",
                    }}
                  >
                    {categoryIcons[item.icon]}
                  </div>

                  {/* Heading */}
                  <h4
                    className="fw-bold mb-2"
                    style={{
                      color: "#ffffff",
                      fontSize: "18px",
                    }}
                  >
                    {item.name}
                  </h4>

                  {/* Description */}
                  <p
                    className="mb-0"
                    style={{
                     color: "#ffffff",
                      fontSize: "14px",
                      lineHeight: "1.5",
                    }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PerfectOccasion;
