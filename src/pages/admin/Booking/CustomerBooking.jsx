import React, { useState, useEffect } from 'react';
import { Table, Dropdown, Modal, Button, Row, Col, Badge } from "react-bootstrap";
import { BsThreeDotsVertical } from "react-icons/bs";
import { bookingData } from "../../../services/bookingData";

const CustomerBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchCustomerBookings();
  }, []);

  const fetchCustomerBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingData.getCustomerBookings();
      console.log(response);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching customer bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "Confirmed": return "success";
      case "Pending": return "warning";
      case "Accepted": return "info";
      case "Rejected": return "danger";
      case "In Progress": return "primary";
      default: return "secondary";
    }
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (!bookings.length) {
    return <div className="text-center py-4 text-muted">No bookings found</div>;
  }

  return (
    <>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Event Type</th>
              <th>Event Date</th>
              <th>Total</th>
              <th>Advance</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.bookingId}</td>
                <td>{booking.eventType}</td>
                <td>{new Date(booking.eventDate).toLocaleDateString()}</td>
                <td>₹{booking.totalAmount?.toLocaleString()}</td>
                <td>₹{booking.advanceAmount?.toLocaleString() || '0'}</td>
                <td>
                  <Badge bg={getStatusVariant(booking.status)}>
                    {booking.status}
                  </Badge>
                </td>
                <td>
                  <Dropdown>
                    <Dropdown.Toggle variant="light" size="sm">
                      <BsThreeDotsVertical />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleViewDetails(booking)}>View</Dropdown.Item>
                      <Dropdown.Item>Edit</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item className="text-danger">Cancel</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Booking #{selectedBooking?.bookingId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <>
              <Row>
                <Col md={6}>
                <p><strong>Customer:</strong> {selectedBooking.leadId?.fullName || "N/A"}</p>
<p><strong>Email:</strong> {selectedBooking.leadId?.email || "N/A"}</p>
<p><strong>Phone:</strong> {selectedBooking.leadId?.mobileNumber || "N/A"}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Event Type:</strong> {selectedBooking.eventType || 'N/A'}</p>
                  <p><strong>Event Date:</strong> {selectedBooking.eventDate ? new Date(selectedBooking.eventDate).toLocaleDateString() : 'N/A'}</p>
                  <p><strong>Venue:</strong> {selectedBooking.venue || 'N/A'}</p>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md={6}>
                  <p><strong>Total Amount:</strong> ₹{selectedBooking.totalAmount?.toLocaleString()}</p>
                  <p><strong>Advance Paid:</strong> ₹{selectedBooking.advanceAmount?.toLocaleString() || '0'}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Balance:</strong> ₹{(selectedBooking.totalAmount || 0) - (selectedBooking.advancePaid || 0)}</p>
                  <p><strong>Status:</strong> <Badge bg={getStatusVariant(selectedBooking.status)}>{selectedBooking.status}</Badge></p>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CustomerBooking;