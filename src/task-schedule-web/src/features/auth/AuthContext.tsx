import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import type { CurrentUser } from '../../types/auth';

const AUTH_USER_KEY = 'task_schedule_user';

type AuthContextValue = {
  user: CurrentUser | null;
  setUser: (user: CurrentUser | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUserState] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return;

    try {
      setUserState(JSON.parse(raw) as CurrentUser);
    } catch {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, []);

  const setUser = (nextUser: CurrentUser | null) => {
    setUserState(nextUser);
    if (nextUser) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo(() => ({ user, setUser, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
