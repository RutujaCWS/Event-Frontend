import api from "./api";

export const getGalleryEvents = () =>
  api.get("/gallery");

export const getGalleryEventById = (id) =>
  api.get(`/gallery/${id}`);

export const createGalleryEvent = (data) =>
  api.post("/gallery", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateGalleryEvent = (id, data) =>
  api.put(`/gallery/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteGalleryEvent = (id) =>
  api.delete(`/gallery/${id}`);