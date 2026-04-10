import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../features/auth/AuthContext';
import type { LoginRequest } from '../types/auth';

export function LoginPage() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginRequest>({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await api.post('/identity/login', form);
      setUser({
        userId: response.data.id,
        email: response.data.email,
        displayName: response.data.displayName,
        isAuthenticated: true,
        roles: response.data.roles ?? [],
        accessToken: response.data.accessToken ?? null,
      });
      setMessage('Login success. Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 300);
    } catch {
      setMessage('Login failed. Please check API availability and credentials.');
    }
  };

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-6 xl:grid-cols-[minmax(0,1fr),460px] xl:items-stretch">
      <section className="theme-hero rounded-[32px] p-8 xl:p-10">
        <div className="inline-flex rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-sky-700 shadow-sm dark:border-slate-700 dark:bg-slate-800/80 dark:text-sky-300">
          Welcome Back
        </div>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white xl:text-4xl">Sign in and continue your booking workflow</h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
          Access your provider or client workspace, manage marketplace activity, and keep your booking pipeline moving from one place.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            'Track live booking status',
            'Manage provider and client flows',
            'Review notifications and next actions',
          ].map((item) => (
            <div key={item} className="theme-card rounded-3xl p-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="theme-panel rounded-[32px] p-8">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Login</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Sign in with your account to continue the demo flow.</p>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm text-slate-700">
            Email
            <input className="theme-input rounded-2xl px-4 py-3 text-slate-900 outline-none ring-0 transition focus:border-sky-400 focus:bg-white dark:text-white dark:focus:bg-slate-900" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label className="grid gap-2 text-sm text-slate-700">
            Password
            <input className="theme-input rounded-2xl px-4 py-3 text-slate-900 outline-none ring-0 transition focus:border-sky-400 focus:bg-white dark:text-white dark:focus:bg-slate-900" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </label>
          <button className="mt-2 rounded-2xl bg-sky-600 px-4 py-3 font-medium text-white transition hover:bg-sky-500" type="submit">
            Login
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-sky-700 dark:text-sky-300">{message}</p>}
        <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">
          Need an account?{' '}
          <Link to="/register" className="font-medium text-sky-700 transition hover:text-sky-600 dark:text-sky-300 dark:hover:text-sky-200">
            Create one here
          </Link>
          .
        </p>
      </section>
    </section>
  );
}
