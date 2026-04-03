import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <section className="mx-auto w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
      <h1 className="text-2xl font-semibold text-white">Login</h1>
      <p className="mt-2 text-sm text-slate-400">Sign in with your account to continue the demo flow.</p>
      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm text-slate-300">
          Email
          <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 transition focus:border-blue-500" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Password
          <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 transition focus:border-blue-500" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>
        <button className="mt-2 rounded-2xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-500" type="submit">Login</button>
      </form>
      {message && <p className="mt-4 text-sm text-blue-300">{message}</p>}
    </section>
  );
}
