import { SignIn, useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

export default function Login() {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Login useEffect:', isLoaded, isSignedIn);
    if (isLoaded && isSignedIn) {
      navigate('/observations', { replace: true });
    }
  }, [isSignedIn, isLoaded]);

  return (
    <div className="auth-container">
      <div className="auth-bg" />
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <img src="/logo.png" alt="Wildlife Tracker" className="auth-logo-img" onError={(e) => (e.currentTarget.style.display = 'none')} />
          </div>
          <h1 className="auth-title">Welcome to Wildlife Tracker</h1>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>
        <SignIn
          routing="path"
          path="/login"
          signUpUrl="/register"
          forceRedirectUrl="/observations"
          appearance={{
            elements: {
              rootBox: 'clerk-root',
              card: 'clerk-card',
              headerTitle: 'clerk-hidden',
              headerSubtitle: 'clerk-hidden',
              socialButtonsBlockButton: 'clerk-social-btn',
              formButtonPrimary: 'submit-button',
              formFieldInput: 'input-field',
              formFieldLabel: 'input-label',
              footerActionLink: 'auth-link',
            },
          }}
        />
      </div>
    </div>
  );
}