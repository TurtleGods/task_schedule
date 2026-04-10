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

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('zh-TW', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

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
        setMessage('');
      } catch {
        setMessage('Failed to load provider detail.');
      }
    };

    void load();
  }, [providerId]);

  const createBooking = async (availabilitySlotId: string) => {
    try {
      await api.post('/bookings', { availabilitySlotId, notes: '' });
      navigate('/bookings?created=1');
    } catch {
      setBookingMessage('Failed to create booking. Please make sure you are signed in as a client.');
    }
  };

  if (message) {
    return <section className="rounded-[28px] border border-sky-100 bg-white p-8 text-sky-700 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">{message}</section>;
  }

  if (!provider) {
    return <section className="rounded-[28px] border border-sky-100 bg-white p-8 text-slate-600 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">Loading provider detail...</section>;
  }

  return (
    <section className="grid gap-6">
      <section className="rounded-[32px] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-8 shadow-[0_20px_60px_rgba(14,116,144,0.12)] lg:p-10">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-4xl">
            <div className="mb-4 inline-flex rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-sky-700 shadow-sm">
              {provider.serviceArea || 'Service area TBD'}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold text-slate-900 lg:text-4xl">{provider.displayName}</h1>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">{provider.portfolioItems.length} portfolio items</span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">{provider.availabilitySlots.length} open slots</span>
            </div>
            <p className="mt-4 text-lg text-slate-700">{provider.headline || 'No headline yet.'}</p>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600">{provider.bio || 'No provider bio available yet.'}</p>
          </div>

          <div className="w-full max-w-sm rounded-3xl border border-sky-100 bg-white/90 p-5 text-sm text-slate-600 shadow-[0_16px_40px_rgba(14,116,144,0.12)]">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Pricing</div>
            <div className="mt-3 text-base font-medium text-slate-900">{provider.pricingNotes || 'Not specified yet.'}</div>
            <p className="mt-3 text-sm leading-6 text-slate-600">Sign in as a client to reserve an available slot directly from this page.</p>
          </div>
        </div>
        {bookingMessage && <p className="mt-6 text-sm text-sky-700">{bookingMessage}</p>}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr),380px]">
        <div className="grid gap-6">
          <section className="rounded-[28px] border border-sky-100 bg-white p-8 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <div className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-sky-700">
                  Portfolio
                </div>
                <h2 className="mt-4 text-2xl font-semibold text-slate-900">Selected work and project highlights</h2>
                <p className="mt-2 text-sm text-slate-600">Review previous projects before creating a booking request.</p>
              </div>
            </div>

            {provider.portfolioItems.length === 0 ? (
              <section className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <h3 className="text-lg font-semibold text-slate-900">No portfolio items yet</h3>
                <p className="mt-2 text-sm text-slate-600">This provider has not published portfolio content yet.</p>
              </section>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {provider.portfolioItems.map((item) => (
                  <article key={item.id} className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_16px_36px_rgba(14,116,144,0.12)]">
                    <div className="flex items-start justify-between gap-4">
                      <strong className="text-lg text-slate-900">{item.title}</strong>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">Item</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.description || 'No portfolio description yet.'}</p>
                    <div className="mt-5 grid gap-2 text-xs text-slate-500">
                      <div>Preview: {item.imageUrl || 'N/A'}</div>
                      <div>External link: {item.externalUrl || 'N/A'}</div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="rounded-[28px] border border-sky-100 bg-white p-8 shadow-[0_16px_40px_rgba(15,23,42,0.06)] xl:sticky xl:top-24 xl:h-fit">
          <div className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-sky-700">
            Availability
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">Available booking slots</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Choose an open slot and create a booking request directly from this page.</p>

          <div className="mt-6 grid gap-4">
            {provider.availabilitySlots.length === 0 ? (
              <section className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <h3 className="text-lg font-semibold text-slate-900">No open slots</h3>
                <p className="mt-2 text-sm text-slate-600">This provider does not have any future availability published right now.</p>
              </section>
            ) : (
              provider.availabilitySlots.map((slot) => (
                <article key={slot.id} className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
                  <div className="text-base font-semibold text-slate-900">{formatDateTime(slot.startAt)}</div>
                  <div className="mt-1 text-sm text-slate-600">End: {formatDateTime(slot.endAt)}</div>
                  <div className="mt-1 text-sm text-slate-500">Time zone: {slot.timeZone}</div>
                  <button className="mt-5 w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-sky-500" type="button" onClick={() => createBooking(slot.id)}>
                    Book this slot
                  </button>
                </article>
              ))
            )}
          </div>
        </aside>
      </section>
    </section>
  );
}
