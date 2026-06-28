import { FaSearch, FaDownload } from "react-icons/fa";
import { FaRegCalendarAlt, FaUpload ,FaFilter,} from "react-icons/fa";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import React, { useState } from "react";
import {
  FaEnvelope,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUniversity,
} from "react-icons/fa";
const ReportsManagement = () => {
    const enquiries = [
  {
    id: "#ENQ-1041",
    details: "Upto 50 guests • Premium",
    initials: "MG",
    avatar: "#FEF3C7",
    name: "Meena Gupta",
    email: "meena@yahoo.com",
    event: "Wedding",
    eventBg: "#FCE7F3",
    date: "Jul 12, 2026",
    budget: "₹1,20,000",
    priority: "High",
    priorityColor: "text-danger",
    status: "Follow-up",
    statusBg: "#DBEAFE",
    statusColor: "#1D4ED8",
  },
  {
    id: "#ENQ-1042",
    details: "Corporate Event",
    initials: "RP",
    avatar: "#DBEAFE",
    name: "Rohan Patil",
    email: "rohan@gmail.com",
    event: "Corporate",
    eventBg: "#DBEAFE",
    date: "Jun 28, 2026",
    budget: "₹65,000",
    priority: "Medium",
    priorityColor: "text-warning",
    status: "New",
    statusBg: "#FEF3C7",
    statusColor: "#D97706",
  },
  {
    id: "#ENQ-1043",
    details: "Birthday Celebration",
    initials: "AS",
    avatar: "#D1FAE5",
    name: "Anjali Sharma",
    email: "anjali@gmail.com",
    event: "Birthday",
    eventBg: "#FCE7F3",
    date: "Jun 25, 2026",
    budget: "₹25,000",
    priority: "Low",
    priorityColor: "text-success",
    status: "Confirmed",
    statusBg: "#DCFCE7",
    statusColor: "#16A34A",
  },
  {
    id: "#ENQ-1044",
    details: "Religious Function",
    initials: "NK",
    avatar: "#FEE2E2",
    name: "Nikhil Kumar",
    email: "nikhil@yahoo.com",
    event: "Religious",
    eventBg: "#FEF3C7",
    date: "Jul 05, 2026",
    budget: "₹48,000",
    priority: "High",
    priorityColor: "text-danger",
    status: "Follow-up",
    statusBg: "#DBEAFE",
    statusColor: "#1D4ED8",
  },
  {
    id: "#ENQ-1045",
    details: "Reception Event",
    initials: "PS",
    avatar: "#E9D5FF",
    name: "Priya Singh",
    email: "priya@gmail.com",
    event: "Reception",
    eventBg: "#EDE9FE",
    date: "Jul 18, 2026",
    budget: "₹95,000",
    priority: "Medium",
    priorityColor: "text-warning",
    status: "Pending",
    statusBg: "#FEF3C7",
    statusColor: "#D97706",
  },
];
const [activeReportFilter, setActiveReportFilter] = useState("All");
const filteredEnquiries =
  activeReportFilter === "All"
    ? enquiries
    : activeReportFilter === "Enquiry Report"
    ? enquiries.filter((item) => item.event === "Wedding" || item.event === "Corporate")
    : activeReportFilter === "Booking Report"
    ? enquiries.filter((item) => item.status === "Confirmed")
    : activeReportFilter === "GST Report"
    ? enquiries.filter((item) => Number(item.budget.replace(/[₹,]/g, "")) >= 50000)
    : enquiries.filter((item) => item.status === "Pending");


const itemsPerPage = 5;

const [currentPage, setCurrentPage] = useState(1);

const totalPages = Math.ceil(
  filteredEnquiries.length / itemsPerPage
);

const startIndex = (currentPage - 1) * itemsPerPage;

const currentEnquiries = filteredEnquiries.slice(
  startIndex,
  startIndex + itemsPerPage
);
  return (
     <div className="container-fluid px-0 py-3">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <div>
         <h2
  className="mb-0"
  style={{
    fontSize: "20px",
    fontWeight: 700,
    color: "#1F2937",
  }}
>
  Reports Management
</h2>
        
        </div>
   <div className="d-flex align-items-center gap-2 flex-wrap">
          <button className="dashboard-btn-outline"
         style={{
    marginTop:"10px"
  }} >
            <FaRegCalendarAlt />
            <span>Last 30 Days</span>
          </button>
          <button className="dashboard-btn-primary"
              style={{
    marginTop:"10px"
  }}>
            <FaDownload />
            <span>Export Summary</span>
          </button>
        </div>
      </div>

      {/* Statistics */}

   <div className="row g-4 mb-4">

  {/* Card 1 */}
  <div className="col-xl-3 col-lg-4 col-md-6">
    <div
      className="card "
    
  
  style={{
    borderRadius: "16px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    minHeight: "120px",
    height:"144px"  
  }}
>

     <div className="card-body px-4 py-2">

        <div className="d-flex align-items-center gap-3 mb-3">

          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              width: "55px",
              height: "50px",
              borderRadius: "12px",
              background: "#E8F8F4",
              color: "#14B8A6",
              fontSize: "24px",
            }}
          >
            <FaEnvelope />
          </div>

          <h2
            className="mb-0 "
            style={{
                fontSize: "24px",
                fontWeight: "700",
                lineHeight: "32px",
              color: "#111827",
            }}
          >
            1,284
          </h2>

        </div>
<p
  className="mb-2"
  style={{
    fontSize: "14px",
    fontWeight: "500",
    color: "#6B7280",
  }}
>
  TOTAL ENQUIRIES
</p>
     <small
  className="mt-auto"
  style={{
    fontSize: "11px",
    fontWeight: "500",
    color: "#10B981",
  }}
>
  ↗ +18% vs last month
</small>

      </div>
    </div>
  </div>

  {/* Card 2 */}
  <div className="col-xl-3 col-lg-4 col-md-6">
  <div
    className="card "
    style={{
    borderRadius: "16px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    minHeight: "144px",  
    }}
  >
    <div className="card-body px-4 py-2">

        <div className="d-flex align-items-center gap-3 mb-3">

        <div
             className="d-flex justify-content-center align-items-center"
          style={{
          width: "55px",
              height: "50px",
              borderRadius: "12px",
            background: "#EAF1FF",
            color: "#2563EB",
               fontSize: "24px",
          }}
        >
          <FaCalendarAlt size={24} />
        </div>

        <h2
          className="mb-0"
          style={{
            fontSize: "24px",
            fontWeight: "700",
            lineHeight: "32px",
            color: "#111827",
          }}
        >
          847
        </h2>

      </div>
<p
  className="mb-2"
  style={{
    fontSize: "14px",
    fontWeight: "500",
    color: "#6B7280",
    letterSpacing: "0.2px",
  }}
>
  TOTAL BOOKINGS
</p>

<small
className="mt-auto"
  style={{
    color: "#10B981",
    fontSize: "11px",
    fontWeight: "600",
  }}
>
 
  ↗ +11.4%
</small>

    </div>
  </div>
</div>

  {/* Card 3 */}
    <div className="col-xl-3 col-lg-4 col-md-6">
    <div
      className="card"
       style={{
    borderRadius: "16px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    minHeight: "144px", 
    height:"144px" 
    }}
    >
     <div className="card-body px-4 py-2">

        <div className="d-flex align-items-center gap-3 mb-3">

          <div
             className="d-flex justify-content-center align-items-center"
            style={{
             width: "55px",
              height: "50px",
              borderRadius: "12px",
              background: "#ECFDF5",
              color: "#10B981",
              fontSize: "24px",
            }}
          >
            <FaMoneyBillWave />
          </div>

          <h2  className="mb-0"
          style={{
            fontSize: "24px",
            fontWeight: "700",
            lineHeight: "32px",
            color: "#111827",
          }}>
            ₹8,42,500
          </h2>

        </div>

        <p
        className="mb-2"
        style={{
            fontSize: "14px",
            fontWeight: "500",
            color: "#6B7280",
            letterSpacing: "0.2px",
        }}
        >
          TOTAL PAYMENTS
        </p>

        <small className="mt-auto"
        style={{
            color: "#10B981",
            fontSize: "11px",
            fontWeight: "600",
        }}
>
          ↗ +14.2%
        </small>

      </div>
    </div>
  </div>

  {/* Card 4 */}
   <div className="col-xl-3 col-lg-4 col-md-6">
    <div
      className="card"
       style={{
    borderRadius: "16px",
    border: "1px solid #E5E7EB",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    minHeight: "144px", 
    height:"144px" 
    }}
    >
     <div className="card-body px-4 py-2">

        <div className="d-flex align-items-center gap-3 mb-3">

          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              width: "55px",
              height: "50px",
              borderRadius: "12px",
              background: "#FFF8EB",
              color: "#F59E0B",
              fontSize: "24px",
            }}
          >
            <FaUniversity />
          </div>

          <h2 className="mb-0"  
          style={{
            fontSize: "24px",
            fontWeight: "700",
            lineHeight: "32px",
            color: "#111827",
          }}>
            ₹1,51,650
          </h2>

        </div>

        <p   className="mb-2"
        style={{
            fontSize: "14px",
            fontWeight: "500",
            color: "#6B7280",
            letterSpacing: "0.2px",
        }}
        >
          GST COLLECTED
        </p>

        <small className="mt-auto"
        style={{
            color: "#10B981",
            fontSize: "11px",
            fontWeight: "600",
        }}>
          ↗ 18% GST applied
        </small>

      </div>
    </div>
  </div>

</div>

       <div className="d-flex justify-content-between align-items-start flex-wrap mb-3">

  <div className="d-flex align-items-center gap-2 mb-2">
        <h2
  className="mb-0"
  style={{
    fontSize: "20px",
    fontWeight: 700,
    color: "#1F2937",
  }}
>
  Enquiry Report
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
      254 total
    </span>
  </div>

  <div className="d-flex gap-2 mb-2">

  <button
    className="btn d-flex align-items-center justify-content-center gap-2"
    style={{
      height: "33px",
      minWidth: "80px",
      border: "1px solid #D9DEE8",
      borderRadius: "10px",
      background: "#FFFFFF",
      color: "#6B7280",
      fontWeight: "600",
      fontSize: "14px",
    }}
  >
    <FaFilter size={13} />
    Filter
  </button>

  <button
    className="btn d-flex align-items-center justify-content-center gap-2"
    style={{
      height: "33px",
      minWidth: "95px",
      border: "1px solid #0F9D8A",
      borderRadius: "10px",
      background: "#FFFFFF",
      color: "#0F9D8A",
      fontWeight: "600",
      fontSize: "14px",
    }}
  >
    <FaUpload size={13} />
    Export
  </button>

</div>

</div>
            {/* Reports Section */}
  <div
  className="card"
  style={{
    border: "1px solid #E5E7EB",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  }}
>

        <div className="card-body">
<div
  className="d-flex gap-2 flex-nowrap overflow-auto"
  style={{
    whiteSpace: "nowrap",
  }}
>

  <button
  className="btn rounded-pill btn-sm px-3"
  onClick={() => {
    setActiveReportFilter("All");
    setCurrentPage(1);
  }}
  style={{
    background: activeReportFilter === "All" ? "#D1FAE5" : "#FFFFFF",
    color: activeReportFilter === "All" ? "#0F9D8A" : "#6B7280",
    border:
      activeReportFilter === "All"
        ? "1px solid #A7F3D0"
        : "1px solid #D1D5DB",
  }}
>
  All
</button>

<button
  className="btn rounded-pill btn-sm px-3"
  onClick={() => {
    setActiveReportFilter("Enquiry Report");
    setCurrentPage(1);
  }}
  style={{
    background:
      activeReportFilter === "Enquiry Report"
        ? "#D1FAE5"
        : "#FFFFFF",
    color:
      activeReportFilter === "Enquiry Report"
        ? "#0F9D8A"
        : "#6B7280",
    border:
      activeReportFilter === "Enquiry Report"
        ? "1px solid #A7F3D0"
        : "1px solid #D1D5DB",
  }}
>
  Enquiry Report
</button>

 <button
  className="btn rounded-pill btn-sm px-3"
  onClick={() => {
    setActiveReportFilter("Booking Report");
    setCurrentPage(1);
  }}
   style={{
    background:
      activeReportFilter === "Booking Report"
        ? "#D1FAE5"
        : "#FFFFFF",
    color:
      activeReportFilter === "Booking Report"
        ? "#0F9D8A"
        : "#6B7280",
    border:
      activeReportFilter === "Booking Report"
        ? "1px solid #A7F3D0"
        : "1px solid #D1D5DB",
  }}
>
  Booking Report
</button>
<button
  className="btn rounded-pill btn-sm px-3"
  onClick={() => {
    setActiveReportFilter(" GST Report");
    setCurrentPage(1);
  }}
  style={{
    background: activeReportFilter === " GST Report" ? "#D1FAE5" : "#FFFFFF",
    color: activeReportFilter === " GST Report" ? "#0F9D8A" : "#6B7280",
    border:
      activeReportFilter === " GST Report"
        ? "1px solid #A7F3D0"
        : "1px solid #D1D5DB",
  }}
>
  GST Report
</button>

  <button
  className="btn rounded-pill btn-sm px-3"
  onClick={() => {
    setActiveReportFilter("  Payment Report");
    setCurrentPage(1);
  }}
   style={{
    background: activeReportFilter === "  Payment Report" ? "#D1FAE5" : "#FFFFFF",
    color: activeReportFilter === "  Payment Report" ? "#0F9D8A" : "#6B7280",
    border:
      activeReportFilter === "  Payment Report"
        ? "1px solid #A7F3D0"
        : "1px solid #D1D5DB",
  }}
>
  Payment Report
</button>


<button
  className="btn btn-light border d-flex align-items-center justify-content-between px-3 ms-auto"
  style={{
    width: "180px",
    height: "27px",
    borderRadius: "10px",
    color: "#6B7280",
    fontSize: "14px",
    fontWeight: "500",
    borderColor: "#D9DEE8",
  }}
>
  <span>Sort: Newest First</span>
  <i className="bi bi-chevron-down"></i>
</button>
</div>

          <div className="d-flex justify-content-between align-items-center mb-3">





</div>

   <div className="table-responsive w-100">
  <table className="table custom-table mb-0 align-middle w-100">
                
<thead>
  <tr>
    <th className="px-4 text-nowrap" style={{ width: "50px" }}>
      <input type="checkbox" />
    </th>

    <th className="text-uppercase fw-semibold text-secondary text-nowrap" style={{ fontSize: "11px", letterSpacing: "0.06em" }}>
      ENQ. ID
    </th>

    <th className="text-uppercase fw-semibold text-secondary text-nowrap" style={{ fontSize: "11px", letterSpacing: "0.06em" }}>
      CUSTOMER
    </th>

    <th className="text-uppercase fw-semibold text-secondary text-nowrap" style={{ fontSize: "11px", letterSpacing: "0.06em" }}>
      EVENT TYPE
    </th>

    <th className="text-uppercase fw-semibold text-secondary text-nowrap" style={{ fontSize: "11px", letterSpacing: "0.06em" }}>
      EVENT DATE
    </th>

    <th className="text-uppercase fw-semibold text-secondary text-nowrap" style={{ fontSize: "11px", letterSpacing: "0.06em" }}>
      BUDGET
    </th>

    <th className="text-uppercase fw-semibold text-secondary text-nowrap" style={{ fontSize: "11px", letterSpacing: "0.06em" }}>
      PRIORITY
    </th>

    <th className="text-uppercase fw-semibold text-secondary text-nowrap" style={{ fontSize: "11px", letterSpacing: "0.06em" }}>
      STATUS
    </th>

    <th className="text-uppercase fw-semibold text-secondary text-nowrap" style={{ fontSize: "11px", letterSpacing: "0.06em" }}>
      ACTIONS
    </th>
  </tr>
</thead>
<tbody>
  {currentEnquiries.map((item) => (
    <tr key={item.id} style={{ height: "76px" }}>
      <td>
        <input type="checkbox" />
      </td>

      <td>
        <div style={{ fontSize: "12px", fontWeight: 600 }}>
          {item.id}
        </div>
        <small className="text-muted">
          {item.details}
        </small>
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
            <div style={{ fontSize: "13px", fontWeight: 600 }}>
              {item.name}
            </div>
            <small className="text-muted">
              {item.email}
            </small>
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

      <td style={{ fontSize: "13px", fontWeight: 500 }}>{item.date}</td>

      <td style={{ fontSize: "13px", fontWeight: 400 }}>{item.budget}</td>

      <td className={item.priorityColor}>
        <strong style={{ fontSize: "13px", fontWeight: 500 }}>{item.priority}</strong>
      </td>

      <td>
        <span
          className="badge rounded-pill"
          style={{
            background: item.statusBg,
            color: item.statusColor,
            fontSize: "13px", fontWeight: 500
          }}
        >
          ● {item.status}
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
  Showing {startIndex + 1} -
  {Math.min(startIndex + itemsPerPage, filteredEnquiries.length)}
  {" "}of {filteredEnquiries.length} records
</small>

  <nav className="d-flex align-items-center gap-2 flex-wrap">

  <button
    className="btn btn-light border"
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
  >
    &lt;
  </button>

  {[...Array(totalPages)].map((_, index) => (
    <button
      key={index}
      onClick={() => setCurrentPage(index + 1)}
      className="btn"
      style={{
        width: "30px",
        height: "30px",
        padding: 0,
        background:
          currentPage === index + 1 ? "#0F9D8A" : "#fff",
        color:
          currentPage === index + 1 ? "#fff" : "#374151",
        border: "1px solid #E5E7EB",
      }}
    >
      {index + 1}
    </button>
  ))}

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

      </div>
            {/* Bottom Section */}
      <div className="row mt-4">

        {/* Generate Report */}

     <div className="col-12 col-lg-8 mb-4">
  <div className="card border-0 shadow-sm" style={{ borderRadius: "16px" }}>
    <div className="card-body p-4 p-md-5">

            <h2
 className="mb-4 mt-n2"
  style={{
    fontSize: "20px",
    fontWeight: 600,
    color: "#111827",
   
  }}
>
  Generated Report History   
</h2>

      <div className="row align-items-start">

        {/* Report Type */}
        <div className="col-md-6">
          <label className="fw-semibold text-uppercase mb-3 d-block" style={{ fontSize: "13px", color: "#374151" }}>
            Select Report Type
          </label>

          <div className="row g-3">

            <div className="col-12 col-sm-6">
              <div className="border rounded-3 p-2 d-flex align-items-center gap-3">
                <input className="form-check-input m-0" type="radio" checked readOnly />
                <span className="fw-semibold">Enquiries</span>
              </div>
            </div>

            <div className="col-12 col-sm-6">
              <div className="border rounded-3 p-2 d-flex align-items-center gap-3">
                <input className="form-check-input m-0" type="radio" />
                <span className="fw-semibold">Bookings</span>
              </div>
            </div>

            <div className="col-12 col-sm-6">
              <div className="border rounded-3 p-2 d-flex align-items-center gap-3">
                <input className="form-check-input m-0" type="radio" />
                <span className="fw-semibold">Payments</span>
              </div>
            </div>

            <div className="col-12 col-sm-6">
              <div className="border rounded-3 p-2 d-flex align-items-center gap-3">
                <input className="form-check-input m-0" type="radio" />
                <span className="fw-semibold">GST Logs</span>
              </div>
            </div>

          </div>
        </div>

        {/* Date + Export */}
        <div className="col-md-6">

<label
  className="fw-semibold text-uppercase d-block mb-3 mt-3 mt-md-0"
  style={{
    fontSize: "13px",
    color: "#374151",
  }}
>
  DATE RANGE
</label>

          <div className="row g-3">

            <div className="col-12 col-sm-6">
              <label className="small text-muted">FROM</label>
              <input type="date" className="form-control" />
            </div>

            <div className="col-12 col-sm-6">
              <label className="small text-muted">TO</label>
              <input type="date" className="form-control" />
            </div>

          <div className="col-12 col-sm-6">
  <button
    className="btn w-100 text-white fw-semibold d-flex align-items-center justify-content-center gap-2"
    style={{
      background: "#0F9D8A",
      height: "50px",
      borderRadius: "12px",
    }}
  >
    <FaFileExcel size={18} />
    Excel
  </button>
</div>

<div className="col-12 col-sm-6">
  <button
    className="btn w-100 text-white fw-semibold d-flex align-items-center justify-content-center gap-2"
    style={{
      background: "#DC2626",
      height: "50px",
      borderRadius: "12px",
    }}
  >
    <FaFilePdf size={18} />
    PDF
  </button>
</div>

          </div>

        </div>

      </div>

    </div>
  </div>
</div>

        {/* Report History */}

     <div className="col-12 col-lg-4 mb-4">
  <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "16px" }}>
    <div className="card-body p-3 p-md-4">

                 <h2
className="mb-4"
  style={{
    fontSize: "20px",
    fontWeight: 600,
    color: "#111827",
   
  }}
>
  Generated Report History   
</h2>

      {/* PDF */}
      <div
        className="d-flex justify-content-between align-items-center border rounded-4 p-2 mb-3"
        style={{ minHeight: "60px" }}
      >
        <div className="d-flex align-items-center gap-3">

          <FaFilePdf size={28} color="#DC2626" />

          <div>
           <div
  className="fw-semibold text-truncate"
  style={{
    fontSize: "15px",
    maxWidth: "170px",
  }}
>
  Monthly_GST_Oct24.pdf
</div>

<small
  className="text-muted d-block"
  style={{ fontSize: "12px" }}
>
  2.4 MB • Generated 2h ago
</small>
          </div>

        </div>

       <FaDownload
  size={18}
  color="#6B7280"
  className="ms-2 flex-shrink-0"
/>
      </div>

      {/* Excel */}
      <div
        className="d-flex justify-content-between align-items-center border rounded-4 p-2"
        style={{ minHeight: "60px" }}
      >
        <div className="d-flex align-items-center gap-2">

          <FaFileExcel size={34} color="#10B981" />

          <div>
            <div className="fw-semibold text-truncate" style={{ fontSize: "16px" }}>
              Booking_Summary_Q3.xlsx
            </div>

            <small className="text-muted">
              11 MB • Generated yesterday
            </small>
          </div>

        </div>

        <FaDownload size={22} color="#6B7280" />
      </div>

    </div>
  </div>
</div>
      </div>

    </div>
  );
};

export default ReportsManagement;