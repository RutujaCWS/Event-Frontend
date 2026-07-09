import api from './api';

// ---------- Existing auth endpoints ----------
export const loginUser = (email, password) => api.post('/auth/login', { email, password });
export const registerUser = (userData) => api.post('/auth/register', userData);
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const resetPassword = (token, password) =>
  api.post(`/auth/reset-password/${token}`, { password });


// Registration OTP
export const sendMobileOtp = (mobile) => api.post('/auth/send-mobile-otp', { mobile });
export const verifyMobileOtp = (mobile, otpCode) => api.post('/auth/verify-mobile-otp', { mobile, otpCode });
export const sendEmailOtp = (email) => api.post('/auth/send-email-otp', { email });
export const verifyEmailOtp = (email, otpCode) => api.post('/auth/verify-email-otp', { email, otpCode });

// Login OTP
export const sendLoginOtp = (mobile) => api.post('/auth/send-login-otp', { mobile });
export const verifyLoginOtp = (mobile, otpCode) => api.post('/auth/verify-login-otp', { mobile, otpCode });

// Password Reset OTP
export const sendResetPasswordOtp = (mobile) => api.post('/auth/send-reset-password-otp', { mobile });
export const resetPasswordWithOtp = (mobile, otpCode, password) =>
  api.post('/auth/reset-password', { mobile, otpCode, password });

// Alias for verifyLoginOtp (used in LoginPage)
export const mobileLogin = verifyLoginOtp;

// Profile APIs
export const getProfile = () => api.get('/auth/me');
export const updateProfile = (data) => api.put('/auth/profile', data);
export const getProfileStats = () => api.get('/auth/profile/stats');
export const getRecentEnquiries = () => api.get('/auth/profile/recent-enquiries');
export const changePassword = (data) => api.put('/auth/change-password', data);
export const uploadProfileImage = (formData) =>
  api.post('/auth/upload-profile-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
