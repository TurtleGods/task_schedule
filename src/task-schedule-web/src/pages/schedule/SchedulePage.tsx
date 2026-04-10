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
        <div className="inline-flex rounded-full border border-black/8 bg-black/[0.03] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">
          Availability Manager
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Schedule Manager</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">Create availability slots for clients to book and keep your public schedule clear and trustworthy.</p>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm text-slate-700">
            Start time
            <input className="theme-input rounded-2xl px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white dark:focus:bg-[#111111]" type="datetime-local" value={form.startAt} onChange={(e) => setForm({ ...form, startAt: e.target.value })} />
          </label>
          <label className="grid gap-2 text-sm text-slate-700">
            End time
            <input className="theme-input rounded-2xl px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white dark:focus:bg-[#111111]" type="datetime-local" value={form.endAt} onChange={(e) => setForm({ ...form, endAt: e.target.value })} />
          </label>
          <label className="grid gap-2 text-sm text-slate-700">
            Time zone
            <input className="theme-input rounded-2xl px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white dark:focus:bg-[#111111]" value={form.timeZone} onChange={(e) => setForm({ ...form, timeZone: e.target.value })} />
          </label>
          <button className="rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Adding...' : 'Add Slot'}</button>
        </form>
        {message && <p className="mt-4 text-sm text-sky-700 dark:text-sky-300">{message}</p>}
      </section>

      <section className="theme-panel rounded-[32px] p-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex rounded-full bg-black/[0.03] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:bg-white/[0.05] dark:text-slate-300">
              Published Availability
            </div>
            <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">Current Availability</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Review, maintain, and clean up published provider slots for the marketplace.</p>
          </div>
          <span className="theme-muted inline-flex w-fit rounded-full px-3 py-1 text-xs text-slate-600 dark:text-slate-300">{slots.length} slots</span>
        </div>

        {isLoading ? (
          <section className="theme-muted rounded-3xl p-10 text-center">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Loading availability...</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Fetching your current published and draft schedule slots.</p>
          </section>
        ) : slots.length === 0 ? (
          <section className="theme-muted rounded-3xl border-dashed p-10 text-center">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">No availability slots yet</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Add your first open slot so clients can start creating booking requests.</p>
          </section>
        ) : (
          <div className="grid gap-4">
            {slots.map((slot) => (
              <article key={slot.id} className="theme-card flex flex-col justify-between gap-4 rounded-[28px] p-5 md:flex-row md:items-center">
                <div>
                  <strong className="text-slate-900 dark:text-white">{formatDateTime(slot.startAt)}</strong>
                  <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">End: {formatDateTime(slot.endAt)}</div>
                  <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">Time zone: {slot.timeZone}</div>
                  <div className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-medium ${slot.isBooked ? 'bg-black/[0.06] text-slate-700 dark:bg-white/[0.08] dark:text-slate-200' : 'bg-black/[0.04] text-slate-600 dark:bg-white/[0.05] dark:text-slate-300'}`}>
                    {slot.isBooked ? 'Booked' : 'Available'}
                  </div>
                </div>
                <button className="rounded-2xl border border-black/8 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#171717] dark:text-slate-200 dark:hover:bg-white/[0.04]" type="button" onClick={() => handleDelete(slot.id)} disabled={deletingSlotId === slot.id}>
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
