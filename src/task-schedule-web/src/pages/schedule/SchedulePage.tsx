import { useEffect, useState } from 'react';
import { api } from '../../services/api';

type Slot = {
  id: string;
  startAt: string;
  endAt: string;
  timeZone: string;
  isBooked: boolean;
};

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
    <section className="grid gap-6 xl:grid-cols-[380px,minmax(0,1fr)]">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
        <h1 className="text-2xl font-semibold text-white">Schedule Manager</h1>
        <p className="mt-2 text-sm text-slate-400">Create availability slots for clients to book.</p>
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

      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Current Availability</h2>
            <p className="mt-1 text-sm text-slate-400">Review and clean up provider slots for the marketplace.</p>
          </div>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{slots.length} slots</span>
        </div>
        <div className="grid gap-4">
          {slots.map((slot) => (
            <article key={slot.id} className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:flex-row md:items-center">
              <div>
                <strong className="text-white">{slot.startAt}</strong>
                <div className="mt-1 text-sm text-slate-400">End: {slot.endAt}</div>
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
      </section>
    </section>
  );
}
