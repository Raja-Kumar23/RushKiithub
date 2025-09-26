"use client";
import React, { useEffect } from 'react';
import './styles.css';

const SuccessModal = ({ title, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="success-modal-overlay" onClick={onClose}>
      <div className="success-modal" onClick={(e) => e.stopPropagation()}>
        <div className="success-animation">
          <div className="success-icon">
            <div className="success-circle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20,6 9,17 4,12" />
              </svg>
            </div>
          </div>
          <div className="success-ripples">
            <div className="ripple"></div>
            <div className="ripple"></div>
            <div className="ripple"></div>
          </div>
        </div>
        
        <div className="success-content">
          <h3>{title}</h3>
          <p>{message}</p>
          
          <button className="success-btn" onClick={onClose}>
            <span>Great!</span>
            <div className="btn-shine"></div>
          </button>
        </div>
        
        <div className="success-confetti">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="confetti-piece" style={{
              '--delay': `${i * 0.1}s`,
              '--rotation': `${Math.random() * 360}deg`,
              '--x': `${Math.random() * 100}%`,
              '--color': `hsl(${120 + Math.random() * 60}, 70%, 60%)`
            }}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;