import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Props: requiredRole = 'employer' or 'jobseeker'
export default function ProtectedRoute({ requiredRole }) {
  const isLoggedIn = !!localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // If the role does not match, redirect to their correct dashboard
    if (role === 'employer') return <Navigate to="/employer/apps" replace />;
    if (role === 'jobseeker') return <Navigate to="/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
