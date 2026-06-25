import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

const Footer = () => {
  return (
    <footer
      style={{
        background: "#031235",
        color: "#fff",
        fontFamily: "Manrope, sans-serif",
      }}
    >
      <div className="container py-5">
        <div className="row gy-5">
          {/* Logo Section */}
          <div className="col-lg-4 col-md-6">
            <h2
              style={{
                color: "#14B8A6",
                fontWeight: 700,
                fontSize: "36px",
                marginBottom: "20px",
              }}
            >
              Vevora
            </h2>

            <p
              style={{
                color: "#94A3B8",
                maxWidth: "320px",
                lineHeight: "1.8",
                fontSize: "14px",
              }}
            >
              A complete digital platform for planning and managing unforgettable
              events.
            </p>

            <h5
              style={{
                color: "#14B8A6",
                marginTop: "50px",
                marginBottom: "20px",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              Follow Us
            </h5>

            <div className="d-flex gap-3">
              <a
                href="/"
                style={{ color: "#94A3B8", fontSize: "12px" }}
              >
                <i className="bi bi-linkedin"></i>
              </a>

              <a
                href="/"
                style={{ color: "#94A3B8", fontSize: "12px" }}
              >
                <i className="bi bi-twitter-x"></i>
              </a>

              <a
                href="/"
                style={{ color: "#94A3B8", fontSize: "12px" }}
              >
                <i className="bi bi-facebook"></i>
              </a>

              <a
                href="/"
                style={{ color: "#94A3B8", fontSize: "12px" }}
              >
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h5
              style={{
                color: "#14B8A6",
                fontWeight: 600,
                marginBottom: "30px",
                fontSize:"14px",
              }}
            >
              Quick Links
            </h5>

            <ul className="list-unstyled">
              {["Home", "About Us", "Features", "Pricing", "Gallery"].map(
                (item) => (
                  <li key={item} className="mb-3">
                    <a
                      href="/"
                      style={{
                        color: "#94A3B8",
                        textDecoration: "none",
                        transition: "0.3s",
                        fontSize:"12px",
                      }}
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Support */}
          <div className="col-lg-2 col-md-6">
            <h5
              style={{
                color: "#14B8A6",
                fontWeight: 600,
                marginBottom: "30px",
                fontSize:"14px",
              }}
            >
              Support
            </h5>

            <ul className="list-unstyled">
              {[
                "Contact Us",
                "How It Works",
                "FAQ",
                "Help Center",
              ].map((item) => (
                <li key={item} className="mb-3">
                  <a
                    href="/"
                    style={{
                      color: "#94A3B8",
                      textDecoration: "none",
                      fontSize:"12px",
                    }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="col-lg-2 col-md-6">
            <h5
              style={{
                color: "#14B8A6",
                fontWeight: 600,
                marginBottom: "30px",
                fontSize:"14px",
              }}
            >
              Legal
            </h5>

            <ul className="list-unstyled">
              {[
                "Privacy Policy",
                "Refund Policy",
                "Terms And Conditions",
              ].map((item) => (
                <li key={item} className="mb-3">
                  <a
                    href="/"
                    style={{
                      color: "#94A3B8",
                      textDecoration: "none",
                      fontSize:"12px",
                    }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="col-lg-2 col-md-6">
            <h5
              style={{
                color: "#14B8A6",
                fontWeight: 600,
                marginBottom: "30px",
                fontSize:"14px",
              }}
            >
              Contact US
            </h5>

            <div className="d-flex mb-4">
              <i
                className="bi bi-geo-alt"
                style={{
                  color: "#14B8A6",
                  marginRight: "12px",
                  fontSize: "16px",
                }}
              />

              <span
                style={{
                  color: "#94A3B8",
                  lineHeight: "1.7",
                  fontSize:"12px",
                }}
              >
                Office No Pride Square,
                <br />
                Wakad,
                <br />
                Pune - 411057.
              </span>
            </div>

            <div className="d-flex">
              <i
                className="bi bi-envelope"
                style={{
                  color: "#14B8A6",
                  marginRight: "12px",
                  fontSize: "16px",
                }}
              />

              <span style={{ color: "#94A3B8" }}>
                vevora@gmail.com
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: "1px",
          background: "#0D9488",
          opacity: 0.5,
        }}
      />

      {/* Bottom Footer */}
      <div className="container py-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p
            className="mb-2 mb-md-0"
            style={{
              color: "#94A3B8",
              fontSize: "14px",
            }}
          >
            © 2026 Vevora — Event Management Platform. All rights reserved.
          </p>

          <p
            className="mb-0"
            style={{
              color: "#64748B",
              fontSize: "14px",
            }}
          >
            Plan Smart. Celebrate Better.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;