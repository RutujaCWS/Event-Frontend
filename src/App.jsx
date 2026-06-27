import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./auth/LoginPage";
import RegisterPage from "./auth/RegisterPage";
import EventLandingPage from "./pages/LandingPage/EventLandingPage";
import CustomerDashboard from "./pages/customer/Dashboard/CustomerDashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
// ✅ imported
import ForgotPasswordPage from "./auth/ForgotPasswordPage";
import ChangeNewPassword from "./auth/CreateNewPassword";
import AboutPage from "./pages/LandingPage/AboutPage";
import GalleryPage from "./pages/LandingPage/GalleryPage";
import ContactPage from "./pages/LandingPage/ContactPage";
import CmsPage from "./pages/admin/CMS/CmsPage";
import ServiceDetails from "./pages/LandingPage/ServiceDetails";
import Enquiries from "./pages/customer/Enquiries";
import LeadManagement from "./pages/admin/LeadManagement";
import StaffEnquiries from "./pages/staff/StaffEnquiries";
import Showquotation from "./pages/admin/Quotation/ShowQuotation";
import CustomerQuotation from "./pages/customer/quotation/CustomerQuotation"
import BookingManagement from "./pages/admin/Booking/BookingManagement"
import ServicesPage from "./pages/admin/Services"
import CustomerBooking from "./pages/admin/Booking/CustomerBooking"

import AdminSettings from "./pages/admin/AdminSettings";
import InvoiceGSTManagement from "./pages/admin/InvoiceGSTManagement";
const DashboardIndex = () => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  // Role-based redirect
  if (user?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if (user?.role === "staff") {
    return <Navigate to="/staff/dashboard" replace />;
  }
  return <Navigate to="/customer/dashboard" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<EventLandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ChangeNewPassword />} />
        <Route
          path="/services/:slug"
          element={<ServiceDetails />}
        />

        {/* Protected Routes (with sidebar + logout) */}
        <Route element={<MainLayout />}>
          <Route path="portal" element={<DashboardIndex />} />

          {/* Customer */}
          <Route path="customer/dashboard" element={<CustomerDashboard />} />
          <Route path="customer/enquiries" element={<Enquiries />} />
           {/* <Route path="customer/quotations/:token" element={<CustomerQuotation/>} /> */}
           <Route path="customer/quotations" element={<CustomerQuotation />} />
           <Route
              path="customer/bookings"
              element={<CustomerBooking />}
            />
          <Route path="admin/Services" element={<ServicesPage/>}
          />

          {/* Staff */}
          {/* Staff */}
          <Route path="staff/dashboard" element={<StaffDashboard/>} />
          <Route path="staff/enquiries" element={<StaffEnquiries />} />
          



          {/* Admin */}
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="admin/users" element={<UserManagement />} />
          <Route path="admin/CmsPage" element={<CmsPage />} />
          <Route path="admin/enquiries" element={<LeadManagement />} />
          <Route path="admin/bookings" element={<BookingManagement />} />
          <Route path="admin/settings" element={<AdminSettings />} />
          <Route path="admin/quotations" element={<Showquotation />} />
          <Route path="admin/invoices" element={<InvoiceGSTManagement/>} />
          <Route path="admin/services" element={<ServicesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;