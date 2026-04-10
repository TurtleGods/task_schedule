import { useEffect, useState } from 'react';
import { api } from '../../services/api';

type PortfolioItem = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  externalUrl?: string;
  sortOrder: number;
};

export function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    externalUrl: '',
    sortOrder: 0,
  });

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/portfolio/me');
      setItems(response.data ?? []);
    } catch {
      setMessage('Failed to load portfolio items. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/portfolio/me', form);
      setMessage('Portfolio item created.');
      setForm({ title: '', description: '', imageUrl: '', externalUrl: '', sortOrder: 0 });
      await loadItems();
    } catch {
      setMessage('Failed to create portfolio item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    setDeletingItemId(itemId);
    try {
      await api.delete(`/portfolio/me/${itemId}`);
      setMessage('Portfolio item deleted.');
      await loadItems();
    } catch {
      setMessage('Failed to delete portfolio item. Please try again.');
    } finally {
      setDeletingItemId(null);
    }
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[400px,minmax(0,1fr)]">
      <section className="rounded-[32px] border border-sky-100 bg-white p-8 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <div className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-sky-700">
          Showcase Manager
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">Portfolio Manager</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">Showcase previous work, portfolio links, and proof points that help clients trust your profile faster.</p>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm text-slate-700">
            Title
            <input className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          <label className="grid gap-2 text-sm text-slate-700">
            Description
            <textarea className="min-h-24 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <label className="grid gap-2 text-sm text-slate-700">
            Image URL
            <input className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          </label>
          <label className="grid gap-2 text-sm text-slate-700">
            External URL
            <input className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white" value={form.externalUrl} onChange={(e) => setForm({ ...form, externalUrl: e.target.value })} />
          </label>
          <label className="grid gap-2 text-sm text-slate-700">
            Sort order
            <input className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:bg-white" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
          </label>
          <button className="rounded-2xl bg-sky-600 px-4 py-3 font-medium text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Adding...' : 'Add Portfolio Item'}</button>
        </form>
        {message && <p className="mt-4 text-sm text-sky-700">{message}</p>}
      </section>

      <section className="rounded-[32px] border border-sky-100 bg-white p-8 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-sky-700">
              Published Portfolio
            </div>
            <h2 className="mt-4 text-xl font-semibold text-slate-900">Portfolio Items</h2>
            <p className="mt-1 text-sm text-slate-600">Organize the work you want clients to see first and keep the showcase concise.</p>
          </div>
          <span className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">{items.length} items</span>
        </div>

        {isLoading ? (
          <section className="rounded-3xl border border-slate-100 bg-sky-50/60 p-10 text-center">
            <h3 className="text-xl font-semibold text-slate-900">Loading portfolio...</h3>
            <p className="mt-2 text-sm text-slate-600">Fetching your latest showcase items and links.</p>
          </section>
        ) : items.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
            <h3 className="text-xl font-semibold text-slate-900">No portfolio items yet</h3>
            <p className="mt-2 text-sm text-slate-600">Add examples, links, or project summaries so clients can evaluate your work before booking.</p>
          </section>
        ) : (
          <div className="grid gap-4">
            {items.map((item) => (
              <article key={item.id} className="flex flex-col justify-between gap-4 rounded-[28px] border border-slate-100 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] md:flex-row md:items-start">
                <div className="space-y-2">
                  <strong className="text-slate-900">{item.title}</strong>
                  <div className="text-sm leading-6 text-slate-600">{item.description || 'No description provided.'}</div>
                  <div className="text-sm text-slate-500">Image: {item.imageUrl || 'N/A'}</div>
                  <div className="text-sm text-slate-500">External: {item.externalUrl || 'N/A'}</div>
                  <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">Sort: {item.sortOrder}</div>
                </div>
                <button className="rounded-2xl border border-rose-200 bg-white px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60" type="button" onClick={() => handleDelete(item.id)} disabled={deletingItemId === item.id}>
                  {deletingItemId === item.id ? 'Deleting...' : 'Delete'}
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
