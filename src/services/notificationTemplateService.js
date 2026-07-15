import api from "./api";

// ===============================
// Get Notification Settings
// ===============================
export const getNotificationSettings = async () => {
  const response = await api.get("/admin/notification-settings");
  return response.data;
};

// ===============================
// Update Global Notification Settings
// ===============================
export const updateNotificationSettings = async (data) => {
  const response = await api.put("/admin/notification-settings", data);
  return response.data;
};

// ===============================
// Update Individual Template
// template = bookingConfirmation
// paymentReminder
// quotationSent
// insertVariables
// ===============================
export const updateNotificationTemplate = async (template, data) => {
  const response = await api.put(
    `/admin/notification-settings/template/${template}`,
    data
  );
  return response.data;
};

// ===============================
// Reset All Templates
// ===============================
export const resetNotificationTemplates = async () => {
  const response = await api.post("/admin/notification-settings/reset");
  return response.data;
};