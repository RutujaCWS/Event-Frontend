import React, { useState, useEffect } from "react";
import API from "../../services/api"; // adjust path if needed

const StaffDashboard = () => {
  // ---------- Real count for Assigned Enquiries ----------
  const [assignedCount, setAssignedCount] = useState(8); // default to 8 while loading
  const [countLoading, setCountLoading] = useState(true);

  // ---------- Mock data (all other stats remain unchanged) ----------
  const stats = {
    enquiries: assignedCount, // ← dynamic value
    bookings: 5,
    pendingNotes: 3,
    pendingPayments: 125000,
  };

  const upcomingEvents = [
    { id: 1, name: "Wedding – Sharma", date: "2024-03-15", status: "Confirmed" },
    { id: 2, name: "Corporate Meet – Infosys", date: "2024-03-18", status: "In Progress" },
    { id: 3, name: "Birthday Party – Patil", date: "2024-03-20", status: "Pending" },
  ];

  const recentEnquiries = [
    { id: 101, customer: "Rahul Sharma", eventType: "Wedding", date: "2024-03-10", status: "New" },
    { id: 102, customer: "Priya Mehta", eventType: "Birthday", date: "2024-03-09", status: "Contacted" },
    { id: 103, customer: "Amit Kumar", eventType: "Corporate", date: "2024-03-08", status: "Negotiation" },
  ];

  const bookingStatusSummary = {
    Pending: 2,
    Confirmed: 2,
    "In Progress": 1,
    Completed: 0,
  };

  const totalBookings = Object.values(bookingStatusSummary).reduce((a, b) => a + b, 0);

  // Fetch real assigned enquiries count
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await API.get("/staff/enquiries/count");
        setAssignedCount(res.data.count);
      } catch (err) {
        console.error("Failed to load assigned count:", err);
      } finally {
        setCountLoading(false);
      }
    };
    fetchCount();
  }, []);

  return (
    <div>
      <h2>Staff Dashboard</h2>
      
      {/* Row 1 – main stat cards */}
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">Assigned Enquiries</h5>
              <p className="card-text display-4">
                {countLoading ? <span className="spinner-border spinner-border-sm" /> : stats.enquiries}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">Upcoming Bookings</h5>
              <p className="card-text display-4">{stats.bookings}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h5 className="card-title">Pending Follow-ups</h5>
              <p className="card-text display-4">{stats.pendingNotes}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-danger">
            <div className="card-body">
              <h5 className="card-title">Pending Payments</h5>
              <p className="card-text">₹ {stats.pendingPayments.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* The rest of your component (Upcoming Events, Booking Status, Recent Enquiries, Quick Actions) is unchanged */}
      {/* ... keep everything below exactly as it was ... */}
      {/* Row 2 – Upcoming Events & Booking Status */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-info text-white">
              <strong>📅 Upcoming Events (Next 7 days)</strong>
            </div>
            <div className="card-body p-0">
              <ul className="list-group list-group-flush">
                {upcomingEvents.map(event => (
                  <li key={event.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{event.name}</strong><br />
                      <small>{event.date}</small>
                    </div>
                    <span className={`badge bg-${event.status === 'Confirmed' ? 'success' : event.status === 'In Progress' ? 'primary' : 'secondary'}`}>
                      {event.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-footer">
              <button className="btn btn-sm btn-outline-info">View All Events →</button>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-secondary text-white">
              <strong>📊 Booking Status Overview</strong>
            </div>
            <div className="card-body">
              {Object.entries(bookingStatusSummary).map(([status, count]) => (
                <div key={status} className="mb-2">
                  <div className="d-flex justify-content-between">
                    <span>{status}</span>
                    <span>{count} / {totalBookings}</span>
                  </div>
                  <div className="progress" style={{ height: "8px" }}>
                    <div 
                      className={`progress-bar bg-${status === 'Confirmed' ? 'success' : status === 'In Progress' ? 'primary' : status === 'Pending' ? 'warning' : 'secondary'}`}
                      style={{ width: `${totalBookings ? (count / totalBookings) * 100 : 0}%` }}
                      role="progressbar"
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3 – Recent Enquiries Table */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <strong>📞 Recent Enquiries</strong>
            </div>
            <div className="card-body p-0">
              <table className="table table-striped mb-0">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Event Type</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEnquiries.map(enq => (
                    <tr key={enq.id}>
                      <td>{enq.customer}</td>
                      <td>{enq.eventType}</td>
                      <td>{enq.date}</td>
                      <td><span className="badge bg-info">{enq.status}</span></td>
                      <td><button className="btn btn-sm btn-outline-primary">View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-footer">
              <button className="btn btn-sm btn-primary">View All Enquiries</button>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4 – Quick Actions */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card bg-light">
            <div className="card-body">
              <h5 className="card-title">⚡ Quick Actions</h5>
              <div className="d-flex gap-2 flex-wrap">
                <button className="btn btn-success">➕ New Enquiry</button>
                <button className="btn btn-info">📅 Add Event</button>
                <button className="btn btn-warning">📝 Add Follow-up Note</button>
                <button className="btn btn-secondary">💰 Record Payment</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;