import { useState, useEffect } from "react";
import { getGalleryEvents } from "../../services/galleryService";
import { getCmsSection } from "../../services/cmsService";
import Header from "./Header";
import Footer from "./Footer";

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
} from "react-bootstrap";



const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
const [heroData, setHeroData] = useState({
  heroTitle: "",
  heroDescription: "",
});
  const categories = [
    "All",
    ...new Set(galleryImages.map((item) => item.category)),
  ];
  useEffect(() => {
  fetchGalleryData();
  fetchHeroData();
}, []);

const fetchGalleryData = async () => {
  try {
    const res = await getGalleryEvents();

    setGalleryImages(res.data.data || []);
  } catch (error) {
    console.log(error);
  }
};

const fetchHeroData = async () => {
  try {
    const res = await getCmsSection("gallery");

    if (res.data.data?.content) {
      setHeroData(res.data.data.content);
    }
  } catch (error) {
    console.log(error);
  }
};

  const filteredImages =
    selectedCategory === "All"
      ? galleryImages
      : galleryImages.filter(
          (item) => item.category === selectedCategory
        );

  const handleImageClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(90deg,#9333ea,#7c3aed)",
          padding: "80px 0",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <Container>
          <h1 className="fw-bold display-4">
          {heroData.heroTitle}
        </h1>

        <p className="mt-3 fs-5">
          {heroData.heroDescription}
        </p>
        </Container>
      </section>

      {/* Gallery Section */}
      <section className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">Our Recent Events</h2>
            <p className="text-muted">
              Weddings, Corporate Events, Birthdays and More
            </p>
          </div>

          {/* Category Filters */}
          <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  borderRadius: "30px",
                  padding: "10px 25px",
                  border: "none",
                  background:
                    selectedCategory === category
                      ? "#7c3aed"
                      : "#ede9fe",
                  color:
                    selectedCategory === category
                      ? "#fff"
                      : "#7c3aed",
                  fontWeight: "600",
                }}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Image Grid */}
          <Row className="g-4">
            {filteredImages.map((item) => (
              <Col lg={4} md={6} key={item.id}>
                <Card
                  className="border-0 shadow-sm overflow-hidden h-100"
                  style={{
                    borderRadius: "20px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleImageClick(item)}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div
                    style={{
                      overflow: "hidden",
                      height: "280px",
                    }}
                  >
                    <Card.Img
                      variant="top"
                      src={item.image}
                      style={{
                        height: "280px",
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                        transform:
                          hoveredId === item.id
                            ? "scale(1.08)"
                            : "scale(1)",
                      }}
                    />
                  </div>

                  <Card.Body>
                    <div className="mb-2">
                      <span
                        className="badge"
                        style={{
                          background: "#ede9fe",
                          color: "#7c3aed",
                          padding: "8px 15px",
                        }}
                      >
                        {item.category}
                      </span>
                    </div>

                    <h5 className="fw-bold mb-2">
                      {item.eventName}
                    </h5>

                    <p className="text-muted mb-0">
                      📍 {item.location}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Lightbox Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
      >
        {selectedEvent && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>
                {selectedEvent.eventName}
              </Modal.Title>
            </Modal.Header>

            <Modal.Body className="p-4">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.eventName}
                className="img-fluid rounded-3 mb-4"
                style={{
                  width: "100%",
                  height: "400px",
                  objectFit: "cover",
                }}
              />

              <div className="mb-3">
                <span
                  className="badge"
                  style={{
                    background: "#ede9fe",
                    color: "#7c3aed",
                    padding: "8px 16px",
                    fontSize: "14px",
                  }}
                >
                  {selectedEvent.category}
                </span>
              </div>

              <h3 className="fw-bold mb-2">
                {selectedEvent.eventName}
              </h3>

              <p className="text-muted mb-3">
                📍 {selectedEvent.location}
              </p>

              <p
                className="text-secondary mb-4"
                style={{ lineHeight: "1.8" }}
              >
                {selectedEvent.description}
              </p>

              <hr />

              <div className="text-center mb-3">
                <h6 className="fw-bold">
                  Interested in a Similar Event?
                </h6>
                <p className="text-muted small mb-0">
                  Contact us and our team will help you plan a similar event.
                </p>
              </div>

              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Button
                  style={{
                    background: "#7c3aed",
                    border: "none",
                    minWidth: "180px",
                    padding: "10px 20px",
                    fontWeight: "600",
                  }}
                  onClick={() =>
                    navigate("/inquiry", {
                      state: {
                        eventName: selectedEvent.eventName,
                        category: selectedEvent.category,
                      },
                    })
                  }
                >
                  Send Inquiry
                </Button>

                <Button
                  variant="outline-primary"
                  style={{
                    minWidth: "180px",
                    padding: "10px 20px",
                    fontWeight: "600",
                  }}
                  onClick={() =>
                    navigate("/inquiry", {
                      state: {
                        eventName: selectedEvent.eventName,
                        category: selectedEvent.category,
                      },
                    })
                  }
                >
                  Similar Event
                </Button>
              </div>
            </Modal.Body>
          </>
        )}
      </Modal>

      <Footer />
    </>
  );
};

export default GalleryPage;
