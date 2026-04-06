import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [message, setMessage] = useState(searchParams.get('created') === '1' ? 'Booking created successfully.' : '');

  const loadBookings = async () => {
    try {
      const response = await api.get('/bookings/client/me');
      setBookings(response.data ?? []);
    } catch {
      setMessage('Failed to load client bookings.');
    }
  };

  useEffect(() => {
    void loadBookings();
  }, []);

  const cancelBooking = async (bookingId: string) => {
    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      await loadBookings();
      setMessage('Booking cancelled successfully.');
    } catch {
      setMessage('Failed to cancel booking.');
    }
  };

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">My Bookings</h1>
          <p className="mt-1 text-sm text-slate-400">Track bookings created from provider detail pages.</p>
        </div>
        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{bookings.length} bookings</span>
      </div>
      {message && <p className="mb-4 text-sm text-blue-300">{message}</p>}
      <div className="grid gap-4">
        {bookings.map((booking) => {
          const canCancel = booking.status === 'pending' || booking.status === 'confirmed';

          return (
            <article key={booking.id} className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950/70 p-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="mb-3 inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300 ring-1 ring-blue-500/20">
                  {booking.status}
                </div>
                <div className="space-y-1 text-sm text-slate-400">
                  <div>Slot: {booking.availabilitySlotId}</div>
                  <div>Notes: {booking.notes || 'N/A'}</div>
                  <div>Created: {booking.createdAt}</div>
                </div>
              </div>
              {canCancel && (
                <div className="flex flex-wrap gap-2">
                  <button className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-500" type="button" onClick={() => cancelBooking(booking.id)}>
                    Cancel Booking
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
