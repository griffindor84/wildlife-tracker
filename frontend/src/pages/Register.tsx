import { SignUp } from '@clerk/clerk-react';
import './Auth.css';

export default function Register() {
  return (
    <div className="auth-container">
      <div className="auth-bg" />

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <img src="assets/wildlife.jpeg" alt="Wildlife Tracker" className="auth-logo-img" onError={(e) => (e.currentTarget.style.display = 'none')} />
          </div>
          <h1 className="auth-title">Welcome to Wildlife Tracker</h1>
          <h2 className="auth-subtitle">Create your account</h2>
        </div>

        <SignUp
          routing="path"
          path="/register"
          signInUrl="/login"
          afterSignUpUrl="/"
          appearance={{
            elements: {
              rootBox: 'clerk-root',
              card: 'clerk-card',
              headerTitle: 'clerk-hidden',
              headerSubtitle: 'clerk-hidden',
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