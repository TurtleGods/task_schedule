import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
      return 'bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/20';
    case 'completed':
      return 'bg-slate-700 text-slate-200 ring-1 ring-slate-600';
    default:
      return 'bg-blue-500/10 text-blue-300 ring-1 ring-blue-500/20';
  }
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('zh-TW', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

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
    <section className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-blue-200 ring-1 ring-blue-500/20">
            Client Workspace
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-white">My Bookings</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">Track every booking request, monitor current status, and cancel requests when plans change.</p>
        </div>
        <span className="inline-flex w-fit rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{bookings.length} bookings</span>
      </div>
      {message && <p className="mb-4 text-sm text-blue-300">{message}</p>}

      {bookings.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-slate-700 bg-slate-950/50 p-10 text-center">
          <h2 className="text-xl font-semibold text-white">You haven’t created any bookings yet</h2>
          <p className="mt-2 text-sm text-slate-400">Browse providers to find an open slot and create your first booking request.</p>
          <Link to="/providers" className="mt-6 inline-flex rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500">
            Browse Providers
          </Link>
        </section>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => {
            const canCancel = booking.status === 'pending' || booking.status === 'confirmed';

            return (
              <article key={booking.id} className="flex flex-col gap-4 rounded-[28px] border border-slate-800 bg-slate-950/70 p-5 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <div className={`mb-3 inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClasses(booking.status)}`}>
                    {booking.status}
                  </div>
                  <div className="grid gap-1 text-sm text-slate-400">
                    <div>Slot ID: {booking.availabilitySlotId}</div>
                    <div>Created: {formatDateTime(booking.createdAt)}</div>
                    <div>Notes: {booking.notes || 'No notes added.'}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {canCancel && (
                    <button className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-500" type="button" onClick={() => cancelBooking(booking.id)}>
                      Cancel Booking
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
