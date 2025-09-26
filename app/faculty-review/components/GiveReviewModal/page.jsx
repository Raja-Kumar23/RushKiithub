"use client"

import { useState } from "react"
import "./styles.css"

const GiveReviewModal = ({
  selectedTeacher,
  setShowGiveReviewModal,
  submitReview,
  hasPremiumAccess,
  canSubmitMoreReviews,
  getUserReviewLimit,
  getUserReviewCount,
}) => {
  const [formData, setFormData] = useState({
    teachingStyle: "",
    markingStyle: "",
    studentFriendliness: "",
    attendanceApproach: "",
    comment: "",
    anonymous: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const ratingOptions = [
    { value: "excellent", label: "Excellent", color: "#4caf50", icon: "😍" },
    { value: "good", label: "Good", color: "#8bc34a", icon: "😊" },
    { value: "average", label: "Average", color: "#ff9800", icon: "😐" },
    { value: "poor", label: "Poor", color: "#f44336", icon: "😞" },
  ]

  const categories = [
    {
      key: "teachingStyle",
      label: "Teaching Style",
      description: "How well does the teacher explain concepts and engage students?",
      icon: "👨‍🏫",
    },
    {
      key: "markingStyle",
      label: "Marking Style",
      description: "How fair and consistent is the teacher's grading?",
      icon: "📝",
    },
    {
      key: "studentFriendliness",
      label: "Student Friendliness",
      description: "How approachable and helpful is the teacher?",
      icon: "🤝",
    },
    {
      key: "attendanceApproach",
      label: "Attendance Approach",
      description: "How does the teacher handle attendance and punctuality?",
      icon: "📅",
    },
  ]

  // Early return if selectedTeacher is not available
  if (!selectedTeacher) {
    return null
  }

  const handleRatingChange = (category, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]: value,
    }))

    // Clear error for this category
    if (errors[category]) {
      setErrors((prev) => ({
        ...prev,
        [category]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    categories.forEach((category) => {
      if (!formData[category.key]) {
        newErrors[category.key] = `Please rate ${category.label}`
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Check if we can submit more reviews and selectedTeacher exists
    if (!selectedTeacher?.id || !canSubmitMoreReviews?.(selectedTeacher.id)) {
      return
    }

    setIsSubmitting(true)

    try {
      console.log("GiveReviewModal - Submitting review with data:", formData)
      await submitReview(formData)
      console.log("GiveReviewModal - Review submitted successfully")

      // Reset form after successful submission
      setFormData({
        teachingStyle: "",
        markingStyle: "",
        studentFriendliness: "",
        attendanceApproach: "",
        comment: "",
        anonymous: false,
      })
    } catch (error) {
      console.error("GiveReviewModal - Error submitting review:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Safe checks for all dependent values
  const canSubmit = selectedTeacher?.id && canSubmitMoreReviews?.(selectedTeacher.id)
  const reviewLimit = getUserReviewLimit?.() || 0
  const currentCount = selectedTeacher?.id ? getUserReviewCount?.(selectedTeacher.id) || 0 : 0

  // Safe teacher name handling
  const teacherInitials = selectedTeacher?.name
    ? selectedTeacher.name
        .split(" ")
        .map((n) => n.charAt(0))
        .join("")
        .toUpperCase()
    : "?"

  return (
    <div className="give-review-modal-overlay" onClick={() => setShowGiveReviewModal?.(false)}>
      <div className="give-review-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="teacher-info">
            <div className="teacher-avatar">
              <span className="avatar-inner">{teacherInitials}</span>
            </div>
            <div className="teacher-details">
              <h2>Review {selectedTeacher?.name || "Teacher"}</h2>
              <p>Share your experience to help other students</p>
              {!canSubmit && (
                <div className="review-status-warning">
                  Review limit reached: {currentCount}/{reviewLimit}
                </div>
              )}
            </div>
          </div>

          <button className="close-btn" onClick={() => setShowGiveReviewModal?.(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {!canSubmit && (
            <div className="review-limit-warning">
              <div className="warning-icon">⚠️</div>
              <div className="warning-content">
                <h3>Review Limit Reached</h3>
                <p>
                  You have submitted {currentCount} out of {reviewLimit} allowed reviews for this teacher.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="review-form">
            <div className="form-sections">
              {categories.map((category) => (
                <div key={category.key} className="rating-section">
                  <div className="section-header">
                    <div className="section-title">
                      <span className="section-icon">{category.icon}</span>
                      <div>
                        <h3>{category.label}</h3>
                        <p>{category.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="rating-options">
                    {ratingOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`rating-option ${formData[category.key] === option.value ? "selected" : ""}`}
                      >
                        <input
                          type="radio"
                          name={category.key}
                          value={option.value}
                          checked={formData[category.key] === option.value}
                          onChange={(e) => handleRatingChange(category.key, e.target.value)}
                          disabled={!canSubmit}
                        />
                        <div className="option-content">
                          <span className="option-emoji">{option.icon}</span>
                          <span className="option-label">{option.label}</span>
                        </div>
                        <div className="option-indicator"></div>
                      </label>
                    ))}
                  </div>

                  {errors[category.key] && <div className="error-message">{errors[category.key]}</div>}
                </div>
              ))}
            </div>

            <div className="comment-section">
              <div className="section-header">
                <div className="section-title">
                  <span className="section-icon">💬</span>
                  <div>
                    <h3>Additional Comments</h3>
                    <p>Share any specific feedback or experiences (optional)</p>
                  </div>
                </div>
              </div>

              <textarea
                className="comment-textarea"
                placeholder="Write your detailed review here... (optional)"
                value={formData.comment}
                onChange={(e) => setFormData((prev) => ({ ...prev, comment: e.target.value }))}
                rows={4}
                maxLength={500}
                disabled={!canSubmit}
              />

              <div className="character-count">{formData.comment.length}/500 characters</div>
            </div>

            <div className="privacy-section">
              <label className="privacy-option">
                <input
                  type="checkbox"
                  checked={formData.anonymous}
                  onChange={(e) => setFormData((prev) => ({ ...prev, anonymous: e.target.checked }))}
                  disabled={!canSubmit}
                />
                <div className="checkbox-custom"></div>
                <div className="privacy-content">
                  <span className="privacy-title">Submit anonymously</span>
                  <span className="privacy-description">Your name will not be shown with this review</span>
                </div>
              </label>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowGiveReviewModal?.(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={`submit-btn ${!canSubmit ? "disabled" : ""}`}
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7v10c0 5.55 3.84 9.95 9 11 5.16-1.05 9-5.45 9-11V7l-10-5z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                    Submit Review
                  </>
                )}
              </button>
            </div>

            {/* Real-time feedback indicator */}
            <div className="realtime-notice">
              <div className="notice-icon">
                <div className="pulse-dot"></div>
              </div>
              <span>Your review will appear instantly to other students</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default GiveReviewModal
