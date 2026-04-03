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
    } catch {
      setMessage('Failed to load providers.');
    }
  };

  useEffect(() => {
    void loadProviders();
  }, []);

  return (
    <section className="grid gap-6 xl:grid-cols-[320px,minmax(0,1fr)]">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
        <h1 className="text-2xl font-semibold text-white">Providers Marketplace</h1>
        <p className="mt-2 text-sm text-slate-400">Search published providers by keyword and service area.</p>
        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm text-slate-300">
            Keyword
            <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          </label>
          <label className="grid gap-2 text-sm text-slate-300">
            Service area
            <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500" value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} />
          </label>
          <button className="rounded-2xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-500" type="button" onClick={() => void loadProviders()}>
            Search
          </button>
        </div>
        {message && <p className="mt-4 text-sm text-blue-300">{message}</p>}
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Published Providers</h2>
            <p className="mt-1 text-sm text-slate-400">Click into a provider to review portfolio and available time slots.</p>
          </div>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{providers.length} results</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {providers.map((provider) => (
            <article key={provider.id} className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 transition hover:border-blue-500/40 hover:bg-slate-950">
              <div className="mb-4 inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300 ring-1 ring-blue-500/20">
                {provider.serviceArea || 'Service area TBD'}
              </div>
              <h3 className="text-lg font-semibold text-white">{provider.displayName}</h3>
              <p className="mt-2 text-sm text-slate-300">{provider.headline || 'No headline yet.'}</p>
              <p className="mt-3 text-sm leading-6 text-slate-400 line-clamp-3">{provider.bio || 'No provider bio yet.'}</p>
              <div className="mt-4 text-sm text-slate-500">Pricing: {provider.pricingNotes || 'Not specified'}</div>
              <Link to={`/providers/${provider.id}`} className="mt-6 inline-flex rounded-2xl border border-blue-500/40 px-4 py-2 text-sm font-medium text-blue-200 transition hover:bg-blue-500/10">
                View details
              </Link>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
