import api from "./api";

// Customer Dashboard Enquiry (logged in user)
export const createEnquiry = async (enquiryData) => {
  return api.post("/enquiries", enquiryData);
};

// Public Website Enquiry (no login)
export const createPublicEnquiry = async (enquiryData) => {
  return api.post("/enquiries/public", enquiryData);
};

export const getEnquiries = async () => {
  return api.get("/enquiries");
};

export const getEnquiryById = async (id) => {
  return api.get(`/enquiries/${id}`);
};

export const deleteEnquiry = (id) => {
  return api.delete(`/enquiries/${id}`);
};

export const updateEnquiry = (id, data) =>
  api.put(`/enquiries/${id}`, data);
