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
      return 'theme-status-success';
    case 'cancelled':
      return 'theme-status-danger';
    case 'completed':
      return 'theme-status-neutral';
    default:
      return 'theme-status-info';
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
          <div className="theme-kicker">
            Client Workspace
          </div>
          <h1 className="theme-text-primary mt-4 text-2xl font-semibold">My Bookings</h1>
          <p className="theme-text-secondary mt-2 text-sm leading-6">Track every booking request, monitor current status, and cancel requests when plans change.</p>
        </div>
        <span className="theme-muted theme-text-secondary inline-flex w-fit rounded-full px-3 py-1 text-xs">{bookings.length} bookings</span>
      </div>
      {message && <p className="theme-text-secondary mb-4 text-sm">{message}</p>}

      {bookings.length === 0 ? (
        <section className="theme-muted rounded-3xl border-dashed p-10 text-center">
          <h2 className="theme-text-primary text-xl font-semibold">You haven’t created any bookings yet</h2>
          <p className="theme-text-secondary mt-2 text-sm">Browse providers to find an open slot and create your first booking request.</p>
          <Link to="/providers" className="theme-button-primary mt-6 inline-flex">
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
                  <div className="theme-text-secondary grid gap-1 text-sm">
                    <div>Slot ID: {booking.availabilitySlotId}</div>
                    <div>Created: {formatDateTime(booking.createdAt)}</div>
                    <div>Notes: {booking.notes || 'No notes added.'}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {canCancel && (
                    <button className="theme-button-outline" type="button" onClick={() => cancelBooking(booking.id)}>
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
