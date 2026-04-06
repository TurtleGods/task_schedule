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

function getStatusClasses(status: string) {
  switch (status) {
    case 'confirmed':
      return 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20';
    case 'cancelled':
      return 'bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/20';
    case 'completed':
      return 'bg-blue-500/10 text-blue-300 ring-1 ring-blue-500/20';
    default:
      return 'bg-slate-800 text-slate-200 ring-1 ring-slate-700';
  }
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('zh-TW', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function ProviderBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [message, setMessage] = useState('');

  const loadBookings = async () => {
    try {
      const response = await api.get('/bookings/provider/me');
      setBookings(response.data ?? []);
    } catch {
      setMessage('Failed to load provider bookings.');
    }
  };

  useEffect(() => {
    void loadBookings();
  }, []);

  const updateStatus = async (bookingId: string, status: string) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status });
      await loadBookings();
      setMessage('Booking status updated.');
    } catch {
      setMessage('Failed to update booking status.');
    }
  };

  return (
    <section className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex rounded-full bg-slate-800 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
            Provider Workspace
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-white">My Jobs</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">Manage inbound booking requests, confirm qualified work, and close the loop with clear status updates.</p>
        </div>
        <span className="inline-flex w-fit rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{bookings.length} jobs</span>
      </div>
      {message && <p className="mb-4 text-sm text-blue-300">{message}</p>}

      {bookings.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-slate-700 bg-slate-950/50 p-10 text-center">
          <h2 className="text-xl font-semibold text-white">No inbound jobs yet</h2>
          <p className="mt-2 text-sm text-slate-400">Once clients start booking your published availability, requests will appear here.</p>
        </section>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <article key={booking.id} className="flex flex-col gap-4 rounded-[28px] border border-slate-800 bg-slate-950/70 p-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className={`mb-3 inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClasses(booking.status)}`}>
                  {booking.status}
                </div>
                <div className="space-y-1 text-sm text-slate-400">
                  <div>Slot ID: {booking.availabilitySlotId}</div>
                  <div>Created: {formatDateTime(booking.createdAt)}</div>
                  <div>Notes: {booking.notes || 'No notes provided.'}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500" type="button" onClick={() => updateStatus(booking.id, 'confirmed')}>
                  Confirm
                </button>
                <button className="rounded-2xl bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-500" type="button" onClick={() => updateStatus(booking.id, 'cancelled')}>
                  Cancel
                </button>
                <button className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500" type="button" onClick={() => updateStatus(booking.id, 'completed')}>
                  Complete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
