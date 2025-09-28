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
    { value: "excellent", label: "Excellent", color: "#10b981", icon: "😍" },
    { value: "good", label: "Good", color: "#3b82f6", icon: "😊" },
    { value: "average", label: "Average", color: "#f59e0b", icon: "😐" },
    { value: "poor", label: "Poor", color: "#ef4444", icon: "😞" },
  ]

  const categories = [
    {
      key: "teachingStyle",
      label: "Teaching Style",
      icon: "👨‍🏫",
    },
    {
      key: "markingStyle",
      label: "Marking Style",
      icon: "📝",
    },
    {
      key: "studentFriendliness",
      label: "Student Friendliness",
      icon: "🤝",
    },
    {
      key: "attendanceApproach",
      label: "Attendance Approach",
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
              <span>{teacherInitials}</span>
            </div>
            <div className="teacher-details">
              <h3>Review {selectedTeacher?.name || "Teacher"}</h3>
              <p>Rate your experience</p>
            </div>
          </div>
          <button className="close-btn" onClick={() => setShowGiveReviewModal?.(false)}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {!canSubmit && (
            <div className="review-limit-warning">
              <span>⚠️</span>
              <div>
                <strong>Review limit reached</strong>
                <p>You've submitted {currentCount}/{reviewLimit} reviews for this teacher.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="review-form">
            <div className="form-sections">
              {categories.map((category) => (
                <div key={category.key} className="rating-section">
                  <div className="section-header">
                    <span className="section-icon">{category.icon}</span>
                    <h4>{category.label}</h4>
                  </div>

                  <div className="rating-options">
                    {ratingOptions.map((option) => (
                      <label
                        key={option.value}
                        className={`rating-option ${formData[category.key] === option.value ? "selected" : ""}`}
                        style={formData[category.key] === option.value ? { 
                          borderColor: option.color, 
                          backgroundColor: `${option.color}15`,
                          color: option.color
                        } : {}}
                      >
                        <input
                          type="radio"
                          name={category.key}
                          value={option.value}
                          checked={formData[category.key] === option.value}
                          onChange={(e) => handleRatingChange(category.key, e.target.value)}
                          disabled={!canSubmit}
                        />
                        <span className="option-emoji">{option.icon}</span>
                        <span className="option-label">{option.label}</span>
                      </label>
                    ))}
                  </div>

                  {errors[category.key] && <div className="error-message">{errors[category.key]}</div>}
                </div>
              ))}
            </div>

            <div className="comment-section">
              <div className="section-header">
                <span className="section-icon">💬</span>
                <h4>Additional Comments <span className="optional">(optional)</span></h4>
              </div>

              <textarea
                className="comment-textarea"
                placeholder="Share your experience..."
                value={formData.comment}
                onChange={(e) => setFormData((prev) => ({ ...prev, comment: e.target.value }))}
                rows={3}
                maxLength={300}
                disabled={!canSubmit}
              />

              <div className="character-count">{formData.comment.length}/300</div>
            </div>

            <div className="privacy-section">
              <label className="privacy-option">
                <input
                  type="checkbox"
                  checked={formData.anonymous}
                  onChange={(e) => setFormData((prev) => ({ ...prev, anonymous: e.target.checked }))}
                  disabled={!canSubmit}
                />
                <span className="checkmark"></span>
                <span>Submit anonymously</span>
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
                  "Submit Review"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default GiveReviewModal