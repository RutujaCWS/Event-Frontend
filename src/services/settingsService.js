import api from "./api";

// Get tax & discount settings
export const getTaxDiscountSettings = () =>
  api.get("/admin/settings/tax-discount");

// Update tax & discount settings
export const updateTaxDiscountSettings = (data) =>
  api.put("/admin/settings/tax-discount", data);