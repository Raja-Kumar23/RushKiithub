"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import './styles.css';

const Header = ({ 
  searchTeachers, 
  setSidebarOpen, 
  userName, 
  hasPremiumAccess,
  teachers = [],
  setShowAIChat,
  showAIChat,
  isDarkMode,
  setIsDarkMode
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Memoize the filter function
  const filterTeachers = useCallback((query) => {
    if (!query || query.length < 2) {
      return [];
    }
    
    const searchTerm = query.toLowerCase().trim();
    
    return teachers
      .filter(teacher => 
        teacher && 
        teacher.name && 
        teacher.name.toLowerCase().includes(searchTerm)
      )
      .slice(0, 8);
  }, [teachers]);

  // Handle search input changes
  const handleSearch = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (searchTeachers) {
      searchTeachers(value);
    }
    
    if (value.length >= 2) {
      const filtered = filterTeachers(value);
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTeachers, filterTeachers]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((teacher) => {
    const teacherName = teacher.name;
    setSearchQuery(teacherName);
    setShowSuggestions(false);
    
    if (searchTeachers) {
      searchTeachers(teacherName);
    }
  }, [searchTeachers]);

  // Handle search focus
  const handleSearchFocus = useCallback(() => {
    if (searchQuery.length >= 2 && filteredSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  }, [searchQuery, filteredSuggestions]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && !searchRef.current.contains(event.target) &&
        suggestionsRef.current && !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={`modern-header ${isScrolled ? 'scrolled' : ''} ${isDarkMode ? 'dark' : ''}`}>
      <div className="header-glass-overlay"></div>
      
      <div className="header-container">
        {/* Left Section */}
        <div className="header-left">
          <button
            onClick={() => setSidebarOpen(true)}
            className="menu-button"
            aria-label="Open menu"
          >
            <div className="menu-burger">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
          
          <div className="logo-container">
            <div className="logo-gradient">
              <h1 className="logo-text">
                <span className="logo-primary">KIIT</span>
                <span className="logo-secondary">Hub</span>
              </h1>
              <div className="logo-badge">Faculty Reviews</div>
            </div>
          </div>
        </div>

        {/* Center Section - Enhanced Search */}
        <div className="header-center">
          <div className="search-wrapper">
            <div className="search-container" ref={searchRef}>
              <div className="search-icon-wrapper">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="21 21l-4.35-4.35" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for teachers, subjects, or courses..."
                className="search-input"
                value={searchQuery}
                onChange={handleSearch}
                onFocus={handleSearchFocus}
              />
              {searchQuery && (
                <button
                  className="search-clear"
                  onClick={() => {
                    setSearchQuery('');
                    setShowSuggestions(false);
                    if (searchTeachers) searchTeachers('');
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            {/* Enhanced Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="suggestions-dropdown" ref={suggestionsRef}>
                <div className="suggestions-header">
                  <span>Quick Results</span>
                  <div className="suggestions-count">{filteredSuggestions.length}</div>
                </div>
                <div className="suggestions-list">
                  {filteredSuggestions.map((teacher, index) => (
                    <div
                      key={teacher.id || index}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(teacher)}
                    >
                      <div className="suggestion-content">
                        <div className="teacher-avatar">
                          {teacher.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="suggestion-info">
                          <span className="teacher-name">{teacher.name}</span>
                          <span className="teacher-department">Professor</span>
                        </div>
                      </div>
                      <div className="suggestion-arrow">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Enhanced User Profile */}
        <div className="header-right">
          <div className="header-actions">
            <button
              className="action-button theme-toggle"
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label="Toggle theme"
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
                <div className="avatar-image">
                  {userName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                {hasPremiumAccess && <div className="premium-indicator"></div>}
              </div>
              <div className="user-details">
                <span className="user-name">{userName || 'User'}</span>
                {hasPremiumAccess && (
                  <span className="premium-label">Premium</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;