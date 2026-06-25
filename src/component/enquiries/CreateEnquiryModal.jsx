import { Modal } from "react-bootstrap";
import EnquiryForm from "./EnquiryForm";

const CreateEnquiryModal = ({
  show,
  handleClose,
  fetchEnquiries,
}) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Create New Enquiry</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <EnquiryForm
          handleClose={handleClose}
          fetchEnquiries={fetchEnquiries}
        />
      </Modal.Body>
    </Modal>
  );
};

export default CreateEnquiryModal;