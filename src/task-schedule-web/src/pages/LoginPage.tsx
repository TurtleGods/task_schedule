import { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../features/auth/AuthContext';
import type { LoginRequest } from '../types/auth';

export function LoginPage() {
  const { setUser } = useAuth();
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
      setMessage('Login success.');
    } catch (error) {
      setMessage('Login failed. Please check API availability and credentials.');
    }
  };

  return (
    <section className="card auth-card">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Email
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>
        <button type="submit">Login</button>
      </form>
      {message && <p className="form-message">{message}</p>}
    </section>
  );
}
