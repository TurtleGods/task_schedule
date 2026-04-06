import axios from 'axios';

const AUTH_USER_KEY = 'task_schedule_user';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:5112/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem(AUTH_USER_KEY);

  if (!raw) {
    return config;
  }

  try {
    const user = JSON.parse(raw) as { accessToken?: string | null };
    if (user.accessToken) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
  }

  return config;
});
