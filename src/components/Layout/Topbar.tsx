import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

export const Topbar: React.FC<{ title: string }> = ({ title }) => {
  const { user, logout } = useAuthStore();
  const { notifications, markAllRead, unreadCount } = useUIStore();
  
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  
  const count = unreadCount();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  const displayName =
    (user as { displayName?: string })?.displayName || user?.email || 'Dr. Alex Morgan';
  const initials = getInitials(typeof displayName === 'string' ? displayName : 'DA');

  const formatTime = (date: Date, now: number) => {
    const diff = now - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const typeColors: Record<string, string> = {
    critical: 'var(--color-danger)',
    warning: 'var(--color-warning)',
    success: 'var(--color-success)',
    info: 'var(--color-primary)',
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="page-title">{title}</h1>
      </div>

      <div className="topbar-right">
        <div className="topbar-search">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="search-input" 
            autoComplete="off"
            spellCheck="false"
            data-lpignore="true"
            data-form-type="other"
            name="global-search-off"
          />
        </div>

        <div className="notif-wrapper" ref={notifRef}>
          <button
            className="icon-btn notif-btn"
            onClick={() => { setShowNotifs((s) => !s); setShowProfile(false); if (!showNotifs) markAllRead(); }}
            aria-label="Notifications"
          >
            <Bell size={20} />
            {count > 0 && <span className="notif-badge">{count}</span>}
          </button>

          {showNotifs && (
            <div className="notif-panel">
              <div className="notif-panel-header">
                <span>Notifications</span>
                <button className="mark-read-btn" onClick={markAllRead}>Mark all read</button>
              </div>
              <div className="notif-list">
                {notifications.length === 0 ? (
                  <p className="no-notifs">No notifications</p>
                ) : (
                  (() => {
                    // eslint-disable-next-line
                    const now = Date.now();
                    return notifications.slice(0, 8).map((n) => (
                      <div key={n.id} className={`notif-item ${n.read ? 'read' : 'unread'}`}>
                        <div
                          className="notif-dot"
                          style={{ background: typeColors[n.type] }}
                        />
                        <div className="notif-content">
                          <p className="notif-title">{n.title}</p>
                          <p className="notif-body">{n.body}</p>
                          <p className="notif-time">{formatTime(n.timestamp, now)}</p>
                        </div>
                      </div>
                    ));
                  })()
                )}
              </div>
            </div>
          )}
        </div>

        <div className="profile-wrapper" ref={profileRef}>
          <button 
            className="user-avatar" 
            title={String(displayName)}
            onClick={() => { setShowProfile((s) => !s); setShowNotifs(false); }}
            aria-expanded={showProfile}
            aria-haspopup="true"
          >
            {initials}
          </button>

          {showProfile && (
            <div className="profile-dropdown">
              <div className="profile-header">
                <div className="profile-info">
                  <p className="profile-name">{displayName}</p>
                  <p className="profile-email">{user?.email || 'demo@healthos.com'}</p>
                </div>
              </div>
              <div className="profile-menu">
                <button className="profile-menu-item text-danger" onClick={() => logout()}>
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
