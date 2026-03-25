import { useEffect } from 'react';
import { useUIStore } from '../store/uiStore';

export function useServiceWorker() {
  const { setSwRegistration, requestNotificationPermission } = useUIStore();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          setSwRegistration(reg);
          console.log('[SW] Registered:', reg.scope);
        })
        .catch((err) => console.warn('[SW] Registration failed:', err));
    }

    if ('Notification' in window) {
      useUIStore.setState({ notificationPermission: Notification.permission });
    }
  }, [setSwRegistration, requestNotificationPermission]);
}
