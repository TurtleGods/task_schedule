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
    <section className="card">
      <h1>Providers Marketplace</h1>
      <div className="form-grid">
        <label>
          Keyword
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        </label>
        <label>
          Service area
          <input value={serviceArea} onChange={(e) => setServiceArea(e.target.value)} />
        </label>
        <button type="button" onClick={() => void loadProviders()}>
          Search
        </button>
      </div>

      {message && <p className="form-message">{message}</p>}

      <div className="slot-list">
        {providers.map((provider) => (
          <article key={provider.id} className="card slot-card">
            <div>
              <strong>{provider.displayName}</strong>
              <div>{provider.headline}</div>
              <div>{provider.serviceArea}</div>
              <div>{provider.pricingNotes}</div>
            </div>
            <Link to={`/providers/${provider.id}`}>View</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
