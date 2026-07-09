import api from "./api";

// Get tax & discount settings
export const getTaxDiscountSettings = () =>
  api.get("/admin/settings/tax-discount");

// Update tax & discount settings
export const updateTaxDiscountSettings = (data) =>
  api.put("/admin/settings/tax-discount", data);

export const getWhatsAppQR = () =>
  api.get("/whatsapp/qr");

export const getWhatsAppStatus = () =>
  api.get("/whatsapp/status");

export const logoutWhatsapp = () =>
  api.post("/whatsapp/logout");




//  Get SMS settings (sender ID, sender number, enabled status)
 
export const getSmsSettings = async () => {
  const response = await api.get("/admin/sms-settings");   
  return response.data;
};

export const updateSmsSettings = async (data) => {
  const response = await api.put("/admin/sms-settings", data);   
  return response.data;
};

// default staff permissions
export const getDefaultStaffPermissions = async () => {
  const response = await api.get("/admin/settings/default-permissions");
  return response.data;
};

export const updateDefaultStaffPermissions = async (data) => {
  const response = await api.put("/admin/settings/default-permissions", data);
  return response.data;
}
export const getPaymentSettings = async () => {
  const response = await api.get("/admin/payment-settings");
  return response.data;  
};

export const updatePaymentSettings = async (data) => {
  const response = await api.put("/admin/payment-settings", data);
  return response.data;  
};

export const getBusinessSettings = async () => {
    const response = await api.get("/admin/business-settings");
    return response.data;
  };

export const updateBusinessSettings = (data) =>
    api.put("/admin/business-settings", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });