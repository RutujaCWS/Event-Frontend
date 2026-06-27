import api from "./api";

export const bookingData = {
  // Get all bookings
  getAllBookings: async () => {
    try {
      const response = await api.get('/bookings');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get booking by ID
  getBookingById: async (id) => {
    try {
      const response = await api.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get customer bookings
  getCustomerBookings: async () => {
    const response = await api.get("/bookings/customer/bookings");
    return response.data;
  },

  // Confirm advance payment
  confirmAdvancePayment: async (id) => {
    try {
      const response = await api.put(`/bookings/${id}/confirm-payment`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getBookingStats: async () => {
    const response = await api.get(
      "/bookings/stats"
    );
  
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id) => {
    try {
      const response = await api.put(`/bookings/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
