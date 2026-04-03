import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterRequest>(initialForm);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await api.post('/identity/register', form);
      setMessage('Register success. Redirecting to login...');
      setForm(initialForm);
      setTimeout(() => {
        navigate('/login');
      }, 500);
    } catch {
      setMessage('Register failed. Please review API and request payload.');
    }
  };

  return (
    <section className="mx-auto w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
      <h1 className="text-2xl font-semibold text-white">Register</h1>
      <p className="mt-2 text-sm text-slate-400">Create a provider or client account for the demo environment.</p>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm text-slate-300">
          Display name
          <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Email
          <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Password
          <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Role
          <select className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as RegisterRequest['role'] })}>
            <option value="Provider">Provider</option>
            <option value="Client">Client</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Time zone
          <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500" value={form.timeZone} onChange={(e) => setForm({ ...form, timeZone: e.target.value })} />
        </label>
        <button className="mt-2 rounded-2xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-500" type="submit">Register</button>
      </form>
      {message && <p className="mt-4 text-sm text-blue-300">{message}</p>}
    </section>
  );
}
