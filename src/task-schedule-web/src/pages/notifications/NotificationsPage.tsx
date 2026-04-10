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
    <section className="rounded-[28px] border border-sky-100 bg-white p-8 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-sky-700">
            Notifications Center
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-slate-900">Notifications</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Track booking events, status changes, and unread alerts in one place.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-600">{notifications.length} total</span>
          <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sky-700">{unreadCount} unread</span>
        </div>
      </div>
      {message && <p className="mb-4 text-sm text-sky-700">{message}</p>}

      {notifications.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
          <h2 className="text-xl font-semibold text-slate-900">No notifications yet</h2>
          <p className="mt-2 text-sm text-slate-600">Booking activity and workflow updates will appear here once the platform is in use.</p>
        </section>
      ) : (
        <div className="grid gap-4">
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className={`flex flex-col gap-4 rounded-[28px] border p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] lg:flex-row lg:items-center lg:justify-between ${
                notification.isRead ? 'border-slate-100 bg-white' : 'border-sky-200 bg-sky-50/60'
              }`}
            >
              <div>
                <div className={`mb-3 inline-flex rounded-full px-3 py-1 text-xs font-medium ${notification.isRead ? 'bg-slate-100 text-slate-600' : 'bg-sky-100 text-sky-700'}`}>
                  {notification.type}
                </div>
                <div className="text-sm leading-6 text-slate-700">{notification.message}</div>
                <div className="mt-2 text-xs text-slate-500">{formatDateTime(notification.createdAt)}</div>
              </div>
              {!notification.isRead && (
                <button className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-500" type="button" onClick={() => markAsRead(notification.id)}>
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
