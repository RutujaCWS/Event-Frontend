import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Spinner, Form, Dropdown, Modal, Button } from "react-bootstrap";
import {
    TbCategory, TbListDetails, TbCircleCheck, TbReportMoney, TbCircleOff,
    TbHeart, TbCake, TbBriefcase, TbCrown, TbSparkles,
    TbPlus, TbFilter, TbChevronLeft, TbChevronRight, TbDotsVertical,
    TbTrash, TbEdit, TbEye, TbTrendingUp, TbAlertTriangle, TbDownload
} from "react-icons/tb";
import "./Services.css";

const initialServices = [
    { id: "srv_1", name: "Grand Wedding Package", desc: "Venue + Decor + Catering", category: "Wedding", duration: "2 days", bookings: 18, basePrice: 120000, rating: 4.9, isActive: true },
    { id: "srv_2", name: "Intimate Wedding", desc: "Upto 50 guests - premium decoration & buffet", category: "Wedding", duration: "1 day", bookings: 7, basePrice: 65000, rating: 4.8, isActive: true },
    { id: "srv_3", name: "Birthday Bash", desc: "Full decor + entertainment setup", category: "Birthday", duration: "4 hrs", bookings: 24, basePrice: 25000, rating: 4.7, isActive: true },
    { id: "srv_4", name: "Corporate Conference", desc: "AV setup + hospitality coordination", category: "Corporate", duration: "1 day", bookings: 9, basePrice: 85000, rating: 4.8, isActive: true },
    { id: "srv_5", name: "DJ & Sound System", desc: "Full night setup - outdoor & indoor sound system", category: "Wedding", duration: "8 hrs", bookings: 5, basePrice: 22000, rating: 4.5, isActive: true },
    { id: "srv_6", name: "Haldi & Mehendi Decor", desc: "Marigold floral decor with seating", category: "Wedding", duration: "1 day", bookings: 12, basePrice: 35000, rating: 4.6, isActive: true },
    { id: "srv_7", name: "Corporate Gala Dinner", desc: "Premium banquet, stage setup, and lights", category: "Corporate", duration: "6 hrs", bookings: 15, basePrice: 150000, rating: 4.9, isActive: true },
    { id: "srv_8", name: "Traditional Puja Decor", desc: "Elegant temple style decorations", category: "Religious", duration: "5 hrs", bookings: 31, basePrice: 15000, rating: 4.4, isActive: true },
    { id: "srv_9", name: "Kids Birthday Theme", desc: "Cartoon themes, balloon arch, games", category: "Birthday", duration: "3 hrs", bookings: 40, basePrice: 20000, rating: 4.8, isActive: true },
    { id: "srv_10", name: "Anniversary Candlelight", desc: "Private tailored dinner and setup", category: "Custom", duration: "4 hrs", bookings: 10, basePrice: 45000, rating: 4.7, isActive: true },
    { id: "srv_11", name: "Sufi Music Concert", desc: "Traditional seating, sound, artist booking", category: "Custom", duration: "5 hrs", bookings: 6, basePrice: 80000, rating: 4.9, isActive: true },
    { id: "srv_12", name: "Product Launch Setup", desc: "Stage, LED wall, branding backdrops", category: "Corporate", duration: "2 days", bookings: 4, basePrice: 250000, rating: 4.9, isActive: true },
    { id: "srv_13", name: "Ganesh Festival Stage", desc: "Mandap decoration & theme setup", category: "Religious", duration: "3 days", bookings: 50, basePrice: 40000, rating: 4.8, isActive: true },
    { id: "srv_14", name: "Temple Marriage Setup", desc: "Aesthetic floral mandap & seating", category: "Religious", duration: "1 day", bookings: 14, basePrice: 55000, rating: 4.7, isActive: false },
    { id: "srv_15", name: "Pool Party setup", desc: "Summer theme, DJ console, balloons", category: "Birthday", duration: "6 hrs", bookings: 8, basePrice: 30000, rating: 4.3, isActive: true },
    { id: "srv_16", name: "VIP Lounge & Bar Setup", desc: "Premium lounge seating, bar counter, LED lights", category: "Custom", duration: "8 hrs", bookings: 11, basePrice: 75000, rating: 4.6, isActive: false },
    { id: "srv_17", name: "Exhibition Stall Setup", desc: "Modular booth design and assembly", category: "Corporate", duration: "3 days", bookings: 3, basePrice: 180000, rating: 4.5, isActive: false },
    { id: "srv_18", name: "Destination Marriage Planner", desc: "Full end-to-end planning with travel desk", category: "Wedding", duration: "3 days", bookings: 15, basePrice: 500000, rating: 4.9, isActive: true },
    { id: "srv_19", name: "Interactive Games Zone", desc: "Hosting, VR setup, target shooting", category: "Birthday", duration: "2 hrs", bookings: 19, basePrice: 12000, rating: 4.5, isActive: true },
    { id: "srv_20", name: "Devotional Bhajan Mandali", desc: "Singer team, stage, musical instruments", category: "Religious", duration: "4 hrs", bookings: 28, basePrice: 18000, rating: 4.6, isActive: true },
    { id: "srv_21", name: "Baby Shower Setup", desc: "Cradle decor, photo booth, catering", category: "Custom", duration: "4 hrs", bookings: 22, basePrice: 28000, rating: 4.7, isActive: true },
    { id: "srv_22", name: "Retirement Party Celebration", desc: "Aesthetic backdrop, slideshow setup, banquet", category: "Custom", duration: "5 hrs", bookings: 9, basePrice: 35000, rating: 4.4, isActive: false },
    { id: "srv_23", name: "Executive Seminar Room", desc: "Seating arrangement, projector, mic setup", category: "Corporate", duration: "1 day", bookings: 11, basePrice: 45000, rating: 4.6, isActive: true },
    { id: "srv_24", name: "Grand Reception Stage", desc: "3D theme stage, floral arch, carpet", category: "Wedding", duration: "1 day", bookings: 25, basePrice: 90000, rating: 4.8, isActive: false }
];

const categoriesData = [
    { id: "wedding", name: "Wedding", desc: "Marriage ceremonies & parties", bookings: "1,240", services: "42", status: "HEALTHY", statusType: "healthy", icon: <TbHeart size={22} />, bgColor: "#FFEAEF", iconColor: "#EF4444" },
    { id: "birthday", name: "Birthday", desc: "Kids & adult celebrations", bookings: "890", services: "18", status: "HEALTHY", statusType: "healthy", icon: <TbCake size={22} />, bgColor: "#FFF7DF", iconColor: "#F59E0B" },
    { id: "corporate", name: "Corporate", desc: "Meetings & conferences", bookings: "450", services: "15", status: "REVIEW", statusType: "review", icon: <TbBriefcase size={22} />, bgColor: "#E5F0FF", iconColor: "#2563EB" },
    { id: "religious", name: "Religious", desc: "Traditional rituals", bookings: "320", services: "12", status: "HEALTHY", statusType: "healthy", icon: <TbCrown size={22} />, bgColor: "#E8FDF0", iconColor: "#10B981" },
    { id: "custom", name: "Custom", desc: "Special tailored events", bookings: "150", services: "8", status: "NEW", statusType: "new", icon: <TbSparkles size={22} />, bgColor: "#F3E8FF", iconColor: "#8B5CF6" }
];

const Services = () => {
    const [services, setServices] = useState(initialServices);
    const [activeCategoryTab, setActiveCategoryTab] = useState("All"); // All, Wedding, Birthday, Corporate, Religious, Custom
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [selectedServiceIds, setSelectedServiceIds] = useState([]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Modal States
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    // Form States
    const [addForm, setAddForm] = useState({ name: "", desc: "", category: "Wedding", duration: "", basePrice: "", rating: 4.8, isActive: true });
    const [editForm, setEditForm] = useState({ name: "", desc: "", category: "Wedding", duration: "", basePrice: "", rating: 4.8, isActive: true });

    // Alert Notification
    const [toastAlert, setToastAlert] = useState({ show: false, message: "", type: "success" });

    const triggerToast = (message, type = "success") => {
        setToastAlert({ show: true, message, type });
        setTimeout(() => {
            setToastAlert(prev => ({ ...prev, show: false }));
        }, 4000);
    };

    // KPIs
    const kpis = [
        { label: "Event Categories", value: categoriesData.length, desc: "All configured", isAlert: false, icon: <TbCategory size={20} />, bgColor: "#DDF5F0", iconColor: "#0F766E" },
        { label: "Total Services", value: services.length, desc: "+3 this month", isAlert: false, icon: <TbListDetails size={20} />, bgColor: "#E8F0FE", iconColor: "#2563EB" },
        { label: "Active Services", value: services.filter(s => s.isActive).length, desc: `${Math.round((services.filter(s => s.isActive).length / services.length) * 100)}% enabled`, isAlert: false, icon: <TbCircleCheck size={20} />, bgColor: "#E7F4EE", iconColor: "#14B8A6" },
        { label: "Avg. Package Price", value: `₹${Math.round(services.reduce((acc, s) => acc + s.basePrice, 0) / services.length / 1000)}K`, desc: "+5 onboard", isAlert: false, icon: <TbReportMoney size={20} />, bgColor: "#FEF3D7", iconColor: "#D97706" },
        { label: "Disabled Services", value: services.filter(s => !s.isActive).length, desc: "Needs review", isAlert: true, icon: <TbCircleOff size={20} />, bgColor: "#FDE8E8", iconColor: "#EF4444" }
    ];

    // Reset pagination when filter changes
    useEffect(() => {
        setCurrentPage(1);
        setSelectedServiceIds([]);
    }, [activeCategoryTab, search, sortOrder, statusFilter]);

    // Filtering
    const filteredServices = services.filter(srv => {
        const matchesCategory = activeCategoryTab === "All" || srv.category === activeCategoryTab;
        const matchesSearch = srv.name.toLowerCase().includes(search.toLowerCase()) || srv.desc.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "" || (statusFilter === "active" ? srv.isActive : !srv.isActive);
        return matchesCategory && matchesSearch && matchesStatus;
    });

    // Sorting
    const sortedServices = [...filteredServices].sort((a, b) => {
        if (sortOrder === "price-asc") return a.basePrice - b.basePrice;
        if (sortOrder === "price-desc") return b.basePrice - a.basePrice;
        if (sortOrder === "rating-desc") return b.rating - a.rating;
        if (sortOrder === "bookings-desc") return b.bookings - a.bookings;
        return 0; // Default
    });

    // Pagination bounds
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedServices.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedServices.length / itemsPerPage) || 1;

    // Page selection
    const handleSelectAll = () => {
        const visibleIds = currentItems.map(item => item.id);
        const allSelected = visibleIds.length > 0 && visibleIds.every(id => selectedServiceIds.includes(id));
        if (allSelected) {
            setSelectedServiceIds(prev => prev.filter(id => !visibleIds.includes(id)));
        } else {
            setSelectedServiceIds(prev => {
                const toAdd = visibleIds.filter(id => !prev.includes(id));
                return [...prev, ...toAdd];
            });
        }
    };

    const handleSelectService = (id) => {
        setSelectedServiceIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // Add Service Submit
    const handleAddSubmit = (e) => {
        e.preventDefault();
        if (!addForm.name || !addForm.duration || !addForm.basePrice) {
            triggerToast("Please fill all required fields", "danger");
            return;
        }
        const newService = {
            id: "srv_" + (services.length + 1),
            name: addForm.name,
            desc: addForm.desc || "Standard Package",
            category: addForm.category,
            duration: addForm.duration,
            bookings: 0,
            basePrice: parseFloat(addForm.basePrice),
            rating: parseFloat(addForm.rating) || 4.8,
            isActive: addForm.isActive
        };
        setServices([newService, ...services]);
        setShowAddModal(false);
        setAddForm({ name: "", desc: "", category: "Wedding", duration: "", basePrice: "", rating: 4.8, isActive: true });
        triggerToast("Service created successfully!");
    };

    // Edit Service Submit
    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!editForm.name || !editForm.duration || !editForm.basePrice) {
            triggerToast("Please fill all required fields", "danger");
            return;
        }
        setServices(prev => prev.map(s => s.id === selectedService.id ? {
            ...s,
            name: editForm.name,
            desc: editForm.desc,
            category: editForm.category,
            duration: editForm.duration,
            basePrice: parseFloat(editForm.basePrice),
            isActive: editForm.isActive
        } : s));
        setShowEditModal(false);
        triggerToast("Service updated successfully!");
    };

    // Toggle Active/Disable Status
    const toggleServiceStatus = (service) => {
        setServices(prev => prev.map(s => s.id === service.id ? { ...s, isActive: !s.isActive } : s));
        triggerToast(`Service is now ${!service.isActive ? 'Active' : 'Disabled'}`);
    };

    // Delete/Remove Service
    const handleDeleteSubmit = () => {
        setServices(prev => prev.filter(s => s.id !== selectedService.id));
        setShowDeleteModal(false);
        triggerToast("Service deleted successfully!");
    };

    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) pages.push(i);
        return pages;
    };

    return (
        <div className="services-page-container p-3 p-md-4">
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

            {/* 5 KPI Metric Cards */}
            <Row className="mb-4 g-3 g-md-4">
                {kpis.map((kpi, idx) => (
                    <Col key={idx} xl lg={4} md={6} sm={6} xs={6}>
                        <Card className="metric-card">
                            <Card.Body className="metric-body">
                                <div className="metric-top">
                                    <div
                                        className="metric-icon-box"
                                        style={{ backgroundColor: kpi.bgColor, color: kpi.iconColor }}
                                    >
                                        {kpi.icon}
                                    </div>
                                    <h2 className="metric-number">{kpi.value}</h2>
                                </div>
                                <div className="metric-title">{kpi.label}</div>
                                {kpi.isAlert ? (
                                    <div className="metric-alert">
                                        <TbAlertTriangle size={14} />
                                        <span>{kpi.desc}</span>
                                    </div>
                                ) : (
                                    <div className="metric-growth text-success">
                                        <TbTrendingUp size={14} />
                                        <span>{kpi.desc}</span>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Event Categories Header */}
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                    <h2 className="h2-section m-0">Event Categories</h2>
                    <span className="title-badge">{categoriesData.length} categories</span>
                </div>
                <button className="btn btn-manage-categories">
                    Manage Categories
                </button>
            </div>

            {/* 5 Category Cards */}
            <Row className="g-3 mb-5 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5">
                {categoriesData.map((item, idx) => (
                    <Col key={idx}>
                        <div className="category-card">
                            <div className="category-card-header">
                                <div className="category-icon-box" style={{ backgroundColor: item.bgColor, color: item.iconColor }}>
                                    {item.icon}
                                </div>
                                <span className={`category-badge category-badge-${item.statusType}`}>
                                    {item.status}
                                </span>
                            </div>
                            <h3 className="category-title">{item.name}</h3>
                            <p className="category-desc">{item.desc}</p>
                            <div className="category-stats-row">
                                <div className="category-stat-col">
                                    <span className="category-stat-label">BOOKINGS</span>
                                    <span className="category-stat-value">{item.bookings}</span>
                                </div>
                                <div className="category-stat-col">
                                    <span className="category-stat-label">SERVICES</span>
                                    <span className="category-stat-value">{item.services}</span>
                                </div>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>

            {/* Services List Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div className="d-flex align-items-center gap-2">
                    <h2 className="h2-section m-0">Services List</h2>
                    <span className="title-badge">{services.length} services</span>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-filter-trigger">
                        <TbFilter size={16} /> Filter
                    </button>
                    <button className="btn btn-add-service" onClick={() => setShowAddModal(true)}>
                        <TbPlus size={16} /> Add Services
                    </button>
                </div>
            </div>

            {/* Tabs and Filtering Bar */}
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
                <div className="filter-pills-row m-0">
                    <button
                        onClick={() => setActiveCategoryTab("All")}
                        className={`btn filter-pill-btn ${activeCategoryTab === "All" ? "active" : ""}`}
                    >
                        All({services.length})
                    </button>
                    {categoriesData.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategoryTab(cat.name)}
                            className={`btn filter-pill-btn ${activeCategoryTab === cat.name ? "active" : ""}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Services Table Card */}
            <Card className="border-0 shadow-sm" style={{ borderRadius: "16px", overflow: "hidden" }}>
                <Card.Body className="p-0">
                    <Table responsive hover className="custom-table mb-0 align-middle">
                        <thead>
                            <tr>
                                <th className="px-4" style={{ width: "50px" }}>
                                    <input
                                        type="checkbox"
                                        style={{ cursor: "pointer" }}
                                        checked={currentItems.length > 0 && currentItems.every(item => selectedServiceIds.includes(item.id))}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th style={{ minWidth: "220px" }}>SERVICE</th>
                                <th style={{ minWidth: "120px" }}>CATEGORY</th>
                                <th style={{ minWidth: "110px" }}>DURATION</th>
                                <th style={{ minWidth: "110px" }}>BOOKINGS</th>
                                <th style={{ minWidth: "130px" }}>BASE PRICE</th>
                                <th style={{ minWidth: "100px" }}>RATING</th>
                                <th style={{ minWidth: "110px" }}>STATUS</th>
                                <th className="text-end px-4" style={{ width: "240px" }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center py-5 text-muted body-base">No services found</td>
                                </tr>
                            ) : (
                                currentItems.map((srv) => (
                                    <tr key={srv.id}>
                                        <td className="px-4">
                                            <input
                                                type="checkbox"
                                                style={{ cursor: "pointer" }}
                                                checked={selectedServiceIds.includes(srv.id)}
                                                onChange={() => handleSelectService(srv.id)}
                                            />
                                        </td>
                                        <td>
                                            <div>
                                                <div className="service-name-text" style={{ lineHeight: "1.2" }}>{srv.name}</div>
                                                <div className="service-desc-text">{srv.desc}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`category-badge-tbl category-badge-tbl-${srv.category.toLowerCase()}`}>
                                                {srv.category}
                                            </span>
                                        </td>
                                        <td className="service-duration-text">{srv.duration}</td>
                                        <td className="service-bookings-text">{srv.bookings}</td>
                                        <td className="service-price-text">
                                            ₹{srv.basePrice.toLocaleString("en-IN")}
                                        </td>
                                        <td className="service-rating-text">{srv.rating}</td>
                                        <td>
                                            <span className={`badge-dot badge-dot-${srv.isActive ? 'active' : 'inactive'}`}>
                                                <span className="status-dot" />
                                                {srv.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="text-end px-4">
                                            <div className="d-flex justify-content-end gap-2">
                                                <button
                                                    className="btn btn-action-view"
                                                    onClick={() => {
                                                        setSelectedService(srv);
                                                        setShowViewModal(true);
                                                    }}
                                                >
                                                    View
                                                </button>
                                                <button
                                                    className="btn btn-action-edit"
                                                    onClick={() => {
                                                        setSelectedService(srv);
                                                        setEditForm({ name: srv.name, desc: srv.desc, category: srv.category, duration: srv.duration, basePrice: srv.basePrice, rating: srv.rating, isActive: srv.isActive });
                                                        setShowEditModal(true);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className={`btn ${srv.isActive ? "btn-action-disable" : "btn-action-enable"}`}
                                                    onClick={() => toggleServiceStatus(srv)}
                                                >
                                                    {srv.isActive ? "Disable" : "Enable"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>

                    {/* Pagination Footer */}
                    <div className="d-flex flex-column flex-sm-row gap-3 justify-content-between align-items-center py-3 py-md-4 px-3 px-md-4 bg-white border-top">
                        <span className="text-muted body-small">
                            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedServices.length)} of {sortedServices.length} services
                        </span>

                        <div className="d-flex gap-1 align-items-center flex-wrap justify-content-center">
                            <button
                                className="custom-pagination-btn"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                {"<"}
                            </button>

                            {getPageNumbers().map(p => (
                                <button
                                    key={p}
                                    className={`custom-pagination-btn ${currentPage === p ? "active" : ""}`}
                                    onClick={() => setCurrentPage(p)}
                                >
                                    {p}
                                </button>
                            ))}

                            <button
                                className="custom-pagination-btn"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                {">"}
                            </button>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            {/* --- ADD SERVICE MODAL --- */}
            <Modal
                show={showAddModal}
                onHide={() => setShowAddModal(false)}
                centered
                className="premium-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title className="h2-section m-0">Add New Service</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleAddSubmit}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Service Name *</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g. Grand Stage Lighting"
                                value={addForm.name}
                                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                placeholder="Brief description of the package"
                                value={addForm.desc}
                                onChange={(e) => setAddForm({ ...addForm, desc: e.target.value })}
                            />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Select
                                        value={addForm.category}
                                        onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                                    >
                                        <option value="Wedding">Wedding</option>
                                        <option value="Birthday">Birthday</option>
                                        <option value="Corporate">Corporate</option>
                                        <option value="Religious">Religious</option>
                                        <option value="Custom">Custom</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Duration *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g. 1 day, 6 hrs"
                                        value={addForm.duration}
                                        onChange={(e) => setAddForm({ ...addForm, duration: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Base Price (₹) *</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="e.g. 45000"
                                        value={addForm.basePrice}
                                        onChange={(e) => setAddForm({ ...addForm, basePrice: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Mock Rating (1-5)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.1"
                                        min="1"
                                        max="5"
                                        value={addForm.rating}
                                        onChange={(e) => setAddForm({ ...addForm, rating: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-1 mt-2">
                            <Form.Check
                                type="checkbox"
                                label="Set service as active immediately"
                                checked={addForm.isActive}
                                onChange={(e) => setAddForm({ ...addForm, isActive: e.target.checked })}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="btn-submit">
                            Save Service
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* --- EDIT SERVICE MODAL --- */}
            <Modal
                show={showEditModal}
                onHide={() => setShowEditModal(false)}
                centered
                className="premium-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title className="h2-section m-0">Edit Service Details</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleEditSubmit}>
                    <Modal.Body>
                        {selectedService && (
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Label>Service Name *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        value={editForm.desc}
                                        onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })}
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Category</Form.Label>
                                            <Form.Select
                                                value={editForm.category}
                                                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                            >
                                                <option value="Wedding">Wedding</option>
                                                <option value="Birthday">Birthday</option>
                                                <option value="Corporate">Corporate</option>
                                                <option value="Religious">Religious</option>
                                                <option value="Custom">Custom</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Duration *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={editForm.duration}
                                                onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Base Price (₹) *</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={editForm.basePrice}
                                                onChange={(e) => setEditForm({ ...editForm, basePrice: e.target.value })}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-1 mt-2">
                                    <Form.Check
                                        type="checkbox"
                                        label="Service is Active"
                                        checked={editForm.isActive}
                                        onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                                    />
                                </Form.Group>
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="btn-submit">
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* --- VIEW SERVICE MODAL --- */}
            <Modal
                show={showViewModal}
                onHide={() => setShowViewModal(false)}
                centered
                className="premium-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title className="h2-section m-0">Service Specifications</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedService && (
                        <div className="p-1">
                            <h4 className="fw-bold text-dark mb-1" style={{ fontSize: "16px" }}>{selectedService.name}</h4>
                            <span className={`category-badge-tbl category-badge-tbl-${selectedService.category.toLowerCase()} mb-3 d-inline-block`}>
                                {selectedService.category}
                            </span>
                            <p className="text-secondary body-base mb-4">{selectedService.desc}</p>

                            <Row className="g-3 py-2 border-top border-bottom mb-4">
                                <Col xs={6}>
                                    <div className="d-flex flex-column">
                                        <span className="text-muted caption">DURATION</span>
                                        <span className="fw-bold text-dark body-base">{selectedService.duration}</span>
                                    </div>
                                </Col>
                                <Col xs={6}>
                                    <div className="d-flex flex-column">
                                        <span className="text-muted caption">BASE PRICE</span>
                                        <span className="fw-bold text-dark body-base">₹{selectedService.basePrice.toLocaleString("en-IN")}</span>
                                    </div>
                                </Col>
                                <Col xs={6} className="mt-3">
                                    <div className="d-flex flex-column">
                                        <span className="text-muted caption">TOTAL BOOKINGS</span>
                                        <span className="fw-bold text-dark body-base">{selectedService.bookings} times</span>
                                    </div>
                                </Col>
                                <Col xs={6} className="mt-3">
                                    <div className="d-flex flex-column">
                                        <span className="text-muted caption">AVERAGE RATING</span>
                                        <span className="fw-bold text-warning body-base">★ {selectedService.rating} / 5</span>
                                    </div>
                                </Col>
                            </Row>

                            <div className="d-flex align-items-center gap-2">
                                <span className="text-secondary body-small">Operational Status:</span>
                                <span className={`badge-dot badge-dot-${selectedService.isActive ? 'active' : 'inactive'}`}>
                                    <span
                                        style={{
                                            width: "6px",
                                            height: "6px",
                                            borderRadius: "50%",
                                            backgroundColor: selectedService.isActive ? "#14B8A6" : "#c5221f"
                                        }}
                                    />
                                    {selectedService.isActive ? "Available" : "Suspended"}
                                </span>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" className="btn-submit w-100" onClick={() => setShowViewModal(false)}>
                        Close Specifications
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Services;