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
      <div className="rounded-[32px] border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
        <div className="inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-blue-200 ring-1 ring-blue-500/20">
          Profile Manager
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">Profile Editor</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Manage provider and client profile data used in the demo workflow, and keep the public-facing information clean and marketplace-ready.</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setRole('provider')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${role === 'provider' ? 'bg-blue-600 text-white' : 'border border-slate-700 bg-slate-950 text-slate-300 hover:border-blue-500'}`}
          >
            Provider
          </button>
          <button
            type="button"
            onClick={() => setRole('client')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${role === 'client' ? 'bg-blue-600 text-white' : 'border border-slate-700 bg-slate-950 text-slate-300 hover:border-blue-500'}`}
          >
            Client
          </button>
        </div>

        {role === 'provider' ? (
          <form onSubmit={saveProvider} className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-300">
              Display name
              <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500" value={providerForm.displayName} onChange={(e) => setProviderForm({ ...providerForm, displayName: e.target.value })} />
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              Headline
              <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500" value={providerForm.headline} onChange={(e) => setProviderForm({ ...providerForm, headline: e.target.value })} />
            </label>
            <label className="grid gap-2 text-sm text-slate-300 md:col-span-2">
              Bio
              <textarea className="min-h-32 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500" value={providerForm.bio} onChange={(e) => setProviderForm({ ...providerForm, bio: e.target.value })} />
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              Service area
              <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500" value={providerForm.serviceArea} onChange={(e) => setProviderForm({ ...providerForm, serviceArea: e.target.value })} />
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              Pricing notes
              <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500" value={providerForm.pricingNotes} onChange={(e) => setProviderForm({ ...providerForm, pricingNotes: e.target.value })} />
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300 md:col-span-2">
              <input type="checkbox" checked={providerForm.isPublished} onChange={(e) => setProviderForm({ ...providerForm, isPublished: e.target.checked })} />
              Published to marketplace
            </label>
            <button className="rounded-2xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2" type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Provider Profile'}
            </button>
          </form>
        ) : (
          <form onSubmit={saveClient} className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-300">
              Display name
              <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500" value={clientForm.displayName} onChange={(e) => setClientForm({ ...clientForm, displayName: e.target.value })} />
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              Company name
              <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500" value={clientForm.companyName} onChange={(e) => setClientForm({ ...clientForm, companyName: e.target.value })} />
            </label>
            <button className="rounded-2xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2" type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Client Profile'}
            </button>
          </form>
        )}

        {message && <p className="mt-4 text-sm text-blue-300">{message}</p>}
      </div>

      <aside className="rounded-[32px] border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
        <div className="inline-flex rounded-full bg-slate-800 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
          Editing Tips
        </div>
        <div className="mt-5 space-y-4 text-sm leading-6 text-slate-400">
          <p>Use concise headlines and service-area copy so marketplace cards stay readable.</p>
          <p>Keep pricing notes simple and scannable for faster provider comparison.</p>
          <p>Publish only when your profile, schedule, and portfolio are ready for client review.</p>
        </div>
      </aside>
    </section>
  );
}
