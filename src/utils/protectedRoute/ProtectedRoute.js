import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
  let user = localStorage.getItem("_id");
  let role = localStorage.getItem("role");

  let location = useLocation();

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  } else if (allowedRole && role !== allowedRole) {
    return <Navigate to="/Dashboard" state={{ from: location }} replace />;
  }
  return children;
};

export default ProtectedRoute;
