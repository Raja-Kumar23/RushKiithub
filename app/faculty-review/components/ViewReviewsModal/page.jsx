import React from 'react';
import './styles.css';

const ViewReviewsModal = ({ 
  selectedTeacher, 
  setShowViewReviewsModal, 
  getTeacherReviewStats, 
  calculateAverage 
}) => {
  const stats = getTeacherReviewStats(selectedTeacher.id, selectedTeacher.name);
  
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
      day: 'numeric'
    });
  };

  return (
    <div className="view-reviews-modal-overlay" onClick={() => setShowViewReviewsModal(false)}>
      <div className="view-reviews-modal" onClick={(e) => e.stopPropagation()}>
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
              <span className="review-count">{stats.totalReviews} reviews</span>
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

        <div className="modal-body">
          <div className="ratings-overview">
            <h3>Rating Breakdown</h3>
            <div className="ratings-grid">
              {renderRatingBar('Teaching Style', stats.averages.teachingStyle, stats.ratings.teachingStyle)}
              {renderRatingBar('Marking Style', stats.averages.markingStyle, stats.ratings.markingStyle)}
              {renderRatingBar('Student Friendliness', stats.averages.studentFriendliness, stats.ratings.studentFriendliness)}
              {renderRatingBar('Attendance Approach', stats.averages.attendanceApproach, stats.ratings.attendanceApproach)}
            </div>
          </div>

          <div className="reviews-section">
            <div className="reviews-header">
              <h3>Student Reviews</h3>
              <div className="reviews-stats">
                <span className="total-reviews">{stats.totalReviews} total reviews</span>
                {stats.crossSemesterCount > 1 && (
                  <span className="cross-semester">Across {stats.crossSemesterCount} semesters</span>
                )}
              </div>
            </div>
            
            <div className="reviews-list">
              {stats.teacherReviews && stats.teacherReviews.length > 0 ? (
                stats.teacherReviews.map((review, index) => (
                  <div key={index} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">
                          {review.anonymous ? '?' : (review.studentName?.charAt(0)?.toUpperCase() || 'A')}
                        </div>
                        <div className="reviewer-details">
                          <span className="reviewer-name">
                            {review.anonymous ? 'Anonymous Student' : (review.studentName || 'Anonymous')}
                          </span>
                          <span className="review-date">{formatDate(review.timestamp)}</span>
                        </div>
                      </div>
                      
                      <div className="review-ratings">
                        <div className="rating-item">
                          <span className="rating-label">Teaching</span>
                          <span className={`rating-value ${review.teachingStyle || 'average'}`}>
                            {(review.teachingStyle || 'average').charAt(0).toUpperCase() + (review.teachingStyle || 'average').slice(1)}
                          </span>
                        </div>
                        <div className="rating-item">
                          <span className="rating-label">Marking</span>
                          <span className={`rating-value ${review.markingStyle || 'average'}`}>
                            {(review.markingStyle || 'average').charAt(0).toUpperCase() + (review.markingStyle || 'average').slice(1)}
                          </span>
                        </div>
                        <div className="rating-item">
                          <span className="rating-label">Friendly</span>
                          <span className={`rating-value ${review.studentFriendliness || 'average'}`}>
                            {(review.studentFriendliness || 'average').charAt(0).toUpperCase() + (review.studentFriendliness || 'average').slice(1)}
                          </span>
                        </div>
                        <div className="rating-item">
                          <span className="rating-label">Attendance</span>
                          <span className={`rating-value ${review.attendanceApproach || 'average'}`}>
                            {(review.attendanceApproach || 'average').charAt(0).toUpperCase() + (review.attendanceApproach || 'average').slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {review.comment && (
                      <div className="review-comment">
                        <p>"{review.comment}"</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="no-reviews">
                  <div className="no-reviews-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </div>
                  <h4>No Reviews Yet</h4>
                  <p>Be the first to review {selectedTeacher.name}!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReviewsModal;