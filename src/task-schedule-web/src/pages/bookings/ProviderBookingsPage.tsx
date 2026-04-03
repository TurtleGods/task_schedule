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
    <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">My Jobs</h1>
          <p className="mt-1 text-sm text-slate-400">Manage inbound booking requests and move them through the workflow.</p>
        </div>
        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{bookings.length} jobs</span>
      </div>
      {message && <p className="mb-4 text-sm text-blue-300">{message}</p>}
      <div className="grid gap-4">
        {bookings.map((booking) => (
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
            <div className="flex flex-wrap gap-2">
              <button className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500" type="button" onClick={() => updateStatus(booking.id, 'confirmed')}>Confirm</button>
              <button className="rounded-2xl bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-500" type="button" onClick={() => updateStatus(booking.id, 'cancelled')}>Cancel</button>
              <button className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500" type="button" onClick={() => updateStatus(booking.id, 'completed')}>Complete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
