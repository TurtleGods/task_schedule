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
    <section className="card">
      <h1>Schedule Manager</h1>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Start time
          <input type="datetime-local" value={form.startAt} onChange={(e) => setForm({ ...form, startAt: e.target.value })} />
        </label>
        <label>
          End time
          <input type="datetime-local" value={form.endAt} onChange={(e) => setForm({ ...form, endAt: e.target.value })} />
        </label>
        <label>
          Time zone
          <input value={form.timeZone} onChange={(e) => setForm({ ...form, timeZone: e.target.value })} />
        </label>
        <button type="submit">Add Slot</button>
      </form>

      {message && <p className="form-message">{message}</p>}

      <div className="slot-list">
        {slots.map((slot) => (
          <article key={slot.id} className="card slot-card">
            <div>
              <strong>{slot.startAt}</strong>
              <div>{slot.endAt}</div>
              <div>{slot.timeZone}</div>
              <div>{slot.isBooked ? 'Booked' : 'Available'}</div>
            </div>
            <button type="button" onClick={() => handleDelete(slot.id)}>
              Delete
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
