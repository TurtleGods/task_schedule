import { useEffect, useState } from 'react';
import { api } from '../../services/api';

type Slot = {
  id: string;
  startAt: string;
  endAt: string;
  timeZone: string;
  isBooked: boolean;
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('zh-TW', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function SchedulePage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingSlotId, setDeletingSlotId] = useState<string | null>(null);
  const [form, setForm] = useState({
    startAt: '',
    endAt: '',
    timeZone: 'Asia/Taipei',
  });

  const loadSlots = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/schedule/me');
      setSlots(response.data ?? []);
    } catch {
      setMessage('Failed to load schedule slots. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadSlots();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/schedule/me', form);
      setMessage('Availability slot created.');
      setForm({ startAt: '', endAt: '', timeZone: 'Asia/Taipei' });
      await loadSlots();
    } catch {
      setMessage('Failed to create availability slot. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (slotId: string) => {
    setDeletingSlotId(slotId);
    try {
      await api.delete(`/schedule/me/${slotId}`);
      setMessage('Slot deleted.');
      await loadSlots();
    } catch {
      setMessage('Failed to delete slot. Please try again.');
    } finally {
      setDeletingSlotId(null);
    }
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[400px,minmax(0,1fr)]">
      <section className="theme-panel rounded-[32px] p-8">
        <div className="theme-kicker">
          Availability Manager
        </div>
        <h1 className="theme-text-primary mt-4 text-3xl font-semibold tracking-tight">Schedule Manager</h1>
        <p className="theme-text-secondary mt-3 text-sm leading-7">Create availability slots for clients to book and keep your public schedule clear and trustworthy.</p>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label className="theme-text-secondary grid gap-2 text-sm">
            Start time
            <input className="theme-input rounded-2xl px-4 py-3 outline-none transition" type="datetime-local" value={form.startAt} onChange={(e) => setForm({ ...form, startAt: e.target.value })} />
          </label>
          <label className="theme-text-secondary grid gap-2 text-sm">
            End time
            <input className="theme-input rounded-2xl px-4 py-3 outline-none transition" type="datetime-local" value={form.endAt} onChange={(e) => setForm({ ...form, endAt: e.target.value })} />
          </label>
          <label className="theme-text-secondary grid gap-2 text-sm">
            Time zone
            <input className="theme-input rounded-2xl px-4 py-3 outline-none transition" value={form.timeZone} onChange={(e) => setForm({ ...form, timeZone: e.target.value })} />
          </label>
          <button className="theme-button-primary disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Adding...' : 'Add Slot'}</button>
        </form>
        {message && <p className="theme-text-secondary mt-4 text-sm">{message}</p>}
      </section>

      <section className="theme-panel rounded-[32px] p-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="theme-pill uppercase tracking-[0.18em]">
              Published Availability
            </div>
            <h2 className="theme-text-primary mt-4 text-xl font-semibold">Current Availability</h2>
            <p className="theme-text-secondary mt-1 text-sm">Review, maintain, and clean up published provider slots for the marketplace.</p>
          </div>
          <span className="theme-muted theme-text-secondary inline-flex w-fit rounded-full px-3 py-1 text-xs">{slots.length} slots</span>
        </div>

        {isLoading ? (
          <section className="theme-muted rounded-3xl p-10 text-center">
            <h3 className="theme-text-primary text-xl font-semibold">Loading availability...</h3>
            <p className="theme-text-secondary mt-2 text-sm">Fetching your current published and draft schedule slots.</p>
          </section>
        ) : slots.length === 0 ? (
          <section className="theme-muted rounded-3xl border-dashed p-10 text-center">
            <h3 className="theme-text-primary text-xl font-semibold">No availability slots yet</h3>
            <p className="theme-text-secondary mt-2 text-sm">Add your first open slot so clients can start creating booking requests.</p>
          </section>
        ) : (
          <div className="grid gap-4">
            {slots.map((slot) => (
              <article key={slot.id} className="theme-card flex flex-col justify-between gap-4 rounded-[28px] p-5 md:flex-row md:items-center">
                <div>
                  <strong className="theme-text-primary">{formatDateTime(slot.startAt)}</strong>
                  <div className="theme-text-secondary mt-1 text-sm">End: {formatDateTime(slot.endAt)}</div>
                  <div className="theme-text-secondary mt-1 text-sm">Time zone: {slot.timeZone}</div>
                  <div className={`mt-3 ${slot.isBooked ? 'theme-status-neutral' : 'theme-status-info'}`}>
                    {slot.isBooked ? 'Booked' : 'Available'}
                  </div>
                </div>
                <button className="theme-button-outline disabled:cursor-not-allowed disabled:opacity-60" type="button" onClick={() => handleDelete(slot.id)} disabled={deletingSlotId === slot.id}>
                  {deletingSlotId === slot.id ? 'Deleting...' : 'Delete'}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
