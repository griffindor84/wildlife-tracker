import { useState, useEffect } from 'react';
import api from '../api/axios';

interface Report {
  id: number;
  user_id: number;
  user_name?: string;
  title: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved';
  created_at: string;
}

const AdminReports = () => {
  const [reports, setReports]   = useState<Report[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    try {
      const res = await api.get('/reports');
      setReports(res.data);
    } catch {
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await api.patch(`/reports/${id}/status`, { status });
      setReports(reports.map(r => r.id === id ? { ...r, status: status as Report['status'] } : r));
    } catch {
      alert('Failed to update status');
    }
  };

  const statusColor = (status: string) => {
    if (status === 'pending')  return { background: '#fef3c7', color: '#d97706' };
    if (status === 'reviewed') return { background: '#dbeafe', color: '#2563eb' };
    if (status === 'resolved') return { background: '#dcfce7', color: '#16a34a' };
    return {};
  };

  if (loading) return <div>Loading reports...</div>;

  return (
    <div>
      <h2 className="admin-page-title">Reports Management</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Submitted By</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <>
              <tr key={report.id} onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                style={{ cursor: 'pointer' }}>
                <td><strong>{report.title}</strong></td>
                <td>{report.user_name || `User #${report.user_id}`}</td>
                <td>
                  <span style={{ padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, ...statusColor(report.status) }}>
                    {report.status}
                  </span>
                </td>
                <td>{new Date(report.created_at).toLocaleDateString()}</td>
                <td onClick={e => e.stopPropagation()}>
                  <select
                    value={report.status}
                    onChange={e => handleStatusChange(report.id, e.target.value)}
                    className="admin-input"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </td>
              </tr>
              {expandedId === report.id && (
                <tr key={`${report.id}-expanded`}>
                  <td colSpan={5} style={{ background: '#f9fafb', padding: '1rem', fontSize: '0.9rem', color: '#374151' }}>
                    <strong>Description:</strong>
                    <p style={{ margin: '0.5rem 0 0', whiteSpace: 'pre-wrap' }}>{report.description}</p>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>

      {reports.length === 0 && (
        <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '2rem' }}>No reports submitted yet.</p>
      )}
    </div>
  );
};

export default AdminReports;
