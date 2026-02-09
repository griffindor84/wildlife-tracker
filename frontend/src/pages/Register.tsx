import React, { useState } from 'react';
import './Auth.css';
import type { User } from '../types';

interface RegisterProps {
  onNavigate: (page: 'login' | 'register' | 'profile') => void;
  onRegister: (user: User) => void;
}

export default function Register({ onNavigate, onRegister }: RegisterProps) {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Pass the registration data to parent component
    onRegister({
      name: formData.name,
      email: formData.email,
      joinDate: new Date().toLocaleDateString()
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Welcome to Wildlife Tracker</h1>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join us today</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input-field"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input-field"
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Create a password"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          <p className="footer-text">
            Already have an account?{' '}
            <span
              onClick={() => onNavigate('login')}
              className="auth-link"
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}