"use client"

import { useState, useEffect } from "react"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { Star } from "lucide-react"
import "./feedback.css"

if (typeof window !== "undefined") {
  // Disable right-click context menu
  document.addEventListener("contextmenu", (e) => e.preventDefault())

  // Disable F12, Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+Shift+J
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && e.key === "I") ||
      (e.ctrlKey && e.shiftKey && e.key === "C") ||
      (e.ctrlKey && e.shiftKey && e.key === "J") ||
      (e.metaKey && e.altKey && e.key === "I") ||
      (e.metaKey && e.altKey && e.key === "C")
    ) {
      e.preventDefault()
    }
  })

  // Detect DevTools opening via window size
  let devToolsOpen = false
  const threshold = 160
  window.addEventListener("resize", () => {
    const isOpen =
      window.outerHeight - window.innerHeight > threshold || window.outerWidth - window.innerWidth > threshold
    if (isOpen && !devToolsOpen) {
      devToolsOpen = true
      document.body.innerHTML = ""
    }
  })
}

export default function FeedbackPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState("")
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.displayName || "User",
          email: currentUser.email || "",
        })
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!feedback.trim()) {
      setError("Please enter your feedback")
      return
    }

    if (feedback.trim().length < 10) {
      setError("Feedback must be at least 10 characters")
      return
    }

    if (rating === 0) {
      setError("Please select a rating")
      return
    }

    setSubmitting(true)
    setError("")

    try {
      const feedbackCollection = collection(db, "feedback")

      await addDoc(feedbackCollection, {
        name: user.name,
        email: user.email,
        rating: rating,
        feedback: feedback.trim(),
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString(),
      })

      setSubmitted(true)
      setFeedback("")
      setRating(0)

      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      setError(err.message || "Failed to submit feedback")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="feedback-container">
        <div className="feedback-card">
          <div className="loading">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="feedback-container">
        <div className="feedback-card">
          <div className="error-message">Please sign in to submit feedback</div>
        </div>
      </div>
    )
  }

  return (
    <div className="feedback-container">
      <div className="feedback-card">
        <div className="feedback-header">
          <h1 className="feedback-title">Share Your Feedback</h1>
          <p className="feedback-subtitle">Help us improve by sharing your thoughts and suggestions</p>
        </div>

        {submitted && <div className="success-message">Thank you! Your feedback has been submitted successfully.</div>}

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input type="text" value={user.name} disabled className="form-input disabled" />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" value={user.email} disabled className="form-input disabled" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Rating</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="star-button"
                >
                  <Star
                    size={32}
                    className={`star-icon ${star <= (hoverRating || rating) ? "star-filled" : "star-empty"}`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <div className="rating-label">
                {rating} star{rating !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Your Feedback</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Please share your thoughts, suggestions, or report any issues..."
              maxLength={5000}
              className="form-textarea"
              rows="4"
            />
            <div className="char-counter">{feedback.length} / 5000 characters</div>
          </div>

          <button type="submit" disabled={submitting} className="submit-btn">
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  )
}
