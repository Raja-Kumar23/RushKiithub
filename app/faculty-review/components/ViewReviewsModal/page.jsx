import React, { useMemo, useEffect, useState } from 'react';
import './styles.css';

const ViewReviewsModal = ({ 
  selectedTeacher, 
  setShowViewReviewsModal, 
  getTeacherReviewStats, 
  calculateAverage,
  reviewsLastUpdated
}) => {
  const [forceUpdate, setForceUpdate] = useState(0);

  // Force component to re-render when reviewsLastUpdated changes
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [reviewsLastUpdated]);

  // Use useMemo with forceUpdate to ensure stats are recalculated
  const stats = useMemo(() => {
    console.log('ViewReviewsModal - Recalculating stats for:', selectedTeacher.name);
    const calculatedStats = getTeacherReviewStats(selectedTeacher.id, selectedTeacher.name);
    console.log('ViewReviewsModal - New stats:', {
      teacherName: selectedTeacher.name,
      totalReviews: calculatedStats.totalReviews,
      overallAverage: calculatedStats.overallAverage,
      reviewsCount: calculatedStats.teacherReviews?.length || 0
    });
    return calculatedStats;
  }, [selectedTeacher.id, selectedTeacher.name, getTeacherReviewStats, forceUpdate, reviewsLastUpdated]);
  
  const getRatingColor = (rating) => {
    const score = parseFloat(rating);
    if (score >= 3.5) return 'excellent';
    if (score >= 2.5) return 'good';
    if (score >= 1.5) return 'average';
    return 'poor';
  };

  const getRatingText = (rating) => {
    const score = parseFloat(rating);
    if (score >= 3.5) return 'Excellent';
    if (score >= 2.5) return 'Good';
    if (score >= 1.5) return 'Average';
    return 'Poor';
  };

  const renderStars = (rating) => {
    const score = parseFloat(rating);
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

  const renderRatingBar = (category, average, ratings) => {
    const total = Object.values(ratings).reduce((sum, count) => sum + count, 0);
    const ratingColor = getRatingColor(average);
    
    return (
      <div className={`rating-category ${ratingColor}`}>
        <div className="category-header">
          <h4>{category}</h4>
          <div className="category-score">
            <span className="score-value">{average}</span>
            <div className="score-stars">
              {renderStars(parseFloat(average))}
            </div>
          </div>
        </div>
        
        <div className="rating-breakdown">
          {Object.entries(ratings).map(([level, count]) => {
            const percentage = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={level} className="rating-level">
                <span className="level-label">{level}</span>
                <div className="level-bar">
                  <div 
                    className={`level-fill ${level}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="level-count">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter reviews with actual comments - using useMemo for performance
  const reviewsWithComments = useMemo(() => {
    const filtered = stats.teacherReviews ? 
      stats.teacherReviews.filter(review => review.comment && review.comment.trim()) : [];
    
    console.log('ViewReviewsModal - Reviews with comments:', filtered.length, 'out of', stats.teacherReviews?.length || 0);
    return filtered;
  }, [stats.teacherReviews]);
  
  // Use actual total reviews count
  const actualTotalReviews = stats.totalReviews || 0;

  console.log('ViewReviewsModal - Rendering with:', {
    teacherName: selectedTeacher.name,
    totalReviews: actualTotalReviews,
    reviewsWithComments: reviewsWithComments.length,
    overallAverage: stats.overallAverage,
    forceUpdate
  });

  return (
    <div className="view-reviews-modal-overlay" onClick={() => setShowViewReviewsModal(false)}>
      <div className="view-reviews-modal large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="teacher-header">
            <div className="teacher-avatar-large">
              {selectedTeacher.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase()}
            </div>
            
            <div className="teacher-title-info">
              <h2>{selectedTeacher.name}</h2>
              
              <div className="teacher-meta">
                {selectedTeacher.subjects && (
                  <div className="subjects-list">
                    {selectedTeacher.subjects.slice(0, 3).map((subject, index) => (
                      <span key={index} className="subject-pill">
                        {subject.length > 20 ? `${subject.substring(0, 20)}...` : subject}
                      </span>
                    ))}
                  </div>
                )}
                
                {selectedTeacher.sections && (
                  <div className="sections-info">
                    <span className="sections-label">Sections:</span>
                    {selectedTeacher.sections.slice(0, 5).map((section, index) => (
                      <span key={index} className="section-badge">{section}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="overall-rating">
            <div className="rating-circle">
              <span className="rating-value">{stats.overallAverage}</span>
            </div>
            <div className="rating-info">
              <div className="rating-stars-large">
                {renderStars(parseFloat(stats.overallAverage))}
              </div>
              <span className="rating-text">{getRatingText(stats.overallAverage)}</span>
              <span className="review-count">{actualTotalReviews} reviews</span>
            </div>
          </div>
          
          <button 
            className="close-modal-btn"
            onClick={() => setShowViewReviewsModal(false)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body split-layout">
          {/* Left Side - Ratings Overview */}
          <div className="ratings-section">
            <div className="ratings-overview">
              <h3>Rating Breakdown</h3>
              <div className="ratings-stats-summary">
                <div className="stat-item">
                  <span className="stat-number">{actualTotalReviews}</span>
                  <span className="stat-label">Total Reviews</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{reviewsWithComments.length}</span>
                  <span className="stat-label">With Comments</span>
                </div>
                {stats.crossSemesterCount > 1 && (
                  <div className="stat-item">
                    <span className="stat-number">{stats.crossSemesterCount}</span>
                    <span className="stat-label">Semesters</span>
                  </div>
                )}
              </div>
              <div className="ratings-grid">
                {renderRatingBar('Teaching Style', stats.averages.teachingStyle, stats.ratings.teachingStyle)}
                {renderRatingBar('Marking Style', stats.averages.markingStyle, stats.ratings.markingStyle)}
                {renderRatingBar('Student Friendliness', stats.averages.studentFriendliness, stats.ratings.studentFriendliness)}
                {renderRatingBar('Attendance Approach', stats.averages.attendanceApproach, stats.ratings.attendanceApproach)}
              </div>
            </div>
          </div>

          {/* Right Side - Comments */}
          <div className="comments-section">
            <div className="comments-header">
              <h3>Student Comments</h3>
              <div className="comments-stats">
                <span className="comments-count">{reviewsWithComments.length} comments</span>
                {actualTotalReviews > 0 && (
                  <span className="comments-percentage">
                    ({Math.round((reviewsWithComments.length / actualTotalReviews) * 100)}% with comments)
                  </span>
                )}
              </div>
            </div>
            
            <div className="comments-list">
              {reviewsWithComments.length > 0 ? (
                reviewsWithComments
                  .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)) // Sort by newest first
                  .map((review, index) => (
                    <div key={review.id || `review-${index}-${review.timestamp}`} className="comment-card">
                      <div className="comment-text">
                        <p>"{review.comment}"</p>
                      </div>
                      <div className="comment-meta">
                        <span className="comment-date">{formatDate(review.timestamp)}</span>
                        <div className="comment-ratings">
                          <span className={`rating-badge ${review.teachingStyle || 'average'}`}>
                            T: {(review.teachingStyle || 'avg').charAt(0).toUpperCase()}
                          </span>
                          <span className={`rating-badge ${review.markingStyle || 'average'}`}>
                            M: {(review.markingStyle || 'avg').charAt(0).toUpperCase()}
                          </span>
                          <span className={`rating-badge ${review.studentFriendliness || 'average'}`}>
                            F: {(review.studentFriendliness || 'avg').charAt(0).toUpperCase()}
                          </span>
                          <span className={`rating-badge ${review.attendanceApproach || 'average'}`}>
                            A: {(review.attendanceApproach || 'avg').charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      {!review.anonymous && review.studentName && (
                        <div className="comment-author">
                          <span className="author-name">- {review.studentName}</span>
                        </div>
                      )}
                    </div>
                  ))
              ) : actualTotalReviews > 0 ? (
                <div className="no-comments">
                  <div className="no-comments-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <h4>No Comments Yet</h4>
                  <p>Students have rated {selectedTeacher.name} but haven't left written comments yet. Be the first to share your thoughts!</p>
                </div>
              ) : (
                <div className="no-comments">
                  <div className="no-comments-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <h4>No Reviews Yet</h4>
                  <p>Be the first to review {selectedTeacher.name} and help other students!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live update indicator */}
        <div className="live-update-indicator">
          <div className="live-dot"></div>
          <span>Live Updates</span>
          <small>Last updated: {new Date(reviewsLastUpdated).toLocaleTimeString()}</small>
        </div>

        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ 
            position: 'fixed', 
            bottom: '10px', 
            right: '10px', 
            background: 'rgba(0,0,0,0.8)', 
            color: 'white', 
            padding: '10px', 
            fontSize: '12px',
            borderRadius: '4px',
            zIndex: 9999
          }}>
            <div>Teacher: {selectedTeacher.name}</div>
            <div>Total Reviews: {actualTotalReviews}</div>
            <div>Comments: {reviewsWithComments.length}</div>
            <div>Overall: {stats.overallAverage}</div>
            <div>Force Update: {forceUpdate}</div>
            <div>Last Updated: {new Date(reviewsLastUpdated).toLocaleTimeString()}</div>
          </div>
        )}
      </div>

      <style jsx>{`
        .live-update-indicator {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 20px;
          padding: 6px 12px;
          font-size: 12px;
          color: #10b981;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .live-update-indicator small {
          color: #6b7280;
          margin-left: 8px;
        }
      `}</style>
    </div>
  );
};

export default ViewReviewsModal;