import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/Auth/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const token = localStorage.getItem("token");

  // 🚀 If no token, redirect instantly 
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists but still verifying, show loader (this will be brief)
  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  // If token exists but user is null (verification failed) → redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role check
  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "staff") return <Navigate to="/staff/dashboard" replace />;
    return <Navigate to="/customer/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;