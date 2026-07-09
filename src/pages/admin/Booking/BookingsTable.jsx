import React, { useState, useEffect, useMemo } from "react";
import { Card, Table, Button, Spinner, Form } from "react-bootstrap";
import { TbFilter, TbDownload } from "react-icons/tb";
import BookingRow from "./BookingRow";
import "../Styles/bookingManagement.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const BookingsTable = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBookingIds, setSelectedBookingIds] = useState([]);
  const itemsPerPage = 5;

  // ---------- Filter States ----------
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // ---------- Filtered Data ----------
  const filteredData = useMemo(() => {
    return data.filter((booking) => {
      if (searchQuery) {
        const term = searchQuery.toLowerCase();
        const customerName = (booking.customerName || "").toLowerCase();
        const bookingId = (booking.bookingId || "").toLowerCase();
        if (!customerName.includes(term) && !bookingId.includes(term)) {
          return false;
        }
      }
      if (eventTypeFilter && booking.eventType !== eventTypeFilter) return false;
      if (statusFilter && booking.status !== statusFilter) return false;
      return true;
    });
  }, [data, searchQuery, eventTypeFilter, statusFilter]);

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setEventTypeFilter("");
    setStatusFilter("");
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedBookingIds([]);
  }, [searchQuery, eventTypeFilter, statusFilter]);

  // ---------- Pagination ----------
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = filteredData.slice(startIndex, endIndex);

  const startRange = filteredData.length ? startIndex + 1 : 0;
  const endRange = Math.min(endIndex, filteredData.length);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  // ---------- Selection Handlers ----------
  const handleSelectAll = () => {
    const allSelected = currentBookings.every((booking) =>
      selectedBookingIds.includes(booking.bookingId)
    );
    if (allSelected) {
      setSelectedBookingIds((prev) =>
        prev.filter(
          (id) => !currentBookings.some((booking) => booking.bookingId === id)
        )
      );
    } else {
      setSelectedBookingIds((prev) => [
        ...new Set([
          ...prev,
          ...currentBookings.map((booking) => booking.bookingId),
        ]),
      ]);
    }
  };

  const handleSelectBooking = (bookingId) => {
    setSelectedBookingIds((prev) =>
      prev.includes(bookingId)
        ? prev.filter((id) => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  // ---------- Export PDF Handler ----------
  const handleExportPDF = () => {
    const doc = new jsPDF("l", "mm", "a4");
    doc.setFontSize(18);
    doc.text("Booking Management Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated On : ${new Date().toLocaleString()}`, 14, 22);

    autoTable(doc, {
      startY: 30,
      head: [
        [
          "Booking ID",
          "Customer",
          "Email",
          "Event Type",
          "Amount",
          "Event Date",
          "Venue",
          "Status",
        ],
      ],
      body: data.map((booking) => [
        booking.bookingId,
        booking.customerId?.name || "-",
        booking.customerId?.email || "-",
        booking.eventType || "-",
        Number(booking.totalAmount || 0).toLocaleString("en-IN"),
        booking.eventDate
          ? new Date(booking.eventDate).toLocaleDateString("en-IN")
          : "-",
        booking.venue || "-",
        booking.status || "-",
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [58, 95, 190],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
    });

    doc.save(`Booking_Report_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  // Get unique event types and statuses for dropdowns
  const eventTypes = [...new Set(data.map((b) => b.eventType).filter(Boolean))];
  const statusOptions = [...new Set(data.map((b) => b.status).filter(Boolean))];

  return (
    <>
      {/* Header with Filter & Export */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
        <div className="d-flex align-items-center gap-3">
          <h2 className="page-title mb-0">All Bookings</h2>
          <span className="booking-count-pill">{data.length} total</span>
        </div>

        <div className="d-flex gap-2 align-self-stretch align-self-md-auto justify-content-md-end">
          <button
            className="btn booking-filter-btn d-flex align-items-center justify-content-center gap-2 flex-grow-1 flex-md-grow-0"
            onClick={() => setShowFilter(!showFilter)}
          >
            <TbFilter size={16} /> Filter
          </button>
          <button
            className="btn booking-export-btn d-flex align-items-center justify-content-center gap-2 flex-grow-1 flex-md-grow-0"
            onClick={handleExportPDF}
          >
            <TbDownload size={16} /> Export
          </button>
        </div>
      </div>

      {/* 🔥 Capsule‑style Filter Bar (toggled) */}
      {showFilter && (
        <div
          className="mb-3 p-3"
          style={{
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            background: "#fff",
          }}
        >
          <div className="d-flex flex-wrap align-items-center gap-2 gap-md-3 justify-content-start justify-content-lg-end">
            {/* Search with label */}
            <div className="filter-capsule-container" style={{ padding: "4px 12px 4px 8px" }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748B", marginRight: "2px" }}>
                Search
              </span>
              <Form.Control
                type="text"
                placeholder="customer or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="filter-select-inner"
                style={{
                  border: "none",
                  background: "#ffffff",
                  height: "32px",
                  width: "140px",
                  fontSize: "12px",
                  fontWeight: "400",
                  padding: "4px 8px",
                }}
              />
              <span className="filter-clear-btn" onClick={() => setSearchQuery("")}>
                Clear
              </span>
            </div>

            {/* Event Type with label */}
            <div className="filter-capsule-container">
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748B", marginRight: "2px" }}>
                Event
              </span>
              <Form.Select
                className="filter-select-inner filter-select-roles"
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
                style={{ width: "110px" }}
              >
                <option value="">All</option>
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Select>
              <span className="filter-clear-btn" onClick={() => setEventTypeFilter("")}>
                Clear All
              </span>
            </div>

            {/* Status with label */}
            <div className="filter-capsule-container">
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748B", marginRight: "2px" }}>
                Status
              </span>
              <Form.Select
                className="filter-select-inner filter-select-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ width: "110px" }}
              >
                <option value="">All</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Form.Select>
              <span className="filter-clear-btn" onClick={() => setStatusFilter("")}>
                Clear All
              </span>
            </div>

            {/* Reset button */}
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={resetFilters}
              style={{ fontSize: "12px", fontWeight: "600", borderRadius: "8px" }}
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Main Table Card */}
      <Card className="border-0 shadow-sm" style={{ borderRadius: "16px", overflow: "hidden" }}>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" style={{ color: "#008075" }} />
            </div>
          ) : (
            <>
              <Table responsive hover className="custom-table mb-0 align-middle" style={{ fontSize: "12px" }}>
                <thead>
                  <tr>
                    <th className="px-4" style={{ width: "50px" }}>
                      <input
                        type="checkbox"
                        style={{ cursor: "pointer" }}
                        checked={
                          currentBookings.length > 0 &&
                          currentBookings.every((booking) =>
                            selectedBookingIds.includes(booking.bookingId)
                          )
                        }
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th style={{ minWidth: "220px", fontSize: "11px" }}>BOOKING ID</th>
                    <th style={{ minWidth: "130px", fontSize: "11px" }}>CUSTOMER</th>
                    <th style={{ minWidth: "110px", fontSize: "11px" }}>EVENT TYPE</th>
                    <th style={{ minWidth: "110px", fontSize: "11px" }}>AMOUNT</th>
                    <th style={{ minWidth: "130px", fontSize: "11px" }}>EVENT DATE</th>
                    <th style={{ minWidth: "110px", fontSize: "11px" }}>VENUE</th>
                    <th style={{ minWidth: "120px", fontSize: "11px" }}>STATUS</th>
                    <th className="text-end px-4" style={{ width: "80px" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBookings.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center py-5 text-muted body-base">
                        No bookings found
                      </td>
                    </tr>
                  ) : (
                    currentBookings.map((row) => (
                      <BookingRow
                        key={row.bookingId}
                        row={row}
                        isSelected={selectedBookingIds.includes(row.bookingId)}
                        onSelect={() => handleSelectBooking(row.bookingId)}
                      />
                    ))
                  )}
                </tbody>
              </Table>

              {/* Pagination footer */}
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-between align-items-center py-3 py-md-4 px-3 px-md-4 bg-white border-top">
                <span className="text-muted body-small">
                  Showing {startRange}-{endRange} of {filteredData.length} bookings
                </span>

                <div className="d-flex gap-1 align-items-center flex-wrap justify-content-center">
                  <button
                    className="custom-pagination-btn"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    {"<"}
                  </button>

                  {getPageNumbers().map((p, index) =>
                    p === "..." ? (
                      <span key={`dots-${index}`} className="mx-1 text-muted body-small">
                        ...
                      </span>
                    ) : (
                      <button
                        key={`page-${p}`}
                        className={`custom-pagination-btn ${currentPage === p ? "active" : ""}`}
                        onClick={() => setCurrentPage(p)}
                      >
                        {p}
                      </button>
                    )
                  )}

                  <button
                    className="custom-pagination-btn"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    {">"}
                  </button>
                </div>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default BookingsTable;