import { useEffect, useState } from "react";
import { getAllLeads, updateLead } from "../../services/leadService";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import API from "../../services/api";
import CreateQuotationModal from "../admin/Quotation/createQuotationModel"

const LeadManagement = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editLead, setEditLead] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
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

    useEffect(() => {
        fetchLeads();
    }, []);

    // Reset to page 1 if leads change and current page becomes invalid
    useEffect(() => {
        const totalPages = Math.ceil(leads.length / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        } else if (leads.length === 0) {
            setCurrentPage(1);
        }
    }, [leads, currentPage]);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const response = await getAllLeads();
            setLeads(response.data.data || []);
        } catch (error) {
            console.error(error);
            alert("Failed to fetch leads. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // VIEW FUNCTION
    const handleView = (lead) => {
        setSelectedLead(lead);
        setShowViewModal(true);
    };

    const handleEdit = (lead) => {
        // Clone lead and format date for input (YYYY-MM-DD)
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
            alert("Lead updated successfully");
        } catch (error) {
            console.error(error);
            alert("Failed to update lead");
        }
    };

   const handleCreateQuote = (lead) => {
        setSelectedQuotationLead(lead);
        setShowQuotationModal(true);
        };

    // ---------- Assign Lead Functions ----------
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
            fetchLeads(); // refresh table
            alert("Lead assigned successfully");
        } catch (error) {
            setAssignError(error.response?.data?.message || "Assignment failed");
        } finally {
            setAssignLoading(false);
        }
    };
    // Stats calculations
    const totalLeads = leads.length;
    const pendingLeads = leads.filter(lead => lead.status === "Pending").length;
    const reviewedLeads = leads.filter(lead => lead.status === "Reviewed").length;
    const quotedLeads = leads.filter(lead => lead.status === "Quoted").length;
    const confirmedLeads = leads.filter(lead => lead.status === "Confirmed").length;

    // Pagination logic
    const indexOfLastLead = currentPage * itemsPerPage;
    const indexOfFirstLead = indexOfLastLead - itemsPerPage;
    const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);
    const totalPages = Math.ceil(leads.length / itemsPerPage);
 return (
        <div className="container-fluid py-3">
            {/* Stats Cards */}
            <div className="row g-3 mb-4">
                <div className="col-lg col-md-6">
                    <div className="card border-0 shadow-sm bg-primary text-white h-100">
                        <div className="card-body">
                            <small>Total Enquiries</small>
                            <h2 className="fw-bold mb-0">{totalLeads}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-lg col-md-6">
                    <div className="card border-0 shadow-sm bg-warning text-white h-100">
                        <div className="card-body">
                            <small>Pending Review</small>
                            <h2 className="fw-bold mb-0">{pendingLeads}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-lg col-md-6">
                    <div className="card border-0 shadow-sm bg-success text-white h-100">
                        <div className="card-body">
                            <small>Reviewed</small>
                            <h2 className="fw-bold mb-0">{reviewedLeads}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-lg col-md-6">
                    <div className="card border-0 shadow-sm bg-info text-white h-100">
                        <div className="card-body">
                            <small>Quotation Sent</small>
                            <h2 className="fw-bold mb-0">{quotedLeads}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-lg col-md-6">
                    <div className="card border-0 shadow-sm bg-danger text-white h-100">
                        <div className="card-body">
                            <small>Bookings</small>
                            <h2 className="fw-bold mb-0">{confirmedLeads}</h2>
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="fw-bold mb-4">Lead Management</h2>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <>
                    <div className="card shadow-sm">
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover table-striped mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Lead ID</th>
                                            <th>Customer Name</th>
                                            <th>Event Type</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentLeads.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4">
                                                    No leads found.
                                                </td>
                                            </tr>
                                        ) : (
                                            currentLeads.map((item) => (
                                                <tr key={item._id}>
                                                    <td>
                                                        <code>{item._id.slice(-6)}</code>
                                                    </td>
                                                    <td>{item.customerId?.name || item.fullName || "N/A"}</td>
                                                    <td>{item.eventType}</td>
                                                    <td>
                                                        {item.eventDate
                                                            ? new Date(item.eventDate).toLocaleDateString()
                                                            : "N/A"}
                                                    </td>
                                                    <td>
                                                        <span
                                                            className={`badge ${item.status === "Pending"
                                                                ? "bg-warning"
                                                                : item.status === "Reviewed"
                                                                    ? "bg-success"
                                                                    : item.status === "Quoted"
                                                                        ? "bg-info"
                                                                        : item.status === "Confirmed"
                                                                            ? "bg-primary"
                                                                            : "bg-secondary"
                                                                }`}
                                                        >
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            onClick={() => handleView(item)}
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-warning ms-2"
                                                            onClick={() => handleEdit(item)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-success ms-2"
                                                            onClick={() => handleCreateQuote(item)}
                                                        >
                                                            Create Quote
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-info ms-2"
                                                            onClick={() => openAssignModal(item)}
                                                        >
                                                            Assign
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="card-footer bg-transparent d-flex justify-content-between align-items-center">
                                <div className="text-muted small">
                                    Showing {indexOfFirstLead + 1} to{" "}
                                    {Math.min(indexOfLastLead, totalLeads)} of {totalLeads} entries
                                </div>
                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-outline-primary btn-sm"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                    >
                                        Previous
                                    </button>
                                    <span className="align-self-center">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        className="btn btn-outline-primary btn-sm"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

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
            <CreateQuotationModal
                show={showQuotationModal}
                handleClose={() => {
                    setShowQuotationModal(false);
                    setSelectedQuotationLead(null);
                }}
                lead={selectedQuotationLead}
                />
        </div>
    );
};

export default LeadManagement;