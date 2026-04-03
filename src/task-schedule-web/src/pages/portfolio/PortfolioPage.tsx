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
    <section className="card">
      <h1>Portfolio Manager</h1>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Title
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </label>
        <label>
          Description
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </label>
        <label>
          Image URL
          <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
        </label>
        <label>
          External URL
          <input value={form.externalUrl} onChange={(e) => setForm({ ...form, externalUrl: e.target.value })} />
        </label>
        <label>
          Sort order
          <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} />
        </label>
        <button type="submit">Add Portfolio Item</button>
      </form>

      {message && <p className="form-message">{message}</p>}

      <div className="slot-list">
        {items.map((item) => (
          <article key={item.id} className="card slot-card">
            <div>
              <strong>{item.title}</strong>
              <div>{item.description}</div>
              <div>{item.imageUrl}</div>
              <div>{item.externalUrl}</div>
              <div>Sort: {item.sortOrder}</div>
            </div>
            <button type="button" onClick={() => handleDelete(item.id)}>
              Delete
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
