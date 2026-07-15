import api from "./api";

export const getTestimonials = () =>
  api.get("/testimonials");

export const getTestimonialById = (id) =>
  api.get(`/testimonials/${id}`);

export const createTestimonial = (data) =>
  api.post("/testimonials", data);

export const updateTestimonial = (id, data) =>
  api.put(`/testimonials/${id}`, data);

export const deleteTestimonial = (id) =>
  api.delete(`/testimonials/${id}`);