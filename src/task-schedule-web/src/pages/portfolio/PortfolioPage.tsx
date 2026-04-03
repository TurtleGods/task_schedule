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
  const [form, setForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    externalUrl: '',
    sortOrder: 0,
  });

  const loadItems = async () => {
    try {
      const response = await api.get('/portfolio/me');
      setItems(response.data ?? []);
    } catch {
      setMessage('Failed to load portfolio items.');
    }
  };

  useEffect(() => {
    void loadItems();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await api.post('/portfolio/me', form);
      setMessage('Portfolio item created.');
      setForm({ title: '', description: '', imageUrl: '', externalUrl: '', sortOrder: 0 });
      await loadItems();
    } catch {
      setMessage('Failed to create portfolio item.');
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await api.delete(`/portfolio/me/${itemId}`);
      setMessage('Portfolio item deleted.');
      await loadItems();
    } catch {
      setMessage('Failed to delete portfolio item.');
    }
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[380px,minmax(0,1fr)]">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
        <h1 className="text-2xl font-semibold text-white">Portfolio Manager</h1>
        <p className="mt-2 text-sm text-slate-400">Showcase previous work and external links for your provider profile.</p>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm text-slate-300">
            Title
            <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          <label className="grid gap-2 text-sm text-slate-300">
            Description
            <textarea className="min-h-24 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <label className="grid gap-2 text-sm text-slate-300">
            Image URL
            <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          </label>
          <label className="grid gap-2 text-sm text-slate-300">
            External URL
            <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500" value={form.externalUrl} onChange={(e) => setForm({ ...form, externalUrl: e.target.value })} />
          </label>
          <label className="grid gap-2 text-sm text-slate-300">
            Sort order
            <input className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
          </label>
          <button className="rounded-2xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-500" type="submit">Add Portfolio Item</button>
        </form>
        {message && <p className="mt-4 text-sm text-blue-300">{message}</p>}
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/20">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Portfolio Items</h2>
            <p className="mt-1 text-sm text-slate-400">Organize the work you want clients to see first.</p>
          </div>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">{items.length} items</span>
        </div>
        <div className="grid gap-4">
          {items.map((item) => (
            <article key={item.id} className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-950/70 p-5 md:flex-row md:items-start">
              <div className="space-y-2">
                <strong className="text-white">{item.title}</strong>
                <div className="text-sm text-slate-400">{item.description}</div>
                <div className="text-sm text-slate-500">Image: {item.imageUrl || 'N/A'}</div>
                <div className="text-sm text-slate-500">External: {item.externalUrl || 'N/A'}</div>
                <div className="inline-flex rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">Sort: {item.sortOrder}</div>
              </div>
              <button className="rounded-2xl border border-rose-500/40 px-4 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-500/10" type="button" onClick={() => handleDelete(item.id)}>
                Delete
              </button>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
