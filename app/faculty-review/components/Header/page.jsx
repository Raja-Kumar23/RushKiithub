"use client";

import React from 'react';
import './styles.css';

const Header = ({ 
  searchTeachers, 
  setSidebarOpen, 
  setShowAIChat, 
  showAIChat, 
  isDarkMode, 
  setIsDarkMode, 
  userName, 
  hasPremiumAccess 
}) => {
  const handleSearch = (e) => {
    searchTeachers(e.target.value);
  };

  return (
    <header className={`header ${isDarkMode ? 'dark-theme' : ''}`}>
      <div className="header-container">
        
        {/* Left Section - Menu & Logo */}
        <div className="header-left">
          <button
            onClick={() => setSidebarOpen(true)}
            className="menu-button"
            aria-label="Open menu"
          >
            <div className="menu-icon">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
          
          <div className="logo-section">
            <div className="logo">
              <h1>
                <span className="logo-main">KIIT</span>
                <span className="logo-accent">Hub</span>
              </h1>
              <span className="logo-subtitle">Faculty Reviews</span>
            </div>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="header-center">
          <div className="search-container">
            <div className="search-input-wrapper">
              <div className="search-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="21 21l-4.35-4.35" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search teachers or subjects..."
                className="search-input"
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>

        {/* Right Section - Actions & Profile */}
        <div className="header-right">
          {/* AI Chat Toggle */}
          <button
            onClick={() => setShowAIChat(!showAIChat)}
            className={`action-button ai-chat-button ${showAIChat ? 'active' : ''}`}
            title="AI Chat Assistant"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="action-button theme-button"
            title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          >
            {isDarkMode ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* User Profile */}
          <div className="user-profile">
            <div className="user-avatar">
              {userName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="user-info">
              <span className="user-name">{userName}</span>
              {hasPremiumAccess && (
                <span className="premium-badge">Premium</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;