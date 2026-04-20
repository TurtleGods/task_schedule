import { useState } from 'react';
import { api } from '../../services/api';

export function ProfilePage() {
  const [role, setRole] = useState<'provider' | 'client'>('provider');
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [providerForm, setProviderForm] = useState({
    displayName: '',
    headline: '',
    bio: '',
    serviceArea: '',
    pricingNotes: '',
    isPublished: false,
  });
  const [clientForm, setClientForm] = useState({
    displayName: '',
    companyName: '',
  });

  const saveProvider = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      await api.put('/profiles/provider/me', providerForm);
      setMessage('Provider profile saved.');
    } catch {
      setMessage('Failed to save provider profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const saveClient = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      await api.put('/profiles/client/me', clientForm);
      setMessage('Client profile saved.');
    } catch {
      setMessage('Failed to save client profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr),320px]">
      <div className="theme-panel rounded-[32px] p-8">
        <div className="theme-kicker">
          Profile Manager
        </div>
        <h1 className="theme-text-primary mt-4 text-3xl font-semibold tracking-tight">Profile Editor</h1>
        <p className="theme-text-secondary mt-3 max-w-2xl text-sm leading-7">Manage provider and client profile data used in the demo workflow, and keep the public-facing information clean and marketplace-ready.</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setRole('provider')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${role === 'provider' ? 'theme-button-tab-active' : 'theme-button-tab'}`}
          >
            Provider
          </button>
          <button
            type="button"
            onClick={() => setRole('client')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${role === 'client' ? 'theme-button-tab-active' : 'theme-button-tab'}`}
          >
            Client
          </button>
        </div>

        {role === 'provider' ? (
          <form onSubmit={saveProvider} className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="theme-text-secondary grid gap-2 text-sm">
              Display name
              <input className="theme-input rounded-2xl px-4 py-3 outline-none transition" value={providerForm.displayName} onChange={(e) => setProviderForm({ ...providerForm, displayName: e.target.value })} />
            </label>
            <label className="theme-text-secondary grid gap-2 text-sm">
              Headline
              <input className="theme-input rounded-2xl px-4 py-3 outline-none transition" value={providerForm.headline} onChange={(e) => setProviderForm({ ...providerForm, headline: e.target.value })} />
            </label>
            <label className="theme-text-secondary grid gap-2 text-sm md:col-span-2">
              Bio
              <textarea className="theme-input min-h-32 rounded-2xl px-4 py-3 outline-none transition" value={providerForm.bio} onChange={(e) => setProviderForm({ ...providerForm, bio: e.target.value })} />
            </label>
            <label className="theme-text-secondary grid gap-2 text-sm">
              Service area
              <input className="theme-input rounded-2xl px-4 py-3 outline-none transition" value={providerForm.serviceArea} onChange={(e) => setProviderForm({ ...providerForm, serviceArea: e.target.value })} />
            </label>
            <label className="theme-text-secondary grid gap-2 text-sm">
              Pricing notes
              <input className="theme-input rounded-2xl px-4 py-3 outline-none transition" value={providerForm.pricingNotes} onChange={(e) => setProviderForm({ ...providerForm, pricingNotes: e.target.value })} />
            </label>
            <label className="theme-muted theme-text-secondary flex items-center gap-3 rounded-2xl px-4 py-3 text-sm md:col-span-2">
              <input type="checkbox" checked={providerForm.isPublished} onChange={(e) => setProviderForm({ ...providerForm, isPublished: e.target.checked })} />
              Published to marketplace
            </label>
            <button className="theme-button-primary disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2" type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Provider Profile'}
            </button>
          </form>
        ) : (
          <form onSubmit={saveClient} className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="theme-text-secondary grid gap-2 text-sm">
              Display name
              <input className="theme-input rounded-2xl px-4 py-3 outline-none transition" value={clientForm.displayName} onChange={(e) => setClientForm({ ...clientForm, displayName: e.target.value })} />
            </label>
            <label className="theme-text-secondary grid gap-2 text-sm">
              Company name
              <input className="theme-input rounded-2xl px-4 py-3 outline-none transition" value={clientForm.companyName} onChange={(e) => setClientForm({ ...clientForm, companyName: e.target.value })} />
            </label>
            <button className="theme-button-primary disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2" type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Client Profile'}
            </button>
          </form>
        )}

        {message && <p className="theme-text-secondary mt-4 text-sm">{message}</p>}
      </div>

      <aside className="theme-hero rounded-[32px] p-6">
        <div className="theme-kicker">
          Editing Tips
        </div>
        <div className="theme-text-secondary mt-5 space-y-4 text-sm leading-6">
          <p>Use concise headlines and service-area copy so marketplace cards stay readable.</p>
          <p>Keep pricing notes simple and scannable for faster provider comparison.</p>
          <p>Publish only when your profile, schedule, and portfolio are ready for client review.</p>
        </div>
      </aside>
    </section>
  );
}
