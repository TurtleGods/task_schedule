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
          className="group rounded-3xl border border-slate-800 bg-slate-900/70 p-6 text-slate-100 shadow-lg shadow-black/10 transition hover:-translate-y-1 hover:border-blue-500/50 hover:bg-slate-900"
        >
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-300 ring-1 ring-blue-500/20">
            →
          </div>
          <h2 className="text-lg font-semibold text-white">{card.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400 group-hover:text-slate-300">{card.description}</p>
        </Link>
      ))}
    </div>
  );
}
