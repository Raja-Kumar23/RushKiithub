"use client";

import React from 'react';

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
  const getSectionStats = () => {
    const sectionMap = new Map();
    
    // Add null check for teachers array
    if (!teachers || !Array.isArray(teachers)) {
      return [];
    }
    
    teachers.forEach(teacher => {
      // Add null checks for teacher and teacher.sections
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

    // Calculate average ratings for sections
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
    // Add null check for teachers array
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
      .slice(0, 10);
  };

  const menuItems = [
    { id: 'teachers', label: 'All Teachers', icon: 'users' },
    { id: 'all-sections', label: 'Sections', icon: 'grid' },
    { id: 'top-rated', label: 'Top Rated', icon: 'star' }
  ];

  const filterOptions = [
    { id: 'all', label: 'All Teachers' },
    { id: 'highly-recommended', label: 'Highly Recommended' },
    { id: 'medium', label: 'Average' },
    { id: 'not-recommended', label: 'Not Recommended' }
  ];

  const renderIcon = (iconName) => {
    const icons = {
      users: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      grid: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
      star: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      )
    };
    return icons[iconName] || null;
  };

  const sidebarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: '320px',
    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 0.3s ease-in-out',
    zIndex: 50,
    display: 'flex',
    flexDirection: 'column',
    color: isDarkMode ? '#ffffff' : '#000000'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px',
    borderBottom: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`
  };

  const contentStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '0'
  };

  const sectionStyle = {
    padding: '24px',
    borderBottom: `1px solid ${isDarkMode ? '#374151' : '#f3f4f6'}`
  };

  const sectionTitleStyle = {
    fontSize: '12px',
    fontWeight: '600',
    color: isDarkMode ? '#9ca3af' : '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '12px'
  };

  const menuItemStyle = (isActive) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '500',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: isActive 
      ? (isDarkMode ? '#1e40af' : '#dbeafe') 
      : 'transparent',
    color: isActive 
      ? (isDarkMode ? '#bfdbfe' : '#1e40af') 
      : (isDarkMode ? '#d1d5db' : '#374151'),
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '4px'
  });

  const iconStyle = {
    marginRight: '12px',
    height: '20px',
    width: '20px'
  };

  const filterOptionStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
    cursor: 'pointer'
  };

  const radioStyle = {
    height: '16px',
    width: '16px',
    marginRight: '12px'
  };

  const teacherItemStyle = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    fontSize: '14px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: isDarkMode ? '#d1d5db' : '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '8px'
  };

  const avatarStyle = {
    height: '32px',
    width: '32px',
    backgroundColor: '#3b82f6',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: '500',
    marginRight: '12px',
    flexShrink: 0
  };

  const userSectionStyle = {
    marginTop: 'auto',
    padding: '24px',
    borderTop: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`
  };

  const userProfileStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px'
  };

  const userAvatarStyle = {
    height: '40px',
    width: '40px',
    backgroundColor: '#6b7280',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: '500',
    marginRight: '12px',
    flexShrink: 0
  };

  const themeToggleStyle = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    fontSize: '14px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: isDarkMode ? '#d1d5db' : '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s'
  };

  return (
    <div style={sidebarStyle}>
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>Menu</h2>
        </div>
        <button 
          style={{
            padding: '8px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: 'transparent',
            color: isDarkMode ? '#9ca3af' : '#6b7280',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={onClose}
        >
          <svg style={{ height: '24px', width: '24px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div style={contentStyle}>
        {/* Navigation Menu */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Navigation</h3>
          <nav>
            {menuItems.map(item => (
              <button
                key={item.id}
                style={menuItemStyle(currentView === item.id)}
                onClick={() => {
                  setCurrentView(item.id);
                  if (item.id === 'all-sections') {
                    setShowAllSections(true);
                  } else {
                    setShowAllSections(false);
                  }
                }}
                onMouseEnter={(e) => {
                  if (currentView !== item.id) {
                    e.target.style.backgroundColor = isDarkMode ? '#374151' : '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentView !== item.id) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={iconStyle}>
                  {renderIcon(item.icon)}
                </div>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Filter Section */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Filter Teachers</h3>
          <div>
            {filterOptions.map(option => (
              <label key={option.id} style={filterOptionStyle}>
                <input
                  type="radio"
                  name="teacherFilter"
                  value={option.id}
                  checked={teacherFilter === option.id}
                  onChange={(e) => setTeacherFilter(e.target.value)}
                  style={radioStyle}
                />
                <span style={{ fontSize: '14px' }}>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Top Sections */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Top Sections</h3>
          <div>
            {getSectionStats().slice(0, 5).map(({ section, averageRating, teachers: sectionTeachers }) => (
              <button
                key={section}
                style={{
                  ...teacherItemStyle,
                  backgroundColor: activeSection === section 
                    ? (isDarkMode ? '#065f46' : '#d1fae5') 
                    : 'transparent',
                  color: activeSection === section 
                    ? (isDarkMode ? '#a7f3d0' : '#065f46') 
                    : (isDarkMode ? '#d1d5db' : '#374151')
                }}
                onClick={() => setActiveSectionFilter(section)}
                onMouseEnter={(e) => {
                  if (activeSection !== section) {
                    e.target.style.backgroundColor = isDarkMode ? '#374151' : '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== section) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontWeight: '500' }}>Section {section}</div>
                  <div style={{ fontSize: '12px', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                    {sectionTeachers.length} teachers • ★ {averageRating}
                  </div>
                </div>
                <svg style={{ height: '16px', width: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9,18 15,12 9,6" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Top Teachers */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Top Teachers</h3>
          <div>
            {getTopTeachers().slice(0, 5).map(teacher => (
              <button
                key={teacher.id}
                style={teacherItemStyle}
                onClick={() => openViewReviewsModal(teacher)}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = isDarkMode ? '#374151' : '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <div style={avatarStyle}>
                  {teacher.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {teacher.name}
                  </div>
                  <div style={{ fontSize: '12px', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                    ★ {teacher.stats.overallAverage} ({teacher.stats.totalReviews} reviews)
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* User Info */}
        <div style={userSectionStyle}>
          <div style={userProfileStyle}>
            <div style={userAvatarStyle}>
              {userName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {userName}
              </div>
              {hasPremiumAccess && (
                <div style={{ fontSize: '12px', color: '#3b82f6' }}>Premium User</div>
              )}
            </div>
          </div>
          
          <button
            style={themeToggleStyle}
            onClick={() => setIsDarkMode(!isDarkMode)}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = isDarkMode ? '#374151' : '#f9fafb';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <div style={iconStyle}>
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
            </div>
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;