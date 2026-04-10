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
          <div className="inline-flex rounded-full border border-black/8 bg-black/[0.03] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">
            Notifications Center
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">Notifications</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Track booking events, status changes, and unread alerts in one place.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="theme-muted rounded-full px-3 py-1 text-slate-600 dark:text-slate-300">{notifications.length} total</span>
          <span className="theme-card rounded-full px-3 py-1 text-slate-700 dark:text-slate-200">{unreadCount} unread</span>
        </div>
      </div>
      {message && <p className="mb-4 text-sm text-slate-700 dark:text-slate-300">{message}</p>}

      {notifications.length === 0 ? (
        <section className="theme-muted rounded-3xl border-dashed p-10 text-center">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">No notifications yet</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Booking activity and workflow updates will appear here once the platform is in use.</p>
        </section>
      ) : (
        <div className="grid gap-4">
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className={`flex flex-col gap-4 rounded-[28px] border p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] lg:flex-row lg:items-center lg:justify-between dark:shadow-[0_12px_32px_rgba(0,0,0,0.25)] ${
                notification.isRead ? 'theme-card' : 'theme-panel border-black/8 bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.05]'
              }`}
            >
              <div>
                <div className={`mb-3 inline-flex rounded-full px-3 py-1 text-xs font-medium ${notification.isRead ? 'bg-black/[0.04] text-slate-600 dark:bg-white/[0.05] dark:text-slate-300' : 'bg-black/[0.06] text-slate-700 dark:bg-white/[0.08] dark:text-slate-200'}`}>
                  {notification.type}
                </div>
                <div className="text-sm leading-6 text-slate-700 dark:text-slate-200">{notification.message}</div>
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">{formatDateTime(notification.createdAt)}</div>
              </div>
              {!notification.isRead && (
                <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200" type="button" onClick={() => markAsRead(notification.id)}>
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
