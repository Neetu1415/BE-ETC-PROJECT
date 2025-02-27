import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, authLoaded } = useSelector((state) => state.auth);

  // If auth state is not loaded yet, show a loader.
  if (!authLoaded) {
    return <div>Loading...</div>;
  }

  // If no user is present, redirect to login.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user's role is not allowed, redirect (or show unauthorized page)
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
