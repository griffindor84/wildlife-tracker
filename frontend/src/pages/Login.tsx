import React, { useState } from 'react';
import './Auth.css';
import type { User } from '../types';

interface LoginProps {
  onNavigate: (page: 'login' | 'register' | 'profile') => void;
  onLogin: (user: User) => void;
}

export default function Login({ onNavigate, onLogin }: LoginProps) {
  const [formData, setFormData] = useState<{ email: string; password: string }>({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Pass the login data to parent component
    onLogin({
      name: 'Demo User',
      email: formData.email,
      joinDate: new Date().toLocaleDateString()
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Welcome to Wildlife Tracker</h1>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
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
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          <p className="footer-text">
            Don't have an account?{' '}
            <span
              onClick={() => onNavigate('register')}
              className="auth-link"
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}