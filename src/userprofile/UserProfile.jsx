
import './UserProfile.css';

export default function UserProfile({ user, onLogout }) {
  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="profile-name">{user.name}</h1>
          <p className="profile-email">{user.email}</p>
        </div>
        
        <div className="profile-info">
          <div className="info-row">
            <span className="info-label">Email</span>
            <span className="info-value">{user.email}</span>
          </div>
          
          <div className="info-row">
            <span className="info-label">Member Since</span>
            <span className="info-value">{user.joinDate}</span>
          </div>
          
          <div className="info-row">
            <span className="info-label">Account Status</span>
            <span className="info-value status-active">Active</span>
          </div>
        </div>
        
        <button onClick={onLogout} className="logout-button">
          Log Out
        </button>
      </div>
    </div>
  );
}