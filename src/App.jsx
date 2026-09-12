import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Components/Common/Navbar";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Technician from "./Pages/Technician";
import Contact from "./Pages/Contact";
import Login from "./Pages/Auth/login";
import Technician_Registration from "./Pages/Auth/Technician-Registration";
import Technician_Dashboard from "./Pages/Technician/Dashboard";
import User_Dashboard from "./Pages/Owner/Dashboard";
import Service_Request from "./Pages/Technician/Service_Request";
import Technician_Profile from "./Pages/Technician/Profile";
import AllServiceRequestPage from "./Pages/Technician/AllServiceRequest";
import AllJobSummaryPage from "./Pages/Technician/AllJobSummary";
import Accept_Service_Request from "./Pages/Technician/ServiceRequestAccept";
import Reject_Service_Request from "./Pages/Technician/ServiceRequestReject";
import ViewProfile from "./Pages/Owner/ViewProfile";
import ServiceRequest from "./Pages/Owner/ServiceRequest";
import RequestHistory from "./Pages/Owner/RequestHistory";
import MyRequest from "./Pages/Owner/MyRequest";
import VerifyEmail from "./Pages/Auth/VerifyEmail";
import EmailEntryForgotPassword from "./Pages/Auth/Email-Entry-Forget-Password";
import EmailSendForgotPassword from "./Pages/Auth/Email-Send-Forget-Password";
import SetNewPasswordForgotPassword from "./Pages/Auth/Set-New-Password-Forget-Password";
import PasswordResetedForgotPassword from "./Pages/Auth/Password-Reseted-Forget-Password";
import Admin_Dashboard from "./Pages/admin/Dashboard";
import All_Instruments from "./Pages/admin/Instruments";
import All_Service_Requests from "./Pages/admin/Service_Requests";
import All_Technicians from "./Pages/admin/Technicians";
import All_Users from "./Pages/admin/Users";
import UserRegistration from "./Pages/Auth/User-Registration";
import View_Statistics from "./Pages/admin/View_Statistics";

// 🔹 import ProtectedRoute
import ProtectedRoute from "./Components/auth/ProtectedRoute";

if (!window.__instrumentcare_toast_alert_patched) {
  window.alert = (message) => {
    toast.success(String(message), {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  };
  window.__instrumentcare_toast_alert_patched = true;
}

export default function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        {/* ===== Common Routes ===== */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/technician" element={<Technician />} />
        <Route path="/contact" element={<Contact />} />

        {/* ===== Auth Routes ===== */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/user-registration" element={<UserRegistration />} />
        <Route
          path="/auth/tech-registration"
          element={<Technician_Registration />}
        />
        <Route path="/auth/verify-email" element={<VerifyEmail />} />
        <Route
          path="/auth/email-entry-forgot-password"
          element={<EmailEntryForgotPassword />}
        />
        <Route
          path="/auth/email-send-forgot-password"
          element={<EmailSendForgotPassword />}
        />
        <Route
          path="/auth/set-new-password-forgot-password"
          element={<SetNewPasswordForgotPassword />}
        />
        <Route
          path="/auth/password-reseted-forgot-password"
          element={<PasswordResetedForgotPassword />}
        />

        {/* ===== Admin Routes (role: 1) ==== */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allow={[1]}>
              <Admin_Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/instrument"
          element={
            <ProtectedRoute allow={[1]}>
              <All_Instruments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/service-requests"
          element={
            <ProtectedRoute allow={[1]}>
              <All_Service_Requests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/technicians"
          element={
            <ProtectedRoute allow={[1]}>
              <All_Technicians />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/owners"
          element={
            <ProtectedRoute allow={[1]}>
              <All_Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/statistics"
          element={
            <ProtectedRoute allow={[1]}>
              <View_Statistics />
            </ProtectedRoute>
          }
        />

        {/* ===== Technician Routes (role: 10) ===== */}
        <Route
          path="/tech/dashboard"
          element={
            <ProtectedRoute allow={[1, 10]}>
              <Technician_Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tech/service-request"
          element={
            <ProtectedRoute allow={[1, 10]}>
              <Service_Request />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tech/profile"
          element={
            <ProtectedRoute allow={[1, 10]}>
              <Technician_Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tech/all-service-request"
          element={
            <ProtectedRoute allow={[1, 10]}>
              <AllServiceRequestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tech/all-job-summary"
          element={
            <ProtectedRoute allow={[1, 10]}>
              <AllJobSummaryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tech/accept-service-request"
          element={
            <ProtectedRoute allow={[1, 10]}>
              <Accept_Service_Request />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tech/reject-service-request"
          element={
            <ProtectedRoute allow={[1, 10]}>
              <Reject_Service_Request />
            </ProtectedRoute>
          }
        />

        {/* ===== User Routes (role: 8) ===== */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allow={[1, 2, 3, 4, 5, 6, 7, 8, 9]}>
              <User_Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/view-profile/:id"
          element={
            <ProtectedRoute allow={[1, 2, 3, 4, 5, 6, 7, 8, 9]}>
              <ViewProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/service-request/:id"
          element={
            <ProtectedRoute allow={[1, 2, 3, 4, 5, 6, 7, 8, 9]}>
              <ServiceRequest />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/service-history/:id"
          element={
            <ProtectedRoute allow={[1, 2, 3, 4, 5, 6, 7, 8, 9]}>
              <RequestHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/my-request"
          element={
            <ProtectedRoute allow={[1, 2, 3, 4, 5, 6, 7, 8, 9]}>
              <MyRequest />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
