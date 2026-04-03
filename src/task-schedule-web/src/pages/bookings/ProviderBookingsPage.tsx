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

export function ProviderBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get('/bookings/provider/me');
        setBookings(response.data ?? []);
      } catch {
        setMessage('Failed to load provider bookings.');
      }
    };

    void load();
  }, []);

  const updateStatus = async (bookingId: string, status: string) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status });
      const response = await api.get('/bookings/provider/me');
      setBookings(response.data ?? []);
      setMessage('Booking status updated.');
    } catch {
      setMessage('Failed to update booking status.');
    }
  };

  return (
    <section className="card">
      <h1>My Jobs</h1>
      {message && <p className="form-message">{message}</p>}
      <div className="slot-list">
        {bookings.map((booking) => (
          <article key={booking.id} className="card slot-card">
            <div>
              <strong>Status: {booking.status}</strong>
              <div>Slot: {booking.availabilitySlotId}</div>
              <div>Notes: {booking.notes}</div>
              <div>Created: {booking.createdAt}</div>
            </div>
            <div className="role-switcher">
              <button type="button" onClick={() => updateStatus(booking.id, 'confirmed')}>Confirm</button>
              <button type="button" onClick={() => updateStatus(booking.id, 'cancelled')}>Cancel</button>
              <button type="button" onClick={() => updateStatus(booking.id, 'completed')}>Complete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
