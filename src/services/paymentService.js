import api from './api';

export const paymentService = {
  // Create online payment order
  createOnlinePaymentOrder: async (bookingId, paymentType) => {
    const response = await api.post(`/payments/online/${bookingId}`, { paymentType });
    return response.data;
  },

  // Verify payment
  verifyPayment: async (paymentData) => {
    const response = await api.post('/payments/verify/payment', paymentData);
    return response.data;
  },

  // Process offline payment
  processOfflinePayment: async (bookingId, paymentData) => {
    const response = await api.post(`/payments/offline/${bookingId}`, paymentData);
    return response.data;
  },

  // Get payment summary for a booking
  getPaymentSummary: async (bookingId) => {
    const response = await api.get(`/payments/${bookingId}/summary`);
    return response.data;
  },

  // Get all bookings payment summary (Admin)
  getBookingPaymentSummary: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams ? `/payments/bookings/summary?${queryParams}` : '/payments/bookings/summary';
    const response = await api.get(url);
    return response.data;
  },

  // Process Razorpay refund (Admin)
  processRazorpayRefund: async (bookingId, refundData) => {
    const response = await api.post(`/payments/${bookingId}/refund`, refundData);
    return response.data;
  },

  // Process offline refund (Admin)
  processOfflineRefund: async (bookingId, refundData) => {
    const response = await api.post(`/payments/${bookingId}/offline/refund`, refundData);
    return response.data;
  },

  // Initialize Razorpay payment
  initializeRazorpayPayment: (options) => {
    return new Promise((resolve, reject) => {
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => openRazorpay(options, resolve, reject);
        script.onerror = () => reject(new Error('Failed to load Razorpay'));
        document.body.appendChild(script);
      } else {
        openRazorpay(options, resolve, reject);
      }
    });
  }
};

// Helper function to open Razorpay
const openRazorpay = (options, resolve, reject) => {
  const { orderId, amount, keyId, bookingId, paymentType, customerName, customerEmail, customerMobile } = options;

  const razorpayOptions = {
    key: keyId,
    amount: amount,
    currency: 'INR',
    name: 'Event Management',
    description: `${paymentType} Payment`,
    order_id: orderId,
    prefill: {
      name: customerName,
      email: customerEmail,
      contact: customerMobile
    },
    theme: { color: '#F37254' },
    handler: async function(response) {
      try {
        const result = await paymentService.verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          bookingId: bookingId,
          paymentType: paymentType
        });
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }
  };

  const razorpay = new window.Razorpay(razorpayOptions);
  razorpay.open();
};