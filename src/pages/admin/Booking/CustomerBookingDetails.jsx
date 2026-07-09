import React, { useEffect, useState } from "react";
import { Card, Row, Col, Badge, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { bookingData } from "../../../services/bookingData";
import { TbCalendarEvent,TbCheck,TbClockHour4 ,TbCreditCard ,TbUsers } from "react-icons/tb";
import { ProgressBar } from "react-bootstrap";


const CustomerBookingDetails = () => {
    const { id } = useParams();

const [booking, setBooking] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchBooking();
}, []);

const fetchBooking = async () => {
  try {
    setLoading(true);

    const response = await bookingData.getBookingById(id);
console.log("Booking =>", response.data);
console.log("Assigned Staff =>", response.data.assignedStaff);
    

    setBooking(response.data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

if (loading) {
  return <h3>Loading...</h3>;
}
const totalAmount = booking?.totalAmount || 0;
const advancePaid = booking?.advancePaid || 0;
const balanceAmount = booking?.balanceAmount || 0;

const paidPercentage =
  totalAmount > 0
    ? Math.round((advancePaid / totalAmount) * 100)
    : 0;

const paymentStatusText = {
  ADVANCE_PENDING: "Advance Pending",
  ADVANCE_COMPLETED: "Advance Paid",
  PARTIAL: "Partial Paid",
  FULL_PAID: "Fully Paid",
  REFUNDED: "Refunded",
};

const advancePercent =
  totalAmount > 0
    ? Math.round((booking.advanceAmount / totalAmount) * 100)
    : 0;

const balancePercent = 100 - advancePercent;
if (!booking) {
  return <h3>No Booking Found</h3>;
}
const paymentStatusMap = {
  ADVANCE_PENDING: {
    text: "Advance Pending",
    bg: "#FFF4DB",
    color: "#F59E0B",
  },
  ADVANCE_COMPLETED: {
    text: "Advance Paid",
    bg: "#E8FFF6",
    color: "#10B981",
  },
  PARTIAL: {
    text: "Partial Paid",
    bg: "#FFF4DB",
    color: "#F59E0B",
  },
  FULL_PAID: {
    text: "Fully Paid",
    bg: "#E8FFF6",
    color: "#10B981",
  },
  REFUNDED: {
    text: "Refunded",
    bg: "#FFE7E7",
    color: "#EF4444",
  },
};

const currentPayment =
  paymentStatusMap[booking.paymentStatus] ||
  paymentStatusMap.ADVANCE_PENDING;
return (
<div className="container-fluid px-0 py-3" >

  <Card
    className="border-0 shadow-sm"
    style={{
      borderRadius: "20px",
      background: "#DFF7F4",
    }}
  >
    <Card.Body className="p-3">

      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-4">

        {/* Left */}
        <div className="d-flex align-items-center gap-3">

          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "18px",
              background: "#0F9D8A",
              color: "#fff",
              fontSize: "24px",
              fontWeight: "700",
            }}
          >
            {booking.customerId?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>

          <div>

            <h4
              className="mb-1 "
              style={{ color: "#111827",fontWeight: "600" }}
            >
              {booking.customerId?.name}
            </h4>

            <div
              style={{
                fontSize: "14px",
                color: "#6B7280",
              }}
            >
              {booking.eventType} •{" "}
              {new Date(
                booking.eventDate
              ).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
              {" • "}
              {booking.venue}
            </div>

          </div>

        </div>

        {/* Right */}

        <div className="text-lg-end">

          <h5
            className="fw-semibold mb-1"
            style={{ color: "#111827" }}
          >
            #{booking.bookingId}
          </h5>

          <div
            style={{
              fontSize: "14px",
              color: "#6B7280",
            }}
          >
            Booked :{" "}
            {new Date(
              booking.createdAt
            ).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>

          <Badge
            pill
            bg=""
            className="mt-3"
            style={{
              background: "#E7F8EF",
              color: "#16A34A",
              padding: "8px 16px",
              fontWeight: 500,
              fontSize: "13px",
            }}
          >
            ● {booking.status}
          </Badge>

        </div>

      </div>

    </Card.Body>
  </Card>
<Row className="g-4 mt-2">
     <Col lg={8}>
<Card
  className="border-0 shadow-sm  "
  style={{
    borderRadius: "22px",
    padding: "2px",
  }}
>
  <Card.Body className="p-4">

    {/* Header */}
    <div className="d-flex align-items-center mb-2">
      <TbCalendarEvent
        size={24}
        color="#0F9D8A"
        className="me-2"
      />

      <h4
        className="mb-0 "
        style={{ fontSize: "20px" }}
      >
        Event Details
      </h4>
    </div>

    {/* Row 1 */}

    <Row className="g-0">

      <Col md={4} className="pe-md-4">
        <small
          style={{
            color: "#6B7280",
            fontSize: "12px",
            fontWeight: 500,
          }}
        >
          EVENT CATEGORY
        </small>

        <h5 className="mt-2 "
         style={{ fontSize: "18px" }}>
            
          {booking.eventType}
        </h5>
      </Col>

      <Col
        md={4}
        className="px-md-4"
        style={{
          borderLeft: "1px solid #E5E7EB",
        }}
      >
        <small
          style={{
            color: "#6B7280",
            fontSize: "12px",
            fontWeight: 500,
          }}
        >
          EVENT DATE
        </small>

        <h5 className="mt-2"
         style={{ fontSize: "18px" }}>
          {new Date(
            booking.eventDate
          ).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </h5>
      </Col>

      <Col
        md={4}
        className="ps-md-4"
        style={{
          borderLeft: "1px solid #E5E7EB",
        }}
      >
        <small
          style={{
            color: "#6B7280",
            fontSize: "12px",
            fontWeight: 500,
          }}
        >
          GUEST COUNT
        </small>

        <h5 className="mt-2 "
         style={{ fontSize: "18px" }}>
          {booking.leadId?.guestCount} Attendees
        </h5>
      </Col>

    </Row>

    {/* Gap */}

    <div style={{ height: "10px" }} />

    {/* Row 2 */}

    <Row className="g-0">

      <Col md={4} className="pe-md-4">
        <small
          style={{
            color: "#6B7280",
            fontSize: "12px",
            fontWeight: 500,
          }}
        >
          VENUE
        </small>

        <h5 className="mt-2 "
         style={{ fontSize: "18px" }}>
          {booking.venue}
        </h5>
      </Col>

      <Col
        md={4}
        className="px-md-4"
        style={{
          borderLeft: "1px solid #E5E7EB",
        }}
      >
        <small
          style={{
            color: "#6B7280",
            fontSize: "12px",
            fontWeight: 500,
          }}
        >
          EMAIL ADDRESS
        </small>

        <h6 className="mt-2">
          {booking.customerId?.email}
        </h6>
      </Col>

      <Col
        md={4}
        className="ps-md-4"
        style={{
          borderLeft: "1px solid #E5E7EB",
        }}
      >
        <small
          style={{
            color: "#6B7280",
            fontSize: "12px",
            fontWeight: 500,
          }}
        >
          PHONE NUMBER
        </small>

        <h6 className="mt-2">
          +91 {booking.customerId?.mobile}
        </h6>
      </Col>

    </Row>

    <div style={{ height: "15px" }} />

    <small
      style={{
        color: "#6B7280",
        fontSize: "12px",
        fontWeight: 500,
      }}
    >
      BOOKING NOTES
    </small>

    <div
      className="mt-2"
      style={{
        border: "1px solid #E5E7EB",
        borderRadius: "18px",
        background: "#FAFAFA",
        padding: "12px",
        color: "#4B5563",
      }}
    >
      {booking.notes || "No booking notes available."}
    </div>

  </Card.Body>
</Card>

  <Card
    className="border-0 shadow-sm mt-4"
    style={{
      borderRadius: "22px",
    }}
  >
      <Card.Body className="p-4">
<div className="d-flex justify-content-between align-items-center mb-4">

  <div className="d-flex align-items-center gap-2">
    <TbCreditCard size={22} color="#0F9D8A" />
    <h4 className="mb-0" style={{ fontSize: "20px", fontWeight: 500 }}>
      Payment Status
    </h4>
  </div>

  <Badge
    pill
    bg=""
    style={{
      background: "#FFF4DB",
      color: "#F59E0B",
      padding: "8px 16px",
      fontWeight: 500,
    }}
  >
    Partial Paid
  </Badge>

</div>
<Row className="mb-4">

  <Col md={4}>
    <small className="text-muted" style={{ fontSize: "12px" }}>TOTAL AMOUNT</small>

    <h2 className="mt-2 fw-semibold"style={{ fontSize: "22px" }}>
      ₹{booking.totalAmount?.toLocaleString("en-IN")}
    </h2>
  </Col>

  <Col md={4}>
    <small className="text-muted" style={{ fontSize: "12px" }}>PAID</small>

    <h2
      className="mt-2 fw-semibold"
      style={{ color: "#10B981",fontSize: "22px" }}
    >
      ₹{advancePaid?.toLocaleString("en-IN")}
    </h2>
  </Col>

  <Col md={4}>
    <small className="text-muted"style={{ fontSize: "12px" }}>
      BALANCE DUE
    </small>

    <h2
      className="mt-2 fw-bold"
      style={{ color: "#EF4444",fontSize: "22px" }}
    >
      ₹
      {(
        balanceAmount
      ).toLocaleString("en-IN")}
    </h2>
  </Col>

</Row>
<ProgressBar
 now={paidPercentage}
  style={{
    height: "8px",
    borderRadius: "20px",
    marginBottom: "8px",
  }}
  variant="success"
/>

<div className="d-flex justify-content-between mb-3">

<small className="text-muted">
  {paidPercentage}% Paid
</small>

<small className="text-muted">
  {100 - paidPercentage}% Remaining
</small>

</div>
<Card
  className="border-1 mb-3"
  style={{
    border: "2px solid #E5E7EB",
    borderRadius: "18px",
    boxShadow: "none",
  }}
>
  <Card.Body
    className="d-flex justify-content-between align-items-center"
    style={{ padding: "8px 12px" }}
  >
    {/* Left */}
    <div className="d-flex align-items-center">

      <div
        className="d-flex align-items-center justify-content-center me-3"
        style={{
          width: "46px",
          height: "46px",
          borderRadius: "14px",
          background: "#DFF7F0",
        }}
      >
        <TbCheck
          size={22}
          color="#10B981"
        />
      </div>

      <div>
        <h5
          className="mb-1"
          style={{
            fontSize: "15px",
            fontWeight: 600,
          }}
        >
        Advance ({advancePercent}%)
        </h5>

        <small
          style={{
            color: "#6B7280",
            fontSize: "12px",
          }}
        >
      Paid on{" "}
{booking.advancePaymentDate
  ? new Date(booking.advancePaymentDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  : "-"}
        </small>
      </div>

    </div>

    {/* Right */}

    <div className="text-end">

      <h5
        className="mb-2"
        style={{
          fontWeight: 500,
        }}
      >
      ₹{advancePaid.toLocaleString("en-IN")}
      </h5>

     <Badge
  pill
  bg=""
  style={{
    background: currentPayment.bg,
    color: currentPayment.color,
    padding: "8px 16px",
    fontWeight: 500,
  }}
>
  {currentPayment.text}
</Badge>

    </div>

  </Card.Body>
</Card>
<Card
  className="border-1"
  style={{
    border: "1px solid #E5E7EB",
    borderRadius: "18px",
    boxShadow: "none",
  }}
>
  <Card.Body
    className="d-flex justify-content-between align-items-center"
    style={{ padding: "8px 12px" }}
  >
    {/* Left */}

    <div className="d-flex align-items-center">

      <div
        className="d-flex align-items-center justify-content-center me-3"
        style={{
          width: "46px",
          height: "46px",
          borderRadius: "14px",
          background: "#FFF6E5",
        }}
      >
        <TbClockHour4
          size={20}
          color="#F59E0B"
        />
      </div>

      <div>

        <h5
          className="mb-1"
          style={{
            fontSize: "15px",
            fontWeight: 600,
          }}
        >
         Balance ({balancePercent}%)
        </h5>

        <small
          style={{
            color: "#6B7280",
            fontSize: "12px",
          }}
        >
          Due before{" "}
          {new Date(
            booking.eventDate
          ).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </small>

      </div>

    </div>

    {/* Right */}

    <div className="text-end">

      <h5
        className="mb-2"
        style={{
          fontWeight: 500,
        }}
      >
     ₹{balanceAmount.toLocaleString("en-IN")}
      </h5>

      <Badge
        pill
        bg=""
        style={{
          background: "#FFF4DB",
          color: "#F59E0B",
          padding: "6px 14px",
          fontWeight: 500,
        }}
      >
        Pending
      </Badge>

    </div>

  </Card.Body>

</Card>
<Button
  disabled={
   balanceAmount <= 0
  }
  className="w-100 mt-3 d-flex align-items-center justify-content-center gap-2"
  style={{
    background:
      booking.totalAmount === booking.advanceAmount
        ? "#9CA3AF"
        : "#0F9D8A",
    border: "none",
    height: "50px",
    borderRadius: "14px",
    fontSize: "18px",
    fontWeight: "600",
  }}
>
  <TbCreditCard size={22} />
  {booking.totalAmount === booking.advanceAmount
    ? "Payment Completed"
    : `Pay Balance ₹${balanceAmount.toLocaleString("en-IN")}`}
</Button>
</Card.Body>
  </Card>
  
</Col>
  <Col lg={4}>
<Card
  className="border-0 shadow-sm  "
  style={{
    borderRadius: "22px",
  }}
>
  <Card.Body className="p-4">

    {/* Header */}
    <div className="d-flex justify-content-between align-items-center mb-4">

      <h5
        className="mb-0 fw-semibold"
        style={{ fontSize: "22px" }}
      >
        Event Status
      </h5>

      <Badge
        pill
        bg=""
        style={{
          background: "#E8FFF6",
          color: "#10B981",
          padding: "6px 14px",
          fontWeight: 500,
        }}
      >
        {booking.status}
      </Badge>

    </div>

    {/* First Row */}

    <div className="d-flex gap-2 flex-wrap mb-2">

      <Button
        size="sm"
        variant="light"
        style={{
          border: "1px solid #E5E7EB",
          borderRadius: "10px",
        }}
      >
        Enquiry
      </Button>

      <Button
        size="sm"
        variant="light"
        style={{
          border: "1px solid #E5E7EB",
          borderRadius: "10px",
        }}
      >
        Quotation
      </Button>

      <Button
        size="sm"
        style={{
          background: "#0F9D8A",
          border: "none",
          borderRadius: "10px",
        }}
      >
        Confirmed
      </Button>

    </div>

    {/* Second Row */}

    <div className="d-flex gap-2 flex-wrap mb-4">

      <Button
        size="sm"
        variant="light"
        style={{
          border: "1px solid #E5E7EB",
          borderRadius: "10px",
        }}
      >
        Setup
      </Button>

      <Button
        size="sm"
        variant="light"
        style={{
          border: "1px solid #E5E7EB",
          borderRadius: "10px",
        }}
      >
        Live
      </Button>

      <Button
        size="sm"
        variant="light"
        style={{
          border: "1px solid #E5E7EB",
          borderRadius: "10px",
        }}
      >
        Done
      </Button>

    </div>

    {/* Progress */}

    <div className="d-flex justify-content-between mb-2">

      <span
        style={{
          fontSize: "14px",
          color: "#6B7280",
        }}
      >
        Progress
      </span>

      <span
        style={{
          fontWeight: 600,
        }}
      >
        40%
      </span>

    </div>

    <div
      className="progress mb-4"
      style={{
        height: "8px",
        borderRadius: "20px",
      }}
    >
      <div
        className="progress-bar"
        style={{
          width: "40%",
          background: "#0F9D8A",
        }}
      />
    </div>

    {/* Timeline */}

    <div className="mb-3">

      <h6 className="mb-1">
        Booking Confirmed
      </h6>

      <small className="text-muted">
        Mar 15 • Advance Paid
      </small>

    </div>

    <div className="mb-3">

      <h6 className="mb-1">
        Quotation Accepted
      </h6>

      <small className="text-muted">
        Mar 12 • QT-2026-088
      </small>

    </div>

    <div>

      <h6 className="mb-1">
        Enquiry Received
      </h6>

      <small className="text-muted">
        Mar 10 • WhatsApp
      </small>

    </div>

  </Card.Body>
</Card>
<Card
  className="border-0 shadow-sm  mt-4"
  style={{
    borderRadius: "22px",
  }}
>
  <Card.Body className="p-4">

    {/* Header */}
    <div className="d-flex align-items-center gap-2 mb-4">
      <TbUsers size={24} color="#0F9D8A" />
      <h4
        className="mb-0"
        style={{
          fontSize: "20px",
          fontWeight: 600,
        }}
      >
        Assigned Staff
      </h4>
    </div>

    {/* Staff 1 */}
    <div className="d-flex justify-content-between align-items-center mb-4">

      <div className="d-flex align-items-center">

        <div
          className="d-flex align-items-center justify-content-center me-3"
          style={{
            width: "54px",
            height: "54px",
            borderRadius: "16px",
            background: "#10B981",
            color: "#fff",
            fontWeight: 600,
            fontSize: "18px",
          }}
        >
          RK
        </div>

        <div>
          <h6 className="mb-1 fw-semibold">
            Raj Kumar
          </h6>

          <small className="text-muted">
            Event Lead
          </small>
        </div>

      </div>

      <Badge
        pill
        bg=""
        style={{
          background: "#E8FFF6",
          color: "#10B981",
          padding: "8px 14px",
          fontWeight: 500,
        }}
      >
        Lead
      </Badge>

    </div>

    {/* Staff 2 */}

    <div className="d-flex justify-content-between align-items-center mb-4">

      <div className="d-flex align-items-center">

        <div
          className="d-flex align-items-center justify-content-center me-3"
          style={{
            width: "54px",
            height: "54px",
            borderRadius: "16px",
            background: "#EF4444",
            color: "#fff",
            fontWeight: 600,
            fontSize: "18px",
          }}
        >
          VJ
        </div>

        <div>
          <h6 className="mb-1 fw-semibold">
            Vijay Joshi
          </h6>

          <small className="text-muted">
            Decorator
          </small>
        </div>

      </div>

      <Badge
        pill
        bg=""
        style={{
          background: "#FFE7E7",
          color: "#EF4444",
          padding: "8px 14px",
          fontWeight: 500,
        }}
      >
        Decor
      </Badge>

    </div>

    {/* Staff 3 */}

    <div className="d-flex justify-content-between align-items-center">

      <div className="d-flex align-items-center">

        <div
          className="d-flex align-items-center justify-content-center me-3"
          style={{
            width: "54px",
            height: "54px",
            borderRadius: "16px",
            background: "#F59E0B",
            color: "#fff",
            fontWeight: 600,
            fontSize: "18px",
          }}
        >
          PM
        </div>

        <div>
          <h6 className="mb-1 fw-semibold">
            Priya Mehta
          </h6>

          <small className="text-muted">
            Events Manager
          </small>
        </div>

      </div>

      <Badge
        pill
        bg=""
        style={{
          background: "#FFF4DB",
          color: "#F59E0B",
          padding: "8px 14px",
          fontWeight: 500,
        }}
      >
        Manager
      </Badge>

    </div>

  </Card.Body>
</Card>



 
 
  
    
  </Col>

</Row>
</div>
);
};

export default CustomerBookingDetails;