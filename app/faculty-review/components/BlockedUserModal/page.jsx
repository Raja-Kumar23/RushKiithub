import React from 'react';
import './styles.css';

const BlockedUserModal = ({ onRedirect, userRollNumber }) => {
  return (
    <div className="blocked-modal-overlay">
      <div className="blocked-modal">
        <div className="blocked-background">
          <div className="blocked-pattern">
            <div className="pattern-dot"></div>
            <div className="pattern-dot"></div>
            <div className="pattern-dot"></div>
            <div className="pattern-dot"></div>
            <div className="pattern-dot"></div>
            <div className="pattern-dot"></div>
          </div>
        </div>
        
        <div className="blocked-content">
          <div className="blocked-icon">
            <div className="construction-animation">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v4" />
                <path d="M10.363 3.591L2.257 17.125c-.896 1.556.214 3.5 2.01 3.5h15.466c1.796 0 2.906-1.944 2.01-3.5L13.637 3.591a2.004 2.004 0 0 0-3.274 0z" />
                <circle cx="12" cy="17" r="1" />
              </svg>
            </div>
          </div>
          
          <h2>Section Selection in Progress</h2>
          <p className="blocked-message">
            Hello <span className="roll-highlight">{userRollNumber}</span>! 
            The 3rd semester section selection process is currently ongoing.
          </p>
          <p className="blocked-description">
            Faculty reviews will be available once the section allocation is completed. 
            Please check back after the section selection process is finished.
          </p>

          <div className="blocked-features">
            <div className="feature-item">
              <div className="feature-icon">📚</div>
              <span>Section allocation in progress</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⏰</div>
              <span>Reviews available post-allocation</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎯</div>
              <span>Updated faculty assignments</span>
            </div>
          </div>

          <div className="progress-indicator">
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <span className="progress-text">Section Selection: In Progress</span>
          </div>

          <button 
            className="blocked-btn"
            onClick={onRedirect}
          >
            <div className="btn-content">
              <div className="btn-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9,22 9,12 15,12 15,22" />
                </svg>
              </div>
              <span>Return to Home</span>
            </div>
            <div className="btn-ripple"></div>
          </button>

          <div className="contact-info">
            <p>Need assistance? Contact academic office for section-related queries.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockedUserModal;