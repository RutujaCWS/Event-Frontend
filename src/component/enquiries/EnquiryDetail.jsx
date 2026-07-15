import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Check,
  Lock,
  Download,
  MessageSquare,
  AlertCircle,
  DollarSign,
  FileText,
  Clock,
  Sparkles, CheckSquare

} from "lucide-react";
import { approveQuotation, rejectQuotation } from "../../services/quotationService";
import { ArrowDown } from "lucide-react";

const EnquiryDetail = ({
  enquiryId,
  enquiries,
  quotations,
  onBack,
  onRefresh
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const enquiry = enquiries.find((e) => e._id === enquiryId);

  if (!enquiry) {
    return (
      <div className="container-fluid py-5 text-center">
        <AlertCircle className="text-danger mb-2" size={40} />
        <h5>Enquiry not found</h5>
      </div>
    );
  }

  // Find quotation linked to this enquiry
  const quotation = quotations.find(
    (q) => q.leadId?._id === enquiryId || q.leadId === enquiryId
  );

  // Helpers
  const getInitials = (name) => {
    if (!name) return "EV";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getRole = (name) => {
    if (!name) return "Events Specialist";
    const lower = name.toLowerCase();
    if (lower.includes("priya") || lower.includes("mehta")) return "Events Manager";
    if (lower.includes("rahul") || lower.includes("verma")) return "Coordination Desk";
    return "Events Coordinator";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "Pending";
    const date = new Date(dateStr);
    const datePart = date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
    const timePart = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${datePart} - ${timePart}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Accept/Reject handlers
  const handleAccept = async () => {
    if (!quotation) return;
    const confirmApprove = window.confirm(
      "Are you sure you want to accept this quotation and confirm booking?"
    );
    if (!confirmApprove) return;

    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const response = await approveQuotation(quotation._id);
      if (response.data.success) {
        setSuccessMsg("Quotation accepted successfully! Your booking has been created.");
        setTimeout(() => {
          onRefresh();
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Failed to approve quotation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!quotation) return;
    if (!rejectionReason.trim()) {
      alert("Please enter a reason for requesting changes.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const response = await rejectQuotation(quotation._id, { reason: rejectionReason });
      if (response.data.success) {
        setSuccessMsg("Changes requested successfully.");
        setShowRejectForm(false);
        setRejectionReason("");
        setTimeout(() => {
          onRefresh();
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Status flags for timeline
  const isAssigned = enquiry.assignedTo || enquiry.assignedAt;
  const isReviewed = enquiry.status !== "New" && enquiry.status !== "Pending";
  const isQuoted = quotation || enquiry.status === "Quoted" || enquiry.status === "Quotation Sent";
  const isConfirmed =
    quotation?.status === "APPROVED" ||
    enquiry.status === "Confirmed" ||
    enquiry.status === "Converted";

  return (
    <div className="container-fluid py-3" style={{ maxWidth: "1280px" }}>
      {/* Breadcrumb Header */}
      <div className="mb-4">
        <button
          onClick={onBack}
          style={{
            border: "none",
            background: "none",
            color: "#64748b",
            fontSize: "14px",
            fontWeight: 500,
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: 0
          }}
          className="hover-back"
        >
          <ArrowLeft size={16} />
          Back to Enquiries
        </button>
        <div className="d-flex justify-content-between align-items-center mt-2">
          {/* <h2 className="fw-bold mb-0" style={{ color: "#1e293b" }}>
            Enquiry Details
          </h2> */}
          {/* <span className="text-muted small">
            ID: #ENQ-{enquiry._id.slice(-4).toUpperCase()}
          </span> */}
        </div>
      </div>

      {errorMsg && <div className="alert alert-danger mb-4 rounded-3">{errorMsg}</div>}
      {successMsg && <div className="alert alert-success mb-4 rounded-3">{successMsg}</div>}

      <div className="row g-4">
        {/* Left Column: Status Timeline */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0" style={{ color: "#1e293b" }}>
                Status Timeline
              </h5>
              <span
                style={{
                  backgroundColor: "#E2FDF5",
                  color: "#00A884",
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: "20px"
                }}
              >
                #ENQ-{enquiry._id.slice(-4).toUpperCase()}
              </span>
            </div>

            <div className="position-relative ps-4" style={{ borderLeft: "2px solid #E2E8F0" }}>
              {/* Step 1: Submitted */}
              <div className="position-relative mb-4">
                <div
                  className="position-absolute d-flex align-items-center justify-content-center"
                  style={{
                    left: "-37px",
                    top: "0px",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: "#10B981",
                    color: "#fff"
                  }}
                >
                  <Check size={14} strokeWidth={3} />
                </div>
                <div>
                  <h6 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
                    Enquiry Submitted
                  </h6>
                  <p className="text-muted small mb-1">
                    Your enquiry for {enquiry.eventType} was received.
                  </p>
                  <span className="text-muted small" style={{ fontSize: "11px" }}>
                    {formatDateTime(enquiry.createdAt)}
                  </span>
                </div>
              </div>

              {/* Step 2: Assigned */}
              <div className="position-relative mb-4">
                <div
                  className="position-absolute d-flex align-items-center justify-content-center"
                  style={{
                    left: "-37px",
                    top: "0px",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: isAssigned ? "#10B981" : "#E2E8F0",
                    color: "#fff"
                  }}
                >
                  {isAssigned ? (
                    <Check size={14} strokeWidth={3} />
                  ) : (
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "#CBD5E1"
                      }}
                    />
                  )}
                </div>
                <div>
                  <h6
                    className="fw-bold mb-1"
                    style={{ color: isAssigned ? "#1e293b" : "#94A3B8" }}
                  >
                    Assigned to Team
                  </h6>
                  <p className="text-muted small mb-1">
                    {isAssigned
                      ? `${enquiry.assignedTo?.name || "Our Events Team"} is handling your enquiry.`
                      : "Awaiting team member assignment."}
                  </p>
                  <span className="text-muted small" style={{ fontSize: "11px" }}>
                    {isAssigned
                      ? formatDateTime(enquiry.assignedAt || enquiry.createdAt)
                      : "Pending"}
                  </span>
                </div>
              </div>

              {/* Step 3: Reviewed */}
              <div className="position-relative mb-4">
                <div
                  className="position-absolute d-flex align-items-center justify-content-center"
                  style={{
                    left: "-37px",
                    top: "0px",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: isReviewed ? "#10B981" : "#E2E8F0",
                    color: "#fff"
                  }}
                >
                  {isReviewed ? (
                    <Check size={14} strokeWidth={3} />
                  ) : (
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "#CBD5E1"
                      }}
                    />
                  )}
                </div>
                <div>
                  <h6
                    className="fw-bold mb-1"
                    style={{ color: isReviewed ? "#1e293b" : "#94A3B8" }}
                  >
                    Requirements Reviewed
                  </h6>
                  <p className="text-muted small mb-1">
                    Venue, guest count and catering preferences reviewed and confirmed.
                  </p>
                  <span className="text-muted small" style={{ fontSize: "11px" }}>
                    {isReviewed ? formatDateTime(enquiry.updatedAt) : "Pending"}
                  </span>
                </div>
              </div>

              {/* Step 4: Quotation Sent */}
              <div className="position-relative mb-4">
                <div
                  className="position-absolute d-flex align-items-center justify-content-center"
                  style={{
                    left: "-37px",
                    top: "0px",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: isQuoted ? "#10B981" : "#E2E8F0",
                    color: "#fff"
                  }}
                >
                  {isQuoted ? (
                    <Check size={14} strokeWidth={3} />
                  ) : (
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "#CBD5E1"
                      }}
                    />
                  )}
                </div>
                <div>
                  <h6
                    className="fw-bold mb-1"
                    style={{ color: isQuoted ? "#1e293b" : "#94A3B8" }}
                  >
                    Quotation Sent
                  </h6>
                  <p className="text-muted small mb-1">
                    A detailed quotation is ready for your review.
                  </p>
                  <span className="text-muted small" style={{ fontSize: "11px" }}>
                    {isQuoted
                      ? formatDateTime(quotation?.createdAt || enquiry.updatedAt)
                      : "Pending"}
                  </span>
                </div>
              </div>

              {/* Step 5: Confirmed */}
              <div className="position-relative">
                <div
                  className="position-absolute d-flex align-items-center justify-content-center"
                  style={{
                    left: "-37px",
                    top: "0px",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: isConfirmed ? "#10B981" : "#E2E8F0",
                    color: "#fff"
                  }}
                >
                  {isConfirmed ? (
                    <Check size={14} strokeWidth={3} />
                  ) : (
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "#CBD5E1"
                      }}
                    />
                  )}
                </div>
                <div>
                  <h6
                    className="fw-bold mb-1"
                    style={{ color: isConfirmed ? "#1e293b" : "#94A3B8" }}
                  >
                    Awaiting Your Confirmation
                  </h6>
                  <p className="text-muted small mb-1">
                    {isConfirmed
                      ? "Booking confirmed and booked successfully!"
                      : "Accept the quotation below to confirm your booking."}
                  </p>
                  <span className="text-muted small" style={{ fontSize: "11px" }}>
                    {isConfirmed ? formatDateTime(quotation?.approvedAt) : "Pending"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Follow-up Notes */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0" style={{ color: "#1e293b" }}>
                Follow-up Notes
              </h5>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  backgroundColor: "#F1F5F9",
                  color: "#64748B",
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "4px",
                  letterSpacing: "0.05em"
                }}
              >
                <Lock size={12} />
                READ-ONLY
              </span>
            </div>

            <div className="d-flex flex-column gap-3 overflow-auto" style={{ maxHeight: "350px" }}>
              {enquiry.followUpNotes && enquiry.followUpNotes.length > 0 ? (
                enquiry.followUpNotes.map((note, index) => {
                  const initials = getInitials(note.createdBy);
                  const role = getRole(note.createdBy);
                  const colors = ["#00A884", "#F59E0B", "#2563EB", "#7C3AED", "#EF4444"];
                  const colorIndex = initials.charCodeAt(0) % colors.length;
                  const avatarBg = colors[colorIndex];

                  return (
                    <div
                      key={index}
                      className="p-3 rounded-4"
                      style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}
                    >
                      <div className="d-flex align-items-center gap-3 mb-2">
                        <div
                          style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "50%",
                            backgroundColor: avatarBg,
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: "13px"
                          }}
                          className="d-flex align-items-center justify-content-center"
                        >
                          {initials}
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="fw-bold mb-0 text-dark small">
                            {note.createdBy || "Team Member"}
                          </h6>
                          <span className="text-muted small" style={{ fontSize: "11px" }}>
                            {role}
                          </span>
                        </div>
                        <span className="text-muted small" style={{ fontSize: "11px" }}>
                          {formatDate(note.createdAt)}
                        </span>
                      </div>
                      <p className="mb-0 text-muted small" style={{ lineHeight: "1.5", fontSize: "13px" }}>
                        {note.note}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-5 text-muted">
                  <MessageSquare size={36} className="mb-2 opacity-30" />
                  <p className="small mb-0">No follow-up notes from the team yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* BOTTOM ROW: VIEW QUOTATION – ALL PRICES BOLD                 */}
      {/* ============================================================ */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            {quotation ? (
              <>
              
<div className="d-flex justify-content-between align-items-start mb-3">
  <div>
    <div className="d-flex align-items-center">
      <CheckSquare size={22} className="me-2" style={{ color: "#00A884" }} />
      <h4 className="fw-bold mb-0" style={{ color: "#1e293b", fontSize: "22px" }}>
        View Quotation
      </h4>
    </div>
    {/* ===== STATUS BADGE – NOW WITH MORE GAP (mt-3) ===== */}
    <div className="mt-3">
      {quotation.status === "APPROVED" ? (
        <span
          className="badge"
          style={{
            backgroundColor: "#E6F7F4",
            color: "#00A884",
            fontWeight: 600,
            fontSize: "13px",
            padding: "4px 14px",
            borderRadius: "20px"
          }}
        >
          ✓ Approved
        </span>
      ) : quotation.status === "REJECTED" ? (
        <span
          className="badge"
          style={{
            backgroundColor: "#FDF2F2",
            color: "#EF4444",
            fontWeight: 600,
            fontSize: "13px",
            padding: "4px 14px",
            borderRadius: "20px"
          }}
        >
          ✕ Rejected
        </span>
      ) : (
        <span
          className="badge"
          style={{
            backgroundColor: "#FEF3D7",
            color: "#D97706",
            fontWeight: 600,
            fontSize: "13px",
            padding: "4px 14px",
            borderRadius: "20px"
          }}
        >
          ● Awaiting Your Approval
        </span>
      )}
    </div>
  </div>
  <button
    className="btn btn-sm d-flex align-items-center gap-2"
    style={{
      borderRadius: "8px",
      height: "38px",
      fontSize: "13px",
      fontWeight: 600,
      color: "#0d9488",
      border: "none",
      background: "transparent"
    }}
    onClick={() => window.print()}
  >
    Download PDF
    <ArrowDown size={16} />
  </button>
</div>

                {/* ===== 1st LINE – DOTTED ===== */}
                <div style={{ borderBottom: "1px dashed #D0D5DD", marginBottom: "16px", paddingBottom: "16px" }}>
                  <div className="d-flex flex-wrap justify-content-between align-items-center">
                    <div>
                      <h5 className="fw-bold mb-1" style={{ color: "#1e293b", fontSize: "18px" }}>
                        Quotation #{quotation.quotationNumber}
                      </h5>
                      <p className="fw-semibold text-muted mb-1" style={{ fontSize: "14px" }}>
                        {quotation.eventType} — {enquiry.location}
                      </p>
                      <small className="text-muted" style={{ fontSize: "12px" }}>
                        Linked Enquiry #ENQ-{enquiry._id.slice(-4).toUpperCase()} · Issued{" "}
                        {formatDate(quotation.createdAt)} · Valid till{" "}
                        {formatDate(quotation.validUntil)}
                      </small>
                    </div>
                  </div>
                </div>

                {/* ===== MIDDLE LINES – DASHED (service items) ===== */}
                <div className="mb-3">
                  {quotation.services && quotation.services.length > 0 ? (
                    quotation.services.map((item, index) => (
                      <div
                        key={index}
                        className="d-flex justify-content-between align-items-center"
                        style={{
                          paddingTop: "8px",
                          paddingBottom: "8px",
                          borderBottom:
                            index < quotation.services.length - 1 ? "1px dashed #D0D5DD" : "none"
                        }}
                      >
                        <div>
                          <span className="fw-semibold text-dark" style={{ fontSize: "15px" }}>
                            {item.serviceName}
                          </span>
                          {item.description && (
                            <span className="text-muted d-block" style={{ fontSize: "13px" }}>
                              {item.description}
                            </span>
                          )}
                        </div>
                        <span className="fw-bold text-dark" style={{ fontSize: "15px" }}>
                          {formatCurrency(item.lineTotal || item.quantity * item.unitPrice)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted small text-center py-3">
                      No service items detailed.
                    </p>
                  )}
                </div>

                {/* ===== DASHED LINE BETWEEN SERVICES & TOTALS ===== */}
                <div style={{ borderBottom: "1px dashed #D0D5DD", marginBottom: "8px" }} />

                {/* ===== TOTALS – ALL AMOUNTS BOLD ===== */}
                {/* ===== TOTALS ===== */}
                <div className="pt-3">
                  {quotation.subtotal > 0 && (
                    <>
                      <div className="d-flex justify-content-between align-items-center" style={{ paddingTop: "4px", paddingBottom: "4px" }}>
                        <span className="text-muted" style={{ fontSize: "14px", fontWeight: 500 }}>
                          Subtotal
                        </span>
                        <span className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                          {formatCurrency(quotation.subtotal)}
                        </span>
                      </div>
                      {/* ===== DASHED LINE BETWEEN SUBTOTAL & GST ===== */}
                      {quotation.totalGST > 0 && (
                        <div style={{ borderBottom: "1px dashed #D0D5DD", margin: "6px 0" }} />
                      )}
                    </>
                  )}
                  {quotation.totalGST > 0 && (
                    <>
                      <div className="d-flex justify-content-between align-items-center" style={{ paddingTop: "4px", paddingBottom: "4px" }}>
                        <span className="text-muted" style={{ fontSize: "14px", fontWeight: 500 }}>
                          GST (18%)
                        </span>
                        <span className="fw-bold text-dark" style={{ fontSize: "14px" }}>
                          {formatCurrency(quotation.totalGST)}
                        </span>
                      </div>
                      {/* ===== SOLID LINE BELOW GST – THICKER ===== */}
                      <div style={{ borderBottom: "2px solid #EAECF0", margin: "6px 0" }} />
                    </>
                  )}

                  {/* ===== TOTAL PAYABLE – NO LINE ABOVE ===== */}
                  <div
                    className="d-flex justify-content-between align-items-center"
                    style={{
                      paddingTop: "12px",
                      marginTop: "4px"
                    }}
                  >
                    <span className="fw-bold text-dark" style={{ fontSize: "18px" }}>
                      Total Payable
                    </span>
                    <span
                      className="fw-bold"
                      style={{
                        color: "#00A884",
                        fontSize: "20px"
                      }}
                    >
                      {formatCurrency(quotation.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* ===== ACTION BUTTONS – LINE REMOVED ===== */}
                {quotation.status === "SENT" || quotation.status === "VIEWED" ? (
                  <div className="mt-4 pt-3">
                    {!showRejectForm ? (
                      <div className="d-flex gap-3">
                        <button
                          className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2 flex-1"
                          onClick={() => setShowRejectForm(true)}
                          disabled={isSubmitting}
                          style={{
                            borderRadius: "8px",
                            padding: "12px 24px",
                            fontWeight: 600,
                            fontSize: "14px",
                            flex: 1
                          }}
                        >
                          <MessageSquare size={16} />
                          Request Changes
                        </button>
                        <button
                          className="dashboard-btn-primary d-flex align-items-center justify-content-center gap-2 flex-1"
                          onClick={handleAccept}
                          disabled={isSubmitting}
                          style={{
                            padding: "12px 28px",
                            fontWeight: 600,
                            fontSize: "14px",
                            flex: 1
                          }}
                        >
                          <Check size={16} strokeWidth={3} />
                          Accept Quotation
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleRejectSubmit} className="w-100 p-3 rounded-4 bg-light border">
                        <h6 className="fw-bold mb-2">Request Changes / Feedback</h6>
                        <p className="text-muted small mb-3">
                          Please let the team know what details or services you want adjusted in this quotation.
                        </p>
                        <textarea
                          className="form-control mb-3"
                          rows="3"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Example: Please change the catering guest count to 300 or adjust the live counters."
                          required
                          style={{ borderRadius: "8px", fontSize: "14px" }}
                        />
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => {
                              setShowRejectForm(false);
                              setRejectionReason("");
                            }}
                            disabled={isSubmitting}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="btn btn-sm btn-danger"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Submitting..." : "Send Request"}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ) : quotation.status === "APPROVED" ? (
                  <div
                    className="mt-4 p-3 rounded-4 text-center border"
                    style={{ backgroundColor: "#E6F7F4", borderColor: "#A2E9D8" }}
                  >
                    <h6 className="fw-bold text-dark mb-1">✓ Quotation Approved</h6>
                    <p className="small mb-0 text-muted">
                      You approved this quotation on{" "}
                      {formatDate(quotation.approvedAt || new Date())}. Our team is preparing your event bookings.
                    </p>
                  </div>
                ) : quotation.status === "REJECTED" ? (
                  <div
                    className="mt-4 p-3 rounded-4 text-center border"
                    style={{ backgroundColor: "#FDF2F2", borderColor: "#F8B4B4" }}
                  >
                    <h6 className="fw-bold text-dark mb-1">✕ Quotation Rejected / Changes Requested</h6>
                    <p className="small mb-0 text-muted">
                      You requested changes on {formatDate(quotation.rejectedAt || new Date())}.
                      {quotation.rejectionReason && (
                        <span>
                          {" "}
                          Reason: <strong>"{quotation.rejectionReason}"</strong>
                        </span>
                      )}
                    </p>
                  </div>
                ) : null}
              </>
            ) : (
              /* No quotation ready */
              <div className="text-center py-5">
                <div
                  className="d-flex justify-content-center align-items-center mx-auto mb-3"
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "14px",
                    backgroundColor: "#FEF3D7",
                    color: "#D97706"
                  }}
                >
                  <Clock size={24} />
                </div>
                <h5 className="fw-bold">Quotation Awaiting Draft</h5>
                <p className="text-muted small mx-auto mb-0" style={{ maxWidth: "450px" }}>
                  Our planning team is currently working on your quotation proposal based on your guest
                  count, location, and service requirements. Once ready, you will be notified to review
                  and accept the quotation right here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .hover-back:hover {
          color: #00A884 !important;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default EnquiryDetail;