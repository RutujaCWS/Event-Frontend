import React, { useState, useEffect } from "react";
import {
    Row,
    Col,
    Card,
    Table,
    Spinner,
    Form,
    Dropdown,
    Modal,
    Button,
} from "react-bootstrap";
import {
    TbFileInvoice,
    TbDownload,
    TbReceipt,
    TbCircleCheck,
    TbAlertTriangle,
    TbWallet,
    TbTrendingDown,
    TbTrendingUp,
    TbDotsVertical,
    TbSearch,
    TbPlus,
    TbFilter2,
    TbChevronLeft,
    TbChevronRight,TbNews
} from "react-icons/tb";
import { MdOutlineReceiptLong,MdOutlineAccountBalanceWallet } from "react-icons/md";
import "./invoicemanagement.css";

// ========== PERSISTENT AVATAR CLASS MAPPER ==========
const getAvatarClass = (() => {
    const colorClasses = [
        'avatar-initials-teal',
        'avatar-initials-blue',
        'avatar-initials-purple',
        'avatar-initials-green',
        'avatar-initials-orange',
        'avatar-initials-red'
    ];
    const assigned = {};
    let index = 0;
    return (initials) => {
        if (!assigned[initials]) {
            assigned[initials] = colorClasses[index % colorClasses.length];
            index++;
        }
        return assigned[initials];
    };
})();

function InvoiceGSTManagement() {
    // ========== STATE ==========
    const [invoices, setInvoices] = useState([]);
    const [stats] = useState({
        totalInvoices: 142,
        receiptsIssued: 96,
        paidInvoices: 108,
        overdue: 22,
        overdueAmount: "₹2,10,000",
        gstCollected: "1.43L",
    });
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState("newest");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    // Selection
    const [selectedInvoiceIds, setSelectedInvoiceIds] = useState([]);

    // Toast
    const [toastAlert, setToastAlert] = useState({
        show: false,
        message: "",
        type: "success",
    });

    // Modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    // ========== MOCK DATA (14 records) ==========
    const mockInvoices = [
        {
            _id: "1",
            invoiceNumber: "INV-0421",
            customer: { name: "Meena Gupta", email: "meena@yahoo.com", initials: "MG" },
            eventType: "Wedding",
            amount: 225000,
            gst: 24300,
            date: "Jun 17, 2026",
            status: "Paid",
            guests: 100,
            tier: "premium",
        },
        {
            _id: "2",
            invoiceNumber: "INV-0420",
            customer: { name: "Nikhil Kumar", email: "nikhil@work.com", initials: "NK" },
            eventType: "Corporate",
            amount: 482000,
            gst: 86760,
            date: "Jun 14, 2026",
            status: "Paid",
            guests: 500,
            tier: "premium",
        },
        {
            _id: "3",
            invoiceNumber: "INV-0419",
            customer: { name: "Anjali Sharma", email: "anjali@gmail.com", initials: "AS" },
            eventType: "Birthday",
            amount: 135000,
            gst: 24300,
            date: "Jun 09, 2026",
            status: "Partial",
            guests: 300,
            tier: "premium",
        },
        {
            _id: "4",
            invoiceNumber: "INV-0418",
            customer: { name: "Rohan Patel", email: "rohan@hotmail.com", initials: "RP" },
            eventType: "Religious",
            amount: 185000,
            gst: 18300,
            date: "Jun 05, 2026",
            status: "Paid",
            guests: 200,
            tier: "premium",
        },
        {
            _id: "5",
            invoiceNumber: "INV-0420",
            customer: { name: "Nikhil Kumar", email: "nikhil@work.com", initials: "NK" },
            eventType: "Corporate",
            amount: 482000,
            gst: 86760,
            date: "Jun 14, 2026",
            status: "Paid",
            guests: 500,
            tier: "premium",
        },
        {
            _id: "6",
            invoiceNumber: "INV-0421",
            customer: { name: "Meena Gupta", email: "meena@yahoo.com", initials: "MG" },
            eventType: "Wedding",
            amount: 225000,
            gst: 24300,
            date: "Jun 17, 2026",
            status: "Paid",
            guests: 100,
            tier: "premium",
        },
        {
            _id: "7",
            invoiceNumber: "INV-0420",
            customer: { name: "Nikhil Kumar", email: "nikhil@work.com", initials: "NK" },
            eventType: "Corporate",
            amount: 482000,
            gst: 86760,
            date: "Jun 14, 2026",
            status: "Paid",
            guests: 500,
            tier: "premium",
        },
        {
            _id: "8",
            invoiceNumber: "INV-0422",
            customer: { name: "Priya Singh", email: "priya@gmail.com", initials: "PS" },
            eventType: "Wedding",
            amount: 250000,
            gst: 45000,
            date: "Jun 18, 2026",
            status: "Paid",
            guests: 150,
            tier: "premium",
        },
        {
            _id: "9",
            invoiceNumber: "INV-0423",
            customer: { name: "Arjun Mehta", email: "arjun@work.com", initials: "AM" },
            eventType: "Corporate",
            amount: 375000,
            gst: 67500,
            date: "Jun 19, 2026",
            status: "Pending",
            guests: 200,
            tier: "standard",
        },
        {
            _id: "10",
            invoiceNumber: "INV-0424",
            customer: { name: "Sneha Reddy", email: "sneha@gmail.com", initials: "SR" },
            eventType: "Birthday",
            amount: 95000,
            gst: 17100,
            date: "Jun 20, 2026",
            status: "Partial",
            guests: 80,
            tier: "standard",
        },
        {
            _id: "11",
            invoiceNumber: "INV-0425",
            customer: { name: "Vikram Joshi", email: "vikram@hotmail.com", initials: "VJ" },
            eventType: "Religious",
            amount: 210000,
            gst: 37800,
            date: "Jun 21, 2026",
            status: "Overdue",
            guests: 180,
            tier: "premium",
        },
        {
            _id: "12",
            invoiceNumber: "INV-0426",
            customer: { name: "Kavya Nair", email: "kavya@yahoo.com", initials: "KN" },
            eventType: "Wedding",
            amount: 310000,
            gst: 55800,
            date: "Jun 22, 2026",
            status: "Paid",
            guests: 220,
            tier: "premium",
        },
        {
            _id: "13",
            invoiceNumber: "INV-0427",
            customer: { name: "Rahul Desai", email: "rahul@work.com", initials: "RD" },
            eventType: "Corporate",
            amount: 425000,
            gst: 76500,
            date: "Jun 23, 2026",
            status: "Pending",
            guests: 300,
            tier: "standard",
        },
        {
            _id: "14",
            invoiceNumber: "INV-0428",
            customer: { name: "Pooja Sharma", email: "pooja@gmail.com", initials: "PS" },
            eventType: "Birthday",
            amount: 120000,
            gst: 21600,
            date: "Jun 24, 2026",
            status: "Paid",
            guests: 90,
            tier: "standard",
        },
    ];

    // ========== EFFECTS ==========
    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 600));
            setInvoices(mockInvoices);
        } catch (err) {
            console.error("Failed to load invoices", err);
            triggerToast("Failed to load invoices", "danger");
        } finally {
            setLoading(false);
        }
    };

    // ========== HELPERS ==========
    const triggerToast = (message, type = "success") => {
        setToastAlert({ show: true, message, type });
        setTimeout(() => {
            setToastAlert((prev) => ({ ...prev, show: false }));
        }, 5000);
    };

    const getStatusBadge = (status) => {
        const map = {
            Paid: { class: "badge-paid", label: "Paid" },
            Partial: { class: "badge-partial", label: "Partial" },
            Overdue: { class: "badge-overdue", label: "Overdue" },
            Pending: { class: "badge-pending", label: "Pending" },
        };
        return map[status] || map.Pending;
    };

    // ========== FILTERING & SORTING ==========
    const filteredInvoices = invoices
        .filter((inv) => {
            const matchesStatus =
                statusFilter === "all" || inv.status.toLowerCase() === statusFilter.toLowerCase();
            return matchesStatus;
        })
        .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
        });

    // ========== PAGINATION ==========
    const totalFiltered = filteredInvoices.length;
    const totalPages = Math.ceil(totalFiltered / itemsPerPage) || 1;
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentInvoices = filteredInvoices.slice(indexOfFirst, indexOfLast);
    const startRange = totalFiltered === 0 ? 0 : indexOfFirst + 1;
    const endRange = Math.min(indexOfLast, totalFiltered);

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, "...", totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
            }
        }
        return pages;
    };

    // ========== SELECTION ==========
    const handleSelectInvoice = (id) => {
        setSelectedInvoiceIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        const visibleIds = currentInvoices.map((inv) => inv._id);
        const allVisibleSelected = visibleIds.every((id) => selectedInvoiceIds.includes(id));
        if (allVisibleSelected) {
            setSelectedInvoiceIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
        } else {
            setSelectedInvoiceIds((prev) => {
                const newIds = visibleIds.filter((id) => !prev.includes(id));
                return [...prev, ...newIds];
            });
        }
    };

    // ========== MODAL HANDLERS ==========
    const openDetailModal = (invoice) => {
        setSelectedInvoice(invoice);
        setShowDetailModal(true);
    };

    const handleAddInvoice = () => {
        triggerToast("New invoice created successfully!", "success");
        setShowAddModal(false);
    };

    // ========== RENDER ==========
    return (
        <div className="invoice-mgmt-container p-3 p-md-4">

            {/* ===== TOAST ===== */}
            {toastAlert.show && (
                <div
                    className={`alert alert-${toastAlert.type} alert-dismissible fade show shadow`}
                    style={{
                        position: "fixed",
                        top: "24px",
                        right: "24px",
                        zIndex: 9999,
                        borderRadius: "12px",
                        minWidth: "320px",
                        paddingRight: "45px",
                        fontSize: "13px",
                        fontWeight: "600",
                        fontFamily: "'Manrope', sans-serif",
                    }}
                >
                    {toastAlert.message}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setToastAlert({ ...toastAlert, show: false })}
                    />
                </div>
            )}

            {/* ===== 5 STAT CARDS ===== */}
            <Row className="mb-4 g-3 g-md-4 stat-cards-row">
                {/* 1. TOTAL INVOICES */}
                <Col className="metric-col">
                    <Card className="metric-card">
                        <Card.Body className="metric-body">
                            <div className="metric-top">
                                <div className="metric-icon-box" style={{ backgroundColor: "#DDF5F0", color: "#0F766E" }}>
                                    <MdOutlineReceiptLong size={22} />
                                </div>
                                <h2 className="metric-number">{stats.totalInvoices}</h2>
                            </div>
                            <div className="metric-title">TOTAL INVOICES</div>
                            <div className="metric-growth" style={{ color: "#10B981" }}>
                                <TbTrendingUp size={14} />
                                <span>+18 this month</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* 2. RECEIPTS ISSUED */}
                <Col className="metric-col">
                    <Card className="metric-card">
                        <Card.Body className="metric-body">
                            <div className="metric-top">
                                <div className="metric-icon-box" style={{ backgroundColor: "#FEF3D7", color: "#D97706" }}>
                                    <TbNews size={22} />
                                </div>
                                <h2 className="metric-number">{stats.receiptsIssued}</h2>
                            </div>
                            <div className="metric-title">RECEIPTS ISSUED</div>
                            <div className="metric-growth" style={{ color: "#10B981" }}>
                                <TbTrendingUp size={14} />
                                <span>+9 this week</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* 3. PAID INVOICES */}
                <Col className="metric-col">
                    <Card className="metric-card">
                        <Card.Body className="metric-body">
                            <div className="metric-top">
                                <div className="metric-icon-box" style={{ backgroundColor: "#E7F4EE", color: "#10B981" }}>
                                    <TbCircleCheck size={22} />
                                </div>
                                <h2 className="metric-number">{stats.paidInvoices}</h2>
                            </div>
                            <div className="metric-title">PAID INVOICES</div>
                            <div className="metric-growth" style={{ color: "#10B981" }}>
                                <span style={{ fontWeight: "600" }}>76%</span>
                                <span style={{ marginLeft: "4px" }}>paid rate</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* 4. OVERDUE */}
                <Col className="metric-col">
                    <Card className="metric-card">
                        <Card.Body className="metric-body">
                            <div className="metric-top">
                                <div className="metric-icon-box" style={{ backgroundColor: "#FDE8E8", color: "#EF4444" }}>
                                    <TbAlertTriangle size={22} />
                                </div>
                                <h2 className="metric-number">{stats.overdue}</h2>
                            </div>
                            <div className="metric-title">OVERDUE</div>
                            <div className="metric-alert" style={{ color: "#EF4444" }}>
                                <TbTrendingDown size={14} />
                                <span>{stats.overdueAmount} due</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* 5. GST COLLECTED */}
                <Col className="metric-col">
                    <Card className="metric-card">
                        <Card.Body className="metric-body">
                            <div className="metric-top">
                                <div className="metric-icon-box" style={{ backgroundColor: "#F3E8FF", color: "#7C3AED" }}>
                                    <MdOutlineAccountBalanceWallet  size={22} />
                                </div>
                                <h2 className="metric-number">{stats.gstCollected}</h2>
                            </div>
                            <div className="metric-title">GST COLLECTED</div>
                            <div className="metric-growth" style={{ color: "#10B981" }}>
                                <TbTrendingUp size={14} />
                                <span>+12% vs last month</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* ===== TOOLBAR ===== */}
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <div className="d-flex align-items-center gap-3">
                    <span className="fw-bold" style={{ fontSize: "18px", color: "#111827" }}>
                        Invoice Download
                    </span>
                    <span
                        style={{
                            fontSize: "13px",
                            border: "none",
                            borderRadius: "50px",
                            padding: "4px 14px",
                            backgroundColor: "#ddf5f0",
                            display: "inline-block",
                            fontWeight: "600",
                            lineHeight: "1.4",
                            color: "#0d9488",
                        }}
                    >
                        {stats.totalInvoices} invoices
                    </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <Button
                        variant="outline-secondary"
                        className="d-flex align-items-center gap-1"
                        style={{ borderRadius: "12px", padding: "8px 18px", fontSize: "13px", fontWeight: "600" }}
                    >
                        <TbFilter2 size={16} /> Filter
                    </Button>
                    <Button
                        variant="primary"
                        className="btn-add-invoice d-flex align-items-center gap-2"
                        onClick={() => setShowAddModal(true)}
                        style={{ padding: "8px 20px" }}
                    >
                        <TbPlus size={18} /> Add Invoice
                    </Button>
                </div>
            </div>

            {/* ===== TABLE CARD with top border ===== */}
            <Card className="border-0 shadow-sm" style={{ borderRadius: "16px", overflow: "hidden" }}>
                <Card.Header className="bg-white border-0 pt-4 pb-2 px-3 px-md-4 d-flex flex-wrap align-items-center gap-2">
                    <div className="d-flex gap-1 flex-wrap">
                        <Button
                            className={`rounded-pill px-3 ${statusFilter === "all" ? "status-tab-active" : "status-tab-inactive"}`}
                            style={{ fontSize: "12px", fontWeight: "600" }}
                            onClick={() => setStatusFilter("all")}
                        >
                            All ({stats.totalInvoices})
                        </Button>
                        <Button
                            className={`rounded-pill px-3 ${statusFilter === "paid" ? "status-tab-active" : "status-tab-inactive"}`}
                            style={{ fontSize: "12px", fontWeight: "600" }}
                            onClick={() => setStatusFilter("paid")}
                        >
                            Paid
                        </Button>
                        <Button
                            className={`rounded-pill px-3 ${statusFilter === "pending" ? "status-tab-active" : "status-tab-inactive"}`}
                            style={{ fontSize: "12px", fontWeight: "600" }}
                            onClick={() => setStatusFilter("pending")}
                        >
                            Pending
                        </Button>
                        <Button
                            className={`rounded-pill px-3 ${statusFilter === "overdue" ? "status-tab-active" : "status-tab-inactive"}`}
                            style={{ fontSize: "12px", fontWeight: "600" }}
                            onClick={() => setStatusFilter("overdue")}
                        >
                            Overdue
                        </Button>
                    </div>
                </Card.Header>

                <Card.Body className="p-0" style={{ borderTop: "1px solid #E2E8F0" }}>
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" style={{ color: "#008075" }} />
                        </div>
                    ) : (
                        <>
                            <Table responsive hover className="custom-table mb-0 align-middle">
                                <thead>
                                    <tr>
                                        <th className="px-4" style={{ width: "50px" }}>
                                            <input
                                                type="checkbox"
                                                style={{ cursor: "pointer" }}
                                                checked={
                                                    currentInvoices.length > 0 &&
                                                    currentInvoices.every((inv) =>
                                                        selectedInvoiceIds.includes(inv._id)
                                                    )
                                                }
                                                onChange={handleSelectAll}
                                            />
                                        </th>
                                        <th style={{ minWidth: "140px" }}>INVOICE #</th>
                                        <th style={{ minWidth: "200px" }}>CUSTOMER</th>
                                        <th style={{ minWidth: "120px" }}>EVENT TYPE</th>
                                        <th style={{ minWidth: "130px" }}>AMOUNT</th>
                                        <th style={{ minWidth: "110px" }}>GST</th>
                                        <th style={{ minWidth: "120px" }}>DATE</th>
                                        <th style={{ minWidth: "110px" }}>STATUS</th>
                                        <th className="text-end px-4" style={{ width: "80px" }}>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentInvoices.length === 0 ? (
                                        <tr>
                                            <td colSpan="9" className="text-center py-5 text-muted">
                                                No invoices found
                                            </td>
                                        </tr>
                                    ) : (
                                        currentInvoices.map((inv) => {
                                            const statusBadge = getStatusBadge(inv.status);
                                            const avatarClass = getAvatarClass(inv.customer.initials);
                                            return (
                                                <tr
                                                    key={inv._id}
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => openDetailModal(inv)}
                                                >
                                                    <td className="px-4" onClick={(e) => e.stopPropagation()}>
                                                        <input
                                                            type="checkbox"
                                                            style={{ cursor: "pointer" }}
                                                            checked={selectedInvoiceIds.includes(inv._id)}
                                                            onChange={() => handleSelectInvoice(inv._id)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <span className="fw-bold" style={{ color: "#111827" }}>
                                                            {inv.invoiceNumber}
                                                        </span>
                                                        <span className="d-block text-muted" style={{ fontSize: "11px" }}>
                                                            {inv.guests} guests · {inv.tier}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div
                                                                className={`avatar-initials ${avatarClass}`}
                                                                style={{
                                                                    width: "36px",
                                                                    height: "36px",
                                                                    fontSize: "13px",
                                                                }}
                                                            >
                                                                {inv.customer.initials}
                                                            </div>
                                                            <div>
                                                                <div className="fw-bold text-dark" style={{ lineHeight: "1.2" }}>
                                                                    {inv.customer.name}
                                                                </div>
                                                                <div className="text-muted" style={{ fontSize: "12px" }}>
                                                                    {inv.customer.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className={`badge event-badge event-${inv.eventType.toLowerCase()} px-3 py-2 rounded-pill`}>
                                                            {inv.eventType}
                                                        </span>
                                                    </td>
                                                    <td className="fw-bold">₹{inv.amount.toLocaleString("en-IN")}</td>
                                                    <td>₹{inv.gst.toLocaleString("en-IN")}</td>
                                                    <td>{inv.date}</td>
                                                    <td>
                                                        <span
                                                            className={`badge-status ${statusBadge.class}`}
                                                            style={{
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                                padding: "4px 12px",
                                                                borderRadius: "20px",
                                                                fontSize: "12px",
                                                                fontWeight: "600",
                                                            }}
                                                        >
                                                            {statusBadge.label}
                                                        </span>
                                                    </td>
                                                    <td className="text-end px-4" onClick={(e) => e.stopPropagation()}>
                                                        <Dropdown align="end">
                                                            <Dropdown.Toggle
                                                                as="button"
                                                                className="btn border-0 bg-transparent p-1 shadow-none"
                                                            >
                                                                <TbDotsVertical size={18} style={{ color: "#94a3b8" }} />
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                                <Dropdown.Item onClick={() => openDetailModal(inv)}>
                                                                    View Details
                                                                </Dropdown.Item>
                                                                <Dropdown.Item>Download PDF</Dropdown.Item>
                                                                <Dropdown.Item>Send Reminder</Dropdown.Item>
                                                                <Dropdown.Divider />
                                                                <Dropdown.Item className="text-danger">
                                                                    Delete
                                                                </Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </Table>

                            {/* Pagination */}
                            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-between align-items-center py-3 py-md-4 px-3 px-md-4 bg-white border-top">
                                <span className="text-muted" style={{ fontSize: "13px" }}>
                                    Showing {startRange}–{endRange} of {totalFiltered} invoices ·{" "}
                                    {selectedInvoiceIds.length} selected
                                </span>
                                <div className="d-flex gap-1 align-items-center flex-wrap justify-content-center">
                                    <button
                                        className="custom-pagination-btn"
                                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <TbChevronLeft size={14} />
                                    </button>
                                    {getPageNumbers().map((p, idx) =>
                                        p === "..." ? (
                                            <span key={`dots-${idx}`} className="mx-1 text-muted">…</span>
                                        ) : (
                                            <button
                                                key={`page-${p}`}
                                                className={`custom-pagination-btn ${currentPage === p ? "active" : ""}`}
                                                onClick={() => setCurrentPage(p)}
                                            >
                                                {p}
                                            </button>
                                        )
                                    )}
                                    <button
                                        className="custom-pagination-btn"
                                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                    >
                                        <TbChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </Card.Body>
            </Card>

            {/* ===== MODALS ===== */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered className="premium-modal">
                <Modal.Header closeButton>
                    <Modal.Title className="h2-section m-0">Create New Invoice</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Customer Name</Form.Label>
                            <Form.Control type="text" placeholder="e.g. Meena Gupta" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Event Type</Form.Label>
                            <Form.Select>
                                <option>Wedding</option>
                                <option>Corporate</option>
                                <option>Birthday</option>
                                <option>Religious</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Amount (₹)</Form.Label>
                            <Form.Control type="number" placeholder="e.g. 225000" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>GST (%)</Form.Label>
                            <Form.Control type="number" placeholder="e.g. 18" />
                        </Form.Group>
                        <Form.Group className="mb-0">
                            <Form.Label>Status</Form.Label>
                            <Form.Select>
                                <option>Paid</option>
                                <option>Partial</option>
                                <option>Pending</option>
                                <option>Overdue</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" className="btn-cancel" onClick={() => setShowAddModal(false)}>
                        Cancel
                    </Button>
                    <Button className="btn-submit" onClick={handleAddInvoice}>
                        Create Invoice
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered className="premium-modal">
                <Modal.Header closeButton>
                    <Modal.Title className="h2-section m-0">
                        {selectedInvoice?.invoiceNumber || "Invoice Details"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedInvoice && (
                        <div>
                            <Row className="mb-3">
                                <Col xs={6}>
                                    <div className="text-muted" style={{ fontSize: "12px" }}>Customer</div>
                                    <div className="fw-bold">{selectedInvoice.customer.name}</div>
                                    <div style={{ fontSize: "13px", color: "#64748b" }}>{selectedInvoice.customer.email}</div>
                                </Col>
                                <Col xs={6}>
                                    <div className="text-muted" style={{ fontSize: "12px" }}>Event Type</div>
                                    <div className="fw-bold">{selectedInvoice.eventType}</div>
                                    <div style={{ fontSize: "13px", color: "#64748b" }}>{selectedInvoice.guests} guests</div>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col xs={6}>
                                    <div className="text-muted" style={{ fontSize: "12px" }}>Amount</div>
                                    <div className="fw-bold" style={{ fontSize: "18px", color: "#0F766E" }}>
                                        ₹{selectedInvoice.amount.toLocaleString("en-IN")}
                                    </div>
                                </Col>
                                <Col xs={6}>
                                    <div className="text-muted" style={{ fontSize: "12px" }}>GST</div>
                                    <div className="fw-bold">₹{selectedInvoice.gst.toLocaleString("en-IN")}</div>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={6}>
                                    <div className="text-muted" style={{ fontSize: "12px" }}>Date</div>
                                    <div className="fw-bold">{selectedInvoice.date}</div>
                                </Col>
                                <Col xs={6}>
                                    <div className="text-muted" style={{ fontSize: "12px" }}>Status</div>
                                    <span
                                        className={`badge-status ${getStatusBadge(selectedInvoice.status).class}`}
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            padding: "4px 14px",
                                            borderRadius: "20px",
                                            fontSize: "13px",
                                            fontWeight: "600",
                                        }}
                                    >
                                        {selectedInvoice.status}
                                    </span>
                                </Col>
                            </Row>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" className="btn-cancel" onClick={() => setShowDetailModal(false)}>
                        Close
                    </Button>
                    <Button className="btn-submit" onClick={() => { triggerToast("Invoice downloaded!", "success"); setShowDetailModal(false); }}>
                        <TbDownload size={16} className="me-1" /> Download PDF
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default InvoiceGSTManagement;