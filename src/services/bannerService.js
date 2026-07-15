import api from "./api";

// Get All Banners
export const getAllBanners = () => api.get("/banner");

// Get Single Banner
export const getBannerById = (id) => api.get(`/banner/${id}`);

// Create Banner
export const createBanner = (formData) =>
  api.post("/banner", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Update Banner
export const updateBanner = (id, formData) =>
  api.put(`/banner/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Delete Banner
export const deleteBanner = (id) =>
  api.delete(`/banner/${id}`);

// Toggle Status
export const toggleBannerStatus = (id) =>
  api.patch(`/banner/status/${id}`);