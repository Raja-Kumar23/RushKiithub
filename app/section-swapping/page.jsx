"use client"

import React from 'react';
import { ArrowLeft, RefreshCw, MessageSquare } from 'lucide-react';
import './styles.css';

export default function SectionSwapping({ onGoBack }) {
  const handleWhatsAppClick = () => {
    window.open('https://chat.whatsapp.com/L49NFqYQ1aWCRObYUBpZax', '_blank');
  };

  return (
    <div className="coming-soon-container">
      <div className="coming-soon-card">
        <div className="coming-soon-icon">
          <RefreshCw size={48} />
        </div>
        
        <h1 className="coming-soon-title">Coming Next Semester</h1>
        <div className="coming-soon-divider"></div>
        
        <p className="coming-soon-description">
          Section Swapping will be available after you complete your current semester and selection process is officially announced by the university.
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