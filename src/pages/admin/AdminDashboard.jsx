import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Row, Col, Table, Button, Spinner, Card
} from "react-bootstrap";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import {
  FaEnvelope, FaCalendarCheck, FaRupeeSign, FaCalendarAlt,
  FaFileInvoiceDollar, FaRegCalendarAlt, FaDownload,
  FaEllipsisV, FaExclamationTriangle, FaEdit
} from "react-icons/fa";
import "./Styles/UserManagement.css"

import { TbTrendingUp, TbInfoCircle, TbMessageQuestion, TbConfetti } from "react-icons/tb";
import { LuCalendarCheck2, LuClockAlert } from "react-icons/lu";
import { RiDeleteBinLine } from "react-icons/ri"; // <-- NEW import
import { getTotalEnquiries, getRecentEnquiries } from "../../services/leadService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Custom dot renderer – only middle months have circles
const CustomDot = (props) => {
  const { cx, cy, payload } = props;
  if (payload.name === "Mar" || payload.name === "Sep") {
    return null;
  }
  return (
    <circle cx={cx} cy={cy} r={5} fill="#ffffff" stroke="#00a884" strokeWidth={2.5} />
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [totalEnquiriesCount, setTotalEnquiriesCount] = useState(284);
  const [recentEnquiries, setRecentEnquiries] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [totalRes, recentRes] = await Promise.all([
        getTotalEnquiries().catch(() => null),
        getRecentEnquiries().catch(() => null)
      ]);

      if (totalRes && totalRes.data) {
        setTotalEnquiriesCount(totalRes.data.total || 284);
      }
      if (recentRes && recentRes.data && recentRes.data.data) {
        setRecentEnquiries(recentRes.data.data);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Mock revenue trend data (Mar - Sep)
  const revenueData = [
    { name: "Mar", "2025": 12, "2026": 55 },
    { name: "Apr", "2025": 14, "2026": 42 },
    { name: "May", "2025": 13, "2026": 48 },
    { name: "Jun", "2025": 10, "2026": 25 },
    { name: "Jul", "2025": 11, "2026": 45 },
    { name: "Aug", "2025": 12, "2026": 38 },
    { name: "Sep", "2025": 15, "2026": 68 }
  ];

  // Mock enquiry distribution (120 total)
  const enquiryDistribution = [
    { name: "Confirmed", value: 80, count: "80", percent: "54.32 %", color: "#00a884" },
    { name: "Pending", value: 36, count: "36", percent: "27.22 %", color: "#f59e0b" },
    { name: "Rejected", value: 4, count: "04", percent: "18.5 %", color: "#ef4444" }
  ];

  // Mock bookings
  const bookingsData = [
    { id: "#BK-8821", name: "Alice Sterling", initials: "AS", avatarColor: "avatar-initials-blue", date: "May 12, 2024", amount: "$12,450.00", status: "CONFIRMED" },
    { id: "#BK-8822", name: "Ben Johnson", initials: "BU", avatarColor: "avatar-initials-purple", date: "Jun 05, 2024", amount: "$8,200.00", status: "PROCESSING" },
    { id: "#BK-8823", name: "Ryley Thompson", initials: "RT", avatarColor: "avatar-initials-green", date: "Jun 18, 2024", amount: "$24,000.00", status: "PENDING" },
    { id: "#BK-8823", name: "Ryley Thompson", initials: "RT", avatarColor: "avatar-initials-green", date: "Jun 18, 2024", amount: "$24,000.00", status: "PENDING" }
  ];

  // Mock upcoming events
  const upcomingEvents = [

    { date: "21", month: "JUN", name: "TechCorp Annual Meet", desc: "Convention Hall • 500 pax", status: "Setup", badgeClass: "badge-custom-setup" },
    { date: "25", month: "JUN", name: "Patel Birthday Gala", desc: "Garden Venue • 120 guests", status: "Pending", badgeClass: "badge-custom-pending" },
    { date: "28", month: "JUN", name: "Gupta Reception", desc: "Rooftop Terrace • 200 pax", status: "Scheduled", badgeClass: "badge-custom-scheduled" },
    { date: "30", month: "JUN", name: "Sharma Reception", desc: "Rooftop Terrace • 200 pax", status: "Scheduled", badgeClass: "badge-custom-scheduled" }
  ];

  // Mock User Management
  const usersData = [
    {
      name: "Anjali Sharma",
      email: "anjali@gmail.com",
      initials: "AS",
      avatarColor: "avatar-initials-teal",
      contact: "+91 98200 11111",
      status: "Active",
      events: "12"
    },
    {
      name: "Rohan Patel",
      email: "rohan@hotmail.com",
      initials: "RP",
      avatarColor: "avatar-initials-blue",
      contact: "91 98765 22222",
      status: "Active",
      events: "7"
    },
    {
      name: "Meena Gupta",
      email: "meena@yahoo.com",
      initials: "MG",
      avatarColor: "avatar-initials-orange",
      contact: "+91 99001 33333",
      status: "In Active",
      events: "12"
    },
    {
      name: "Nikhil Kumar",
      email: "nikhil@work.com",
      initials: "RP",
      avatarColor: "avatar-initials-red",
      contact: "+91 98755 22222",
      status: "Active",
      events: "07"
    }
  ];

  // Mock Pending Payments
  const pendingPaymentsData = [
    { id: "#BK-8821", name: "Alice Sterling", initials: "AS", date: "May 12, 2024", amount: "Rs.12,450.00", status: "PENDING" },
    { id: "#BK-8822", name: "Ben Johnson", initials: "BU", date: "Jun 05, 2024", amount: "Rs.8,200.00", status: "PENDING" },
    { id: "#BK-8823", name: "Ryley Thompson", initials: "RT", date: "Jun 18, 2024", amount: "Rs.24,000.00", status: "PENDING" },
    { id: "#BK-8823", name: "Ryley Thompson", initials: "RT", date: "Jun 18, 2024", amount: "Rs.24,000.00", status: "PENDING" }
  ];

  // Helper for status badge styling
  const getStatusBadge = (status) => {
    switch (status.toUpperCase()) {
      case "CONFIRMED":
        return <span className="badge-custom badge-custom-confirmed">Confirmed</span>;
      case "PROCESSING":
        return <span className="badge-custom badge-custom-processing">Processing</span>;
      case "PENDING":
        return <span className="badge-custom badge-custom-pending">Pending</span>;
      default:
        return <span className="badge-custom badge-custom-pending">{status}</span>;
    }
  };

  // Helper to get date-box colour class based on event status
  const getDateBoxColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'date-box-confirmed';
      case 'setup': return 'date-box-setup';
      case 'pending': return 'date-box-pending';
      case 'scheduled': return 'date-box-scheduled';
      default: return '';
    }
  };

const handleExportReport = () => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.setTextColor(58, 95, 190);
  doc.text("Creative Web Solutions", 14, 18);

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Event Management System", 14, 28);

  doc.setFontSize(16);
  doc.text("Dashboard Report", 14, 42);

  doc.setFontSize(10);
  doc.text(
    `Generated On : ${new Date().toLocaleString()}`,
    14,
    50
  );

  // Dashboard Summary
  doc.setFontSize(13);
  doc.text("Dashboard Summary", 14, 65);

  autoTable(doc, {
    startY: 70,
    theme: "grid",
    head: [["Metric", "Value"]],
    body: [
      ["Total Enquiries", totalEnquiriesCount],
      ["Total Bookings", "60"],
      ["Monthly Revenue", "₹8.4L"],
      ["Upcoming Events", "25"],
      ["Pending Payments", "₹2.1L"],
    ],
  });

  // Recent Bookings
  doc.text(
    "Recent Bookings",
    14,
    doc.lastAutoTable.finalY + 15
  );

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [["Booking ID", "Client", "Date", "Amount", "Status"]],
    body: bookingsData.map((item) => [
      item.id,
      item.name,
      item.date,
      item.amount,
      item.status,
    ]),
  });

  // User Management
  doc.text(
    "User Management",
    14,
    doc.lastAutoTable.finalY + 15
  );

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [["Name", "Email", "Contact", "Status"]],
    body: usersData.map((item) => [
      item.name,
      item.email,
      item.contact,
      item.status,
    ]),
  });

  // Pending Payments
  doc.text(
    "Pending Payments",
    14,
    doc.lastAutoTable.finalY + 15
  );

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [["Booking ID", "Client", "Due Date", "Amount", "Status"]],
    body: pendingPaymentsData.map((item) => [
      item.id,
      item.name,
      item.date,
      item.amount,
      item.status,
    ]),
  });

  doc.save("Dashboard_Report.pdf");
};
  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" variant="success" />
      </div>
    );
  }

 return (
  <div>
      {/* Top Title & Actions Bar */}
      <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 mb-4">
        <h2 className="page-title">Dashboard Overview</h2>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <button className="dashboard-btn-outline">
            <FaRegCalendarAlt />
            <span>June 2026</span>
          </button>
         <button
  className="dashboard-btn-primary"
  onClick={handleExportReport}
>
  <FaDownload />
  <span>Export Report</span>
</button>
        </div>
      </div>

      {/* 5 KPI Cards Row */}
      <Row className="mb-4 g-3 g-md-4">
        {/* Card 1: Enquiries */}
        <Col xl lg={4} md={6} sm={6} xs={6}>
          <Card className="metric-card">
            <Card.Body className="metric-body">
              <div className="metric-top">
                <div
                  className="metric-icon-box"
                  style={{ backgroundColor: "#DDF5F0", color: "#0F766E" }}
                >
                  <TbMessageQuestion size={20} />
                </div>
                <h2 className="metric-number">{totalEnquiriesCount}</h2>
              </div>
              <div className="metric-title">TOTAL ENQUIRIES</div>
              <div className="metric-growth">
                <TbTrendingUp size={14} />
                <span>+18% this month</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Card 2: Bookings */}
        <Col xl lg={4} md={6} sm={6} xs={6}>
          <Card className="metric-card">
            <Card.Body className="metric-body">
              <div className="metric-top">
                <div
                  className="metric-icon-box"
                  style={{ backgroundColor: "#E8F0FE", color: "#2563EB" }}
                >
                  <LuCalendarCheck2 size={20} />
                </div>
                <h2 className="metric-number">142</h2>
              </div>
              <div className="metric-title">TOTAL BOOKINGS</div>
              <div className="metric-growth">
                <TbTrendingUp size={14} />
                <span>+12% this month</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Card 3: Monthly Revenue */}
        <Col xl lg={4} md={6} sm={6} xs={6}>
          <Card className="metric-card">
            <Card.Body className="metric-body">
              <div className="metric-top">
                <div
                  className="metric-icon-box"
                  style={{ backgroundColor: "#E7F4EE", color: "#14B8A6" }}
                >
                  <FaRupeeSign size={20} />
                </div>
                <h2 className="metric-number">₹8.4L</h2>
              </div>
              <div className="metric-title">MONTHLY REVENUE</div>
              <div className="metric-growth">
                <TbTrendingUp size={14} />
                <span>+14% this month</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Card 4: Upcoming Events */}
        <Col xl lg={4} md={6} sm={6} xs={6}>
          <Card className="metric-card">
            <Card.Body className="metric-body">
              <div className="metric-top">
                <div
                  className="metric-icon-box"
                  style={{ backgroundColor: "#FEF3D7", color: "#D97706" }}
                >
                  <TbConfetti size={20} />
                </div>
                <h2 className="metric-number">25</h2>
              </div>
              <div className="metric-title">UPCOMING EVENTS</div>
              <div className="metric-growth text-primary">
                <TbInfoCircle size={14} />
                <span>Next 30 days</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Card 5: Pending Payments */}
        <Col xl lg={4} md={6} sm={6} xs={6}>
          <Card className="metric-card">
            <Card.Body className="metric-body">
              <div className="metric-top">
                <div
                  className="metric-icon-box"
                  style={{ backgroundColor: "#FDE8E8", color: "#EF4444" }}
                >
                  <LuClockAlert size={20} />
                </div>
                <h2 className="metric-number">₹2.1L</h2>
              </div>
              <div className="metric-title">PENDING PAYMENTS</div>
              <div className="metric-alert">
                <FaExclamationTriangle size={14} />
                <span>22 overdue</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Middle Section: Chart & Enquiry distribution */}
      <Row className="mb-4">
        {/* Revenue Trend Chart */}
        <Col lg={8} className="mb-4 mb-lg-0">
          <div className="card-section">
            <div className="card-section-header">
              <h4 className="card-section-title">Monthly Revenue Trend</h4>
              <span className="card-section-subtitle-green">₹48.3L Total 2026</span>
            </div>
            <div style={{ width: "100%", height: "260px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="color2026" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00a884" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#00a884" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
                    tickCount={6}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="custom-recharts-tooltip">
                            <p className="custom-recharts-tooltip-label">{payload[0].payload.name}</p>
                            <p className="custom-recharts-tooltip-value">₹{payload[0].value}L</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {/* 2025 Area (thin line, no fill) */}
                  <Area
                    type="monotone"
                    dataKey="2025"
                    stroke="#f43f5e"
                    strokeWidth={1.5}
                    fill="none"
                    dot={false}
                  />
                  {/* 2026 Area (smooth, gradient fill, custom dots) */}
                  <Area
                    type="monotone"
                    dataKey="2026"
                    stroke="#00a884"
                    strokeWidth={3}
                    fill="url(#color2026)"
                    dot={<CustomDot />}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {/* Custom Legend */}
            <div className="d-flex justify-content-center align-items-center gap-4 mt-3" style={{ fontSize: "0.8rem", fontWeight: 600 }}>
              <div className="d-flex align-items-center gap-2">
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#f43f5e" }}></span>
                <span style={{ color: "#64748b" }}>2025</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#00a884" }}></span>
                <span style={{ color: "#00a884" }}>2026</span>
              </div>
            </div>
          </div>
        </Col>

        {/* Enquiry Distribution Donut Chart */}
        <Col lg={4}>
          <div className="card-section d-flex flex-column justify-content-between">
            <div className="card-section-header">
              <h4 className="card-section-title">Enquiry distribution</h4>
              <button className="view-all-link" onClick={() => navigate("/admin/enquiries")}>
                View All
              </button>
            </div>
            <Row className="align-items-center g-3">
              <Col xs={12} sm={6} lg={12} xl={6} className="pe-0">
                <div style={{ position: "relative", width: "100%", height: "180px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={enquiryDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={52}
                        outerRadius={70}
                        startAngle={90}
                        endAngle={-270}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {enquiryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: "1.6rem", fontWeight: "800", color: "#1e293b", lineHeight: 1.1 }}>120</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "600", marginTop: "2px" }}>Enquiry</div>
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6} lg={12} xl={6}>
                <div>
                  {enquiryDistribution.map((item, idx) => (
                    <div key={idx} className="donut-legend-item">
                      <div className="donut-legend-label">
                        <span className={`donut-legend-dot ${item.name === "Confirmed" ? "green" : item.name === "Pending" ? "orange" : "red"}`}></span>
                        <span>{item.name}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="donut-legend-number">{item.count}</span>
                        <span className="donut-legend-percent">{item.percent}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      {/* Bottom Section: Recent Bookings & Upcoming Events */}
      <Row>
        <Col xl={8} className="mb-4 mb-xl-0">
          <div className="card-section">
            <div className="card-section-header">
              <h4 className="card-section-title">Recent Bookings Details</h4>
              <button className="view-all-link" onClick={() => navigate("/admin/bookings")}>
                View All
              </button>
            </div>
            <div className="table-responsive">
              <Table className="table-custom" hover>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Client Name</th>
                    <th>Event Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingsData.map((b, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600, color: "#64748b" }}>{b.id}</td>
                      <td>
                        <div className="client-avatar-cell">
                          <div className={`avatar-initials ${b.avatarColor}`}>
                            {b.initials}
                          </div>
                          <span>{b.name}</span>
                        </div>
                      </td>
                      <td style={{ color: "#64748b", fontWeight: 500 }}>{b.date}</td>
                      <td style={{ fontWeight: 700 }}>{b.amount}</td>
                      <td>{getStatusBadge(b.status)}</td>
                      <td className="text-center">
                        <Button variant="link" className="p-0 text-muted" aria-label="Actions">
                          <FaEllipsisV />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Col>

        <Col xl={4}>
          <div className="card-section d-flex flex-column justify-content-between">
            <div className="card-section-header">
              <h4 className="card-section-title">Upcoming Events</h4>
              <button className="view-all-link" onClick={() => navigate("/admin/bookings")}>
                View All
              </button>
            </div>
            <div className="d-flex flex-column gap-3">
              {upcomingEvents.map((evt, idx) => (
                <div key={idx} className="event-item">
                  <div className="d-flex align-items-center flex-grow-1" style={{ minWidth: "150px" }}>
                    {/* Date box with dynamic colour class */}
                    <div className={`event-date-box ${getDateBoxColor(evt.status)}`}>
                      <span className="event-date-box-number">{evt.date}</span>
                      <span className="event-date-box-month">{evt.month}</span>
                    </div>
                    <div className="event-details-text">
                      <h5 className="event-title">{evt.name}</h5>
                      <p className="event-meta mb-0">{evt.desc}</p>
                    </div>
                  </div>
                  <div className="event-badge-container">
                    <span className={`badge-custom ${evt.badgeClass}`}>
                      <span className={`status-dot ${evt.status.toLowerCase()}`}></span>
                      {evt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>

      {/* User Management Table */}
      <Row className="mt-4">
        <Col xs={12}>
          <div className="card-section">
            <div className="card-section-header">
              <h4 className="card-section-title">User Management</h4>
              <button className="view-all-link" onClick={() => navigate("/admin/users")}>
                View All
              </button>
            </div>
            <div className="table-responsive">
              <Table className="table-custom" hover>
                <thead>
                  <tr>
                    <th>User Details</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Events</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersData.map((u, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="client-avatar-cell">
                          <div className={`avatar-initials ${u.avatarColor}`}>
                            {u.initials}
                          </div>
                          <div className="d-flex flex-column">
                            <span style={{ fontWeight: 700, color: "#1e293b" }}>{u.name}</span>
                            <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 400 }}>{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: "#64748b", fontWeight: 500 }}>{u.contact}</td>
                      <td>
                        <span className={`user-status-pill ${u.status === "Active" ? "active" : "inactive"}`}>
                          <span className="status-dot-sm"></span>
                          {u.status}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700 }}>{u.events}</td>
                      <td className="text-center">
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <button className="action-btn-edit" aria-label="Edit user">
                            <FaEdit size={14} />
                          </button>
                          {/* 🔄 Replace lock with delete */}
                          <button className="action-btn-delete" aria-label="Delete user">
                            <RiDeleteBinLine size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Col>
      </Row>

      {/* Pending Payments Table */}
      <Row className="mt-4">
        <Col xs={12}>
          <div className="card-section">
            <div className="card-section-header">
              <h4 className="card-section-title">Pending Payments</h4>
              <button className="view-all-link" onClick={() => navigate("/admin/payments")}>
                View All
              </button>
            </div>
            <div className="table-responsive">
              <Table className="table-custom" hover>
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Client Name</th>
                    <th>Due Date</th>
                    <th>Pending Amount</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingPaymentsData.map((p, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600, color: "#64748b" }}>{p.id}</td>
                      <td>
                        <div className="client-avatar-cell">
                          <span style={{ fontWeight: 800, color: "#1e293b", marginRight: "8px" }}>{p.initials}</span>
                          <span>{p.name}</span>
                        </div>
                      </td>
                      <td style={{ color: "#64748b", fontWeight: 500 }}>{p.date}</td>
                      <td style={{ fontWeight: 700 }}>{p.amount}</td>
                      <td>
                        <span className="badge-custom badge-custom-pending">
                          {p.status}
                        </span>
                      </td>
                      <td className="text-center">
                        <Button variant="link" className="p-0 text-muted" aria-label="Actions">
                          <FaEllipsisV />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;