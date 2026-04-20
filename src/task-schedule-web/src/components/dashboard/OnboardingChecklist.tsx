import { Link } from 'react-router-dom';
import type { CurrentUser } from '../../types/auth';

type OnboardingChecklistProps = {
  user: CurrentUser | null;
};

export function OnboardingChecklist({ user }: OnboardingChecklistProps) {
  if (!user) return null;

  const isProvider = user.roles.includes('Provider');
  const isClient = user.roles.includes('Client');

  const items = isProvider
    ? [
        { title: 'Complete your provider profile', description: 'Add headline, bio, service area, pricing, and publish your profile.', to: '/profile' },
        { title: 'Create availability slots', description: 'Add open time ranges so clients can start booking.', to: '/schedule' },
        { title: 'Upload portfolio items', description: 'Showcase your work before clients open a booking.', to: '/portfolio' },
        { title: 'Review incoming jobs', description: 'Confirm, cancel, or complete booking requests.', to: '/jobs' },
      ]
    : isClient
      ? [
          { title: 'Browse providers', description: 'Search published providers by keyword or service area.', to: '/providers' },
          { title: 'Create your first booking', description: 'Open a provider detail page and book an available slot.', to: '/providers' },
          { title: 'Track your bookings', description: 'Review booking status changes from one place.', to: '/bookings' },
          { title: 'Check notifications', description: 'Read booking updates and provider responses.', to: '/notifications' },
        ]
      : [];

  if (!items.length) return null;

  return (
    <section className="theme-panel rounded-3xl p-8">
      <div className="mb-6">
        <div className="theme-accent-soft inline-flex rounded-full px-3 py-1 text-xs font-medium">
          Onboarding Checklist
        </div>
        <h2 className="theme-text-primary mt-4 text-2xl font-semibold">Recommended next steps</h2>
        <p className="theme-text-secondary mt-2 text-sm">Use this checklist to move through the most important pages in order.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item, index) => (
          <Link key={item.title} to={item.to} className="theme-card theme-card-hover rounded-3xl p-5 transition hover:-translate-y-1">
            <div className="theme-button-primary-compact mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full px-0 py-0 text-sm font-semibold">
              {index + 1}
            </div>
            <h3 className="theme-text-primary text-lg font-semibold">{item.title}</h3>
            <p className="theme-text-secondary mt-2 text-sm leading-6">{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
