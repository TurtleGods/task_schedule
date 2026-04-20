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
      <section className="theme-panel rounded-[32px] p-8">
        <h1 className="theme-text-primary text-2xl font-semibold">Register</h1>
        <p className="theme-text-secondary mt-2 text-sm leading-6">Create a provider or client account for the demo environment.</p>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label className="theme-text-secondary grid gap-2 text-sm">
            Display name
            <input className="theme-input rounded-2xl px-4 py-3 outline-none transition" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
          </label>
          <label className="theme-text-secondary grid gap-2 text-sm">
            Email
            <input className="theme-input rounded-2xl px-4 py-3 outline-none transition" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label className="theme-text-secondary grid gap-2 text-sm">
            Password
            <input className="theme-input rounded-2xl px-4 py-3 outline-none transition" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </label>
          <label className="theme-text-secondary grid gap-2 text-sm">
            Role
            <select className="theme-input rounded-2xl px-4 py-3 outline-none transition" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as RegisterRequest['role'] })}>
              <option value="Provider">Provider</option>
              <option value="Client">Client</option>
            </select>
          </label>
          <label className="theme-text-secondary grid gap-2 text-sm">
            Time zone
            <input className="theme-input rounded-2xl px-4 py-3 outline-none transition" value={form.timeZone} onChange={(e) => setForm({ ...form, timeZone: e.target.value })} />
          </label>
          <button className="theme-button-primary mt-2" type="submit">
            Register
          </button>
        </form>
        {message && <p className="theme-text-secondary mt-4 text-sm">{message}</p>}
        <p className="theme-text-secondary mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="theme-link font-medium transition">
            Sign in
          </Link>
          .
        </p>
      </section>

      <section className="theme-hero rounded-[32px] p-8 xl:p-10">
        <div className="theme-kicker">
          Get Started
        </div>
        <h2 className="theme-text-primary mt-5 text-3xl font-semibold tracking-tight xl:text-4xl">Create your account and enter the marketplace</h2>
        <p className="theme-text-secondary mt-4 max-w-xl text-sm leading-7">
          Register as a provider to publish your profile, availability, and portfolio, or join as a client to browse providers and create booking requests.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="theme-card rounded-3xl p-5">
            <h3 className="theme-text-primary text-lg font-semibold">Provider path</h3>
            <p className="theme-text-secondary mt-2 text-sm leading-6">Set up your profile, publish availability, and manage incoming jobs from one dashboard.</p>
          </div>
          <div className="theme-card rounded-3xl p-5">
            <h3 className="theme-text-primary text-lg font-semibold">Client path</h3>
            <p className="theme-text-secondary mt-2 text-sm leading-6">Browse providers, book open slots, and track status updates across the full booking lifecycle.</p>
          </div>
        </div>
      </section>
    </section>
  );
}
