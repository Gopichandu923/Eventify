import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
  // Check for the presence of the authentication token
  const isAuthenticated = localStorage.getItem("token");

  // Renders the child route if authenticated, otherwise redirects
  return isAuthenticated ? <Outlet /> : <Navigate to="/organizer/auth" />;
};

export default ProtectedRoute;
