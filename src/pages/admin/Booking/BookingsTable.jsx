import { Card, Table, Button, Spinner,} from "react-bootstrap";
import { FiFilter } from "react-icons/fi";
import { FiUpload } from "react-icons/fi";
 import { TbFilter, TbDownload } from "react-icons/tb";
import BookingRow from "./BookingRow";
import "../Styles/bookingManagement.css";
import React, { useState, useEffect } from "react";

const BookingsTable = ({ data }) => {
const [loading, setLoading] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
const [selectedBookingIds, setSelectedBookingIds] = useState([]);
const itemsPerPage = 4; // matches Figma

const totalPages = Math.ceil(data.length / itemsPerPage);

const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;

const currentBookings = data.slice(startIndex, endIndex);

const startRange = data.length ? startIndex + 1 : 0;
const endRange = Math.min(endIndex, data.length);

const getPageNumbers = () => {
  const pages = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);
  }

  return pages;
};

const handleSelectAll = () => {
  const allSelected = currentBookings.every((booking) =>
    selectedBookingIds.includes(booking.bookingId)
  );

  if (allSelected) {
    setSelectedBookingIds((prev) =>
      prev.filter(
        (id) =>
          !currentBookings.some(
            (booking) => booking.bookingId === id
          )
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

// Toggle selection of a single booking
const handleSelectBooking = (bookingId) => {
  setSelectedBookingIds((prev) =>
    prev.includes(bookingId)
      ? prev.filter((id) => id !== bookingId) // uncheck
      : [...prev, bookingId] // check
  );
};




return (
    <>
    

<div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">

  {/* Left Side */}
  <div className="d-flex align-items-center gap-3">

    <h2 className="page-title mb-0">
      All Bookings
    </h2>

    <span className="booking-count-pill">
      214 total
    </span>

  </div>

  {/* Right Side */}
  <div className="d-flex gap-2 align-self-stretch align-self-md-auto justify-content-md-end">

    <button className="btn booking-filter-btn d-flex align-items-center justify-content-center gap-2 flex-grow-1 flex-md-grow-0">

      <TbFilter size={16} />
      Filter

    </button>

    <button className="btn booking-export-btn d-flex align-items-center justify-content-center gap-2 flex-grow-1 flex-md-grow-0">

      <TbDownload size={16} />
      Export

    </button>

  </div>

</div>

        {/* Main Grid List Table */}
    <Card className="border-0 shadow-sm" style={{ borderRadius: "16px", overflow: "hidden" }}>
         <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" style={{ color: "#008075" }} />
            </div>
          ) : (
            <>
              <Table responsive hover className="custom-table mb-0 align-middle" style={{ fontSize: "12px" }}
>
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
                    <th style={{ minWidth: "220px",fontSize: "11px" }}>BOOKING ID</th>
                    <th style={{ minWidth: "130px",fontSize: "11px"}}>CUSTOMER</th>
                    <th style={{ minWidth: "110px",fontSize: "11px" }}>EVENT TYPE</th>
                    <th style={{ minWidth: "110px",fontSize: "11px" }}>AMOUNT</th>
                    <th style={{ minWidth: "130px",fontSize: "11px" }}>EVENT DATE</th>
                    <th style={{ minWidth: "110px",fontSize: "11px" }}>VENUE</th>
                    <th style={{ minWidth: "120px",fontSize: "11px" }}>STATUS</th>
                    <th className="text-end px-4" style={{ width: "80px" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center py-5 text-muted body-base">No bookings found</td>
                    </tr>
                  ) :   (
                    currentBookings.map((row) => (
                    <BookingRow
                      key={row.bookingId}
                      row={row}
                      isSelected={selectedBookingIds.includes(row.bookingId)}
                      onSelect={() => handleSelectBooking(row.bookingId)}
                    />
                  )
                 ))}
                </tbody>
              </Table>

              {/* Pagination footer */}
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-between align-items-center py-3 py-md-4 px-3 px-md-4 bg-white border-top">
                <span className="text-muted body-small">
                  Showing {startRange}-{endRange} of {data.length} bookings
                </span>

                <div className="d-flex gap-1 align-items-center flex-wrap justify-content-center">
                  <button
                    className="custom-pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    {"<"}
                  </button>

                  {getPageNumbers().map((p, index) => (
                    p === "..." ? (
                      <span key={`dots-${index}`} className="mx-1 text-muted body-small">...</span>
                    ) : (
                      <button
                        key={`page-${p}`}
                        className={`custom-pagination-btn ${currentPage === p ? "active" : ""}`}
                        onClick={() => setCurrentPage(p)}
                      >
                        {p}
                      </button>
                    )
                  ))}

                  <button
                    className="custom-pagination-btn"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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