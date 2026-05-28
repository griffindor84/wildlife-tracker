import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import './Observations.css';

interface Observation {
  id: number;
  user_id: number;
  wildlife_id: number | null;
  wildlife_name?: string;
  location: string;
  notes: string;
  observed_at: string;
  created_at: string;
}

function Observations() {
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
    } catch (err) {
      setError('Failed to load observations');
      console.error(err);
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

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) return <div className="loading">Loading observations...</div>;

  return (
    <div className="observations-container">
      <header className="observations-header">
        <div className="header-content">
          <h1>My Field Reports</h1>
          <p>Personal log of wildlife sightings and alerts.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="stats-badge">Total Reports: {observations.length}</div>
          <Link to="/addobservation">
            <button className="add-btn">+ Add Observation</button>
          </Link>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="table-wrapper">
        <table className="observations-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Species</th>
              <th>Location</th>
              <th>Notes (Click to expand)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {observations.map((obs) => (
              <tr
                key={obs.id}
                onClick={() => toggleExpand(obs.id)}
                className={`obs-row ${expandedId === obs.id ? 'active' : ''}`}
              >
                <td className="date-cell">
                  {new Date(obs.observed_at).toLocaleDateString()}
                </td>
                <td className="species-cell">
                {obs.wildlife_name || 
                obs.notes?.match(/Species detected: (.+)/)?.[1] || 
                'Unknown'}
              </td>
                <td>{obs.location}</td>
                <td className={`notes-text ${expandedId === obs.id ? 'full' : 'truncated'}`}>
                  {obs.notes}
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={(e) => { e.stopPropagation(); handleDelete(obs.id); }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {observations.length === 0 && !loading && (
        <div className="empty-state">
          <p>You haven't added any observations yet.</p>
          <Link to="/addobservation">
            <button className="add-btn">Add your first observation</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Observations;
