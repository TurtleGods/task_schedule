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
        <div className="theme-kicker">
          Welcome Back
        </div>
        <h1 className="theme-text-primary mt-5 text-3xl font-semibold tracking-tight xl:text-4xl">Sign in and continue your booking workflow</h1>
        <p className="theme-text-secondary mt-4 max-w-xl text-sm leading-7">
          Access your provider or client workspace, manage marketplace activity, and keep your booking pipeline moving from one place.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            'Track live booking status',
            'Manage provider and client flows',
            'Review notifications and next actions',
          ].map((item) => (
            <div key={item} className="theme-card theme-text-secondary rounded-3xl p-4 text-sm leading-6">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="theme-panel rounded-[32px] p-8">
        <h2 className="theme-text-primary text-2xl font-semibold">Login</h2>
        <p className="theme-text-secondary mt-2 text-sm leading-6">Sign in with your account to continue the demo flow.</p>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label className="theme-text-secondary grid gap-2 text-sm">
            Email
            <input className="theme-input rounded-2xl px-4 py-3 outline-none ring-0 transition" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label className="theme-text-secondary grid gap-2 text-sm">
            Password
            <input className="theme-input rounded-2xl px-4 py-3 outline-none ring-0 transition" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </label>
          <button className="theme-button-primary mt-2" type="submit">
            Login
          </button>
        </form>
        {message && <p className="theme-text-secondary mt-4 text-sm">{message}</p>}
        <p className="theme-text-secondary mt-6 text-sm">
          Need an account?{' '}
          <Link to="/register" className="theme-link font-medium transition">
            Create one here
          </Link>
          .
        </p>
      </section>
    </section>
  );
}
