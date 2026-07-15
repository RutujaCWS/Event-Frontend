import React, { useEffect, useState } from "react";
import { Card, Row, Col, Badge, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { bookingData } from "../../../services/bookingData";
import { paymentService } from "../../../services/paymentService";
import { TbCalendarEvent, TbCheck, TbClockHour4, TbCreditCard, TbUsers } from "react-icons/tb";
import { ProgressBar } from "react-bootstrap";
import { toast } from "react-toastify";

const CustomerBookingDetails = () => {
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    fetchBooking();
    loadRazorpayScript();
  }, [id]);

  const loadRazorpayScript = () => {
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  };

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await bookingData.getBookingById(id);
      console.log("Booking =>", response.data);
      setBooking(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch booking details");
    } finally {
      setLoading(false);
    }
  };

  // Helper Functions
  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getStaffColor = (index) => {
    const colors = ["#10B981", "#EF4444", "#F59E0B", "#3B82F6", "#8B5CF6", "#EC4899"];
    return colors[index % colors.length];
  };

  const getStatusBadgeColor = (status) => {
    const statusMap = {
      'CONFIRMED': { bg: "#E8FFF6", color: "#10B981" },
      'CANCELLED': { bg: "#FFE7E7", color: "#EF4444" },
      'PENDING_PAYMENT': { bg: "#FFF4DB", color: "#F59E0B" },
      'COMPLETED': { bg: "#E8FFF6", color: "#10B981" },
      'REFUNDED': { bg: "#FFE7E7", color: "#EF4444" },
      'IN_PROGRESS': { bg: "#E0F2FE", color: "#3B82F6" },
    };
    return statusMap[status] || { bg: "#F3F4F6", color: "#6B7280" };
  };

  const isPaymentDisabled = () => {
    if (processingPayment) return true;
    if (booking?.status === "CANCELLED" || booking?.status === "REFUNDED") return true;
    if (booking?.paymentStatus === "FULL_PAID") return true;
    if (booking?.status === "COMPLETED") return true;
    return false;
  };

  const getPaymentButtonText = () => {
    if (processingPayment) return "Processing...";
    if (!booking) return "Loading...";
    if (booking.status === "CANCELLED" || booking.status === "REFUNDED") return "Booking Cancelled";
    if (booking.paymentStatus === "FULL_PAID") return "Payment Completed";
    
    const totalPaid = (booking.advancePaid || 0) + (booking.balancePaid || 0);
    const remainingTotal = booking.totalAmount - totalPaid;
    if (remainingTotal <= 0) return "Payment Completed";
    
    const remainingAdvance = (booking.advanceAmount || 0) - (booking.advancePaid || 0);
    if (remainingAdvance > 0 && (booking.paymentStatus === "ADVANCE_PENDING" || booking.paymentStatus === "PARTIAL")) {
      return `Pay Advance ₹${remainingAdvance.toLocaleString("en-IN")}`;
    }
    
    const remainingBalance = (booking.balanceAmount || 0) - (booking.balancePaid || 0);
    if (remainingBalance > 0) {
      return `Pay Balance ₹${remainingBalance.toLocaleString("en-IN")}`;
    }
    
    return `Pay ₹${remainingTotal.toLocaleString("en-IN")}`;
  };

  const getPaymentType = () => {
    if (!booking) return null;
    if (booking.paymentStatus === "FULL_PAID") return null;
    if (booking.status === "CANCELLED" || booking.status === "REFUNDED") return null;
    
    const totalPaid = (booking.advancePaid || 0) + (booking.balancePaid || 0);
    const remainingTotal = booking.totalAmount - totalPaid;
    if (remainingTotal <= 0) return null;
    
    const remainingAdvance = (booking.advanceAmount || 0) - (booking.advancePaid || 0);
    if (remainingAdvance > 0 && (booking.paymentStatus === "ADVANCE_PENDING" || booking.paymentStatus === "PARTIAL")) {
      return "ADVANCE";
    }
    
    const remainingBalance = (booking.balanceAmount || 0) - (booking.balancePaid || 0);
    if (remainingBalance > 0) {
      return "BALANCE";
    }
    
    return "FULL";
  };

  const handlePayment = async (paymentType) => {
    try {
      setProcessingPayment(true);
      
      // Create online payment order
      const orderResponse = await paymentService.createOnlinePaymentOrder(id, paymentType);
      
      if (orderResponse.success) {
        const { orderId, amount, keyId, bookingId, customerName, customerEmail, customerMobile, paymentType: type } = orderResponse.data;
        
        // Initialize Razorpay payment
        const razorpayOptions = {
          key: keyId,
          amount: amount * 100,
          currency: 'INR',
          name: 'Event Management',
          description: `${type} Payment`,
          order_id: orderId,
          prefill: {
            name: customerName,
            email: customerEmail,
            contact: customerMobile
          },
          theme: { color: '#0F9D8A' },
          handler: async function(response) {
            try {
              // Verify payment
              const verifyResult = await paymentService.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: bookingId,
                paymentType: type
              });
              
              if (verifyResult.success) {
                toast.success("Payment successful!");
                fetchBooking(); // Refresh data
              } else {
                toast.error("Payment verification failed!");
              }
            } catch (error) {
              console.error("Payment verification error:", error);
              toast.error(error.message || "Payment verification failed!");
            } finally {
              setProcessingPayment(false);
            }
          },
          modal: {
            ondismiss: function() {
              toast.info("Payment cancelled");
              setProcessingPayment(false);
            }
          }
        };

        const razorpay = new window.Razorpay(razorpayOptions);
        razorpay.open();
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.message || "Payment failed. Please try again.");
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-5">
        <h3>No Booking Found</h3>
        <p className="text-muted">The booking you're looking for doesn't exist.</p>
      </div>
    );
  }

  // Calculate payment values
  const totalAmount = booking.totalAmount || 0;
  const advancePaid = booking.advancePaid || 0;
  const balancePaid = booking.balancePaid || 0;
  const totalPaid = advancePaid + balancePaid;
  const balanceAmount = booking.balanceAmount || 0;
  const remainingBalance = balanceAmount - balancePaid;
  const advanceAmount = booking.advanceAmount || 0;
  const remainingAdvance = advanceAmount - advancePaid;

  const paidPercentage = totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0;
  const advancePercent = totalAmount > 0 ? Math.round((advanceAmount / totalAmount) * 100) : 0;
  const balancePercent = 100 - advancePercent;

  // Payment status mapping
  const paymentStatusMap = {
    ADVANCE_PENDING: { text: "Advance Pending", bg: "#FFF4DB", color: "#F59E0B" },
    ADVANCE_COMPLETED: { text: "Advance Paid", bg: "#E8FFF6", color: "#10B981" },
    PARTIAL: { text: "Partial Paid", bg: "#FFF4DB", color: "#F59E0B" },
    FULL_PAID: { text: "Fully Paid", bg: "#E8FFF6", color: "#10B981" },
    REFUNDED: { text: "Refunded", bg: "#FFE7E7", color: "#EF4444" },
  };

  const currentPayment = paymentStatusMap[booking.paymentStatus] || paymentStatusMap.ADVANCE_PENDING;
  const statusBadge = getStatusBadgeColor(booking.status);

  return (
    <div className="container-fluid px-0 py-3">
      {/* Header Card */}
      <Card
        className="border-0 shadow-sm"
        style={{
          borderRadius: "20px",
          background: "#DFF7F4",
        }}
      >
        <Card.Body className="p-3">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-4">
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
                {getInitials(booking.customerId?.name)}
              </div>
              <div>
                <h4 className="mb-1" style={{ color: "#111827", fontWeight: "600" }}>
                  {booking.customerId?.name}
                </h4>
                <div style={{ fontSize: "14px", color: "#6B7280" }}>
                  {booking.eventType} •{" "}
                  {new Date(booking.eventDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                  {" • "}
                  {booking.venue}
                </div>
              </div>
            </div>
            <div className="text-lg-end">
              <h5 className="fw-semibold mb-1" style={{ color: "#111827" }}>
                #{booking.bookingId}
              </h5>
              <div style={{ fontSize: "14px", color: "#6B7280" }}>
                Booked:{" "}
                {new Date(booking.createdAt).toLocaleDateString("en-IN", {
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
                  background: statusBadge.bg,
                  color: statusBadge.color,
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
          {/* Event Details Card */}
          <Card className="border-0 shadow-sm" style={{ borderRadius: "22px", padding: "2px" }}>
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-2">
                <TbCalendarEvent size={24} color="#0F9D8A" className="me-2" />
                <h4 className="mb-0" style={{ fontSize: "20px" }}>Event Details</h4>
              </div>

              <Row className="g-0">
                <Col md={4} className="pe-md-4">
                  <small style={{ color: "#6B7280", fontSize: "12px", fontWeight: 500 }}>EVENT CATEGORY</small>
                  <h5 className="mt-2" style={{ fontSize: "18px" }}>{booking.eventType}</h5>
                </Col>
                <Col md={4} className="px-md-4" style={{ borderLeft: "1px solid #E5E7EB" }}>
                  <small style={{ color: "#6B7280", fontSize: "12px", fontWeight: 500 }}>EVENT DATE</small>
                  <h5 className="mt-2" style={{ fontSize: "18px" }}>
                    {new Date(booking.eventDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </h5>
                </Col>
                <Col md={4} className="ps-md-4" style={{ borderLeft: "1px solid #E5E7EB" }}>
                  <small style={{ color: "#6B7280", fontSize: "12px", fontWeight: 500 }}>GUEST COUNT</small>
                  <h5 className="mt-2" style={{ fontSize: "18px" }}>
                    {booking.leadId?.guestCount || 0} Attendees
                  </h5>
                </Col>
              </Row>

              <div style={{ height: "10px" }} />

              <Row className="g-0">
                <Col md={4} className="pe-md-4">
                  <small style={{ color: "#6B7280", fontSize: "12px", fontWeight: 500 }}>VENUE</small>
                  <h5 className="mt-2" style={{ fontSize: "18px" }}>{booking.venue}</h5>
                </Col>
                <Col md={4} className="px-md-4" style={{ borderLeft: "1px solid #E5E7EB" }}>
                  <small style={{ color: "#6B7280", fontSize: "12px", fontWeight: 500 }}>EMAIL ADDRESS</small>
                  <h6 className="mt-2">{booking.customerId?.email || "N/A"}</h6>
                </Col>
                <Col md={4} className="ps-md-4" style={{ borderLeft: "1px solid #E5E7EB" }}>
                  <small style={{ color: "#6B7280", fontSize: "12px", fontWeight: 500 }}>PHONE NUMBER</small>
                  <h6 className="mt-2">{booking.customerId?.mobile ? `+91 ${booking.customerId.mobile}` : "N/A"}</h6>
                </Col>
              </Row>

              <div style={{ height: "15px" }} />

              <small style={{ color: "#6B7280", fontSize: "12px", fontWeight: 500 }}>BOOKING NOTES</small>
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

          {/* Payment Status Card */}
          <Card className="border-0 shadow-sm mt-4" style={{ borderRadius: "22px" }}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-2">
                  <TbCreditCard size={22} color="#0F9D8A" />
                  <h4 className="mb-0" style={{ fontSize: "20px", fontWeight: 500 }}>Payment Status</h4>
                </div>
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

              <Row className="mb-4">
                <Col md={4}>
                  <small className="text-muted" style={{ fontSize: "12px" }}>TOTAL AMOUNT</small>
                  <h2 className="mt-2 fw-semibold" style={{ fontSize: "22px" }}>
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </h2>
                </Col>
                <Col md={4}>
                  <small className="text-muted" style={{ fontSize: "12px" }}>PAID</small>
                  <h2 className="mt-2 fw-semibold" style={{ color: "#10B981", fontSize: "22px" }}>
                    ₹{totalPaid.toLocaleString("en-IN")}
                  </h2>
                </Col>
                <Col md={4}>
                  <small className="text-muted" style={{ fontSize: "12px" }}>BALANCE DUE</small>
                  <h2 className="mt-2 fw-bold" style={{ color: "#EF4444", fontSize: "22px" }}>
                    ₹{(totalAmount - totalPaid).toLocaleString("en-IN")}
                  </h2>
                </Col>
              </Row>

              <ProgressBar
                now={paidPercentage}
                style={{ height: "8px", borderRadius: "20px", marginBottom: "8px" }}
                variant="success"
              />

              <div className="d-flex justify-content-between mb-3">
                <small className="text-muted">{paidPercentage}% Paid</small>
                <small className="text-muted">{100 - paidPercentage}% Remaining</small>
              </div>

              {/* Advance Payment Card */}
              <Card className="border-1 mb-3" style={{ border: "2px solid #E5E7EB", borderRadius: "18px", boxShadow: "none" }}>
                <Card.Body className="d-flex justify-content-between align-items-center" style={{ padding: "8px 12px" }}>
                  <div className="d-flex align-items-center">
                    <div
                      className="d-flex align-items-center justify-content-center me-3"
                      style={{ width: "46px", height: "46px", borderRadius: "14px", background: "#DFF7F0" }}
                    >
                      <TbCheck size={22} color="#10B981" />
                    </div>
                    <div>
                      <h5 className="mb-1" style={{ fontSize: "15px", fontWeight: 600 }}>
                        Advance ({advancePercent}%)
                      </h5>
                      <small style={{ color: "#6B7280", fontSize: "12px" }}>
                        {advancePaid > 0 ? `Paid on ${booking.advancePaymentDate ? new Date(booking.advancePaymentDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }) : "N/A"}` : `Due: ₹${remainingAdvance.toLocaleString("en-IN")}`}
                      </small>
                    </div>
                  </div>
                  <div className="text-end">
                    <h5 className="mb-2" style={{ fontWeight: 500 }}>₹{advancePaid.toLocaleString("en-IN")}</h5>
                    <Badge
                      pill
                      bg=""
                      style={{
                        background: advancePaid >= advanceAmount ? "#E8FFF6" : "#FFF4DB",
                        color: advancePaid >= advanceAmount ? "#10B981" : "#F59E0B",
                        padding: "8px 16px",
                        fontWeight: 500,
                      }}
                    >
                      {advancePaid >= advanceAmount ? "Completed" : `${Math.round((advancePaid / advanceAmount) * 100)}% Paid`}
                    </Badge>
                  </div>
                </Card.Body>
              </Card>

              {/* Balance Payment Card */}
              <Card className="border-1" style={{ border: "1px solid #E5E7EB", borderRadius: "18px", boxShadow: "none" }}>
                <Card.Body className="d-flex justify-content-between align-items-center" style={{ padding: "8px 12px" }}>
                  <div className="d-flex align-items-center">
                    <div
                      className="d-flex align-items-center justify-content-center me-3"
                      style={{ width: "46px", height: "46px", borderRadius: "14px", background: "#FFF6E5" }}
                    >
                      <TbClockHour4 size={20} color="#F59E0B" />
                    </div>
                    <div>
                      <h5 className="mb-1" style={{ fontSize: "15px", fontWeight: 600 }}>
                        Balance ({balancePercent}%)
                      </h5>
                      <small style={{ color: "#6B7280", fontSize: "12px" }}>
                        {remainingBalance > 0 ? `Due before ${new Date(booking.eventDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}` : "Fully paid"}
                      </small>
                    </div>
                  </div>
                  <div className="text-end">
                    <h5 className="mb-2" style={{ fontWeight: 500 }}>₹{remainingBalance.toLocaleString("en-IN")}</h5>
                    <Badge
                      pill
                      bg=""
                      style={{
                        background: remainingBalance <= 0 ? "#E8FFF6" : "#FFF4DB",
                        color: remainingBalance <= 0 ? "#10B981" : "#F59E0B",
                        padding: "6px 14px",
                        fontWeight: 500,
                      }}
                    >
                      {remainingBalance <= 0 ? "Completed" : "Pending"}
                    </Badge>
                  </div>
                </Card.Body>
              </Card>

              {/* Payment Button */}
              {!isPaymentDisabled() && (
                <Button
                  onClick={() => {
                    const paymentType = getPaymentType();
                    if (paymentType) {
                      handlePayment(paymentType);
                    }
                  }}
                  className="w-100 mt-3 d-flex align-items-center justify-content-center gap-2"
                  style={{
                    background: "#0F9D8A",
                    border: "none",
                    height: "50px",
                    borderRadius: "14px",
                    fontSize: "18px",
                    fontWeight: "600",
                  }}
                >
                  <TbCreditCard size={22} />
                  {getPaymentButtonText()}
                </Button>
              )}

              {booking.paymentStatus === "FULL_PAID" && (
                <Button
                  disabled
                  className="w-100 mt-3 d-flex align-items-center justify-content-center gap-2"
                  style={{
                    background: "#9CA3AF",
                    border: "none",
                    height: "50px",
                    borderRadius: "14px",
                    fontSize: "18px",
                    fontWeight: "600",
                  }}
                >
                  <TbCreditCard size={22} />
                  Payment Completed
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          {/* Event Status Card */}
          <Card className="border-0 shadow-sm" style={{ borderRadius: "22px" }}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0 fw-semibold" style={{ fontSize: "22px" }}>Event Status</h5>
                <Badge
                  pill
                  bg=""
                  style={{
                    background: statusBadge.bg,
                    color: statusBadge.color,
                    padding: "6px 14px",
                    fontWeight: 500,
                  }}
                >
                  {booking.status}
                </Badge>
              </div>

              <div className="d-flex gap-2 flex-wrap mb-2">
                {["ENQUIRY", "QUOTATION", "CONFIRMED"].map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={booking.status === status ? "primary" : "light"}
                    style={{
                      background: booking.status === status ? "#0F9D8A" : undefined,
                      border: booking.status === status ? "none" : "1px solid #E5E7EB",
                      borderRadius: "10px",
                      color: booking.status === status ? "#fff" : undefined,
                    }}
                  >
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </Button>
                ))}
              </div>

              <div className="d-flex gap-2 flex-wrap mb-4">
                {["SETUP", "LIVE", "DONE"].map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant="light"
                    style={{
                      border: "1px solid #E5E7EB",
                      borderRadius: "10px",
                      opacity: booking.status === "COMPLETED" && status === "DONE" ? 1 : 0.5,
                    }}
                  >
                    {status}
                  </Button>
                ))}
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span style={{ fontSize: "14px", color: "#6B7280" }}>Progress</span>
                <span style={{ fontWeight: 600 }}>
                  {booking.status === "COMPLETED" ? "100%" : 
                   booking.status === "CONFIRMED" ? "60%" : 
                   booking.status === "CANCELLED" ? "0%" : "20%"}
                </span>
              </div>

              <div className="progress mb-4" style={{ height: "8px", borderRadius: "20px" }}>
                <div
                  className="progress-bar"
                  style={{
                    width: booking.status === "COMPLETED" ? "100%" : 
                           booking.status === "CONFIRMED" ? "60%" : 
                           booking.status === "CANCELLED" ? "0%" : "20%",
                    background: "#0F9D8A",
                  }}
                />
              </div>

              <div className="mb-3">
                <h6 className="mb-1">Booking {booking.status === "CANCELLED" ? "Cancelled" : "Confirmed"}</h6>
                <small className="text-muted">
                  {booking.confirmationDate ? new Date(booking.confirmationDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  }) : "Pending"}
                </small>
              </div>

              <div className="mb-3">
                <h6 className="mb-1">Payment Status</h6>
                <small className="text-muted">{currentPayment.text}</small>
              </div>

              <div>
                <h6 className="mb-1">Event Date</h6>
                <small className="text-muted">
                  {new Date(booking.eventDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })}
                </small>
              </div>
            </Card.Body>
          </Card>

          {/* Assigned Staff Card */}
          <Card className="border-0 shadow-sm mt-4" style={{ borderRadius: "22px" }}>
            <Card.Body className="p-4">
              <div className="d-flex align-items-center gap-2 mb-4">
                <TbUsers size={24} color="#0F9D8A" />
                <h4 className="mb-0" style={{ fontSize: "20px", fontWeight: 600 }}>
                  Assigned Staff ({booking.assignedStaff?.length || 0})
                </h4>
              </div>

              {booking.assignedStaff && booking.assignedStaff.length > 0 ? (
                booking.assignedStaff.map((staff, index) => (
                  <div key={staff._id} className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center">
                      <div
                        className="d-flex align-items-center justify-content-center me-3"
                        style={{
                          width: "54px",
                          height: "54px",
                          borderRadius: "16px",
                          background: getStaffColor(index),
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: "18px",
                        }}
                      >
                        {getInitials(staff.name)}
                      </div>
                      <div>
                        <h6 className="mb-1 fw-semibold">{staff.name}</h6>
                        <small className="text-muted">{staff.role || "Staff"}</small>
                      </div>
                    </div>
                    <Badge
                      pill
                      bg=""
                      style={{
                        background: getStaffColor(index) + "20",
                        color: getStaffColor(index),
                        padding: "8px 14px",
                        fontWeight: 500,
                      }}
                    >
                      {staff.role || "Staff"}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-3 text-muted">
                  <p>No staff assigned yet</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CustomerBookingDetails;