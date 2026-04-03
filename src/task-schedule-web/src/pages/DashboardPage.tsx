import { DashboardCards } from '../components/dashboard/DashboardCards';
import { OnboardingChecklist } from '../components/dashboard/OnboardingChecklist';
import { useAuth } from '../features/auth/AuthContext';

export function DashboardPage() {
  const { user } = useAuth();
  const roleLabel = user?.roles.includes('Provider') ? 'Provider' : user?.roles.includes('Client') ? 'Client' : 'User';

  return (
    <section className="grid gap-6">
      <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-2xl shadow-black/20">
        <div className="mb-4 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium tracking-wide text-blue-200 uppercase">
          {roleLabel} Dashboard
        </div>
        <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          Demo-ready command center for provider and client workflows. The checklist below highlights the most useful next steps for your current role.
        </p>
        <pre className="mt-6 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs text-slate-300">
          {JSON.stringify(user, null, 2)}
        </pre>
      </section>
      <OnboardingChecklist user={user} />
      <DashboardCards />
    </section>
  );
}
