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
    <section className="rounded-3xl border border-sky-100 bg-white p-8 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <div className="mb-6">
        <div className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
          Onboarding Checklist
        </div>
        <h2 className="mt-4 text-2xl font-semibold text-slate-900">Recommended next steps</h2>
        <p className="mt-2 text-sm text-slate-600">Use this checklist to move through the most important pages in order.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item, index) => (
          <Link key={item.title} to={item.to} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_16px_36px_rgba(14,116,144,0.12)]">
            <div className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-sm font-semibold text-white">
              {index + 1}
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
