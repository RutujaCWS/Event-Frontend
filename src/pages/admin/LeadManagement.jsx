import { useEffect, useState } from "react";
import { getAllLeads, updateLead } from "../../services/leadService";
import { Modal, Button, Form, Alert, Spinner, Row, Col, Card, Dropdown } from "react-bootstrap";
import {
    TbFileUnknown, TbUserCheck, TbCircleCheck, TbClock, TbCircleX,
    TbTrendingUp, TbTrendingDown, TbFilter, TbDownload, TbPlus, TbDotsVertical
} from "react-icons/tb";
import API from "../../services/api";
import CreateQuotationModal from "../admin/Quotation/createQuotationModel";
import "./LeadManagement.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const LeadManagement = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editLead, setEditLead] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [showQuotationModal, setShowQuotationModal] = useState(false);
    const [selectedQuotationLead, setSelectedQuotationLead] = useState(null);

    // ---------- Assign Lead States ----------
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [currentLead, setCurrentLead] = useState(null);
    const [staffList, setStaffList] = useState([]);
    const [selectedStaffId, setSelectedStaffId] = useState("");
    const [assignByLocation, setAssignByLocation] = useState(false);
    const [assignLoading, setAssignLoading] = useState(false);
    const [assignError, setAssignError] = useState("");

    // ---------- Filter & UI States ----------
    const [activeTab, setActiveTab] = useState("all");
    const [sortOrder, setSortOrder] = useState("newest");
    const [searchQuery, setSearchQuery] = useState("");
    const [eventTypeFilter, setEventTypeFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedLeadIds, setSelectedLeadIds] = useState([]);
    const [toastAlert, setToastAlert] = useState({ show: false, message: "", type: "success" });
    const [showAddModal, setShowAddModal] = useState(false);
    const [addForm, setAddForm] = useState({
        fullName: "",
        email: "",
        mobileNumber: "",
        eventType: "Wedding",
        eventDate: "",
        guestCount: "",
        location: "",
        budget: "",
        description: "",
        serviceRequired: []
    });

    const triggerToast = (message, type = "success") => {
        setToastAlert({ show: true, message, type });
        setTimeout(() => {
            setToastAlert(prev => ({ ...prev, show: false }));
        }, 5000);
    };

    const getAvatarMetrics = (name, id) => {
        let hash = 0;
        if (id) {
            for (let i = 0; i < id.length; i++) {
                hash = id.charCodeAt(i) + ((hash << 5) - hash);
            }
        }
        const stableIdx = Math.abs(hash);
        const colors = ["#e6f4f2", "#e8f0fe", "#fef7e0", "#fce8e6", "#f3e5f5"];
        const textColors = ["#00685f", "#1a73e8", "#b06000", "#c5221f", "#7b1fa2"];
        const colIdx = stableIdx % colors.length;
        const initials = name ? name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) : "EN";
        return { bgColor: colors[colIdx], textColor: textColors[colIdx], initials };
    };

    const handleSelectLead = (id) => {
        setSelectedLeadIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (currentVisibleLeads) => {
        const visibleIds = currentVisibleLeads.map(lead => lead._id);
        const allSelected = visibleIds.length > 0 && visibleIds.every(id => selectedLeadIds.includes(id));
        if (allSelected) {
            setSelectedLeadIds(prev => prev.filter(id => !visibleIds.includes(id)));
        } else {
            setSelectedLeadIds(prev => [...new Set([...prev, ...visibleIds])]);
        }
    };

    const handleExportCSV = (sortedLeads) => {
        if (leads.length === 0) return;
        const headers = ["Lead ID", "Customer Name", "Email", "Mobile", "Event Type", "Event Date", "Location", "Budget", "Guest Count", "Status"];
        const csvRows = [
            headers.join(","),
            ...sortedLeads.map(lead => [
                lead._id,
                `"${lead.customerId?.name || lead.fullName || 'N/A'}"`,
                lead.customerId?.email || lead.email || 'N/A',
                lead.customerId?.mobile || lead.mobileNumber || lead.mobile || 'N/A',
                lead.eventType,
                lead.eventDate ? new Date(lead.eventDate).toLocaleDateString() : 'N/A',
                `"${lead.location || 'N/A'}"`,
                lead.budget || 0,
                lead.guestCount || 0,
                lead.status
            ].join(","))
        ];
        const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `enquiries_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        triggerToast("Enquiries exported successfully to CSV!");
    };
const handleExportPDF = () => {
    const doc = new jsPDF("l", "mm", "a4");

    doc.setFontSize(18);
    doc.text("Enquiry Management Report", 14, 15);

    doc.setFontSize(10);
    doc.text(`Generated On : ${new Date().toLocaleString()}`, 14, 22);

    doc.text(`Status : ${activeTab === "all" ? "All" : activeTab}`, 14, 28);
    doc.text(`Event Type : ${eventTypeFilter || "All"}`, 70, 28);
    doc.text(`Location : ${locationFilter || "All"}`, 135, 28);
    doc.text(`Search : ${searchQuery || "-"}`, 205, 28);

    autoTable(doc, {
        startY: 35,

        head: [[
            "Enquiry ID",
            "Customer",
            "Email",
            "Mobile",
            "Event Type",
            "Event Date",
            "Location",
            "Budget",
            "Guests",
            "Status"
        ]],

        body: sortedLeads.map((lead) => [

            `ENQ-${lead._id.slice(-4).toUpperCase()}`,

            lead.customerId?.name || lead.fullName || "-",

            lead.customerId?.email || lead.email || "-",

            lead.customerId?.mobile ||
            lead.mobileNumber ||
            lead.mobile ||
            "-",

            lead.eventType || "-",

            lead.eventDate
                ? new Date(lead.eventDate).toLocaleDateString()
                : "-",

            lead.location || "-",

            `INR ${(lead.budget ?? 0).toLocaleString("en-IN")}`,

            lead.guestCount || 0,

            lead.status || "-"
        ]),

        theme: "grid",

        headStyles: {
            fillColor: [58, 95, 190],
            textColor: 255,
            fontStyle: "bold"
        },

        styles: {
            fontSize: 8,
            cellPadding: 2
        }
    });

    doc.save(`Enquiry_Report_${new Date().toISOString().split("T")[0]}.pdf`);
};
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/enquiries/public", addForm);
            if (res.data.success) {
                triggerToast("Enquiry added successfully!");
                setShowAddModal(false);
                setAddForm({
                    fullName: "",
                    email: "",
                    mobileNumber: "",
                    eventType: "Wedding",
                    eventDate: "",
                    guestCount: "",
                    location: "",
                    budget: "",
                    description: "",
                    serviceRequired: []
                });
                fetchLeads();
            } else {
                triggerToast(res.data.message || "Failed to add enquiry", "danger");
            }
        } catch (error) {
            console.error(error);
            triggerToast(error.response?.data?.message || "Failed to add enquiry", "danger");
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchQuery, eventTypeFilter, priorityFilter, statusFilter, sortOrder]);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const response = await getAllLeads();
            setLeads(response.data.data || []);
        } catch (error) {
            console.error(error);
            triggerToast("Failed to fetch leads. Please try again.", "danger");
        } finally {
            setLoading(false);
        }
    };

    const handleView = (lead) => {
        setSelectedLead(lead);
        setShowViewModal(true);
    };

    const handleEdit = (lead) => {
        const leadCopy = { ...lead };
        if (leadCopy.eventDate) {
            leadCopy.eventDate = new Date(leadCopy.eventDate).toISOString().split('T')[0];
        }
        setEditLead(leadCopy);
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        try {
            await updateLead(editLead._id, {
                eventType: editLead.eventType,
                location: editLead.location,
                status: editLead.status,
                description: editLead.description,
                budget: editLead.budget,
                guestCount: editLead.guestCount,
                eventDate: editLead.eventDate,
                serviceRequired: editLead.serviceRequired,
            });
            setShowEditModal(false);
            fetchLeads();
            triggerToast("Lead updated successfully!");
        } catch (error) {
            console.error(error);
            triggerToast("Failed to update lead", "danger");
        }
    };

    const handleCreateQuote = (lead) => {
        setSelectedQuotationLead(lead);
        setShowQuotationModal(true);
    };

    // Assign Lead Functions
    const openAssignModal = async (lead) => {
        setCurrentLead(lead);
        setAssignByLocation(false);
        setSelectedStaffId("");
        setAssignError("");
        try {
            const res = await API.get("/admin/staff-list");
            setStaffList(res.data.data);
        } catch (error) {
            console.error("Failed to load staff list", error);
            setAssignError("Could not load staff list");
        }
        setShowAssignModal(true);
    };

    const handleAssign = async () => {
        setAssignLoading(true);
        setAssignError("");
        try {
            await API.put(`/admin/enquiries/${currentLead._id}/assign`, {
                staffId: selectedStaffId,
                assignByLocation: assignByLocation,
            });
            setShowAssignModal(false);
            fetchLeads();
            triggerToast("Lead assigned successfully!");
        } catch (error) {
            setAssignError(error.response?.data?.message || "Assignment failed");
        } finally {
            setAssignLoading(false);
        }
    };

    // Stats
    const totalLeads = leads.length;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthLeads = leads.filter(lead => {
        if (!lead.createdAt) return false;
        const date = new Date(lead.createdAt);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;

    const assignedLeadsCount = leads.filter(lead => lead.assignedTo).length;
    const assignedPercentage = totalLeads > 0 ? Math.round((assignedLeadsCount / totalLeads) * 100) : 0;

    const convertedLeadsCount = leads.filter(lead => lead.status === "Confirmed" || lead.status === "Converted").length;
    const conversionRate = totalLeads > 0 ? Math.round((convertedLeadsCount / totalLeads) * 100) : 0;

    const pendingLeadsCount = leads.filter(lead => lead.status === "Pending" || lead.status === "New").length;
    const lostLeadsCount = leads.filter(lead => lead.status === "Cancelled" || lead.status === "Closed").length;
    const lossRate = totalLeads > 0 ? Math.round((lostLeadsCount / totalLeads) * 100) : 0;

    // Filtering
    const filteredLeads = leads
        .filter((item) => {
            if (activeTab === "new") {
                return item.status === "New" || item.status === "Pending";
            } else if (activeTab === "follow-up") {
                return item.status === "Contacted" || item.status === "Reviewed";
            } else if (activeTab === "discussion") {
                return item.status === "Quoted" || item.status === "Quotation Sent";
            } else if (activeTab === "quoted") {
                return item.status === "Confirmed" || item.status === "Converted";
            }
            return true;
        })
        .filter((item) => {
            if (!searchQuery) return true;
            const name = item.customerId?.name || item.fullName || "";
            const email = item.customerId?.email || item.email || "";
            return (
                name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        })
        .filter((item) => {
            if (!eventTypeFilter) return true;
            return item.eventType === eventTypeFilter;
        })
        .filter((item) => {
            if (!priorityFilter) return true;
            const priority = item.budget >= 100000 ? "High" : item.budget >= 50000 ? "Med" : "Low";
            return priority === priorityFilter;
        })
        .filter((item) => {
            if (!statusFilter) return true;
            let group = "";
            if (item.status === "New" || item.status === "Pending") group = "New";
            else if (item.status === "Contacted" || item.status === "Reviewed") group = "Follow-up";
            else if (item.status === "Quoted" || item.status === "Quotation Sent") group = "In Discussion";
            else if (item.status === "Confirmed" || item.status === "Converted") group = "Converted";
            else if (item.status === "Cancelled" || item.status === "Closed") group = "Closed";
            return group === statusFilter;
        });

    const sortedLeads = [...filteredLeads].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    const indexOfLastLead = currentPage * itemsPerPage;
    const indexOfFirstLead = indexOfLastLead - itemsPerPage;
    const currentLeads = sortedLeads.slice(indexOfFirstLead, indexOfLastLead);
    const totalPages = Math.ceil(sortedLeads.length / itemsPerPage);

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

    const clearAllFilters = () => {
        setSearchQuery("");
        setEventTypeFilter("");
        setPriorityFilter("");
        setStatusFilter("");
    };

    return (
        <div className="container-fluid py-3 lead-mgmt-container">
            {/* Toast Alert */}
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
                        fontFamily: "'Manrope', sans-serif"
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

            {/* Stats Cards */}
            <Row className="mb-4 g-2 g-md-3">
                <Col xl lg md={6} sm={6} xs={6}>
                    <Card className="metric-card">
                        <Card.Body className="metric-body">
                            <div className="metric-top">
                                <div
                                    className="metric-icon-box"
                                    style={{ backgroundColor: "#DDF5F0", color: "#0F766E" }}
                                >
                                    <TbFileUnknown size={20} />
                                </div>
                                <h2 className="metric-number">{totalLeads}</h2>
                            </div>
                            <div className="metric-title">TOTAL ENQUIRIES</div>
                            <div className="metric-growth">
                                <TbTrendingUp size={14} />
                                <span>+{thisMonthLeads} this month</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl lg md={6} sm={6} xs={6}>
                    <Card className="metric-card">
                        <Card.Body className="metric-body">
                            <div className="metric-top">
                                <div
                                    className="metric-icon-box"
                                    style={{ backgroundColor: "#E8F0FE", color: "#2563EB" }}
                                >
                                    <TbUserCheck size={20} />
                                </div>
                                <h2 className="metric-number">{assignedLeadsCount}</h2>
                            </div>
                            <div className="metric-title">ASSIGNED</div>
                            <div className="metric-growth">
                                <TbTrendingUp size={14} />
                                <span>{assignedPercentage}% of total</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl lg md={6} sm={6} xs={6}>
                    <Card className="metric-card">
                        <Card.Body className="metric-body">
                            <div className="metric-top">
                                <div
                                    className="metric-icon-box"
                                    style={{ backgroundColor: "#E7F4EE", color: "#10B981" }}
                                >
                                    <TbCircleCheck size={20} />
                                </div>
                                <h2 className="metric-number">{convertedLeadsCount}</h2>
                            </div>
                            <div className="metric-title">CONVERTED</div>
                            <div className="metric-growth">
                                <TbTrendingUp size={14} />
                                <span>{conversionRate}% conv. rate</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl lg md={6} sm={6} xs={6}>
                    <Card className="metric-card">
                        <Card.Body className="metric-body">
                            <div className="metric-top">
                                <div
                                    className="metric-icon-box"
                                    style={{ backgroundColor: "#FEF3D7", color: "#D97706" }}
                                >
                                    <TbClock size={20} />
                                </div>
                                <h2 className="metric-number">{pendingLeadsCount}</h2>
                            </div>
                            <div className="metric-title">PENDING</div>
                            <div className="metric-alert">
                                <TbTrendingDown size={14} />
                                <span>Needs action</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl lg md={6} sm={6} xs={6}>
                    <Card className="metric-card">
                        <Card.Body className="metric-body">
                            <div className="metric-top">
                                <div
                                    className="metric-icon-box"
                                    style={{ backgroundColor: "#FDE8E8", color: "#EF4444" }}
                                >
                                    <TbCircleX size={20} />
                                </div>
                                <h2 className="metric-number">{lostLeadsCount}</h2>
                            </div>
                            <div className="metric-title">LOST / CLOSED</div>
                            <div className="metric-alert">
                                <TbTrendingDown size={14} />
                                <span>{lossRate}% loss rate</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Header with Filter, Export, Add */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 mt-4">
                <div className="d-flex align-items-center gap-3">
                    <h2 className="page-header-title">Enquiry List</h2>
                    <span className="total-badge">{totalLeads} total</span>
                </div>
                <div className="d-flex gap-2 align-self-stretch align-self-md-auto justify-content-md-end">
                    <button className="btn btn-filter d-flex align-items-center justify-content-center gap-2" onClick={() => setShowFilters(!showFilters)}>
                        <TbFilter size={16} /> <span className="d-none d-sm-inline">Filter</span>
                    </button>
                   <button
    className="btn btn-export d-flex align-items-center justify-content-center gap-2"
    onClick={handleExportPDF}
>
    <TbDownload size={16} />
    <span className="d-none d-sm-inline">Export</span>
</button>
                    <button className="btn btn-add-enquiry d-flex align-items-center justify-content-center gap-2" onClick={() => setShowAddModal(true)}>
                        <TbPlus size={16} /> <span className="d-none d-sm-inline">Add Enquiry</span><span className="d-inline d-sm-none">Add</span>
                    </button>
                </div>
            </div>

            {/* ===== UPDATED CAPSULE-STYLE FILTER BAR WITH LABELS ===== */}
           {/* ===== CAPSULE FILTER BAR WITH BACKGROUND (like Invoice) ===== */}
{showFilters && (
    <div className="mb-3 p-3" style={{ border: "1px solid #E5E7EB", borderRadius: "12px", background: "#fff" }}>
        <div className="d-flex flex-wrap align-items-center gap-2 gap-md-3 justify-content-start justify-content-lg-end">
            {/* Search */}
            <div className="filter-capsule-container" style={{ padding: "4px 12px 4px 8px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748B", marginRight: "2px" }}>Search</span>
                <Form.Control
                    type="text"
                    placeholder="customer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="filter-select-inner"
                    style={{ border: "none", background: "#ffffff", height: "32px", width: "140px", fontSize: "12px", fontWeight: "400", padding: "4px 8px" }}
                />
                <span className="filter-clear-btn" onClick={() => setSearchQuery("")}>Clear</span>
            </div>

            {/* Event Type */}
            <div className="filter-capsule-container">
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748B", marginRight: "2px" }}>Event</span>
                <Form.Select
                    className="filter-select-inner filter-select-roles"
                    value={eventTypeFilter}
                    onChange={(e) => setEventTypeFilter(e.target.value)}
                    style={{ width: "110px" }}
                >
                    <option value="">All</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Conference">Conference</option>
                    <option value="Exhibition">Exhibition</option>
                    <option value="Other">Other</option>
                </Form.Select>
                <span className="filter-clear-btn" onClick={() => setEventTypeFilter("")}>Clear All</span>
            </div>

            {/* Priority */}
            <div className="filter-capsule-container">
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748B", marginRight: "2px" }}>Priority</span>
                <Form.Select
                    className="filter-select-inner filter-select-status"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    style={{ width: "100px" }}
                >
                    <option value="">All</option>
                    <option value="High">High</option>
                    <option value="Med">Medium</option>
                    <option value="Low">Low</option>
                </Form.Select>
                <span className="filter-clear-btn" onClick={() => setPriorityFilter("")}>Clear All</span>
            </div>

            {/* Status */}
            <div className="filter-capsule-container">
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748B", marginRight: "2px" }}>Status</span>
                <Form.Select
                    className="filter-select-inner filter-select-status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ width: "110px" }}
                >
                    <option value="">All</option>
                    <option value="New">New</option>
                    <option value="Follow-up">Follow‑up</option>
                    <option value="In Discussion">In Discussion</option>
                    <option value="Converted">Converted</option>
                    <option value="Closed">Closed</option>
                </Form.Select>
                <span className="filter-clear-btn" onClick={() => setStatusFilter("")}>Clear All</span>
            </div>

            {/* Reset / Clear All */}
            <button className="btn btn-sm btn-outline-secondary" onClick={clearAllFilters} style={{ fontSize: "12px", fontWeight: "600", borderRadius: "8px" }}>
                Reset
            </button>
        </div>
    </div>
)}

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" style={{ color: "#0D9488" }} />
                </div>
            ) : (
                <>
                    <Card className="border-0 shadow-sm" style={{ borderRadius: "16px", overflow: "hidden" }}>
                        <Card.Header className="bg-white border-0 pt-4 pb-2 px-3 px-md-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                            <div className="enquiry-pill-tabs">
                                <button
                                    onClick={() => setActiveTab("all")}
                                    className={`enquiry-pill-btn ${activeTab === "all" ? "active" : ""}`}
                                >
                                    All({totalLeads})
                                </button>
                                <button
                                    onClick={() => setActiveTab("new")}
                                    className={`enquiry-pill-btn ${activeTab === "new" ? "active" : ""}`}
                                >
                                    New
                                </button>
                                <button
                                    onClick={() => setActiveTab("follow-up")}
                                    className={`enquiry-pill-btn ${activeTab === "follow-up" ? "active" : ""}`}
                                >
                                    Follow-up
                                </button>
                                <button
                                    onClick={() => setActiveTab("discussion")}
                                    className={`enquiry-pill-btn ${activeTab === "discussion" ? "active" : ""}`}
                                >
                                    In Discussion
                                </button>
                                <button
                                    onClick={() => setActiveTab("quoted")}
                                    className={`enquiry-pill-btn ${activeTab === "quoted" ? "active" : ""}`}
                                >
                                    Quoted
                                </button>
                            </div>

                            <Form.Select
                                className="filter-sort-select align-self-start align-self-md-auto"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <option value="newest">Sort: Newest First</option>
                                <option value="oldest">Sort: Oldest First</option>
                            </Form.Select>
                        </Card.Header>

                        <Card.Body className="p-0">
                            <div className="table-responsive">
                                <table className="table table-hover custom-table mb-0 align-middle">
                                    <thead>
                                        <tr>
                                            <th className="px-4" style={{ width: "50px" }}>
                                                <input
                                                    type="checkbox"
                                                    style={{ cursor: "pointer" }}
                                                    checked={
                                                        currentLeads.length > 0 &&
                                                        currentLeads.every(item => selectedLeadIds.includes(item._id))
                                                    }
                                                    onChange={() => handleSelectAll(currentLeads)}
                                                />
                                            </th>
                                            <th style={{ minWidth: "150px" }}>ENQ. ID</th>
                                            <th style={{ minWidth: "220px" }}>CUSTOMER</th>
                                            <th style={{ minWidth: "130px" }}>EVENT TYPE</th>
                                            <th style={{ minWidth: "130px" }}>EVENT DATE</th>
                                            <th style={{ minWidth: "110px" }}>BUDGET</th>
                                            <th style={{ minWidth: "100px" }}>PRIORITY</th>
                                            <th style={{ minWidth: "140px" }}>STATUS</th>
                                            <th className="text-end px-4" style={{ width: "80px" }}>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentLeads.length === 0 ? (
                                            <tr>
                                                <td colSpan="9" className="text-center py-5 text-muted">
                                                    No enquiries found.
                                                </td>
                                            </tr>
                                        ) : (
                                            currentLeads.map((item) => {
                                                const avatarMetrics = getAvatarMetrics(item.customerId?.name || item.fullName || "Customer", item._id);
                                                const priority = item.budget >= 100000 ? "High" : item.budget >= 50000 ? "Med" : "Low";

                                                let statusClass = "new";
                                                let statusLabel = item.status;
                                                if (item.status === "New" || item.status === "Pending") {
                                                    statusClass = "new";
                                                    statusLabel = "New";
                                                } else if (item.status === "Contacted" || item.status === "Reviewed") {
                                                    statusClass = "follow-up";
                                                    statusLabel = "Follow-up";
                                                } else if (item.status === "Quoted" || item.status === "Quotation Sent") {
                                                    statusClass = "discussion";
                                                    statusLabel = "In Discussion";
                                                } else if (item.status === "Confirmed" || item.status === "Converted") {
                                                    statusClass = "converted";
                                                    statusLabel = "Converted";
                                                } else if (item.status === "Cancelled" || item.status === "Closed") {
                                                    statusClass = "closed";
                                                    statusLabel = "Closed";
                                                }

                                                return (
                                                    <tr key={item._id}>
                                                        <td className="px-4">
                                                            <input
                                                                type="checkbox"
                                                                style={{ cursor: "pointer" }}
                                                                checked={selectedLeadIds.includes(item._id)}
                                                                onChange={() => handleSelectLead(item._id)}
                                                            />
                                                        </td>
                                                        <td>
                                                            <div className="lead-id-text">
                                                                #ENQ-{item._id.slice(-4).toUpperCase()}
                                                            </div>
                                                            <div className="lead-id-subtext">
                                                                Upto {item.guestCount || 0} guests · {item.budget >= 100000 ? "premium" : "standard"}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex align-items-center gap-3">
                                                                <div
                                                                    className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-uppercase"
                                                                    style={{
                                                                        width: "36px",
                                                                        height: "36px",
                                                                        backgroundColor: avatarMetrics.bgColor,
                                                                        color: avatarMetrics.textColor,
                                                                        fontSize: "13px"
                                                                    }}
                                                                >
                                                                    {avatarMetrics.initials}
                                                                </div>
                                                                <div>
                                                                    <div className="lead-user-name" style={{ lineHeight: "1.2" }}>
                                                                        {item.customerId?.name || item.fullName || "N/A"}
                                                                    </div>
                                                                    <div className="lead-user-email">
                                                                        {item.customerId?.email || item.email || "N/A"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className={`event-type-badge event-badge-${item.eventType?.toLowerCase() || 'other'}`}>
                                                                {item.eventType}
                                                            </span>
                                                        </td>
                                                        <td className="lead-event-date">
                                                            {item.eventDate
                                                                ? new Date(item.eventDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                                                                : "N/A"}
                                                        </td>
                                                        <td className="lead-event-budget">
                                                            ₹{item.budget?.toLocaleString("en-IN") || "0"}
                                                        </td>
                                                        <td>
                                                            <span className={`priority-${priority.toLowerCase()}`}>
                                                                {priority}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className={`badge-dot badge-dot-${statusClass}`}>
                                                                <span className="status-dot"></span>
                                                                {statusLabel}
                                                            </span>
                                                        </td>
                                                        <td className="text-end px-4">
                                                            <Dropdown align="end">
                                                                <Dropdown.Toggle as="button" className="btn border-0 bg-transparent p-1 shadow-none">
                                                                    <TbDotsVertical size={18} style={{ color: "#94a3b8" }} />
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu>
                                                                    <Dropdown.Item onClick={() => handleView(item)}>View Details</Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => handleEdit(item)}>Edit Lead</Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => handleCreateQuote(item)}>Create Quote</Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => openAssignModal(item)}>Assign Staff</Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>

                        {/* Pagination footer */}
                        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-between align-items-center py-3 py-md-4 px-3 px-md-4 bg-white border-top">
                            <span className="text-muted small">
                                Showing {indexOfFirstLead + 1}-{Math.min(indexOfLastLead, sortedLeads.length)} of {sortedLeads.length} enquiries
                            </span>

                            {totalPages > 1 && (
                                <div className="d-flex gap-1 align-items-center flex-wrap justify-content-center">
                                    <button
                                        className="custom-pagination-btn"
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                    >
                                        {"<"}
                                    </button>

                                    {getPageNumbers().map((p, index) =>
                                        p === "..." ? (
                                            <span key={`dots-${index}`} className="mx-1 text-muted small">...</span>
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
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                    >
                                        {">"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </Card>
                </>
            )}

            {/* ===== ALL MODALS (unchanged) ===== */}
            {/* View Modal */}
            <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Lead Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedLead && (
                        <div className="row">
                            <div className="col-md-6">
                                <p><strong>Customer:</strong> {selectedLead.customerId?.name || selectedLead.fullName || "N/A"}</p>
                                <p><strong>Email:</strong> {selectedLead.customerId?.email || selectedLead.email || "N/A"}</p>
                                <p><strong>Mobile:</strong> {selectedLead.customerId?.mobile || selectedLead.mobile || "N/A"}</p>
                                <p><strong>Event Type:</strong> {selectedLead.eventType}</p>
                                <p><strong>Event Date:</strong> {selectedLead.eventDate ? new Date(selectedLead.eventDate).toLocaleDateString() : "N/A"}</p>
                                <p><strong>Guests:</strong> {selectedLead.guestCount}</p>
                            </div>
                            <div className="col-md-6">
                                <p><strong>Location:</strong> {selectedLead.location || "N/A"}</p>
                                <p><strong>Budget:</strong> ₹{selectedLead.budget?.toLocaleString() || "0"}</p>
                                <p><strong>Status:</strong>
                                    <span className={`badge ms-2 ${selectedLead.status === "Pending" ? "bg-warning" :
                                        selectedLead.status === "Reviewed" ? "bg-success" :
                                        selectedLead.status === "Quoted" ? "bg-info" :
                                        selectedLead.status === "Confirmed" ? "bg-primary" : "bg-secondary"
                                    }`}>
                                        {selectedLead.status}
                                    </span>
                                </p>
                                <p><strong>Required Services:</strong> {selectedLead.serviceRequired?.join(", ") || "None selected"}</p>
                                <p><strong>Description:</strong></p>
                                <div className="border rounded p-2 bg-light">
                                    {selectedLead.description || "No description provided"}
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Lead</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editLead && (
                        <form>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Event Type</label>
                                    <select
                                        className="form-select"
                                        value={editLead.eventType}
                                        onChange={(e) => setEditLead({ ...editLead, eventType: e.target.value })}
                                    >
                                        <option value="Wedding">Wedding</option>
                                        <option value="Birthday">Birthday</option>
                                        <option value="Corporate">Corporate</option>
                                        <option value="Conference">Conference</option>
                                        <option value="Exhibition">Exhibition</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Event Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={editLead.eventDate || ""}
                                        onChange={(e) => setEditLead({ ...editLead, eventDate: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Guest Count</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={editLead.guestCount || ""}
                                        onChange={(e) => setEditLead({ ...editLead, guestCount: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Location</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editLead.location || ""}
                                        onChange={(e) => setEditLead({ ...editLead, location: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Budget (₹)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min="0"
                                        value={editLead.budget || ""}
                                        onChange={(e) => setEditLead({ ...editLead, budget: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Status</label>
                                    <select
                                        className="form-select"
                                        value={editLead.status}
                                        onChange={(e) => setEditLead({ ...editLead, status: e.target.value })}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Reviewed">Reviewed</option>
                                        <option value="Quoted">Quoted</option>
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                                <div className="col-12 mb-4">
                                    <label className="form-label fw-bold text-secondary mb-2" style={{ fontSize: "15px" }}>Required Services</label>
                                    <div className="d-flex flex-wrap gap-2 py-1">
                                        {[
                                            { name: "Decoration", icon: "✨" },
                                            { name: "Photography", icon: "📷" },
                                            { name: "Catering", icon: "🍽️" },
                                            { name: "Entertainment", icon: "🎉" },
                                            { name: "Venue", icon: "📍" }
                                        ].map((service) => {
                                            const isSelected = editLead.serviceRequired?.includes(service.name) || false;
                                            return (
                                                <div
                                                    key={service.name}
                                                    onClick={() => {
                                                        const updated = isSelected
                                                            ? editLead.serviceRequired.filter(s => s !== service.name)
                                                            : [...(editLead.serviceRequired || []), service.name];
                                                        setEditLead({ ...editLead, serviceRequired: updated });
                                                    }}
                                                    style={{
                                                        padding: "10px 18px",
                                                        borderRadius: "12px",
                                                        cursor: "pointer",
                                                        fontWeight: "500",
                                                        fontSize: "14px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "8px",
                                                        userSelect: "none",
                                                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                                        border: isSelected ? "2px solid #7c3aed" : "2px solid #e5e7eb",
                                                        background: isSelected
                                                            ? "linear-gradient(135deg, #9333ea, #7c3aed)"
                                                            : "#ffffff",
                                                        color: isSelected ? "#ffffff" : "#4b5563",
                                                        boxShadow: isSelected
                                                            ? "0 4px 12px rgba(124, 58, 237, 0.25)"
                                                            : "0 2px 4px rgba(0, 0, 0, 0.02)",
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = "translateY(-2px)";
                                                        if (!isSelected) {
                                                            e.currentTarget.style.borderColor = "#c084fc";
                                                            e.currentTarget.style.background = "#faf5ff";
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = "translateY(0)";
                                                        if (!isSelected) {
                                                            e.currentTarget.style.borderColor = "#e5e7eb";
                                                            e.currentTarget.style.background = "#ffffff";
                                                        }
                                                    }}
                                                >
                                                    <span>{service.icon}</span>
                                                    <span>{service.name}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="col-12 mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={editLead.description || ""}
                                        onChange={(e) => setEditLead({ ...editLead, description: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                        </form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSaveEdit}>Save Changes</Button>
                </Modal.Footer>
            </Modal>

            {/* Assign Lead Modal */}
            <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)} size="md" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Assign Lead: {currentLead?.customerId?.name || ""}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {assignError && <Alert variant="danger">{assignError}</Alert>}

                    <Form.Check
                        type="checkbox"
                        id="assignByLocation"
                        label="Automatically assign by location (city)"
                        checked={assignByLocation}
                        onChange={(e) => setAssignByLocation(e.target.checked)}
                        className="mb-3"
                    />

                    {!assignByLocation && (
                        <Form.Group className="mb-3">
                            <Form.Label>Select Staff Member</Form.Label>
                            <Form.Select
                                value={selectedStaffId}
                                onChange={(e) => setSelectedStaffId(e.target.value)}
                                required
                            >
                                <option value="">-- Choose staff --</option>
                                {staffList.map(staff => (
                                    <option key={staff._id} value={staff._id}>
                                        {staff.name} {staff.assignedCity ? `(${staff.assignedCity})` : ""}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    )}

                    {assignByLocation && (
                        <p className="text-muted small">
                            System will assign this lead to a staff member whose assigned city matches <strong>
                                {currentLead?.location?.split(",")[0] || "unknown location"}
                            </strong>.
                        </p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAssignModal(false)}>Cancel</Button>
                    <Button
                        variant="primary"
                        onClick={handleAssign}
                        disabled={(!assignByLocation && !selectedStaffId) || assignLoading}
                    >
                        {assignLoading ? <Spinner as="span" animation="border" size="sm" /> : "Assign"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Quotation Modal */}
            <CreateQuotationModal
                show={showQuotationModal}
                handleClose={() => {
                    setShowQuotationModal(false);
                    setSelectedQuotationLead(null);
                }}
                lead={selectedQuotationLead}
            />

            {/* Add Enquiry Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg" centered className="premium-modal">
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">Add New Enquiry</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddSubmit}>
                        <Row>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Customer Full Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g. Meena Gupta"
                                        value={addForm.fullName}
                                        onChange={(e) => setAddForm({ ...addForm, fullName: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="e.g. meena@yahoo.com"
                                        value={addForm.email}
                                        onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Mobile Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g. +91 98765 43210"
                                        value={addForm.mobileNumber}
                                        onChange={(e) => setAddForm({ ...addForm, mobileNumber: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Event Type</Form.Label>
                                    <Form.Select
                                        value={addForm.eventType}
                                        onChange={(e) => setAddForm({ ...addForm, eventType: e.target.value })}
                                        required
                                    >
                                        <option value="Wedding">Wedding</option>
                                        <option value="Birthday">Birthday</option>
                                        <option value="Corporate">Corporate</option>
                                        <option value="Conference">Conference</option>
                                        <option value="Exhibition">Exhibition</option>
                                        <option value="Other">Other</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Event Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={addForm.eventDate}
                                        onChange={(e) => setAddForm({ ...addForm, eventDate: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Guest Count</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        value={addForm.guestCount}
                                        onChange={(e) => setAddForm({ ...addForm, guestCount: parseInt(e.target.value) || 0 })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Location / Venue</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g. Mumbai"
                                        value={addForm.location}
                                        onChange={(e) => setAddForm({ ...addForm, location: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Budget (₹)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        value={addForm.budget}
                                        onChange={(e) => setAddForm({ ...addForm, budget: parseInt(e.target.value) || 0 })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12} className="mb-3">
                                <Form.Label className="fw-semibold">Required Services</Form.Label>
                                <div className="d-flex flex-wrap gap-2 py-1">
                                    {[
                                        { name: "Decoration", icon: "✨" },
                                        { name: "Photography", icon: "📷" },
                                        { name: "Catering", icon: "🍽️" },
                                        { name: "Entertainment", icon: "🎉" },
                                        { name: "Venue", icon: "📍" }
                                    ].map((service) => {
                                        const isSelected = addForm.serviceRequired.includes(service.name);
                                        return (
                                            <div
                                                key={service.name}
                                                onClick={() => {
                                                    const updated = isSelected
                                                        ? addForm.serviceRequired.filter(s => s !== service.name)
                                                        : [...addForm.serviceRequired, service.name];
                                                    setAddForm({ ...addForm, serviceRequired: updated });
                                                }}
                                                style={{
                                                    padding: "8px 14px",
                                                    borderRadius: "12px",
                                                    cursor: "pointer",
                                                    fontWeight: "500",
                                                    fontSize: "13px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                    border: isSelected ? "2px solid #0D9488" : "2px solid #e5e7eb",
                                                    background: isSelected ? "#e6f4f2" : "#ffffff",
                                                    color: isSelected ? "#0F766E" : "#4b5563",
                                                    userSelect: "none"
                                                }}
                                            >
                                                <span>{service.icon}</span>
                                                <span>{service.name}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Col>
                            <Col md={12} className="mb-3">
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter any additional details or requirements..."
                                        value={addForm.description}
                                        onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
                            <Button variant="primary" type="submit" style={{ backgroundColor: "#0D9488", borderColor: "#0D9488" }}>Add Lead</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default LeadManagement;