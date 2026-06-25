import { useNavigate } from "react-router-dom";
import { FaClipboardList, FaCheckCircle, FaMoneyBillWave, FaExclamationTriangle, FaPlusCircle, FaCreditCard, FaFileInvoiceDollar, FaHeadset, FaCalendarAlt, FaHistory } from "react-icons/fa";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  // Mock data matching the style of the staff dashboard
  const stats = {
    totalEnquiries: 3,
    pendingQuotations: 2,
    activeBookings: 1,
    pendingPayments: 335000
  };

  const upcomingEvents = [
    { id: 1, name: "Wedding Reception – Orchid Ballroom", date: "2026-11-20", location: "Banjara Hills, Hyderabad", status: "Confirmed" },
    { id: 2, name: "Corporate Gala Dinner – Infosys", date: "2026-12-15", location: "Gachibowli, Hyderabad", status: "Quoted" },
    { id: 3, name: "Birthday Party – Patil Celebration", date: "2026-07-02", location: "Secunderabad, Hyderabad", status: "Review Required" }
  ];

  const recentActivities = [
    { id: 1, milestone: "Enquiry Submitted", text: "Enquiry ENQ-102 for Birthday Party submitted.", time: "June 08, 2026", type: "primary" },
    { id: 2, milestone: "Quotation Received", text: "Quotation QTN-9021 of ₹4,85,000 received.", time: "June 09, 2026", type: "info" },
    { id: 3, milestone: "Booking Confirmed", text: "Booking BKG-2026-001 locked and venue reserved.", time: "June 10, 2026", type: "success" },
    { id: 4, milestone: "Payment Successful", text: "Advance payment of ₹1,50,000 processed successfully.", time: "June 11, 2026", type: "success" }
  ];

  const recentQuotations = [
    { id: "QTN-9021", eventType: "Wedding Reception", amount: 485000, status: "Pending Decision" },
    { id: "QTN-8812", eventType: "Birthday Party", amount: 75000, status: "Rejected" }
  ];

  return (
    <div className="container-fluid py-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Welcome Heading */}
      <div className="mb-4">
        <h2 className="fw-bold text-dark m-0">Customer Dashboard</h2>
        <p className="text-muted small">Welcome back, {user.fullName || user.name || "Valued Client"}! Here is an overview of your active event planners.</p>
      </div>

      {/* Row 1 – 4 Stats Cards matching Staff style */}
      <div className="row g-3">
        <div className="col-md-3">
          <div className="card text-white bg-primary border-0 shadow-sm" style={{ borderRadius: "12px" }}>
            <div className="card-body py-4 d-flex justify-content-between align-items-center">
              <div>
                <h6 className="card-title text-white-50 small text-uppercase fw-bold mb-2">Total Enquiries</h6>
                <p className="card-text display-5 fw-bold m-0">{stats.totalEnquiries}</p>
              </div>
              <FaClipboardList className="fs-1 text-white-50" />
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-success border-0 shadow-sm" style={{ borderRadius: "12px" }}>
            <div className="card-body py-4 d-flex justify-content-between align-items-center">
              <div>
                <h6 className="card-title text-white-50 small text-uppercase fw-bold mb-2">Pending Quotations</h6>
                <p className="card-text display-5 fw-bold m-0">{stats.pendingQuotations}</p>
              </div>
              <FaCheckCircle className="fs-1 text-white-50" />
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-warning border-0 shadow-sm" style={{ borderRadius: "12px" }}>
            <div className="card-body py-4 d-flex justify-content-between align-items-center">
              <div>
                <h6 className="card-title text-white-50 small text-uppercase fw-bold mb-2">Active Bookings</h6>
                <p className="card-text display-5 fw-bold m-0">{stats.activeBookings}</p>
              </div>
              <FaMoneyBillWave className="fs-1 text-white-50" />
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-danger border-0 shadow-sm" style={{ borderRadius: "12px" }}>
            <div className="card-body py-4 d-flex justify-content-between align-items-center">
              <div>
                <h6 className="card-title text-white-50 small text-uppercase fw-bold mb-2">Pending Payments</h6>
                <p className="card-text fs-3 fw-bold m-0 mt-2">₹ {stats.pendingPayments.toLocaleString("en-IN")}</p>
              </div>
              <FaExclamationTriangle className="fs-1 text-white-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2 – Quick Actions */}
      <div className="row g-4 mt-2">
        <div className="col-12">
          <div className="card bg-light border-0 p-3" style={{ borderRadius: "12px" }}>
            <div className="card-body">
              <h5 className="fw-bold text-dark mb-3">⚡ Quick Actions</h5>
              <div className="d-flex gap-3 flex-wrap">
                <button
                  onClick={() => navigate("/customer/enquiries")}
                  className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 fw-semibold"
                  style={{ borderRadius: "8px" }}
                >
                  <FaPlusCircle /> Create New Enquiry
                </button>
                <button
                  onClick={() => navigate("/customer/quotations")}
                  className="btn btn-warning text-white d-flex align-items-center gap-2 px-3 py-2 fw-semibold"
                  style={{ borderRadius: "8px" }}
                >
                  <FaFileInvoiceDollar /> View Quotations
                </button>
                <button
                  onClick={() => navigate("/customer/bookings")}
                  className="btn btn-info text-white d-flex align-items-center gap-2 px-3 py-2 fw-semibold"
                  style={{ borderRadius: "8px" }}
                >
                  <FaCalendarAlt /> View Bookings
                </button>
                <button
                  onClick={() => navigate("/customer/payments")}
                  className="btn btn-success d-flex align-items-center gap-2 px-3 py-2 fw-semibold"
                  style={{ borderRadius: "8px" }}
                >
                  <FaCreditCard /> Make Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3 – Two-Column layout (Upcoming Events & Recent Quotations) */}
      <div className="row g-4 mt-2">
        {/* Left Column: Upcoming Events */}
        <div className="col-lg-6 col-12">
          <div className="card border-0 shadow-sm" style={{ borderRadius: "12px", overflow: "hidden" }}>
            <div className="card-header bg-info text-white py-3 px-4">
              <strong className="d-flex align-items-center gap-2">
                <FaCalendarAlt /> Upcoming Events
              </strong>
            </div>
            <div className="card-body p-0">
              <ul className="list-group list-group-flush">
                {upcomingEvents.map((event) => (
                  <li key={event.id} className="list-group-item d-flex justify-content-between align-items-center py-3 px-4 border-light">
                    <div>
                      <strong className="text-dark d-block">{event.name}</strong>
                      <span className="text-muted small d-block mb-1">📅 {event.date} | 📍 {event.location}</span>
                    </div>
                    <span
                      className={`badge bg-${
                        event.status === "Confirmed" ? "success" : event.status === "Quoted" ? "primary" : "secondary"
                      }`}
                      style={{ padding: "8px 12px", borderRadius: "20px" }}
                    >
                      {event.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Quotations */}
        <div className="col-lg-6 col-12">
          <div className="card border-0 shadow-sm" style={{ borderRadius: "12px", overflow: "hidden" }}>
            <div className="card-header bg-primary text-white py-3 px-4">
              <strong>📄 Recent Quotations</strong>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-striped table-hover align-middle mb-0">
                  <thead>
                    <tr className="table-light">
                      <th className="ps-4">Quotation ID</th>
                      <th>Event Type</th>
                      <th>Amount</th>
                      <th className="pe-4 text-end">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentQuotations.map((q) => (
                      <tr key={q.id}>
                        <td className="fw-bold text-primary ps-4">{q.id}</td>
                        <td className="fw-semibold text-dark">{q.eventType}</td>
                        <td className="fw-bold">₹ {q.amount.toLocaleString("en-IN")}</td>
                        <td className="pe-4 text-end">
                          <span
                            className={`badge bg-${
                              q.status === "Pending Decision" ? "warning text-dark" : "danger"
                            }`}
                            style={{ padding: "6px 12px", borderRadius: "15px" }}
                          >
                            {q.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4 – Recent Activity Timeline at the bottom */}
      <div className="row g-4 mt-2 mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm" style={{ borderRadius: "12px", overflow: "hidden" }}>
            <div className="card-header bg-secondary text-white py-3 px-4">
              <strong className="d-flex align-items-center gap-2">
                <FaHistory /> Recent Activity Timeline
              </strong>
            </div>
            <div className="card-body p-4">
              <div className="timeline d-flex flex-column gap-3">
                {recentActivities.map((act, idx) => (
                  <div key={act.id} className="d-flex align-items-start">
                    <div className="d-flex flex-column align-items-center me-3" style={{ width: "32px" }}>
                      <span className={`badge bg-${act.type} rounded-circle d-flex align-items-center justify-content-center text-white`} style={{ width: "28px", height: "28px", fontSize: "0.85rem" }}>
                        {idx + 1}
                      </span>
                      {idx !== recentActivities.length - 1 && (
                        <div style={{ width: "2px", height: "35px", backgroundColor: "#e2e8f0", marginTop: "4px" }}></div>
                      )}
                    </div>
                    <div>
                      <strong className="text-dark d-block fs-6 mb-1">{act.milestone}</strong>
                      <p className="text-muted small mb-1">{act.text}</p>
                      <small className="text-secondary" style={{ fontSize: "0.75rem" }}>{act.time}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;