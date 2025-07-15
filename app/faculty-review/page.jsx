"use client"

import React from 'react';
import { ArrowLeft, Star, MessageSquare } from 'lucide-react';
import './styles.css';

export default function FacultyReview({ onGoBack }) {
  const handleWhatsAppClick = () => {
    window.open('https://chat.whatsapp.com/L49NFqYQ1aWCRObYUBpZax', '_blank');
  };

  return (
    <div className="coming-soon-container">
      <div className="coming-soon-card">
        <div className="coming-soon-icon">
          <Star size={48} />
        </div>
        
        <h1 className="coming-soon-title">Coming Soon</h1>
        <div className="coming-soon-divider"></div>
        
        <p className="coming-soon-description">
          Faculty Review feature will be live soon through which you can give reviews and ratings for faculty members.
        </p>
        
        <p className="coming-soon-subtitle">
          Stay tuned and join our WhatsApp community in the meantime!
        </p>
        
        <div className="coming-soon-buttons">
          <button onClick={handleWhatsAppClick} className="whatsapp-btn">
            <MessageSquare size={20} />
            Join WhatsApp
          </button>
          
          <button onClick={onGoBack} className="back-btn">
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}