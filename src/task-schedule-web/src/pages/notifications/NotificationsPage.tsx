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
    <section className="card">
      <h1>Notifications</h1>
      {message && <p className="form-message">{message}</p>}
      <div className="slot-list">
        {notifications.map((notification) => (
          <article key={notification.id} className={`card notification-card ${notification.isRead ? 'is-read' : 'is-unread'}`}>
            <div>
              <strong>{notification.type}</strong>
              <div>{notification.message}</div>
              <div>{notification.createdAt}</div>
            </div>
            {!notification.isRead && (
              <button type="button" onClick={() => markAsRead(notification.id)}>
                Mark as read
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
