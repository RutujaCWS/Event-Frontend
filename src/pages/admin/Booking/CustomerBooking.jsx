import React, { useState, useEffect } from 'react';
import { Table, Dropdown, Modal, Button, Row, Col, Badge,Card,Form,InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { bookingData } from "../../../services/bookingData";

import { BsThreeDotsVertical, BsSearch } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";
const CustomerBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
const [activeTab, setActiveTab] = useState("All");
const [currentPage, setCurrentPage] = useState(1);
const rowsPerPage = 5;
const [showFilter, setShowFilter] = useState(false);
const navigate = useNavigate();
const [eventTypeFilter, setEventTypeFilter] = useState("");
const [statusFilter, setStatusFilter] = useState("");
const [eventDateFilter, setEventDateFilter] = useState("");
  useEffect(() => {
    fetchCustomerBookings();
  }, []);

  const fetchCustomerBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingData.getCustomerBookings();
       console.log(response.data[0].quotationId);
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
const tabs = [
  "All",
  "Confirmed",
  "In Progress",
  "Upcoming",
  "Completed",
];




const getPageNumbers = () => {
  const pages = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      pages.push(1, 2, 3, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(
        1,
        "...",
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      pages.push(
        1,
        "...",
        currentPage,
        "...",
        totalPages
      );
    }
  }

  return pages;
};const getStatusStyle = (status) => {
  switch (status) {
    case "Confirmed":
      return {
        background: "#E8FFF6",
        color: "#10B981",
        border: "1px solid #10B981",
      };

    case "In Progress":
      return {
        background: "#EAF2FF",
        color: "#2563EB",
        border: "1px solid #2563EB",
      };

    case "Upcoming":
      return {
        background: "#F3F4F6",
        color: "#6B7280",
        border: "1px solid #D1D5DB",
      };

    case "Pending":
    case "PENDING_PAYMENT":
      return {
        background: "#FFF8E6",
        color: "#F59E0B",
        border: "1px solid #FCD34D",
      };

    case "Completed":
      return {
        background: "#E8FFF6",
        color: "#10B981",
        border: "1px solid #10B981",
      };

    default:
      return {
        background: "#F3F4F6",
        color: "#6B7280",
        border: "1px solid #E5E7EB",
      };
  }
};
const filteredBookings = bookings.filter((booking) => {
  const matchesTab =
    activeTab === "All" || booking.status === activeTab;

  const matchesEventType =
    !eventTypeFilter || booking.eventType === eventTypeFilter;

  const matchesStatus =
    !statusFilter || booking.status === statusFilter;

  const matchesDate =
    !eventDateFilter ||
    new Date(booking.eventDate).toISOString().slice(0, 10) === eventDateFilter;

  return (
    matchesTab &&
    matchesEventType &&
    matchesStatus &&
    matchesDate
  );
});
    const indexOfLastRow = currentPage * rowsPerPage;
const indexOfFirstRow = indexOfLastRow - rowsPerPage;

const currentBookings = filteredBookings.slice(
  indexOfFirstRow,
  indexOfLastRow
);

const totalPages = Math.ceil(
  filteredBookings.length / rowsPerPage
);
  return (
   <div style={{ marginBottom: "25px" }}>
  <h2
    style={{
      fontWeight: "600",
      color: "#111827",
      marginBottom: "6px",
      fontSize:"30px"
    }}
  >
    My Bookings
  </h2>

  <p
    style={{
      color: "#6B7280",
      fontSize: "14px",
      margin: 0,
    }}
  >
    Track your confirmed events, assigned team, status and payments — all in one place.
  </p>

  <Row className="g-4 mb-4 mt-1">
  {bookings.slice(0, 3).map((booking, index) => (
   <Col xl={4} lg={4} md={6} xs={12} key={booking._id}>
    <Card
  onClick={() => setSelectedCard(booking._id)}
  className="h-100 shadow-sm"
  style={{
    cursor: "pointer",
    borderRadius: "20px",
    border:
      selectedCard === booking._id
        ? "2px solid #0D9488"
        : "1px solid #E5E7EB",
    transition: "0.2s ease",
  }}
>
        <Card.Body
          className="d-flex flex-column justify-content-between"
          style={{ padding: "20px" }}
        >
          <div>
            <h5 className="fw-semibold mb-2"
             style={{ fontSize: "16px" }}>
              {booking.bookingId}
            </h5>

            <p
              className="text-muted mb-2"
              style={{ fontSize: "14px" }}
            >
              {booking.eventType} •{" "}
              {new Date(booking.eventDate).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>

            <h1
              className="fw-semibold mb-2"
              style={{
                fontSize: "28px",
                lineHeight: "1",
                color: "#111827",
              }}
            >
              ₹{booking.totalAmount?.toLocaleString("en-IN")}
            </h1>
          </div>

       <div className="d-flex flex-wrap gap-2 mt-2">

           <Badge
  pill
  className="text-nowrap"
  bg=""
  style={{
    background: "#E8FFF6",
    color: "#10B981",
    padding: "8px 16px",
    fontWeight: "500",
    fontSize: "12px",
  }}
>
  ● {booking.status}
</Badge>

         <Badge
  pill
  className="text-nowrap"
  bg=""
  style={{
    background:
      booking.advanceAmount >= booking.totalAmount
        ? "#E8FFF6"
        : "#FFF4DB",
    color:
      booking.advanceAmount >= booking.totalAmount
        ? "#10B981"
        : "#F59E0B",
    padding: "8px 16px",
    fontWeight: "500",
    fontSize: "14px",
  }}
>
  ● {booking.advanceAmount >= booking.totalAmount ? "Paid" : "Partial Paid"}
</Badge>

          </div>
        </Card.Body>
      </Card>
    </Col>
  ))}
</Row>
<div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">

  {/* Tabs */}
  <div
    className="d-inline-flex rounded-4 overflow-auto"
    style={{
      background: "#EAEEF4",
      padding: "4px",
      width: "fit-content",
      maxWidth: "100%",
      whiteSpace: "nowrap",
    }}
  >
    {tabs.map((tab) => (
      <div
        key={tab}
        onClick={() => {
          setActiveTab(tab);
          setCurrentPage(1);
        }}
        className="flex-shrink-0"
        style={{
          padding: "8px 16px",
          borderRadius: "12px",
          cursor: "pointer",
          fontWeight: 500,
          fontSize: "14px",
          background: activeTab === tab ? "#fff" : "transparent",
          color: activeTab === tab ? "#0D9488" : "#667085",
          border:
            activeTab === tab
              ? "1px solid #0D9488"
              : "1px solid transparent",
        }}
      >
        {tab === "All" ? `All ${bookings.length}` : tab}
      </div>
    ))}
  </div>

  {/* Filter Button */}
  <Button
    variant="outline-secondary"
    className="align-self-end align-self-md-auto"
    onClick={() => setShowFilter(!showFilter)}
  >
    <FiFilter className="me-2" />
    Filter
  </Button>

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
          <div className="d-flex flex-wrap align-items-center gap-2 gap-md-3 justify-content-start justify-content-lg-end">
            {/* Event Type */}
            <div className="filter-capsule-container" style={{ padding: "4px 12px 4px 8px" }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748B", marginRight: "2px" }}>
                Event Type
              </span>
              <Form.Select
                value={eventTypeFilter}
                onChange={(e) => setEventTypeFilter(e.target.value)}
                className="filter-select-inner"
                style={{ width: "130px" }}
              >
                <option value="">All</option>
                <option>Wedding</option>
                <option>Birthday</option>
                <option>Exhibition</option>
                <option>Corporate</option>
              </Form.Select>

              <span className="filter-clear-btn" onClick={() => setEventTypeFilter("")}>
                Clear
              </span>
            </div>

            {/* Event Date */}
            <div className="filter-capsule-container">
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748B", marginRight: "2px" }}>
                Event Date
              </span>
              <Form.Control
                type="date"
                value={eventDateFilter}
                onChange={(e) => setEventDateFilter(e.target.value)}
                className="filter-select-inner"
                style={{ width: "130px" }}
              />
              <span className="filter-clear-btn" onClick={() => setEventDateFilter("")}>
                Clear All
              </span>
            </div>

            {/* Status */}
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
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Form.Select>
              <span className="filter-clear-btn" onClick={() => setStatusFilter("")}>
                Clear All
              </span>
            </div>

            {/* Reset button */}
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => {
                setEventTypeFilter("");
                setEventDateFilter("");
                setStatusFilter("");
              }}
              style={{ fontSize: "12px", fontWeight: "600", borderRadius: "8px" }}
            >
              Reset
            </button>
          </div>
        </div>
      )}
<Card className="border-0 shadow-sm rounded-4">
  <Card.Body className="p-4">

    <div className="d-flex justify-content-between align-items-center mb-4">

     


    </div>

   <div className="table-responsive">
  <Table  className="align-middle mb-0 text-nowrap"
>
    <thead>
      <tr style={{ color: "#6B7280", fontSize: "14px" }}>
        <th className="border-0  py-2">Booking ID</th>
        <th className="border-0  py-2">Event Type</th>
        <th className="border-0  py-3">Event Date</th>
        <th className="border-0 fw-semibold py-3">Venue</th>
        <th className="border-0 fw-semibold py-3">Amount</th>
        <th className="border-0 fw-semibold py-3">Status</th>
        <th className="border-0 fw-semibold py-3 text-center">Action</th>
      </tr>
    </thead>

    <tbody>
     {currentBookings.map((booking, index) => (
        
 <tr
  key={booking._id}
  onMouseEnter={(e) => {
    [...e.currentTarget.children].forEach((td) => {
      td.style.background = "#E6FAF8";
    });
  }}
  onMouseLeave={(e) => {
    [...e.currentTarget.children].forEach((td) => {
      td.style.background = "#fff";
    });
  }}
>
          <td className="py-2 border-">
            <div className="fw-semibold"
             style={{ fontSize: "15px" }}>
              {booking.bookingId}
            </div>

           <small className="text-muted"
            style={{ fontSize: "12px" }}>
            {booking.quotationId?.quotationNumber || "-"}
          </small>
          </td>

          <td className="py-3 border-"
           style={{ fontSize: "16px" }}>
            {booking.eventType}
          </td>

          <td className="py-3 border-"
           style={{ fontSize: "16px" }}>
            {new Date(
              booking.eventDate
            ).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </td>

          <td className="py-3 border-"
           style={{ fontSize: "15px" }}>
            {booking.venue || "-"}
          </td>

          <td className="py-3 border- fw-semibold"
           style={{ fontSize: "15px" }}>
            ₹{booking.totalAmount?.toLocaleString("en-IN")}
          </td>

          <td className="py-3 border-">
        <Badge
  pill
  bg=""
  style={{
    ...getStatusStyle(booking.status),
    padding: "6px 16px",
    fontSize: "14px",
    fontWeight: "500",
  }}
>
   {booking.status.replaceAll("_", " ")}
</Badge>
          </td>

          <td className="text-center border-"
           style={{ fontSize: "14px" }}>
            <Dropdown>
              <Dropdown.Toggle
                variant="light"
                className="border-0 bg-white shadow-none"
              >
                <BsThreeDotsVertical />
              </Dropdown.Toggle>

              <Dropdown.Menu>
              <Dropdown.Item
  onClick={() => navigate(`/customer/bookings/${booking._id}`)}
>
  View
</Dropdown.Item>

                <Dropdown.Item>Edit</Dropdown.Item>

                <Dropdown.Divider />

                <Dropdown.Item className="text-danger">
                  Cancel
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3">

  <small className="text-muted">
Showing {indexOfFirstRow + 1} -{" "}
{Math.min(indexOfLastRow, filteredBookings.length)} of{" "}
    {filteredBookings.length} bookings
  </small>

  <nav className="d-flex align-items-center gap-2 flex-wrap">

    <button
      className="btn btn-light border"
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(currentPage - 1)}
    >
      &lt;
    </button>

    {getPageNumbers().map((p, index) =>
      p === "..." ? (
        <span key={index} className="mx-1 text-muted">
          ...
        </span>
      ) : (
        <button
          key={p}
          onClick={() => setCurrentPage(p)}
          className="btn"
          style={{
            width: "32px",
            height: "32px",
            padding: 0,
            background: currentPage === p ? "#0F9D8A" : "#fff",
            color: currentPage === p ? "#fff" : "#374151",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
          }}
        >
          {p}
        </button>
      )
    )}

    <button
      className="btn btn-light border"
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage(currentPage + 1)}
    >
      &gt;
    </button>

  </nav>

</div>
</div>

  </Card.Body>
</Card>
</div>


  );
};

export default CustomerBooking;