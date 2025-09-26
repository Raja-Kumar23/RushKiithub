"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import './styles.css';

const Header = ({ 
  searchTeachers, 
  setSidebarOpen, 
  userName, 
  hasPremiumAccess,
  teachers = [], // Real teachers data from your main page
  setShowAIChat,
  showAIChat,
  isDarkMode,
  setIsDarkMode
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Memoize the filter function to prevent infinite loops
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
      .slice(0, 8); // Limit to 8 suggestions
  }, [teachers]);

  // Handle search input changes
  const handleSearch = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Call the parent's search function
    if (searchTeachers) {
      searchTeachers(value);
    }
    
    // Update suggestions
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
    
    // Call the parent's search function with the selected teacher name
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

  // Handle click outside to close suggestions
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
    <header className="header">
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
            <div className="search-input-wrapper" ref={searchRef}>
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
                value={searchQuery}
                onChange={handleSearch}
                onFocus={handleSearchFocus}
              />
            </div>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="suggestions-dropdown" ref={suggestionsRef}>
                <div className="suggestions-list">
                  {filteredSuggestions.map((teacher, index) => (
                    <div
                      key={teacher.id || index}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(teacher)}
                    >
                      <div className="simple-suggestion">
                        <div className="teacher-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </div>
                        <span className="teacher-name">
                          {teacher.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Profile */}
        <div className="header-right">
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