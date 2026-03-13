import { SignIn } from '@clerk/clerk-react';
import './Auth.css';

export default function Login() {
  return (
    <div className="auth-container">
      {/* Background image — replace with your own photo in /public/bg.jpg */}
      <div className="auth-bg" />

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            {/* Replace src with your own logo or photo */}
            <img src="/logo.png" alt="Wildlife Tracker" className="auth-logo-img" onError={(e) => (e.currentTarget.style.display = 'none')} />
          </div>
          <h1 className="auth-title">Welcome to Wildlife Tracker</h1>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        <SignIn
          routing="path"
          path="/login"
          signUpUrl="/register"
          afterSignInUrl="/"
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
              identityPreviewText: 'clerk-identity',
              formResendCodeLink: 'auth-link',
            },
          }}
        />

        
      </div>
    </div>
  );
}