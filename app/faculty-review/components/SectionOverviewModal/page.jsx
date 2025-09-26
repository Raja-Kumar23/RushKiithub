"use client";

import React from 'react';
import './styles.css';

const SectionOverviewModal = ({ 
  section, 
  teachers = [], 
  getTeacherReviewStats, 
  onClose, 
  openViewReviewsModal, 
  setActiveSectionFilter 
}) => {
  // Early return if required props are not available
  if (!section || !teachers || !getTeacherReviewStats) {
    return null;
  }

  const getSectionTeachers = () => {
    return teachers
      .filter(teacher => teacher?.sections && teacher.sections.includes(section))
      .map(teacher => ({
        ...teacher,
        stats: getTeacherReviewStats(teacher.id, teacher.name)
      }))
      .sort((a, b) => parseFloat(b.stats?.overallAverage || 0) - parseFloat(a.stats?.overallAverage || 0));
  };

  const sectionTeachers = getSectionTeachers();
  
  const getRatingColor = (rating) => {
    const score = parseFloat(rating || 0);
    if (score >= 3.5) return 'excellent';
    if (score >= 2.5) return 'good';
    if (score >= 1.5) return 'average';
    return 'poor';
  };

  const getRatingText = (rating) => {
    const score = parseFloat(rating || 0);
    if (score >= 3.5) return 'Excellent';
    if (score >= 2.5) return 'Good';
    if (score >= 1.5) return 'Average';
    return 'Poor';
  };

  const renderStars = (rating) => {
    const score = parseFloat(rating || 0);
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="stars">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="star full">★</span>
        ))}
        {hasHalfStar && <span className="star half">★</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="star empty">☆</span>
        ))}
      </div>
    );
  };

  const calculateSectionStats = () => {
    if (sectionTeachers.length === 0) return { avgRating: 0, totalReviews: 0 };
    
    const totalRating = sectionTeachers.reduce((sum, teacher) => 
      sum + parseFloat(teacher.stats?.overallAverage || 0), 0
    );
    const totalReviews = sectionTeachers.reduce((sum, teacher) => 
      sum + (teacher.stats?.totalReviews || 0), 0
    );
    
    return {
      avgRating: (totalRating / sectionTeachers.length).toFixed(1),
      totalReviews
    };
  };

  const sectionStats = calculateSectionStats();

  return (
    <div className="section-modal-overlay" onClick={onClose}>
      <div className="section-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-content">
            <div className="section-title">
              <h2>Section {section}</h2>
              <span className="section-subtitle">{sectionTeachers.length} Faculty Members</span>
            </div>
            
            <div className="section-stats-summary">
              <div className="stat-item">
                <span className="stat-value">{sectionStats.avgRating}</span>
                <span className="stat-label">Avg Rating</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{sectionStats.totalReviews}</span>
                <span className="stat-label">Total Reviews</span>
              </div>
            </div>
          </div>
          
          <button className="close-modal-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="section-overview">
            <div className="overview-stats">
              <div className="rating-display">
                {renderStars(parseFloat(sectionStats.avgRating))}
                <span className="rating-text">{getRatingText(parseFloat(sectionStats.avgRating))}</span>
              </div>
              
              <div className="performance-indicator">
                <div className="performance-bar">
                  <div 
                    className={`performance-fill ${getRatingColor(parseFloat(sectionStats.avgRating))}`}
                    style={{ width: `${(parseFloat(sectionStats.avgRating) / 4) * 100}%` }}
                  ></div>
                </div>
                <span className="performance-text">
                  Section Performance: {((parseFloat(sectionStats.avgRating) / 4) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          <div className="teachers-section">
            <div className="teachers-header">
              <h3>Faculty Members</h3>
              <button 
                className="filter-section-btn"
                onClick={() => {
                  setActiveSectionFilter?.(section);
                  onClose?.();
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
                </svg>
                Filter by Section
              </button>
            </div>
            
            <div className="teachers-list">
              {sectionTeachers.map(teacher => {
                const ratingColor = getRatingColor(teacher.stats?.overallAverage);
                const ratingText = getRatingText(teacher.stats?.overallAverage);
                const teacherName = teacher.name || 'Unknown Teacher';
                
                return (
                  <div key={teacher.id} className={`teacher-row ${ratingColor}`}>
                    <div className="teacher-info">
                      <div className="teacher-avatar">
                        {teacherName.split(' ').map(n => n.charAt(0)).join('').toUpperCase()}
                      </div>
                      
                      <div className="teacher-details">
                        <h4 className="teacher-name">{teacherName}</h4>
                        
                        <div className="teacher-subjects">
                          {teacher.subjects && teacher.subjects.slice(0, 2).map((subject, index) => (
                            <span key={index} className="subject-tag">
                              {subject.length > 25 ? `${subject.substring(0, 25)}...` : subject}
                            </span>
                          ))}
                        </div>
                        
                        <div className="teacher-rating-info">
                          {renderStars(parseFloat(teacher.stats?.overallAverage || 0))}
                          <span className="rating-details">
                            {teacher.stats?.overallAverage || '0.0'} ({teacher.stats?.totalReviews || 0} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="teacher-actions">
                      <div className="rating-badge">
                        <span className="rating-score">{teacher.stats?.overallAverage || '0.0'}</span>
                        <span className="rating-label">{ratingText}</span>
                      </div>
                      
                      <button 
                        className="view-reviews-btn"
                        onClick={() => {
                          openViewReviewsModal?.(teacher);
                          onClose?.();
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        View Reviews
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {sectionTeachers.length === 0 && (
              <div className="empty-teachers">
                <div className="empty-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h4>No Teachers Found</h4>
                <p>No faculty members found for Section {section}.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionOverviewModal;