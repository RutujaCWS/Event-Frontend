import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Container, Row, Col, Card } from "react-bootstrap";
import { getCmsSection } from "../../services/cmsService";

const AboutPage = () => {
  const [aboutData, setAboutData] = useState(null);

useEffect(() => {
  fetchAboutData();
}, []);

const fetchAboutData = async () => {
  try {
    const res = await getCmsSection("about");

    if (res.data?.data?.content) {
      setAboutData(res.data.data.content);
    }
  } catch (error) {
    console.log(error);
  }
};
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
            {aboutData?.heroTitle}
          </h1>

          <p className="lead mt-3">
            {aboutData?.heroDescription}
          </p>
        </Container>
      </section>

      {/* Company Overview */}
      <section className="py-5 bg-white">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <img
                src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800"
                alt="About Us"
                className="img-fluid rounded-4 shadow"
              />
            </Col>

            <Col lg={6}>
              <h2 className="fw-bold mb-4">
                {aboutData?.companyTitle}
              </h2>

              <p className="text-muted">
                {aboutData?.companyDescription1}
              </p>

              <p className="text-muted">
                {aboutData?.companyDescription2}
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="g-4">
            <Col md={6}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="p-4">
                  
                  <h3 className="fw-bold text-primary mb-3">
                    🎯{aboutData?.missionTitle}
                  </h3>

                  <p className="text-muted">
                    {aboutData?.missionDescription}
                  </p>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="p-4">
                  
                  <h3 className="fw-bold text-primary mb-3">
  🚀 {aboutData?.visionTitle}
</h3>

<p className="text-muted">
  {aboutData?.visionDescription}
</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="py-5 bg-white">
      <Container>
        <Row className="align-items-center">
          <Col lg={6}>
            <h2 className="fw-bold mb-4">
  {aboutData?.experienceTitle}
</h2>

<p className="text-muted">
  {aboutData?.experienceDescription1}
</p>

<p className="text-muted">
  {aboutData?.experienceDescription2}
</p>
          </Col>

          <Col lg={6}>
            <img
              src="https://images.unsplash.com/photo-1515169067868-5387ec356754?w=800"
              alt="Experience"
              className="img-fluid rounded-4 shadow"
            />
          </Col>
        </Row>
      </Container>
    </section>

      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center fw-bold mb-5">
            Meet Our Team
          </h2>

          <Row className="g-4 justify-content-center">
            {aboutData?.teamMembers?.map((member, index) => (
              <Col
                  xl={4}
                  lg={4}
                  md={6}
                  sm={12}
                  key={index}
                >
                <Card
                  className="border-0 text-center h-100"
                  style={{
                    borderRadius: "25px",
                    overflow: "hidden",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                  }}
                >
                  <Card.Body className="p-4 d-flex flex-column justify-content-center">
                    <div
                      style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "50%",
                        background: "#f3e8ff",
                        margin: "auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "55px",
                      }}
                    >
                      👤
                    </div>

                    <h5 className="fw-bold mt-4">
                      {member.name}
                    </h5>

                    <p className="text-muted">
                      {member.role}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      <section className="py-5 bg-white">
        <Container>
          <h2 className="text-center fw-bold mb-5">
            Service Locations
          </h2>

          <Row className="g-4 justify-content-center">
            {aboutData?.locations?.map((location, index) => (
              <Col
                  xl={3}
                  lg={4}
                  md={6}
                  sm={12}
                  key={index}
                >
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="p-4 text-center">
                    <div style={{ fontSize: "50px" }}>
                      📍
                    </div>

                    <h5 className="fw-bold mt-3">
                      {location.city}
                    </h5>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>  
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center fw-bold mb-5">
            Achievements & Certifications
          </h2>

          <Row className="g-4">
            {[
              {
                icon: "🏆",
                title: "500+ Events Successfully Managed",
              },
              {
                icon: "⭐",
                title: "1000+ Happy Clients",
              },
              {
                icon: "📜",
                title: "Certified Event Professionals",
              },
            ].map((item, index) => (
              <Col md={4} key={index}>
                <Card className="border-0 shadow-sm text-center h-100">
                  <Card.Body className="p-4">
                    <div style={{ fontSize: "60px" }}>
                      {item.icon}
                    </div>

                    <h5 className="fw-bold mt-3">
                      {item.title}
                    </h5>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Why Choose Us */}
      <section className="py-5 bg-white">
        <Container>
          <h2 className="text-center fw-bold mb-5">
            Why Choose Us
          </h2>

          <Row className="g-4">
            {[
              {
                icon: "🏆",
                title: "Experienced Team",
                desc: "Professional event planners with years of expertise.",
              },
              {
                icon: "💡",
                title: "Creative Solutions",
                desc: "Unique ideas tailored to your event requirements.",
              },
              {
                icon: "🤝",
                title: "Customer Focused",
                desc: "Dedicated support throughout the event journey.",
              },
              {
                icon: "📍",
                title: "Local Expertise",
                desc: "Strong vendor network and local event experience.",
              },
            ].map((item, index) => (
              <Col lg={3} md={6} key={index}>
                <Card className="border-0 shadow-sm text-center h-100">
                  <Card.Body className="p-4">
                    <div style={{ fontSize: "50px" }}>
                      {item.icon}
                    </div>
                    <h5 className="fw-bold mt-3">
                      {item.title}
                    </h5>
                    <p className="text-muted">
                      {item.desc}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Statistics */}
      <section
        className="py-5"
        style={{
          background: "#7c3aed",
          color: "#fff",
        }}
      >
        <Container>
          <Row className="text-center">
            <Col md={3}>
              <h2 className="fw-bold">500+</h2>
              <p>Events Completed</p>
            </Col>

            <Col md={3}>
              <h2 className="fw-bold">1000+</h2>
              <p>Happy Clients</p>
            </Col>

            <Col md={3}>
              <h2 className="fw-bold">50+</h2>
              <p>Event Partners</p>
            </Col>

            <Col md={3}>
              <h2 className="fw-bold">10+</h2>
              <p>Years Experience</p>
            </Col>
          </Row>
        </Container>
      </section>


      <Footer />
    </>
  );
};

export default AboutPage;