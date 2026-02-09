import { useState } from 'react';
import './UserProfile.css';

export default function UserProfile() {
  // State to toggle between View and Edit modes
  const [isEditing, setIsEditing] = useState(false);

  // State to hold user data
  const [user, setUser] = useState({
    name: 'Alex Ranger',
    email: 'alex.ranger@wildlifetracker.com',
    role: 'Senior Field Researcher',
    memberSince: 'March 15, 2023',
    about: 'Passionate about wildlife conservation and tracking migration patterns in the Serengeti. I love photography and data analysis.',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80'
  });

  // Temporary state for the form (so we can cancel edits if needed)
  const [formData, setFormData] = useState(user);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Enable Edit Mode
  const handleEditClick = () => {
    setFormData(user); // Reset form data to current user data
    setIsEditing(true);
  };

  // Save Changes
  const handleSave = (e) => {
    e.preventDefault();
    setUser(formData); // Update the actual user state
    setIsEditing(false); // Exit edit mode
  };

  // Cancel Changes
  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        
        {/* Profile Header (Avatar & Title) */}
        <div className="profile-header">
          <div className="avatar-container">
            <img src={formData.avatarUrl} alt="Profile" className="profile-avatar" />
            {isEditing && (
              <div className="edit-avatar-overlay">
                <span>Change Photo</span>
                 {/* In a real app, you'd put a file input here */}
              </div>
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
              />
            ) : (
              user.name
            )}
          </h2>
          <p className="profile-role">{user.role}</p>
        </div>

        {/* Profile Details Section */}
        <form className="profile-details-form" onSubmit={handleSave}>
          
          <div className="detail-row">
            <label>Email Address</label>
            {isEditing ? (
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                className="edit-input"
              />
            ) : (
              <p className="detail-text">{user.email}</p>
            )}
          </div>

          <div className="detail-row">
            <label>About User</label>
            {isEditing ? (
              <textarea 
                name="about" 
                value={formData.about} 
                onChange={handleChange} 
                className="edit-input edit-textarea"
                rows="4"
              />
            ) : (
              <p className="detail-text bio-text">{user.about}</p>
            )}
          </div>

          <div className="detail-row">
            <label>Member Since</label>
            {/* Usually dates aren't editable, so we keep this text-only */}
            <p className="detail-text disabled-text">{user.memberSince}</p>
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
              <button type="button" onClick={handleEditClick} className="edit-btn">
                Edit Profile
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}