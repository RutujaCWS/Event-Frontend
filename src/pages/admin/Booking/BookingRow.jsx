import StatusPill from "./StatusPill";
import { useState } from 'react';
import { Modal, Button, Table, Row, Col } from "react-bootstrap";
import { Form, Dropdown } from "react-bootstrap";
import { BsThreeDotsVertical } from "react-icons/bs";

const BookingRow = ({ row, isSelected, onSelect }) => {

  const [showDetailModal, setShowDetailModal] = useState(false);
const [selectedBooking, setSelectedBooking] = useState(null);

const handleViewDetails = (booking) => {
  setSelectedBooking(booking);
  setShowDetailModal(true);
};

  const getAvatarClass = (name) => {
    if (!name) return "blue";
  
    const first = name.charAt(0).toLowerCase();
  
    if ("abcd".includes(first)) return "green";
    if ("efgh".includes(first)) return "red";
    if ("ijkl".includes(first)) return "orange";
  
    return "blue";
  };
  
  const getEventClass = (type) => {
    switch (type) {
      case "Wedding":
        return "pink";
      case "Birthday":
        return "pink";
      case "Corporate":
        return "blue";
      case "Meeting":
        return "green";
      case "Religious":
        return "green";
      default:
        return "blue";
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "success-pill";
      case "Pending":
        return "orange-pill";
      case "Accepted":
        return "purple-pill";
      case "Rejected":
        return "danger-pill";
      case "In Progress":
        return "teal-pill";
      default:
        return "success-pill";
    }
  };

  return (
    <tr>
      <td className="px-4">
        <input
          type="checkbox"
          style={{ cursor: "pointer" }}
          checked={isSelected}
          onChange={onSelect}
        />
      </td>

      <td>
         <div
                  className="fw-bolder body-base"
                  style={{
                    fontWeight: 800,
                    color: "#0F172A",
                  }}
                >
          {row.bookingId}
        </div>
<div
  className="fw-bold text-muted body-base"
  style={{
    fontSize: "8px",
    lineHeight: "1.2"
  }}
>
{row.eventType}
</div>
      </td>

      <td>
        <div className="d-flex align-items-center gap-3">
          <div className={`avatar ${getAvatarClass(row.customerId?.fullName)}`}>
            {row.customerId?.name?.charAt(0)}
          </div>

          <div>
            <div className="fw-bold text-dark body-base" style={{ lineHeight: "1.2" }}>
            {row.customerId?.name }
            </div>

            <div className="text-muted caption" style={{ marginTop: "2px" }}>
            {row.customerId?.email || "-"}
            </div>
          </div>
        </div>
      </td>

      <td>
      <span className={`event-pill ${getEventClass(row.eventType)}`}>
  {row.eventType}
</span>
      </td>

      <td className="fw-bold text-dark body-base" style={{ lineHeight: "1.2" }}>₹{row.totalAmount}</td>

      <td className="fw-bold text-muted body-base" style={{ lineHeight: "1.2" }}>{new Date(row.eventDate).toLocaleDateString()}
      </td>

      <td
  className="fw-bold text-muted body-base"
  style={{
    lineHeight: "1.2",
    whiteSpace: "nowrap"
  }}
>
  {row.venue|| "-"}
</td>

      <td>
      <StatusPill
  text={row.status}
  color={getStatusColor(row.status)}
/>
      </td>

      <td className="text-start px-4">
        <Dropdown align="end">
          <Dropdown.Toggle
            as="button"
            className="btn border-0 bg-transparent p-1 shadow-none"
          >
            <BsThreeDotsVertical />
          </Dropdown.Toggle>

          <Dropdown.Menu>
          <Dropdown.Item onClick={() => handleViewDetails(row)}>View</Dropdown.Item>
            <Dropdown.Item>Edit</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item className="text-danger">
              Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </td>
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered>
  <Modal.Header closeButton style={{ borderBottom: '1px solid #E5E7EB', padding: '16px 24px' }}>
    <Modal.Title style={{ fontWeight: 600, fontSize: '18px', color: '#111827' }}>
      Booking #{selectedBooking?.bookingId}
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: '600',
        marginLeft: '12px',
        background: selectedBooking?.status === 'Confirmed' ? '#E6F7F4' :
                    selectedBooking?.status === 'Pending' ? '#FEF3C7' :
                    selectedBooking?.status === 'Accepted' ? '#DBEAFE' :
                    selectedBooking?.status === 'Rejected' ? '#FEE2E2' : '#E5E7EB',
        color: selectedBooking?.status === 'Confirmed' ? '#00A884' :
               selectedBooking?.status === 'Pending' ? '#D97706' :
               selectedBooking?.status === 'Accepted' ? '#2563EB' :
               selectedBooking?.status === 'Rejected' ? '#DC2626' : '#374151'
      }}>
        {selectedBooking?.status}
      </span>
    </Modal.Title>
  </Modal.Header>
  
  <Modal.Body style={{ padding: '24px' }}>
    {selectedBooking && (
      <>
        <Row className="mb-4">
          <Col md={6}>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500, marginBottom: '4px' }}>Customer</div>
              <div style={{ fontWeight: 600, color: '#111827' }}>{selectedBooking.customerId?.name || 'N/A'}</div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500, marginBottom: '4px' }}>Email</div>
              <div style={{ color: '#111827' }}>{selectedBooking.customerId?.email || 'N/A'}</div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500, marginBottom: '4px' }}>Phone</div>
              <div style={{ color: '#111827' }}>{selectedBooking.customerId?.phone || 'N/A'}</div>
            </div>
          </Col>
          <Col md={6}>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500, marginBottom: '4px' }}>Event Type</div>
              <div style={{ fontWeight: 600, color: '#111827' }}>{selectedBooking.eventType || 'N/A'}</div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500, marginBottom: '4px' }}>Event Date</div>
              <div style={{ color: '#111827' }}>
                {selectedBooking.eventDate ? new Date(selectedBooking.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
              </div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500, marginBottom: '4px' }}>Venue</div>
              <div style={{ color: '#111827' }}>{selectedBooking.venue || 'N/A'}</div>
            </div>
          </Col>
        </Row>

        <div className="mb-4">
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>Payment Details</div>
          <div style={{ border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden', background: '#FFFFFF' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#6B7280', fontWeight: 500 }}>Total Amount</span>
              <span style={{ fontWeight: 700, fontSize: '16px', color: '#111827' }}>
                ₹{Number(selectedBooking.totalAmount || 0).toLocaleString()}
              </span>
            </div>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#6B7280', fontWeight: 500 }}>Advance Payment</span>
              <span style={{ fontWeight: 600, color: '#0D9488' }}>
                ₹{Number(selectedBooking.advancePaid || 0).toLocaleString()}
              </span>
            </div>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#6B7280', fontWeight: 500 }}>Balance Amount</span>
              <span style={{ fontWeight: 600, color: '#DC2626' }}>
                ₹{Number((selectedBooking.totalAmount || 0) - (selectedBooking.advancePaid || 0)).toLocaleString()}
              </span>
            </div>
            <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: selectedBooking?.advancePaid > 0 ? '#F0FDF4' : '#FEF2F2' }}>
              <span style={{ color: '#6B7280', fontWeight: 500 }}>Payment Status</span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: '600',
                background: selectedBooking?.advancePaid > 0 ? '#DCFCE7' : '#FEE2E2',
                color: selectedBooking?.advancePaid > 0 ? '#16A34A' : '#DC2626'
              }}>
                {selectedBooking?.advancePaid > 0 ? '✓ Advance Paid' : '✗ Pending'}
              </span>
            </div>
            {selectedBooking?.paymentMethod && (
              <div style={{ padding: '12px 16px', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F9FAFB' }}>
                <span style={{ color: '#6B7280', fontWeight: 500 }}>Payment Method</span>
                <span style={{ fontWeight: 500, color: '#111827' }}>{selectedBooking.paymentMethod}</span>
              </div>
            )}
          </div>
        </div>

        {selectedBooking.services && selectedBooking.services.length > 0 && (
          <div className="mb-4">
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>Services</div>
            <Table bordered responsive style={{ fontSize: '13px' }}>
              <thead style={{ background: '#F9FAFB' }}>
                <tr>
                  <th style={{ fontWeight: 600, color: '#374151' }}>Service</th>
                  <th style={{ fontWeight: 600, color: '#374151' }}>Qty</th>
                  <th style={{ fontWeight: 600, color: '#374151' }}>Unit Price</th>
                  <th style={{ fontWeight: 600, color: '#374151' }} className="text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedBooking.services.map((item, index) => (
                  <tr key={index}>
                    <td>{item.serviceName || 'N/A'}</td>
                    <td>{item.quantity || 1}</td>
                    <td>₹{Number(item.unitPrice || 0).toLocaleString()}</td>
                    <td className="text-end">₹{Number((item.quantity || 0) * (item.unitPrice || 0)).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </>
    )}
  </Modal.Body>
  
  <Modal.Footer style={{ borderTop: '1px solid #E5E7EB', padding: '16px 24px' }}>
    <Button variant="secondary" onClick={() => setShowDetailModal(false)} style={{
      backgroundColor: '#F3F4F6',
      border: 'none',
      color: '#374151',
      padding: '8px 24px',
      borderRadius: '8px',
      fontWeight: 500
    }}>
      Close
    </Button>
  </Modal.Footer>
</Modal>
      
    </tr>

    
  );
};

export default BookingRow;