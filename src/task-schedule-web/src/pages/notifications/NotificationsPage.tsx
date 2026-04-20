import { useEffect, useState } from 'react';
import { api } from '../../services/api';

type Notification = {
  id: string;
  userId: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('zh-TW', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [message, setMessage] = useState('');

  const loadNotifications = async () => {
    try {
      const response = await api.get('/notifications/me');
      setNotifications(response.data ?? []);
    } catch {
      setMessage('Failed to load notifications.');
    }
  };

  useEffect(() => {
    void loadNotifications();
  }, []);

  const markAsRead = async (notificationId: string) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      await loadNotifications();
      setMessage('Notification marked as read.');
    } catch {
      setMessage('Failed to update notification.');
    }
  };

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <section className="theme-panel rounded-[28px] p-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="theme-kicker">
            Notifications Center
          </div>
          <h1 className="theme-text-primary mt-4 text-2xl font-semibold">Notifications</h1>
          <p className="theme-text-secondary mt-2 text-sm leading-6">Track booking events, status changes, and unread alerts in one place.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="theme-muted theme-text-secondary rounded-full px-3 py-1">{notifications.length} total</span>
          <span className="theme-card theme-text-secondary rounded-full px-3 py-1">{unreadCount} unread</span>
        </div>
      </div>
      {message && <p className="theme-text-secondary mb-4 text-sm">{message}</p>}

      {notifications.length === 0 ? (
        <section className="theme-muted rounded-3xl border-dashed p-10 text-center">
          <h2 className="theme-text-primary text-xl font-semibold">No notifications yet</h2>
          <p className="theme-text-secondary mt-2 text-sm">Booking activity and workflow updates will appear here once the platform is in use.</p>
        </section>
      ) : (
        <div className="grid gap-4">
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className={`flex flex-col gap-4 rounded-[28px] border p-5 lg:flex-row lg:items-center lg:justify-between ${
                notification.isRead ? 'theme-card' : 'theme-panel theme-tint'
              }`}
            >
              <div>
                <div className={`mb-3 ${notification.isRead ? 'theme-status-neutral' : 'theme-status-info'}`}>
                  {notification.type}
                </div>
                <div className="theme-text-secondary text-sm leading-6">{notification.message}</div>
                <div className="theme-text-muted mt-2 text-xs">{formatDateTime(notification.createdAt)}</div>
              </div>
              {!notification.isRead && (
                <button className="theme-button-primary-compact" type="button" onClick={() => markAsRead(notification.id)}>
                  Mark as read
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
