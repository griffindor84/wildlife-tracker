import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import './UserProfile.css';

interface UserData {
  name: string;
  email: string;
  role: string;
  about: string;
  avatarUrl: string;
}

export default function UserProfile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserData>({
    name:      user?.user_metadata?.full_name || '',
    email:     user?.email || '',
    role:      user?.user_metadata?.role || 'Ranger',
    about:     user?.user_metadata?.about || 'Tell us about yourself...',
    avatarUrl: user?.user_metadata?.avatar_url || '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return <div className="loading">Loading profile...</div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('File size must be less than 5MB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => setFormData({ ...formData, avatarUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await supabase.auth.updateUser({
        data: {
          full_name: formData.name,
          role:      formData.role,
          about:     formData.about,
        }
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div
            className={`avatar-container ${isEditing ? 'editable' : ''}`}
            onClick={() => isEditing && fileInputRef.current?.click()}
          >
            {formData.avatarUrl ? (
              <img src={formData.avatarUrl} alt="Profile" className="profile-avatar" />
            ) : (
              <div className="avatar-placeholder">
                {formData.name.charAt(0).toUpperCase()}
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
            ) : formData.name}
          </h2>

          <p className="profile-role">
            {isEditing ? (
              <input type="text" name="role" value={formData.role}
                onChange={handleChange} className="edit-input role-input"
                placeholder="Enter your role" />
            ) : formData.role}
          </p>
        </div>

        <form className="profile-details-form" onSubmit={handleSave}>
          <div className="detail-row">
            <label className="detail-label">Email Address</label>
            <p className="detail-text disabled-text">{formData.email}</p>
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
              {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
            </p>
          </div>

          <div className="button-group">
            {isEditing ? (
              <>
                <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
                <button type="submit" className="save-btn">Save Changes</button>
              </>
            ) : (
              <>
                <button type="button" onClick={() => setIsEditing(true)} className="edit-btn">Edit Profile</button>
                <button type="button" onClick={handleLogout} className="logout-btn">Logout</button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}