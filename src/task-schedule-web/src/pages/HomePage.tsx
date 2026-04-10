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
        <div className="absolute -right-16 top-0 hidden h-64 w-64 rounded-full bg-black/4 blur-3xl lg:block dark:bg-white/5" />
        <div className="absolute bottom-0 left-0 hidden h-48 w-48 rounded-full bg-black/3 blur-3xl lg:block dark:bg-white/4" />
        <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.35fr),380px] xl:items-center">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-black/8 bg-white/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              Friendly Provider Marketplace
            </div>
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-slate-950 dark:text-white lg:text-5xl">
              Find the right provider with a brighter, calmer booking experience.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-700 dark:text-slate-300 lg:text-lg">
              Task Schedule helps clients discover trusted providers through clean profiles, clear availability, and a marketplace experience that feels open, welcoming, and easy to explore.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/providers" className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
                Browse Providers
              </Link>
              <Link to="/register" className="rounded-2xl border border-black/8 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-black/[0.03] dark:border-white/10 dark:bg-[#171717] dark:text-slate-200 dark:hover:bg-white/[0.04]">
                Become a Provider
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <article className="theme-panel rounded-3xl bg-white/80 p-5 dark:bg-[#171717]/90">
              <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-600 dark:text-slate-400">Marketplace Snapshot</div>
              <div className="mt-4 grid gap-3">
                <div className="theme-muted rounded-2xl p-4">
                  <div className="text-sm font-semibold text-slate-950 dark:text-white">Curated provider discovery</div>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">Browse provider cards with service area, pricing notes, and profile context at a glance.</p>
                </div>
                <div className="theme-muted rounded-2xl p-4">
                  <div className="text-sm font-semibold text-slate-950 dark:text-white">Clear booking flow</div>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">Move from browsing to booking without losing visibility into slot availability.</p>
                </div>
                <div className="theme-muted rounded-2xl p-4">
                  <div className="text-sm font-semibold text-slate-950 dark:text-white">Thoughtful follow-up</div>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">Notifications and status updates keep both sides aligned after the request is sent.</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <article key={item.title} className="theme-card rounded-3xl p-6 transition hover:-translate-y-0.5 hover:border-black/10 hover:shadow-[0_1px_2px_rgba(15,23,42,0.03),0_16px_32px_rgba(15,23,42,0.05)] dark:hover:border-white/12 dark:hover:shadow-[0_1px_2px_rgba(0,0,0,0.35),0_16px_32px_rgba(0,0,0,0.28)]">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">{item.description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        {rolePaths.map((path, index) => (
          <article key={path.label} className={`theme-panel rounded-[28px] p-8 ${index === 0 ? 'bg-[linear-gradient(180deg,#fcfcfb_0%,#f5f5f3_100%)] dark:bg-[linear-gradient(180deg,#181818_0%,#151515_100%)]' : 'bg-[linear-gradient(180deg,#fbfbfa_0%,#f3f3f1_100%)] dark:bg-[linear-gradient(180deg,#181818_0%,#141414_100%)]'}`}>
            <div className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-600 shadow-sm dark:bg-white/5 dark:text-slate-300">
              {path.label}
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-slate-950 dark:text-white">{path.title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-700 dark:text-slate-300">{path.description}</p>
            <Link to={path.to} className="mt-6 inline-flex rounded-2xl border border-black/8 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-black/[0.03] dark:border-white/10 dark:bg-[#171717] dark:text-slate-200 dark:hover:bg-white/[0.04]">
              {path.actionLabel}
            </Link>
          </article>
        ))}
      </section>
    </section>
  );
}
