import api from "./api";

export const getCmsSection = (section) =>
  api.get(`/cms/${section}`);

export const updateCmsSection = (section, data) =>
  api.put(`/cms/${section}`, data);

export const updateLogo = (formData) =>
  api.put("/cms/logo/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });