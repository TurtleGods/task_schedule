import { DashboardCards } from '../components/dashboard/DashboardCards';
import { useAuth } from '../features/auth/AuthContext';

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <section className="dashboard-stack">
      <section className="card hero-card">
        <h1>Dashboard</h1>
        <p>Demo-ready command center for provider and client workflows.</p>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </section>
      <DashboardCards />
    </section>
  );
}
