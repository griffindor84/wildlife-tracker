import { Fragment, useEffect, useState } from 'react';
import api from '../api/axios';

interface Observation {
  id: number;
  user_id: number;
  wildlife_id: number | null;
  wildlife_name?: string;
  user_name?: string;
  location: string;
  notes: string;
  observed_at: string;
  created_at: string;
}

const AdminObservations = () => {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchObservations();
  }, []);

  const fetchObservations = async () => {
    try {
      const res = await api.get('/observations');
      setObservations(res.data);
    } catch {
      setError('Failed to load observations');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this observation?')) return;

    try {
      await api.delete(`/observations/${id}`);
      setObservations(observations.filter(obs => obs.id !== id));
    } catch {
      alert('Failed to delete observation');
    }
  };

  if (loading) return <div>Loading observations...</div>;

  return (
    <div>
      <h2 className="admin-page-title">Observations Management</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Species</th>
            <th>Submitted By</th>
            <th>Location</th>
            <th>Notes</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {observations.map((obs) => (
            <Fragment key={obs.id}>
              <tr
                onClick={() => setExpandedId(expandedId === obs.id ? null : obs.id)}
                style={{ cursor: 'pointer' }}
              >
                <td>{new Date(obs.observed_at).toLocaleDateString()}</td>
                <td><strong>{obs.wildlife_name || 'Unknown'}</strong></td>
                <td>{obs.user_name || `User #${obs.user_id}`}</td>
                <td>{obs.location}</td>
                <td style={{ maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {obs.notes || '-'}
                </td>
                <td onClick={e => e.stopPropagation()}>
                  <button className="delete-btn" onClick={() => handleDelete(obs.id)}>
                    Delete
                  </button>
                </td>
              </tr>
              {expandedId === obs.id && (
                <tr>
                  <td colSpan={6} style={{ background: '#f9fafb', padding: '1rem', fontSize: '0.9rem', color: '#374151' }}>
                    <strong>Notes:</strong>
                    <p style={{ margin: '0.5rem 0 0', whiteSpace: 'pre-wrap' }}>{obs.notes || 'No notes provided.'}</p>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>

      {observations.length === 0 && (
        <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '2rem' }}>
          No observations submitted yet.
        </p>
      )}
    </div>
  );
};

export default AdminObservations;
