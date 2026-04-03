import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api';

type PortfolioItem = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  externalUrl?: string;
  sortOrder: number;
};

type AvailabilitySlot = {
  id: string;
  startAt: string;
  endAt: string;
  timeZone: string;
};

type ProviderDetail = {
  id: string;
  displayName: string;
  headline?: string;
  bio?: string;
  serviceArea?: string;
  pricingNotes?: string;
  portfolioItems: PortfolioItem[];
  availabilitySlots: AvailabilitySlot[];
};

export function ProviderDetailPage() {
  const { providerId } = useParams();
  const [provider, setProvider] = useState<ProviderDetail | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get(`/marketplace/providers/${providerId}`);
        setProvider(response.data);
      } catch {
        setMessage('Failed to load provider detail.');
      }
    };

    void load();
  }, [providerId]);

  if (message) {
    return <section className="card"><p className="form-message">{message}</p></section>;
  }

  if (!provider) {
    return <section className="card"><p>Loading provider detail...</p></section>;
  }

  return (
    <section className="card">
      <h1>{provider.displayName}</h1>
      <p>{provider.headline}</p>
      <p>{provider.bio}</p>
      <p>Service area: {provider.serviceArea}</p>
      <p>Pricing: {provider.pricingNotes}</p>

      <h2>Portfolio</h2>
      <div className="slot-list">
        {provider.portfolioItems.map((item) => (
          <article key={item.id} className="card">
            <strong>{item.title}</strong>
            <div>{item.description}</div>
            <div>{item.imageUrl}</div>
            <div>{item.externalUrl}</div>
          </article>
        ))}
      </div>

      <h2>Available Slots</h2>
      <div className="slot-list">
        {provider.availabilitySlots.map((slot) => (
          <article key={slot.id} className="card">
            <strong>{slot.startAt}</strong>
            <div>{slot.endAt}</div>
            <div>{slot.timeZone}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
