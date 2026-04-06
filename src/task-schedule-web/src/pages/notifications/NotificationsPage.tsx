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
    <section className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-blue-200 ring-1 ring-blue-500/20">
            Notifications Center
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-white">Notifications</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">Track booking events, status changes, and unread alerts in one place.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-slate-300">
          <span className="rounded-full border border-slate-700 px-3 py-1">{notifications.length} total</span>
          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-blue-200">{unreadCount} unread</span>
        </div>
      </div>
      {message && <p className="mb-4 text-sm text-blue-300">{message}</p>}

      {notifications.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-slate-700 bg-slate-950/50 p-10 text-center">
          <h2 className="text-xl font-semibold text-white">No notifications yet</h2>
          <p className="mt-2 text-sm text-slate-400">Booking activity and workflow updates will appear here once the platform is in use.</p>
        </section>
      ) : (
        <div className="grid gap-4">
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className={`flex flex-col gap-4 rounded-[28px] border p-5 shadow-lg shadow-black/10 lg:flex-row lg:items-center lg:justify-between ${
                notification.isRead ? 'border-slate-800 bg-slate-950/60' : 'border-blue-500/30 bg-blue-500/5'
              }`}
            >
              <div>
                <div className={`mb-3 inline-flex rounded-full px-3 py-1 text-xs font-medium ${notification.isRead ? 'bg-slate-800 text-slate-300' : 'bg-blue-500/10 text-blue-300 ring-1 ring-blue-500/20'}`}>
                  {notification.type}
                </div>
                <div className="text-sm leading-6 text-slate-200">{notification.message}</div>
                <div className="mt-2 text-xs text-slate-500">{formatDateTime(notification.createdAt)}</div>
              </div>
              {!notification.isRead && (
                <button className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500" type="button" onClick={() => markAsRead(notification.id)}>
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
