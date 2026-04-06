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
      <section className="overflow-hidden rounded-[32px] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 shadow-2xl shadow-black/20">
        <div className="grid gap-8 p-8 xl:grid-cols-[minmax(0,1.3fr),380px] xl:p-10">
          <div>
            <div className="inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-blue-200">
              {roleLabel} Dashboard
            </div>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white xl:text-4xl">Your Task Schedule control center</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Manage marketplace activity, move through role-based workflows, and keep the next important action visible.
              This dashboard is designed as the main operating surface for both providers and clients.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {quickStats.map((item) => (
                <div key={item.label} className="rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
                  <p className="mt-3 text-sm font-medium text-white">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[28px] border border-slate-800 bg-slate-950/70 p-6">
            <div className="inline-flex rounded-full bg-slate-800 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-300">
              Session Snapshot
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Useful for demo verification, role checks, and confirming the authenticated session payload.
            </p>
            <pre className="mt-5 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs leading-6 text-slate-300">
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
