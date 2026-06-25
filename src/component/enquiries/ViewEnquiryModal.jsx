import { Modal, Button, Badge } from "react-bootstrap";

const ViewEnquiryModal = ({
  show,
  handleClose,
  enquiry,
}) => {
  if (!enquiry) return null;

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Enquiry Details
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="row g-3">

          <div className="col-md-6">
            <strong>Event Type</strong>
            <p>{enquiry.eventType}</p>
          </div>

          <div className="col-md-6">
            <strong>Status</strong>
            <br />

            <Badge bg="warning">
              {enquiry.status}
            </Badge>
          </div>

          <div className="col-md-6">
            <strong>Event Date</strong>
            <p>
              {new Date(
                enquiry.eventDate
              ).toLocaleDateString()}
            </p>
          </div>

          <div className="col-md-6">
            <strong>Guest Count</strong>
            <p>{enquiry.guestCount}</p>
          </div>

          <div className="col-md-6">
            <strong>Location</strong>
            <p>{enquiry.location}</p>
          </div>

          <div className="col-md-6">
            <strong>Budget</strong>
            <p>
              ₹
              {Number(
                enquiry.budget || 0
              ).toLocaleString()}
            </p>
          </div>

          <div className="col-12">
            <strong>Required Services</strong>
            <p>{enquiry.serviceRequired?.join(", ") || "None selected"}</p>
          </div>
          <div className="col-12">
            <strong>Description</strong>
            <p>
              {enquiry.description ||
                "No description"}
            </p>
          </div>

          <div className="col-md-6">
            <strong>Created At</strong>
            <p>
              {new Date(
                enquiry.createdAt
              ).toLocaleString()}
            </p>
          </div>

          <div className="col-md-6">
            <strong>Updated At</strong>
            <p>
              {new Date(
                enquiry.updatedAt
              ).toLocaleString()}
            </p>
          </div>

        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewEnquiryModal;