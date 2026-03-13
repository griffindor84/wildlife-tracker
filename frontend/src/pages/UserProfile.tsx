import React, { useState, useRef } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

interface UserData {
  name: string;
  email: string;
  role: string;
  about: string;
  avatarUrl: string;
}

export default function UserProfile() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserData>({
    name: '',
    email: '',
    role: 'Ranger',
    about: 'Tell us about yourself...',
    avatarUrl: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync Clerk user into formData once loaded
  React.useEffect(() => {
    if (isLoaded && user) {
      setFormData({
        name:      user.fullName || '',
        email:     user.primaryEmailAddress?.emailAddress || '',
        role:      (user.publicMetadata?.role as string) || 'Ranger',
        about:     (user.publicMetadata?.about as string) || 'Tell us about yourself...',
        avatarUrl: user.imageUrl || '',
      });
    }
  }, [isLoaded, user]);

  if (!isLoaded) return <div className="loading">Loading profile...</div>;
  if (!user)     return <div className="loading">No user found.</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024)    { alert('File size must be less than 5MB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => setFormData({ ...formData, avatarUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleAvatarClick = () => {
    if (isEditing) fileInputRef.current?.click();
  };

  const handleEditClick = () => setIsEditing(true);
  const handleCancel    = () => setIsEditing(false);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await user.update({ firstName: formData.name.split(' ')[0], lastName: formData.name.split(' ').slice(1).join(' ') });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handleLogout = () => {
    signOut(() => navigate('/login'));
  };

  const displayName  = formData.name  || user.fullName  || 'User';
  const displayEmail = formData.email || user.primaryEmailAddress?.emailAddress || '';

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Avatar */}
        <div className="profile-header">
          <div
            className={`avatar-container ${isEditing ? 'editable' : ''}`}
            onClick={handleAvatarClick}
          >
            {formData.avatarUrl ? (
              <img src={formData.avatarUrl} alt="Profile" className="profile-avatar" />
            ) : (
              <div className="avatar-placeholder">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            {isEditing && (
              <>
                <div className="edit-avatar-overlay">
                  <svg className="camera-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="change-photo-text">Change Photo</span>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*"
                  onChange={handleAvatarChange} style={{ display: 'none' }} />
              </>
            )}
          </div>

          <h2 className="profile-name">
            {isEditing ? (
              <input type="text" name="name" value={formData.name}
                onChange={handleChange} className="edit-input name-input"
                placeholder="Enter your name" required />
            ) : displayName}
          </h2>

          <p className="profile-role">
            {isEditing ? (
              <input type="text" name="role" value={formData.role}
                onChange={handleChange} className="edit-input role-input"
                placeholder="Enter your role" />
            ) : formData.role}
          </p>
        </div>

        {/* Details Form */}
        <form className="profile-details-form" onSubmit={handleSave}>
          <div className="detail-row">
            <label className="detail-label">Email Address</label>
            <p className="detail-text disabled-text">{displayEmail}</p>
          </div>

          <div className="detail-row">
            <label className="detail-label">About Me</label>
            {isEditing ? (
              <textarea name="about" value={formData.about} onChange={handleChange}
                className="edit-input edit-textarea" rows={4}
                placeholder="Tell us about yourself..." />
            ) : (
              <p className="detail-text bio-text">{formData.about}</p>
            )}
          </div>

          <div className="detail-row">
            <label className="detail-label">Member Since</label>
            <p className="detail-text disabled-text">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
            </p>
          </div>

          <div className="button-group">
            {isEditing ? (
              <>
                <button type="button" onClick={handleCancel} className="cancel-btn">Cancel</button>
                <button type="submit" className="save-btn">Save Changes</button>
              </>
            ) : (
              <>
                <button type="button" onClick={handleEditClick} className="edit-btn">Edit Profile</button>
                <button type="button" onClick={handleLogout} className="logout-btn">Logout</button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}