"use client";

import React, { useState, useEffect } from 'react';
import './styles.css';

const Sidebar = ({
  isOpen = false,
  onClose = () => {},
  teachers = [],
  getTeacherReviewStats = () => ({ totalReviews: 0, overallAverage: '0.0' }),
  openViewReviewsModal = () => {},
  openSectionModal = () => {},
  setActiveSectionFilter = () => {},
  currentView = 'teachers',
  setCurrentView = () => {},
  teacherFilter = 'all',
  setTeacherFilter = () => {},
  allReviews = [],
  teacherMapping = {},
  currentUser = null,
  userName = 'User',
  isDarkMode = false,
  setIsDarkMode = () => {},
  activeSection = '',
  setActiveSection = () => {},
  showAllSections = false,
  setShowAllSections = () => {},
  hasPremiumAccess = false
}) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  const getSectionStats = () => {
    const sectionMap = new Map();
    
    if (!teachers || !Array.isArray(teachers)) {
      return [];
    }
    
    teachers.forEach(teacher => {
      if (teacher && teacher.sections && Array.isArray(teacher.sections)) {
        teacher.sections.forEach(section => {
          if (!sectionMap.has(section)) {
            sectionMap.set(section, {
              teachers: [],
              totalReviews: 0,
              averageRating: 0
            });
          }
          
          const stats = getTeacherReviewStats(teacher.id, teacher.name);
          sectionMap.get(section).teachers.push({
            ...teacher,
            stats
          });
          sectionMap.get(section).totalReviews += stats.totalReviews || 0;
        });
      }
    });

    sectionMap.forEach((sectionData) => {
      const totalRating = sectionData.teachers.reduce((sum, teacher) => 
        sum + parseFloat(teacher.stats.overallAverage || '0'), 0
      );
      sectionData.averageRating = sectionData.teachers.length > 0 
        ? (totalRating / sectionData.teachers.length).toFixed(1) 
        : '0.0';
    });

    return Array.from(sectionMap.entries())
      .map(([section, data]) => ({ section, ...data }))
      .sort((a, b) => parseFloat(b.averageRating) - parseFloat(a.averageRating));
  };

  const getTopTeachers = () => {
    if (!teachers || !Array.isArray(teachers)) {
      return [];
    }

    return teachers
      .map(teacher => ({
        ...teacher,
        stats: getTeacherReviewStats(teacher.id, teacher.name)
      }))
      .filter(teacher => teacher.stats && teacher.stats.totalReviews > 0)
      .sort((a, b) => parseFloat(b.stats.overallAverage || '0') - parseFloat(a.stats.overallAverage || '0'))
      .slice(0, 8);
  };

  const menuItems = [
    { 
      id: 'teachers', 
      label: 'All Teachers', 
      icon: 'users',
      description: 'Browse all faculty members',
      count: teachers.length || 0
    },
    { 
      id: 'all-sections', 
      label: 'Departments', 
      icon: 'grid',
      description: 'Explore by department',
      count: getSectionStats().length
    },
    { 
      id: 'top-rated', 
      label: 'Top Rated', 
      icon: 'star',
      description: 'Highest rated faculty',
      count: getTopTeachers().length
    }
  ];

  const filterOptions = [
    { id: 'all', label: 'All Teachers', description: 'View all faculty members' },
    { id: 'highly-recommended', label: 'Excellent', description: '4.5+ rating' },
    { id: 'medium', label: 'Good', description: '3.0-4.4 rating' },
    { id: 'not-recommended', label: 'Below Average', description: 'Below 3.0 rating' }
  ];

  const renderIcon = (iconName, className = '') => {
    const icons = {
      users: (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      grid: (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
      star: (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ),
      trending: (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
          <polyline points="17,6 23,6 23,12" />
        </svg>
      ),
      award: (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21,13.89 7,23 12,20 17,23 15.79,13.88" />
        </svg>
      )
    };
    return icons[iconName] || null;
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="sidebar-backdrop"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`modern-sidebar ${isOpen ? 'open' : ''} ${isDarkMode ? 'dark' : ''}`}>
        <div className="sidebar-glass-overlay"></div>
        
        {/* Header */}
        <header className="sidebar-header">
          <div className="sidebar-title-section">
            <div className="sidebar-logo">
              <div className="logo-icon">
                {renderIcon('grid', 'logo-svg')}
              </div>
              <div className="logo-text">
                <h2>Dashboard</h2>
                <span>Faculty Reviews</span>
              </div>
            </div>
          </div>
          
          <button 
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        {/* Content */}
        <div className="sidebar-content">
          {/* Navigation Section */}
          <section className="sidebar-section">
            <div className="section-header">
              <h3 className="section-title">
                {renderIcon('trending', 'section-icon')}
                Navigation
              </h3>
            </div>
            
            <nav className="nav-menu">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentView(item.id);
                    if (item.id === 'all-sections') {
                      setShowAllSections(true);
                    } else {
                      setShowAllSections(false);
                    }
                  }}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="nav-item-icon">
                    {renderIcon(item.icon)}
                  </div>
                  <div className="nav-item-content">
                    <span className="nav-item-label">{item.label}</span>
                    <span className="nav-item-description">{item.description}</span>
                  </div>
                  <div className="nav-item-badge">
                    <span>{item.count}</span>
                  </div>
                  <div className="nav-item-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9,18 15,12 9,6" />
                    </svg>
                  </div>
                </button>
              ))}
            </nav>
          </section>

          {/* Filter Section */}
          <section className="sidebar-section">
            <div className="section-header">
              <h3 className="section-title">
                {renderIcon('star', 'section-icon')}
                Rating Filter
              </h3>
            </div>
            
            <div className="filter-grid">
              {filterOptions.map(option => (
                <label 
                  key={option.id} 
                  className={`filter-card ${teacherFilter === option.id ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="teacherFilter"
                    value={option.id}
                    checked={teacherFilter === option.id}
                    onChange={(e) => setTeacherFilter(e.target.value)}
                  />
                  <div className="filter-card-content">
                    <div className="filter-indicator"></div>
                    <div className="filter-info">
                      <span className="filter-label">{option.label}</span>
                      <span className="filter-description">{option.description}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Top Departments */}
          <section className="sidebar-section">
            <div className="section-header">
              <h3 className="section-title">
                {renderIcon('award', 'section-icon')}
                Top Departments
              </h3>
              <button className="section-expand">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6,9 12,15 18,9" />
                </svg>
              </button>
            </div>
            
            <div className="items-grid">
              {getSectionStats().slice(0, 4).map(({ section, averageRating, teachers: sectionTeachers }, index) => (
                <button
                  key={section}
                  className={`item-card department-card ${activeSection === section ? 'active' : ''}`}
                  onClick={() => setActiveSectionFilter(section)}
                >
                  <div className="item-rank">#{index + 1}</div>
                  <div className="item-content">
                    <div className="item-title">Section {section}</div>
                    <div className="item-stats">
                      <span className="stat-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                        </svg>
                        {averageRating}
                      </span>
                      <span className="stat-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                        </svg>
                        {sectionTeachers.length}
                      </span>
                    </div>
                  </div>
                  <div className="item-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9,18 15,12 9,6" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Top Teachers */}
          <section className="sidebar-section">
            <div className="section-header">
              <h3 className="section-title">
                {renderIcon('users', 'section-icon')}
                Top Faculty
              </h3>
            </div>
            
            <div className="teachers-list">
              {getTopTeachers().slice(0, 5).map((teacher, index) => (
                <button
                  key={teacher.id}
                  className="teacher-card"
                  onClick={() => openViewReviewsModal(teacher)}
                >
                  <div className="teacher-rank">#{index + 1}</div>
                  <div className="teacher-avatar">
                    <div className="avatar-image">
                      {teacher.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="avatar-status"></div>
                  </div>
                  <div className="teacher-info">
                    <span className="teacher-name">{teacher.name}</span>
                    <div className="teacher-stats">
                      <span className="rating-badge">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                        </svg>
                        {teacher.stats.overallAverage}
                      </span>
                      <span className="reviews-count">
                        {teacher.stats.totalReviews} reviews
                      </span>
                    </div>
                  </div>
                  <div className="teacher-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9,18 15,12 9,6" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* User Footer */}
        <footer className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar-section">
              <div className="user-avatar-large">
                <div className="avatar-bg">
                  {userName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                {hasPremiumAccess && <div className="premium-crown">👑</div>}
              </div>
            </div>
            
            <div className="user-info-section">
              <div className="user-name">{userName}</div>
              {hasPremiumAccess && (
                <div className="premium-status">Premium Member</div>
              )}
            </div>
            
            <div className="user-actions">
              <button
                className="theme-toggle-btn"
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
            </div>
          </div>
        </footer>
      </aside>
    </>
  );
};

export default Sidebar;