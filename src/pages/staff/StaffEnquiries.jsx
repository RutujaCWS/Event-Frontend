import React, { useEffect, useState } from "react";
import {
  Container, Row, Col, Card, Table, Badge, Spinner,
  Pagination, Form, Button, Modal, Alert
} from "react-bootstrap";
import API from "../../services/api";

const StaffEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [updateStatus, setUpdateStatus] = useState("");
  const [updateNote, setUpdateNote] = useState("");
  const [message, setMessage] = useState("");

  const fetchEnquiries = async () => {
  setLoading(true);
  try {
    // ✅ correct endpoint
    const res = await API.get(`/staff/enquiries/assigned?page=${page}&limit=10&status=${statusFilter}`);
    setEnquiries(res.data.data);
    setTotalPages(res.data.pagination.pages);
  } catch (error) {
    console.error(error);
    setMessage("Failed to load assigned enquiries");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchEnquiries();
  }, [page, statusFilter]);

  const handleStatusUpdate = async () => {
    if (!selectedEnquiry) return;
    try {
      await API.put(`/staff/enquiries/${selectedEnquiry._id}/status`, {
        status: updateStatus,
        note: updateNote,
      });
      setShowModal(false);
      setUpdateStatus("");
      setUpdateNote("");
      fetchEnquiries();
      setMessage("Status updated successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Update failed");
    }
  };

  const openUpdateModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setUpdateStatus(enquiry.status);
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const variants = {
      New: "danger",
      Contacted: "warning",
      "Quotation Sent": "info",
      Converted: "success",
      Closed: "secondary",
      Pending: "danger",
      Reviewed: "warning",
      Quoted: "info",
      Confirmed: "success",
      Cancelled: "dark",
    };
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container fluid className="p-4">
      <h2 className="fw-bold mb-4" style={{ color: "#2c3e50" }}>Assigned Enquiries</h2>

      {message && <Alert variant="info" dismissible onClose={() => setMessage("")}>{message}</Alert>}

      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center flex-wrap">
          <h5 className="mb-0">My Assigned Enquiries</h5>
          <Form.Select
            style={{ width: "200px" }}
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="all">All Status</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Quotation Sent">Quotation Sent</option>
            <option value="Converted">Converted</option>
            <option value="Closed">Closed</option>
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Quoted">Quoted</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </Form.Select>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Event Type</th>
                <th>Event Date</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.length === 0 ? (
                <tr><td colSpan="6" className="text-center">No enquiries assigned</td></tr>
              ) : (
                enquiries.map((enq) => (
                  <tr key={enq._id}>
                    <td>{enq.customerId?.name || "N/A"}</td>
                    <td>{enq.eventType}</td>
                    <td>{new Date(enq.eventDate).toLocaleDateString()}</td>
                    <td>{enq.location}</td>
                    <td>{getStatusBadge(enq.status)}</td>
                    <td>
                      <Button size="sm" variant="outline-primary" onClick={() => openUpdateModal(enq)}>
                        Update Status
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
        {totalPages > 1 && (
          <Card.Footer className="bg-white">
            <Pagination className="justify-content-center mb-0">
              <Pagination.Prev disabled={page === 1} onClick={() => setPage(p => p - 1)} />
              {[...Array(totalPages).keys()].map(p => (
                <Pagination.Item key={p+1} active={p+1 === page} onClick={() => setPage(p+1)}>
                  {p+1}
                </Pagination.Item>
              ))}
              <Pagination.Next disabled={page === totalPages} onClick={() => setPage(p => p + 1)} />
            </Pagination>
          </Card.Footer>
        )}
      </Card>

      {/* Update Status Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton><Modal.Title>Update Enquiry Status</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select value={updateStatus} onChange={(e) => setUpdateStatus(e.target.value)}>
              <option>New</option><option>Contacted</option><option>Quotation Sent</option>
              <option>Converted</option><option>Closed</option>
              <option>Pending</option><option>Reviewed</option><option>Quoted</option>
              <option>Confirmed</option><option>Cancelled</option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Follow‑up Note (optional)</Form.Label>
            <Form.Control as="textarea" rows={2} value={updateNote} onChange={(e) => setUpdateNote(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleStatusUpdate}>Save</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default StaffEnquiries;