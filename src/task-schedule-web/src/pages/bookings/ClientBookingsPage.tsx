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
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300';
    case 'cancelled':
      return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300';
    case 'completed':
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    default:
      return 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300';
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
    <section className="theme-panel rounded-[28px] p-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex rounded-full border border-black/8 bg-black/[0.03] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">
            Client Workspace
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">My Bookings</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Track every booking request, monitor current status, and cancel requests when plans change.</p>
        </div>
        <span className="theme-muted inline-flex w-fit rounded-full px-3 py-1 text-xs text-slate-600 dark:text-slate-300">{bookings.length} bookings</span>
      </div>
      {message && <p className="mb-4 text-sm text-slate-700 dark:text-slate-300">{message}</p>}

      {bookings.length === 0 ? (
        <section className="theme-muted rounded-3xl border-dashed p-10 text-center">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">You haven’t created any bookings yet</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Browse providers to find an open slot and create your first booking request.</p>
          <Link to="/providers" className="mt-6 inline-flex rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
            Browse Providers
          </Link>
        </section>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => {
            const canCancel = booking.status === 'pending' || booking.status === 'confirmed';

            return (
              <article key={booking.id} className="theme-card flex flex-col gap-4 rounded-[28px] p-5 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <div className={`mb-3 inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClasses(booking.status)}`}>
                    {booking.status}
                  </div>
                  <div className="grid gap-1 text-sm text-slate-600 dark:text-slate-300">
                    <div>Slot ID: {booking.availabilitySlotId}</div>
                    <div>Created: {formatDateTime(booking.createdAt)}</div>
                    <div>Notes: {booking.notes || 'No notes added.'}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {canCancel && (
                    <button className="rounded-2xl border border-black/8 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-black/[0.03] dark:border-white/10 dark:bg-[#171717] dark:text-slate-200 dark:hover:bg-white/[0.04]" type="button" onClick={() => cancelBooking(booking.id)}>
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
