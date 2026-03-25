import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useUIStore } from '../../store/uiStore';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/analytics': 'Analytics',
  '/patients': 'Patient Management',
};

export const AppShell: React.FC = () => {
  const { sidebarOpen } = useUIStore();
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'HealthOS';

  return (
    <div className={`app-shell ${sidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      <Sidebar />
      <div className="main-area">
        <Topbar title={title} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
