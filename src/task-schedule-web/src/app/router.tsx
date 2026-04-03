import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ProfilePage } from '../pages/profiles/ProfilePage';
import { SchedulePage } from '../pages/schedule/SchedulePage';
import { PortfolioPage } from '../pages/portfolio/PortfolioPage';
import { ProviderDetailPage } from '../pages/marketplace/ProviderDetailPage';
import { ProvidersPage } from '../pages/marketplace/ProvidersPage';
import { ClientBookingsPage } from '../pages/bookings/ClientBookingsPage';
import { ProviderBookingsPage } from '../pages/bookings/ProviderBookingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'schedule', element: <SchedulePage /> },
      { path: 'portfolio', element: <PortfolioPage /> },
      { path: 'providers', element: <ProvidersPage /> },
      { path: 'providers/:providerId', element: <ProviderDetailPage /> },
      { path: 'bookings', element: <ClientBookingsPage /> },
      { path: 'jobs', element: <ProviderBookingsPage /> },
    ],
  },
]);
