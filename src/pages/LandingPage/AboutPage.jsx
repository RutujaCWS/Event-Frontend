import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Container, Row, Col, Card } from "react-bootstrap";
import { getCmsSection } from "../../services/cmsService";
import "./About.css";

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

  // Mock/Fallback data matching reference images exactly
  const data = {
    heroTitle: aboutData?.heroTitle || "Crafting Memories, One Event at a Time",
    heroDescription:
      aboutData?.heroDescription ||
      "Celebrate Events transforms your ideas into unforgettable celebrations with complete event planning and management. We deliver seamless, stress-free experiences for weddings, birthdays, corporate events, and more.",
    companyTitle:
      aboutData?.companyTitle || "We don't just plan events. We bring your vision to life.",
    companyDescription1:
      aboutData?.companyDescription1 ||
      "Celebrate Events is a full-service event management company dedicated to turning ideas into unforgettable celebrations. From intimate birthday gatherings to grand weddings and large scale corporate conferences, we manage every aspect of your event decor, catering, photography, entertainment, and logistics so you can focus on enjoying the moment.",
    companyDescription2:
      aboutData?.companyDescription2 ||
      "Founded with a simple belief that every celebration deserves expert care, we have grown into a trusted name for individuals, families, and businesses looking for reliable, end-to-end event planning. Our strength lies in combining creative design with disciplined execution, backed by a technology driven platform that keeps you informed and in control at every step from enquiry to invoice.",
    missionTitle: aboutData?.missionTitle || "OUR MISSION",
    missionDescription:
      aboutData?.missionDescription ||
      "To make event planning simple, transparent, and stress-free by offering end-to-end execution, honest pricing, and a dedicated team that treats every event big or small with the same level of care and commitment. We believe the journey to your perfect event should be as enjoyable as the event itself.",
    visionTitle: aboutData?.visionTitle || "OUR VISION",
    visionDescription:
      aboutData?.visionDescription ||
      "To make event planning simple, transparent, and stress-free by offering end-to-end execution, honest pricing, and a dedicated team that treats every event big or small with the same level of care and commitment. We believe the journey to your perfect event should be as enjoyable as the event itself.",
    experienceTitle:
      aboutData?.experienceTitle || "Events We Handle With Excellence",
    experienceDescription1:
      aboutData?.experienceDescription1 ||
      "Years of hands-on experience across categories. Deep expertise in planning, vendor coordination, and on-ground execution.",
  };

  return (
    <div className="about-page-wrapper">
      <Header />

      {/* 1. Hero Section */}
      <section className="stitch-hero-section">
        <Container>
          <div className="stitch-hero-container">
            {/* Left Content Column */}
            <div className="stitch-hero-content">
              <span className="about-tag">
                ABOUT CELEBRATE EVENTS
              </span>
              <h1 className="about-title">
                Crafting Memories,<br/>
                One Event at a<br/>
                Time
              </h1>
              <p className="about-desc">
                {data.heroDescription}
              </p>
            </div>
 
            {/* Right Image Composition Column */}
            <div className="stitch-hero-image-composition">
              {/* Floating overlap badge */}
              <div className="stitch-hero-stats-badge-overlap">
                <span className="stitch-hero-stats-num">500 +</span>
                <span className="stitch-hero-stats-text">Events Successfully</span>
              </div>

              {/* First Column: Tall Pill */}
              <div className="stitch-hero-img-col-1">
                <img
                  alt="Event Setup"
                  className="stitch-hero-pill-img-large"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5xEafr5h-3ANlm4cxeOk0yEvao_dBZ8uMVJL2_qEQM1jNhulMb1B_af8KUluuYm6cou59Oa8fkPLsOw03AEbNn3O5yFnH3tA6OT9Y19KBIDpjIyXzkE0NP0_2XSzdYieAO_qcCzqmv9gzIuzjTCbYLX3wtJeCmTseLWQMi_Ec--WgEIhHf2gliZ-ZMrUb67VVKb8-_M31-uxdKDZh-BYA5MHzoRwImugD4uTIAJBWrnIWx1XByDIa42ELxmkuc_gZe6qpJcnYf8Q"
                />
              </div>
              {/* Second Column: Circle and Small Pill */}
              <div className="stitch-hero-img-col-2">
                {/* Circle Image */}
                <div className="stitch-hero-circle-img-wrapper">
                  <img
                    alt="Wedding Celebration"
                    className="stitch-hero-circle-img"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBDi1z9i-2cBrBih0SOH6QzO2yDLATLTafN_c-SbnSdsNSiovLWd3Nmm4gpk5E46tiaA1NBi8c0Rn1WYjq7CdeC9NwS7ajdFMTbChmWx3DBraeIFCdrgRv85R570fFK7u7-3MIkatxg6Qul-LRA2B8Wq3hUOaO2rmEDvema8Ci9VUOIPHpOvs1HSusd0zAkW7lFmcJQqz7GjUm7e_7pURsid7-zo-o3iWrEjpaOe3pk3YqeuJiahfDcib6H7FG8MIxt-KH35HKNGQ"
                  />
                </div>
                {/* Rounded Pill Image */}
                <div className="stitch-hero-pill-img-small-wrapper">
                  <img
                    alt="Festival Fun"
                    className="stitch-hero-pill-img-small"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfRgGq4OANeKk5W79FXFC-x_R3rU5hgmJ80y8qAZcWHoyIh5sMWaonuINpZiLnshw0LXW1jH8kgWnmz4iKa3WOA4u5x1s2BgYMKIZiYleabBrL-5WQH8sNiDbtnFoPceOR2pcKd37KAzG7MiPrZVVw_JYRLpRSD7KZ_hEdJeXTOtOucRTewcsjAdi8ktqjavyrelBGIMpTrQnPVIDL1C6KpOp9tQ4w-i6igz6eELkAaXIyMMyeq2U2qo9_Iw-XauydtNiac_QUlzQ"
                  />
                </div>
              </div>
              {/* Third Column: Offset Pill */}
              <div className="stitch-hero-img-col-3">
                <img
                  alt="Traditional Sticks"
                  className="stitch-hero-pill-img-large"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBehL8F4HbmsSYYqHksZqjgdfvn1g1nTNnsAQCg51MghdwdNlH9yc4Dwk4zqvpIRQkge0L8Wx8t3gENbTVHyqHM1DdHsJK7t6cZdAju0r3dTvSyuwQcMcvJPkG4VDRBa35lJ0O2CVEj92_tF2K_84Brv8bQdJrWaS8wYoLscQaNtzUrzjqSuq_XCO9EzqSt6IYmbbrxR85mbgF9p7IGMIym35tGtyWz1vAI6C6l8L9xDFj86kh9U1guBfc68uEsurbfCZxrgEd6s8"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Teal Stats Bar */}
      <section className="stats-bar-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={3} md={6} xs={6} className="text-center stats-divider">
              <div className="stats-bar-number">500 +</div>
              <div className="stats-bar-text">Events Delivered</div>
            </Col>
            <Col lg={3} md={6} xs={6} className="text-center stats-divider">
              <div className="stats-bar-number">4.8 ☆</div>
              <div className="stats-bar-text">Avg. Rating</div>
            </Col>
            <Col lg={3} md={6} xs={6} className="text-center stats-divider">
              <div className="stats-bar-number">100 +</div>
              <div className="stats-bar-text">Verified Vendors</div>
            </Col>
            <Col lg={3} md={6} xs={6} className="text-center">
              <div className="stats-bar-number">60%</div>
              <div className="stats-bar-text">Referral Bookings</div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 3. Company Overview Section */}
      <section className="overview-section">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <div className="overview-collage-grid">
                <img
                  src="https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=600&auto=format&fit=crop"
                  alt="Holi festival girl"
                  className="overview-grid-left"
                />
                <img
                  src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&auto=format&fit=crop"
                  alt="Kids birthday balloons"
                  className="overview-grid-right-top"
                />
                <img
                  src="https://images.unsplash.com/photo-1604017011826-d3b4c23f8914?q=80&w=600&auto=format&fit=crop"
                  alt="Indian wedding rituals"
                  className="overview-grid-right-bottom"
                />
              </div>
            </Col>
            <Col md={6} className="overview-text-container mt-4 mt-md-0">
              <span className="about-tag">Company Overview</span>
              <h2 className="about-title">We don't just plan events. We bring your vision to life.</h2>
              <p className="about-desc mb-4">
                Celebrate Events is a full-service event management company dedicated to turning ideas into unforgettable celebrations. From intimate birthday gatherings to grand weddings and large scale corporate conferences, we manage every aspect of your event decor, catering, photography, entertainment, and logistics so you can focus on enjoying the moment.
              </p>
              <p className="about-desc">
                Founded with a simple belief that every celebration deserves expert care, we have grown into a trusted name for individuals, families, and businesses looking for reliable, end-to-end event planning.Our strength lies in combining creative design with disciplined execution, backed by a technology driven platform that keeps you informed and in control at every step from enquiry to invoice.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 4. Our Purpose, Mission, Vision */}
      <section className="purpose-section">
        <Container>
          <div className="about-section-divider"></div>
          <div className="purpose-intro text-center">
            <span className="about-tag">Our Purpose</span>
            <h2 className="about-title">Driven by Purpose, Guided by Values</h2>
            <p className="about-desc">
              Everything we do is rooted in a commitment to making your event
              extraordinary with honesty, care, and creativity at every step
            </p>
          </div>

          <div className="mission-vision-container">
            <Row className="mv-row">
              <Col lg={5}>
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop"
                  alt="Our Mission"
                  className="mv-image"
                />
              </Col>
              <Col lg={7} className="mv-text-col mt-4 mt-lg-0">
                <span className="about-tag">Our Mission</span>
                <p className="about-desc">
                  {data.missionDescription}
                </p>
              </Col>
            </Row>

            <Row className="mv-row flex-lg-row-reverse">
              <Col lg={5}>
                <img
                  src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop"
                  alt="Our Vision"
                  className="mv-image"
                />
              </Col>
              <Col lg={7} className="mv-text-col mt-4 mt-lg-0">
                <span className="about-tag">Our Vision</span>
                <p className="about-desc">
                  {data.visionDescription}
                </p>
              </Col>
            </Row>
          </div>
          <div className="about-section-divider-bottom"></div>
        </Container>
      </section>

      {/* 5. Experience & Expertise Section */}
      <section className="experience-section-stitch">
        <Container>
          {/* Top part: Header & Stats Grid */}
          <div className="stitch-experience-header-grid">
            {/* Text Content Area */}
            <div className="stitch-experience-text-content">
              <span className="about-tag">
                Experience &amp; Expertise
              </span>
              <h2 className="about-title">
                Events We Handle <br/> With Excellence
              </h2>
              <p className="about-desc">
                Years of hands-on experience across categories. Deep expertise in planning, vendor coordination, and on-ground execution.
              </p>
            </div>
            {/* Stats Grid Area */}
            <div className="stitch-stats-grid">
              {/* Stat Card 1 */}
              <div className="stitch-stat-card">
                <div className="stitch-stat-num">5+</div>
                <p className="stitch-stat-text">Years of operation &amp; trusted partnerships</p>
              </div>
              {/* Stat Card 2 */}
              <div className="stitch-stat-card">
                <div className="stitch-stat-num">50+</div>
                <p className="stitch-stat-text">Events executed every year across India</p>
              </div>
              {/* Stat Card 3 */}
              <div className="stitch-stat-card">
                <div className="stitch-stat-num">100+</div>
                <p className="stitch-stat-text">Verified vendor &amp; service partners</p>
              </div>
              {/* Stat Card 4 */}
              <div className="stitch-stat-card">
                <div className="stitch-stat-num stitch-stat-num-star">
                  5<span className="stitch-star">★</span>
                </div>
                <p className="stitch-stat-text">Consistent client satisfaction rating</p>
              </div>
            </div>
          </div>

          {/* Bottom part: Events Gallery Grid */}
          <div className="stitch-events-gallery">
            {/* Event Card: Weddings */}
            <div className="stitch-event-card card-span-2">
              <img
                alt="Weddings"
                className="stitch-event-card-img"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_OXHN9WkzXJR6OCU1ZkATr65Q9rIe-MVqcZ1rxR4L8Ahvgt8bsrna5JLR4oSoM9QpyAxnMNZUldBllfiTSjJSVc9_7W2DAR1Ve0vE5zgUM_4A_j6BOCEsWWdqw3zhSaMYHqEgRYnoXDuP6vfSWSyh1TPPihEwYOAy1mwog-4fi4ObBbycPTEEUfRrHRpIFXenOlQwcYaSuvtNs74hZPbaTCLr_cX6Zgs7zaTkevDT63KcECVzhvdjaMmO4O7CrhdepAHWe9D_zXw"
              />
              <div className="stitch-event-overlay">
                <span className="stitch-event-badge">Most Popular</span>
                <h3 className="stitch-event-title">Weddings</h3>
                <p className="stitch-event-desc text-max-w-lg">
                  Traditional, destination &amp; contemporary weddings complete decor, catering, photography, and coordination.
                </p>
              </div>
            </div>

            {/* Event Card: Corporate Events */}
            <div className="stitch-event-card">
              <img
                alt="Corporate Events"
                className="stitch-event-card-img"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDmPZ_575U45tJI4kTtICmoJu_q9wAtR3c4XmajB9232Gh6AoZHsconA0sGHvwE5ABRQbh35iwuDhaBYk7-x4lwxiGJUwpKH8Q3-bnJgL9H-RhSrCXEauC4A0d9xWNaASIO5VauER1NPicEpqqMBau9PNXDPkQYAP_bJTuvlV7kx53cXtxygf-gBOr5940Ng4q4qIC0gN_6xv85ez-FNve3Rhw70ZGJd3Ih4WEGR_HDXffKzgEqiyH7V3rL5eME6M9a9R2HLGc6Hqg"
              />
              <div className="stitch-event-overlay">
                <span className="stitch-event-badge">Corporate</span>
                <h3 className="stitch-event-title">Corporate Events</h3>
                <p className="stitch-event-desc">
                  Conferences, product launches &amp; annual days with precision and polish.
                </p>
              </div>
            </div>

            {/* Event Card: Birthdays & Private */}
            <div className="stitch-event-card">
              <img
                alt="Birthdays &amp; Private"
                className="stitch-event-card-img"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlh-ZxhrTSqR0eITlU7wI-9uxiWWbr4xSbX5k6eSyYI2OYsdvhHhdZ58dx_6GntP06wlVBi1H1dar3mFVt17jR34UrYZbxqE4dNBnNh1s5jQMy55kngnEMRs73aZCwqOwk3TRQYfs2ulo5RqVvgXOaulN7JgHSy0hA_SI9bbN1uNECffSp2c_Myndt5wPLcCbrtO3UmUgj-WKRTaMxQTgbbQSxSmyE6vE8Xn3rOt23t9Lv0I6pjC4lWqqRmA_9md-vIIQwH4I0wFc"
              />
              <div className="stitch-event-overlay">
                <span className="stitch-event-badge">Private</span>
                <h3 className="stitch-event-title">Birthdays &amp; Private</h3>
                <p className="stitch-event-desc">
                  Personalised themes and immersive experiences for every size.
                </p>
              </div>
            </div>

            {/* Event Card: Cultural & Religious */}
            <div className="stitch-event-card">
              <img
                alt="Cultural &amp; Religious"
                className="stitch-event-card-img"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOO7MaYBfqhKhYNmpWYpMBzT1Up6-zupKAy73FFRNKJjUTkEvQ9_Hhd2cUMZAPteAW3B_gBBvGwfiBvJYQXx0cHNFH6mMOdySwFcUzWF2Q3FiVmWv6fF_5C-ueKnWrmNUp6KEwmvzcT-CLxUd1X29FhBAJrje857ZBov_0_V8hQPC0qO2yTbh-B7PVFz4axTBi-E6NhZ_a4_V8oUwdCEykoIOj7YTtqzBpuM6ArmYcHWbNAkKoSHr2cYg12nrhoFb3i3FcCFfWka4"
              />
              <div className="stitch-event-overlay">
                <span className="stitch-event-badge">Cultural</span>
                <h3 className="stitch-event-title">Cultural &amp; Religious</h3>
                <p className="stitch-event-desc">
                  Conferences, product launches &amp; annual days with precision and polish.
                </p>
              </div>
            </div>

            {/* Event Card: Custom & Unique */}
            <div className="stitch-event-card">
              <img
                alt="Custom &amp; Unique Events"
                className="stitch-event-card-img"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8HQX-jSMBdj7ddESF-kd2dtNA14dOgcBR1Yv5uTUCrVtO3AkEqN2i4YBdke5gtwVgKkdGxM2EHia3M9prP8U976J_yKOAljKpsahe_8i5RC9adRKv4Rr9pS5h53rNdS81P00JCqtEkm7JZ8Y4r3B-uTBdQO9Yr_WDpU6BfzWwDlYqztJdpYut0IpXGm4n00u6Opz0z4l-CR72pB9XKg0b2lvDve69HuoIuHQfY2NrVUlz5DKuALpi6iFkW1HGMbqz3iiN_0RljVQ"
              />
              <div className="stitch-event-overlay">
                <span className="stitch-event-badge">Custom</span>
                <h3 className="stitch-event-title">Custom &amp; Unique Events</h3>
                <p className="stitch-event-desc">
                  No request is too unusual - we bring one-of-a-kind visions to life.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
      {/* 6. Why Choose Us Section */}
      <section className="why-choose-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={5} className="mb-4 mb-lg-0">
              <div className="why-choose-images">
                <div className="why-img-primary">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop"
                    alt="Event professional"
                  />
                </div>
                <div className="why-img-secondary">
                  <img
                    src="https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=600&auto=format&fit=crop"
                    alt="Concert event"
                  />
                </div>
              </div>
            </Col>
            <Col lg={7}>
              <div className="why-choose-content">
                <span className="about-tag">WHY CHOOSE US</span>
                <h2 className="about-title">What Sets Us Apart</h2>
                <p className="about-desc">
                  Our platform simplifies the entire event lifecycle from enquiry to execution ensuring a smooth and organized experience.
                </p>
                <div className="why-checklist">
                  <div className="why-checklist-col">
                    <div className="why-check-item">
                      <span className="why-check-icon">✓</span>
                      <span>End-to-End Management</span>
                    </div>
                    <div className="why-check-item">
                      <span className="why-check-icon">✓</span>
                      <span>Transparent Quotations</span>
                    </div>
                    <div className="why-check-item">
                      <span className="why-check-icon">✓</span>
                      <span>On-Ground Execution Excellence</span>
                    </div>
                  </div>
                  <div className="why-checklist-col">
                    <div className="why-check-item">
                      <span className="why-check-icon">✓</span>
                      <span>Trusted Vendor Network</span>
                    </div>
                    <div className="why-check-item">
                      <span className="why-check-icon">✓</span>
                      <span>Easy Online Tracking</span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 7. Meet Our Team */}
      <section className="team-section">
        <Container>
          {/* Header: title left, desc right */}
          <Row className="align-items-end mb-4">
            <Col lg={6}>
              <span className="about-tag">MEET OUR TEAM</span>
              <h2 className="about-title">The People Behind Every Memorable Event</h2>
            </Col>
            <Col lg={6}>
              <p className="about-desc mb-0">
                Behind every successful event is a team of passionate planners, designers, and coordinators who bring creativity and discipline together to make magic happen.
              </p>
            </Col>
          </Row>

          {/* Bento Grid */}
          <div className="team-bento-grid">
            {/* Left tall card */}
            <div className="team-card team-card-tall">
              <img
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop"
                alt="On-Ground Execution Team"
                className="team-card-bg"
              />
              <div className="team-card-overlay"></div>
              <div className="team-card-content">
                <h3 className="team-card-title">On-Ground Execution Team</h3>
                <p className="team-card-desc">Manages setup, coordination, and real-time problem-solving on the event day</p>
              </div>
            </div>

            {/* Top-middle card */}
            <div className="team-card">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop"
                alt="Event Planning Team"
                className="team-card-bg"
              />
              <div className="team-card-overlay"></div>
              <div className="team-card-content">
                <h3 className="team-card-title">Event Planning Team</h3>
                <p className="team-card-desc">Translates your vision into a detailed execution plan</p>
              </div>
            </div>

            {/* Top-right card */}
            <div className="team-card">
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600&auto=format&fit=crop"
                alt="Customer Success Team"
                className="team-card-bg"
              />
              <div className="team-card-overlay"></div>
              <div className="team-card-content">
                <h3 className="team-card-title">Customer Success Team</h3>
                <p className="team-card-desc">Your single point of contact from enquiry to post-event follow-up</p>
              </div>
            </div>

            {/* Bottom-middle card */}
            <div className="team-card">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop"
                alt="Vendor Relations Team"
                className="team-card-bg"
              />
              <div className="team-card-overlay"></div>
              <div className="team-card-content">
                <h3 className="team-card-title">Vendor Relations Team</h3>
                <p className="team-card-desc">Coordinates with caterers, photographers, decorators, and entertainers</p>
              </div>
            </div>

            {/* Bottom-right card */}
            <div className="team-card">
              <img
                src="https://images.unsplash.com/photo-1513623935135-c896b59073c1?q=80&w=600&auto=format&fit=crop"
                alt="Design & Decor Team"
                className="team-card-bg"
              />
              <div className="team-card-overlay"></div>
              <div className="team-card-content">
                <h3 className="team-card-title">Design & Decor Team</h3>
                <p className="team-card-desc">Curates themes, colour palettes, and visual styling</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 8. Service Locations */}
      <section className="locations-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={5} className="mb-5 mb-lg-0 pe-lg-5">
              <span className="section-tag-light">SERVICE LOCATIONS</span>
              <h2 className="locations-title">Serving Across Regions</h2>
              <p className="locations-desc">
                We offer full event planning and execution services across major Indian cities, with the flexibility to travel for destination events on request.
              </p>
            </Col>
            <Col lg={7} className="ps-lg-5">
              <div className="locations-grid">
                <div className="location-pill">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="location-pin-svg">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Bengaluru</span>
                </div>
                <div className="location-pill">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="location-pin-svg">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Pune</span>
                </div>
                <div className="location-pill">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="location-pin-svg">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Mumbai</span>
                </div>
                <div className="location-pill">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="location-pin-svg">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Hyderabad</span>
                </div>
                <div className="location-pill">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="location-pin-svg">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Other Major Cities</span>
                </div>
                <div className="location-pill">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="location-pin-svg">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>Destination Events</span>
                </div>
              </div>
              <p className="locations-note">
                Don't see your city? Reach out: we love a good challenge and frequently travel for the right event. We'll make sure to reach you!
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 9. Our Achievements */}
      <section className="achievements-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={5} className="mb-4 mb-lg-0">
              <span className="section-tag">OUR ACHIEVEMENTS</span>
              <h2 className="section-title">Our Event Journey in Numbers</h2>
              <p className="section-desc">
                Years of dedication and client trust reflected in every milestone we've achieved built one event at a time
              </p>
            </Col>
            <Col lg={7}>
              <div className="achievements-grid">
                <div className="achievement-card">
                  <div className="achievement-num">500+</div>
                  <div className="achievement-label">Events Delivered</div>
                  <div className="achievement-sub">Across weddings, More.</div>
                </div>
                <div className="achievement-card">
                  <div className="achievement-num">60%</div>
                  <div className="achievement-label">Repeat & Referrals</div>
                  <div className="achievement-sub">Of all bookings</div>
                </div>
                <div className="achievement-card">
                  <div className="achievement-num">100+</div>
                  <div className="achievement-label">Vendor Partners</div>
                  <div className="achievement-sub">Verified service providers</div>
                </div>
                <div className="achievement-card">
                  <div className="achievement-num">4.8★</div>
                  <div className="achievement-label">Client Rating</div>
                  <div className="achievement-sub">Average satisfaction score</div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 10. CTA Banner */}
      <section className="cta-banner-section">
        <Container>
          <div className="cta-banner">
            <img
              src="https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200&auto=format&fit=crop"
              alt="Holi Celebration"
              className="cta-banner-bg"
            />
            <div className="cta-banner-overlay"></div>
            <div className="cta-banner-content">
              <h2 className="cta-banner-title">Let's Get Started</h2>
              <h3 className="cta-banner-subtitle">Ready to Plan Something Memorable?</h3>
              <p className="cta-banner-desc">
                Let's talk about your event. Share your vision with us and we'll craft an experience your guests will never forget.
              </p>
              <div className="cta-banner-buttons">
                <a href="/contact" className="cta-btn-outline">Request a Quote</a>
                <a href="/contact" className="cta-btn-filled">Talk to Our Team</a>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;