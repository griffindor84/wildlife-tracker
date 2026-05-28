import { useState, useEffect } from 'react';
import api from '../api/axios';

interface Wildlife {
  id: number;
  name: string;
  species: string;
  description: string;
  habitat: string;
  status: string;
  created_at: string;
}

const WildlifeAdmin = () => {
  const [wildlife, setWildlife]     = useState<Wildlife[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [showForm, setShowForm]     = useState(false);
  const [editItem, setEditItem]     = useState<Wildlife | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '', species: '', description: '', habitat: '', status: ''
  });

  useEffect(() => { fetchWildlife(); }, []);

  const fetchWildlife = async () => {
    try {
      const res = await api.get('/wildlife');
      setWildlife(res.data);
    } catch {
      setError('Failed to load wildlife');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Wildlife) => {
    setEditItem(item);
    setForm({ name: item.name, species: item.species, description: item.description, habitat: item.habitat, status: item.status });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this wildlife entry?')) return;
    try {
      await api.delete(`/wildlife/${id}`);
      setWildlife(wildlife.filter(w => w.id !== id));
    } catch {
      alert('Failed to delete');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editItem) {
        const res = await api.put(`/wildlife/${editItem.id}`, form);
        setWildlife(wildlife.map(w => w.id === editItem.id ? res.data : w));
      } else {
        const res = await api.post('/wildlife', form);
        setWildlife([...wildlife, res.data]);
      }
      setShowForm(false);
      setEditItem(null);
      setForm({ name: '', species: '', description: '', habitat: '', status: '' });
    } catch {
      alert('Failed to save wildlife entry');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditItem(null);
    setForm({ name: '', species: '', description: '', habitat: '', status: '' });
  };

  if (loading) return <div>Loading wildlife...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 className="admin-page-title">Wildlife Management</h2>
        <button className="edit-btn" onClick={() => { setEditItem(null); setShowForm(true); }}>
          + Add Species
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {showForm && (
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>{editItem ? 'Edit Species' : 'Add New Species'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '4px', fontSize: '0.875rem' }}>Name *</label>
              <input className="admin-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required placeholder="e.g. African Elephant" />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '4px', fontSize: '0.875rem' }}>Scientific Name</label>
              <input className="admin-input" value={form.species} onChange={e => setForm({...form, species: e.target.value})} placeholder="e.g. Loxodonta africana" />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '4px', fontSize: '0.875rem' }}>Habitat</label>
              <input className="admin-input" value={form.habitat} onChange={e => setForm({...form, habitat: e.target.value})} placeholder="e.g. Savanna" />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '4px', fontSize: '0.875rem' }}>Status</label>
              <select className="admin-input" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                <option value="">-- Select --</option>
                <option>Least Concern</option>
                <option>Near Threatened</option>
                <option>Vulnerable</option>
                <option>Endangered</option>
                <option>Critically Endangered</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '4px', fontSize: '0.875rem' }}>Description</label>
              <textarea className="admin-input" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Brief description..." rows={3} style={{ resize: 'vertical' }} />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" className="delete-btn" onClick={handleCancel}>Cancel</button>
              <button type="submit" className="edit-btn" disabled={submitting}>
                {submitting ? 'Saving...' : editItem ? 'Update' : 'Add Species'}
              </button>
            </div>
          </form>
        </div>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Scientific Name</th>
            <th>Habitat</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {wildlife.map((animal) => (
            <tr key={animal.id}>
              <td><strong>{animal.name}</strong></td>
              <td><em>{animal.species || '—'}</em></td>
              <td>{animal.habitat || '—'}</td>
              <td>
                <span style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  background: animal.status === 'Endangered' || animal.status === 'Critically Endangered' ? '#fee2e2' :
                              animal.status === 'Vulnerable' ? '#fef3c7' : '#dcfce7',
                  color: animal.status === 'Endangered' || animal.status === 'Critically Endangered' ? '#dc2626' :
                         animal.status === 'Vulnerable' ? '#d97706' : '#16a34a',
                }}>
                  {animal.status || 'Unknown'}
                </span>
              </td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(animal)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(animal.id)} style={{ marginLeft: '0.5rem' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {wildlife.length === 0 && (
        <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '2rem' }}>
          No wildlife entries yet. Add your first species!
        </p>
      )}
    </div>
  );
};

export default WildlifeAdmin;
