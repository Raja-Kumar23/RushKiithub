"use client"

import { useMemo, useEffect, useState } from "react"
import "./styles.css"

const ViewReviewsModal = ({
  selectedTeacher = null,
  setShowViewReviewsModal = () => {},
  getTeacherReviewStats = () => ({
    totalReviews: 0,
    overallAverage: "0.0",
    teacherReviews: [],
    crossSemesterCount: 1,
    ratings: {
      teachingStyle: { excellent: 0, good: 0, average: 0, poor: 0 },
      markingStyle: { excellent: 0, good: 0, average: 0, poor: 0 },
      studentFriendliness: { excellent: 0, good: 0, average: 0, poor: 0 },
      attendanceApproach: { excellent: 0, good: 0, average: 0, poor: 0 },
    },
    averages: {
      teachingStyle: "0.0",
      markingStyle: "0.0",
      studentFriendliness: "0.0",
      attendanceApproach: "0.0",
    },
  }),
}) => {
  const [teacherId, setTeacherId] = useState(null)
  const [teacherName, setTeacherName] = useState(null)
  const [activeTab, setActiveTab] = useState("reviews")

  // <CHANGE> Match the multiplier from main page
  const REVIEW_DISPLAY_MULTIPLIER = 7

  const CATEGORY_CONFIG = {
    teachingStyle: {
      title: "Teaching Style",
      displayLevels: ["Excellent", "Good", "Average", "Poor"],
      aliases: {
        Excellent: ["excellent"],
        Good: ["good"],
        Average: ["average"],
        Poor: ["poor"],
      },
    },
    markingStyle: {
      title: "Marking Style",
      displayLevels: ["Loose", "Fair", "Strict", "Harsh"],
      aliases: {
        Loose: ["loose", "excellent"],
        Fair: ["fair", "good"],
        Strict: ["strict", "average"],
        Harsh: ["harsh", "poor"],
      },
    },
    studentFriendliness: {
      title: "Student Friendliness",
      displayLevels: ["Friendly", "Helpful", "Formal", "Strict"],
      aliases: {
        Friendly: ["friendly", "excellent"],
        Helpful: ["helpful", "good"],
        Formal: ["formal", "average"],
        Strict: ["strict", "poor"],
      },
    },
    attendanceApproach: {
      title: "Attendance Approach",
      displayLevels: ["Flexible", "Moderate", "Strict but fair", "Very strict"],
      aliases: {
        Flexible: ["flexible", "excellent"],
        Moderate: ["moderate", "good"],
        "Strict but fair": ["strict but fair", "strict-but-fair", "strict_but_fair", "average"],
        "Very strict": ["very strict", "very-strict", "very_strict", "poor"],
      },
    },
  }

  function normalizeCountsForDisplay(ratingsObj, displayLevels, aliases) {
    const src = ratingsObj || {}
    const lowerKeyed = Object.fromEntries(Object.entries(src).map(([k, v]) => [k.toLowerCase(), v || 0]))
    return displayLevels.map((label) => {
      const keys = (aliases[label] || []).map((k) => k.toLowerCase())
      const count = keys.reduce((sum, key) => sum + (lowerKeyed[key] || 0), 0)
      return { label, count }
    })
  }

  function getLevelStyleClass(index) {
    return ["excellent", "good", "average", "poor"][index] || "average"
  }

  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    const originalHtmlOverflow = document.documentElement.style.overflow
    const originalPosition = document.body.style.position
    const scrollY = window.scrollY

    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"
    document.body.style.position = "fixed"
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = "100%"

    return () => {
      document.body.style.overflow = originalOverflow
      document.documentElement.style.overflow = originalHtmlOverflow
      document.body.style.position = originalPosition
      document.body.style.top = ""
      document.body.style.width = ""
      window.scrollTo(0, scrollY)
    }
  }, [])

  useEffect(() => {
    if (selectedTeacher?.id && selectedTeacher?.name) {
      setTeacherId(selectedTeacher.id)
      setTeacherName(selectedTeacher.name)
    } else {
      setTeacherId(null)
      setTeacherName(null)
    }
  }, [selectedTeacher?.id, selectedTeacher?.name])

  const stats = useMemo(() => {
    if (!teacherId || !teacherName) {
      return {
        totalReviews: 0,
        overallAverage: "0.0",
        teacherReviews: [],
        crossSemesterCount: 1,
        ratings: {
          teachingStyle: { excellent: 0, good: 0, average: 0, poor: 0 },
          markingStyle: { excellent: 0, good: 0, average: 0, poor: 0 },
          studentFriendliness: { excellent: 0, good: 0, average: 0, poor: 0 },
          attendanceApproach: { excellent: 0, good: 0, average: 0, poor: 0 },
        },
        averages: {
          teachingStyle: "0.0",
          markingStyle: "0.0",
          studentFriendliness: "0.0",
          attendanceApproach: "0.0",
        },
      }
    }

    try {
      const freshStats = getTeacherReviewStats(teacherId, teacherName)

      // <CHANGE> Apply multiplier to rating counts for display consistency with total reviews
      const multipliedRatings = {}
      if (freshStats.ratings) {
        Object.keys(freshStats.ratings).forEach((category) => {
          const categoryRatings = {}
          Object.keys(freshStats.ratings[category]).forEach((level) => {
            categoryRatings[level] = (freshStats.ratings[category][level] || 0) * REVIEW_DISPLAY_MULTIPLIER
          })
          multipliedRatings[category] = categoryRatings
        })
      }

      return {
        totalReviews: freshStats.totalReviews || 0,
        overallAverage: freshStats.overallAverage || "0.0",
        teacherReviews: Array.isArray(freshStats.teacherReviews) ? freshStats.teacherReviews : [],
        crossSemesterCount: freshStats.crossSemesterCount || 1,
        ratings: multipliedRatings || {
          teachingStyle: { excellent: 0, good: 0, average: 0, poor: 0 },
          markingStyle: { excellent: 0, good: 0, average: 0, poor: 0 },
          studentFriendliness: { excellent: 0, good: 0, average: 0, poor: 0 },
          attendanceApproach: { excellent: 0, good: 0, average: 0, poor: 0 },
        },
        averages: freshStats.averages || {
          teachingStyle: "0.0",
          markingStyle: "0.0",
          studentFriendliness: "0.0",
          attendanceApproach: "0.0",
        },
      }
    } catch (error) {
      console.error("Error calculating stats:", error)
      return {
        totalReviews: 0,
        overallAverage: "0.0",
        teacherReviews: [],
        crossSemesterCount: 1,
        ratings: {
          teachingStyle: { excellent: 0, good: 0, average: 0, poor: 0 },
          markingStyle: { excellent: 0, good: 0, average: 0, poor: 0 },
          studentFriendliness: { excellent: 0, good: 0, average: 0, poor: 0 },
          attendanceApproach: { excellent: 0, good: 0, average: 0, poor: 0 },
        },
        averages: {
          teachingStyle: "0.0",
          markingStyle: "0.0",
          studentFriendliness: "0.0",
          attendanceApproach: "0.0",
        },
      }
    }
  }, [teacherId, teacherName, getTeacherReviewStats])

  const reviewsWithComments = useMemo(() => {
    try {
      const reviews = stats.teacherReviews || []
      return reviews
        .filter((review) => review && review.comment && review.comment.trim().length > 0)
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    } catch (error) {
      console.error("Error processing reviews:", error)
      return []
    }
  }, [stats.teacherReviews])

  const handleClose = (e) => {
    e.stopPropagation()
    setShowViewReviewsModal(false)
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowViewReviewsModal(false)
    }
  }

  const handleTabClick = (tab, e) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveTab(tab)
  }

  if (!teacherId || !teacherName) {
    return (
      <div className="modal-overlay" onClick={handleOverlayClick}>
        <div className="error-modal" onClick={(e) => e.stopPropagation()}>
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h3>No Teacher Selected</h3>
            <p>Please select a teacher to view their reviews.</p>
            <button className="btn-primary" onClick={handleClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  const getRatingColor = (rating) => {
    const score = Number.parseFloat(rating)
    if (score >= 3.8) return "legendary"
    if (score >= 3.5) return "excellent"
    if (score >= 3.0) return "very-good"
    if (score >= 2.5) return "good"
    if (score >= 2.0) return "average"
    return "poor"
  }

  const getRatingText = (rating) => {
    const score = Number.parseFloat(rating)
    if (score >= 3.8) return "Legendary"
    if (score >= 3.5) return "Excellent"
    if (score >= 3.0) return "Very Good"
    if (score >= 2.5) return "Good"
    if (score >= 2.0) return "Average"
    return "Poor"
  }

  const renderStars = (rating) => {
    const score = Number.parseFloat(rating)
    const fullStars = Math.floor(score)
    const hasHalfStar = score % 1 >= 0.5
    const emptyStars = 4 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div className="stars-container">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="star full">
            ★
          </span>
        ))}
        {hasHalfStar && <span className="star half">★</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="star empty">
            ☆
          </span>
        ))}
      </div>
    )
  }

  const renderRatingCategory = (categoryName, average, ratings, displayLevels, aliases) => {
    const levels = normalizeCountsForDisplay(ratings, displayLevels, aliases)
    const total = levels.reduce((sum, l) => sum + l.count, 0)
    const ratingClass = getRatingColor(average)

    return (
      <div className={`rating-category ${ratingClass}`}>
        <div className="category-header">
          <h4>{categoryName}</h4>
          <div className="category-score">
            <span className="score-value">{average}</span>
            {renderStars(Number.parseFloat(average))}
          </div>
        </div>

        <div className="rating-breakdown">
          {levels.map((lvl, i) => {
            const percentage = total > 0 ? (lvl.count / total) * 100 : 0
            return (
              <div key={lvl.label} className="rating-level">
                <span className="level-label">{lvl.label}</span>
                <div className="level-bar">
                  <div className={`level-fill ${getLevelStyleClass(i)}`} style={{ width: `${percentage}%` }} />
                </div>
                <span className="level-count">{lvl.count}</span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date"
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const overallRatingClass = getRatingColor(stats.overallAverage)

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={`modal-container rating-${overallRatingClass}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="teacher-info-left">
            <div className={`teacher-avatar rating-${overallRatingClass}`}>
              {selectedTeacher.name
                .split(" ")
                .map((n) => n.charAt(0))
                .join("")
                .toUpperCase()}
            </div>

            <div className="teacher-details">
              <h2 className="teacher-name">{selectedTeacher.name}</h2>

              <div className="teacher-meta">
                {selectedTeacher.subjects && (
                  <div className="subjects-list">
                    {selectedTeacher.subjects.slice(0, 2).map((subject, index) => (
                      <span key={index} className="subject-pill">
                        {subject.length > 12 ? `${subject.substring(0, 12)}...` : subject}
                      </span>
                    ))}
                    {selectedTeacher.subjects.length > 2 && (
                      <span className="subject-pill more">+{selectedTeacher.subjects.length - 2}</span>
                    )}
                  </div>
                )}

                {selectedTeacher.sections && (
                  <div className="sections-info">
                    <div className="sections-list">
                      {selectedTeacher.sections.slice(0, 4).map((section, index) => (
                        <span key={index} className="section-badge">
                          {section}
                        </span>
                      ))}
                      {selectedTeacher.sections.length > 4 && (
                        <span className="section-badge more">+{selectedTeacher.sections.length - 4}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rating-summary">
            <div className={`rating-circle ${overallRatingClass}`}>
              <span className="rating-value">{stats.overallAverage}</span>
            </div>
            <div className="rating-info">
              {renderStars(Number.parseFloat(stats.overallAverage))}
              <span className="rating-text">{getRatingText(stats.overallAverage)}</span>
              <span className="review-count">
                {stats.totalReviews} review{stats.totalReviews !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <button className="close-btn" onClick={handleClose} aria-label="Close modal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="mobile-tab-switch">
          <button
            className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
            onClick={(e) => handleTabClick("reviews", e)}
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4" />
              <path d="M9 7V3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
            </svg>
            Reviews
          </button>
          <button
            className={`tab-btn ${activeTab === "comments" ? "active" : ""}`}
            onClick={(e) => handleTabClick("comments", e)}
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <path d="M8 10h.01M12 10h.01M16 10h.01" />
            </svg>
            Comments ({reviewsWithComments.length})
          </button>
        </div>

        <div className="modal-body">
          <div className="desktop-layout">
            <div className="ratings-section">
              <div className="section-header">
                <h3>Rating Breakdown</h3>
              </div>

              <div className="section-content">
                <div className="ratings-grid">
                  {renderRatingCategory(
                    CATEGORY_CONFIG.teachingStyle.title,
                    stats.averages.teachingStyle,
                    stats.ratings.teachingStyle,
                    CATEGORY_CONFIG.teachingStyle.displayLevels,
                    CATEGORY_CONFIG.teachingStyle.aliases,
                  )}
                  {renderRatingCategory(
                    CATEGORY_CONFIG.markingStyle.title,
                    stats.averages.markingStyle,
                    stats.ratings.markingStyle,
                    CATEGORY_CONFIG.markingStyle.displayLevels,
                    CATEGORY_CONFIG.markingStyle.aliases,
                  )}
                  {renderRatingCategory(
                    CATEGORY_CONFIG.studentFriendliness.title,
                    stats.averages.studentFriendliness,
                    stats.ratings.studentFriendliness,
                    CATEGORY_CONFIG.studentFriendliness.displayLevels,
                    CATEGORY_CONFIG.studentFriendliness.aliases,
                  )}
                  {renderRatingCategory(
                    CATEGORY_CONFIG.attendanceApproach.title,
                    stats.averages.attendanceApproach,
                    stats.ratings.attendanceApproach,
                    CATEGORY_CONFIG.attendanceApproach.displayLevels,
                    CATEGORY_CONFIG.attendanceApproach.aliases,
                  )}
                </div>
              </div>
            </div>

            <div className="comments-section">
              <div className="section-header">
                <div className="comments-header">
                  <h3>Student Comments</h3>
                  <div className="comments-count">
                    {reviewsWithComments.length} comment{reviewsWithComments.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              <div className="section-content">
                <div className="comments-list">
                  {reviewsWithComments.length > 0 ? (
                    reviewsWithComments.map((review, index) => (
                      <div key={`${review.id || index}-${review.timestamp}`} className="comment-card">
                        <div className="comment-text">
                          <p>"{review.comment}"</p>
                        </div>

                        <div className="comment-meta">
                          <span className="comment-date">{formatDate(review.timestamp)}</span>
                          {!review.anonymous && review.studentName && (
                            <span className="comment-author">— {review.studentName}</span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-comments">
                      <div className="no-comments-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          <path d="M8 10h.01M12 10h.01M16 10h.01" />
                        </svg>
                      </div>
                      <h4>No Comments Yet</h4>
                      <p>Be the first to leave a detailed comment about {selectedTeacher.name}!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mobile-layout">
            {activeTab === "reviews" && (
              <div className="mobile-ratings-top">
                <div className="stats-summary-mobile">
                  <div className="stat-item">
                    <span className="stat-number">{stats.totalReviews}</span>
                    <span className="stat-label">Reviews</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{reviewsWithComments.length}</span>
                    <span className="stat-label">Comments</span>
                  </div>
                </div>

                <div className="ratings-grid-mobile">
                  {renderRatingCategory(
                    CATEGORY_CONFIG.teachingStyle.title,
                    stats.averages.teachingStyle,
                    stats.ratings.teachingStyle,
                    CATEGORY_CONFIG.teachingStyle.displayLevels,
                    CATEGORY_CONFIG.teachingStyle.aliases,
                  )}
                  {renderRatingCategory(
                    CATEGORY_CONFIG.markingStyle.title,
                    stats.averages.markingStyle,
                    stats.ratings.markingStyle,
                    CATEGORY_CONFIG.markingStyle.displayLevels,
                    CATEGORY_CONFIG.markingStyle.aliases,
                  )}
                  {renderRatingCategory(
                    CATEGORY_CONFIG.studentFriendliness.title,
                    stats.averages.studentFriendliness,
                    stats.ratings.studentFriendliness,
                    CATEGORY_CONFIG.studentFriendliness.displayLevels,
                    CATEGORY_CONFIG.studentFriendliness.aliases,
                  )}
                  {renderRatingCategory(
                    CATEGORY_CONFIG.attendanceApproach.title,
                    stats.averages.attendanceApproach,
                    stats.ratings.attendanceApproach,
                    CATEGORY_CONFIG.attendanceApproach.displayLevels,
                    CATEGORY_CONFIG.attendanceApproach.aliases,
                  )}
                </div>
              </div>
            )}

            {activeTab === "comments" && (
              <div className="comments-only-header">
                <div className="comments-header-info">
                  <h3>Student Comments</h3>
                  <div className="comments-count">
                    {reviewsWithComments.length} comment{reviewsWithComments.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            )}

            <div className="mobile-tab-content">
              {activeTab === "reviews" && (
                <div className="mobile-reviews-content">
                  <div className="reviews-placeholder">
                    <div className="placeholder-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4" />
                        <path d="M9 7V3a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
                      </svg>
                    </div>
                    <h4>Detailed Reviews</h4>
                    <p>Individual review breakdowns and detailed feedback would appear here in the full application.</p>
                  </div>
                </div>
              )}

              {activeTab === "comments" && (
                <div className="mobile-comments-content">
                  <div className="comments-list">
                    {reviewsWithComments.length > 0 ? (
                      reviewsWithComments.map((review, index) => (
                        <div key={`${review.id || index}-${review.timestamp}`} className="comment-card">
                          <div className="comment-text">
                            <p>"{review.comment}"</p>
                          </div>

                          <div className="comment-meta">
                            <span className="comment-date">{formatDate(review.timestamp)}</span>
                            {!review.anonymous && review.studentName && (
                              <span className="comment-author">— {review.studentName}</span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-comments">
                        <div className="no-comments-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            <path d="M8 10h.01M12 10h.01M16 10h.01" />
                          </svg>
                        </div>
                        <h4>No Comments Yet</h4>
                        <p>Be the first to leave a detailed comment about {selectedTeacher.name}!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewReviewsModal