import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

type Provider = {
  id: string;
  displayName: string;
  headline?: string;
  bio?: string;
  serviceArea?: string;
  pricingNotes?: string;
};

export function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [keyword, setKeyword] = useState('');
  const [serviceArea, setServiceArea] = useState('');
  const [message, setMessage] = useState('');

  const loadProviders = async () => {
    try {
      const response = await api.get('/marketplace/providers', {
        params: {
          keyword: keyword || undefined,
          serviceArea: serviceArea || undefined,
        },
      });
      setProviders(response.data ?? []);
      setMessage('');
    } catch {
      setMessage('Failed to load providers.');
    }
  };

  useEffect(() => {
    void loadProviders();
  }, []);

  return (
    <section className="grid gap-6 xl:grid-cols-[320px,minmax(0,1fr)]">
      <section className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
        <div className="inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-blue-200 ring-1 ring-blue-500/20">
          Marketplace Filters
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-white">Find the right provider faster</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">Search published providers by keyword, specialty, or service area. Use the filters to narrow the list before opening the detail page.</p>
        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm text-slate-300">
            Keyword
            <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500" placeholder="e.g. React, Azure, UI/UX" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          </label>
          <label className="grid gap-2 text-sm text-slate-300">
            Service area
            <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500" placeholder="e.g. Taipei, Remote" value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} />
          </label>
          <div className="flex flex-wrap gap-3 pt-2">
            <button className="flex-1 rounded-2xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-500" type="button" onClick={() => void loadProviders()}>
              Search providers
            </button>
            <button
              className="rounded-2xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-blue-500 hover:bg-blue-500/10"
              type="button"
              onClick={() => {
                setKeyword('');
                setServiceArea('');
                void api
                  .get('/marketplace/providers')
                  .then((response) => {
                    setProviders(response.data ?? []);
                    setMessage('');
                  })
                  .catch(() => setMessage('Failed to load providers.'));
              }}
            >
              Reset
            </button>
          </div>
        </div>
        {message && <p className="mt-4 text-sm text-blue-300">{message}</p>}
      </section>

      <section className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex rounded-full bg-slate-800 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
              Published Providers
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-white">Browse available specialists</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Open a provider to inspect their portfolio, pricing notes, and currently available booking slots.</p>
          </div>
          <span className="inline-flex w-fit rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{providers.length} results</span>
        </div>

        {providers.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-slate-700 bg-slate-950/50 p-10 text-center">
            <h3 className="text-lg font-semibold text-white">No providers found</h3>
            <p className="mt-2 text-sm text-slate-400">Try broadening your keyword or removing the service area filter.</p>
          </section>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {providers.map((provider) => (
              <article key={provider.id} className="rounded-[28px] border border-slate-800 bg-slate-950/70 p-6 transition hover:border-blue-500/40 hover:bg-slate-950">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-4 inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300 ring-1 ring-blue-500/20">
                      {provider.serviceArea || 'Service area TBD'}
                    </div>
                    <h3 className="text-xl font-semibold text-white">{provider.displayName}</h3>
                    <p className="mt-2 text-sm text-slate-300">{provider.headline || 'No headline yet.'}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-base font-semibold text-blue-200">
                    {provider.displayName.slice(0, 1).toUpperCase()}
                  </div>
                </div>
                <p className="mt-4 min-h-[72px] text-sm leading-6 text-slate-400 line-clamp-3">{provider.bio || 'No provider bio yet.'}</p>
                <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Pricing</div>
                  <div className="mt-2">{provider.pricingNotes || 'Not specified yet.'}</div>
                </div>
                <Link to={`/providers/${provider.id}`} className="mt-6 inline-flex rounded-2xl border border-blue-500/40 px-4 py-3 text-sm font-medium text-blue-200 transition hover:bg-blue-500/10">
                  View provider detail
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
