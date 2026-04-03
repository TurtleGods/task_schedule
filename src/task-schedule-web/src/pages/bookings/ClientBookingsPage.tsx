import { useEffect, useState } from 'react';
import { api } from '../../services/api';

type Booking = {
  id: string;
  providerProfileId: string;
  clientProfileId: string;
  availabilitySlotId: string;
  status: string;
  notes?: string;
  createdAt: string;
};

export function ClientBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get('/bookings/client/me');
        setBookings(response.data ?? []);
      } catch {
        setMessage('Failed to load client bookings.');
      }
    };

    void load();
  }, []);

  return (
    <section className="card">
      <h1>My Bookings</h1>
      {message && <p className="form-message">{message}</p>}
      <div className="slot-list">
        {bookings.map((booking) => (
          <article key={booking.id} className="card">
            <strong>Status: {booking.status}</strong>
            <div>Slot: {booking.availabilitySlotId}</div>
            <div>Notes: {booking.notes}</div>
            <div>Created: {booking.createdAt}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
