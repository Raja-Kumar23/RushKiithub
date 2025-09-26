"use client";
import React from 'react';
import './styles.css';

const ErrorModal = ({ title, message, onClose }) => {
  return (
    <div className="error-modal-overlay" onClick={onClose}>
      <div className="error-modal" onClick={(e) => e.stopPropagation()}>
        <div className="error-animation">
          <div className="error-icon">
            <div className="error-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
          </div>
          <div className="error-waves">
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
          </div>
        </div>
        
        <div className="error-content">
          <h3>{title}</h3>
          <p>{message}</p>
          
          <button className="error-btn" onClick={onClose}>
            <span>OK</span>
            <div className="btn-ripple"></div>
          </button>
        </div>
        
        <div className="error-particles">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="particle" style={{
              '--delay': `${i * 0.2}s`,
              '--rotation': `${Math.random() * 360}deg`,
              '--x': `${Math.random() * 100}%`,
              '--y': `${Math.random() * 100}%`
            }}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;