export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
  role: 'Provider' | 'Client' | 'Admin';
  timeZone?: string;
}

export interface CurrentUser {
  userId: string | null;
  email: string | null;
  displayName: string | null;
  isAuthenticated: boolean;
  roles: string[];
}
