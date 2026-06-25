import api from "./api";

// Create
export const createQuotation = (data) =>
  api.post("/quotations", data);

// Get All
export const getAllQuotations = () =>
  api.get("/quotations");

// Get By Id
export const getQuotationById = (id) =>
  api.get(`/quotations/${id}`);

// Update
export const updateQuotation = (id, data) =>
  api.put(`/quotations/${id}`, data);

// Delete
export const deleteQuotation = (id) =>
  api.delete(`/quotations/${id}`);

//Send Quotation
export const sendQuotation = (id) =>
  api.put(`/quotations/send/${id}`);

  export const getCustomerQuotations = () =>
  api.get("/quotations/customer/quotations");

export const getQuotationByToken = (token) =>
  api.get(`/quotations/review/${token}`);

export const approveQuotation = (id) =>
  api.post(`/quotations/${id}/approve`);

export const rejectQuotation = (id, data) =>
 api.post(`/quotations/${id}/reject`, data);
