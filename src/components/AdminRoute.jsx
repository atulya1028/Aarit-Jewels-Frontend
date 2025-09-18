import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useSelector((state) => state.auth);
  console.log('AdminRoute: Checking auth:', { isAuthenticated, isLoading, userRole: user?.role }); // Debug log
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return isAuthenticated && user?.role === 'admin' ? children : <Navigate to="/login" />;
};

export default AdminRoute;