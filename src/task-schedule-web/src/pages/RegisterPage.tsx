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
      <section className="rounded-[32px] border border-sky-100 bg-white p-8 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <h1 className="text-2xl font-semibold text-slate-900">Register</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Create a provider or client account for the demo environment.</p>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm text-slate-700">
            Display name
            <input className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
          </label>
          <label className="grid gap-2 text-sm text-slate-700">
            Email
            <input className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label className="grid gap-2 text-sm text-slate-700">
            Password
            <input className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </label>
          <label className="grid gap-2 text-sm text-slate-700">
            Role
            <select className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as RegisterRequest['role'] })}>
              <option value="Provider">Provider</option>
              <option value="Client">Client</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm text-slate-700">
            Time zone
            <input className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white" value={form.timeZone} onChange={(e) => setForm({ ...form, timeZone: e.target.value })} />
          </label>
          <button className="mt-2 rounded-2xl bg-sky-600 px-4 py-3 font-medium text-white transition hover:bg-sky-500" type="submit">
            Register
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-sky-700">{message}</p>}
        <p className="mt-6 text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-sky-700 transition hover:text-sky-600">
            Sign in
          </Link>
          .
        </p>
      </section>

      <section className="rounded-[32px] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-8 shadow-[0_20px_60px_rgba(14,116,144,0.12)] xl:p-10">
        <div className="inline-flex rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-sky-700 shadow-sm">
          Get Started
        </div>
        <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 xl:text-4xl">Create your account and enter the marketplace</h2>
        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
          Register as a provider to publish your profile, availability, and portfolio, or join as a client to browse providers and create booking requests.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
            <h3 className="text-lg font-semibold text-slate-900">Provider path</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Set up your profile, publish availability, and manage incoming jobs from one dashboard.</p>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
            <h3 className="text-lg font-semibold text-slate-900">Client path</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">Browse providers, book open slots, and track status updates across the full booking lifecycle.</p>
          </div>
        </div>
      </section>
    </section>
  );
}
