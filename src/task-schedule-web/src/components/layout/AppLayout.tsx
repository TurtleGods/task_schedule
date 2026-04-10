import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { useTheme } from '../../features/theme/ThemeContext';

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
  const { theme, setTheme } = useTheme();
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
    <div className="app-shell min-h-screen text-slate-900 transition-colors dark:text-slate-100">
      <header className="app-header sticky top-0 z-20 border-b backdrop-blur transition-colors">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-col gap-1">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-black/8 bg-black/[0.03] px-3 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200">
              Demo MVP
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <strong className="block text-lg font-semibold text-slate-900 dark:text-white">Task Schedule</strong>
              <p className="truncate text-sm text-slate-500 dark:text-slate-400">{theme === 'bright' ? 'A bright, friendly marketplace for discovering service providers' : 'A darker workspace for focused provider and booking management'}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 lg:items-end">
            <div className="flex flex-wrap items-center justify-end gap-2">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Theme</span>
              <div className="theme-card inline-flex rounded-full p-1 shadow-none">
                <button
                  type="button"
                  onClick={() => setTheme('bright')}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${theme === 'bright' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-600 hover:bg-black/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.06]'}`}
                >
                  Bright
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${theme === 'dark' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-600 hover:bg-black/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.06]'}`}
                >
                  Dark
                </button>
              </div>

              <div className="theme-card flex flex-wrap items-center gap-2 rounded-full px-3 py-1.5 text-sm text-slate-600 shadow-none dark:text-slate-300">
                {user ? (
                  <>
                    <span className="text-slate-800 dark:text-white">{user.displayName ?? user.email}</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span>{user.roles.join(', ') || 'User'}</span>
                    <button
                      type="button"
                      onClick={logout}
                      className="rounded-full border border-black/8 px-3 py-1 text-sm font-medium text-slate-700 transition hover:bg-black/[0.03] dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/[0.04]"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <span>Guest</span>
                    <Link to="/login" className="rounded-full border border-black/8 px-3 py-1 text-sm font-medium text-slate-700 transition hover:bg-black/[0.03] dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/[0.04]">
                      Login
                    </Link>
                    <Link to="/register" className="rounded-full bg-slate-900 px-3 py-1 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
            <nav className="flex flex-wrap gap-2">
              {navItems.map(([to, label]) => (
                <Link
                  key={to}
                  to={to}
                  className="theme-card relative rounded-full px-3 py-1.5 text-sm text-slate-700 shadow-none transition hover:border-black/10 hover:bg-black/[0.03] dark:text-slate-200 dark:hover:border-white/12 dark:hover:bg-white/[0.04]"
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
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8">
        {user && (
          <section className="theme-panel flex flex-col gap-3 rounded-[28px] px-4 py-4 text-sm text-slate-700 lg:flex-row lg:items-center lg:justify-between dark:text-slate-200">
            <div className="flex flex-col gap-1">
              <span className="font-medium text-slate-900 dark:text-white">Signed in as {user.displayName ?? user.email}</span>
              <span className="text-slate-600 dark:text-slate-400">Roles: {user.roles.join(', ') || 'N/A'}</span>
            </div>
            <div className="rounded-full border border-black/8 bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">
              Workspace Active
            </div>
          </section>
        )}
        <Outlet />
      </main>
    </div>
  );
}
