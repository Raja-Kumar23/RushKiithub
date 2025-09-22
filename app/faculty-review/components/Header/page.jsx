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
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <div className="logo">
            <h1>
              <span className="logo-text">KIIT</span>
              <span className="logo-accent">Hub</span>
            </h1>
            <span className="subtitle">Faculty Reviews</span>
          </div>
        </div>

        <div className="header-center">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search teachers or subjects..."
              className="search-input"
              onChange={handleSearch}
            />
            <div className="search-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="21 21l-4.35-4.35" />
              </svg>
            </div>
          </div>
        </div>

        <div className="header-right">
          <button
            className={`ai-chat-toggle ${showAIChat ? 'active' : ''}`}
            onClick={() => setShowAIChat(!showAIChat)}
            title="AI Chat Assistant"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <circle cx="9" cy="10" r="1" />
              <circle cx="15" cy="10" r="1" />
              <path d="M9.5 14.5c1.5 1.5 3.5 1.5 5 0" />
            </svg>
          </button>

          <button
            className="theme-toggle"
            onClick={() => setIsDarkMode(!isDarkMode)}
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

          <div className="user-profile">
            <div className="user-avatar">
              {userName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="user-info">
              <span className="user-name">{userName}</span>
              {hasPremiumAccess && <span className="premium-badge">Premium</span>}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;