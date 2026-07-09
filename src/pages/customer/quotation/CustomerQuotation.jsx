// CustomerQuotation.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Table, Row, Col, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaEye, FaCheck, FaTimes, FaPrint } from 'react-icons/fa';
import {
  getCustomerQuotations,
  approveQuotation,
  rejectQuotation,
  getQuotationByToken
} from '../../../services/quotationService';
import { formatDate } from '../../../utils/formatDate';
import {
  FileText,
  Download,
  BadgeIndianRupee,
  TriangleAlert,
  Check,
  X,
  MessageSquare,
  List,
  Percent
} from "lucide-react";

const CustomerQuotation = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedQuotation, setSelectedQuotation] = useState(null);

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedQuotationId, setSelectedQuotationId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quotations, setQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [showQuotationList, setShowQuotationList] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isHover, setIsHover] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  const quotation =
    selectedQuotation ||
    filteredQuotations[0];
  const getStatusLabel = (status) => {
    switch (status) {
      case "SENT":
        return "Awaiting Your Approval";

      case "VIEWED":
      case "PENDING":
        return "Pending Approval";

      case "APPROVED":
        return "Approved";

      case "REJECTED":
        return "Rejected";

      default:
        return status || "-";
    }
  };
  const getStatusStyle = (status) => {
    switch (status) {
      case "APPROVED":
        return {
          background: "#ECFDF3",
          color: "#16A34A",
          border: "1px solid #BBF7D0"
        };

      case "REJECTED":
        return {
          background: "#FEF2F2",
          color: "#DC2626",
          border: "1px solid #FECACA"
        };

      default:
        return {
          background: "#FFF7E6",
          color: "#F59E0B",
          border: "1px solid #FDE68A"
        };
    }
  };
  const statusStyle = getStatusStyle(quotation?.status);
  // Filter states
  console.log("Token:", token);
  // Fetch quotations on component mount
  useEffect(() => {
    if (token) {
      fetchQuotationByToken(token);
    } else {
      fetchAllQuotations();
    }
  }, [token]);



  const fetchAllQuotations = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getCustomerQuotations();

      if (response.data.success) {
        setQuotations(response.data.data);
        setFilteredQuotations(response.data.data);
      } else {
        setError("Failed to fetch quotations");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load quotations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...quotations];

    if (searchTerm) {
      filtered = filtered.filter(
        (q) =>
          q.quotationNumber
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          q.leadId?.fullName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter(
        (q) => q.status === statusFilter
      );
    }

    setFilteredQuotations(filtered);
  }, [quotations, searchTerm, statusFilter]);
  // Fetch quotation by token
  const fetchQuotationByToken = async (token) => {
    console.log("Token:", token);

    setLoading(true);
    setError("");

    try {
      console.log("Before API");

      const response = await getQuotationByToken(token);

      console.log("After API", response);
      console.log("Success:", response.data.success);
      console.log("Data:", response.data);

      if (response.data.success) {
        setSelectedQuotation(response.data.data);
        console.log("State Updated");
      } else {
        setError("Invalid quotation link");
      }
    } catch (err) {
      console.log("API ERROR", err);
      console.log("Response", err.response);

      setError(err.response?.data?.message || "Failed to load quotation");
    } finally {
      setLoading(false);
    }
  };

  // Handle approve
  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      const response = await approveQuotation(selectedQuotationId);

      if (response.data.success) {
        alert('Quotation approved successfully!');
        setShowApproveModal(false);

        setShowDetailModal(false);
        setSelectedQuotation(null);
      }
    } catch (err) {
      console.error('Error approving quotation:', err);
      alert(err.response?.data?.message || 'Failed to approve quotation');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle reject
  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await rejectQuotation(selectedQuotationId, {
        reason: rejectionReason
      });

      if (response.data.success) {
        alert('Quotation rejected successfully!');
        setShowRejectModal(false);
        setRejectionReason('');

        setShowDetailModal(false);
        setSelectedQuotation(null);
      }
    } catch (err) {
      console.error('Error rejecting quotation:', err);
      alert(err.response?.data?.message || 'Failed to reject quotation');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <p>Loading quotations...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mt-4">
        <Alert variant="danger">
          <Alert.Heading>Error!</Alert.Heading>
          <p>{error}</p>
          <Button
            variant="primary"
            onClick={() => {
              setError('');

            }}
          >
            Try Again
          </Button>
        </Alert>
      </div>
    );
  }

  // List view (all quotations) - Table format like Showquotation
  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h2 className="fw-bold mb-1">Quotation</h2>
          <p className="text-muted mb-0">
            Review your quotation, service breakdown and applicable taxes before you decide.
          </p>
        </Col>

        <Col xs="auto" className="d-flex gap-2">

          <Button
            onClick={() => setShowQuotationList(!showQuotationList)}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            style={{
              background: isHover ? "#14B8A6" : "#fff",
              border: "1px solid #14B8A6",
              color: isHover ? "#fff" : "#14B8A6",
              borderRadius: "10px",
              height: "40px",
              padding: "0 16px",
              fontSize: "14px",
              fontWeight: 500,
              transition: "all 0.3s ease"
            }}
          >
            <FileText
              size={16}
              className="me-2"
              color={isHover ? "#fff" : "#14B8A6"}
            />

            {showQuotationList ? "Hide Quotations" : "View All Quotations"}
          </Button>

          <Button
            variant="light"
            style={{
              border: "1px solid #D0D5DD",
              borderRadius: "10px",
              background: "#fff",
              height: "40px",
              padding: "0 16px",
              fontSize: "14px",
            }}
          >
            <Download size={18} className="me-2" />
            Download PDF
          </Button>

        </Col>
        {showQuotationList && (

          <Card className="border-0 shadow-sm rounded-4 mb-4">

            <Card.Body>

              <h5 className="mb-3">
                All Quotations
              </h5>

              <Table hover responsive>

                <thead>

                  <tr>

                    <th>Quotation No</th>

                    <th>Event</th>

                    <th>Date</th>

                    <th>Amount</th>

                    <th>Status</th>

                    <th></th>

                  </tr>

                </thead>

                <tbody>

                  {filteredQuotations.map((item) => (

                    <tr key={item._id}>

                      <td>{item.quotationNumber}</td>

                      <td>{item.eventType}</td>

                      <td>{formatDate(item.createdAt)}</td>

                      <td>{formatCurrency(item.totalAmount)}</td>

                      <td>

                        <Badge bg="warning">

                          {item.status}

                        </Badge>

                      </td>

                      <td>

                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedQuotation(item);
                            setShowQuotationList(false);
                          }}
                          onMouseEnter={() => setHoveredId(item._id)}
                          onMouseLeave={() => setHoveredId(null)}
                          style={{
                            background: hoveredId === item._id ? "#14B8A6" : "#fff",
                            border: "1px solid #14B8A6",
                            color: hoveredId === item._id ? "#fff" : "#14B8A6",
                            borderRadius: "8px",
                            height: "34px",
                            padding: "0 14px",
                            fontSize: "13px",
                            fontWeight: 500,
                            transition: "all 0.2s ease"
                          }}
                        >
                          View
                        </Button>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </Table>

            </Card.Body>

          </Card>

        )}
      </Row>
      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Body>
          <Row className="align-items-center">

            {/* Left Side */}
            <Col lg={8}>
              <div className="d-flex align-items-start">

                <div
                  className="d-flex justify-content-center align-items-center me-3"
                  style={{
                    width: "55px",
                    height: "55px",
                    borderRadius: "12px",
                    background: "#EAF8F6"
                  }}
                >
                  <FileText size={22} color="#0D9488" strokeWidth={2} />
                </div>

                <div>
                  <h4 className="fw-semibold mb-1">
                    Quotation #{quotation?.quotationNumber || "-"}
                  </h4>

                  <h6 className="mb-1">
                    {quotation?.eventTitle ||
                      quotation?.eventType ||
                      "Event Name"}
                  </h6>

                  <small className="text-muted">
                    Linked Enquiry #
                    {quotation?.enquiryId?.enquiryNumber || "N/A"}
                    {" • "}
                    Issued{" "}
                    {quotation?.createdAt
                      ? formatDate(quotation.createdAt)
                      : "-"}
                  </small>
                </div>

              </div>
            </Col>

            {/* Right Side */}

            <Col lg={4} className="text-lg-end mt-4 mt-lg-0">

              <h2
                className=" mb-0"
                style={{ color: "#00A76F" }}
              >
                {formatCurrency(quotation?.totalAmount)}
              </h2>

              <small className="text-muted d-block">
                Total Payable (Incl. GST)
              </small>


              <span
                style={{
                  ...statusStyle,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "4px 12px",
                  borderRadius: "999px",
                  fontWeight: 500,
                  fontSize: "13px"
                }}
              >
                ● {getStatusLabel(quotation?.status)}
              </span>
            </Col>

          </Row>
        </Card.Body>
      </Card>
      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Body>

          <div className="d-flex align-items-center gap-3">
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "#E8FAF8",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "5px"
              }}
            >
              <FileText size={22} color="#0F9D94" />
            </div>

            <h5 className="mb-2 fw-semibold">
              Quotation Details
            </h5>
          </div>

          <Row className="g-0 border-top overflow-hidden">

            {/* Row 1 */}

            <Col md={4} className="py-3 px-4 border-end border-bottom">
              <small className="text-muted d-block">Quotation No.</small>
              <h6 className="mt-1 mb-0">
                {quotation?.quotationNumber || "-"}
              </h6>
            </Col>

            <Col md={4} className="py-3 px-4 border-end border-bottom">
              <small className="text-muted d-block">Issue Date</small>
              <h6 className="mt-1 mb-0">
                {quotation?.createdAt
                  ? formatDate(quotation.createdAt)
                  : "-"}
              </h6>
            </Col>

            <Col md={4} className="py-3 px-4 border-bottom">
              <small className="text-muted d-block">Valid Until</small>
              <h6 className=" mt-1 mb-0">
                {quotation?.validUntil
                  ? formatDate(quotation.validUntil)
                  : "-"}
              </h6>

              <small className="text-muted">
                14 days validity
              </small>
            </Col>

            {/* Row 2 */}

            <Col md={4} className="py-3 px-4 border-end border-bottom">
              <small className="text-muted d-block">Client</small>

              <h6 className=" mt-1 mb-0">
                {quotation?.leadId?.fullName ||
                  quotation?.guestName ||
                  "-"}
              </h6>

              <small className="text-muted">
                {quotation?.leadId?.email ||
                  quotation?.guestEmail}
              </small>
            </Col>

            <Col md={4} className="py-3 px-4 border-end border-bottom">
              <small className="text-muted d-block">Event Date</small>

              <h6 className=" mt-1 mb-0">
                {quotation?.eventDate
                  ? formatDate(quotation.eventDate)
                  : "-"}
              </h6>
            </Col>

            <Col md={4} className="py-3 px-4 border-bottom">
              <small className="text-muted d-block">Venue</small>

              <h6 className=" mt-1 mb-0">
                {quotation?.venue || "-"}
              </h6>

              <small className="text-muted">
                {quotation?.guestCount || ""} Guests
              </small>
            </Col>

            {/* Row 3 */}

            <Col md={4} className="py-3 px-4 border-end">
              <small className="text-muted d-block">
                Prepared By
              </small>

              <h6 className=" mt-1 mb-0">
                {quotation?.preparedBy || "-"}
              </h6>
            </Col>

            <Col md={4} className="py-3 px-4 border-end">
              <small className="text-muted d-block">
                Payment Terms
              </small>

              <h6 className=" mt-1 mb-0">
                {quotation?.paymentTerms || "-"}
              </h6>
            </Col>

            <Col md={4} className="py-3 px-4">
              <small className="text-muted d-block">
                Status
              </small>

              <span
                style={{
                  ...statusStyle,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "4px 12px",
                  borderRadius: "999px",
                  fontWeight: 500,
                  fontSize: "13px"
                }}
              >
                ● {getStatusLabel(quotation?.status)}
              </span>
            </Col>

          </Row>

        </Card.Body>
      </Card>
      <Row
        className="mb-4"
        style={{
          rowGap: "20px"
        }}
      >

        {/* Service Breakdown */}

        <Col lg={8} className="d-flex">

          <Card
            className="border-0 shadow-sm rounded-4 w-100"
            style={{
              height: "100%"
            }}
          >

            <Card.Body className="p-0">

              <div
                className="d-flex align-items-center justify-content-between px-4"
                style={{
                  height: "68px",
                  borderBottom: "1px solid #EAECF0"
                }}
              >

                <div className="d-flex align-items-center gap-3">
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      background: "#E8FAF8",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <List size={22} color="#0F9D94" />
                  </div>

                  <h5 className="mb-0 fw-semibold">
                    Service Breakdown
                  </h5>
                </div>

              </div>

              <Table
                responsive
                className="mb-0"
                style={{
                  borderCollapse: "collapse"
                }}
              >

                <thead
                  style={{
                    background: "#F9FAFB",

                  }}
                >

                  <tr>

                    <th
                      style={{
                        padding: "10px 22px",
                        fontWeight: 500,
                        fontSize: "13px",
                        color: "#667085",
                        borderBottom: "1px solid #EAECF0"
                      }}
                    >
                      Service
                    </th>

                    <th
                      style={{
                        padding: "14px 22px",
                        fontWeight: 500,
                        fontSize: "13px",
                        color: "#667085",
                        borderBottom: "1px solid #EAECF0"
                      }}
                    >
                      Qty
                    </th>

                    <th
                      style={{
                        padding: "14px 22px",
                        fontWeight: 500,
                        fontSize: "13px",
                        color: "#667085",
                        borderBottom: "1px solid #EAECF0"
                      }}
                    >
                      Rate
                    </th>

                    <th
                      className="text-end"
                      style={{
                        padding: "14px 22px",
                        fontWeight: 500,
                        fontSize: "13px",
                        color: "#667085",
                        borderBottom: "1px solid #EAECF0"
                      }}
                    >
                      Amount
                    </th>

                  </tr>

                </thead>

                <tbody>
                  {quotation?.services?.map((service, index) => (
                    <tr key={index} >

                      <td
                        style={{
                          padding: "10px 22px",
                          lineHeight: "18px",
                          borderBottom: "1px solid #EAECF0",
                          verticalAlign: "middle"
                        }}
                      >
                        <div
                          style={{
                            fontSize: "15px",
                            marginBottom: "25px",
                            fontWeight: 600,
                            color: "#101828",
                            lineHeight: "15px"
                          }}
                        >
                          {service.serviceName}
                        </div>

                        <div
                          style={{
                            fontSize: "13px",
                            color: "#667085",
                            lineHeight: "18px",
                            marginTop: "-15px",
                            marginBottom: "10px",
                          }}
                        >
                          {service.description}
                        </div>
                      </td>

                      <td
                        style={{
                          padding: "12px 22px",
                          fontSize: "15px",
                          color: "#344054",
                          borderBottom: "1px solid #EAECF0",
                          verticalAlign: "middle"
                        }}
                      >
                        {service.quantity}
                      </td>

                      <td
                        style={{
                          padding: "12px 22px",
                          fontSize: "15px",
                          color: "#344054",
                          borderBottom: "1px solid #EAECF0",
                          verticalAlign: "middle"
                        }}
                      >
                        {formatCurrency(service.unitPrice)}
                      </td>

                      <td
                        className="text-end"
                        style={{
                          padding: "12px 22px",
                          fontSize: "15px",
                          fontWeight: 600,
                          color: "#101828",
                          borderBottom: "1px solid #EAECF0",
                          verticalAlign: "middle"
                        }}
                      >
                        {formatCurrency(service.lineTotal)}
                      </td>

                    </tr>
                  ))}
                </tbody>

                <tfoot>

                  <tr>

                    <td
                      colSpan={3}
                      style={{
                        padding: "18px 22px",
                        fontSize: "18px",
                        fontWeight: 600
                      }}
                    >

                      Subtotal (before GST)

                    </td>

                    <td
                      className="text-end"
                      style={{
                        padding: "18px 22px",
                        fontSize: "18px",
                        fontWeight: 700
                      }}
                    >

                      {formatCurrency(quotation?.subtotal)}

                    </td>

                  </tr>

                </tfoot>

              </Table>

            </Card.Body>

          </Card>

        </Col>

        {/* GST */}

        <Col lg={4} className="d-flex">

          <Card className="border-0 shadow-sm rounded-4 w-100">

            <Card.Body className="p-4">

              {/* Header */}

              <div
                className="d-flex justify-content-between align-items-center pb-3 mb-4"
                style={{
                  borderBottom: "1px solid #EAECF0"
                }}
              >

                <div className="d-flex align-items-center gap-3">
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      background: "#E8FAF8",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <Percent size={22} color="#0F9D94" />
                  </div>

                  <h5 className="mb-0 fw-semibold">
                    GST Details
                  </h5>
                </div>

                <span
                  style={{
                    background: "#ECFDF3",
                    color: "#10B981",
                    padding: "6px 14px",
                    borderRadius: "10px",
                    fontWeight: 500,
                    fontSize: "14px"
                  }}
                >
                  18% GST
                </span>

              </div>

              {/* Taxable */}

              <div className="d-flex justify-content-between mb-4">

                <div>

                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "#101828"
                    }}
                  >
                    Taxable Amount
                  </div>

                </div>

                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 700
                  }}
                >
                  {formatCurrency(quotation?.subtotal)}
                </div>

              </div>

              {/* CGST */}

              <div className="d-flex justify-content-between mb-4">

                <div>

                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: 600
                    }}
                  >
                    CGST
                  </div>

                  <small className="text-muted">
                    Central GST @ 9%
                  </small>

                </div>

                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 700
                  }}
                >
                  {formatCurrency(quotation?.totalCGST)}
                </div>

              </div>

              {/* SGST */}

              <div className="d-flex justify-content-between mb-4">

                <div>

                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: 600
                    }}
                  >
                    SGST
                  </div>

                  <small className="text-muted">
                    State GST @ 9%
                  </small>

                </div>

                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 700
                  }}
                >
                  {formatCurrency(quotation?.totalSGST)}
                </div>

              </div>

              {/* IGST */}

              <div className="d-flex justify-content-between mb-4">

                <div>

                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: 600
                    }}
                  >
                    IGST
                  </div>

                  <small className="text-muted">
                    Not applicable
                  </small>

                </div>

                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 700
                  }}
                >
                  ₹0
                </div>

              </div>

              {/* Total GST */}

              <div
                className="d-flex justify-content-between align-items-center"
                style={{
                  background: "#E8FAF3",
                  borderRadius: "16px",
                  padding: "18px 20px",
                  marginBottom: "28px"
                }}
              >

                <div
                  style={{
                    color: "#10B981",
                    fontWeight: 700,
                    fontSize: "15px"
                  }}
                >
                  Total GST (18%)
                </div>

                <div
                  style={{
                    color: "#10B981",
                    fontWeight: 700,
                    fontSize: "18px"
                  }}
                >
                  {formatCurrency(quotation?.totalGST)}
                </div>

              </div>

              {/* GSTIN */}

              <div
                className="text-muted"
                style={{
                  fontSize: "14px",
                  lineHeight: "24px"
                }}
              >
                GSTIN: {quotation?.gstin || "-"}
              </div>

            </Card.Body>

          </Card>

        </Col>

      </Row>

      <Card className="border-0 shadow-sm rounded-4"
        style={{
          border: "none",
          borderRadius: "16px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
        }}>

        <Card.Body>

          <div className="d-flex align-items-center mb-3">

            <div
              className="me-3 d-flex align-items-center justify-content-center"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "14px",
                background: "#FFF4E5"
              }}
            >
              <TriangleAlert size={24} color="#F59E0B" strokeWidth={2.2} />
            </div>

            <div>

              <h5 className="fw-semibold mb-1">
                Accept or Reject Quotation
              </h5>

              <small className="text-muted">
                Your decision confirms how we proceed with your event.
              </small>

            </div>

          </div>
          <div
            className="rounded-4 p-4 mb-4"
            style={{
              background: "#F9FAFB",
              border: "1px solid #E5E7EB",
              color: "#374151",
              fontSize: "16px",
              lineHeight: "30px"
            }}
          >
            By accepting, you agree to the total of{" "}
            <strong>{formatCurrency(quotation?.totalAmount)}</strong> (incl. 18% GST)
            and the payment terms of{" "}
            <strong>{quotation?.paymentTerms || "50% advance"}</strong> with the balance
            due before the event. Accepting will convert this quotation into a confirmed
            booking. Choose <strong>Reject</strong> if you'd like our team to revise the
            proposal.
          </div>

          <Row>

            <Col md={4} className="mb-2">

              <Button
                className="w-100"
                variant="light"
                style={{
                  height: "47px",
                  borderRadius: "16px",
                  border: "1px solid #FECACA",
                  color: "#EF4444",
                  background: "#fff",
                  fontWeight: 500
                }}
                onClick={() => {
                  setSelectedQuotationId(quotation._id);
                  setShowRejectModal(true);
                }}
              >
                <X size={18} className="me-2" />
                Reject Quotation
              </Button>

            </Col>

            <Col md={4} className="mb-2">

              <Button
                variant="light"
                className="w-100"
                style={{
                  height: "47px",
                  borderRadius: "16px",
                  border: "1px solid #D1D5DB",
                  background: "#fff",
                  fontWeight: 500,
                  color: "#374151"
                }}
              >
                <MessageSquare size={18} className="me-2" />
                Request Changes
              </Button>

            </Col>

            <Col md={4} className="mb-2">

              <Button
                className="w-100"
                style={{
                  height: "47px",
                  borderRadius: "16px",
                  background: "#16978D",
                  border: "none",
                  fontWeight: 500
                }}
                onClick={() => {
                  setSelectedQuotationId(quotation._id);
                  setShowApproveModal(true);
                }}
              >
                <Check size={18} className="me-2" />
                Accept Quotation
              </Button>
            </Col>
          </Row>
          <div className="text-center mt-3">
            <small className="text-muted">
              This quotation is valid until{" "}
              {quotation?.validUntil
                ? formatDate(quotation.validUntil)
                : "-"}
            </small>
          </div>
        </Card.Body>
      </Card>

      {/* Approve Modal */}
      <Modal show={showApproveModal} onHide={() => setShowApproveModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Approve Quotation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to approve this quotation?</p>
          <p className="text-muted">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowApproveModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleApprove} disabled={isSubmitting}>
            {isSubmitting ? 'Approving...' : 'Yes, Approve'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reject Modal */}
      <Modal show={showRejectModal} onHide={() => {
        setShowRejectModal(false);
        setRejectionReason('');
      }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reject Quotation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Reason for Rejection</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejecting this quotation..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowRejectModal(false);
            setRejectionReason('');
          }}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleReject} disabled={isSubmitting}>
            {isSubmitting ? 'Rejecting...' : 'Yes, Reject'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CustomerQuotation;
