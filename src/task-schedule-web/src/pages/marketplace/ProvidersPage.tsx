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
  const [isLoading, setIsLoading] = useState(false);

  const loadProviders = async () => {
    setIsLoading(true);
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
      setMessage('Failed to load providers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadProviders();
  }, []);

  return (
    <section className="grid gap-6 xl:grid-cols-[320px,minmax(0,1fr)]">
      <section className="theme-panel rounded-[28px] p-8">
        <div className="inline-flex rounded-full border border-black/8 bg-black/[0.03] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">
          Marketplace Filters
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-slate-900 dark:text-white">Find a provider with confidence</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Search by skill, service style, or location. This view is designed to feel open, calm, and easy to scan before you commit to a booking.</p>
        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm text-slate-700">
            Keyword
            <input className="theme-input rounded-2xl px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white dark:focus:bg-[#111111]" placeholder="e.g. React, Azure, UI/UX" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          </label>
          <label className="grid gap-2 text-sm text-slate-700">
            Service area
            <input className="theme-input rounded-2xl px-4 py-3 outline-none transition focus:border-slate-400 focus:bg-white dark:focus:bg-[#111111]" placeholder="e.g. Taipei, Remote" value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} />
          </label>
          <div className="flex flex-wrap gap-3 pt-2">
            <button className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200" type="button" onClick={() => void loadProviders()} disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search providers'}
            </button>
            <button
              className="theme-card rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-black/10 hover:bg-black/[0.03] dark:text-slate-200 dark:hover:bg-white/[0.04]"
              type="button"
              onClick={() => {
                setKeyword('');
                setServiceArea('');
                setIsLoading(true);
                void api
                  .get('/marketplace/providers')
                  .then((response) => {
                    setProviders(response.data ?? []);
                    setMessage('');
                  })
                  .catch(() => setMessage('Failed to load providers. Please try again.'))
                  .finally(() => setIsLoading(false));
              }}
            >
              Reset
            </button>
          </div>
        </div>
        {message && <p className="mt-4 text-sm text-rose-600">{message}</p>}
      </section>

      <section className="theme-panel rounded-[28px] p-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex rounded-full bg-black/[0.03] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:bg-white/[0.05] dark:text-slate-300">
              Published Providers
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">Browse available specialists</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Open a provider profile to review their work, compare service notes, and find an available slot that fits your timing.</p>
          </div>
          <span className="theme-muted inline-flex w-fit rounded-full px-3 py-1 text-xs text-slate-600 dark:text-slate-300">{providers.length} results</span>
        </div>

        {isLoading ? (
          <section className="theme-muted rounded-3xl p-10 text-center">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Loading providers...</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Fetching the latest published provider list for the marketplace.</p>
          </section>
        ) : providers.length === 0 ? (
          <section className="theme-muted rounded-3xl border-dashed p-10 text-center">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No providers found</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Try broadening your keyword or removing the service area filter.</p>
          </section>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {providers.map((provider, index) => (
              <article key={provider.id} className="theme-card rounded-[28px] p-6 transition hover:-translate-y-0.5 hover:border-black/10 hover:shadow-[0_1px_2px_rgba(15,23,42,0.03),0_16px_32px_rgba(15,23,42,0.05)] dark:hover:border-white/12 dark:hover:shadow-[0_1px_2px_rgba(0,0,0,0.35),0_16px_32px_rgba(0,0,0,0.28)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className={`mb-4 inline-flex rounded-full px-3 py-1 text-xs font-medium ${index % 3 === 0 ? 'bg-black/[0.04] text-slate-600 dark:bg-white/[0.05] dark:text-slate-300' : index % 3 === 1 ? 'bg-black/[0.055] text-slate-700 dark:bg-white/[0.07] dark:text-slate-200' : 'bg-black/[0.045] text-slate-600 dark:bg-white/[0.06] dark:text-slate-300'}`}>
                      {provider.serviceArea || 'Service area TBD'}
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{provider.displayName}</h3>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{provider.headline || 'No headline yet.'}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-black/8 bg-black/[0.03] text-base font-semibold text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200">
                    {provider.displayName.slice(0, 1).toUpperCase()}
                  </div>
                </div>
                <p className="mt-4 min-h-[72px] text-sm leading-6 text-slate-600 line-clamp-3 dark:text-slate-300">{provider.bio || 'No provider bio yet.'}</p>
                <div className="theme-muted mt-5 rounded-2xl px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Pricing</div>
                  <div className="mt-2">{provider.pricingNotes || 'Not specified yet.'}</div>
                </div>
                <Link to={`/providers/${provider.id}`} className="mt-6 inline-flex rounded-2xl border border-black/8 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-black/[0.03] dark:border-white/10 dark:bg-[#171717] dark:text-slate-200 dark:hover:bg-white/[0.04]">
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
