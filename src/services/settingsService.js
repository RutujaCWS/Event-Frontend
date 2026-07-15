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


// ===== PAYMENT SETTINGS =====
export const getPaymentSettings = async () => {
  const response = await api.get("/admin/payment-settings");
  return response.data;
};

export const updatePaymentSettings = async (data) => {
  const response = await api.put("/admin/payment-settings", data);
  return response.data;
};

// ===== PAYMENT GATEWAY SETTINGS =====
export const getGateways = async () => {
  const response = await api.get("/admin/gateways");
  return response.data;
};

export const saveGateway = async (data) => {
  const response = await api.post("/admin/gateway", data);
  return response.data;
};

export const configureGateway = async (gatewayKey, data) => {
  const response = await api.put(`/admin/gateway/${gatewayKey}/configure`, data);
  return response.data;
};

export const toggleGateway = async (gatewayKey, action) => {
  const response = await api.put(`/admin/gateway/${gatewayKey}/toggle`, { action });
  return response.data;
};

export const setPrimaryGateway = async (gatewayKey) => {
  const response = await api.post("/admin/gateway/primary", { gatewayKey });
  return response.data;
};

export const testRazorpayConnection = async (data) => {
  const response = await api.post("/admin/gateway/test-razorpay", data);
  return response.data;
};

// GST Settings

export const getGSTSettings = async () => {
  const response = await api.get("/admin/settings/gst");
  return response.data;
}

export const updateGSTSettings = async (data) => {
  const response = await api.put("/admin/settings/gst", data);
  return response.data;
}
