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
        {bookings.map((booking) => (
          <article key={booking.id} className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
            <div className="mb-3 inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300 ring-1 ring-blue-500/20">
              {booking.status}
            </div>
            <div className="space-y-1 text-sm text-slate-400">
              <div>Slot: {booking.availabilitySlotId}</div>
              <div>Notes: {booking.notes || 'N/A'}</div>
              <div>Created: {booking.createdAt}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
