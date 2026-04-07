import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';

import { useEffect, useState } from 'react';

const guestNavItems = [
  ['/', 'Home'],
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
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadNotifications = async () => {
      if (!user) {
        setUnreadCount(0);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5112/api'}/notifications/me`, {
          headers: user.accessToken ? { Authorization: `Bearer ${user.accessToken}` } : undefined,
        });
        if (!response.ok) return;
        const notifications = await response.json();
        setUnreadCount((notifications ?? []).filter((item: { isRead: boolean }) => !item.isRead).length);
      } catch {
        // keep silent in layout
      }
    };

    void loadNotifications();
  }, [user]);

  const navItems = !user
    ? guestNavItems
    : user.roles.includes('Provider')
      ? providerNavItems
      : user.roles.includes('Client')
        ? clientNavItems
        : [['/', 'Home'], ['/dashboard', 'Dashboard'], ['/notifications', 'Notifications']] as const;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-sky-100/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
              Demo MVP
            </div>
            <strong className="block text-lg font-semibold text-slate-900">Task Schedule</strong>
            <p className="text-sm text-slate-500">A bright, friendly marketplace for discovering service providers</p>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <nav className="flex flex-wrap gap-2">
              {navItems.map(([to, label]) => (
                <Link
                  key={to}
                  to={to}
                  className="relative rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                >
                  {label}
                  {to === '/notifications' && unreadCount > 0 && (
                    <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
              {user ? (
                <>
                  <span className="text-slate-800">{user.displayName ?? user.email}</span>
                  <span className="text-slate-300">•</span>
                  <span>{user.roles.join(', ') || 'User'}</span>
                  <button
                    type="button"
                    onClick={logout}
                    className="ml-2 rounded-xl border border-rose-200 px-3 py-1.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <span>Guest</span>
                  <Link to="/login" className="rounded-xl border border-sky-200 px-3 py-1.5 text-sm font-medium text-sky-700 transition hover:bg-sky-50">
                    Login
                  </Link>
                  <Link to="/register" className="rounded-xl bg-sky-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-sky-500">
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
          <section className="flex flex-col gap-3 rounded-[28px] border border-sky-200 bg-gradient-to-r from-sky-50 to-cyan-50 px-4 py-4 text-sm text-sky-900 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-1">
              <span className="font-medium text-slate-900">Signed in as {user.displayName ?? user.email}</span>
              <span className="text-slate-600">Roles: {user.roles.join(', ') || 'N/A'}</span>
            </div>
            <div className="rounded-full border border-sky-200 bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.18em] text-sky-700">
              Workspace Active
            </div>
          </section>
        )}
        <Outlet />
      </main>
    </div>
  );
}
