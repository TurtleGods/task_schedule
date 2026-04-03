import { useState } from 'react';
import { api } from '../services/api';
import type { RegisterRequest } from '../types/auth';

const initialForm: RegisterRequest = {
  email: '',
  password: '',
  displayName: '',
  role: 'Provider',
  timeZone: 'Asia/Taipei',
};

export function RegisterPage() {
  const [form, setForm] = useState<RegisterRequest>(initialForm);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await api.post('/identity/register', form);
      setMessage('Register success.');
      setForm(initialForm);
    } catch (error) {
      setMessage('Register failed. Please review API and request payload.');
    }
  };

  return (
    <section className="card auth-card">
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Display name
          <input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
        </label>
        <label>
          Email
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>
        <label>
          Role
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as RegisterRequest['role'] })}>
            <option value="Provider">Provider</option>
            <option value="Client">Client</option>
          </select>
        </label>
        <label>
          Time zone
          <input value={form.timeZone} onChange={(e) => setForm({ ...form, timeZone: e.target.value })} />
        </label>
        <button type="submit">Register</button>
      </form>
      {message && <p className="form-message">{message}</p>}
    </section>
  );
}
