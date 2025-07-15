import React from 'react';
import { X } from 'lucide-react';
import './LoginPrompt.css';

const LoginPrompt = ({ onClose, onSignIn, error }) => {
  

  return (
    <div className="login-overlay">
      <div className="login-backdrop" onClick={onClose}></div>
      
     <div className="login-container">
  {/* Left Panel */}
  <div className="login-left-panel">
    <div className="brand-section">
      <div className="brand-logo">
        <div className="logo-icon">
          <img src="/logo.png" alt="KIITHub Logo" width="50" height="50" />
        </div>
        <span className="brand-name">KIITHub</span>
      </div>
    </div>
  


          <div className="hero-content">
            <h1 className="hero-title">
              Master your <span className="highlight">CSE journey</span> with confidence
            </h1>
            <p className="hero-subtitle">
              Join 5000+ computer science students who've elevated their academic performance with our comprehensive platform.
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="login-right-panel">
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>

          <div className="login-form">
            <div className="welcome-section">
              <h2 className="welcome-title">Welcome,<br />Future Engineers!</h2>
              <p className="welcome-subtitle">Access your personalized learning dashboard</p>
            </div>

            {error && (
              <div className="error-message">
                <div className="error-icon">!</div>
                {error}
              </div>
            )}

            <button className="google-signin-button" onClick={onSignIn}>
              <img 
                src="https://developers.google.com/identity/images/g-logo.png" 
                alt="Google" 
                className="google-logo"
              />
              Continue with Google
            </button>

            <div className="info-section">
              <div className="info-item">
                <div className="info-icon">
                  <div className="info-dot"></div>
                </div>
               <span>Only KIIT Gmail IDs (@kiit.ac.in) are allowed for access</span>

              </div>

              <div className="trust-badge">
                <span>Trusted by 5000+ CSE Students</span>
              </div>

              <div className="department-focus">
                <span className="department-tag">Computer Science & Engineering</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;