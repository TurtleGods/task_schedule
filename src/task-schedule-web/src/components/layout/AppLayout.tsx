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
    <div className="app-shell min-h-screen theme-text-primary transition-colors">
      <header className="app-header sticky top-0 z-20 border-b backdrop-blur transition-colors">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-col gap-1">
            <div className="theme-accent-soft inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
              Demo MVP
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <strong className="theme-text-primary block text-lg font-semibold">Task Schedule</strong>
              <p className="theme-text-muted truncate text-sm">{theme === 'bright' ? 'A bright, friendly marketplace for discovering service providers' : 'A darker workspace for focused provider and booking management'}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 lg:items-end">
            <div className="flex flex-wrap items-center justify-end gap-2">
              <span className="theme-text-muted text-xs font-medium uppercase tracking-[0.18em]">Theme</span>
              <div className="theme-card inline-flex rounded-full p-1 shadow-none">
                <button
                  type="button"
                  onClick={() => setTheme('bright')}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${theme === 'bright' ? 'theme-button-tab-active' : 'theme-button-tab'}`}
                >
                  Bright
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${theme === 'dark' ? 'theme-button-tab-active' : 'theme-button-tab'}`}
                >
                  Dark
                </button>
              </div>

              <div className="theme-card theme-text-secondary flex flex-wrap items-center gap-2 rounded-full px-3 py-1.5 text-sm shadow-none">
                {user ? (
                  <>
                    <span className="theme-text-primary">{user.displayName ?? user.email}</span>
                    <span className="theme-text-muted">•</span>
                    <span>{user.roles.join(', ') || 'User'}</span>
                    <button
                      type="button"
                      onClick={logout}
                      className="theme-button-outline rounded-full px-3 py-1"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <span>Guest</span>
                    <Link to="/login" className="theme-button-outline rounded-full px-3 py-1">
                      Login
                    </Link>
                    <Link to="/register" className="theme-button-primary-compact rounded-full px-3 py-1">
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
                  className="theme-card theme-text-secondary relative rounded-full px-3 py-1.5 text-sm shadow-none transition hover:[background:var(--surface-selected)]"
                >
                  {label}
                  {to === '/notifications' && unreadCount > 0 && (
                    <span className="theme-status-badge ml-2">
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
          <section className="theme-panel theme-text-secondary flex flex-col gap-3 rounded-[28px] px-4 py-4 text-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-1">
              <span className="theme-text-primary font-medium">Signed in as {user.displayName ?? user.email}</span>
              <span className="theme-text-muted">Roles: {user.roles.join(', ') || 'N/A'}</span>
            </div>
            <div className="theme-pill rounded-full px-3 py-1 uppercase tracking-[0.18em]">
              Workspace Active
            </div>
          </section>
        )}
        <Outlet />
      </main>
    </div>
  );
}
