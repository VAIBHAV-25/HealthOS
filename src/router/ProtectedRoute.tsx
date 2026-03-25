import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const ProtectedRoute: React.FC = () => {
  const { user, initialized } = useAuthStore();

  if (!initialized) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Loading HealthOS...</p>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
