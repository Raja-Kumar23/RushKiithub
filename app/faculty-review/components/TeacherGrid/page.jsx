import React from 'react';
import { Eye, Edit3, Check, Star, Users, BookOpen, Calendar, Award } from 'lucide-react';
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
  setActiveSection
}) => {
  const getRatingColor = (rating) => {
    const score = parseFloat(rating);
    if (score >= 4.0) return 'excellent';
    if (score >= 3.0) return 'good';
    if (score >= 2.0) return 'average';
    return 'poor';
  };

  const getRatingText = (rating) => {
    const score = parseFloat(rating);
    if (score >= 4.0) return 'Excellent';
    if (score >= 3.0) return 'Good';
    if (score >= 2.0) return 'Average';
    return 'Poor';
  };

  const renderStars = (rating) => {
    const score = parseFloat(rating);
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="stars-container">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="star star-full" size={16} fill="currentColor" />
        ))}
        {hasHalfStar && <Star key="half" className="star star-half" size={16} fill="currentColor" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="star star-empty" size={16} />
        ))}
      </div>
    );
  };

  const generateInitials = (name) => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="teacher-grid-container">
        <div className="loading-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="teacher-card-skeleton">
              <div className="skeleton-header">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-badge"></div>
              </div>
              <div className="skeleton-content">
                <div className="skeleton-line skeleton-title"></div>
                <div className="skeleton-tags">
                  <div className="skeleton-tag"></div>
                  <div className="skeleton-tag"></div>
                </div>
                <div className="skeleton-stats">
                  <div className="skeleton-stat"></div>
                  <div className="skeleton-stat"></div>
                </div>
                <div className="skeleton-buttons">
                  <div className="skeleton-button"></div>
                  <div className="skeleton-button"></div>
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
      <div className="teacher-grid-container">
        <div className="empty-state">
          <div className="empty-icon">
            <Users size={64} />
          </div>
          <h3 className="empty-title">No Faculty Members Found</h3>
          <p className="empty-description">
            Try adjusting your search criteria or filters to discover amazing teachers.
          </p>
          <div className="empty-decoration">
            <div className="decoration-circle"></div>
            <div className="decoration-circle"></div>
            <div className="decoration-circle"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-grid-container">
      <div className="grid-header">
        <div className="grid-title-section">
          <h2 className="grid-title">Faculty Excellence</h2>
          <div className="grid-subtitle">
            <Award size={18} />
            <span>Discover {teachers.length} exceptional educators</span>
          </div>
        </div>
        <div className="grid-stats">
          <div className="stat-pill">
            <BookOpen size={16} />
            <span>{teachers.length} Teachers</span>
          </div>
        </div>
      </div>

      <div className="teacher-grid">
        {teachers.map((teacher, index) => {
          const stats = getTeacherReviewStats(teacher.id, teacher.name);
          const hasReviewed = hasReviewedTeacherInAnyYear(teacher.id);
          const canReview = canSubmitMoreReviews(teacher.id);
          const ratingColor = getRatingColor(stats.overallAverage);
          const ratingText = getRatingText(stats.overallAverage);

          return (
            <div key={teacher.id} className={`teacher-card ${ratingColor}`} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="card-background">
                <div className="bg-pattern"></div>
                <div className="bg-gradient"></div>
              </div>
              
              {hasReviewed && (
                <div className="review-indicator">
                  <Check size={14} />
                  <span>Reviewed</span>
                </div>
              )}

              <div className="card-header">
                <div className="teacher-avatar">
                  <span className="avatar-text">{generateInitials(teacher.name)}</span>
                  <div className="avatar-ring"></div>
                </div>
                <div className={`rating-badge rating-${ratingColor}`}>
                  <div className="rating-score">{stats.overallAverage}</div>
                  <div className="rating-label">{ratingText}</div>
                  <div className="rating-decoration"></div>
                </div>
              </div>

              <div className="card-body">
                <h3 className="teacher-name">{teacher.name}</h3>
                
                {teacher.subjects && teacher.subjects.length > 0 && (
                  <div className="teacher-subjects">
                    {teacher.subjects.slice(0, 2).map((subject, idx) => (
                      <span key={idx} className="subject-tag">
                        <BookOpen size={12} />
                        {subject.length > 18 ? `${subject.substring(0, 18)}...` : subject}
                      </span>
                    ))}
                    {teacher.subjects.length > 2 && (
                      <span className="subject-tag subject-more">
                        +{teacher.subjects.length - 2} more
                      </span>
                    )}
                  </div>
                )}

                {teacher.sections && teacher.sections.length > 0 && (
                  <div className="teacher-sections">
                    <div className="sections-header">
                      <Users size={14} />
                      <span>Sections</span>
                    </div>
                    <div className="sections-list">
                      {teacher.sections.slice(0, 4).map((section, idx) => (
                        <span key={idx} className="section-pill">{section}</span>
                      ))}
                      {teacher.sections.length > 4 && (
                        <span className="section-pill section-more">+{teacher.sections.length - 4}</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="stats-container">
                  <div className="stat-item">
                    <div className="stat-icon">
                      <Star size={16} />
                    </div>
                    <div className="stat-content">
                      <span className="stat-value">{stats.totalReviews}</span>
                      <span className="stat-label">Reviews</span>
                    </div>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <div className="stat-icon">
                      <Calendar size={16} />
                    </div>
                    <div className="stat-content">
                      <span className="stat-value">{stats.crossSemesterCount}</span>
                      <span className="stat-label">Semesters</span>
                    </div>
                  </div>
                </div>

                <div className="rating-stars">
                  {renderStars(stats.overallAverage)}
                  <span className="rating-text">({stats.totalReviews} reviews)</span>
                </div>
              </div>

              <div className="card-actions">
                <button
                  className="action-btn view-btn"
                  onClick={() => openViewReviewsModal(teacher)}
                >
                  <Eye size={16} />
                  <span>View Reviews</span>
                  <div className="btn-ripple"></div>
                </button>

                <button
                  className={`action-btn review-btn ${!canReview ? 'disabled' : ''}`}
                  onClick={() => canReview && openGiveReviewModal(teacher)}
                  disabled={!canReview}
                  title={!canReview ? 'Review limit reached for this teacher' : 'Give a review'}
                >
                  <Edit3 size={16} />
                  <span>{hasReviewed ? 'Update Review' : 'Write Review'}</span>
                  <div className="btn-ripple"></div>
                </button>
              </div>

              <div className="card-hover-effect"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherGrid;