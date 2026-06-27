import React, { useEffect, useState } from 'react'
import { Modal, Button, Form, Table, Row, Col,Card,Badge } from "react-bootstrap";
import {
  getAllQuotations,
  deleteQuotation,
  updateQuotation,
  sendQuotation
} from "../../../services/quotationService";
import {
  FaFileAlt,
  FaClock,
  FaCheck,
  FaTimes,
  FaRupeeSign,
  FaArrowUp,
   FaArrowDown,
  FaExclamationCircle,
  FaEllipsisV,
   FaFilter, FaDownload,
    FaExclamationTriangle
} from "react-icons/fa";

const Showquotation = () => {

const [quotations, setQuotations] = useState([]);
const [loading, setLoading] = useState(false);
const [showModal, setShowModal] = useState(false);
const [selectedQuotation, setSelectedQuotation] = useState(null); 
const [selectedStatus, setSelectedStatus] = useState("ALL");
const [filteredQuotations, setFilteredQuotations] = useState([]);
const [showFilter, setShowFilter] = useState(false);  
const [showViewModal, setShowViewModal] = useState(false);
const [viewQuotation, setViewQuotation] = useState(null);

  const fetchQuotations = async () => {
  try {
    setLoading(true);

    const res = await getAllQuotations();

    setQuotations(res.data.data);
    setFilteredQuotations(res.data.data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

const handleView = (quotation) => {
  setViewQuotation(quotation);
  setShowViewModal(true);
};

useEffect(() => {
  fetchQuotations();
}, []);
const handleFilter = () => {
  if (selectedStatus === "ALL") {
    setFilteredQuotations(quotations);
  } else {
    setFilteredQuotations(
      quotations.filter(
        (q) => q.status === selectedStatus
      )
    );
  }
};

const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this quotation?"
  );

  if (!confirmDelete) return;

  try {
    await deleteQuotation(id);

    setQuotations((prev) =>
      prev.filter((item) => item._id !== id)
    );

    alert("Quotation deleted successfully");
  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Delete failed"
    );
  }
};

const handleEdit = (quotation) => {
  setSelectedQuotation(quotation);
  setShowModal(true);
};

const handleSendQuotation = async (id) => {
  try {
    const response = await sendQuotation(id);

    alert("Quotation sent successfully");

    console.log(
      "Review URL:",
      response.data.reviewUrl
    );

    fetchQuotations();

  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Failed to send quotation"
    );
  }
};

const draftCount = quotations.filter(
  (q) => q.status === "DRAFT"
).length;

const approvedCount = quotations.filter(
  (q) => q.status === "APPROVED"
).length;

const rejectedCount = quotations.filter(
  (q) => q.status === "REJECTED"
).length;

const sentCount = quotations.filter(
  (q) => q.status === "SENT"
).length;

const expiredCount = quotations.filter(
  (q) => q.status === "EXPIRED"
).length;

const handleUpdate = async () => {
  try {
    await updateQuotation(
      selectedQuotation._id,
      selectedQuotation
    );

    fetchQuotations();

    setShowModal(false);

    alert("Quotation updated successfully");
  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Update failed"
    );
  }
};

  return (
    <div style={{ fontFamily: "Manrope, sans-serif" }}>
  {/* Page Header */}

  <div className="d-flex justify-content-between align-items-center mb-4">
    <div>
       <h1
        style={{
          fontWeight: 600,
          fontSize: "18px",
          color: "#111827",
        }}
      >
        Quotations
      </h1>
    </div>
  </div>
 {/* quatation cards */}
<Row className="g-3 mb-4" style={{ fontFamily: "Manrope, sans-serif" }}>
  {[
    {
      title: "Total Quotations",
      value: quotations.length,
      icon: <FaFileAlt />,
      iconBg: "#CCFBF1",
      iconColor: "#0D9488",
      trend: "+22 this month",
      trendColor: "#10B981",
      showArrow: true,
    },
    {
      title: "Pending Review",
      value: sentCount,
      icon: <FaClock />,
      iconBg: "#FEF3C7",
      iconColor: "#F59E0B",
      trend: "Awaiting response",
      trendColor: "#EF4444",
      showWarning: true,
    },
    {
      title: "Accepted",
      value: approvedCount,
      icon: <FaCheck />,
      iconBg: "#DCFCE7",
      iconColor: "#10B981",
      trend: "67% accept rate",
      trendColor: "#10B981",
        showArrow: true,
    },
    {
      title: "Rejected",
      value: rejectedCount,
      icon: <FaTimes />,
      iconBg: "#FEE2E2",
      iconColor: "#EF4444",
      trend: "13% loss rate",
      trendColor: "#EF4444",
       showDownArrow: true,
    },
    {
      title: "Total Value",
      value: `₹${(
        quotations.reduce(
          (sum, q) => sum + Number(q.totalAmount || 0),
          0
        ) / 100000
      ).toFixed(1)}L`,
      icon: <FaRupeeSign />,
      iconBg: "#DBEAFE",
      iconColor: "#3B82F6",
      trend: "+18% vs last month",
      trendColor: "#10B981",
        showArrow: true,
    },
  ].map((item, index) => (
    <Col
      key={index}
      xl={true}
      lg={true}
      md={4}
      sm={6}
      xs={12}
    >
      <div
        className="d-flex flex-column justify-content-between h-100"
        style={{
          background: "#fff",
          border: "1px solid #E2E8F0",
          borderRadius: "16px",
          padding: "18px",
          minHeight: "140px",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <div>
          <div className="d-flex align-items-start gap-3 mb-2">
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: item.iconBg,
                color: item.iconColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                flexShrink: 0,
              }}
            >
              {item.icon}
            </div>

           <h3 className="kpi-value">
              {item.value}
            </h3>
          </div>

           <p className="kpi-label">{item.title}</p>
        </div>

       <div
          className="kpi-trend"
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: item.trendColor,
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {item.showArrow && <FaArrowUp size={11} />}
           {item.showDownArrow && <FaArrowDown size={11} />}
          {item.showWarning && <FaExclamationTriangle size={11} />}
          <span>{item.trend}</span>
        </div>
      </div>
    </Col>
  ))}
</Row>

{/* Recent Quotations */}

<div className="d-flex justify-content-between align-items-center mb-3 mt-4">
  <h4
    style={{
      fontWeight: 600,
      fontSize: "18px",
      color: "#111827",
    }}
  >
    Recent Quotations
  </h4>

  <Button className="dashboard-btn-primary" >
    + New Quotation
  </Button>
</div>

<Row className="g-3 mb-4">
  {[...quotations]
  .sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )
  .slice(0, 4)
  .map((quotation) => (
    <Col lg={3} md={6} key={quotation._id}>
      <Card
        style={{
          borderRadius: "16px",
          border: "1px solid #E5E7EB",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          minHeight: "180px",
        }}
      >
        <Card.Body>
          <div
            style={{
              color: "#0D9488",
              fontWeight: 600,
              fontSize: "12px",
            }}
          >
            #{quotation.quotationNumber}
          </div>

          <h3
            style={{
              marginTop: "10px",
              marginBottom: "4px",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            {quotation.customerId?.companyName ||
    quotation.customerId?.name ||
    quotation.guestName ||
    quotation.leadId?.fullName}
          </h3>

          <div
            style={{
              color: "#6B7280",
              fontSize: "12px",
              marginBottom: "12px",
            }}
          >
            {quotation.eventType} •{" "}
            {new Date(
              quotation.eventDate
            ).toLocaleDateString()}
          </div>

          <h4
            style={{
              fontWeight: 600,
              color: "#111827",
              marginBottom: "12px",
               fontSize: "12px",
            }}
          >
            ₹{quotation.totalAmount?.toLocaleString()}
          </h4>

          <div className="d-flex justify-content-between align-items-center">
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "4px 10px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: "600",
              background:
                quotation.status === "APPROVED"
                  ? "#E6F7F4"
                  : quotation.status === "REJECTED"
                  ? "#FEE2E2"
                  : quotation.status === "DRAFT"
                  ? "#FEF3C7"
                  : "#DBEAFE",
              color:
                quotation.status === "APPROVED"
                  ? "#00A884"
                  : quotation.status === "REJECTED"
                  ? "#DC2626"
                  : quotation.status === "DRAFT"
                  ? "#D97706"
                  : "#2563EB",
            }}
          >
            {quotation.status === "APPROVED"
              ? "Approved"
              : quotation.status === "REJECTED"
              ? "Rejected"
              : quotation.status === "DRAFT"
              ? "Draft"
              : "Sent"}
          </span>

            <small className="text-muted" style={{fontSize:"12px"}}>
              {new Date(
                quotation.createdAt
              ).toLocaleDateString()}
            </small>
          </div>
        </Card.Body>
      </Card>
    </Col>
  ))}
</Row>
<div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-3 mt-4">
  <div className="d-flex flex-wrap gap-2 w-100 w-md-auto">
    <h4
    style={{
      fontWeight: 600,
      fontSize: "18px",
      color: "#111827",
    }}
  
    >
      All Quotations
    </h4>

    <span
  style={{
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    background: "#E6F7F4",
    color: "#00A884",
  }}
>
  {quotations.length} Total
</span>
  </div>

  <div className="d-flex gap-2">
 <Button className="dashboard-btn-outline"
  variant="light"
   onClick={() => setShowFilter(!showFilter)}
  >
  <FaFilter size={12} />
  Filter
</Button>

<Button className="view-all-link d-flex align-items-center gap-2">
  <FaDownload size={12} />
  Export
</Button>
   
  </div>
</div>
{showFilter && (
  <div
    className="mb-3 p-3"
    style={{
      border: "1px solid #E5E7EB",
      borderRadius: "12px",
      background: "#fff",
    }}
  >
    <Row className="g-2 align-items-center">
      <Col md={4}>
        <Form.Select
          value={selectedStatus}
          onChange={(e) =>
            setSelectedStatus(e.target.value)
          }
        >
          <option value="ALL">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="SENT">Sent</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </Form.Select>
      </Col>

      <Col md="auto">
        <Button
          className="dashboard-btn-primary"
          onClick={handleFilter}
        >
          Apply Filter
        </Button>
      </Col>
    </Row>
  </div>
)}
<Col xl={12}>
  <div className="card-section">
    

    <div className="table-responsive">
      <Table className="table-custom" hover>
        <thead>
          <tr>
            <th>
              <Form.Check />
            </th>
            <th>ENQ. ID</th>
            <th>CUSTOMER</th>
            <th>EVENT TYPE</th>
            <th>AMOUNT</th>
            <th>ISSUED</th>
            <th>VALID TILL</th>
            <th>STATUS</th>
            <th className="text-center">ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {filteredQuotations.map((quotation) => (
            <tr key={quotation._id}>
              <td>
                <Form.Check />
              </td>

              <td>
                <div
                  style={{
                    fontWeight: 700,
                    color: "#0F172A",
                  }}
                >
                  #{quotation.quotationNumber}
                </div>

                <small
                  style={{
                    color: "#64748B",
                  }}
                >
                  {quotation.eventType}
                </small>
              </td>

              <td>
                <div className="client-avatar-cell">
                  <div className="avatar-initials bg-info-subtle text-info">
                    {(
                      quotation.customerId?.companyName ||
                      quotation.customerId?.name ||
                      quotation.guestName ||
                      quotation.leadId?.fullName ||
                      "U"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                      }}
                    >
                      {quotation.customerId?.companyName ||
                        quotation.customerId?.name ||
                        quotation.guestName ||
                        quotation.leadId?.fullName ||
                        "Guest User"}
                    </div>

                    <small
                      style={{
                        color: "#64748B",
                      }}
                    >
                      {quotation.customerId?.email ||
                        quotation.guestEmail ||
                        quotation.leadId?.email ||
                        ""}
                    </small>
                  </div>
                </div>
              </td>

              <td>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: "600",
                  background:
                    quotation.eventType === "Wedding"
                      ? "#FCE7F3"
                      : quotation.eventType === "Corporate"
                      ? "#DBEAFE"
                      : quotation.eventType === "Birthday"
                      ? "#F3E8FF"
                      : quotation.eventType === "Religious"
                      ? "#FEF3C7"
                      : "#E5E7EB",
                  color:
                    quotation.eventType === "Wedding"
                      ? "#DB2777"
                      : quotation.eventType === "Corporate"
                      ? "#2563EB"
                      : quotation.eventType === "Birthday"
                      ? "#9333EA"
                      : quotation.eventType === "Religious"
                      ? "#D97706"
                      : "#374151",
                }}
              >
                {quotation.eventType}
              </span>
              </td>

              <td
                style={{
                  fontWeight: 700,
                }}
              >
                ₹{quotation.totalAmount?.toLocaleString()}
              </td>

              <td style={{ color: "#64748B" }}>
                {new Date(quotation.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>

              <td style={{ color: "#64748B" }}>
                {new Date(quotation.validFrom).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>

              <td>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "4px 10px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: "600",
                    background:
                      quotation.status === "APPROVED"
                        ? "#E6F7F4"
                        : quotation.status === "REJECTED"
                        ? "#FEE2E2"
                        : quotation.status === "DRAFT"
                        ? "#FEF3C7"
                        : "#DBEAFE",
                    color:
                      quotation.status === "APPROVED"
                        ? "#00A884"
                        : quotation.status === "REJECTED"
                        ? "#DC2626"
                        : quotation.status === "DRAFT"
                        ? "#D97706"
                        : "#2563EB",
                  }}
                >
                  {quotation.status === "APPROVED"
                    ? "Approved"
                    : quotation.status === "REJECTED"
                    ? "Rejected"
                    : quotation.status === "DRAFT"
                    ? "Draft"
                    : "Sent"}
                </span>
              </td>

              <td className="text-center">
  <div className="dropdown">
    <Button
      variant="link"
      className="p-0 text-muted"
      data-bs-toggle="dropdown"
    >
      <FaEllipsisV />
    </Button>
    <ul className="dropdown-menu dropdown-menu-end">
      <li><button className="dropdown-item" onClick={() => handleView(quotation)}>View</button></li>
      <li><button className="dropdown-item" onClick={() => handleEdit(quotation)}>Edit</button></li>
      <li><button className="dropdown-item" onClick={() => handleSendQuotation(quotation._id)}>Send</button></li>
      <li><hr className="dropdown-divider"/></li>
      <li><button className="dropdown-item text-danger" onClick={() => handleDelete(quotation._id)}>Delete</button></li>
    </ul>
  </div>
</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>

    <div className="d-flex justify-content-between align-items-center mt-3 px-2">
      <span
        style={{
          color: "#64748B",
          fontSize: "14px",
        }}
      >
        Showing 1–{filteredQuotations.length} of {quotations.length} quotations
      </span>

      <div className="d-flex gap-2">
        <Button size="sm" variant="light">
          ‹
        </Button>

        <Button
          size="sm"
          style={{
            background: "#0D9488",
            border: "none",
          }}
        >
          1
        </Button>

        <Button size="sm" variant="light">
          2
        </Button>

        <Button size="sm" variant="light">
          ›
        </Button>
      </div>
    </div>
  </div>
</Col>


  {/* Summary Cards 

  <Row className="mb-4">
    <Col md={2}>
      <Card>
        <Card.Body>
          <h6>Total</h6>
          <h3>{quotations.length}</h3>
        </Card.Body>
      </Card>
    </Col>

    <Col md={2}>
      <Card>
        <Card.Body>
          <h6>Draft</h6>
          <h3>{draftCount}</h3>
        </Card.Body>
      </Card>
    </Col>

    <Col md={2}>
      <Card>
        <Card.Body>
          <h6>Sent</h6>
          <h3>{sentCount}</h3>
        </Card.Body>
      </Card>
    </Col>

    <Col md={2}>
      <Card>
        <Card.Body>
          <h6>Approved</h6>
          <h3>{approvedCount}</h3>
        </Card.Body>
      </Card>
    </Col>

    <Col md={2}>
      <Card>
        <Card.Body>
          <h6>Rejected</h6>
          <h3>{rejectedCount}</h3>
        </Card.Body>
      </Card>
    </Col>

    <Col md={2}>
      <Card>
        <Card.Body>
          <h6>Expired</h6>
          <h3>{expiredCount}</h3>
        </Card.Body>
      </Card>
    </Col>
  </Row>
*/}
  {/* Filters

  <Card className="mb-3">
    <Card.Body>
      <Row>
        <Col md={4}>
          <Form.Control
            placeholder="Search quotation no, customer..."
          />
        </Col>

        <Col md={2}>
          <Form.Select>
            <option>All Status</option>
            <option>DRAFT</option>
            <option>SENT</option>
            <option>VIEWED</option>
            <option>APPROVED</option>
            <option>REJECTED</option>
          </Form.Select>
        </Col>

        <Col md={2}>
          <Button variant="outline-secondary">
            Reset Filters
          </Button>
        </Col>
      </Row>
    </Card.Body>
  </Card>
 */}
  {/* Quotations Table 

  <Card>
    <Card.Body>

      <Table hover responsive>
        <thead>
          <tr>
            <th>Quotation No</th>
            <th>Customer</th>
            <th>Event Type</th>
            <th>Event Date</th>
            <th>Amount</th>
            <th>Version</th>
            <th>Valid Till</th>
            <th>Status</th>
            <th width="180">Actions</th>
          </tr>
        </thead>

  <tbody>
  {quotations.map((quotation) => (
    <tr key={quotation._id}>
      <td>{quotation.quotationNumber}</td>

      <td>
        {quotation.customerId?.companyName ||
          quotation.customerId?.name}
      </td>

      <td>{quotation.eventType}</td>

      <td>
        {new Date(
          quotation.eventDate
        ).toLocaleDateString()}
      </td>

      <td>₹{quotation.totalAmount}</td>

      <td>V{quotation.version}</td>

      <td>
        {new Date(
          quotation.validFrom
        ).toLocaleDateString()}
      </td>

      <td>
        <Badge bg="secondary">
          {quotation.status}
        </Badge>
      </td>

     <td>
  <div className="d-flex align-items-center gap-2 flex-nowrap">
   
    <Button
    size="sm"
    variant="outline-success"
    onClick={() =>
    handleSendQuotation(quotation._id)
    }
    disabled={quotation.status==="SENT"}
    >
    Send
    </Button>

    <Button
      size="sm"
      variant="outline-warning"
      onClick={() => handleEdit(quotation)}
    >
      Edit
    </Button>

    <Button
      size="sm"
      variant="outline-danger"
      onClick={() => handleDelete(quotation._id)}
    >
      Delete
    </Button>
  </div>
</td>
    </tr>
  ))}
</tbody>
      </Table>

    </Card.Body>
  </Card>
*/}
  {/* Quotations Model */}

  <Modal
  show={showModal}
  onHide={() => setShowModal(false)}
>
  <Modal.Header closeButton>
    <Modal.Title>Edit Quotation</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    <Form.Group>
      <Form.Label>Event Type</Form.Label>

      <Form.Control
        value={
          selectedQuotation?.eventType || ""
        }
        onChange={(e) =>
          setSelectedQuotation({
            ...selectedQuotation,
            eventType: e.target.value,
          })
        }
      />
    </Form.Group>

    <Form.Group className="mt-3">
      <Form.Label>Status</Form.Label>

      <Form.Select
        value={
          selectedQuotation?.status || ""
        }
        onChange={(e) =>
          setSelectedQuotation({
            ...selectedQuotation,
            status: e.target.value,
          })
        }
      >
        <option value="DRAFT">DRAFT</option>
        <option value="SENT">SENT</option>
        <option value="VIEWED">VIEWED</option>
        <option value="APPROVED">
          APPROVED
        </option>
        <option value="REJECTED">
          REJECTED
        </option>
      </Form.Select>
    </Form.Group>
  </Modal.Body>

  <Modal.Footer>
    <Button
      variant="secondary"
      onClick={() => setShowModal(false)}
    >
      Cancel
    </Button>

    <Button
      variant="primary"
      onClick={handleUpdate}
    >
      Update
    </Button>
  </Modal.Footer>
</Modal>

  {/* View Quotation Modal */}
  <Modal
    show={showViewModal}
    onHide={() => setShowViewModal(false)}
    size="lg"
    centered
  >
    <Modal.Header closeButton style={{ borderBottom: '1px solid #E5E7EB', padding: '16px 24px' }}>
      <Modal.Title style={{ fontWeight: 600, fontSize: '18px', color: '#111827' }}>
        {viewQuotation?.quotationNumber}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: '600',
            marginLeft: '12px',
            background: viewQuotation?.status === 'APPROVED' ? '#E6F7F4' :
                        viewQuotation?.status === 'REJECTED' ? '#FEE2E2' :
                        viewQuotation?.status === 'DRAFT' ? '#FEF3C7' : '#DBEAFE',
            color: viewQuotation?.status === 'APPROVED' ? '#00A884' :
                  viewQuotation?.status === 'REJECTED' ? '#DC2626' :
                  viewQuotation?.status === 'DRAFT' ? '#D97706' : '#2563EB'
          }}
        >
          {viewQuotation?.status === 'APPROVED' ? 'Approved' :
          viewQuotation?.status === 'REJECTED' ? 'Rejected' :
          viewQuotation?.status === 'DRAFT' ? 'Draft' : 'Sent'}
        </span>
      </Modal.Title>
    </Modal.Header>
    
    <Modal.Body style={{ padding: '24px' }}>
      {viewQuotation && (
        <>
          {/* Customer Details */}
          <Row className="mb-4">
            <Col md={6}>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500, marginBottom: '4px' }}>Customer</div>
                <div style={{ fontWeight: 600, color: '#111827' }}>
                  {viewQuotation.customerId?.companyName || 
                  viewQuotation.customerId?.name || 
                  viewQuotation.guestName || 
                  viewQuotation.leadId?.fullName || 
                  'N/A'}
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500, marginBottom: '4px' }}>Email</div>
                <div style={{ color: '#111827' }}>
                  {viewQuotation.customerId?.email || 
                  viewQuotation.guestEmail || 
                  viewQuotation.leadId?.email || 
                  'N/A'}
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500, marginBottom: '4px' }}>Event Type</div>
                <div style={{ fontWeight: 600, color: '#111827' }}>{viewQuotation.eventType || 'N/A'}</div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500, marginBottom: '4px' }}>Event Date</div>
                <div style={{ color: '#111827' }}>
                  {viewQuotation.eventDate ? 
                    new Date(viewQuotation.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 
                    'N/A'}
                </div>
              </div>
            </Col>
          </Row>

          {/* Services Table */}
          {viewQuotation.services && viewQuotation.services.length > 0 && (
            <div className="mb-4">
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>Services</div>
              <Table bordered responsive style={{ fontSize: '13px' }}>
                <thead style={{ background: '#F9FAFB' }}>
                  <tr>
                    <th style={{ fontWeight: 600, color: '#374151' }}>Service</th>
                    <th style={{ fontWeight: 600, color: '#374151' }}>Qty</th>
                    <th style={{ fontWeight: 600, color: '#374151' }}>Unit Price</th>
                    <th style={{ fontWeight: 600, color: '#374151' }}>Disc %</th>
                    <th style={{ fontWeight: 600, color: '#374151' }}>CGST %</th>
                    <th style={{ fontWeight: 600, color: '#374151' }}>SGST %</th>
                    <th style={{ fontWeight: 600, color: '#374151' }} className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {viewQuotation.services.map((item, index) => (
                    <tr key={index}>
                      <td>{item.serviceName || 'N/A'}</td>
                      <td>{item.quantity || 1}</td>
                      <td>₹{Number(item.unitPrice || 0).toLocaleString()}</td>
                      <td>{item.discountPercent || 0}%</td>
                      <td>{item.cgstPercent || 0}%</td>
                      <td>{item.sgstPercent || 0}%</td>
                      <td className="text-end">₹{Number(item.lineTotal || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {/* Tax Summary */}
          <Row className="justify-content-end">
            <Col md={5}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '12px' }}>Summary</div>
              <div style={{ border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>Subtotal</span>
                  <span style={{ fontWeight: 500 }}>₹{Number(viewQuotation.subtotal || 0).toLocaleString()}</span>
                </div>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>Total Discount</span>
                  <span style={{ color: '#DC2626', fontWeight: 500 }}>-₹{Number(viewQuotation.totalDiscount || 0).toLocaleString()}</span>
                </div>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>CGST</span>
                  <span style={{ fontWeight: 500 }}>₹{Number(viewQuotation.totalCGST || 0).toLocaleString()}</span>
                </div>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>SGST</span>
                  <span style={{ fontWeight: 500 }}>₹{Number(viewQuotation.totalSGST || 0).toLocaleString()}</span>
                </div>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>Total GST</span>
                  <span style={{ fontWeight: 500 }}>₹{Number(viewQuotation.totalGST || 0).toLocaleString()}</span>
                </div>
                <div style={{ padding: '12px 16px', background: '#F0FDF4', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600, color: '#111827' }}>Grand Total</span>
                  <span style={{ fontWeight: 700, color: '#0D9488' }}>₹{Number(viewQuotation.totalAmount || 0).toLocaleString()}</span>
                </div>
              </div>
            </Col>
          </Row>

          {/* Notes & Terms */}
          {viewQuotation.notes && (
            <div className="mt-4">
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>Notes</div>
              <div style={{ background: '#F9FAFB', padding: '12px 16px', borderRadius: '8px', color: '#6B7280', fontSize: '13px' }}>
                {viewQuotation.notes}
              </div>
            </div>
          )}

          {viewQuotation.termsAndConditions && (
            <div className="mt-3">
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>Terms & Conditions</div>
              <div style={{ background: '#F9FAFB', padding: '12px 16px', borderRadius: '8px', color: '#6B7280', fontSize: '13px' }}>
                {viewQuotation.termsAndConditions}
              </div>
            </div>
          )}
        </>
      )}
    </Modal.Body>
    
    <Modal.Footer style={{ borderTop: '1px solid #E5E7EB', padding: '16px 24px' }}>
      <Button
        variant="secondary"
        onClick={() => setShowViewModal(false)}
        style={{
          backgroundColor: '#F3F4F6',
          border: 'none',
          color: '#374151',
          padding: '8px 24px',
          borderRadius: '8px',
          fontWeight: 500
        }}
      >
        Close
      </Button>
    </Modal.Footer>
  </Modal>

</div>
  )
}

export default Showquotation