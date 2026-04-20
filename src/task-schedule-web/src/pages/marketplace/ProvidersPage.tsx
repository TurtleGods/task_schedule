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
        <div className="theme-kicker">
          Marketplace Filters
        </div>
        <h1 className="theme-text-primary mt-5 text-2xl font-semibold">Find a provider with confidence</h1>
        <p className="theme-text-secondary mt-2 text-sm leading-6">Search by skill, service style, or location. This view is designed to feel open, calm, and easy to scan before you commit to a booking.</p>
        <div className="mt-6 grid gap-4">
          <label className="theme-text-secondary grid gap-2 text-sm">
            Keyword
            <input className="theme-input rounded-2xl px-4 py-3 outline-none transition" placeholder="e.g. React, Azure, UI/UX" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          </label>
          <label className="theme-text-secondary grid gap-2 text-sm">
            Service area
            <input className="theme-input rounded-2xl px-4 py-3 outline-none transition" placeholder="e.g. Taipei, Remote" value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} />
          </label>
          <div className="flex flex-wrap gap-3 pt-2">
            <button className="theme-button-primary flex-1 disabled:cursor-not-allowed disabled:opacity-60" type="button" onClick={() => void loadProviders()} disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search providers'}
            </button>
            <button
              className="theme-button-secondary"
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
        {message && <p className="theme-status-danger mt-4 text-sm">{message}</p>}
      </section>

      <section className="theme-panel rounded-[28px] p-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="theme-pill uppercase tracking-[0.18em]">
              Published Providers
            </div>
            <h2 className="theme-text-primary mt-4 text-2xl font-semibold">Browse available specialists</h2>
            <p className="theme-text-secondary mt-2 text-sm leading-6">Open a provider profile to review their work, compare service notes, and find an available slot that fits your timing.</p>
          </div>
          <span className="theme-muted theme-text-secondary inline-flex w-fit rounded-full px-3 py-1 text-xs">{providers.length} results</span>
        </div>

        {isLoading ? (
          <section className="theme-muted rounded-3xl p-10 text-center">
            <h3 className="theme-text-primary text-lg font-semibold">Loading providers...</h3>
            <p className="theme-text-secondary mt-2 text-sm">Fetching the latest published provider list for the marketplace.</p>
          </section>
        ) : providers.length === 0 ? (
          <section className="theme-muted rounded-3xl border-dashed p-10 text-center">
            <h3 className="theme-text-primary text-lg font-semibold">No providers found</h3>
            <p className="theme-text-secondary mt-2 text-sm">Try broadening your keyword or removing the service area filter.</p>
          </section>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {providers.map((provider, index) => (
              <article key={provider.id} className="theme-card theme-card-hover rounded-[28px] p-6 transition hover:-translate-y-0.5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className={`mb-4 ${index % 2 === 0 ? 'theme-pill' : 'theme-accent-soft'} inline-flex rounded-full px-3 py-1 text-xs font-medium`}>
                      {provider.serviceArea || 'Service area TBD'}
                    </div>
                    <h3 className="theme-text-primary text-xl font-semibold">{provider.displayName}</h3>
                    <p className="theme-text-secondary mt-2 text-sm">{provider.headline || 'No headline yet.'}</p>
                  </div>
                  <div className="theme-muted theme-text-secondary flex h-12 w-12 items-center justify-center rounded-2xl text-base font-semibold">
                    {provider.displayName.slice(0, 1).toUpperCase()}
                  </div>
                </div>
                <p className="theme-text-secondary mt-4 min-h-[72px] text-sm leading-6 line-clamp-3">{provider.bio || 'No provider bio yet.'}</p>
                <div className="theme-muted theme-text-secondary mt-5 rounded-2xl px-4 py-3 text-sm">
                  <div className="theme-text-muted text-xs uppercase tracking-[0.18em]">Pricing</div>
                  <div className="mt-2">{provider.pricingNotes || 'Not specified yet.'}</div>
                </div>
                <Link to={`/providers/${provider.id}`} className="theme-button-secondary mt-6 inline-flex">
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
