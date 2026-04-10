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
      <section className="overflow-hidden rounded-[32px] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-50 shadow-[0_20px_60px_rgba(14,116,144,0.12)]">
        <div className="grid gap-8 p-8 xl:grid-cols-[minmax(0,1.3fr),380px] xl:p-10">
          <div>
            <div className="inline-flex rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-sky-700 shadow-sm">
              {roleLabel} Dashboard
            </div>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 xl:text-4xl">Your Task Schedule control center</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              Manage marketplace activity, move through role-based workflows, and keep the next important action visible.
              This dashboard is designed as the main operating surface for both providers and clients.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {quickStats.map((item) => (
                <div key={item.label} className="rounded-3xl border border-slate-100 bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
                  <p className="mt-3 text-sm font-medium text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[28px] border border-sky-100 bg-white/90 p-6 shadow-[0_16px_40px_rgba(14,116,144,0.12)]">
            <div className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-sky-700">
              Session Snapshot
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Useful for demo verification, role checks, and confirming the authenticated session payload.
            </p>
            <pre className="mt-5 overflow-x-auto rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs leading-6 text-slate-700">
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
