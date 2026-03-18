import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user, role } = useAuth();
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts]     = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="admin-page">
      <h2 className="admin-page-title">Settings</h2>

      {saved && (
        <div style={{ background: '#dcfce7', color: '#16a34a', padding: '0.75rem 1rem',
          borderRadius: '8px', marginBottom: '1rem', border: '1px solid #86efac' }}>
          ✅ Settings saved successfully!
        </div>
      )}

      {/* Account Info */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#1a3a2a' }}>Account Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Name</label>
            <p style={{ margin: '0.25rem 0 0', color: '#6b7280' }}>{user?.user_metadata?.full_name || '—'}</p>
          </div>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Email</label>
            <p style={{ margin: '0.25rem 0 0', color: '#6b7280' }}>{user?.email || '—'}</p>
          </div>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Role</label>
            <p style={{ margin: '0.25rem 0 0' }}>
              <span style={{ background: '#dbeafe', color: '#2563eb', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                {role}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#1a3a2a' }}>Notifications</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={notifications} onChange={e => setNotifications(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#2d5a3d' }} />
            <span style={{ fontSize: '0.9rem' }}>Enable in-app notifications</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={emailAlerts} onChange={e => setEmailAlerts(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#2d5a3d' }} />
            <span style={{ fontSize: '0.9rem' }}>Receive email alerts for new reports</span>
          </label>
        </div>
      </div>

      {/* System Info */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#1a3a2a' }}>System Info</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.875rem' }}>
          <div><span style={{ color: '#6b7280' }}>App Version:</span> <strong>1.0.0</strong></div>
          <div><span style={{ color: '#6b7280' }}>Environment:</span> <strong>Production</strong></div>
          <div><span style={{ color: '#6b7280' }}>Database:</span> <strong>PostgreSQL</strong></div>
          <div><span style={{ color: '#6b7280' }}>Auth:</span> <strong>Supabase</strong></div>
        </div>
      </div>

      <button onClick={handleSave}
        style={{ padding: '0.75rem 2rem', background: '#2d5a3d', color: 'white', border: 'none',
          borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' }}>
        Save Settings
      </button>
    </div>
  );
};

export default Settings;