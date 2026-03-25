import { create } from 'zustand';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: Date;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'critical';
}

interface UIState {
  sidebarOpen: boolean;
  notificationPermission: NotificationPermission | 'unknown';
  notifications: AppNotification[];
  swRegistration: ServiceWorkerRegistration | null;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSwRegistration: (reg: ServiceWorkerRegistration) => void;
  requestNotificationPermission: () => Promise<void>;
  sendLocalNotification: (title: string, body: string, type?: AppNotification['type']) => void;
  markAllRead: () => void;
  unreadCount: () => number;
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarOpen: true,
  notificationPermission: 'unknown',
  notifications: [
    {
      id: 'n1',
      title: 'Critical Alert',
      body: 'Patient Marcus Chen (P002) vitals require immediate attention.',
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false,
      type: 'critical',
    },
    {
      id: 'n2',
      title: 'New Admission',
      body: 'Patient Ethan Brown admitted to ICU – Sepsis protocol initiated.',
      timestamp: new Date(Date.now() - 30 * 60000),
      read: false,
      type: 'warning',
    },
    {
      id: 'n3',
      title: 'Discharge Approved',
      body: 'Patient Mia Jackson cleared for discharge from Pulmonology.',
      timestamp: new Date(Date.now() - 2 * 3600000),
      read: true,
      type: 'success',
    },
  ],
  swRegistration: null,

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSwRegistration: (reg) => set({ swRegistration: reg }),

  requestNotificationPermission: async () => {
    if (!('Notification' in window)) return;
    const permission = await Notification.requestPermission();
    set({ notificationPermission: permission });
  },

  sendLocalNotification: (title, body, type = 'info') => {
    const newNotif: AppNotification = {
      id: `n-${Date.now()}`,
      title,
      body,
      timestamp: new Date(),
      read: false,
      type,
    };
    set((s) => ({ notifications: [newNotif, ...s.notifications] }));

    // Send via service worker if available and permission granted
    const { swRegistration, notificationPermission } = get();
    if (swRegistration && notificationPermission === 'granted') {
      swRegistration.active?.postMessage({
        type: 'SHOW_NOTIFICATION',
        title,
        body,
        tag: `healthos-${Date.now()}`,
      });
    } else if (notificationPermission === 'granted') {
      new Notification(title, { body, icon: '/vite.svg' });
    }
  },

  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    })),

  unreadCount: () => get().notifications.filter((n) => !n.read).length,
}));
