import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    <section className="mx-auto grid w-full max-w-6xl gap-6 xl:grid-cols-[460px,minmax(0,1fr)] xl:items-stretch">
      <section className="rounded-[32px] border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
        <h1 className="text-2xl font-semibold text-white">Register</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">Create a provider or client account for the demo environment.</p>
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
          <button className="mt-2 rounded-2xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-500" type="submit">
            Register
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-blue-300">{message}</p>}
        <p className="mt-6 text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-300 transition hover:text-blue-200">
            Sign in
          </Link>
          .
        </p>
      </section>

      <section className="rounded-[32px] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 shadow-2xl shadow-black/20 xl:p-10">
        <div className="inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-blue-200">
          Get Started
        </div>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white xl:text-4xl">Create your account and enter the marketplace</h2>
        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
          Register as a provider to publish your profile, availability, and portfolio, or join as a client to browse providers and create booking requests.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-lg font-semibold text-white">Provider path</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">Set up your profile, publish availability, and manage incoming jobs from one dashboard.</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-lg font-semibold text-white">Client path</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">Browse providers, book open slots, and track status updates across the full booking lifecycle.</p>
          </div>
        </div>
      </section>
    </section>
  );
}
