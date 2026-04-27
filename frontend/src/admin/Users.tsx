import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

const Users = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers]     = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [editId, setEditId]   = useState<number | null>(null);
  const [editRole, setEditRole] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const handleEditRole = async (id: number) => {
    try {
      await api.patch(`/users/${id}/role`, { role: editRole });
      setUsers(users.map(u => u.id === id ? { ...u, role: editRole } : u));
      setEditId(null);
    } catch (err) {
      alert('Failed to update role');
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="admin-page">
      <h2 className="admin-page-title">Users Management</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
            <th style={{ textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {editId === user.id ? (
                  <select
                    value={editRole}
                    onChange={e => setEditRole(e.target.value)}
                    className="admin-input"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}
                  >
                    <option>Ranger</option>
                    <option>Administrator</option>
                  </select>
                ) : (
                  <span style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: user.role === 'Administrator' ? '#dbeafe' : '#dcfce7',
                    color: user.role === 'Administrator' ? '#2563eb' : '#16a34a',
                  }}>
                    {user.role}
                  </span>
                )}
              </td>
              <td>{new Date(user.created_at).toLocaleDateString()}</td>
              <td className="action-cell">
                {editId === user.id ? (
                  <>
                    <button className="edit-btn" onClick={() => handleEditRole(user.id)}>Save</button>
                    <button className="delete-btn" onClick={() => setEditId(null)} style={{ marginLeft: '0.5rem' }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="edit-btn" onClick={() => { setEditId(user.id); setEditRole(user.role); }}>
                      Edit Role
                    </button>
                    {/* Prevent deleting yourself */}
                    {user.email !== currentUser?.email && (
                      <button className="delete-btn" onClick={() => handleDelete(user.id)} style={{ marginLeft: '0.5rem' }}>
                        Delete
                      </button>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '2rem' }}>No users found.</p>
      )}
    </div>
  );
};

export default Users;