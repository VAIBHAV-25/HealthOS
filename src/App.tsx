import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { ProtectedRoute } from './router/ProtectedRoute';
import { AppShell } from './components/Layout/AppShell';
import { LoginPage } from './pages/Login/LoginPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { AnalyticsPage } from './pages/Analytics/AnalyticsPage';
import { PatientsPage } from './pages/Patients/PatientsPage';
import { useServiceWorker } from './hooks/useServiceWorker';

const AppInner: React.FC = () => {
  const { watchAuth } = useAuthStore();
  useServiceWorker();

  useEffect(() => {
    const unsubscribe = watchAuth();
    return () => unsubscribe();
  }, [watchAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/patients" element={<PatientsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

const App: React.FC = () => <AppInner />;

export default App;
