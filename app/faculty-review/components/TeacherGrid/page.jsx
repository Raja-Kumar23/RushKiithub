import React from 'react';
import { Eye, Edit3, Check, Star, Users, BookOpen, Award, Sparkles } from 'lucide-react';
import './styles.css';

const TeacherGrid = ({
  isLoading,
  teachers,
  userReviews,
  openViewReviewsModal,
  openGiveReviewModal,
  hasReviewedTeacherInAnyYear,
  getTeacherReviewStats,
  hasPremiumAccess,
  canSubmitMoreReviews,
  getUserReviewLimit,
  getUserReviewCount,
  teacherFilter,
  setTeacherFilter,
  activeSection,
  setActiveSection,
  reviewsLastUpdated // Add this prop to trigger re-renders
}) => {
  const getRatingLevel = (rating) => {
    const score = parseFloat(rating);
    if (score >= 4.5) return 'excellent';
    if (score >= 4.0) return 'very-good';
    if (score >= 3.5) return 'good';
    if (score >= 2.5) return 'average';
    return 'poor';
  };

  const getAvatarColor = (rating) => {
    const level = getRatingLevel(rating);
    const colors = {
      excellent: {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        shadow: '0 6px 20px rgba(16, 185, 129, 0.4)'
      },
      'very-good': {
        background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
        shadow: '0 6px 20px rgba(6, 182, 212, 0.4)'
      },
      good: {
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        shadow: '0 6px 20px rgba(59, 130, 246, 0.4)'
      },
      average: {
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        shadow: '0 6px 20px rgba(245, 158, 11, 0.4)'
      },
      poor: {
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        shadow: '0 6px 20px rgba(239, 68, 68, 0.4)'
      }
    };
    return colors[level];
  };

  const getHoverColor = (rating) => {
    const level = getRatingLevel(rating);
    return `hover-${level}`;
  };

  const renderStars = (rating) => {
    const score = parseFloat(rating);
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 >= 0.5;

    return (
      <div className="stars-container">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={12}
            className={`star ${
              i < fullStars
                ? 'star-full'
                : i === fullStars && hasHalfStar
                ? 'star-half'
                : 'star-empty'
            }`}
            fill={i < fullStars || (i === fullStars && hasHalfStar) ? 'currentColor' : 'none'}
          />
        ))}
      </div>
    );
  };

  const generateInitials = (name) => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const handleViewReviews = (teacher) => {
    console.log('TeacherGrid - Opening reviews for:', teacher.name);
    openViewReviewsModal(teacher);
  };

  const handleGiveReview = (teacher) => {
    console.log('TeacherGrid - Opening give review for:', teacher.name);
    openGiveReviewModal(teacher);
  };

  if (isLoading) {
    return (
      <div className="teacher-grid-wrapper">
        <div className="grid-header">
          <div className="header-content">
            <div className="title-section">
              <div className="skeleton-title"></div>
              <div className="skeleton-subtitle"></div>
            </div>
          </div>
        </div>
        <div className="teacher-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="teacher-card-skeleton">
              <div className="skeleton-content">
                <div className="skeleton-header">
                  <div className="skeleton-avatar"></div>
                  <div className="skeleton-rating"></div>
                </div>
                <div className="skeleton-name"></div>
                <div className="skeleton-subjects">
                  <div className="skeleton-tag"></div>
                  <div className="skeleton-tag"></div>
                </div>
                <div className="skeleton-sections"></div>
                <div className="skeleton-actions">
                  <div className="skeleton-btn"></div>
                  <div className="skeleton-btn"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!teachers || teachers.length === 0) {
    return (
      <div className="teacher-grid-wrapper">
        <div className="empty-state">
          <div className="empty-icon">
            <Users size={64} />
          </div>
          <h3 className="empty-title">No Faculty Found</h3>
          <p className="empty-description">
            Try adjusting your search criteria to discover amazing educators.
          </p>
        </div>
      </div>
    );
  }

  console.log('TeacherGrid - Rendering with reviewsLastUpdated:', reviewsLastUpdated);

  return (
    <div className="teacher-grid-wrapper">
      <div className="grid-header">
        <div className="header-content">
          <div className="title-section">
            <div className="title-wrapper">
              <Sparkles className="title-icon" size={28} />
              <h1 className="grid-title">Faculty Excellence</h1>
              {reviewsLastUpdated && (
                <div className="live-indicator">
                  <div className="live-dot"></div>
                  <span>Live</span>
                </div>
              )}
            </div>
            <div className="subtitle">
              <span>Discover {teachers.length} exceptional educators</span>
              <Award size={16} className="subtitle-icon" />
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-badge">
              <Users size={16} />
              <span>{teachers.length} Teachers</span>
            </div>
            <div className="stat-badge">
              <BookOpen size={16} />
              <span>All Subjects</span>
            </div>
          </div>
        </div>
      </div>

      <div className="teacher-grid">
        {teachers.map((teacher, index) => {
          // Force fresh stats calculation on each render
          const stats = getTeacherReviewStats(teacher.id, teacher.name);
          const hasReviewed = hasReviewedTeacherInAnyYear(teacher.id);
          const canReview = canSubmitMoreReviews(teacher.id);
          const avatarStyle = getAvatarColor(stats.overallAverage);
          const hoverClass = getHoverColor(stats.overallAverage);
          
          // Use actual review count
          const actualReviewCount = stats.totalReviews || 0;

          console.log(`TeacherGrid - Teacher ${teacher.name}:`, {
            totalReviews: actualReviewCount,
            overallAverage: stats.overallAverage,
            hasReviewed,
            canReview
          });

          return (
            <div 
              key={`${teacher.id}-${reviewsLastUpdated}`} // Include reviewsLastUpdated in key to force re-render
              className={`teacher-card ${hoverClass}`}
              style={{ 
                animationDelay: `${index * 0.1}s`
              }}
            >
              {hasReviewed && (
                <div className="reviewed-badge">
                  <Check size={14} />
                </div>
              )}

              <div className="card-content">
                <div className="teacher-header">
                  <div 
                    className="teacher-avatar rating-avatar"
                    style={{ 
                      background: avatarStyle.background,
                      boxShadow: avatarStyle.shadow
                    }}
                  >
                    <span className="avatar-text">{generateInitials(teacher.name)}</span>
                  </div>
                  <div className="rating-display">
                    <div className="rating-score">{stats.overallAverage}</div>
                    {renderStars(stats.overallAverage)}
                    <div className="review-count-small">{actualReviewCount} reviews</div>
                  </div>
                </div>

                <div className="teacher-info">
                  <h3 className="teacher-name">{teacher.name}</h3>
                  
                  {teacher.subjects && teacher.subjects.length > 0 && (
                    <div className="subject-tags">
                      {teacher.subjects.slice(0, 2).map((subject, idx) => (
                        <span key={idx} className="subject-tag">
                          {subject.length > 15 ? `${subject.substring(0, 15)}...` : subject}
                        </span>
                      ))}
                      {teacher.subjects.length > 2 && (
                        <span className="subject-tag more-subjects">
                          +{teacher.subjects.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {teacher.sections && teacher.sections.length > 0 && (
                    <div className="sections-info">
                      <Users size={14} className="sections-icon" />
                      <div className="sections-pills">
                        {teacher.sections.slice(0, 4).map((section, idx) => (
                          <span key={idx} className="section-pill">{section}</span>
                        ))}
                        {teacher.sections.length > 4 && (
                          <span className="section-pill">+{teacher.sections.length - 4}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="card-actions">
                  <button
                    className="action-btn view-btn"
                    onClick={() => handleViewReviews(teacher)}
                  >
                    <Eye size={16} />
                    <span>View</span>
                  </button>
                  <button
                    className={`action-btn review-btn ${!canReview ? 'disabled' : ''}`}
                    onClick={() => canReview && handleGiveReview(teacher)}
                    disabled={!canReview}
                  >
                    <Edit3 size={16} />
                    <span>{hasReviewed ? 'Update' : 'Review'}</span>
                  </button>
                </div>
              </div>

              {/* Live update indicator for cards with recent activity */}
              {actualReviewCount > 0 && (
                <div className="card-live-indicator">
                  <div className="live-pulse"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .live-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 12px;
          padding: 4px 8px;
          font-size: 11px;
          color: #10b981;
          font-weight: 500;
          margin-left: 12px;
        }

        .live-dot {
          width: 6px;
          height: 6px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .card-live-indicator {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
        }

        .live-pulse {
          width: 100%;
          height: 100%;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { 
            opacity: 1;
            transform: scale(1);
          }
          50% { 
            opacity: 0.5;
            transform: scale(1.2);
          }
        }

        .title-wrapper {
          display: flex;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default TeacherGrid;