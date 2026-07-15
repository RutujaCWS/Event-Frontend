import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Table,
  Spinner,
  Button,
  Form,
} from "react-bootstrap";

import {
 BsCheck2,
 BsClock,
 BsFileEarmark,
 BsPercent,
 BsDownload,  
 BsSearch,
 BsChevronLeft,
 BsChevronRight,
} from "react-icons/bs";

import { LuFilter } from "react-icons/lu";

import { VscKebabVertical } from "react-icons/vsc";

import "./CustomerInvoice.css";

function CustomerInvoice() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [bookingIdFilter, setBookingIdFilter] = useState("");
  const [issueDateFilter, setIssueDateFilter] = useState("");

  const itemsPerPage = 4;

  const [invoiceStats] = useState({
    totalInvoices: 6,
    totalPaid: 452344,
    outstanding: 142928,
    gstPaid: 91656,
  });

  const [invoices, setInvoices] = useState([]);

  const mockInvoices = [
    {
      id: 1,
      invoiceNo: "INV-2026-088",
      type: "GST Invoice",
      eventName: "Sharma Wedding",
      bookingId: "BK-2026-422",
      issueDate: "Jun 06, 2026",
      amount: 285856,
      status: "Partial",
    },
    {
      id: 2,
      invoiceNo: "INV-2026-081",
      type: "GST Invoice",
      eventName: "Anniversary Dinner",
      bookingId: "BK-2026-418",
      issueDate: "Feb 02, 2026",
      amount: 109428,
      status: "Paid",
    },
    {
      id: 3,
      invoiceNo: "INV-2026-062",
      type: "GST Invoice",
      eventName: "Birthday Gala",
      bookingId: "BK-2026-390",
      issueDate: "Apr 28, 2026",
      amount: 60488,
      status: "Paid",
    },
    {
      id: 4,
      invoiceNo: "INV-2026-074",
      type: "GST Invoice",
      eventName: "Engagement",
      bookingId: "BK-2026-407",
      issueDate: "Jan 18, 2026",
      amount: 32488,
      status: "Paid",
    },
    {
      id: 5,
      invoiceNo: "INV-2026-093",
      type: "GST Invoice",
      eventName: "Corporate Seminar",
      bookingId: "BK-2026-433",
      issueDate: "May 14, 2026",
      amount: 75420,
      status: "Paid",
    },
    {
      id: 6,
      invoiceNo: "INV-2026-101",
      type: "GST Invoice",
      eventName: "Religious Ceremony",
      bookingId: "BK-2026-455",
      issueDate: "Jun 22, 2026",
      amount: 67480,
      status: "Pending",
    },
  ];

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setInvoices(mockInvoices);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      Paid: {
        class: "badge-paid",
        label: "Paid",
      },
      Partial: {
        class: "badge-partial",
        label: "Partial",
      },
      Pending: {
        class: "badge-pending",
        label: "Pending",
      },
    };

    return badges[status] || badges.Pending;
  };

  const handleDownloadInvoice = (invoice) => {
    console.log("Download Invoice:", invoice);
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNo
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      invoice.eventName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      activeTab === "All"
        ? true
        : invoice.status === activeTab;

    const matchesBookingId =
      !bookingIdFilter ||
      invoice.bookingId
        .toLowerCase()
        .includes(bookingIdFilter.toLowerCase());

    const matchesIssueDate =
      !issueDateFilter ||
      invoice.issueDate
        .toLowerCase()
        .includes(issueDateFilter.toLowerCase());

    return (
      matchesSearch &&
      matchesStatus &&
      matchesBookingId &&
      matchesIssueDate
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentInvoices = filteredInvoices.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(
    filteredInvoices.length / itemsPerPage
  );

  return (
    <div className="customer-invoice-container p-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="page-title">Invoices</h2>
          <p className="page-subtitle">
            View all your GST invoices, download PDF copies and
            review the tax breakdown.
          </p>
        </div>

        <Button className="download-all-btn" onClick={() => console.log("Download All Invoices")}>
          <BsDownload />
          Download All
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="g-3 mb-4">

        <Col xl={3} md={6}>
          <Card className="metric-card">
            <Card.Body className="metric-body">
              <div className="metric-top">
                <div className="metric-icon-box avatar-initials-teal">
                  <BsFileEarmark />
                </div>
              </div>

              <h3 className="metric-number">
                {invoiceStats.totalInvoices}
              </h3>

              <div className="metric-title">
                TOTAL INVOICES
              </div>

              <div className="caption">
                All time
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} md={6}>
          <Card className="metric-card">
            <Card.Body className="metric-body">
              <div className="metric-top">
                <div className="metric-icon-box avatar-initials-green">
                  <BsCheck2 /> 
                </div>
              </div>

              <h3 className="metric-number">
                ₹{invoiceStats.totalPaid.toLocaleString("en-IN")}
              </h3>

              <div className="metric-title">
                TOTAL PAID
              </div>

              <div className="metric-growth">
                4 invoices settled
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} md={6}>
          <Card className="metric-card">
            <Card.Body className="metric-body">
              <div className="metric-top">
                <div className="metric-icon-box avatar-initials-orange">
                  <BsClock />
                </div>
              </div>

              <h3 className="metric-number">
                ₹{invoiceStats.outstanding.toLocaleString("en-IN")}
              </h3>

              <div className="metric-title">
                OUTSTANDING
              </div>

              <div className="metric-alert">
                1 invoice pending
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={3} md={6}>
          <Card className="metric-card">
            <Card.Body className="metric-body">
              <div className="metric-top">
                <div className="metric-icon-box avatar-initials-blue">
                  <BsPercent />
                </div>
              </div>

              <h3 className="metric-number">
                ₹{invoiceStats.gstPaid.toLocaleString("en-IN")}
              </h3>

              <div className="metric-title">
                TOTAL GST PAID
              </div>

              <div className="metric-growth">
                18% applicable
              </div>
            </Card.Body>
          </Card>
        </Col>

      </Row>

      {/* Table Card */}
      <Card className="shadow-sm border-0">
        <Card.Body>

          {/* Tabs + Search */}

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

            <div className="FilterTabs">

              <Button
                className={
                  activeTab === "All"
                    ? "status-tab-active"
                    : "status-tab-inactive"
                }
                onClick={() => {
                  setActiveTab("All");
                  setCurrentPage(1);
                }}
              >
                All {invoices.length}
              </Button>

              <Button
                className={
                  activeTab === "Paid"
                    ? "status-tab-active"
                    : "status-tab-inactive"
                }
                onClick={() => {
                  setActiveTab("Paid");
                  setCurrentPage(1);
                }}
              >
                Paid
              </Button>

              <Button
                className={
                  activeTab === "Pending"
                    ? "status-tab-active"
                    : "status-tab-inactive"
                }
                onClick={() => {
                  setActiveTab("Pending");
                  setCurrentPage(1);
                }}
              >
                Pending
              </Button>

            </div>
            
            <div className="filter-search">
              <div className="search-wrapper">
                <BsSearch className="search-icon" />

                <input
                  type="text"
                  className="search-input"
                  placeholder="Invoice no. or event..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Button
                variant="outline-secondary"
                className="FilterButton"
                  style={{
                    background: "var(--white)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                    borderRadius: "12px",
                    fontWeight: 600,
                    padding: "10px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                onClick={() => setShowFilter(!showFilter)}
              >
                <LuFilter />
                Filter
              </Button>
            </div>

              {showFilter && (
                              <div className="mb-3 p-3" style={{ border: "1px solid #E5E7EB", borderRadius: "12px", background: "#fff", width: "100%", height: "85px" }}>
                                  <div className="d-flex flex-wrap align-items-center gap-2 gap-md-3 justify-content-start justify-content-lg-end">
                                      {/* Booking ID */}
                                      <div className="filter-capsule-container" style={{ padding: "4px 12px 4px 8px" }}>
                                          <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748B", marginRight: "2px" }}>Booking ID</span>
                                          <Form.Control
                                              type="text"
                                              placeholder="BK-2026-433"
                                              value={bookingIdFilter}
                                              onChange={(e) => setBookingIdFilter(e.target.value)}
                                              className="filter-select-inner"
                                              style={{ border: "none", background: "#ffffff", height: "32px", width: "160px", fontSize: "12px", fontWeight: "400", padding: "4px 8px" }}
                                          />
                                          <span className="filter-clear-btn" onClick={() => setBookingIdFilter("")}>Clear</span>
                                      </div>
              
                                      {/* Issue Date */}
                                      <div className="filter-capsule-container">
                                          <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748B", marginRight: "2px" }}>Issue Date</span>
                                          <Form.Control
                                              className="filter-select-inner filter-select-status"
                                              type="text"
                                              placeholder="May 14, 2026"
                                              value={issueDateFilter}
                                              onChange={(e) => setIssueDateFilter(e.target.value)}
                                              style={{ width: "120px" }}
                                          />
                                          <span className="filter-clear-btn" onClick={() => setIssueDateFilter("all")}>Clear All</span>
                                      </div>
              
                                      {/* Reset */}
                                      <button
                                          className="btn btn-sm btn-outline-secondary"
                                          onClick={() => {
                                            setIssueDateFilter("");
                                            setBookingIdFilter("");
                                           }}
                                          style={{ fontSize: "12px", fontWeight: "600", borderRadius: "8px" }}
                                      >
                                          Reset
                                      </button>
                                  </div>
                              </div>
              )}
              </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : (
            <div className="table-responsive">

              <Table
                hover
                className="custom-table align-middle mb-0"
              >
                <thead>
                  <tr>
                    <th>Invoice No.</th>
                    <th>Event / Booking</th>
                    <th>Issue Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {currentInvoices.map((invoice) => {
                    const badge = getStatusBadge(
                      invoice.status
                    );

                    return (
                      <tr key={invoice.id} className="table-row-hover">
                        <td>
                          <div className="fw-bold">
                            #{invoice.invoiceNo}
                          </div>

                          <div className="text-muted small">
                            {invoice.type}
                          </div>
                        </td>

                        <td>
                          <div className="fw-semibold">
                            {invoice.eventName}
                          </div>

                          <div className="text-muted small">
                            #{invoice.bookingId}
                          </div>
                        </td>

                        <td>
                          {invoice.issueDate}
                        </td>

                        <td>
                          ₹
                          {invoice.amount.toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td>
                          <span
                            className={`badge-status ${badge.class}`}
                          >
                            {badge.label}
                          </span>
                        </td>

                        <td>
                          <Button
                            variant="none"
                            size="lg"
                            onClick={() =>
                              handleDownloadInvoice(
                                invoice
                              )
                            }
                          >
                            <VscKebabVertical/>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}

                </tbody>
              </Table>
            </div>
          )}

          {/* Pagination */}

          <div className="d-flex justify-content-end align-items-center gap-2 mt-4">

            <button
              className="custom-pagination-btn"
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((prev) => prev - 1)
              }
            >
              <BsChevronLeft />
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (
              <button
                key={page}
                className={`custom-pagination-btn ${
                  currentPage === page
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setCurrentPage(page)
                }
              >
                {String(page).padStart(2, "0")}
              </button>
            ))}

            <button
              className="custom-pagination-btn"
              disabled={
                currentPage === totalPages
              }
              onClick={() =>
                setCurrentPage((prev) => prev + 1)
              }
            >
              <BsChevronRight />
            </button>

          </div>

        </Card.Body>
      </Card>

    </div>
  );
}

export default CustomerInvoice;