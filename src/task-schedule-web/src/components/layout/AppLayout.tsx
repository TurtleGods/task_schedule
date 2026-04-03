import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';

const guestNavItems = [
  ['/', 'Home'],
  ['/login', 'Login'],
  ['/register', 'Register'],
] as const;

const providerNavItems = [
  ['/', 'Home'],
  ['/dashboard', 'Dashboard'],
  ['/profile', 'Profile'],
  ['/schedule', 'Schedule'],
  ['/portfolio', 'Portfolio'],
  ['/jobs', 'My Jobs'],
  ['/notifications', 'Notifications'],
] as const;

const clientNavItems = [
  ['/', 'Home'],
  ['/dashboard', 'Dashboard'],
  ['/providers', 'Providers'],
  ['/bookings', 'My Bookings'],
  ['/notifications', 'Notifications'],
] as const;

export function AppLayout() {
  const { user, logout } = useAuth();

  const navItems = !user
    ? guestNavItems
    : user.roles.includes('Provider')
      ? providerNavItems
      : user.roles.includes('Client')
        ? clientNavItems
        : [['/', 'Home'], ['/dashboard', 'Dashboard'], ['/notifications', 'Notifications']] as const;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <strong className="text-lg font-semibold text-white">Task Schedule</strong>
            <p className="text-sm text-slate-400">Freelancer scheduling platform</p>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <nav className="flex flex-wrap gap-2">
              {navItems.map(([to, label]) => (
                <Link
                  key={to}
                  to={to}
                  className="rounded-full border border-slate-700 px-3 py-1.5 text-sm text-slate-200 transition hover:border-blue-500 hover:bg-blue-500/10 hover:text-white"
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm text-slate-300">
              {user ? (
                <>
                  <span className="text-slate-200">{user.displayName ?? user.email}</span>
                  <span className="text-slate-500">•</span>
                  <span>{user.roles.join(', ') || 'User'}</span>
                  <button
                    type="button"
                    onClick={logout}
                    className="ml-2 rounded-xl border border-rose-500/40 px-3 py-1.5 text-sm font-medium text-rose-200 transition hover:bg-rose-500/10"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <span>Guest</span>
                  <Link to="/login" className="rounded-xl border border-blue-500/40 px-3 py-1.5 text-sm font-medium text-blue-200 transition hover:bg-blue-500/10">
                    Login
                  </Link>
                  <Link to="/register" className="rounded-xl bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-500">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8">
        {user && (
          <section className="flex flex-col gap-2 rounded-2xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-100 lg:flex-row lg:items-center lg:justify-between">
            <span>Signed in as {user.displayName ?? user.email}</span>
            <span>Roles: {user.roles.join(', ') || 'N/A'}</span>
          </section>
        )}
        <Outlet />
      </main>
    </div>
  );
}
