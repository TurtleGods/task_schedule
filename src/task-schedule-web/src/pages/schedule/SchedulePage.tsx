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
      <section className="rounded-[32px] border border-sky-100 bg-white p-8 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <div className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-sky-700">
          Availability Manager
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">Schedule Manager</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">Create availability slots for clients to book and keep your public schedule clear and trustworthy.</p>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm text-slate-700">
            Start time
            <input className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white" type="datetime-local" value={form.startAt} onChange={(e) => setForm({ ...form, startAt: e.target.value })} />
          </label>
          <label className="grid gap-2 text-sm text-slate-700">
            End time
            <input className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white" type="datetime-local" value={form.endAt} onChange={(e) => setForm({ ...form, endAt: e.target.value })} />
          </label>
          <label className="grid gap-2 text-sm text-slate-700">
            Time zone
            <input className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white" value={form.timeZone} onChange={(e) => setForm({ ...form, timeZone: e.target.value })} />
          </label>
          <button className="rounded-2xl bg-sky-600 px-4 py-3 font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Adding...' : 'Add Slot'}</button>
        </form>
        {message && <p className="mt-4 text-sm text-sky-700">{message}</p>}
      </section>

      <section className="rounded-[32px] border border-sky-100 bg-white p-8 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-sky-700">
              Published Availability
            </div>
            <h2 className="mt-4 text-xl font-semibold text-slate-900">Current Availability</h2>
            <p className="mt-1 text-sm text-slate-600">Review, maintain, and clean up published provider slots for the marketplace.</p>
          </div>
          <span className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">{slots.length} slots</span>
        </div>

        {isLoading ? (
          <section className="rounded-3xl border border-slate-100 bg-sky-50/60 p-10 text-center">
            <h3 className="text-xl font-semibold text-slate-900">Loading availability...</h3>
            <p className="mt-2 text-sm text-slate-600">Fetching your current published and draft schedule slots.</p>
          </section>
        ) : slots.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
            <h3 className="text-xl font-semibold text-slate-900">No availability slots yet</h3>
            <p className="mt-2 text-sm text-slate-600">Add your first open slot so clients can start creating booking requests.</p>
          </section>
        ) : (
          <div className="grid gap-4">
            {slots.map((slot) => (
              <article key={slot.id} className="flex flex-col justify-between gap-4 rounded-[28px] border border-slate-100 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] md:flex-row md:items-center">
                <div>
                  <strong className="text-slate-900">{formatDateTime(slot.startAt)}</strong>
                  <div className="mt-1 text-sm text-slate-600">End: {formatDateTime(slot.endAt)}</div>
                  <div className="mt-1 text-sm text-slate-600">Time zone: {slot.timeZone}</div>
                  <div className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-medium ${slot.isBooked ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {slot.isBooked ? 'Booked' : 'Available'}
                  </div>
                </div>
                <button className="rounded-2xl border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60" type="button" onClick={() => handleDelete(slot.id)} disabled={deletingSlotId === slot.id}>
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
