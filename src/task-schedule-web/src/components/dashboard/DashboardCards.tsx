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
    <div className="dashboard-grid">
      {cards.map((card) => (
        <Link key={card.to} to={card.to} className="card dashboard-card-link">
          <h2>{card.title}</h2>
          <p>{card.description}</p>
        </Link>
      ))}
    </div>
  );
}
