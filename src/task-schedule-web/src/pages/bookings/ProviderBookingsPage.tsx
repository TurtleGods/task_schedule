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
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300';
    case 'cancelled':
      return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300';
    case 'completed':
      return 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300';
    default:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
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
  const [isLoading, setIsLoading] = useState(true);
  const [activeAction, setActiveAction] = useState<{ bookingId: string; status: string } | null>(null);

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/bookings/provider/me');
      setBookings(response.data ?? []);
    } catch {
      setMessage('Failed to load provider bookings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadBookings();
  }, []);

  const updateStatus = async (bookingId: string, status: string) => {
    setActiveAction({ bookingId, status });
    try {
      await api.put(`/bookings/${bookingId}/status`, { status });
      await loadBookings();
      setMessage('Booking status updated.');
    } catch {
      setMessage('Failed to update booking status. Please try again.');
    } finally {
      setActiveAction(null);
    }
  };

  return (
    <section className="theme-panel rounded-[28px] p-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex rounded-full border border-black/8 bg-black/[0.03] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">
            Provider Workspace
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">My Jobs</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Manage inbound booking requests, confirm qualified work, and close the loop with clear status updates.</p>
        </div>
        <span className="theme-muted inline-flex w-fit rounded-full px-3 py-1 text-xs text-slate-600 dark:text-slate-300">{bookings.length} jobs</span>
      </div>
      {message && <p className="mb-4 text-sm text-slate-700 dark:text-slate-300">{message}</p>}

      {isLoading ? (
        <section className="theme-muted rounded-3xl p-10 text-center">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Loading inbound jobs...</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Fetching booking requests from your provider workspace.</p>
        </section>
      ) : bookings.length === 0 ? (
        <section className="theme-muted rounded-3xl border-dashed p-10 text-center">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">No inbound jobs yet</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Once clients start booking your published availability, requests will appear here.</p>
        </section>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <article key={booking.id} className="theme-card flex flex-col gap-4 rounded-[28px] p-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className={`mb-3 inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClasses(booking.status)}`}>
                  {booking.status}
                </div>
                <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                  <div>Slot ID: {booking.availabilitySlotId}</div>
                  <div>Created: {formatDateTime(booking.createdAt)}</div>
                  <div>Notes: {booking.notes || 'No notes provided.'}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60" type="button" onClick={() => updateStatus(booking.id, 'confirmed')} disabled={activeAction?.bookingId === booking.id}>
                  {activeAction?.bookingId === booking.id && activeAction.status === 'confirmed' ? 'Confirming...' : 'Confirm'}
                </button>
                <button className="rounded-2xl bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60" type="button" onClick={() => updateStatus(booking.id, 'cancelled')} disabled={activeAction?.bookingId === booking.id}>
                  {activeAction?.bookingId === booking.id && activeAction.status === 'cancelled' ? 'Cancelling...' : 'Cancel'}
                </button>
                <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200" type="button" onClick={() => updateStatus(booking.id, 'completed')} disabled={activeAction?.bookingId === booking.id}>
                  {activeAction?.bookingId === booking.id && activeAction.status === 'completed' ? 'Completing...' : 'Complete'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
