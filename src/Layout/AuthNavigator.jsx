import React from "react";
import PrivateLayout from "./PrivateLayout";
import { Navigate } from "react-router-dom";
import useFetchAuth from "../store/Auth/useFetchAuth";
function AuthNavigator() {
  const { token } = useFetchAuth();
  return token ? <PrivateLayout /> : <Navigate to="/" />;
}

export default AuthNavigator;
