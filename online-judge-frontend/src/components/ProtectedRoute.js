import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import Loading from "./Loading";

const ProtectedRoute = ({ component: Component }) => {
  const [user, loading, error] = useAuthState(auth);
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return user ? (
    <Component />
  ) : (
    <Navigate to="/signin" state={{ from: location }} />
  );
};

export default ProtectedRoute;
