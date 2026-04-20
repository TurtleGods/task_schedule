import { Link } from 'react-router-dom';

const highlights = [
  {
    title: 'Publish a provider-ready storefront',
    description: 'Profiles, pricing, service areas, portfolio, and open time slots all live in one polished workflow.',
  },
  {
    title: 'Book with confidence',
    description: 'Clients can browse, compare, inspect portfolio work, and reserve an available slot in a few clicks.',
  },
  {
    title: 'Stay aligned after booking',
    description: 'Notifications and booking statuses keep both sides in sync from request to completion.',
  },
];

const rolePaths = [
  {
    label: 'For Providers',
    title: 'Turn availability into confirmed jobs',
    description: 'Create a profile, publish your schedule, showcase your work, and manage booking requests from one dashboard.',
    actionLabel: 'Start as Provider',
    to: '/register',
  },
  {
    label: 'For Clients',
    title: 'Discover and book trusted professionals',
    description: 'Search by keyword and service area, compare providers, and book open slots without leaving the platform.',
    actionLabel: 'Browse Providers',
    to: '/providers',
  },
];

export function HomePage() {
  return (
    <section className="grid gap-6">
      <section className="theme-hero relative overflow-hidden rounded-[32px] p-8 lg:p-12">
        <div className="absolute -right-16 top-0 hidden h-64 w-64 rounded-full blur-3xl lg:block" style={{ background: 'var(--surface-emphasis)' }} />
        <div className="absolute bottom-0 left-0 hidden h-48 w-48 rounded-full blur-3xl lg:block" style={{ background: 'color-mix(in srgb, var(--surface-emphasis) 70%, transparent)' }} />
        <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.35fr),380px] xl:items-center">
          <div>
            <div className="theme-kicker mb-5">
              Friendly Provider Marketplace
            </div>
            <h1 className="theme-text-primary max-w-4xl text-4xl font-semibold leading-tight lg:text-5xl">
              Find the right provider with a brighter, calmer booking experience.
            </h1>
            <p className="theme-text-secondary mt-5 max-w-3xl text-base leading-7 lg:text-lg">
              Task Schedule helps clients discover trusted providers through clean profiles, clear availability, and a marketplace experience that feels open, welcoming, and easy to explore.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/providers" className="theme-button-primary">
                Browse Providers
              </Link>
              <Link to="/register" className="theme-button-secondary">
                Become a Provider
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <article className="theme-panel rounded-3xl p-5">
              <div className="theme-text-muted text-xs font-medium uppercase tracking-[0.18em]">Marketplace Snapshot</div>
              <div className="mt-4 grid gap-3">
                <div className="theme-muted rounded-2xl p-4">
                  <div className="theme-text-primary text-sm font-semibold">Curated provider discovery</div>
                  <p className="theme-text-secondary mt-1 text-sm">Browse provider cards with service area, pricing notes, and profile context at a glance.</p>
                </div>
                <div className="theme-muted rounded-2xl p-4">
                  <div className="theme-text-primary text-sm font-semibold">Clear booking flow</div>
                  <p className="theme-text-secondary mt-1 text-sm">Move from browsing to booking without losing visibility into slot availability.</p>
                </div>
                <div className="theme-muted rounded-2xl p-4">
                  <div className="theme-text-primary text-sm font-semibold">Thoughtful follow-up</div>
                  <p className="theme-text-secondary mt-1 text-sm">Notifications and status updates keep both sides aligned after the request is sent.</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <article key={item.title} className="theme-card theme-card-hover rounded-3xl p-6 transition hover:-translate-y-0.5">
            <h2 className="theme-text-primary text-lg font-semibold">{item.title}</h2>
            <p className="theme-text-secondary mt-3 text-sm leading-6">{item.description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        {rolePaths.map((path, index) => (
          <article key={path.label} className={`theme-panel rounded-[28px] p-8 ${index === 0 ? '' : ''}`}>
            <div className="theme-kicker">
              {path.label}
            </div>
            <h2 className="theme-text-primary mt-5 text-2xl font-semibold">{path.title}</h2>
            <p className="theme-text-secondary mt-3 max-w-2xl text-sm leading-7">{path.description}</p>
            <Link to={path.to} className="theme-button-secondary mt-6 inline-flex">
              {path.actionLabel}
            </Link>
          </article>
        ))}
      </section>
    </section>
  );
}
