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
      <div className="rounded-[32px] border border-sky-100 bg-white p-8 shadow-[0_16px_40px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
        <div className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-sky-700 dark:border-slate-700 dark:bg-slate-800 dark:text-sky-300">
          Profile Manager
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Profile Editor</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">Manage provider and client profile data used in the demo workflow, and keep the public-facing information clean and marketplace-ready.</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setRole('provider')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${role === 'provider' ? 'bg-sky-600 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'}`}
          >
            Provider
          </button>
          <button
            type="button"
            onClick={() => setRole('client')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${role === 'client' ? 'bg-sky-600 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'}`}
          >
            Client
          </button>
        </div>

        {role === 'provider' ? (
          <form onSubmit={saveProvider} className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-700">
              Display name
              <input className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-900" value={providerForm.displayName} onChange={(e) => setProviderForm({ ...providerForm, displayName: e.target.value })} />
            </label>
            <label className="grid gap-2 text-sm text-slate-700">
              Headline
              <input className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-900" value={providerForm.headline} onChange={(e) => setProviderForm({ ...providerForm, headline: e.target.value })} />
            </label>
            <label className="grid gap-2 text-sm text-slate-700 md:col-span-2">
              Bio
              <textarea className="min-h-32 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-900" value={providerForm.bio} onChange={(e) => setProviderForm({ ...providerForm, bio: e.target.value })} />
            </label>
            <label className="grid gap-2 text-sm text-slate-700">
              Service area
              <input className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-900" value={providerForm.serviceArea} onChange={(e) => setProviderForm({ ...providerForm, serviceArea: e.target.value })} />
            </label>
            <label className="grid gap-2 text-sm text-slate-700">
              Pricing notes
              <input className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-900" value={providerForm.pricingNotes} onChange={(e) => setProviderForm({ ...providerForm, pricingNotes: e.target.value })} />
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 md:col-span-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <input type="checkbox" checked={providerForm.isPublished} onChange={(e) => setProviderForm({ ...providerForm, isPublished: e.target.checked })} />
              Published to marketplace
            </label>
            <button className="rounded-2xl bg-sky-600 px-4 py-3 font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2" type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Provider Profile'}
            </button>
          </form>
        ) : (
          <form onSubmit={saveClient} className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-700">
              Display name
              <input className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-900" value={clientForm.displayName} onChange={(e) => setClientForm({ ...clientForm, displayName: e.target.value })} />
            </label>
            <label className="grid gap-2 text-sm text-slate-700">
              Company name
              <input className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-900" value={clientForm.companyName} onChange={(e) => setClientForm({ ...clientForm, companyName: e.target.value })} />
            </label>
            <button className="rounded-2xl bg-sky-600 px-4 py-3 font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2" type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Client Profile'}
            </button>
          </form>
        )}

        {message && <p className="mt-4 text-sm text-sky-700 dark:text-sky-300">{message}</p>}
      </div>

      <aside className="rounded-[32px] border border-sky-100 bg-gradient-to-br from-white to-sky-50 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:from-slate-900 dark:to-slate-800 dark:shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
        <div className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-600 shadow-sm dark:bg-slate-800 dark:text-slate-300">
          Editing Tips
        </div>
        <div className="mt-5 space-y-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
          <p>Use concise headlines and service-area copy so marketplace cards stay readable.</p>
          <p>Keep pricing notes simple and scannable for faster provider comparison.</p>
          <p>Publish only when your profile, schedule, and portfolio are ready for client review.</p>
        </div>
      </aside>
    </section>
  );
}
