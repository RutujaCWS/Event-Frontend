import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { getCmsSection } from "../../services/cmsService";
import EnquiryForm from "../../component/enquiries/EnquiryForm";
const ContactPage = () => {
  const [contactData, setContactData] = useState({
  heroTitle: "",
  heroDescription: "",
  companyName: "",
  address: "",
  phone: "",
  email: "",
  businessHours: "",
  whatsappNumber: "",
});


useEffect(() => {
  const fetchCmsData = async () => {
    try {
      const res = await getCmsSection("contact");
      setContactData(res.data.data.content);
    } catch (error) {
      console.log(error);
    }
  };

  fetchCmsData();
}, []);

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section
        className="py-5"
        style={{
          background: "linear-gradient(135deg,#9333ea,#7c3aed)",
          color: "#fff",
        }}
      >
        <Container className="text-center py-5">
          <h1 className="fw-bold display-4">
            {contactData.heroTitle}
          </h1>

          <p className="lead mt-3">
            {contactData.heroDescription}
          </p>
        </Container>
      </section>

      {/* Contact Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="g-4">

            {/* Contact Form */}
            <Col lg={7}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h3 className="fw-bold mb-4">Send Us an Enquiry</h3>

                  <EnquiryForm
                      isPublicForm={true}
                  />
                </Card.Body>
              </Card>
            </Col>

            {/* Contact Information */}
            <Col lg={5}>
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-4">
                  <h3 className="fw-bold mb-4">
                    Contact Information
                  </h3>

                  <div className="mb-4">
                    <h6 className="fw-bold">🏢 Company</h6>
                    <p className="text-muted mb-0">
                      {contactData.companyName}
                    </p>

                    <h6 className="fw-bold mt-3">📍 Address</h6>
                    <p className="text-muted mb-0">
                      {contactData.address}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h6 className="fw-bold">📞 Phone</h6>
                    <p className="text-muted mb-0">
                      {contactData.phone}
                    </p>
                    </div>

                  <div className="mb-4">
                    <h6 className="fw-bold">✉️ Email</h6>
                    <p className="text-muted mb-0">
                        {contactData.email}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h6 className="fw-bold">🕒 Business Hours</h6>
                    <p className="text-muted mb-0">
                      {contactData.businessHours}
                    </p>
                  </div>

                  <div>
                    <h6 className="fw-bold">🌐 Follow Us</h6>

                    <div className="d-flex gap-3 fs-4 mt-2">
                      <i className="bi bi-facebook"></i>
                      <i className="bi bi-instagram"></i>
                      <i className="bi bi-linkedin"></i>
                      <i className="bi bi-youtube"></i>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4 text-center">
                  <h5 className="fw-bold mb-4">
                    Need Immediate Assistance?
                  </h5>

                  <a
                    href={`https://wa.me/${contactData.whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn w-100 mb-3 text-white"
                    style={{
                      background: "#25D366",
                      border: "none",
                    }}
                  >
                    WhatsApp Us
                  </a>

                  <a
                    href={`tel:${contactData.phone}`}
                    className="btn w-100 text-white"
                    style={{
                      background:
                        "linear-gradient(90deg,#9333ea,#7c3aed)",
                      border: "none",
                    }}
                  >
                    Call Now
                  </a>
                </Card.Body>
              </Card>
            </Col>

          </Row>
        </Container>
      </section>

      {/* Google Map */}

      <Footer />
    </>
  );
};

export default ContactPage;