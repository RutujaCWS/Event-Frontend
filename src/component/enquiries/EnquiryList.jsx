import React, { useState, useEffect } from "react";
import {
  FileText,
  Info,
  Clock,
  CheckSquare,
  CheckCircle2,
  MoreVertical,
  Plus,
  Trash2,
  Edit,
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter
} from "lucide-react";
import { Dropdown } from "react-bootstrap";

const EnquiryList = ({
  enquiries,
  loading,
  handleDelete,
  handleEdit,
  handleViewDetails,
  onNewEnquiryClick
}) => {
  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState("All");
  const [sortBy, setSortBy] = useState("Newest First");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // 👈 5 records per page

  // Derive counts from full enquiries list
  const totalEnquiries = enquiries.length;

  const isNewStatus = (status) => status === "Pending" || status === "New";
  const isInReviewStatus = (status) => status === "Reviewed" || status === "Contacted";
  const isQuotedStatus = (status) => status === "Quoted" || status === "Quotation Sent";
  const isClosedStatus = (status) => status === "Confirmed" || status === "Closed" || status === "Converted";

  const newCount = enquiries.filter((item) => isNewStatus(item.status)).length;
  const inReviewCount = enquiries.filter((item) => isInReviewStatus(item.status)).length;
  const quotedCount = enquiries.filter((item) => isQuotedStatus(item.status)).length;
  const closedCount = enquiries.filter((item) => isClosedStatus(item.status)).length;

  // Filter logic
  const filteredEnquiries = enquiries.filter((item) => {
    const matchesSearch = item.eventType?.toLowerCase().includes(search.toLowerCase());
    let matchesTab = true;
    if (selectedTab === "New") {
      matchesTab = isNewStatus(item.status);
    } else if (selectedTab === "In Review") {
      matchesTab = isInReviewStatus(item.status);
    } else if (selectedTab === "Quoted") {
      matchesTab = isQuotedStatus(item.status);
    } else if (selectedTab === "Closed") {
      matchesTab = isClosedStatus(item.status);
    }
    return matchesSearch && matchesTab;
  });

  // Sort logic
  const sortedEnquiries = [...filteredEnquiries].sort((a, b) => {
    if (sortBy === "Newest First") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === "Oldest First") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    if (sortBy === "Budget: High to Low") {
      return (b.budget || 0) - (a.budget || 0);
    }
    if (sortBy === "Budget: Low to High") {
      return (a.budget || 0) - (b.budget || 0);
    }
    return 0;
  });

  // Reset to page 1 when search, filter, or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedTab, sortBy]);

  // Pagination calculations
  const totalFiltered = sortedEnquiries.length;
  const totalPages = Math.ceil(totalFiltered / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalFiltered);
  const paginatedEnquiries = sortedEnquiries.slice(startIndex, endIndex);

  // --- Page number generation with ellipsis (same as InvoiceGSTManagement) ---
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

  // Format currency helper
  const formatBudget = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Dynamically derive priority based on budget
  const getPriority = (budget) => {
    const amt = budget || 0;
    if (amt >= 300000) return { label: "High", color: "#EF4444" };
    if (amt >= 100000) return { label: "Med", color: "#F59E0B" };
    return { label: "Low", color: "#64748B" };
  };

  // Custom status badge renderer
  const renderStatusBadge = (status) => {
    let label = status;
    let bgColor = "#F1F5F9";
    let textColor = "#64748B";
    let dotColor = "#64748B";

    if (isNewStatus(status)) {
      label = "New";
      bgColor = "#EFF6FF";
      textColor = "#2563EB";
      dotColor = "#2563EB";
    } else if (isInReviewStatus(status)) {
      label = "In Review";
      bgColor = "#FFF7E6";
      textColor = "#D97706";
      dotColor = "#D97706";
    } else if (isQuotedStatus(status)) {
      label = "Quoted";
      bgColor = "#ECFDF5";
      textColor = "#10B981";
      dotColor = "#10B981";
    } else if (isClosedStatus(status)) {
      label = "Closed";
      bgColor = "#F8FAFC";
      textColor = "#475569";
      dotColor = "#475569";
    } else if (status === "Cancelled") {
      label = "Cancelled";
      bgColor = "#FEF2F2";
      textColor = "#EF4444";
      dotColor = "#EF4444";
    }

    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "5px 12px",
          borderRadius: "999px",
          backgroundColor: bgColor,
          color: textColor,
          fontWeight: 500,
          fontSize: "13px"
        }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: dotColor,
            display: "inline-block"
          }}
        />
        {label}
      </span>
    );
  };

  return (
    <div className="container-fluid py-3" style={{ maxWidth: "1280px" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: "#1e293b" }}>My Enquiries</h2>
          <p className="text-muted mb-0">
            Track every enquiry you've raised, its progress, notes from our team, and your quotation.
          </p>
        </div>
        <button
          className="dashboard-btn-primary d-flex align-items-center gap-2"
          onClick={onNewEnquiryClick}
        >
          <Plus size={18} />
          New Enquiry
        </button>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        {/* Card 1: Total */}
        <div className="col">
          <div className="card border shadow-sm rounded-4 h-100" style={{ minWidth: "160px", borderColor: "#E2E8F0" }}>
            <div className="card-body p-3 d-flex flex-column align-items-start">
              <div className="mb-3" style={{ padding: "8px", borderRadius: "10px", backgroundColor: "#F1F5F9", color: "#64748B", display: "inline-flex" }}>
                <FileText size={20} />
              </div>
              <h2 className="fw-bold mb-1" style={{ color: "#0F172A", fontSize: "28px" }}>
                {String(totalEnquiries).padStart(2, "0")}
              </h2>
              <div className="text-uppercase fw-semibold mb-1" style={{ fontSize: "11px", color: "#64748B", letterSpacing: "0.05em" }}>
                Total Enquiries
              </div>
              <div className="small text-muted" style={{ fontSize: "12px" }}>
                All time
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: New */}
        <div className="col">
          <div className="card border shadow-sm rounded-4 h-100" style={{ minWidth: "160px", borderColor: "#E2E8F0" }}>
            <div className="card-body p-3 d-flex flex-column align-items-start">
              <div className="mb-3" style={{ padding: "8px", borderRadius: "10px", backgroundColor: "#E8F0FE", color: "#2563EB", display: "inline-flex" }}>
                <Info size={20} />
              </div>
              <h2 className="fw-bold mb-1" style={{ color: "#0F172A", fontSize: "28px" }}>
                {String(newCount).padStart(2, "0")}
              </h2>
              <div className="text-uppercase fw-semibold mb-1" style={{ fontSize: "11px", color: "#64748B", letterSpacing: "0.05em" }}>
                New
              </div>
              <div className="small fw-semibold" style={{ fontSize: "12px", color: "#2563EB" }}>
                Awaiting review
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: In Review */}
        <div className="col">
          <div className="card border shadow-sm rounded-4 h-100" style={{ minWidth: "160px", borderColor: "#E2E8F0" }}>
            <div className="card-body p-3 d-flex flex-column align-items-start">
              <div className="mb-3" style={{ padding: "8px", borderRadius: "10px", backgroundColor: "#FEF3D7", color: "#D97706", display: "inline-flex" }}>
                <Clock size={20} />
              </div>
              <h2 className="fw-bold mb-1" style={{ color: "#0F172A", fontSize: "28px" }}>
                {String(inReviewCount).padStart(2, "0")}
              </h2>
              <div className="text-uppercase fw-semibold mb-1" style={{ fontSize: "11px", color: "#64748B", letterSpacing: "0.05em" }}>
                In Review
              </div>
              <div className="small fw-semibold" style={{ fontSize: "12px", color: "#D97706" }}>
                Team working on it
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Quoted */}
        <div className="col">
          <div className="card border shadow-sm rounded-4 h-100" style={{ minWidth: "160px", borderColor: "#E2E8F0" }}>
            <div className="card-body p-3 d-flex flex-column align-items-start">
              <div className="mb-3" style={{ padding: "8px", borderRadius: "10px", backgroundColor: "#E6F4EA", color: "#10B981", display: "inline-flex" }}>
                <CheckSquare size={20} />
              </div>
              <h2 className="fw-bold mb-1" style={{ color: "#0F172A", fontSize: "28px" }}>
                {String(quotedCount).padStart(2, "0")}
              </h2>
              <div className="text-uppercase fw-semibold mb-1" style={{ fontSize: "11px", color: "#64748B", letterSpacing: "0.05em" }}>
                Quoted
              </div>
              <div className="small fw-semibold" style={{ fontSize: "12px", color: "#10B981" }}>
                Ready to review
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: Closed */}
        <div className="col">
          <div className="card border shadow-sm rounded-4 h-100" style={{ minWidth: "160px", borderColor: "#E2E8F0" }}>
            <div className="card-body p-3 d-flex flex-column align-items-start">
              <div className="mb-3" style={{ padding: "8px", borderRadius: "10px", backgroundColor: "#F1F5F9", color: "#64748B", display: "inline-flex" }}>
                <CheckCircle2 size={20} />
              </div>
              <h2 className="fw-bold mb-1" style={{ color: "#0F172A", fontSize: "28px" }}>
                {String(closedCount).padStart(2, "0")}
              </h2>
              <div className="text-uppercase fw-semibold mb-1" style={{ fontSize: "11px", color: "#64748B", letterSpacing: "0.05em" }}>
                Closed
              </div>
              <div className="small text-muted" style={{ fontSize: "12px" }}>
                Completed
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Filter & Table Card */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <div className="card-body p-0">
          
          {/* Tabs and Controls Bar */}
          <div className="d-flex flex-wrap align-items-center justify-content-between px-4 py-3 gap-3" style={{ borderBottom: "1px solid #EAECF0" }}>
            {/* Tabs */}
            <div className="d-flex gap-2">
              {[
                { key: "All", count: totalEnquiries },
                { key: "New", count: newCount },
                { key: "In Review", count: inReviewCount },
                { key: "Quoted", count: quotedCount },
                { key: "Closed", count: closedCount }
              ].map((tab) => {
                const isActive = selectedTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedTab(tab.key)}
                    style={{
                      border: isActive ? "1.5px solid #00A884" : "1.5px solid transparent",
                      backgroundColor: "transparent",
                      color: isActive ? "#00A884" : "#64748B",
                      padding: "6px 16px",
                      borderRadius: "30px",
                      fontSize: "14px",
                      fontWeight: 600,
                      transition: "all 0.2s ease"
                    }}
                  >
                    {tab.key}{tab.count > 0 ? ` ${tab.count}` : ""}
                  </button>
                );
              })}
            </div>

            {/* Right Controls */}
            <div className="d-flex gap-3 align-items-center flex-grow-1 flex-md-grow-0 justify-content-end">
              {/* Sort Dropdown */}
              <Dropdown>
                <Dropdown.Toggle 
                  variant="light" 
                  className="d-flex align-items-center gap-2"
                  style={{
                    border: "1px solid #D0D5DD",
                    borderRadius: "8px",
                    background: "#fff",
                    height: "40px",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#344054"
                  }}
                >
                  Sort: {sortBy}
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  {["Newest First", "Oldest First", "Budget: High to Low", "Budget: Low to High"].map((opt) => (
                    <Dropdown.Item key={opt} onClick={() => setSortBy(opt)} active={sortBy === opt}>
                      {opt}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              {/* Filter Placeholder Button */}
              <button
                className="d-flex align-items-center gap-2 btn btn-light"
                style={{
                  border: "1px solid #D0D5DD",
                  borderRadius: "8px",
                  background: "#fff",
                  height: "40px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#344054"
                }}
              >
                <Filter size={16} />
                Filter
              </button>
            </div>
          </div>

          {/* Table Container */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-teal mb-3" role="status" />
              <h5 className="text-muted">Loading enquiries...</h5>
            </div>
          ) : paginatedEnquiries.length === 0 ? (
            <div className="text-center py-5 px-4">
              <FileText size={48} className="text-muted mb-3 opacity-50" />
              <h5 className="fw-semibold">No enquiries found</h5>
              <p className="text-muted small">No enquiries match the current filters or search query.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr style={{ borderBottom: "1px solid #EAECF0" }}>
                    <th className="px-4 py-3 text-muted fw-semibold small" style={{ whiteSpace: "nowrap" }}>Enquiry ID</th>
                    <th className="px-4 py-3 text-muted fw-semibold small" style={{ whiteSpace: "nowrap" }}>Event / Service</th>
                    <th className="px-4 py-3 text-muted fw-semibold small" style={{ whiteSpace: "nowrap" }}>Event Date</th>
                    <th className="px-4 py-3 text-muted fw-semibold small" style={{ whiteSpace: "nowrap" }}>Budget</th>
                    <th className="px-4 py-3 text-muted fw-semibold small" style={{ whiteSpace: "nowrap" }}>Priority</th>
                    <th className="px-4 py-3 text-muted fw-semibold small" style={{ whiteSpace: "nowrap" }}>Status</th>
                    <th className="px-4 py-3 text-end text-muted fw-semibold small" style={{ whiteSpace: "nowrap" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEnquiries.map((item) => {
                    const priority = getPriority(item.budget);
                    const localIdStr = `#ENQ-${item._id?.slice(-4).toUpperCase() || "N/A"}`;
                    return (
                      <tr 
                        key={item._id}
                        onClick={() => handleViewDetails(item._id)}
                        style={{ cursor: "pointer", transition: "all 0.2s" }}
                        className="customer-enquiry-row"
                      >
                        {/* ID */}
                        <td className="px-4 py-3">
                          <span className="fw-semibold text-dark d-block">{localIdStr}</span>
                          <span className="text-muted small d-block text-truncate" style={{ maxWidth: "150px" }}>
                            {item.description || "Premium · catering"}
                          </span>
                        </td>
                        {/* Event / Service */}
                        <td className="px-4 py-3">
                          <span className="fw-semibold text-dark d-block">{item.eventType}</span>
                          <span className="text-muted small d-block">
                            {item.location} · {item.guestCount} guests
                          </span>
                        </td>
                        {/* Date */}
                        <td className="px-4 py-3" style={{ whiteSpace: "nowrap" }}>
                          <span className="text-dark fw-medium">{formatDate(item.eventDate)}</span>
                        </td>
                        {/* Budget */}
                        <td className="px-4 py-3" style={{ whiteSpace: "nowrap" }}>
                          <span className="text-dark fw-semibold">{formatBudget(item.budget)}</span>
                        </td>
                        {/* Priority */}
                        <td className="px-4 py-3">
                          <span style={{ color: priority.color, fontWeight: 600 }}>
                            {priority.label}
                          </span>
                        </td>
                        {/* Status */}
                        <td className="px-4 py-3">
                          {renderStatusBadge(item.status)}
                        </td>
                        {/* Actions Ellipsis */}
                        <td className="px-4 py-3 text-end" onClick={(e) => e.stopPropagation()}>
                          <Dropdown align="end">
                            <Dropdown.Toggle 
                              as="button" 
                              className="btn btn-link p-1 text-muted border-0 shadow-none d-inline-flex action-btn-toggle"
                              style={{ outline: "none" }}
                            >
                              <MoreVertical size={18} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => handleViewDetails(item._id)}>
                                <Eye size={14} className="me-2" /> View Details
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => handleEdit(item)}>
                                <Edit size={14} className="me-2" /> Edit Enquiry
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item onClick={() => handleDelete(item._id)} className="text-danger">
                                <Trash2 size={14} className="me-2" /> Delete
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ===== PAGINATION (exactly like InvoiceGSTManagement) ===== */}
          {totalPages > 1 && (
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-between align-items-center py-3 py-md-4 px-3 px-md-4 bg-white border-top">
              <span className="text-muted" style={{ fontSize: "13px" }}>
                Showing <strong className="text-dark">{startIndex + 1}</strong> to <strong className="text-dark">{endIndex}</strong> of <strong className="text-dark">{totalFiltered}</strong> entries
              </span>
              <div className="d-flex gap-1 align-items-center flex-wrap justify-content-center">
                {/* Previous */}
                <button
                  className="custom-pagination-btn"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  style={{
                    border: "1px solid #E2E8F0",
                    background: "#fff",
                    color: "#64748B",
                    width: "32px",
                    height: "32px",
                    borderRadius: "6px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  <ChevronLeft size={14} />
                </button>

                {/* Page numbers with ellipsis */}
                {getPageNumbers().map((p, idx) =>
                  p === "..." ? (
                    <span key={`dots-${idx}`} className="mx-1 text-muted" style={{ fontSize: "13px" }}>…</span>
                  ) : (
                    <button
                      key={`page-${p}`}
                      className={`custom-pagination-btn ${currentPage === p ? "active" : ""}`}
                      onClick={() => setCurrentPage(p)}
                      style={{
                        border: currentPage === p ? "1px solid #00A884" : "1px solid #E2E8F0",
                        background: currentPage === p ? "#00A884" : "#fff",
                        color: currentPage === p ? "#fff" : "#64748B",
                        width: "32px",
                        height: "32px",
                        borderRadius: "6px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "13px",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                    >
                      {p}
                    </button>
                  )
                )}

                {/* Next */}
                <button
                  className="custom-pagination-btn"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  style={{
                    border: "1px solid #E2E8F0",
                    background: "#fff",
                    color: "#64748B",
                    width: "32px",
                    height: "32px",
                    borderRadius: "6px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Dynamic CSS injecting for hover & selectable rows */}
      <style>{`
        .customer-enquiry-row:hover {
          background-color: #E6F7F4 !important;
        }
        .customer-enquiry-row:active {
          background-color: #D1F2EB !important;
        }
        .text-teal {
          color: #00A884 !important;
        }
        .action-btn-toggle.dropdown-toggle::after {
          display: none !important;
        }

        /* Pagination button hover effects */
        .custom-pagination-btn:hover:not(:disabled) {
          border-color: #00A884 !important;
          background-color: #F0FDFA !important;
        }
        .custom-pagination-btn.active:hover {
          background-color: #00A884 !important;
          border-color: #00A884 !important;
        }
        .custom-pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default EnquiryList;