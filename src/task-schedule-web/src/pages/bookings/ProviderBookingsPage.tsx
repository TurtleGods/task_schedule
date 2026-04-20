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
      return 'theme-status-success';
    case 'cancelled':
      return 'theme-status-warning';
    case 'completed':
      return 'theme-status-info';
    default:
      return 'theme-status-neutral';
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
          <div className="theme-kicker">
            Provider Workspace
          </div>
          <h1 className="theme-text-primary mt-4 text-2xl font-semibold">My Jobs</h1>
          <p className="theme-text-secondary mt-2 text-sm leading-6">Manage inbound booking requests, confirm qualified work, and close the loop with clear status updates.</p>
        </div>
        <span className="theme-muted theme-text-secondary inline-flex w-fit rounded-full px-3 py-1 text-xs">{bookings.length} jobs</span>
      </div>
      {message && <p className="theme-text-secondary mb-4 text-sm">{message}</p>}

      {isLoading ? (
        <section className="theme-muted rounded-3xl p-10 text-center">
          <h2 className="theme-text-primary text-xl font-semibold">Loading inbound jobs...</h2>
          <p className="theme-text-secondary mt-2 text-sm">Fetching booking requests from your provider workspace.</p>
        </section>
      ) : bookings.length === 0 ? (
        <section className="theme-muted rounded-3xl border-dashed p-10 text-center">
          <h2 className="theme-text-primary text-xl font-semibold">No inbound jobs yet</h2>
          <p className="theme-text-secondary mt-2 text-sm">Once clients start booking your published availability, requests will appear here.</p>
        </section>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <article key={booking.id} className="theme-card flex flex-col gap-4 rounded-[28px] p-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className={`mb-3 inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClasses(booking.status)}`}>
                  {booking.status}
                </div>
                <div className="theme-text-secondary space-y-1 text-sm">
                  <div>Slot ID: {booking.availabilitySlotId}</div>
                  <div>Created: {formatDateTime(booking.createdAt)}</div>
                  <div>Notes: {booking.notes || 'No notes provided.'}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="theme-button-success disabled:cursor-not-allowed disabled:opacity-60" type="button" onClick={() => updateStatus(booking.id, 'confirmed')} disabled={activeAction?.bookingId === booking.id}>
                  {activeAction?.bookingId === booking.id && activeAction.status === 'confirmed' ? 'Confirming...' : 'Confirm'}
                </button>
                <button className="theme-button-warning disabled:cursor-not-allowed disabled:opacity-60" type="button" onClick={() => updateStatus(booking.id, 'cancelled')} disabled={activeAction?.bookingId === booking.id}>
                  {activeAction?.bookingId === booking.id && activeAction.status === 'cancelled' ? 'Cancelling...' : 'Cancel'}
                </button>
                <button className="theme-button-primary-compact disabled:cursor-not-allowed disabled:opacity-60" type="button" onClick={() => updateStatus(booking.id, 'completed')} disabled={activeAction?.bookingId === booking.id}>
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
