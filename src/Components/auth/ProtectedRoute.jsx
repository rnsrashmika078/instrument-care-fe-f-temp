// src/components/ProtectedRoute.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, allow }) {
  const location = useLocation();
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
  const rawRole = sessionStorage.getItem("role");
  const role = rawRole ? Number(rawRole) : null;

  // Not logged in → go to login
  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />;
  }

  // If 'allow' prop is provided, enforce role(s)
  if (allow && Array.isArray(allow) && !allow.includes(role)) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}
