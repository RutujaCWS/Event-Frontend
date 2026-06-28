import React, { useState } from "react";

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

const PaymentManagement = () => {

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
    statusBg: "#DCFCE7",
    statusColor: "#16A34A",
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
    statusBg: "#DCFCE7",
    statusColor: "#16A34A",
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
    statusBg: "#FEF3C7",
    statusColor: "#D97706",
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
    statusBg: "#DCFCE7",
    statusColor: "#16A34A",
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
  statusBg: "#FEE2E2",
  statusColor: "#DC2626",
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
  statusBg: "#DCFCE7",
  statusColor: "#16A34A",
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
    eventBg: "#FCE7F3",
    amount: "₹45,500",
    date: "14 Jun 2026",
    status: "Completed",
    statusBg: "#DCFCE7",
    statusColor: "#16A34A",
  },
  
  {
    id: "#TXN-8820",
    details: "Upto 50 guests",
    initials: "RP",
    avatar: "#FEE2E2",
    name: "Rohan Patel",
    email: "rohan@hotmail.com",
    event: "Corporate",
    eventBg: "#DBEAFE",
    amount: "₹45,500",
    date: "14 Jun 2026",
    status: "Completed",
    statusBg: "#DCFCE7",
    statusColor: "#16A34A",
  },
  {
    id: "#TXN-8819",
    details: "Full decor + entertainment",
    initials: "MG",
    avatar: "#FEF3C7",
    name: "Meena Gupta",
    email: "meena@yahoo.com",
    event: "Birthday",
    eventBg: "#FCE7F3",
    amount: "₹45,500",
    date: "13 Jun 2026",
    status: "Pending",
    statusBg: "#FEF3C7",
    statusColor: "#D97706",
  },
  {
    id: "#TXN-8818",
    details: "AV setup + hospitality",
    initials: "AS",
    avatar: "#D1FAE5",
    name: "Anjali Sharma",
    email: "anjali@gmail.com",
    event: "Religious",
    eventBg: "#EDE9FE",
    amount: "₹45,500",
    date: "12 Jun 2026",
    status: "Completed",
    statusBg: "#DCFCE7",
    statusColor: "#16A34A",
  },
];
const [activeRefundFilter, setActiveRefundFilter] = useState("All");
const [activeFilter, setActiveFilter] = useState("All");
const filteredTransactions =
  activeFilter === "All"
    ? transactions
    : activeFilter === "Pending"
    ? transactions.filter((item) => item.status === "Pending")
    : activeFilter === "Failed"
    ? transactions.filter((item) => item.status === "Failed")
    : activeFilter === "Offline"
    ? transactions.filter((item) => item.payment === "Offline")
    : transactions.filter((item) => item.payment === "Online");

const filteredRefunds =
  activeRefundFilter === "All"
    ? refunds
    : activeRefundFilter === "Refunded"
    ? refunds.filter((item) => item.status === "Completed")
    : activeRefundFilter === "Offline"
    ? refunds.filter((item) => item.mode === "Offline")
    : refunds.filter((item) => item.mode === "Online");
const transactionItemsPerPage = 5;

const [transactionPage, setTransactionPage] = useState(1);

const transactionTotalPages = Math.ceil(
  filteredTransactions.length / transactionItemsPerPage
);

const transactionStart =
  (transactionPage - 1) * transactionItemsPerPage;

const currentTransactions = filteredTransactions.slice(
  transactionStart,
  transactionStart + transactionItemsPerPage
);

// Refund Pagination
const refundItemsPerPage = 5;

const [refundPage, setRefundPage] = useState(1);

const refundTotalPages = Math.ceil(
  filteredRefunds.length / refundItemsPerPage
);

const refundStart =
  (refundPage - 1) * refundItemsPerPage;

const currentRefunds = filteredRefunds.slice(
  refundStart,
  refundStart + refundItemsPerPage
);


  return (
   <div className="container-fluid px-0 py-3"
  style={{
    overflowX: "hidden",
  }}
>

      {/* Header */}
     

      <div className="row g-3 mb-4">
  {/* Total Revenue */}
  <div className="col" style={{ flex: "1 0 18%", minWidth: "160px" }}>
    <div className="card" style={{ borderRadius: "16px", border: "1px solid #E5E7EB" }}>
      <div className="card-body p-3">
        <div className="d-flex align-items-center gap-2 mb-2">
          <div className="d-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "#E8F8F4",
              color: "#10B981",
            }}>
            <FaRupeeSign size={20} />
          </div>
          <h2 className="mb-0 fw-bold" style={{ fontSize: "clamp(18px, 1.8vw, 22px)" }}>
            ₹8,42,500
          </h2>
        </div>
        <p className="mb-1 text-secondary" style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.3px" }}>
          TOTAL REVENUE
        </p>
        <small className="text-success" style={{ fontSize: "12px" }}>↗ +14.2% vs last month</small>
      </div>
    </div>
  </div>

  {/* Offline */}
  <div className="col" style={{ flex: "1 0 18%", minWidth: "160px" }}>
    <div className="card" style={{ borderRadius: "16px", border: "1px solid #E5E7EB" }}>
      <div className="card-body p-3">
        <div className="d-flex align-items-center gap-2 mb-2">
          <div className="d-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "#FFF7E6",
              color: "#F59E0B",
            }}>
            <FaMoneyCheckAlt size={20} />
          </div>
          <h2 className="mb-0 fw-bold" style={{ fontSize: "clamp(18px, 1.8vw, 22px)" }}>
            ₹3,24,300
          </h2>
        </div>
        <p className="mb-1 text-secondary" style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.3px" }}>
          OFFLINE COLLECTED
        </p>
        <small className="text-success" style={{ fontSize: "12px" }}>↗ +9% vs last month</small>
      </div>
    </div>
  </div>

  {/* Online */}
  <div className="col" style={{ flex: "1 0 18%", minWidth: "160px" }}>
    <div className="card" style={{ borderRadius: "16px", border: "1px solid #E5E7EB" }}>
      <div className="card-body p-3">
        <div className="d-flex align-items-center gap-2 mb-2">
          <div className="d-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "#E8F8F4",
              color: "#10B981",
            }}>
            <FaWallet size={20} />
          </div>
          <h2 className="mb-0 fw-bold" style={{ fontSize: "clamp(18px, 1.8vw, 22px)" }}>
            ₹5,18,200
          </h2>
        </div>
        <p className="mb-1 text-secondary" style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.3px" }}>
          ONLINE COLLECTED
        </p>
        <small className="text-success" style={{ fontSize: "12px" }}>↗ +8.7% last month</small>
      </div>
    </div>
  </div>

  {/* Refund */}
  <div className="col" style={{ flex: "1 0 18%", minWidth: "160px" }}>
    <div className="card" style={{ borderRadius: "16px", border: "1px solid #E5E7EB" }}>
      <div className="card-body p-3">
        <div className="d-flex align-items-center gap-2 mb-2">
          <div className="d-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "#FEE2E2",
              color: "#EF4444",
            }}>
            <FaUndoAlt size={20} />
          </div>
          <h2 className="mb-0 fw-bold" style={{ fontSize: "clamp(18px, 1.8vw, 22px)" }}>
            ₹18,400
          </h2>
        </div>
        <p className="mb-1 text-secondary" style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.3px" }}>
          TOTAL REFUNDS
        </p>
        <small className="text-danger" style={{ fontSize: "12px" }}>12 requests</small>
      </div>
    </div>
  </div>

  {/* Total Value */}
  <div className="col" style={{ flex: "1 0 18%", minWidth: "160px" }}>
    <div className="card" style={{ borderRadius: "16px", border: "1px solid #E5E7EB" }}>
      <div className="card-body p-3">
        <div className="d-flex align-items-center gap-2 mb-2">
          <div className="d-flex align-items-center justify-content-center flex-shrink-0"
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "#EEF2FF",
              color: "#4F46E5",
            }}>
            <FaChartLine size={20} />
          </div>
          <h2 className="mb-0 fw-bold" style={{ fontSize: "clamp(18px, 1.8vw, 22px)" }}>
            ₹45L
          </h2>
        </div>
        <p className="mb-1 text-secondary" style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.3px" }}>
          TOTAL VALUE
        </p>
        <small className="text-success" style={{ fontSize: "12px" }}>↗ +12% vs last month</small>
      </div>
    </div>
  </div>
</div>
  <div className="d-flex justify-content-between align-items-start align-items-md-center flex-column flex-md-row gap-3 mb-3">

  {/* Left */}
  <div className="d-flex align-items-center gap-3">
    <h2
      className="mb-0"
      style={{
        fontSize: "20px",
        fontWeight: "700",
        color: "#1F2937",
      }}
    >
      Transaction
    </h2>

    <span
      className="badge rounded-pill"
      style={{
        background: "#befaf3",
        color: "#0D9488",
        fontSize: "11px",
        fontWeight: "600",
        padding: "5px 10px",
      }}
    >
      214 Total
    </span>
  </div>

  {/* Right */}
  <div className="d-flex flex-row flex-md-row gap-2 w-100 justify-content-md-end">

    <button
      className="btn btn-outline-secondary flex-fill flex-md-grow-0"
      style={{
        height: "33px",
        minWidth: "90px",
        border: "1px solid #D9DEE8",
        borderRadius: "10px",
        background: "#FFFFFF",
        color: "#6B7280",
        fontWeight: "600",
        fontSize: "14px",
      }}
    >
      <FaFilter className="me-2" />
      Filter
    </button>

    <button
      className="btn flex-fill flex-md-grow-0"
      style={{
        background: "#0F9D8A",
        color: "#fff",
        height: "33px",
        minWidth: "180px",
        borderRadius: "10px",
      }}
    >
      Manage Transaction
    </button>

  </div>

</div>
<div
  className="card border-0 shadow-sm"
  style={{
    borderRadius: "16px",
  }}
>
  <div className="card-body">
<div className="d-flex justify-content-between align-items-center mb-3">
<div className="d-flex flex-wrap gap-2 mb-3">

<button
  className="btn rounded-pill btn-sm px-3"
  onClick={() => {
    setActiveFilter("All");
    setTransactionPage(1);
  }}
  style={{
    background: activeFilter === "All" ? "#D1FAE5" : "#fff",
    color: activeFilter === "All" ? "#0F9D8A" : "#374151",
    border: "1px solid #A7F3D0",
  }}
>
  All
</button>

  <button
  className="btn rounded-pill btn-sm px-3"
  onClick={() => {
    setActiveFilter("Pending");
    setTransactionPage(1);
  }}
  style={{
    background: activeFilter === "Pending" ? "#D1FAE5" : "#fff",
    color: activeFilter === "Pending" ? "#0F9D8A" : "#374151",
    border: "1px solid #A7F3D0",
  }}
>
  Pending
</button>

 <button
  className="btn rounded-pill btn-sm px-3"
  onClick={() => {
    setActiveFilter("Failed");
    setTransactionPage(1);
  }}
  style={{
    background: activeFilter === "Failed" ? "#D1FAE5" : "#fff",
    color: activeFilter === "Failed" ? "#0F9D8A" : "#374151",
    border: "1px solid #A7F3D0",
  }}
>
  Failed
</button>

 <button
  className="btn rounded-pill btn-sm px-3"
  onClick={() => {
    setActiveFilter("Offline");
    setTransactionPage(1);
  }}
  style={{
    background: activeFilter === "Offline" ? "#D1FAE5" : "#fff",
    color: activeFilter === "Offline" ? "#0F9D8A" : "#374151",
    border: "1px solid #A7F3D0",
  }}
>
  Offline
</button>

 <button
  className="btn rounded-pill btn-sm px-3"
  onClick={() => {
    setActiveFilter("Online");
    setTransactionPage(1);
  }}
  style={{
    background: activeFilter === "Online" ? "#D1FAE5" : "#fff",
    color: activeFilter === "Online" ? "#0F9D8A" : "#374151",
    border: "1px solid #A7F3D0",
  }}
>
  Online
</button>

</div>

</div>
<div className="table-responsive">
  <table className="table custom-table mb-0 align-middle">

  <thead style={{ background: "#F8FAFC", whiteSpace: "nowrap", }}>
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

        <td>
          <input type="checkbox" />
        </td>

        <td>
          <div className="fw-semibold">{item.id}</div>
          <small className="text-muted">{item.details}</small>
        </td>

        <td>
          <div className="d-flex align-items-center gap-2">

            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: "40px",
                height: "40px",
                background: item.avatar,
                fontWeight: 600,
              }}
            >
              {item.initials}
            </div>

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
          <span
            className="badge rounded-pill"
            style={{
              background: item.statusBg,
              color: item.statusColor,
            }}
          >
            {item.status}
          </span>
        </td>

        <td style={{ fontSize: "20px" }}>⋮</td>

      </tr>
    ))}
  </tbody>

</table>
</div>
         <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3">

<small className="text-muted">
  Showing {transactionStart + 1} -
  {Math.min(
    transactionStart + transactionItemsPerPage,
    filteredTransactions.length
  )}{" "}
  of {filteredTransactions.length} transactions
</small>

<nav className="d-flex align-items-center gap-2 flex-wrap">

  <button
    className="btn btn-light border"
    disabled={transactionPage === 1}
    onClick={() => setTransactionPage(transactionPage - 1)}
  >
    &lt;
  </button>

  {Array.from({ length: transactionTotalPages }, (_, index) => (
    <button
      key={index}
      onClick={() => setTransactionPage(index + 1)}
      className="btn"
      style={{
        width: "30px",
        height: "30px",
        padding: 0,
        border: "1px solid #E5E7EB",
        background:
          transactionPage === index + 1
            ? "#0F9D8A"
            : "#fff",
        color:
          transactionPage === index + 1
            ? "#fff"
            : "#374151",
      }}
    >
      {index + 1}
    </button>
  ))}

  <button
    className="btn btn-light border"
    disabled={transactionPage === transactionTotalPages}
    onClick={() => setTransactionPage(transactionPage + 1)}
  >
    &gt;
  </button>

</nav>

</div>

</div>
</div>

<div className="d-flex justify-content-between align-items-start align-items-md-center flex-column flex-md-row gap-3 mb-3 mt-3">

  {/* Left */}
  <div className="d-flex align-items-center gap-3">
    <h2
      className="mb-0"
      style={{
        fontSize: "20px",
        fontWeight: "700",
        color: "#1F2937",
      }}
    >
      Refund Request
    </h2>

    <span
      className="badge rounded-pill"
      style={{
        background: "#befaf3",
        color: "#0D9488",
        fontSize: "11px",
        fontWeight: "600",
        padding: "5px 10px",
      }}
    >
      25 Total
    </span>
  </div>

  {/* Right */}
  <div className="d-flex flex-row gap-2 w-100 justify-content-md-end">

    <button
      className="btn btn-outline-secondary flex-fill flex-md-grow-0"
      style={{
        height: "33px",
        minWidth: "90px",
        borderRadius: "10px",
        fontSize: "14px",
      }}
    >
      <FaFilter className="me-2" />
      Filter
    </button>

    <button
      className="btn flex-fill flex-md-grow-0"
      style={{
        background: "#0F9D8A",
        color: "#fff",
        height: "33px",
        minWidth: "180px",
        borderRadius: "10px",
      }}
    >
      Manage Transaction
    </button>

  </div>

</div>

<div
  className="card border-0 shadow-sm"
  style={{ borderRadius: "16px" }}
>
  <div className="card-body">

    <div className="d-flex justify-content-between align-items-center mb-3">

     <div className="d-flex flex-wrap gap-2 mb-3">

 <button
  className="btn rounded-pill btn-sm px-3"
  onClick={() => {
    setActiveRefundFilter("All");
    setRefundPage(1);
  }}
  style={{
    background: activeRefundFilter === "All" ? "#D1FAE5" : "#FFFFFF",
    color: activeRefundFilter === "All" ? "#0F9D8A" : "#6B7280",
    border:
      activeRefundFilter === "All"
        ? "1px solid #A7F3D0"
        : "1px solid #D1D5DB",
  }}
>
  All
</button>

    <button
  className="btn rounded-pill btn-sm px-3"
  onClick={() => {
    setActiveRefundFilter("Refunded");
    setRefundPage(1);
  }}
  style={{
    background: activeRefundFilter === "Refunded" ? "#D1FAE5" : "#FFFFFF",
    color: activeRefundFilter === "Refunded" ? "#0F9D8A" : "#6B7280",
    border:
      activeRefundFilter === "Refunded"
        ? "1px solid #A7F3D0"
        : "1px solid #D1D5DB",
  }}
>
  Refunded
</button>

     <button
  className="btn rounded-pill btn-sm px-3"
  onClick={() => {
    setActiveRefundFilter("Offline");
    setRefundPage(1);
  }}
  style={{
    background: activeRefundFilter === "Offline" ? "#D1FAE5" : "#FFFFFF",
    color: activeRefundFilter === "Offline" ? "#0F9D8A" : "#6B7280",
    border:
      activeRefundFilter === "Offline"
        ? "1px solid #A7F3D0"
        : "1px solid #D1D5DB",
  }}
>
  Offline
</button>

      <button
  className="btn rounded-pill btn-sm px-3"
  onClick={() => {
    setActiveRefundFilter("Online");
    setRefundPage(1);
  }}
  style={{
    background: activeRefundFilter === "Online" ? "#D1FAE5" : "#FFFFFF",
    color: activeRefundFilter === "Online" ? "#0F9D8A" : "#6B7280",
    border:
      activeRefundFilter === "Online"
        ? "1px solid #A7F3D0"
        : "1px solid #D1D5DB",
  }}
>
  Online
</button>

      </div>


    </div>

   <div className="table-responsive">
  <table className="table custom-table mb-0 align-middle">

  <thead style={{ background: "#F8FAFC" ,whiteSpace: "nowrap",}}>
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

        <td>
          <input type="checkbox" />
        </td>

        <td>
          <div className="fw-semibold">{item.id}</div>
          <small className="text-muted">{item.details}</small>
        </td>

        <td>
          <div className="d-flex align-items-center gap-2">

            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: "40px",
                height: "40px",
                background: item.avatar,
                fontWeight: "600",
              }}
            >
              {item.initials}
            </div>

            <div>
              <div className="fw-semibold">{item.name}</div>
              <small className="text-muted">{item.email}</small>
            </div>

          </div>
        </td>

        <td>
          <span
            className="badge rounded-pill text-dark"
            style={{ background: item.eventBg }}
          >
            {item.event}
          </span>
        </td>

        <td>{item.amount}</td>

        <td>{item.date}</td>

        <td>
          <span
            className="badge rounded-pill"
            style={{
              background: item.statusBg,
              color: item.statusColor,
            }}
          >
            {item.status}
          </span>
        </td>

        <td style={{ fontSize: "20px", cursor: "pointer" }}>
          ⋮
        </td>

      </tr>

    ))}

  </tbody>

</table>
</div>
         <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3">

 <small className="text-muted">
  Showing {refundStart + 1} -
  {Math.min(
    refundStart + refundItemsPerPage,
    filteredRefunds.length
  )} of {filteredRefunds.length} refunds
</small>

  <nav className="d-flex align-items-center gap-2 flex-wrap">

  <button
    className="btn btn-light border"
    disabled={refundPage === 1}
    onClick={() => setRefundPage(refundPage - 1)}
  >
    &lt;
  </button>

  {Array.from({ length: refundTotalPages }, (_, index) => (
    <button
      key={index}
      onClick={() => setRefundPage(index + 1)}
      className="btn"
      style={{
        width: "30px",
        height: "30px",
        padding: 0,
        border: "1px solid #E5E7EB",
        background:
          refundPage === index + 1
            ? "#0F9D8A"
            : "#fff",
        color:
          refundPage === index + 1
            ? "#fff"
            : "#374151",
      }}
    >
      {index + 1}
    </button>
  ))}

  <button
    className="btn btn-light border"
    disabled={refundPage === refundTotalPages}
    onClick={() => setRefundPage(refundPage + 1)}
  >
    &gt;
  </button>

</nav>

</div>
  </div>
  
</div>
<div className="row g-4 mt-4">
<div className="col-12 col-lg-6">

  <div
    className="card border-0 shadow-sm h-100"
    style={{
      borderRadius: "16px",
      border: "1px solid #E5E7EB",
    }}
  >

    {/* Header */}
    <div className="card-header bg-white d-flex justify-content-between align-items-center px-4 py-3">

      <div className="d-flex align-items-center gap-2">
        <FaMoneyCheckAlt
          style={{
            color: "#0F9D8A",
            fontSize: "20px",
          }}
        />

        <h5
          className="mb-0"
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#1F2937",
          }}
        >
          Initiate Refund
        </h5>
      </div>

      <span
        className="badge rounded-pill"
        style={{
          background: "#FFF4E5",
          color: "#F59E0B",
          padding: "7px 14px",
          fontSize: "12px",
          fontWeight: "600",
        }}
      >
        12 Pending Requests
      </span>

    </div>

    {/* Body */}

    <div className="card-body p-4">

      {/* Search */}

      <div className="mb-4">

        <label
          className="form-label"
          style={{
            fontSize: "13px",
            fontWeight: "600",
            color: "#374151",
            textTransform: "uppercase",
          }}
        >
          Search Transaction ID / Attendee
        </label>

        <div className="input-group">

          <span className="input-group-text bg-white border-end-0">
            🔍
          </span>

          <input
            type="text"
            className="form-control border-start-0"
            placeholder="TXN-XXXX or attendee name"
            style={{
              height: "44px",
              boxShadow: "none",
            }}
          />

        </div>

      </div>

      {/* Amount + Reason */}

      <div className="row g-3 mb-3">

        <div className="col-12 col-md-6">

          <label
            className="form-label"
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "#6B7280",
            }}
          >
            REFUND AMOUNT
          </label>

          <input
            type="text"
            className="form-control"
            placeholder="Full or Partial"
            style={{
              height: "44px",
              borderRadius: "10px",
            }}
          />

        </div>

        <div className="col-12 col-md-6">

          <label
            className="form-label"
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "#6B7280",
            }}
          >
            REFUND REASON
          </label>

          <select
            className="form-select"
            style={{
              height: "44px",
              borderRadius: "10px",
            }}
          >
            <option>Event Cancelled</option>
            <option>Duplicate Payment</option>
            <option>Customer Request</option>
            <option>Other</option>
          </select>

        </div>

      </div>

      {/* Refund Mode + Date */}

      <div className="row g-3 mb-3">

        <div className="col-12 col-md-6">

          <label
            className="form-label"
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "#6B7280",
            }}
          >
            REFUND MODE
          </label>

          <select
            className="form-select"
            style={{
              height: "44px",
              borderRadius: "10px",
            }}
          >
            <option>Original Method</option>
            <option>Bank Transfer</option>
            <option>Cash</option>
          </select>

        </div>

        <div className="col-12 col-md-6">

          <label
            className="form-label"
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "#6B7280",
            }}
          >
            PROCESS DATE
          </label>

          <input
            type="date"
            className="form-control"
            style={{
              height: "44px",
              borderRadius: "10px",
            }}
          />

        </div>

      </div>

      {/* Warning */}

      <div
        className="d-flex align-items-center gap-2 mb-4"
        style={{
          background: "#FEF2F2",
          border: "1px solid #FECACA",
          borderRadius: "10px",
          padding: "12px",
        }}
      >

        <span
          style={{
            color: "#EF4444",
            fontSize: "18px",
          }}
        >
          ⚠
        </span>

        <span
          style={{
            color: "#EF4444",
            fontSize: "13px",
            fontWeight: "500",
          }}
        >
          Refunds take 5–7 business days. This action cannot be undone.
        </span>

      </div>

      <button
        className="btn w-100"
        style={{
          background: "#EF4444",
          color: "#fff",
          height: "44px",
          borderRadius: "10px",
          fontWeight: "600",
        }}
      >
        Process Refund
      </button>

    </div>

  </div>

</div>
<div className="col-12 col-lg-6">

  <div
    className="card border-0 shadow-sm h-100"
    style={{
      borderRadius: "16px",
      border: "1px solid #E5E7EB",
    }}
  >

    <div className="card-body p-4">

      {/* Header */}
    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">

        <div className="d-flex align-items-center gap-2">
          <FiClock
            style={{
              color: "#0F9D8A",
              fontSize: "20px",
            }}
          />

          <h5
            className="mb-0"
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#1F2937",
            }}
          >
            Recent Refund Activity
          </h5>
        </div>

        <span
          style={{
            color: "#0F9D8A",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          View All
        </span>

      </div>

      {/* Summary */}

      <div className="row g-3 mb-4">

     <div className="col-12 col-sm-4">
          <div
            className="border rounded-3 p-2 p-md-3 text-center"
            style={{ background: "#F9FAFB" }}
          >
            <small className="text-muted d-block">This Month</small>

            <h5
              className="mt-2 mb-0"
              style={{
                color: "#EF4444",
                fontWeight: "700",
              }}
            >
              ₹18,400
            </h5>
          </div>
        </div>

       <div className="col-12 col-sm-4">
          <div
            className="border rounded-3 p-2 p-md-3 text-center"
            style={{ background: "#F9FAFB" }}
          >
            <small className="text-muted d-block">Processed</small>

            <h5
              className="mt-2 mb-0"
              style={{
                color: "#16A34A",
                fontWeight: "700",
              }}
            >
              8
            </h5>
          </div>
        </div>

       <div className="col-12 col-sm-4">
          <div
          className="border rounded-3 p-2 p-md-3 text-center"
            style={{ background: "#F9FAFB" }}
          >
            <small className="text-muted d-block">Pending</small>

            <h5
              className="mt-2 mb-0"
              style={{
                color: "#F59E0B",
                fontWeight: "700",
              }}
            >
              4
            </h5>
          </div>
        </div>

      </div>

      {/* Timeline */}

     <div className="flex-grow-1">

        {/* Item 1 */}
      <div className="d-flex align-items-start mb-4">

          <div className="me-3 text-center">

            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: "36px",
                height: "36px",
                background: "#DCFCE7",
                color: "#16A34A",
              }}
            >
              <FaCheck />
            </div>

            <div
              style={{
                width: "2px",
                height: "38px",
                background: "#E5E7EB",
                margin: "0 auto",
              }}
            />

          </div>

         <div className="flex-grow-1">

            <div
                className="fw-semibold"
                style={{
                    fontSize: "14px",
                    wordBreak: "break-word",
                }}
                >
              Refund Processed – Riya Patel
            </div>

            <small className="text-muted d-block">
              ₹2,200 • Tech Summit
            </small>

           <small
            className="text-muted d-block"
            style={{
                fontSize: "12px",
            }}
            >
              18 Jun 2026
            </small>

          </div>

        </div>

        {/* Item 2 */}
       <div className="d-flex align-items-start mb-4">

          <div className="me-3 text-center">

            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: "36px",
                height: "36px",
                background: "#FEF3C7",
                color: "#F59E0B",
              }}
            >
              <FiClock />
            </div>

            <div
              style={{
                width: "2px",
                height: "38px",
                background: "#E5E7EB",
                margin: "0 auto",
              }}
            />

          </div>

         <div className="flex-grow-1">

            <div
                className="fw-semibold"
                style={{
                    fontSize: "14px",
                    wordBreak: "break-word",
                }}
                >
              Processing – Manoj Singh
            </div>

            <small className="text-muted d-block">
              ₹4,500 • Music Fest
            </small>

           <small
            className="text-muted d-block"
            style={{
                fontSize: "12px",
            }}
            >
              17 Jun 2026
            </small>

          </div>

        </div>

        {/* Item 3 */}
      <div className="d-flex align-items-start mb-4">

          <div className="me-3">

            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: "36px",
                height: "36px",
                background: "#FEE2E2",
                color: "#EF4444",
              }}
            >
              <FaTimes />
            </div>

          </div>

          <div>

            <div
                className="fw-semibold"
                style={{
                    fontSize: "14px",
                    wordBreak: "break-word",
                }}
                >
              Refund Failed – Ajay Tiwari
            </div>

            <small className="text-muted d-block">
              ₹3,000 • Startup Expo
            </small>

           <small
            className="text-muted d-block"
            style={{
                fontSize: "12px",
            }}
            >
              14 Jun 2026 • Retrying...
            </small>

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