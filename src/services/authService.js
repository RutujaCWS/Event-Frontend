// services/authService.js
import api from './api';

// Auth endpoints
export const loginUser = (email, password) => api.post('/auth/login', { email, password });
export const registerUser = (userData) => api.post('/auth/register', userData);

// OTP (for registration)
export const sendMobileOtp = (mobile) => api.post('/auth/send-mobile-otp', { mobile });
export const verifyMobileOtp = (mobile, otpCode) => api.post('/auth/verify-mobile-otp', { mobile, otpCode });
export const sendEmailOtp = (email) => api.post('/auth/send-email-otp', { email });
export const verifyEmailOtp = (email, otpCode) => api.post('/auth/verify-email-otp', { email, otpCode });

// Mobile login OTP endpoints if you implement them
export const sendLoginOtp = (mobile) => api.post('/auth/send-login-otp', { mobile });
export const mobileLogin = (mobile, otpCode) => api.post('/auth/verify-login-otp', { mobile, otpCode });

export const forgotPassword = (email) =>
  api.post("/auth/forgot-password", { email });

export const resetPassword = (token, password) =>
  api.post(`/auth/reset-password/${token}`, { password });

// Profile APIs
export const getProfile = () =>
  api.get("/auth/me");

export const updateProfile = (data) =>
  api.put("/auth/profile", data);

export const getProfileStats = () =>
  api.get("/auth/profile/stats");

export const getRecentEnquiries = () =>
  api.get("/auth/profile/recent-enquiries");
export const changePassword = (data) =>
  api.put("/auth/change-password", data);
export const uploadProfileImage = (formData) => {
  return axiosInstance.post(
    "/auth/upload-profile-image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};