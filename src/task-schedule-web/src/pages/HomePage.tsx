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
      <section className="relative overflow-hidden rounded-[32px] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-8 shadow-2xl shadow-black/30 lg:p-12">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_60%)] lg:block" />
        <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.35fr),380px] xl:items-center">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-blue-200">
              Freelancer Scheduling MVP
            </div>
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-white lg:text-5xl">
              Book trusted professionals with clear availability and a workflow that feels product-ready.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 lg:text-lg">
              Task Schedule helps providers publish their profile, schedule, and portfolio while clients browse services,
              reserve open slots, and track booking updates from a clean, modern marketplace experience.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/providers" className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-500">
                Browse Providers
              </Link>
              <Link to="/register" className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-blue-500 hover:bg-blue-500/10">
                Become a Provider
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <article className="rounded-3xl border border-blue-500/20 bg-blue-500/10 p-5 shadow-xl shadow-blue-950/10">
              <div className="text-xs font-medium uppercase tracking-[0.18em] text-blue-200">Marketplace Snapshot</div>
              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="text-sm font-semibold text-white">3 published providers</div>
                  <p className="mt-1 text-sm text-slate-400">Browse providers with profile, pricing, and portfolio context.</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="text-sm font-semibold text-white">Open booking workflow</div>
                  <p className="mt-1 text-sm text-slate-400">Reserve available slots and track request status from one dashboard.</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="text-sm font-semibold text-white">Notifications built in</div>
                  <p className="mt-1 text-sm text-slate-400">Keep providers and clients aligned through every booking update.</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <article key={item.title} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-black/10 transition hover:border-blue-500/20 hover:bg-slate-900">
            <h2 className="text-lg font-semibold text-white">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">{item.description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        {rolePaths.map((path) => (
          <article key={path.label} className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/10">
            <div className="inline-flex rounded-full bg-slate-800 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
              {path.label}
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-white">{path.title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">{path.description}</p>
            <Link to={path.to} className="mt-6 inline-flex rounded-2xl border border-blue-500/40 px-4 py-3 text-sm font-medium text-blue-200 transition hover:bg-blue-500/10">
              {path.actionLabel}
            </Link>
          </article>
        ))}
      </section>
    </section>
  );
}
