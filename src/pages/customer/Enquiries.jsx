import { useState, useEffect } from "react";
import { FaPlus, FaClipboardList } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import CreateEnquiryModal from "../../component/enquiries/CreateEnquiryModal";
import EditEnquiryModal from "../../component/enquiries/EditEnquiryModal";
import ViewEnquiryModal from "../../component/enquiries/ViewEnquiryModal";
import { getEnquiries, deleteEnquiry } from "../../services/enquiryService";
import { getCustomerQuotations } from "../../services/quotationService";
import EnquiryList from "../../component/enquiries/EnquiryList";
import EnquiryDetail from "../../component/enquiries/EnquiryDetail";

const Enquiries = () => {
  // const [showModal, setShowModal] = useState(false);
  const [enquiries, setEnquiries] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [selectedEnquiryId, setSelectedEnquiryId] = useState(null);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const location = useLocation();
  const [showModal, setShowModal] = useState(
    location.state?.openCreateModal || false
  )

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const [enquiryRes, quotationRes] = await Promise.all([
        getEnquiries(),
        getCustomerQuotations().catch((err) => {
          console.warn("Failed to load customer quotations:", err);
          return { data: { success: true, data: [] } };
        })
      ]);
      setEnquiries(enquiryRes.data.data || []);
      setQuotations(quotationRes.data.data || []);
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
      if (selectedEnquiryId === id) {
        setSelectedEnquiryId(null);
      }
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

  return (
    <>
      {selectedEnquiryId ? (
        <EnquiryDetail
          enquiryId={selectedEnquiryId}
          enquiries={enquiries}
          quotations={quotations}
          onBack={() => setSelectedEnquiryId(null)}
          onRefresh={fetchEnquiries}
        />
      ) : (
        <EnquiryList
          enquiries={enquiries}
          loading={loading}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          handleViewDetails={(id) => setSelectedEnquiryId(id)}
          onNewEnquiryClick={() => setShowModal(true)}
        />
      )}

      {/* MODALS */}
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
    </>
  );
};

export default Enquiries;