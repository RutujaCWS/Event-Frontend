import { useState, useEffect } from "react";
import { FaPlus, FaClipboardList } from "react-icons/fa";
import CreateEnquiryModal from "../../component/enquiries/CreateEnquiryModal";
import EnquiryTable from "../../component/enquiries/EnquiryTable";
import { getEnquiries, deleteEnquiry } from "../../services/enquiryService";
import EditEnquiryModal from "../../component/enquiries/EditEnquiryModal";
import ViewEnquiryModal from "../../component/enquiries/ViewEnquiryModal";

const Enquiries = () => {
  const [showModal, setShowModal] = useState(false);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // FILTER LOGIC (unchanged)
  const filteredEnquiries = enquiries.filter((item) => {
    const matchesSearch =
      item.eventType?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Reset to page 1 when search or status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // PAGINATION CALCULATIONS
  const totalFiltered = filteredEnquiries.length;
  const totalPages = Math.ceil(totalFiltered / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEnquiries = filteredEnquiries.slice(startIndex, endIndex);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const response = await getEnquiries();
      console.log("API RESPONSE", response.data);
      setEnquiries(response.data.data || []);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this enquiry?"
    );
    if (!confirmDelete) return;
    try {
      await deleteEnquiry(id);
      alert("Enquiry deleted successfully");
      fetchEnquiries();
    } catch (error) {
      console.error(error);
      alert("Failed to delete enquiry");
    }
  };

  const handleEdit = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setShowEditModal(true);
  };

  const handleView = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setShowViewModal(true);
  };

  // CARDS COUNTER VARIABLES (using full enquiries, not filtered)
  const totalEnquiries = enquiries.length;
  const pendingCount = enquiries.filter((item) => item.status === "Pending").length;
  const reviewedCount = enquiries.filter((item) => item.status === "Reviewed").length;
  const quotedCount = enquiries.filter((item) => item.status === "Quoted").length;
  const confirmedCount = enquiries.filter((item) => item.status === "Confirmed").length;

  return (
    <>
      <div className="container-fluid py-3">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">My Enquiries</h2>
            <p className="text-muted mb-0">
              Create and manage your event enquiries.
            </p>
          </div>
          <button
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={() => setShowModal(true)}
          >
            <FaPlus />
            New Enquiry
          </button>
        </div>

        {/* ENQUIRY SUMMARY CARDS */}
        <div className="row g-3 mb-4">
          <div className="col-xl col-md-4 col-sm-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h6 className="text-muted">Total Enquiries</h6>
                <h2 className="fw-bold text-primary mb-0">{totalEnquiries}</h2>
              </div>
            </div>
          </div>
          <div className="col-xl col-md-4 col-sm-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h6 className="text-muted">Pending</h6>
                <h2 className="fw-bold text-warning mb-0">{pendingCount}</h2>
              </div>
            </div>
          </div>
          <div className="col-xl col-md-4 col-sm-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h6 className="text-muted">Reviewed</h6>
                <h2 className="fw-bold text-success mb-0">{reviewedCount}</h2>
              </div>
            </div>
          </div>
          <div className="col-xl col-md-4 col-sm-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h6 className="text-muted">Quoted</h6>
                <h2 className="fw-bold text-info mb-0">{quotedCount}</h2>
              </div>
            </div>
          </div>
          <div className="col-xl col-md-4 col-sm-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center">
                <h6 className="text-muted">Confirmed</h6>
                <h2 className="fw-bold text-danger mb-0">{confirmedCount}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER */}
        <div className="row mb-4">
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Event Type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Quoted">Quoted</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* MAIN CONTENT */}
        {loading ? (
          <div className="text-center py-5">
            <h5>Loading enquiries...</h5>
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div
            className="card border-0 shadow-sm text-center p-5"
            style={{ borderRadius: "12px" }}
          >
            <FaClipboardList size={50} className="mx-auto text-secondary mb-3" />
            <h5>No enquiries found</h5>
            <p className="text-muted">
              Start by creating your first event enquiry.
            </p>
            <button
              className="btn btn-primary mt-2"
              onClick={() => setShowModal(true)}
            >
              Create Enquiry
            </button>
          </div>
        ) : (
          <>
            <EnquiryTable
              enquiries={paginatedEnquiries}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              handleView={handleView}
            />

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="text-muted small">
                  Showing {startIndex + 1} to {Math.min(endIndex, totalFiltered)} of {totalFiltered} entries
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
          </>
        )}
      </div>

      {/* MODALS (unchanged) */}
      <EditEnquiryModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        enquiry={selectedEnquiry}
        fetchEnquiries={fetchEnquiries}
      />
      <CreateEnquiryModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        fetchEnquiries={fetchEnquiries}
      />
      <ViewEnquiryModal
        show={showViewModal}
        handleClose={() => setShowViewModal(false)}
        enquiry={selectedEnquiry}
      />
    </>
  );
};

export default Enquiries;