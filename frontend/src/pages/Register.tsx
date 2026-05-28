import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await signUp(name, email, password);
      navigate('/observations', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create account');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-bg" />
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <img src="bg1.jpeg" alt="Wildlife Tracker" className="auth-logo-img"
              onError={(e) => (e.currentTarget.style.display = 'none')} />
          </div>
          <h1 className="auth-title">Welcome to Wildlife Tracker</h1>
          <h2 className="auth-subtitle">Create your account</h2>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="input-field" placeholder="John Doe" required />
          </div>

          <div className="input-group">
            <label className="input-label">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="input-field" placeholder="your@email.com" required />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="input-field" placeholder="Create a password" required />
          </div>

          <div className="input-group">
            <label className="input-label">Confirm Password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
              className="input-field" placeholder="Confirm your password" required />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p className="footer-text">
            Already have an account?{' '}
            <span onClick={() => navigate('/login')} className="auth-link">Sign in</span>
          </p>
        </div>
      </div>
    </div>
  );
}
