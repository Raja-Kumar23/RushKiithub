"use client"

import { useMemo, useEffect, useState } from "react"
import './styles.css'
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
  calculateAverage = () => "0.0",
  reviewsLastUpdated = 0,
}) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [teacherId, setTeacherId] = useState(null)
  const [teacherName, setTeacherName] = useState(null)

  useEffect(() => {
    if (selectedTeacher?.id && selectedTeacher?.name) {
      setTeacherId(selectedTeacher.id)
      setTeacherName(selectedTeacher.name)
    } else {
      setTeacherId(null)
      setTeacherName(null)
    }
  }, [selectedTeacher?.id, selectedTeacher?.name])

  useEffect(() => {
    if (teacherId && teacherName) {
      console.log("[v0] ViewReviewsModal - Reviews updated, refreshing stats", {
        reviewsLastUpdated,
        teacherId: teacherId,
        teacherName: teacherName,
      })
      setRefreshTrigger((prev) => prev + 1)
    }
  }, [reviewsLastUpdated, teacherId, teacherName])

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("[v0] ViewReviewsModal - Auto-refresh triggered")
      setRefreshTrigger((prev) => prev + 1)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

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

    console.log("[v0] ViewReviewsModal - Recalculating stats for:", {
      teacherId: teacherId,
      teacherName: teacherName,
      refreshTrigger,
    })

    try {
      const freshStats = getTeacherReviewStats(teacherId, teacherName)

      console.log("[v0] ViewReviewsModal - Fresh stats calculated:", {
        totalReviews: freshStats.totalReviews,
        overallAverage: freshStats.overallAverage,
        reviewsCount: freshStats.teacherReviews?.length || 0,
        hasReviews: freshStats.teacherReviews && freshStats.teacherReviews.length > 0,
      })

      const validStats = {
        totalReviews: freshStats.totalReviews || 0,
        overallAverage: freshStats.overallAverage || "0.0",
        teacherReviews: Array.isArray(freshStats.teacherReviews) ? freshStats.teacherReviews : [],
        crossSemesterCount: freshStats.crossSemesterCount || 1,
        ratings: freshStats.ratings || {
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

      console.log("[v0] ViewReviewsModal - Returning valid stats:", validStats)
      return validStats
    } catch (error) {
      console.error("[v0] ViewReviewsModal - Error calculating stats:", error)
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
  }, [teacherId, teacherName, getTeacherReviewStats, refreshTrigger])

  const allReviewsForDisplay = useMemo(() => {
    try {
      const reviews = stats.teacherReviews || []
      console.log("[v0] ViewReviewsModal - Processing ALL reviews for display:", {
        totalReviews: reviews.length,
        reviewsData: reviews.map((r) => ({
          id: r.id,
          hasComment: !!(r.comment && r.comment.trim().length > 0),
          comment: r.comment,
          timestamp: r.timestamp,
        })),
      })

      const sortedReviews = reviews
        .filter((review) => review && review.id)
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))

      console.log("[v0] ViewReviewsModal - All reviews for display:", {
        totalCount: sortedReviews.length,
        withComments: sortedReviews.filter((r) => r.comment && r.comment.trim()).length,
      })

      return sortedReviews
    } catch (error) {
      console.error("[v0] ViewReviewsModal - Error processing reviews:", error)
      return []
    }
  }, [stats.teacherReviews])

  const reviewsWithComments = useMemo(() => {
    return allReviewsForDisplay.filter((review) => review && review.comment && review.comment.trim().length > 0)
  }, [allReviewsForDisplay])

  if (!teacherId || !teacherName) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
          padding: "16px",
        }}
        onClick={() => setShowViewReviewsModal(false)}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            padding: "32px",
            maxWidth: "400px",
            width: "100%",
            textAlign: "center",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", marginBottom: "8px" }}>
            No Teacher Selected
          </h3>
          <p style={{ color: "#6b7280", marginBottom: "16px" }}>Please select a teacher to view their reviews.</p>
          <button
            onClick={() => setShowViewReviewsModal(false)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#3b82f6",
              color: "#ffffff",
              borderRadius: "6px",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#2563eb")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#3b82f6")}
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  const getRatingColor = (rating) => {
    const score = Number.parseFloat(rating)
    if (score >= 3.5) return "#10b981" // green
    if (score >= 2.5) return "#3b82f6" // blue
    if (score >= 1.5) return "#f59e0b" // yellow
    return "#ef4444" // red
  }

  const getRatingText = (rating) => {
    const score = Number.parseFloat(rating)
    if (score >= 3.5) return "Excellent"
    if (score >= 2.5) return "Good"
    if (score >= 1.5) return "Average"
    return "Poor"
  }

  const renderStars = (rating) => {
    const score = Number.parseFloat(rating)
    const fullStars = Math.floor(score)
    const hasHalfStar = score % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} style={{ color: "#fbbf24", fontSize: "18px" }}>
            ★
          </span>
        ))}
        {hasHalfStar && <span style={{ color: "#fbbf24", fontSize: "18px" }}>★</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} style={{ color: "#d1d5db", fontSize: "18px" }}>
            ☆
          </span>
        ))}
      </div>
    )
  }

  const renderRatingBar = (category, average, ratings) => {
    const total = Object.values(ratings).reduce((sum, count) => sum + count, 0)
    const ratingColor = getRatingColor(average)

    return (
      <div
        style={{
          padding: "16px",
          borderRadius: "8px",
          border: "1px solid #e5e7eb",
          backgroundColor: "#f9fafb",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <h4 style={{ fontWeight: "600", color: "#111827", margin: 0 }}>{category}</h4>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "20px", fontWeight: "bold", color: "#111827" }}>{average}</span>
            {renderStars(Number.parseFloat(average))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {Object.entries(ratings).map(([level, count]) => {
            const percentage = total > 0 ? (count / total) * 100 : 0
            const levelColors = {
              excellent: "#10b981",
              good: "#3b82f6",
              average: "#f59e0b",
              poor: "#ef4444",
            }

            return (
              <div key={level} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#6b7280",
                    width: "80px",
                    textTransform: "capitalize",
                  }}
                >
                  {level}
                </span>
                <div style={{ flex: 1, backgroundColor: "#e5e7eb", borderRadius: "9999px", height: "8px" }}>
                  <div
                    style={{
                      height: "8px",
                      borderRadius: "9999px",
                      backgroundColor: levelColors[level],
                      width: `${percentage}%`,
                      transition: "width 0.3s ease",
                    }}
                  ></div>
                </div>
                <span
                  style={{ fontSize: "14px", fontWeight: "500", color: "#111827", width: "32px", textAlign: "right" }}
                >
                  {count}
                </span>
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
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleManualRefresh = () => {
    console.log("[v0] ViewReviewsModal - Manual refresh triggered")
    setIsRefreshing(true)
    setRefreshTrigger((prev) => prev + 1)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const handleClose = () => {
    setShowViewReviewsModal(false)
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: "16px",
      }}
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          maxWidth: "1200px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid #e5e7eb",
            background: "linear-gradient(to right, #dbeafe, #e0e7ff)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  backgroundColor: "#3b82f6",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              >
                {selectedTeacher.name
                  .split(" ")
                  .map((n) => n.charAt(0))
                  .join("")
                  .toUpperCase()}
              </div>

              <div>
                <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#111827", margin: "0 0 8px 0" }}>
                  {selectedTeacher.name}
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {selectedTeacher.subjects && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {selectedTeacher.subjects.slice(0, 3).map((subject, index) => (
                        <span
                          key={index}
                          style={{
                            padding: "4px 12px",
                            backgroundColor: "#3b82f6",
                            color: "#ffffff",
                            borderRadius: "16px",
                            fontSize: "12px",
                            fontWeight: "500",
                          }}
                        >
                          {subject.length > 20 ? `${subject.substring(0, 20)}...` : subject}
                        </span>
                      ))}
                    </div>
                  )}

                  {selectedTeacher.sections && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "14px", color: "#6b7280", fontWeight: "500" }}>Sections:</span>
                      {selectedTeacher.sections.slice(0, 5).map((section, index) => (
                        <span
                          key={index}
                          style={{
                            padding: "2px 8px",
                            backgroundColor: "#e5e7eb",
                            color: "#374151",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: "500",
                          }}
                        >
                          {section}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    backgroundColor: getRatingColor(stats.overallAverage),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontSize: "24px",
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  {stats.overallAverage}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  {renderStars(Number.parseFloat(stats.overallAverage))}
                  <span style={{ fontSize: "14px", fontWeight: "500", color: "#6b7280" }}>
                    {getRatingText(stats.overallAverage)}
                  </span>
                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>{stats.totalReviews} reviews</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  style={{
                    padding: "8px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: isRefreshing ? "#3b82f6" : "#f3f4f6",
                    color: isRefreshing ? "#ffffff" : "#6b7280",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                    transform: isRefreshing ? "rotate(360deg)" : "rotate(0deg)",
                  }}
                  onClick={handleManualRefresh}
                  title="Refresh reviews"
                >
                  <svg
                    style={{ width: "20px", height: "20px" }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 4v6h6M23 20v-6h-6" />
                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                  </svg>
                </button>

                <button
                  style={{
                    padding: "8px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "#f3f4f6",
                    color: "#6b7280",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background-color 0.2s",
                  }}
                  onClick={handleClose}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#e5e7eb")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#f3f4f6")}
                >
                  <svg
                    style={{ width: "20px", height: "20px" }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ display: "flex", height: "calc(90vh - 140px)" }}>
          {/* Left Side - Ratings Overview */}
          <div style={{ flex: 1, padding: "24px", borderRight: "1px solid #e5e7eb", overflowY: "auto" }}>
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}
              >
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: 0 }}>Rating Breakdown</h3>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
              </div>

              <div style={{ display: "flex", gap: "24px", marginBottom: "24px" }}>
                <div style={{ textAlign: "center" }}>
                  <span style={{ fontSize: "24px", fontWeight: "bold", color: "#111827", display: "block" }}>
                    {stats.totalReviews}
                  </span>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>Total Reviews</span>
                </div>
                <div style={{ textAlign: "center" }}>
                  <span style={{ fontSize: "24px", fontWeight: "bold", color: "#111827", display: "block" }}>
                    {reviewsWithComments.length}
                  </span>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>With Comments</span>
                </div>
                {stats.crossSemesterCount > 1 && (
                  <div style={{ textAlign: "center" }}>
                    <span style={{ fontSize: "24px", fontWeight: "bold", color: "#111827", display: "block" }}>
                      {stats.crossSemesterCount}
                    </span>
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>Semesters</span>
                  </div>
                )}
              </div>

              <div>
                {renderRatingBar("Teaching Style", stats.averages.teachingStyle, stats.ratings.teachingStyle)}
                {renderRatingBar("Marking Style", stats.averages.markingStyle, stats.ratings.markingStyle)}
                {renderRatingBar(
                  "Student Friendliness",
                  stats.averages.studentFriendliness,
                  stats.ratings.studentFriendliness,
                )}
                {renderRatingBar(
                  "Attendance Approach",
                  stats.averages.attendanceApproach,
                  stats.ratings.attendanceApproach,
                )}
              </div>
            </div>
          </div>

          {/* Right Side - All Reviews */}
          <div style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
            <div style={{ marginBottom: "16px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: "0 0 8px 0" }}>
                All Reviews
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "14px", color: "#6b7280" }}>{allReviewsForDisplay.length} total reviews</span>
                {reviewsWithComments.length > 0 && (
                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                    ({reviewsWithComments.length} with comments)
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {allReviewsForDisplay.length > 0 ? (
                allReviewsForDisplay.map((review, index) => {
                  const isNewReview = review.timestamp && review.timestamp > Date.now() - 300000
                  const hasComment = review.comment && review.comment.trim().length > 0

                  return (
                    <div
                      key={`${review.id || index}-${review.timestamp}`}
                      style={{
                        padding: "16px",
                        backgroundColor: isNewReview ? "#fef3c7" : "#ffffff",
                        border: `1px solid ${isNewReview ? "#f59e0b" : "#e5e7eb"}`,
                        borderRadius: "8px",
                        position: "relative",
                      }}
                    >
                      <div style={{ marginBottom: hasComment ? "12px" : "8px" }}>
                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                          {["teachingStyle", "markingStyle", "studentFriendliness", "attendanceApproach"].map(
                            (key, idx) => {
                              const labels = ["Teaching", "Marking", "Friendliness", "Attendance"]
                              const value = review[key] || "average"
                              const colors = {
                                excellent: "#10b981",
                                good: "#3b82f6",
                                average: "#f59e0b",
                                poor: "#ef4444",
                              }

                              return (
                                <span
                                  key={key}
                                  style={{
                                    padding: "4px 8px",
                                    backgroundColor: colors[value],
                                    color: "#ffffff",
                                    borderRadius: "4px",
                                    fontSize: "11px",
                                    fontWeight: "500",
                                  }}
                                >
                                  {labels[idx]}: {value.charAt(0).toUpperCase() + value.slice(1)}
                                </span>
                              )
                            },
                          )}
                        </div>
                      </div>

                      {hasComment && (
                        <div style={{ marginBottom: "12px" }}>
                          <p style={{ fontSize: "14px", color: "#374151", margin: 0, fontStyle: "italic" }}>
                            "{review.comment}"
                          </p>
                        </div>
                      )}

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "12px", color: "#6b7280" }}>{formatDate(review.timestamp)}</span>
                        {hasComment && (
                          <span style={{ fontSize: "10px", color: "#10b981", fontWeight: "500" }}>Has Comment</span>
                        )}
                      </div>

                      {!review.anonymous && review.studentName && (
                        <div style={{ marginTop: "8px" }}>
                          <span style={{ fontSize: "12px", color: "#6b7280", fontStyle: "italic" }}>
                            - {review.studentName}
                          </span>
                        </div>
                      )}

                      {isNewReview && (
                        <div
                          style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            padding: "2px 8px",
                            backgroundColor: "#10b981",
                            color: "#ffffff",
                            borderRadius: "12px",
                            fontSize: "10px",
                            fontWeight: "500",
                          }}
                        >
                          New
                        </div>
                      )}
                    </div>
                  )
                })
              ) : (
                <div style={{ textAlign: "center", padding: "48px 24px" }}>
                  <div style={{ marginBottom: "16px" }}>
                    <svg
                      style={{ width: "48px", height: "48px", color: "#9ca3af", margin: "0 auto" }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <h4 style={{ fontSize: "16px", fontWeight: "600", color: "#374151", margin: "0 0 8px 0" }}>
                    No Reviews Yet
                  </h4>
                  <p style={{ color: "#6b7280", margin: "0 0 16px 0" }}>
                    Be the first to review {selectedTeacher.name} and help other students!
                  </p>
                  <small style={{ color: "#9ca3af", fontSize: "12px" }}>
                    Debug: No reviews found in database for this teacher
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live update indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            right: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 12px",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "#ffffff",
            borderRadius: "16px",
            fontSize: "12px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: isRefreshing ? "#10b981" : "#3b82f6",
              animation: isRefreshing ? "pulse 1s infinite" : "none",
            }}
          ></div>
          <span>Live Updates</span>
          <small style={{ color: "#d1d5db" }}>Auto-refreshing...</small>
        </div>
      </div>
    </div>
  )
}

export default ViewReviewsModal
