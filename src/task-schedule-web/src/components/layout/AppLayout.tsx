import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';

export function AppLayout() {
  const { user } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <strong>Task Schedule</strong>
          <p>Freelancer scheduling platform</p>
        </div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
      </header>

      <main className="page-container">
        {user && (
          <section className="user-banner">
            <span>Signed in as {user.displayName ?? user.email}</span>
            <span>Roles: {user.roles.join(', ') || 'N/A'}</span>
          </section>
        )}
        <Outlet />
      </main>
    </div>
  );
}
