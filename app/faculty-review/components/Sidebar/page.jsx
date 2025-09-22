import React from 'react';
import './styles.css';

const Sidebar = ({
  isOpen,
  onClose,
  teachers,
  getTeacherReviewStats,
  openViewReviewsModal,
  openSectionModal,
  setActiveSectionFilter,
  currentView,
  setCurrentView,
  teacherFilter,
  setTeacherFilter,
  allReviews,
  teacherMapping,
  currentUser,
  userName,
  isDarkMode,
  setIsDarkMode,
  activeSection,
  setActiveSection,
  showAllSections,
  setShowAllSections,
  hasPremiumAccess
}) => {
  const getSectionStats = () => {
    const sectionMap = new Map();
    
    teachers.forEach(teacher => {
      if (teacher.sections) {
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
          sectionMap.get(section).totalReviews += stats.totalReviews;
        });
      }
    });

    // Calculate average ratings for sections
    sectionMap.forEach((sectionData, section) => {
      const totalRating = sectionData.teachers.reduce((sum, teacher) => 
        sum + parseFloat(teacher.stats.overallAverage), 0
      );
      sectionData.averageRating = sectionData.teachers.length > 0 
        ? (totalRating / sectionData.teachers.length).toFixed(1) 
        : 0;
    });

    return Array.from(sectionMap.entries())
      .map(([section, data]) => ({ section, ...data }))
      .sort((a, b) => parseFloat(b.averageRating) - parseFloat(a.averageRating));
  };

  const getTopTeachers = () => {
    return teachers
      .map(teacher => ({
        ...teacher,
        stats: getTeacherReviewStats(teacher.id, teacher.name)
      }))
      .filter(teacher => teacher.stats.totalReviews > 0)
      .sort((a, b) => parseFloat(b.stats.overallAverage) - parseFloat(a.stats.overallAverage))
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

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-title">
            <h2>Menu</h2>
          </div>
          <button className="sidebar-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="sidebar-content">
          {/* Navigation Menu */}
          <div className="menu-section">
            <h3 className="section-title">Navigation</h3>
            <div className="menu-items">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  className={`menu-item ${currentView === item.id ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentView(item.id);
                    if (item.id === 'all-sections') {
                      setShowAllSections(true);
                    } else {
                      setShowAllSections(false);
                    }
                  }}
                >
                  <div className="menu-icon">
                    {renderIcon(item.icon)}
                  </div>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filter Section */}
          <div className="menu-section">
            <h3 className="section-title">Filter Teachers</h3>
            <div className="filter-options">
              {filterOptions.map(option => (
                <label key={option.id} className="filter-option">
                  <input
                    type="radio"
                    name="teacherFilter"
                    value={option.id}
                    checked={teacherFilter === option.id}
                    onChange={(e) => setTeacherFilter(e.target.value)}
                  />
                  <span className="radio-custom"></span>
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Top Sections */}
          <div className="menu-section">
            <h3 className="section-title">Top Sections</h3>
            <div className="section-list">
              {getSectionStats().slice(0, 5).map(({ section, averageRating, teachers: sectionTeachers }) => (
                <button
                  key={section}
                  className={`section-item ${activeSection === section ? 'active' : ''}`}
                  onClick={() => setActiveSectionFilter(section)}
                >
                  <div className="section-info">
                    <span className="section-number">Section {section}</span>
                    <span className="section-meta">
                      {sectionTeachers.length} teachers • ★ {averageRating}
                    </span>
                  </div>
                  <div className="section-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9,18 15,12 9,6" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Top Teachers */}
          <div className="menu-section">
            <h3 className="section-title">Top Teachers</h3>
            <div className="teacher-list">
              {getTopTeachers().slice(0, 5).map(teacher => (
                <button
                  key={teacher.id}
                  className="teacher-item"
                  onClick={() => openViewReviewsModal(teacher)}
                >
                  <div className="teacher-avatar">
                    {teacher.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="teacher-info">
                    <span className="teacher-name">{teacher.name}</span>
                    <span className="teacher-rating">
                      ★ {teacher.stats.overallAverage} ({teacher.stats.totalReviews} reviews)
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* User Info */}
          <div className="menu-section">
            <div className="user-section">
              <div className="user-profile-full">
                <div className="user-avatar-large">
                  {userName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="user-details">
                  <span className="user-name-full">{userName}</span>
                  {hasPremiumAccess && <span className="premium-badge-full">Premium User</span>}
                </div>
              </div>
              
              <button
                className="theme-toggle-full"
                onClick={() => setIsDarkMode(!isDarkMode)}
              >
                <div className="theme-icon">
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
      </div>
    </>
  );
};

export default Sidebar;