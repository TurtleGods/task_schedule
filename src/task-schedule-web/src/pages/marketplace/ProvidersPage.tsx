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
      <section className="rounded-[28px] border border-sky-100 bg-white p-8 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <div className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-sky-700">
          Marketplace Filters
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-slate-900">Find a provider with confidence</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Search by skill, service style, or location. This view is designed to feel open, calm, and easy to scan before you commit to a booking.</p>
        <div className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm text-slate-700">
            Keyword
            <input className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white" placeholder="e.g. React, Azure, UI/UX" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          </label>
          <label className="grid gap-2 text-sm text-slate-700">
            Service area
            <input className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white" placeholder="e.g. Taipei, Remote" value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} />
          </label>
          <div className="flex flex-wrap gap-3 pt-2">
            <button className="flex-1 rounded-2xl bg-sky-600 px-4 py-3 font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60" type="button" onClick={() => void loadProviders()} disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search providers'}
            </button>
            <button
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-sky-200 hover:bg-sky-50"
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

      <section className="rounded-[28px] border border-sky-100 bg-white p-8 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-sky-700">
              Published Providers
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">Browse available specialists</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Open a provider profile to review their work, compare service notes, and find an available slot that fits your timing.</p>
          </div>
          <span className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">{providers.length} results</span>
        </div>

        {isLoading ? (
          <section className="rounded-3xl border border-slate-100 bg-sky-50/60 p-10 text-center">
            <h3 className="text-lg font-semibold text-slate-900">Loading providers...</h3>
            <p className="mt-2 text-sm text-slate-600">Fetching the latest published provider list for the marketplace.</p>
          </section>
        ) : providers.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
            <h3 className="text-lg font-semibold text-slate-900">No providers found</h3>
            <p className="mt-2 text-sm text-slate-600">Try broadening your keyword or removing the service area filter.</p>
          </section>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {providers.map((provider, index) => (
              <article key={provider.id} className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_16px_36px_rgba(14,116,144,0.12)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className={`mb-4 inline-flex rounded-full px-3 py-1 text-xs font-medium ${index % 3 === 0 ? 'bg-sky-50 text-sky-700' : index % 3 === 1 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {provider.serviceArea || 'Service area TBD'}
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">{provider.displayName}</h3>
                    <p className="mt-2 text-sm text-slate-700">{provider.headline || 'No headline yet.'}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-100 bg-sky-50 text-base font-semibold text-sky-700">
                    {provider.displayName.slice(0, 1).toUpperCase()}
                  </div>
                </div>
                <p className="mt-4 min-h-[72px] text-sm leading-6 text-slate-600 line-clamp-3">{provider.bio || 'No provider bio yet.'}</p>
                <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Pricing</div>
                  <div className="mt-2">{provider.pricingNotes || 'Not specified yet.'}</div>
                </div>
                <Link to={`/providers/${provider.id}`} className="mt-6 inline-flex rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm font-medium text-sky-700 transition hover:bg-sky-50">
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
