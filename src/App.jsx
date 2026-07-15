import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./Context/Auth/AuthContext";
import ProtectedRoute from "./route/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./auth/LoginPage";
import RegisterPage from "./auth/RegisterPage";
import EventLandingPage from "./pages/LandingPage/EventLandingPage";
import CustomerDashboard from "./pages/customer/Dashboard/CustomerDashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import ForgotPasswordPage from "./auth/ForgotPasswordPage";
import ChangeNewPassword from "./auth/CreateNewPassword";
import OtpDemo from "./auth/OtpDemo";
import ResetPasswordDemo from "./auth/ResetPasswordDemo";
import AboutPage from "./pages/LandingPage/AboutPage";
import GalleryPage from "./pages/LandingPage/GalleryPage";
import ContactPage from "./pages/LandingPage/ContactPage";
import CmsPage from "./pages/admin/CMS/CmsPage";
import ServiceDetails from "./pages/LandingPage/ServiceDetails";
import Enquiries from "./pages/customer/Enquiries";
import LeadManagement from "./pages/admin/LeadManagement";
import StaffEnquiries from "./pages/staff/StaffEnquiries";
import Showquotation from "./pages/admin/Quotation/ShowQuotation";
import CustomerQuotation from "./pages/customer/quotation/CustomerQuotation";
import BookingManagement from "./pages/admin/Booking/BookingManagement";
import ServicesPage from "./pages/admin/Services";
import CustomerProfile from "./pages/customer/CustomerProfile";
import CustomerBooking from "./pages/admin/Booking/CustomerBooking"
import CustomerBookingDetails from "./pages/admin/Booking/CustomerBookingDetails";
import ReportManagement from "./pages/admin/Report/ReportManagement";
import PaymentManagement from "./pages/admin/Payment/PaymentManagement";
import AdminSettings from "./pages/admin/AdminSettings/AdminSettings";
import InvoiceGSTManagement from "./pages/admin/InvoiceGSTManagement";
import Notifications from "./pages/shared/Notifications/Notifications";
import EventCmsPage from "./pages/admin/EventCMS/EventCmsPage";
import CustomerInvoice from "./pages/customer/invoice/CustomerInvoice";

import CustomerPayment from "./pages/customer/CustomerPayment";
const DashboardIndex = () => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") === "true";

    document.body.classList.toggle("dark-mode", darkMode);
  }, []);

  //const { user } = useAuth();

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
      <AuthProvider>
        <Routes>
          {/* ===== PUBLIC ROUTES ===== */}
          <Route path="/" element={<EventLandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/otp-demo" element={<OtpDemo />} />
          <Route path="/reset-password-demo" element={<ResetPasswordDemo />} />
          <Route path="/reset-password/:token" element={<ChangeNewPassword />} />
          <Route path="/services/:slug" element={<ServiceDetails />} />

          {/* ===== PROTECTED ROUTES ===== */}
          {/* ✅ MainLayout is inside ProtectedRoute – NO FLASH */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="portal" element={<DashboardIndex />} />

          {/* Customer */}
          <Route path="customer/dashboard" element={<CustomerDashboard />} />
          <Route path="customer/enquiries" element={<Enquiries />} />
           {/* <Route path="customer/quotations/:token" element={<CustomerQuotation/>} /> */}
           <Route path="customer/quotations" element={<CustomerQuotation />} />
          <Route path="customer/invoices" element={<CustomerInvoice />} />
           <Route
            path="customer/profile"
            element={<CustomerProfile />}
          />

          <Route
            path="customer/bookings"
            element={<CustomerBooking />}
          />
          <Route
        path="customer/bookings/:id"
        element={<CustomerBookingDetails />}
      />
          <Route path="admin/Services" element={<ServicesPage/>}
          />

          {/* Staff */}
          {/* Staff */}
          <Route path="staff/dashboard" element={<StaffDashboard/>} />
          <Route path="staff/enquiries" element={<StaffEnquiries />} />
          
          <Route path="customer/payments" element={<CustomerPayment />} />
            {/* Customer */}
            <Route path="customer/dashboard" element={<CustomerDashboard />} />
            <Route path="customer/enquiries" element={<Enquiries />} />
            <Route path="customer/quotations" element={<CustomerQuotation />} />
            <Route path="customer/profile" element={<CustomerProfile />} />
            <Route path="customer/bookings" element={<CustomerBooking />} />
            <Route path="customer/notifications" element={<Notifications />} />



            {/* Staff */}
            <Route path="staff/dashboard" element={<StaffDashboard />} />
            <Route path="staff/enquiries" element={<StaffEnquiries />} />
            <Route path="staff/notifications" element={<Notifications />} />

            {/* Admin */}
            <Route path="admin/dashboard" element={<AdminDashboard />} />
            <Route path="admin/users" element={<UserManagement />} />
            <Route path="admin/Services" element={<ServicesPage />} />
            <Route path="admin/CmsPage" element={<CmsPage />} />
            <Route path="admin/enquiries" element={<LeadManagement />} />
            <Route path="admin/bookings" element={<BookingManagement />} />
            <Route path="admin/settings" element={<AdminSettings />} />

            
            <Route path="admin/quotations" element={<Showquotation />} />
            <Route path="admin/invoices" element={<InvoiceGSTManagement />} />
            <Route path="admin/services" element={<ServicesPage />} />
            <Route path="admin/reports" element={<ReportManagement />} />
            <Route path="admin/payments" element={<PaymentManagement />} />
            <Route path="admin/notifications" element={<Notifications />} />

            {/* Shared */}
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/admin/event-cms" element={<EventCmsPage />}
/>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;