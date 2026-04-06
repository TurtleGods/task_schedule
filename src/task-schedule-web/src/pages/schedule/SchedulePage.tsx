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
  const [form, setForm] = useState({
    startAt: '',
    endAt: '',
    timeZone: 'Asia/Taipei',
  });

  const loadSlots = async () => {
    try {
      const response = await api.get('/schedule/me');
      setSlots(response.data ?? []);
    } catch {
      setMessage('Failed to load schedule slots.');
    }
  };

  useEffect(() => {
    void loadSlots();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await api.post('/schedule/me', form);
      setMessage('Availability slot created.');
      setForm({ startAt: '', endAt: '', timeZone: 'Asia/Taipei' });
      await loadSlots();
    } catch {
      setMessage('Failed to create availability slot.');
    }
  };

  const handleDelete = async (slotId: string) => {
    try {
      await api.delete(`/schedule/me/${slotId}`);
      setMessage('Slot deleted.');
      await loadSlots();
    } catch {
      setMessage('Failed to delete slot.');
    }
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[400px,minmax(0,1fr)]">
      <section className="rounded-[32px] border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
        <div className="inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-blue-200 ring-1 ring-blue-500/20">
          Availability Manager
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">Schedule Manager</h1>
        <p className="mt-3 text-sm leading-7 text-slate-400">Create availability slots for clients to book and keep your public schedule clear and trustworthy.</p>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm text-slate-300">
            Start time
            <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500" type="datetime-local" value={form.startAt} onChange={(e) => setForm({ ...form, startAt: e.target.value })} />
          </label>
          <label className="grid gap-2 text-sm text-slate-300">
            End time
            <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500" type="datetime-local" value={form.endAt} onChange={(e) => setForm({ ...form, endAt: e.target.value })} />
          </label>
          <label className="grid gap-2 text-sm text-slate-300">
            Time zone
            <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500" value={form.timeZone} onChange={(e) => setForm({ ...form, timeZone: e.target.value })} />
          </label>
          <button className="rounded-2xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-500" type="submit">Add Slot</button>
        </form>
        {message && <p className="mt-4 text-sm text-blue-300">{message}</p>}
      </section>

      <section className="rounded-[32px] border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Current Availability</h2>
            <p className="mt-1 text-sm text-slate-400">Review, maintain, and clean up published provider slots for the marketplace.</p>
          </div>
          <span className="inline-flex w-fit rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{slots.length} slots</span>
        </div>

        {slots.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-slate-700 bg-slate-950/50 p-10 text-center">
            <h3 className="text-xl font-semibold text-white">No availability slots yet</h3>
            <p className="mt-2 text-sm text-slate-400">Add your first open slot so clients can start creating booking requests.</p>
          </section>
        ) : (
          <div className="grid gap-4">
            {slots.map((slot) => (
              <article key={slot.id} className="flex flex-col justify-between gap-4 rounded-[28px] border border-slate-800 bg-slate-950/70 p-5 md:flex-row md:items-center">
                <div>
                  <strong className="text-white">{formatDateTime(slot.startAt)}</strong>
                  <div className="mt-1 text-sm text-slate-400">End: {formatDateTime(slot.endAt)}</div>
                  <div className="mt-1 text-sm text-slate-400">Time zone: {slot.timeZone}</div>
                  <div className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-medium ${slot.isBooked ? 'bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/20' : 'bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20'}`}>
                    {slot.isBooked ? 'Booked' : 'Available'}
                  </div>
                </div>
                <button className="rounded-2xl border border-rose-500/40 px-4 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-500/10" type="button" onClick={() => handleDelete(slot.id)}>
                  Delete
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
