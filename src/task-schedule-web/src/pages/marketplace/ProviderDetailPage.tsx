import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  const navigate = useNavigate();
  const { providerId } = useParams();
  const [provider, setProvider] = useState<ProviderDetail | null>(null);
  const [message, setMessage] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');

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
    return <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-blue-300 shadow-2xl shadow-black/20">{message}</section>;
  }

  if (!provider) {
    return <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-slate-300 shadow-2xl shadow-black/20">Loading provider detail...</section>;
  }

  const createBooking = async (availabilitySlotId: string) => {
    try {
      await api.post('/bookings', { availabilitySlotId, notes: '' });
      navigate('/bookings?created=1');
    } catch {
      setBookingMessage('Failed to create booking.');
    }
  };

  return (
    <section className="grid gap-6">
      <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300 ring-1 ring-blue-500/20">
              {provider.serviceArea || 'Service area TBD'}
            </div>
            <h1 className="text-3xl font-semibold text-white">{provider.displayName}</h1>
            <p className="mt-2 text-base text-slate-300">{provider.headline}</p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">{provider.bio}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-300">
            <div className="font-medium text-white">Pricing</div>
            <div className="mt-1">{provider.pricingNotes || 'Not specified yet.'}</div>
          </div>
        </div>
        {bookingMessage && <p className="mt-6 text-sm text-blue-300">{bookingMessage}</p>}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr),380px]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
          <h2 className="text-xl font-semibold text-white">Portfolio</h2>
          <p className="mt-1 text-sm text-slate-400">Browse previous work before creating a booking.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {provider.portfolioItems.map((item) => (
              <article key={item.id} className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
                <strong className="text-white">{item.title}</strong>
                <div className="mt-2 text-sm text-slate-400">{item.description}</div>
                <div className="mt-3 text-xs text-slate-500">Image: {item.imageUrl || 'N/A'}</div>
                <div className="mt-1 text-xs text-slate-500">External: {item.externalUrl || 'N/A'}</div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
          <h2 className="text-xl font-semibold text-white">Available Slots</h2>
          <p className="mt-1 text-sm text-slate-400">Select an open slot to create a booking request.</p>
          <div className="mt-6 grid gap-4">
            {provider.availabilitySlots.map((slot) => (
              <article key={slot.id} className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
                <div>
                  <strong className="text-white">{slot.startAt}</strong>
                  <div className="mt-1 text-sm text-slate-400">End: {slot.endAt}</div>
                  <div className="mt-1 text-sm text-slate-400">Time zone: {slot.timeZone}</div>
                </div>
                <button className="mt-4 w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500" type="button" onClick={() => createBooking(slot.id)}>
                  Book This Slot
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
