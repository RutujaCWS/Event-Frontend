import api from "./api";

export const getContact = () =>
  api.get("/contact");

export const updateContact = (data) =>
  api.put("/contact", data);