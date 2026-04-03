import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:5112/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
