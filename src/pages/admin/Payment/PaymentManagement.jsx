import React, { useState } from "react";
import { Col, Table, Form, Button } from "react-bootstrap";
import {
  FaRupeeSign,
  FaMoneyCheckAlt,
  FaWallet,
  FaUndoAlt,
  FaChartLine,
  FaFilter,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import "./paymentManagement.css";


const PaymentManagement = () => {
  // ===== DATA =====
  const transactions = [
    {
      id: "#TXN-8821",
      details: "50 guests • Premium",
      initials: "MG",
      avatar: "#FEF3C7",
      name: "Meena Gupta",
      email: "meena@yahoo.com",
      amount: "₹45,500",
      method: "GPay",
      payment: "Online",
      date: "14 Jun 2026",
      status: "Paid",
    },
    {
      id: "#TXN-8820",
      details: "Upto 50 guests",
      initials: "NK",
      avatar: "#DBEAFE",
      name: "Nikhil Kumar",
      email: "nikhil@work.com",
      amount: "₹1,02,528",
      method: "Cash",
      payment: "Offline",
      date: "14 Jun 2026",
      status: "Paid",
    },
    {
      id: "#TXN-8819",
      details: "Full decor + entertainment",
      initials: "RP",
      avatar: "#D1FAE5",
      name: "Rohan Patel",
      email: "rohan@hotmail.com",
      amount: "₹42,455",
      method: "UPI",
      payment: "Online",
      date: "13 Jun 2026",
      status: "Pending",
    },
    {
      id: "#TXN-8818",
      details: "AV setup + hospitality",
      initials: "AS",
      avatar: "#FCE7F3",
      name: "Anjali Sharma",
      email: "anjali@gmail.com",
      amount: "₹2,10,550",
      method: "NEFT",
      payment: "Online",
      date: "12 Jun 2026",
      status: "Paid",
    },
    {
      id: "#TXN-8816",
      details: "Corporate Event",
      initials: "SK",
      avatar: "#DBEAFE",
      name: "Sneha Kulkarni",
      email: "sneha@gmail.com",
      amount: "₹52,000",
      method: "Cash",
      payment: "Offline",
      date: "11 Jun 2026",
      status: "Failed",
    },
    {
      id: "#TXN-8814",
      details: "Reception",
      initials: "PR",
      avatar: "#E0F2FE",
      name: "Priya Rao",
      email: "priya@gmail.com",
      amount: "₹65,000",
      method: "Cash",
      payment: "Offline",
      date: "09 Jun 2026",
      status: "Paid",
    },
  ];

  const refunds = [
    {
      id: "#TXN-8821",
      details: "50 guests • Premium",
      initials: "NK",
      avatar: "#DBEAFE",
      name: "Nikhil Kumar",
      email: "nikhil@work.com",
      event: "Wedding",
      amount: "₹45,500",
      date: "14 Jun 2026",
      status: "Completed",
    },
    {
      id: "#TXN-8820",
      details: "Upto 50 guests",
      initials: "RP",
      avatar: "#FEE2E2",
      name: "Rohan Patel",
      email: "rohan@hotmail.com",
      event: "Corporate",
      amount: "₹45,500",
      date: "14 Jun 2026",
      status: "Completed",
    },
    {
      id: "#TXN-8819",
      details: "Full decor + entertainment",
      initials: "MG",
      avatar: "#FEF3C7",
      name: "Meena Gupta",
      email: "meena@yahoo.com",
      event: "Birthday",
      amount: "₹45,500",
      date: "13 Jun 2026",
      status: "Pending",
    },
    {
      id: "#TXN-8818",
      details: "AV setup + hospitality",
      initials: "AS",
      avatar: "#D1FAE5",
      name: "Anjali Sharma",
      email: "anjali@gmail.com",
      event: "Religious",
      amount: "₹45,500",
      date: "12 Jun 2026",
      status: "Completed",
    },
  ];

  // ===== FILTER STATES =====
  // Transactions
  const [activeFilter, setActiveFilter] = useState("All");
  const [showTxFilter, setShowTxFilter] = useState(false);
  const [txSearch, setTxSearch] = useState("");
  const [txMethod, setTxMethod] = useState("");
  const [txStatus, setTxStatus] = useState("");

  // Refunds
  const [activeRefundFilter, setActiveRefundFilter] = useState("All");
  const [showRefFilter, setShowRefFilter] = useState(false);
  const [refSearch, setRefSearch] = useState("");
  const [refEvent, setRefEvent] = useState("");
  const [refStatus, setRefStatus] = useState("");

  // ===== FILTERED DATA =====
  // Transactions: first apply tab filters, then search/method/status
  const filteredByTab =
    activeFilter === "All"
      ? transactions
      : activeFilter === "Pending"
      ? transactions.filter((item) => item.status === "Pending")
      : activeFilter === "Failed"
      ? transactions.filter((item) => item.status === "Failed")
      : activeFilter === "Offline"
      ? transactions.filter((item) => item.payment === "Offline")
      : transactions.filter((item) => item.payment === "Online");

  const filteredTransactions = filteredByTab.filter((item) => {
    // Search
    if (txSearch) {
      const term = txSearch.toLowerCase();
      const match =
        item.name.toLowerCase().includes(term) ||
        item.email.toLowerCase().includes(term) ||
        item.id.toLowerCase().includes(term);
      if (!match) return false;
    }
    // Method
    if (txMethod) {
      if (txMethod === "Online" && item.payment !== "Online") return false;
      if (txMethod === "Offline" && item.payment !== "Offline") return false;
      if (txMethod !== "Online" && txMethod !== "Offline" && item.method !== txMethod)
        return false;
    }
    // Status
    if (txStatus && item.status !== txStatus) return false;
    return true;
  });

  // Refunds: apply tab filters + search/event/status
  const filteredByRefundTab =
    activeRefundFilter === "All"
      ? refunds
      : activeRefundFilter === "Refunded"
      ? refunds.filter((item) => item.status === "Completed")
      : activeRefundFilter === "Offline"
      ? refunds.filter((item) => item.mode === "Offline")
      : refunds.filter((item) => item.mode === "Online");

  const filteredRefunds = filteredByRefundTab.filter((item) => {
    if (refSearch) {
      const term = refSearch.toLowerCase();
      const match =
        item.name.toLowerCase().includes(term) ||
        item.email.toLowerCase().includes(term) ||
        item.id.toLowerCase().includes(term);
      if (!match) return false;
    }
    if (refEvent && item.event !== refEvent) return false;
    if (refStatus && item.status !== refStatus) return false;
    return true;
  });

  // ===== RESET FUNCTIONS =====
  const resetTxFilters = () => {
    setTxSearch("");
    setTxMethod("");
    setTxStatus("");
  };

  const resetRefFilters = () => {
    setRefSearch("");
    setRefEvent("");
    setRefStatus("");
  };

  // ===== PAGINATION: Transactions =====
  const txItemsPerPage = 5;
  const [txPage, setTxPage] = useState(1);
  const txTotalPages = Math.ceil(filteredTransactions.length / txItemsPerPage);
  const txStart = (txPage - 1) * txItemsPerPage;
  const currentTransactions = filteredTransactions.slice(txStart, txStart + txItemsPerPage);

  const getTxPageNumbers = () => {
    const pages = [];
    if (txTotalPages <= 5) {
      for (let i = 1; i <= txTotalPages; i++) pages.push(i);
    } else {
      if (txPage <= 3) {
        pages.push(1, 2, 3, 4, "...", txTotalPages);
      } else if (txPage >= txTotalPages - 2) {
        pages.push(1, "...", txTotalPages - 3, txTotalPages - 2, txTotalPages - 1, txTotalPages);
      } else {
        pages.push(1, "...", txPage - 1, txPage, txPage + 1, "...", txTotalPages);
      }
    }
    return pages;
  };

  // ===== PAGINATION: Refunds =====
  const refItemsPerPage = 5;
  const [refPage, setRefPage] = useState(1);
  const refTotalPages = Math.ceil(filteredRefunds.length / refItemsPerPage);
  const refStart = (refPage - 1) * refItemsPerPage;
  const currentRefunds = filteredRefunds.slice(refStart, refStart + refItemsPerPage);

  const getRefPageNumbers = () => {
    const pages = [];
    if (refTotalPages <= 5) {
      for (let i = 1; i <= refTotalPages; i++) pages.push(i);
    } else {
      if (refPage <= 3) {
        pages.push(1, 2, 3, 4, "...", refTotalPages);
      } else if (refPage >= refTotalPages - 2) {
        pages.push(1, "...", refTotalPages - 3, refTotalPages - 2, refTotalPages - 1, refTotalPages);
      } else {
        pages.push(1, "...", refPage - 1, refPage, refPage + 1, "...", refTotalPages);
      }
    }
    return pages;
  };

  // ===== STYLE HELPERS =====
  const getStatusStyle = (status) => {
    switch (status) {
      case "Paid":
      case "Completed":
        return { background: "#E6F7F4", color: "#00A884" };
      case "Pending":
        return { background: "#FEF3C7", color: "#D97706" };
      case "Failed":
        return { background: "#FEE2E2", color: "#DC2626" };
      default:
        return { background: "#DBEAFE", color: "#2563EB" };
    }
  };

  const getEventStyle = (event) => {
    switch (event) {
      case "Wedding":
        return { background: "#FCE7F3", color: "#DB2777" };
      case "Corporate":
        return { background: "#DBEAFE", color: "#2563EB" };
      case "Birthday":
        return { background: "#F3E8FF", color: "#9333EA" };
      case "Religious":
        return { background: "#FEF3C7", color: "#D97706" };
      default:
        return { background: "#F3F4F6", color: "#374151" };
    }
  };

  return (
    <div className="container-fluid px-0 py-3" style={{ overflowX: "hidden" }}>
      {/* ===== KPI CARDS ===== */}
      <div className="row g-3 mb-4">
        <div className="col" style={{ flex: "1 0 18%", minWidth: "160px" }}>
          <div className="card" style={{ borderRadius: "16px", border: "1px solid #E5E7EB" }}>
            <div className="card-body p-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#E8F8F4", color: "#10B981" }}>
                  <FaRupeeSign size={20} />
                </div>
                <h2 className="mb-0 fw-bold" style={{ fontSize: "clamp(18px, 1.8vw, 22px)" }}>₹8,42,500</h2>
              </div>
              <p className="mb-1 text-secondary" style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.3px" }}>TOTAL REVENUE</p>
              <small className="text-success" style={{ fontSize: "12px" }}>↗ +14.2% vs last month</small>
            </div>
          </div>
        </div>
        <div className="col" style={{ flex: "1 0 18%", minWidth: "160px" }}>
          <div className="card" style={{ borderRadius: "16px", border: "1px solid #E5E7EB" }}>
            <div className="card-body p-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#FFF7E6", color: "#F59E0B" }}>
                  <FaMoneyCheckAlt size={20} />
                </div>
                <h2 className="mb-0 fw-bold" style={{ fontSize: "clamp(18px, 1.8vw, 22px)" }}>₹3,24,300</h2>
              </div>
              <p className="mb-1 text-secondary" style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.3px" }}>OFFLINE COLLECTED</p>
              <small className="text-success" style={{ fontSize: "12px" }}>↗ +9% vs last month</small>
            </div>
          </div>
        </div>
        <div className="col" style={{ flex: "1 0 18%", minWidth: "160px" }}>
          <div className="card" style={{ borderRadius: "16px", border: "1px solid #E5E7EB" }}>
            <div className="card-body p-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#E8F8F4", color: "#10B981" }}>
                  <FaWallet size={20} />
                </div>
                <h2 className="mb-0 fw-bold" style={{ fontSize: "clamp(18px, 1.8vw, 22px)" }}>₹5,18,200</h2>
              </div>
              <p className="mb-1 text-secondary" style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.3px" }}>ONLINE COLLECTED</p>
              <small className="text-success" style={{ fontSize: "12px" }}>↗ +8.7% last month</small>
            </div>
          </div>
        </div>
        <div className="col" style={{ flex: "1 0 18%", minWidth: "160px" }}>
          <div className="card" style={{ borderRadius: "16px", border: "1px solid #E5E7EB" }}>
            <div className="card-body p-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#FEE2E2", color: "#EF4444" }}>
                  <FaUndoAlt size={20} />
                </div>
                <h2 className="mb-0 fw-bold" style={{ fontSize: "clamp(18px, 1.8vw, 22px)" }}>₹18,400</h2>
              </div>
              <p className="mb-1 text-secondary" style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.3px" }}>TOTAL REFUNDS</p>
              <small className="text-danger" style={{ fontSize: "12px" }}>12 requests</small>
            </div>
          </div>
        </div>
        <div className="col" style={{ flex: "1 0 18%", minWidth: "160px" }}>
          <div className="card" style={{ borderRadius: "16px", border: "1px solid #E5E7EB" }}>
            <div className="card-body p-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#EEF2FF", color: "#4F46E5" }}>
                  <FaChartLine size={20} />
                </div>
                <h2 className="mb-0 fw-bold" style={{ fontSize: "clamp(18px, 1.8vw, 22px)" }}>₹45L</h2>
              </div>
              <p className="mb-1 text-secondary" style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.3px" }}>TOTAL VALUE</p>
              <small className="text-success" style={{ fontSize: "12px" }}>↗ +12% vs last month</small>
            </div>
          </div>
        </div>
      </div>

      {/* ===== TRANSACTIONS SECTION ===== */}
      <div className="d-flex justify-content-between align-items-start align-items-md-center flex-column flex-md-row gap-3 mb-3">
        <div className="d-flex align-items-center gap-3">
          <h2 className="mb-0" style={{ fontSize: "20px", fontWeight: "700", color: "#1F2937" }}>Transaction</h2>
          <span className="badge rounded-pill" style={{ background: "#befaf3", color: "#0D9488", fontSize: "11px", fontWeight: "600", padding: "5px 10px" }}>
            {transactions.length} Total
          </span>
        </div>
        <div className="d-flex flex-row flex-md-row gap-2 w-100 justify-content-md-end">
          <button
            className="btn btn-outline-secondary flex-fill flex-md-grow-0"
            style={{ height: "33px", minWidth: "90px", border: "1px solid #D9DEE8", borderRadius: "10px", background: "#FFFFFF", color: "#6B7280", fontWeight: "600", fontSize: "14px" }}
            onClick={() => setShowTxFilter(!showTxFilter)}
          >
            <FaFilter className="me-2" /> Filter
          </button>
          <button className="btn flex-fill flex-md-grow-0" style={{ background: "#0F9D8A", color: "#fff", height: "33px", minWidth: "180px", borderRadius: "10px" }}>
            Manage Transaction
          </button>
        </div>
      </div>

      {/* 🔥 Transaction Capsule Filter Bar */}
      {showTxFilter && (
        <div className="mb-3 p-3" style={{ border: "1px solid #E5E7EB", borderRadius: "12px", background: "#fff" }}>
          <div className="d-flex flex-wrap align-items-center gap-2 gap-md-3 justify-content-start justify-content-lg-end">
            {/* Search */}
            <div className="filter-capsule-container" style={{ padding: "4px 12px 4px 8px" }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748B", marginRight: "2px" }}>Search</span>
              <Form.Control
                type="text"
                placeholder="ID or name..."
                value={txSearch}
                onChange={(e) => setTxSearch(e.target.value)}
                className="filter-select-inner"
                style={{ border: "none", background: "#ffffff", height: "32px", width: "140px", fontSize: "12px", fontWeight: "400", padding: "4px 8px" }}
              />
              <span className="filter-clear-btn" onClick={() => setTxSearch("")}>Clear</span>
            </div>

            {/* Method */}
            <div className="filter-capsule-container">
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748B", marginRight: "2px" }}>Method</span>
              <Form.Select
                className="filter-select-inner filter-select-roles"
                value={txMethod}
                onChange={(e) => setTxMethod(e.target.value)}
                style={{ width: "110px" }}
              >
                <option value="">All</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="GPay">GPay</option>
                <option value="NEFT">NEFT</option>
              </Form.Select>
              <span className="filter-clear-btn" onClick={() => setTxMethod("")}>Clear All</span>
            </div>

            {/* Status */}
            <div className="filter-capsule-container">
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748B", marginRight: "2px" }}>Status</span>
              <Form.Select
                className="filter-select-inner filter-select-status"
                value={txStatus}
                onChange={(e) => setTxStatus(e.target.value)}
                style={{ width: "110px" }}
              >
                <option value="">All</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </Form.Select>
              <span className="filter-clear-btn" onClick={() => setTxStatus("")}>Clear All</span>
            </div>

            {/* Reset */}
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={resetTxFilters}
              style={{ fontSize: "12px", fontWeight: "600", borderRadius: "8px" }}
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: "16px" }}>
        <div className="card-body">
          {/* Tab Buttons */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            {["All", "Pending", "Failed", "Offline", "Online"].map((tab) => (
              <button
                key={tab}
                className="btn rounded-pill btn-sm px-3"
                onClick={() => { setActiveFilter(tab); setTxPage(1); }}
                style={{
                  background: activeFilter === tab ? "#D1FAE5" : "#fff",
                  color: activeFilter === tab ? "#0F9D8A" : "#374151",
                  border: activeFilter === tab ? "1px solid #A7F3D0" : "1px solid #D9DEE8",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <Col xl={12}>
            <div className="table-responsive">
              <Table className="table-custom" hover>
                <thead style={{ background: "#F8FAFC", whiteSpace: "nowrap" }}>
                  <tr>
                    <th></th>
                    <th>TXN ID</th>
                    <th>ATTENDEE</th>
                    <th>AMOUNT</th>
                    <th>METHOD</th>
                    <th>PAYMENT METHOD</th>
                    <th>DATE</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTransactions.map((item) => (
                    <tr key={item.id}>
                      <td><input type="checkbox" /></td>
                      <td>
                        <div className="fw-semibold">{item.id}</div>
                        <small className="text-muted">{item.details}</small>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", background: item.avatar, fontWeight: 600 }}>{item.initials}</div>
                          <div>
                            <div className="fw-semibold">{item.name}</div>
                            <small className="text-muted">{item.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>{item.amount}</td>
                      <td>{item.method}</td>
                      <td>{item.payment}</td>
                      <td>{item.date}</td>
                      <td>
                        <span style={{ ...getStatusStyle(item.status), display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "600" }}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ fontSize: "20px" }}>⋮</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3">
              <small className="text-muted">
                Showing {txStart + 1} - {Math.min(txStart + txItemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
              </small>
              <nav className="d-flex align-items-center gap-2 flex-wrap">
                <button className="btn btn-light border" disabled={txPage === 1} onClick={() => setTxPage(txPage - 1)}>&lt;</button>
                {getTxPageNumbers().map((p, idx) =>
                  p === "..." ? (
                    <span key={`dots-${idx}`} className="mx-1 text-muted">...</span>
                  ) : (
                    <button key={`page-${p}`} onClick={() => setTxPage(p)} className="btn" style={{ width: "30px", height: "30px", padding: 0, border: "1px solid #E5E7EB", background: txPage === p ? "#0F9D8A" : "#fff", color: txPage === p ? "#fff" : "#374151" }}>
                      {p}
                    </button>
                  )
                )}
                <button className="btn btn-light border" disabled={txPage === txTotalPages} onClick={() => setTxPage(txPage + 1)}>&gt;</button>
              </nav>
            </div>
          </Col>
        </div>
      </div>

      {/* ===== REFUNDS SECTION ===== */}
      <div className="d-flex justify-content-between align-items-start align-items-md-center flex-column flex-md-row gap-3 mb-3 mt-3">
        <div className="d-flex align-items-center gap-3">
          <h2 className="mb-0" style={{ fontSize: "20px", fontWeight: "700", color: "#1F2937" }}>Refund Request</h2>
          <span className="badge rounded-pill" style={{ background: "#befaf3", color: "#0D9488", fontSize: "11px", fontWeight: "600", padding: "5px 10px" }}>
            {refunds.length} Total
          </span>
        </div>
        <div className="d-flex flex-row gap-2 w-100 justify-content-md-end">
          <button
            className="btn btn-outline-secondary flex-fill flex-md-grow-0"
            style={{ height: "33px", minWidth: "90px", borderRadius: "10px", fontSize: "14px" }}
            onClick={() => setShowRefFilter(!showRefFilter)}
          >
            <FaFilter className="me-2" /> Filter
          </button>
          <button className="btn flex-fill flex-md-grow-0" style={{ background: "#0F9D8A", color: "#fff", height: "33px", minWidth: "180px", borderRadius: "10px" }}>
            Manage Transaction
          </button>
        </div>
      </div>

      {/* 🔥 Refund Capsule Filter Bar */}
      {showRefFilter && (
        <div className="mb-3 p-3" style={{ border: "1px solid #E5E7EB", borderRadius: "12px", background: "#fff" }}>
          <div className="d-flex flex-wrap align-items-center gap-2 gap-md-3 justify-content-start justify-content-lg-end">
            {/* Search */}
            <div className="filter-capsule-container" style={{ padding: "4px 12px 4px 8px" }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748B", marginRight: "2px" }}>Search</span>
              <Form.Control
                type="text"
                placeholder="ID or name..."
                value={refSearch}
                onChange={(e) => setRefSearch(e.target.value)}
                className="filter-select-inner"
                style={{ border: "none", background: "#ffffff", height: "32px", width: "140px", fontSize: "12px", fontWeight: "400", padding: "4px 8px" }}
              />
              <span className="filter-clear-btn" onClick={() => setRefSearch("")}>Clear</span>
            </div>

            {/* Event */}
            <div className="filter-capsule-container">
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748B", marginRight: "2px" }}>Event</span>
              <Form.Select
                className="filter-select-inner filter-select-roles"
                value={refEvent}
                onChange={(e) => setRefEvent(e.target.value)}
                style={{ width: "110px" }}
              >
                <option value="">All</option>
                <option value="Wedding">Wedding</option>
                <option value="Corporate">Corporate</option>
                <option value="Birthday">Birthday</option>
                <option value="Religious">Religious</option>
              </Form.Select>
              <span className="filter-clear-btn" onClick={() => setRefEvent("")}>Clear All</span>
            </div>

            {/* Status */}
            <div className="filter-capsule-container">
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748B", marginRight: "2px" }}>Status</span>
              <Form.Select
                className="filter-select-inner filter-select-status"
                value={refStatus}
                onChange={(e) => setRefStatus(e.target.value)}
                style={{ width: "110px" }}
              >
                <option value="">All</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </Form.Select>
              <span className="filter-clear-btn" onClick={() => setRefStatus("")}>Clear All</span>
            </div>

            {/* Reset */}
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={resetRefFilters}
              style={{ fontSize: "12px", fontWeight: "600", borderRadius: "8px" }}
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Refunds Table */}
      <div className="card border-0 shadow-sm" style={{ borderRadius: "16px" }}>
        <div className="card-body">
          {/* Tab Buttons */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            {["All", "Refunded", "Offline", "Online"].map((tab) => (
              <button
                key={tab}
                className="btn rounded-pill btn-sm px-3"
                onClick={() => { setActiveRefundFilter(tab); setRefPage(1); }}
                style={{
                  background: activeRefundFilter === tab ? "#D1FAE5" : "#fff",
                  color: activeRefundFilter === tab ? "#0F9D8A" : "#374151",
                  border: activeRefundFilter === tab ? "1px solid #A7F3D0" : "1px solid #D9DEE8",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="table-responsive">
            <Table className="table-custom" hover>
              <thead style={{ background: "#F8FAFC", whiteSpace: "nowrap" }}>
                <tr>
                  <th></th>
                  <th>REFUND ID</th>
                  <th>CUSTOMER</th>
                  <th>EVENT TYPE</th>
                  <th>AMOUNT</th>
                  <th>REQUESTED DATE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {currentRefunds.map((item) => (
                  <tr key={item.id}>
                    <td><input type="checkbox" /></td>
                    <td>
                      <div className="fw-semibold">{item.id}</div>
                      <small className="text-muted">{item.details}</small>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px", background: item.avatar, fontWeight: 600 }}>{item.initials}</div>
                        <div>
                          <div className="fw-semibold">{item.name}</div>
                          <small className="text-muted">{item.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ ...getEventStyle(item.event), display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "600" }}>
                        {item.event}
                      </span>
                    </td>
                    <td>{item.amount}</td>
                    <td>{item.date}</td>
                    <td>
                      <span style={{ ...getStatusStyle(item.status), display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "600" }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ fontSize: "20px", cursor: "pointer" }}>⋮</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3">
            <small className="text-muted">
              Showing {refStart + 1} - {Math.min(refStart + refItemsPerPage, filteredRefunds.length)} of {filteredRefunds.length} refunds
            </small>
            <nav className="d-flex align-items-center gap-2 flex-wrap">
              <button className="btn btn-light border" disabled={refPage === 1} onClick={() => setRefPage(refPage - 1)}>&lt;</button>
              {getRefPageNumbers().map((p, idx) =>
                p === "..." ? (
                  <span key={`dots-${idx}`} className="mx-1 text-muted">...</span>
                ) : (
                  <button key={`page-${p}`} onClick={() => setRefPage(p)} className="btn" style={{ width: "30px", height: "30px", padding: 0, border: "1px solid #E5E7EB", background: refPage === p ? "#0F9D8A" : "#fff", color: refPage === p ? "#fff" : "#374151" }}>
                    {p}
                  </button>
                )
              )}
              <button className="btn btn-light border" disabled={refPage === refTotalPages} onClick={() => setRefPage(refPage + 1)}>&gt;</button>
            </nav>
          </div>
        </div>
      </div>

      {/* ===== REFUND FORM & ACTIVITY ===== */}
      <div className="row g-4 mt-4">
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "16px", border: "1px solid #E5E7EB" }}>
            <div className="card-header bg-white d-flex justify-content-between align-items-center px-4 py-3">
              <div className="d-flex align-items-center gap-2">
                <FaMoneyCheckAlt style={{ color: "#0F9D8A", fontSize: "20px" }} />
                <h5 className="mb-0" style={{ fontSize: "16px", fontWeight: "600", color: "#1F2937" }}>Initiate Refund</h5>
              </div>
              <span className="badge rounded-pill" style={{ background: "#FFF4E5", color: "#F59E0B", padding: "7px 14px", fontSize: "12px", fontWeight: "600" }}>12 Pending Requests</span>
            </div>
            <div className="card-body p-4">
              <div className="mb-4">
                <label className="form-label" style={{ fontSize: "13px", fontWeight: "600", color: "#374151", textTransform: "uppercase" }}>Search Transaction ID / Attendee</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">🔍</span>
                  <input type="text" className="form-control border-start-0" placeholder="TXN-XXXX or attendee name" style={{ height: "44px", boxShadow: "none" }} />
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label" style={{ fontSize: "12px", fontWeight: "600", color: "#6B7280" }}>REFUND AMOUNT</label>
                  <input type="text" className="form-control" placeholder="Full or Partial" style={{ height: "44px", borderRadius: "10px" }} />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label" style={{ fontSize: "12px", fontWeight: "600", color: "#6B7280" }}>REFUND REASON</label>
                  <select className="form-select" style={{ height: "44px", borderRadius: "10px" }}>
                    <option>Event Cancelled</option>
                    <option>Duplicate Payment</option>
                    <option>Customer Request</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label" style={{ fontSize: "12px", fontWeight: "600", color: "#6B7280" }}>REFUND MODE</label>
                  <select className="form-select" style={{ height: "44px", borderRadius: "10px" }}>
                    <option>Original Method</option>
                    <option>Bank Transfer</option>
                    <option>Cash</option>
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label" style={{ fontSize: "12px", fontWeight: "600", color: "#6B7280" }}>PROCESS DATE</label>
                  <input type="date" className="form-control" style={{ height: "44px", borderRadius: "10px" }} />
                </div>
              </div>
              <div className="d-flex align-items-center gap-2 mb-4" style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "10px", padding: "12px" }}>
                <span style={{ color: "#EF4444", fontSize: "18px" }}>⚠</span>
                <span style={{ color: "#EF4444", fontSize: "13px", fontWeight: "500" }}>Refunds take 5–7 business days. This action cannot be undone.</span>
              </div>
              <button className="btn w-100" style={{ background: "#EF4444", color: "#fff", height: "44px", borderRadius: "10px", fontWeight: "600" }}>Process Refund</button>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "16px", border: "1px solid #E5E7EB" }}>
            <div className="card-body p-4">
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
                <div className="d-flex align-items-center gap-2">
                  <FiClock style={{ color: "#0F9D8A", fontSize: "20px" }} />
                  <h5 className="mb-0" style={{ fontSize: "16px", fontWeight: "600", color: "#1F2937" }}>Recent Refund Activity</h5>
                </div>
                <span style={{ color: "#0F9D8A", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}>View All</span>
              </div>
              <div className="row g-3 mb-4">
                <div className="col-12 col-sm-4">
                  <div className="border rounded-3 p-2 p-md-3 text-center" style={{ background: "#F9FAFB" }}>
                    <small className="text-muted d-block">This Month</small>
                    <h5 className="mt-2 mb-0" style={{ color: "#EF4444", fontWeight: "700" }}>₹18,400</h5>
                  </div>
                </div>
                <div className="col-12 col-sm-4">
                  <div className="border rounded-3 p-2 p-md-3 text-center" style={{ background: "#F9FAFB" }}>
                    <small className="text-muted d-block">Processed</small>
                    <h5 className="mt-2 mb-0" style={{ color: "#16A34A", fontWeight: "700" }}>8</h5>
                  </div>
                </div>
                <div className="col-12 col-sm-4">
                  <div className="border rounded-3 p-2 p-md-3 text-center" style={{ background: "#F9FAFB" }}>
                    <small className="text-muted d-block">Pending</small>
                    <h5 className="mt-2 mb-0" style={{ color: "#F59E0B", fontWeight: "700" }}>4</h5>
                  </div>
                </div>
              </div>
              <div className="flex-grow-1">
                <div className="d-flex align-items-start mb-4">
                  <div className="me-3 text-center">
                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px", background: "#DCFCE7", color: "#16A34A" }}><FaCheck /></div>
                    <div style={{ width: "2px", height: "38px", background: "#E5E7EB", margin: "0 auto" }} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-semibold" style={{ fontSize: "14px", wordBreak: "break-word" }}>Refund Processed – Riya Patel</div>
                    <small className="text-muted d-block">₹2,200 • Tech Summit</small>
                    <small className="text-muted d-block" style={{ fontSize: "12px" }}>18 Jun 2026</small>
                  </div>
                </div>
                <div className="d-flex align-items-start mb-4">
                  <div className="me-3 text-center">
                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px", background: "#FEF3C7", color: "#F59E0B" }}><FiClock /></div>
                    <div style={{ width: "2px", height: "38px", background: "#E5E7EB", margin: "0 auto" }} />
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-semibold" style={{ fontSize: "14px", wordBreak: "break-word" }}>Processing – Manoj Singh</div>
                    <small className="text-muted d-block">₹4,500 • Music Fest</small>
                    <small className="text-muted d-block" style={{ fontSize: "12px" }}>17 Jun 2026</small>
                  </div>
                </div>
                <div className="d-flex align-items-start mb-4">
                  <div className="me-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "36px", height: "36px", background: "#FEE2E2", color: "#EF4444" }}><FaTimes /></div>
                  </div>
                  <div>
                    <div className="fw-semibold" style={{ fontSize: "14px", wordBreak: "break-word" }}>Refund Failed – Ajay Tiwari</div>
                    <small className="text-muted d-block">₹3,000 • Startup Expo</small>
                    <small className="text-muted d-block" style={{ fontSize: "12px" }}>14 Jun 2026 • Retrying...</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;