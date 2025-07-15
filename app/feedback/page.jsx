"use client"

import { useState, useEffect } from "react"


import { ArrowLeft, Star, Send, Sparkles } from "lucide-react" // Removed MessageCircle, ChevronLeft, ChevronRight
import Link from "next/link"
import "./feedback.css"
import { auth } from "../../lib/firebase";

// Import auth from centralized file
import { onAuthStateChanged } from "firebase/auth" // Import onAuthStateChanged explicitly

export default function FeedbackPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  // Form states
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [message, setMessage] = useState("")
  // Success state
  const [showThankYou, setShowThankYou] = useState(false)

  // Manual reviews data (removed as section is removed)
  // const [manualReviews] = useState([...]);

  // Auth listener
  useEffect(() => {
    if (!auth) return
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && (currentUser.email.endsWith("@kiit.ac.in") || currentUser.email === "davidtomdon@gmail.com")) {
        setUser(currentUser)
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // Extract roll number from email
  const getRollNumber = (email) => {
    if (!email) return "Unknown"
    const match = email.match(/(\d+)/)
    return match ? match[1] : "N/A"
  }

  // Get display name
  const getDisplayName = (user) => {
    if (!user) return "Anonymous"
    return user.displayName || user.email.split("@")[0] || "Student"
  }

  // Get user initials
  const getUserInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Handle form submission to Google Sheets
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      alert("Please sign in to submit feedback")
      return
    }
    if (rating === 0) {
      alert("Please select a rating")
      return
    }
    if (!message.trim()) {
      alert("Please write your feedback")
      return
    }
    if (!user.email.endsWith("@kiit.ac.in") && user.email !== "davidtomdon@gmail.com") {
      alert("Only KIIT students can submit feedback.")
      return
    }
    setSubmitting(true)
    const scriptUrl =
      "https://script.google.com/macros/s/AKfycbwd97oq7K_Csg-jaFMGgoAjwyrMM8kiaKGKPm4xBYZ4WvuUZMypq2Hhs06Yis2N0Xlbcg/exec"
    try {
      const formData = new FormData()
      formData.append("name", getDisplayName(user))
      formData.append("email", user.email)
      formData.append("rating", rating.toString())
      formData.append("message", message.trim())

      const formEntries = Array.from(formData.entries())
      const urlEncodedData = formEntries
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&")

      await fetch(scriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlEncodedData,
        mode: "no-cors", // Important for Google Apps Script
      })

      setRating(0)
      setHoverRating(0)
      setMessage("")
      setShowThankYou(true)
      setTimeout(() => setShowThankYou(false), 4000)
    } catch (error) {
      console.error("Error submitting feedback:", error)
      alert("Failed to submit feedback. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  // Render stars
  const renderStars = (currentRating, isInteractive = false, size = "w-5 h-5") => {
    return (
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`star ${size} ${
              star <= (isInteractive ? hoverRating || rating : currentRating) ? "star-filled" : "star-empty"
            }`}
            onClick={isInteractive ? () => setRating(star) : undefined}
            onMouseEnter={isInteractive ? () => setHoverRating(star) : undefined}
            onMouseLeave={isInteractive ? () => setHoverRating(0) : undefined}
          />
        ))}
      </div>
    )
  }

  // Scroll functions (removed as reviews section is removed)
  // const scrollReviews = (direction) => { ... };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loading-spinner"></div>
        <p>Loading your feedback experience...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="access-denied">
        <div className="access-card">
          <div className="lock-icon">🔒</div>
          <h2>Access Restricted</h2>
          <p>Please sign in with your KIIT account to share your thoughts and see what others are saying!</p>
          <Link href="/" className="back-button">
            <ArrowLeft size={18} />
            Go Back Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="feedback-page">
      {/* Animated Background Elements */}
      <div className="bg-elements">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      {/* Thank You Popup */}
      {showThankYou && (
        <div className="thank-you-overlay">
          <div className="thank-you-popup">
            <div className="thank-you-icon">
              <Sparkles size={24} />
            </div>
            <h3>Thank You! 🎉</h3>
            <p>Your feedback means the world to us and helps make KIITHub better for everyone!</p>
            <div className="progress-bar"></div>
          </div>
        </div>
      )}

      <div className="back-link-container">
        <Link href="/" className="back-link">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
      </div>

      <main className="main-content">
        {/* Feedback Form */}
        <section className="form-section">
          <div className="form-header">
            <div className="form-icon">
              <Send size={24} />
            </div>
            <div className="form-title">
              <h2>Share Your Experience</h2>
              <p>Help us make KIITHub even better for you and your fellow students</p>
            </div>
          </div>
          <div className="user-card">
            <div className="user-avatar">
              {user.photoURL ? (
                <img src={user.photoURL || "/placeholder.svg"} alt="Profile" />
              ) : (
                <span className="avatar-text">{getUserInitials(getDisplayName(user))}</span>
              )}
            </div>
            <div className="user-info">
              <h3>{getDisplayName(user)}</h3>
              <p>Roll Number: {getRollNumber(user.email)}</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label>How would you rate your experience?</label>
              <div className="rating-section">
                <div className="rating-container">{renderStars(rating, true, "w-8 h-8")}</div>
                <div className="rating-feedback">
                  {rating === 0 && <span className="rating-text neutral">Tap a star to rate</span>}
                  {rating === 1 && <span className="rating-text poor">Poor - We'll do better</span>}
                  {rating === 2 && <span className="rating-text fair">Fair - Room for improvement</span>}
                  {rating === 3 && <span className="rating-text good">Good - Thanks for the feedback</span>}
                  {rating === 4 && <span className="rating-text very-good">Very Good - We're glad you like it!</span>}
                  {rating === 5 && <span className="rating-text excellent">Excellent - You made our day! 🎉</span>}
                </div>
              </div>
            </div>
            <div className="form-group">
              <label>Tell us more about your experience</label>
              <div className="textarea-container">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What do you love about KIITHub? What could we improve? Share your thoughts..."
                  rows={4}
                  maxLength={500}
                  required
                />
                <div className="textarea-footer">
                  <span className="char-count">{message.length}/500</span>
                  <div className="textarea-decoration"></div>
                </div>
              </div>
            </div>
            <button type="submit" disabled={submitting || rating === 0 || !message.trim()} className="submit-btn">
              {submitting ? (
                <>
                  <div className="spinner"></div>
                  <span>Sending your feedback...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Submit Feedback</span>
                  <Sparkles size={16} className="btn-sparkle" />
                </>
              )}
            </button>
          </form>
        </section>
        {/* Reviews Section removed */}
      </main>
    </div>
  )
}
