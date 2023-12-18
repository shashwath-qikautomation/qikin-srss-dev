import React from "react";
import { Navigate } from "react-router-dom";
import { routes } from "../helper/routes";

const ProtectedRoute = ({ children }) => {
  let token = localStorage.getItem("token");

  return token ? children : <Navigate to={routes.login} />;
};

export default ProtectedRoute;
