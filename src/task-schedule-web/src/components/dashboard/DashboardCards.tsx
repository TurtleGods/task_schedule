import { Link } from 'react-router-dom';

export function DashboardCards() {
  const cards = [
    {
      title: 'Profile',
      description: 'Manage provider/client profile details and publishing settings.',
      to: '/profile',
    },
    {
      title: 'Schedule',
      description: 'Create and maintain availability slots for booking.',
      to: '/schedule',
    },
    {
      title: 'Portfolio',
      description: 'Showcase previous work and portfolio items.',
      to: '/portfolio',
    },
    {
      title: 'Providers',
      description: 'Browse published providers and their available time slots.',
      to: '/providers',
    },
    {
      title: 'My Bookings',
      description: 'Review your bookings as a client.',
      to: '/bookings',
    },
    {
      title: 'My Jobs',
      description: 'Manage inbound booking requests as a provider.',
      to: '/jobs',
    },
    {
      title: 'Notifications',
      description: 'Check booking updates and mark notifications as read.',
      to: '/notifications',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.to}
          to={card.to}
          className="group rounded-3xl border border-slate-100 bg-white p-6 text-slate-900 shadow-[0_12px_32px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_16px_36px_rgba(14,116,144,0.12)]"
        >
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
            →
          </div>
          <h2 className="text-lg font-semibold text-slate-900">{card.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 group-hover:text-slate-700">{card.description}</p>
        </Link>
      ))}
    </div>
  );
}
