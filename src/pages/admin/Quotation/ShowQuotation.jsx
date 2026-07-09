import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Table, Row, Col, Card, Badge } from "react-bootstrap";
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
  FaFilter,
  FaDownload,
  FaExclamationTriangle
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./ShowQuotation.css";

const ShowQuotation = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewQuotation, setViewQuotation] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter states
  const [searchCustomer, setSearchCustomer] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // ---------- Fetch Data ----------
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

  useEffect(() => {
    fetchQuotations();
  }, []);

  // ---------- Filter Logic ----------
  useEffect(() => {
    let filtered = quotations;

    if (searchCustomer) {
      const term = searchCustomer.toLowerCase();
      filtered = filtered.filter(q =>
        (q.customerId?.name || q.guestName || q.leadId?.fullName || "")
          .toLowerCase().includes(term) ||
        (q.customerId?.email || q.guestEmail || q.leadId?.email || "")
          .toLowerCase().includes(term)
      );
    }

    if (eventTypeFilter) {
      filtered = filtered.filter(q => q.eventType === eventTypeFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter(q => q.status === statusFilter);
    }

    setFilteredQuotations(filtered);
    setCurrentPage(1);
  }, [quotations, searchCustomer, eventTypeFilter, statusFilter]);

  // ---------- Reset Filters ----------
  const clearAllFilters = () => {
    setSearchCustomer("");
    setEventTypeFilter("");
    setStatusFilter("");
  };

  // ---------- Helper Functions ----------
  const handleView = (quotation) => {
    setViewQuotation(quotation);
    setShowViewModal(true);
  };

  const handleEdit = (quotation) => {
    setSelectedQuotation(quotation);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this quotation?"
    );
    if (!confirmDelete) return;
    try {
      await deleteQuotation(id);
      setQuotations((prev) => prev.filter((item) => item._id !== id));
      alert("Quotation deleted successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const handleSendQuotation = async (id) => {
    try {
      const response = await sendQuotation(id);
      alert("Quotation sent successfully");
      console.log("Review URL:", response.data.reviewUrl);
      fetchQuotations();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send quotation");
    }
  };

  const handleUpdate = async () => {
    try {
      await updateQuotation(selectedQuotation._id, selectedQuotation);
      fetchQuotations();
      setShowModal(false);
      alert("Quotation updated successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  // ---------- Export PDF ----------
  const handleExportPDF = () => {
    const doc = new jsPDF("l", "mm", "a4");
    doc.setFontSize(18);
    doc.text("Quotation Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated On : ${new Date().toLocaleString()}`, 14, 22);
    doc.text(`Status : ${statusFilter || "All"}`, 14, 30);

    autoTable(doc, {
      startY: 38,
      head: [[
        "Quotation No",
        "Customer",
        "Event Type",
        "Amount",
        "Issued",
        "Valid Till",
        "Status"
      ]],
      body: filteredQuotations.map((quotation) => [
        quotation.quotationNumber,
        quotation.customerId?.companyName ||
        quotation.customerId?.name ||
        quotation.guestName ||
        quotation.leadId?.fullName ||
        "-",
        quotation.eventType || "-",
        Number(quotation.totalAmount || 0).toLocaleString("en-IN"),
        quotation.createdAt
          ? new Date(quotation.createdAt).toLocaleDateString()
          : "-",
        quotation.validFrom
          ? new Date(quotation.validFrom).toLocaleDateString()
          : "-",
        quotation.status
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [58, 95, 190],
        textColor: 255,
        fontStyle: "bold"
      },
      styles: {
        fontSize: 8,
        cellPadding: 2
      }
    });

    doc.save(`Quotation_Report_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  // ---------- Stats ----------
  const draftCount = quotations.filter(q => q.status === "DRAFT").length;
  const approvedCount = quotations.filter(q => q.status === "APPROVED").length;
  const rejectedCount = quotations.filter(q => q.status === "REJECTED").length;
  const sentCount = quotations.filter(q => q.status === "SENT").length;
  const expiredCount = quotations.filter(q => q.status === "EXPIRED").length;

  // ---------- Sorting ----------
  const sortedQuotations = [...filteredQuotations].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // ---------- Pagination ----------
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQuotations = sortedQuotations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedQuotations.length / itemsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  // Get unique event types for dropdown
  const eventTypes = [...new Set(quotations.map(q => q.eventType).filter(Boolean))];

  // ---------- Render ----------
  return (
    <div style={{ fontFamily: "Manrope, sans-serif" }}>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <h1 style={{ fontWeight: 600, fontSize: "18px", color: "#111827" }}>
            Quotations
          </h1>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="mb-3 g-2 g-md-3">
        <Col xl lg md={6} sm={6} xs={6}>
          <Card className="metric-card">
            <Card.Body className="metric-body">
              <div className="metric-top">
                <div
                  className="metric-icon-box"
                  style={{ backgroundColor: "#DDF5F0", color: "#0F766E" }}
                >
                  <FaFileAlt size={20} />
                </div>
                <h2 className="metric-number">{quotations.length}</h2>
              </div>
              <div className="metric-title">TOTAL QUOTATIONS</div>
              <div className="metric-growth">
                <FaArrowUp size={14} />
                <span>+{sentCount + approvedCount} active</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl lg md={6} sm={6} xs={6}>
          <Card className="metric-card">
            <Card.Body className="metric-body">
              <div className="metric-top">
                <div
                  className="metric-icon-box"
                  style={{ backgroundColor: "#DBEAFE", color: "#2563EB" }}
                >
                  <FaClock size={20} />
                </div>
                <h2 className="metric-number">{sentCount}</h2>
              </div>
              <div className="metric-title">SENT</div>
              <div className="metric-growth">
                <FaArrowUp size={14} />
                <span>{quotations.length > 0 ? Math.round((sentCount / quotations.length) * 100) : 0}% of total</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl lg md={6} sm={6} xs={6}>
          <Card className="metric-card">
            <Card.Body className="metric-body">
              <div className="metric-top">
                <div
                  className="metric-icon-box"
                  style={{ backgroundColor: "#E7F4EE", color: "#10B981" }}
                >
                  <FaCheck size={20} />
                </div>
                <h2 className="metric-number">{approvedCount}</h2>
              </div>
              <div className="metric-title">APPROVED</div>
              <div className="metric-growth">
                <FaArrowUp size={14} />
                <span>{quotations.length > 0 ? Math.round((approvedCount / quotations.length) * 100) : 0}% approval rate</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl lg md={6} sm={6} xs={6}>
          <Card className="metric-card">
            <Card.Body className="metric-body">
              <div className="metric-top">
                <div
                  className="metric-icon-box"
                  style={{ backgroundColor: "#FEF3D7", color: "#D97706" }}
                >
                  <FaExclamationTriangle size={20} />
                </div>
                <h2 className="metric-number">{draftCount}</h2>
              </div>
              <div className="metric-title">DRAFT</div>
              <div className="metric-alert">
                <FaArrowDown size={14} />
                <span>Needs action</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl lg md={6} sm={6} xs={6}>
          <Card className="metric-card">
            <Card.Body className="metric-body">
              <div className="metric-top">
                <div
                  className="metric-icon-box"
                  style={{ backgroundColor: "#FDE8E8", color: "#EF4444" }}
                >
                  <FaTimes size={20} />
                </div>
                <h2 className="metric-number">{rejectedCount}</h2>
              </div>
              <div className="metric-title">REJECTED</div>
              <div className="metric-alert">
                <FaArrowDown size={14} />
                <span>{quotations.length > 0 ? Math.round((rejectedCount / quotations.length) * 100) : 0}% loss rate</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Quotations */}
      <div className="d-flex justify-content-between align-items-center mb-2 mt-4">
        <h4 style={{ fontWeight: 600, fontSize: "18px", color: "#111827" }}>
          Recent Quotations
        </h4>
        <Button className="dashboard-btn-primary">+ New Quotation</Button>
      </div>

      <Row className="mb-3 g-2 g-md-3">
        {[...quotations]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
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
                  <div style={{ color: "#0D9488", fontWeight: 600, fontSize: "12px" }}>
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
                  <div style={{ color: "#6B7280", fontSize: "12px", marginBottom: "12px" }}>
                    {quotation.eventType} •{" "}
                    {new Date(quotation.eventDate).toLocaleDateString()}
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
                    <small className="text-muted" style={{ fontSize: "12px" }}>
                      {new Date(quotation.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>

      {/* All Quotations Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-3 mt-4">
        <div className="d-flex flex-wrap gap-2 w-100 w-md-auto">
          <h4 style={{ fontWeight: 600, fontSize: "18px", color: "#111827" }}>
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
          <Button
            className="dashboard-btn-outline"
            variant="light"
            onClick={() => setShowFilter(!showFilter)}
          >
            <FaFilter size={12} /> Filter
          </Button>
          <Button
            className="view-all-link d-flex align-items-center gap-2"
            onClick={handleExportPDF}
          >
            <FaDownload size={12} /> Export
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      {showFilter && (
        <div
          className="mb-3 p-3"
          style={{
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            background: "#fff",
          }}
        >
          <div className="d-flex flex-wrap align-items-center gap-2 gap-md-3 justify-content-end">
            {/* Customer name search */}
            <div className="filter-capsule-container" style={{ padding: "4px 12px 4px 4px" }}>
              <Form.Control
                type="text"
                placeholder="Search customer..."
                value={searchCustomer}
                onChange={(e) => setSearchCustomer(e.target.value)}
                className="filter-select-inner"
                style={{
                  border: "none",
                  background: "#ffffff",
                  height: "32px",
                  width: "160px",
                  fontSize: "12px",
                  fontWeight: "400",
                  padding: "4px 12px",
                }}
              />
              <span className="filter-clear-btn" onClick={() => setSearchCustomer("")}>
                Clear
              </span>
            </div>

            {/* Event Type dropdown */}
            <div className="filter-capsule-container">
              <Form.Select
                className="filter-select-inner filter-select-roles"
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
              >
                <option value="">Event Type</option>
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Select>
              <span className="filter-clear-btn" onClick={clearAllFilters}>
                Clear All
              </span>
            </div>

            {/* Status dropdown */}
            <div className="filter-capsule-container">
              <Form.Select
                className="filter-select-inner filter-select-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Status</option>
                <option value="DRAFT">Draft</option>
                <option value="SENT">Sent</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </Form.Select>
              <span className="filter-clear-btn" onClick={clearAllFilters}>
                Clear All
              </span>
            </div>

            {/* Clear All button */}
            <Button
              variant="outline-secondary"
              onClick={clearAllFilters}
              style={{
                fontSize: "12px",
                fontWeight: "600",
                borderRadius: "8px",
                padding: "4px 14px",
                borderColor: "#d1d5db",
                color: "#4b5563",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#f3f4f6";
                e.target.style.borderColor = "#9ca3af";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.borderColor = "#d1d5db";
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      )}

      {/* Quotations Table */}
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
                {currentQuotations.map((quotation) => (
                  <tr key={quotation._id}>
                    <td>
                      <Form.Check />
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: "#0F172A" }}>
                        #{quotation.quotationNumber}
                      </div>
                      <small style={{ color: "#64748B" }}>{quotation.eventType}</small>
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
                          <div style={{ fontWeight: 600 }}>
                            {quotation.customerId?.companyName ||
                              quotation.customerId?.name ||
                              quotation.guestName ||
                              quotation.leadId?.fullName ||
                              "Guest User"}
                          </div>
                          <small style={{ color: "#64748B" }}>
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
                    <td style={{ fontWeight: 700 }}>
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
                        <Button variant="link" className="p-0 text-muted" data-bs-toggle="dropdown">
                          <FaEllipsisV />
                        </Button>
                        <ul className="dropdown-menu dropdown-menu-end">
                          <li>
                            <button className="dropdown-item" onClick={() => handleView(quotation)}>
                              View
                            </button>
                          </li>
                          <li>
                            <button className="dropdown-item" onClick={() => handleEdit(quotation)}>
                              Edit
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item"
                              disabled={quotation.status !== "DRAFT"}
                              onClick={() => handleSendQuotation(quotation._id)}
                            >
                              Send
                            </button>
                          </li>
                          <li>
                            <hr className="dropdown-divider" />
                          </li>
                          <li>
                            <button
                              className="dropdown-item text-danger"
                              onClick={() => handleDelete(quotation._id)}
                            >
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3 px-2">
            <span style={{ color: "#64748B", fontSize: "14px" }}>
              Showing {indexOfFirstItem + 1}–
              {Math.min(indexOfLastItem, filteredQuotations.length)} of{" "}
              {filteredQuotations.length} quotations
            </span>
            <div className="d-flex gap-2 align-items-center">
              <Button
                size="sm"
                variant="light"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                ‹
              </Button>
              {Array.from({ length: totalPages }, (_, index) => (
                <Button
                  key={index + 1}
                  size="sm"
                  onClick={() => setCurrentPage(index + 1)}
                  style={{
                    background: currentPage === index + 1 ? "#0D9488" : "#fff",
                    color: currentPage === index + 1 ? "#fff" : "#111827",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  {index + 1}
                </Button>
              ))}
              <Button
                size="sm"
                variant="light"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                ›
              </Button>
            </div>
          </div>
        </div>
      </Col>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Quotation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Event Type</Form.Label>
            <Form.Control
              value={selectedQuotation?.eventType || ""}
              onChange={(e) =>
                setSelectedQuotation({ ...selectedQuotation, eventType: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={selectedQuotation?.status || ""}
              onChange={(e) =>
                setSelectedQuotation({ ...selectedQuotation, status: e.target.value })
              }
            >
              <option value="DRAFT">DRAFT</option>
              <option value="SENT">SENT</option>
              <option value="VIEWED">VIEWED</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Modal */}
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

              {/* Summary */}
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
  );
};

export default ShowQuotation;