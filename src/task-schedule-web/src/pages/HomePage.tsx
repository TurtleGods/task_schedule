import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <section className="grid gap-6">
      <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-10 shadow-2xl shadow-black/20">
        <div className="mb-4 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-blue-200">
          Freelancer Scheduling MVP
        </div>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white">
          Manage provider availability and turn open time slots into confirmed bookings.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
          Task Schedule helps providers publish their profile, schedule, and portfolio, while clients can browse services,
          reserve available slots, and track booking updates from one place.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/register" className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-500">
            Start as Provider
          </Link>
          <Link to="/providers" className="rounded-2xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-blue-500 hover:bg-blue-500/10">
            Browse Providers
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-black/10">
          <h2 className="text-lg font-semibold text-white">For Providers</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Build a profile, publish availability, showcase portfolio work, and manage incoming jobs from one dashboard.
          </p>
        </article>
        <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-black/10">
          <h2 className="text-lg font-semibold text-white">For Clients</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Search providers by service area, review portfolio items, and book an open slot in just a few clicks.
          </p>
        </article>
        <article className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-black/10">
          <h2 className="text-lg font-semibold text-white">Shared Workflow</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Booking status updates and notifications keep both sides aligned throughout the scheduling flow.
          </p>
        </article>
      </section>
    </section>
  );
}
