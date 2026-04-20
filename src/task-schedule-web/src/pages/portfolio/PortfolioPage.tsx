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
      <section className="theme-panel rounded-[32px] p-8">
        <div className="theme-kicker">
          Showcase Manager
        </div>
        <h1 className="theme-text-primary mt-4 text-3xl font-semibold tracking-tight">Portfolio Manager</h1>
        <p className="theme-text-secondary mt-3 text-sm leading-7">Showcase previous work, portfolio links, and proof points that help clients trust your profile faster.</p>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label className="theme-text-secondary grid gap-2 text-sm">
            Title
            <input className="theme-input rounded-2xl px-4 py-3 outline-none transition" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          <label className="theme-text-secondary grid gap-2 text-sm">
            Description
            <textarea className="theme-input min-h-24 rounded-2xl px-4 py-3 outline-none transition" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <label className="theme-text-secondary grid gap-2 text-sm">
            Image URL
            <input className="theme-input rounded-2xl px-4 py-3 outline-none transition" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          </label>
          <label className="theme-text-secondary grid gap-2 text-sm">
            External URL
            <input className="theme-input rounded-2xl px-4 py-3 outline-none transition" value={form.externalUrl} onChange={(e) => setForm({ ...form, externalUrl: e.target.value })} />
          </label>
          <label className="theme-text-secondary grid gap-2 text-sm">
            Sort order
            <input className="theme-input rounded-2xl px-4 py-3 outline-none transition" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
          </label>
          <button className="theme-button-primary disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Adding...' : 'Add Portfolio Item'}</button>
        </form>
        {message && <p className="theme-text-secondary mt-4 text-sm">{message}</p>}
      </section>

      <section className="theme-panel rounded-[32px] p-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="theme-accent-soft inline-flex rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.18em]">
              Published Portfolio
            </div>
            <h2 className="theme-text-primary mt-4 text-xl font-semibold">Portfolio Items</h2>
            <p className="theme-text-secondary mt-1 text-sm">Organize the work you want clients to see first and keep the showcase concise.</p>
          </div>
          <span className="theme-muted theme-text-secondary inline-flex w-fit rounded-full px-3 py-1 text-xs">{items.length} items</span>
        </div>

        {isLoading ? (
          <section className="theme-muted rounded-3xl p-10 text-center">
            <h3 className="theme-text-primary text-xl font-semibold">Loading portfolio...</h3>
            <p className="theme-text-secondary mt-2 text-sm">Fetching your latest showcase items and links.</p>
          </section>
        ) : items.length === 0 ? (
          <section className="theme-muted rounded-3xl border-dashed p-10 text-center">
            <h3 className="theme-text-primary text-xl font-semibold">No portfolio items yet</h3>
            <p className="theme-text-secondary mt-2 text-sm">Add examples, links, or project summaries so clients can evaluate your work before booking.</p>
          </section>
        ) : (
          <div className="grid gap-4">
            {items.map((item) => (
              <article key={item.id} className="theme-card flex flex-col justify-between gap-4 rounded-[28px] p-5 md:flex-row md:items-start">
                <div className="space-y-2">
                  <strong className="theme-text-primary">{item.title}</strong>
                  <div className="theme-text-secondary text-sm leading-6">{item.description || 'No description provided.'}</div>
                  <div className="theme-text-muted text-sm">Image: {item.imageUrl || 'N/A'}</div>
                  <div className="theme-text-muted text-sm">External: {item.externalUrl || 'N/A'}</div>
                  <div className="theme-pill">Sort: {item.sortOrder}</div>
                </div>
                <button className="theme-button-danger disabled:cursor-not-allowed disabled:opacity-60" type="button" onClick={() => handleDelete(item.id)} disabled={deletingItemId === item.id}>
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
