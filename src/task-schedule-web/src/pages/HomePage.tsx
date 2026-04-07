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
      <section className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-8 shadow-[0_20px_60px_rgba(14,116,144,0.12)] lg:p-12">
        <div className="absolute -right-16 top-0 hidden h-64 w-64 rounded-full bg-sky-200/40 blur-3xl lg:block" />
        <div className="absolute bottom-0 left-0 hidden h-48 w-48 rounded-full bg-cyan-200/40 blur-3xl lg:block" />
        <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.35fr),380px] xl:items-center">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-sky-700 shadow-sm">
              Friendly Provider Marketplace
            </div>
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-slate-900 lg:text-5xl">
              Find the right provider with a brighter, calmer booking experience.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 lg:text-lg">
              Task Schedule helps clients discover trusted providers through clean profiles, clear availability, and a marketplace experience that feels open, welcoming, and easy to explore.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/providers" className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-sky-500">
                Browse Providers
              </Link>
              <Link to="/register" className="rounded-2xl border border-sky-200 bg-white px-5 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-50">
                Become a Provider
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <article className="rounded-3xl border border-sky-100 bg-white/90 p-5 shadow-[0_16px_40px_rgba(14,116,144,0.12)]">
              <div className="text-xs font-medium uppercase tracking-[0.18em] text-sky-700">Marketplace Snapshot</div>
              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl border border-slate-100 bg-sky-50/70 p-4">
                  <div className="text-sm font-semibold text-slate-900">Curated provider discovery</div>
                  <p className="mt-1 text-sm text-slate-600">Browse provider cards with service area, pricing notes, and profile context at a glance.</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-emerald-50/70 p-4">
                  <div className="text-sm font-semibold text-slate-900">Clear booking flow</div>
                  <p className="mt-1 text-sm text-slate-600">Move from browsing to booking without losing visibility into slot availability.</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-amber-50/70 p-4">
                  <div className="text-sm font-semibold text-slate-900">Thoughtful follow-up</div>
                  <p className="mt-1 text-sm text-slate-600">Notifications and status updates keep both sides aligned after the request is sent.</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <article key={item.title} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_16px_36px_rgba(14,116,144,0.12)]">
            <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        {rolePaths.map((path, index) => (
          <article key={path.label} className={`rounded-[28px] border p-8 shadow-[0_16px_40px_rgba(15,23,42,0.06)] ${index === 0 ? 'border-sky-100 bg-gradient-to-br from-white to-sky-50' : 'border-cyan-100 bg-gradient-to-br from-white to-cyan-50'}`}>
            <div className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-600 shadow-sm">
              {path.label}
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-slate-900">{path.title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{path.description}</p>
            <Link to={path.to} className="mt-6 inline-flex rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-50">
              {path.actionLabel}
            </Link>
          </article>
        ))}
      </section>
    </section>
  );
}
