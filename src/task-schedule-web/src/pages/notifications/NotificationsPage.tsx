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

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Notifications</h1>
          <p className="mt-1 text-sm text-slate-400">Track booking events and mark items as read.</p>
        </div>
        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{notifications.length} notifications</span>
      </div>
      {message && <p className="mb-4 text-sm text-blue-300">{message}</p>}
      <div className="grid gap-4">
        {notifications.map((notification) => (
          <article key={notification.id} className={`flex flex-col gap-4 rounded-3xl border p-5 shadow-lg shadow-black/10 lg:flex-row lg:items-center lg:justify-between ${notification.isRead ? 'border-slate-800 bg-slate-950/60' : 'border-blue-500/30 bg-blue-500/5'}`}>
            <div>
              <div className={`mb-3 inline-flex rounded-full px-3 py-1 text-xs font-medium ${notification.isRead ? 'bg-slate-800 text-slate-300' : 'bg-blue-500/10 text-blue-300 ring-1 ring-blue-500/20'}`}>
                {notification.type}
              </div>
              <div className="text-sm text-slate-200">{notification.message}</div>
              <div className="mt-2 text-xs text-slate-500">{notification.createdAt}</div>
            </div>
            {!notification.isRead && (
              <button className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500" type="button" onClick={() => markAsRead(notification.id)}>
                Mark as read
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
