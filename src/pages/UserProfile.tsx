import React, { useState, useRef } from 'react';
import './UserProfile.css';

interface UserProfileProps {
  user: UserData;
  onLogout: () => void;
}

interface UserData {
  name: string;
  email: string;
  joinDate: string;
  role?: string;
  about?: string;
  avatarUrl?: string;
}

export default function UserProfile({ user: propUser, onLogout }: UserProfileProps) {
  // State to toggle between View and Edit modes
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // State to hold user data with defaults
  const [user, setUser] = useState<UserData>({
    ...propUser,
    role: propUser.role || 'Team Member',
    about: propUser.about || 'Tell us about yourself...',
    avatarUrl: propUser.avatarUrl || ''
  });

  // Temporary state for the form (so we can cancel edits if needed)
  const [formData, setFormData] = useState<UserData>(user);

  // Reference to the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle profile picture upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Enable Edit Mode
  const handleEditClick = () => {
    setFormData(user); // Reset form data to current user data
    setIsEditing(true);
  };

  // Save Changes
  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUser(formData); // Update the actual user state
    setIsEditing(false); // Exit edit mode
    // In a real app, you would send this data to your backend API here
    console.log('Saved user data:', formData);
  };

  // Cancel Changes
  const handleCancel = () => {
    setFormData(user); // Reset form data to original user data
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Profile Header (Avatar & Title) */}
        <div className="profile-header">
          <div 
            className={`avatar-container ${isEditing ? 'editable' : ''}`}
            onClick={handleAvatarClick}
          >
            {formData.avatarUrl ? (
              <img src={formData.avatarUrl} alt="Profile" className="profile-avatar" />
            ) : (
              <div className="avatar-placeholder">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            {isEditing && (
              <>
                <div className="edit-avatar-overlay">
                  <svg 
                    className="camera-icon" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" 
                    />
                  </svg>
                  <span className="change-photo-text">Change Photo</span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />
              </>
            )}
          </div>
          <h2 className="profile-name">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="edit-input name-input"
                placeholder="Enter your name"
                required
              />
            ) : (
              user.name
            )}
          </h2>
          <p className="profile-role">
            {isEditing ? (
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="edit-input role-input"
                placeholder="Enter your role"
              />
            ) : (
              user.role
            )}
          </p>
        </div>

        <form className="profile-details-form" onSubmit={handleSave}>
          <div className="detail-row">
            <label className="detail-label">Email Address</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="edit-input"
                placeholder="Enter your email"
                required
              />
            ) : (
              <p className="detail-text">{user.email}</p>
            )}
          </div>

          <div className="detail-row">
            <label className="detail-label">About Me</label>
            {isEditing ? (
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                className="edit-input edit-textarea"
                rows={4}
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="detail-text bio-text">{user.about}</p>
            )}
          </div>

          <div className="detail-row">
            <label className="detail-label">Member Since</label>
            <p className="detail-text disabled-text">{user.joinDate}</p>
          </div>

          {/* Action Buttons */}
          <div className="button-group">
            {isEditing ? (
              <>
                <button type="button" onClick={handleCancel} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={handleEditClick} className="edit-btn">
                  Edit profile
                </button>
                <button type="button" onClick={onLogout} className="logout-btn">
                  Logout
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}