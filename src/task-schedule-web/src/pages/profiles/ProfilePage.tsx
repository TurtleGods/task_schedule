import { useState } from 'react';
import { api } from '../../services/api';

export function ProfilePage() {
  const [role, setRole] = useState<'provider' | 'client'>('provider');
  const [message, setMessage] = useState('');
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
    try {
      await api.put('/profiles/provider/me', providerForm);
      setMessage('Provider profile saved.');
    } catch {
      setMessage('Failed to save provider profile.');
    }
  };

  const saveClient = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await api.put('/profiles/client/me', clientForm);
      setMessage('Client profile saved.');
    } catch {
      setMessage('Failed to save client profile.');
    }
  };

  return (
    <section className="card auth-card">
      <h1>Profile Editor</h1>
      <div className="role-switcher">
        <button type="button" onClick={() => setRole('provider')}>Provider</button>
        <button type="button" onClick={() => setRole('client')}>Client</button>
      </div>

      {role === 'provider' ? (
        <form onSubmit={saveProvider} className="form-grid">
          <label>
            Display name
            <input value={providerForm.displayName} onChange={(e) => setProviderForm({ ...providerForm, displayName: e.target.value })} />
          </label>
          <label>
            Headline
            <input value={providerForm.headline} onChange={(e) => setProviderForm({ ...providerForm, headline: e.target.value })} />
          </label>
          <label>
            Bio
            <input value={providerForm.bio} onChange={(e) => setProviderForm({ ...providerForm, bio: e.target.value })} />
          </label>
          <label>
            Service area
            <input value={providerForm.serviceArea} onChange={(e) => setProviderForm({ ...providerForm, serviceArea: e.target.value })} />
          </label>
          <label>
            Pricing notes
            <input value={providerForm.pricingNotes} onChange={(e) => setProviderForm({ ...providerForm, pricingNotes: e.target.value })} />
          </label>
          <label>
            <input type="checkbox" checked={providerForm.isPublished} onChange={(e) => setProviderForm({ ...providerForm, isPublished: e.target.checked })} />
            Published
          </label>
          <button type="submit">Save Provider Profile</button>
        </form>
      ) : (
        <form onSubmit={saveClient} className="form-grid">
          <label>
            Display name
            <input value={clientForm.displayName} onChange={(e) => setClientForm({ ...clientForm, displayName: e.target.value })} />
          </label>
          <label>
            Company name
            <input value={clientForm.companyName} onChange={(e) => setClientForm({ ...clientForm, companyName: e.target.value })} />
          </label>
          <button type="submit">Save Client Profile</button>
        </form>
      )}

      {message && <p className="form-message">{message}</p>}
    </section>
  );
}
