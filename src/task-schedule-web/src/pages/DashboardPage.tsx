import { DashboardCards } from '../components/dashboard/DashboardCards';
import { OnboardingChecklist } from '../components/dashboard/OnboardingChecklist';
import { useAuth } from '../features/auth/AuthContext';

export function DashboardPage() {
  const { user } = useAuth();
  const roleLabel = user?.roles.includes('Provider') ? 'Provider' : user?.roles.includes('Client') ? 'Client' : 'User';
  const quickStats = [
    { label: 'Current role', value: roleLabel },
    { label: 'Authenticated', value: user?.isAuthenticated ? 'Yes' : 'No' },
    { label: 'Primary email', value: user?.email ?? 'Not available' },
  ];

  return (
    <section className="grid gap-6">
      <section className="theme-hero overflow-hidden rounded-[32px]">
        <div className="grid gap-8 p-8 xl:grid-cols-[minmax(0,1.3fr),380px] xl:p-10">
          <div>
            <div className="theme-kicker">
              {roleLabel} Dashboard
            </div>
            <h1 className="theme-text-primary mt-5 text-3xl font-semibold tracking-tight xl:text-4xl">Your Task Schedule control center</h1>
            <p className="theme-text-secondary mt-4 max-w-2xl text-sm leading-7">
              Manage marketplace activity, move through role-based workflows, and keep the next important action visible.
              This dashboard is designed as the main operating surface for both providers and clients.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {quickStats.map((item) => (
                <div key={item.label} className="theme-card rounded-3xl p-4">
                  <p className="theme-text-muted text-xs uppercase tracking-[0.16em]">{item.label}</p>
                  <p className="theme-text-primary mt-3 text-sm font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="theme-panel rounded-[28px] p-6">
            <div className="theme-pill uppercase tracking-[0.16em]">
              Session Snapshot
            </div>
            <p className="theme-text-secondary mt-4 text-sm leading-6">
              Useful for demo verification, role checks, and confirming the authenticated session payload.
            </p>
            <pre className="theme-muted theme-text-secondary mt-5 overflow-x-auto rounded-2xl p-4 text-xs leading-6">
              {JSON.stringify(user, null, 2)}
            </pre>
          </aside>
        </div>
      </section>

      <OnboardingChecklist user={user} />
      <DashboardCards />
    </section>
  );
}
