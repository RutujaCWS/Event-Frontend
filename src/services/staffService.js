// src/services/staffService.js
import api from "./api";

export const getAssignedCount = () => api.get("/staff/enquiries/count");

export const getAssignedEnquiries = (page = 1, limit = 10, status = "all") => {
  // Note: path must include '/assigned'
  return api.get(`/staff/enquiries/assigned?page=${page}&limit=${limit}&status=${status}`);
};

export const updateEnquiryStatus = (id, status, note = "") => {
  return api.put(`/staff/enquiries/${id}/status`, { status, note });
};

export const getAssignedStatusCounts = () => {
  return api.get("/staff/enquiries/status-counts");
}