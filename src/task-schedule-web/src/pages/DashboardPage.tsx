import { useAuth } from '../features/auth/AuthContext';

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <section className="card">
      <h1>Dashboard</h1>
      <p>This is the entry dashboard for authenticated flows.</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </section>
  );
}
