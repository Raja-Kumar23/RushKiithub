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

  const ratingExplanations = {
    teachingStyle: {
      excellent: "Very clear explanations, good examples, answers questions, classes feel engaging.",
      good: "Usually clear and helpful with examples, small gaps sometimes.",
      average: "Sometimes clear, but often rushed or confusing.",
      poor: "Hard to follow, unclear explanations, little support for questions.",
    },
    markingStyle: {
      loose: "Very lenient grading, little emphasis on criteria.",
      fair: "Balanced grading with clear criteria, reasonable feedback.",
      strict: "Strict grading with clear criteria, sometimes harsh feedback.",
      harsh: "Very strict grading, unclear criteria, minimal feedback.",
    },
    studentFriendliness: {
      friendly: "Respectful, approachable, patient, and supportive.",
      helpful: "Friendly and helpful, generally approachable.",
      formal: "Neutral; limited availability or warmth.",
      strict: "Unfriendly or dismissive; hard to approach.",
    },
    attendanceApproach: {
      flexible: "Rules are clear, fair, and applied consistently. Genuine reasons are considered.",
      moderate: "Mostly clear and fair; minor inconsistencies.",
      strict_but_fair: "Sometimes unclear; enforcement varies by day or class.",
      very_strict: "Unclear, unfair, or inconsistent; small delays overly penalized.",
    },
  }

  const getOptionsForCategory = (key) => {
    switch (key) {
      case "markingStyle":
        return [
          { value: "loose", label: "Loose", color: "#10b981", icon: "😌" },
          { value: "fair", label: "Fair", color: "#3b82f6", icon: "🙂" },
          { value: "strict", label: "Strict", color: "#f59e0b", icon: "😐" },
          { value: "harsh", label: "Harsh", color: "#ef4444", icon: "😣" },
        ]
      case "studentFriendliness":
        return [
          { value: "friendly", label: "Friendly", color: "#10b981", icon: "😊" },
          { value: "helpful", label: "Helpful", color: "#3b82f6", icon: "🤝" },
          { value: "formal", label: "Formal", color: "#f59e0b", icon: "🎓" },
          { value: "strict", label: "Strict", color: "#ef4444", icon: "😐" },
        ]
      case "attendanceApproach":
        return [
          { value: "flexible", label: "Flexible", color: "#10b981", icon: "🕒" },
          { value: "moderate", label: "Moderate", color: "#3b82f6", icon: "⚖️" },
          { value: "strict_but_fair", label: "Strict but fair", color: "#f59e0b", icon: "✅" },
          { value: "very_strict", label: "Very strict", color: "#ef4444", icon: "⛔️" },
        ]
      default:
        // Teaching Style keeps the original Excellent/Good/Average/Poor options
        return ratingOptions
    }
  }

  if (!selectedTeacher) {
    return null
  }

  const handleRatingChange = (category, value) => {
    setFormData((prev) => ({
      ...prev,
      [category]: value,
    }))

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

    if (!selectedTeacher?.id || !canSubmitMoreReviews?.(selectedTeacher.id)) {
      return
    }

    setIsSubmitting(true)

    try {
      console.log("GiveReviewModal - Submitting review with data:", formData)
      await submitReview(formData)
      console.log("GiveReviewModal - Review submitted successfully")

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

  const canSubmit = selectedTeacher?.id && canSubmitMoreReviews?.(selectedTeacher.id)
  const reviewLimit = getUserReviewLimit?.() || 0
  const currentCount = selectedTeacher?.id ? getUserReviewCount?.(selectedTeacher.id) || 0 : 0

  const teacherInitials = selectedTeacher?.name
    ? selectedTeacher.name
        .split(" ")
        .map((n) => n.charAt(0))
        .join("")
        .toUpperCase()
    : "?"

  return (
    <div className="dark-modal-overlay" onClick={() => setShowGiveReviewModal?.(false)}>
      <div className="dark-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="dark-modal-header">
          <div className="dark-teacher-info">
            <div className="dark-teacher-avatar">
              <span>{teacherInitials}</span>
            </div>
            <div className="dark-teacher-details">
              <h2>Review {selectedTeacher?.name || "Teacher"}</h2>
              <p>Rate your experience across different categories</p>
            </div>
          </div>
          <button className="dark-close-btn" onClick={() => setShowGiveReviewModal?.(false)} aria-label="Close modal">
            ×
          </button>
        </div>

        {/* Body */}
        <div className="dark-modal-body">
          {!canSubmit && (
            <div className="dark-warning">
              <div className="dark-warning-icon">⚠️</div>
              <div className="dark-warning-content">
                <strong>Review limit reached</strong>
                <p>
                  You've submitted {currentCount}/{reviewLimit} reviews for this teacher.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="dark-review-form">
            {/* Rating Grid */}
            <div className="dark-ratings-grid">
              {categories.map((category) => (
                <div key={category.key} className="dark-rating-section">
                  <div className="dark-section-header">
                    <span className="dark-section-icon">{category.icon}</span>
                    <h3>{category.label}</h3>
                  </div>

                  <div className="dark-rating-options">
                    {getOptionsForCategory(category.key).map((option) => (
                      <label
                        key={option.value}
                        className={`dark-rating-option ${formData[category.key] === option.value ? "selected" : ""}`}
                        style={
                          formData[category.key] === option.value
                            ? {
                                borderColor: option.color,
                                backgroundColor: `${option.color}20`,
                                color: option.color,
                              }
                            : {}
                        }
                      >
                        <input
                          type="radio"
                          name={category.key}
                          value={option.value}
                          checked={formData[category.key] === option.value}
                          onChange={(e) => handleRatingChange(category.key, e.target.value)}
                          disabled={!canSubmit}
                          aria-label={`${category.label}: ${option.label}`}
                        />
                        <span className="dark-option-emoji">{option.icon}</span>
                        <span className="dark-option-label">{option.label}</span>
                      </label>
                    ))}
                  </div>

                  {errors[category.key] && <div className="dark-error-message">{errors[category.key]}</div>}
                </div>
              ))}
            </div>

            {/* Comment and Privacy Section */}
            <div className="dark-bottom-section">
              <div className="dark-comment-section">
                <div className="dark-section-header">
                  <span className="dark-section-icon">💬</span>
                  <h3>
                    Additional Comments <span className="dark-optional">(optional)</span>
                  </h3>
                </div>
                <textarea
                  className="dark-comment-textarea"
                  placeholder="Share your detailed experience with this teacher..."
                  value={formData.comment}
                  onChange={(e) => setFormData((prev) => ({ ...prev, comment: e.target.value }))}
                  rows={4}
                  maxLength={500}
                  disabled={!canSubmit}
                />
                <div className="dark-character-count">{formData.comment.length}/500</div>
              </div>

              <div className="dark-privacy-section">
                <label className="dark-privacy-option">
                  <input
                    type="checkbox"
                    checked={formData.anonymous}
                    onChange={(e) => setFormData((prev) => ({ ...prev, anonymous: e.target.checked }))}
                    disabled={!canSubmit}
                  />
                  <span className="dark-checkmark"></span>
                  <span className="dark-privacy-text">Submit anonymously</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="dark-form-actions">
              <button
                type="button"
                className="dark-cancel-btn"
                onClick={() => setShowGiveReviewModal?.(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`dark-submit-btn ${!canSubmit ? "disabled" : ""}`}
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="dark-loading-spinner"></div>
                    Submitting Review...
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
