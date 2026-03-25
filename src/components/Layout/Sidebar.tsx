import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  LogOut,
  Heart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { path: '/analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
  { path: '/patients', label: 'Patients', icon: <Users size={20} /> },
];

export const Sidebar: React.FC = () => {
  const { logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
      <div className="sidebar-header">
        <div className="brand">
          <div className="brand-icon">
            <Heart size={20} />
          </div>
          {sidebarOpen && <span className="brand-name">HealthOS</span>}
        </div>
        <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {sidebarOpen && <span className="nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item logout-btn" onClick={handleLogout}>
          <span className="nav-icon"><LogOut size={20} /></span>
          {sidebarOpen && <span className="nav-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
};
