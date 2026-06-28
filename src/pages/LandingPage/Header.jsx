import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { getCmsSection } from "../../services/cmsService";
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [logo, setLogo] = useState("");

 const goToSection = (sectionId) => {
  const scrollToTarget = () => {
    const section = document.getElementById(sectionId);

    if (section) {
      const navbarHeight = 80; // your navbar height

      const offsetTop =
        section.getBoundingClientRect().top +
        window.pageYOffset -
        navbarHeight;

      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  if (location.pathname !== "/") {
    navigate("/");
    setTimeout(scrollToTarget, 200);
  } else {
    scrollToTarget();
  }
};

const [visibility, setVisibility] = useState({
  home: {
    about: true,
    services: true,
    gallery: true,
    contact: true,
  },
});

useEffect(() => {
  fetchVisibility();
   fetchLogo();
}, []);

const fetchVisibility = async () => {
  try {
    const res = await getCmsSection("visibility");

    if (res.data?.data?.content) {
      setVisibility(res.data.data.content);
    }
  } catch (error) {
    console.error(error);
  }
};
const fetchLogo = async () => {
  try {
    const res = await getCmsSection("logo");

    if (res.data?.data?.content?.logo) {
      setLogo(res.data.data.content.logo);
    }
  } catch (error) {
    console.error(error);
  }
};

  const isHome = location.pathname === "/";

  const navLinkStyle = {
    color: "#374151",
    fontSize: "16px",
    fontWeight: "600",
    fontFamily: "Manrope, sans-serif",
    transition: "all 0.3s ease",
  };

  const handleNavHover = (e, hover = true) => {
    e.target.style.color = hover ? "#0D9488" : "#374151";
  };
const closeNavbar = () => {
  const navbar = document.getElementById("navbarNav");
  if (navbar.classList.contains("show")) {
    navbar.classList.remove("show");
  }
};

  return (
   <nav
        className="navbar navbar-expand-lg sticky-top navbar-light"
        style={{
          minHeight: "80px",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E2E8F0",
          boxShadow: "0 2px 8px rgba(17,24,39,0.04)",
          fontFamily: "Manrope, sans-serif",
        }}
      >
      <div className="container px-4 px-lg-5">
        {/* Logo  */}
        <Link
            to="/"
            className="navbar-brand d-flex align-items-center"
          >
            {logo ? (
              <img
                src={logo}
                alt="Company Logo"
                style={{
                  height: "50px",
                  width: "auto",
                  objectFit: "contain",
                }}
              />
            ) : (
              <span
                style={{
                  color: "#0D9488",
                  fontSize: "28px",
                  fontWeight: "700",
                  letterSpacing: "-0.5px",
                  fontFamily: "Manrope, sans-serif",
                }}
              >
                Vevora
              </span>
            )}
          </Link>
     {/* 
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center"
          style={{
            color: "#0D9488",
            fontSize: "28px",
            fontWeight: "700",
            letterSpacing: "-0.5px",
            fontFamily: "Manrope, sans-serif",
          }}
        >
          Vevora
        </Link>
*/}  
        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{
            outline: "none",
            boxShadow: "none",
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
              className="collapse navbar-collapse text-center text-lg-start"
              id="navbarNav"
              style={{
              background: "#FFFFFF",
            }}
            >
          {/* Navigation Links */}
         <ul className="navbar-nav mx-auto gap-1 gap-lg-0 mt-3 mt-lg-0 align-items-lg-center align-items-start">
            <li className="nav-item">
              <button
                className="nav-link border-0 bg-transparent px-3 py-2"
                style={{
                  ...navLinkStyle,
                  color: isHome ? "#0D9488" : "#374151",
                }}
                 onClick={() => {
                goToSection("home");
                 window.scrollTo(0, 0);
                closeNavbar();
              }}
                onMouseEnter={(e) => handleNavHover(e, true)}
                onMouseLeave={(e) =>
                  handleNavHover(e, !isHome ? false : true)
                }
              >
                Home
              </button>
            </li>

           
            {visibility?.home?.about && (
              <li className="nav-item">
                <Link
                className="nav-link px-3 py-2"
                style={navLinkStyle}
                onClick={() => {
                  window.scrollTo(0, 0);
                  closeNavbar();
                }}
                to="/about"
                onMouseEnter={(e) => handleNavHover(e, true)}
                onMouseLeave={(e) => handleNavHover(e, false)}
              >
                About Us
              </Link>
                </li>
              )}

            {visibility?.home?.services && (
            <li className="nav-item">
              <button
                className="nav-link border-0 bg-transparent px-3 py-2"
                style={navLinkStyle}  
                onMouseEnter={(e) => handleNavHover(e, true)}
                onMouseLeave={(e) => handleNavHover(e, false)}
                onClick={() => {
                  goToSection("features");
                 
                  closeNavbar();
                }}
              >
                Features
              </button>
            </li>
            )}
            {visibility?.home?.pricing && (
            <li className="nav-item">
              <button
                className="nav-link border-0 bg-transparent px-3 py-2"
                style={navLinkStyle}
                
                onClick={() => {
                goToSection("pricing");
                closeNavbar();
              }}
                onMouseEnter={(e) => handleNavHover(e, true)}
                onMouseLeave={(e) => handleNavHover(e, false)}
              >
                Pricing
              </button>
            </li>
            )}
            {visibility?.home?.gallery && (
            <li className="nav-item">
              <Link
                className="nav-link px-3 py-2"
                style={navLinkStyle}
                to="/gallery"
                onClick={() => {
                  window.scrollTo(0, 0);
                  closeNavbar();
                }}
                onMouseEnter={(e) => handleNavHover(e, true)}
                onMouseLeave={(e) => handleNavHover(e, false)}
              >
                Gallery
              </Link>
            </li>
            )}
          </ul>
          

          {/* Right Actions */}
          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0 justify-content-center">
            <button
              className="btn border-0 bg-transparent px-3 py-2"
              onClick={() => navigate("/login")}
              style={{
                color: "#0D9488",
                fontSize: "16px",
                fontWeight: "600",
                fontFamily: "Manrope, sans-serif",
              }}
            >
              Login
            </button>

            {visibility?.home?.contact && (
            <Link
              to="/contact"
              className="btn text-white d-flex align-items-center justify-content-center px-4"
              style={{
                backgroundColor: "#0D9488",
                 borderRadius: "50px",
                fontWeight: "600",
                fontSize: "16px",
                fontFamily: "Manrope, sans-serif",
                height: "48px",
                minWidth: "130px",
                border: "none",
                boxShadow: "0 4px 12px rgba(13,148,136,0.15)",
                transition: "all 0.3s ease",
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
              Contact Us
            </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;