import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ component: Component }) => {
  const { user, loading, error, admin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} />;
  }

  if (!admin) {
    return <div>Access Denied</div>;
  }

  return <Component />;
};

export default AdminRoute;
