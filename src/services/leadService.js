import api from "./api";

// Get all leads (enquiries) – admin only
export const getAllLeads = () => {
  return api.get("/admin/enquiries");
};

// Update a single lead (enquiry) – admin only
export const updateLead = (id, data) => {
  return api.put(`/admin/enquiries/${id}`, data);
};

// Assign a lead to a staff member

export const assignLead = (id, data) => {
  return api.put(`/admin/enquiries/${id}/assign`, data);
};

// Optional: get staff list for assignment dropdown
export const getStaffList = () => {
  return api.get("/admin/staff-list");
};

// Get total enquiries count (for admin dashboard card)
export const getTotalEnquiries = () => {
  return api.get("/admin/enquiries/total");
};

// Get 5 most recent enquiries (for admin dashboard table)
export const getRecentEnquiries = () => {
  return api.get("/admin/enquiries/recent");
};