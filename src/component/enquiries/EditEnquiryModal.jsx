import { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { updateEnquiry } from "../../services/enquiryService";

const EditEnquiryModal = ({
  show,
  handleClose,
  enquiry,
  fetchEnquiries,
}) => {
  const [formData, setFormData] = useState({
    eventType: "",
    eventDate: "",
    guestCount: "",
    location: "",
    budget: "",
    description: "",
    serviceRequired: [],
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (enquiry) {
      setFormData({
        eventType: enquiry.eventType || "",
        eventDate: enquiry.eventDate
          ? enquiry.eventDate.split("T")[0]
          : "",
        guestCount: enquiry.guestCount || "",
        location: enquiry.location || "",
        budget: enquiry.budget || "",
        description: enquiry.description || "",
        serviceRequired: enquiry.serviceRequired || [],
      });
    }
  }, [enquiry]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleServiceToggle = (service) => {
    setFormData((prev) => {
      const updated = prev.serviceRequired.includes(service)
        ? prev.serviceRequired.filter((s) => s !== service)
        : [...prev.serviceRequired, service];
      return { ...prev, serviceRequired: updated };
    });
  };


  const handleSubmit = async () => {

    if (!formData.guestCount || Number(formData.guestCount) <= 0) {
      setError("Guest count must be at least 1");
      return;
    }
    if (formData.budget && Number(formData.budget) < 0) {
      setError("Budget cannot be negative");
      return;
    }
    try {
      setError("");

      const response = await updateEnquiry(
        enquiry._id,
        formData
      );

      setSuccess(response.data.message);

      await fetchEnquiries();

      setTimeout(() => {
        setSuccess("");
        handleClose();
      }, 1000);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to update enquiry"
      );
    }
  };

  if (!enquiry) return null;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Enquiry</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {success && (
          <Alert variant="success">
            {success}
          </Alert>
        )}

        {error && (
          <Alert variant="danger">
            {error}
          </Alert>
        )}

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Event Type</Form.Label>
              <Form.Control
                type="text"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Event Date</Form.Label>
              <Form.Control
                type="date"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Guest Count</Form.Label>
              <Form.Control
                type="number"
                name="guestCount"
                min="1"
                value={formData.guestCount}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Budget</Form.Label>
              <Form.Control
                type="number"
                name="budget"
                min="0"
                value={formData.budget}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="fw-bold text-secondary mb-2" style={{ fontSize: "15px" }}>
            Required Services
          </Form.Label>
          <div className="d-flex flex-wrap gap-2 py-1">
            {[
              { name: "Decoration", icon: "✨" },
              { name: "Photography", icon: "📷" },
              { name: "Catering", icon: "🍽️" },
              { name: "Entertainment", icon: "🎉" },
              { name: "Venue", icon: "📍" }
            ].map((service) => {
              const isSelected = formData.serviceRequired.includes(service.name);
              return (
                <div
                  key={service.name}
                  onClick={() => handleServiceToggle(service.name)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontWeight: "500",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    userSelect: "none",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    border: isSelected ? "2px solid #7c3aed" : "2px solid #e5e7eb",
                    background: isSelected
                      ? "linear-gradient(135deg, #9333ea, #7c3aed)"
                      : "#ffffff",
                    color: isSelected ? "#ffffff" : "#4b5563",
                    boxShadow: isSelected
                      ? "0 4px 12px rgba(124, 58, 237, 0.25)"
                      : "0 2px 4px rgba(0, 0, 0, 0.02)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = "#c084fc";
                      e.currentTarget.style.background = "#faf5ff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = "#e5e7eb";
                      e.currentTarget.style.background = "#ffffff";
                    }
                  }}
                >
                  <span>{service.icon}</span>
                  <span>{service.name}</span>
                </div>
              );
            })}
          </div>
        </Form.Group>


        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
        >
          Cancel
        </Button>

        <Button
          variant="primary"
          onClick={handleSubmit}
        >
          Update Enquiry
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditEnquiryModal;