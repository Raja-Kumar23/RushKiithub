import React, { useState, useMemo } from 'react'
import { Eye, CreditCard as Edit3, Check, Star, Users, BookOpen, Award, Sparkles, ChevronLeft, ChevronRight, Crown, Info } from 'lucide-react'
import './styles.css'

const TEACHERS_PER_PAGE = 100

const TeacherGrid = ({
  isLoading = false,
  teachers = [],
  openViewReviewsModal,
  openGiveReviewModal,
  hasReviewedTeacherInAnyYear,
  getTeacherReviewStats,
  canSubmitMoreReviews,
}) => {
  const [currentPage, setCurrentPage] = useState(1)

  // Calculate pagination
  const totalPages = Math.ceil(teachers.length / TEACHERS_PER_PAGE)
  const startIndex = (currentPage - 1) * TEACHERS_PER_PAGE
  const endIndex = startIndex + TEACHERS_PER_PAGE
  const currentTeachers = teachers.slice(startIndex, endIndex)

  // Simple utility functions
  const getRatingLevel = (rating) => {
    const score = parseFloat(rating)
    if (score >= 3.8) return "legendary"  // New tier for exceptional teachers (out of 4)
    if (score >= 3.5) return "excellent"
    if (score >= 3.0) return "very-good" 
    if (score >= 2.5) return "good"
    if (score >= 2.0) return "average"
    return "poor"
  }

  const getAvatarStyle = (rating) => {
    const level = getRatingLevel(rating)
    const styles = {
      legendary: { background: "linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%)" }, // Vibrant green gradient
      excellent: { background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" },
      "very-good": { background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)" },
      good: { background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" },
      average: { background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" },
      poor: { background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" },
    }
    return styles[level]
  }

  const generateInitials = (name) => {
    return name.split(" ").map(n => n.charAt(0)).join("").toUpperCase().slice(0, 2)
  }

  const renderStars = (rating) => {
    const score = parseFloat(rating)
    const fullStars = Math.floor(score)
    
    return (
      <div className="stars-container">
        {[...Array(4)].map((_, i) => (
          <Star
            key={i}
            size={12}
            className={`star ${i < fullStars ? "star-full" : "star-empty"}`}
            fill={i < fullStars ? "currentColor" : "none"}
          />
        ))}
      </div>
    )
  }

  // Memoize only the current page data to prevent unnecessary recalculations
  const teacherCardsData = useMemo(() => {
    return currentTeachers.map((teacher) => {
      const stats = getTeacherReviewStats(teacher.id, teacher.name)
      const hasReviewed = hasReviewedTeacherInAnyYear(teacher.id)
      const canReview = canSubmitMoreReviews(teacher.id)
      
      return {
        ...teacher,
        stats,
        hasReviewed,
        canReview,
        avatarStyle: getAvatarStyle(stats.overallAverage),
        ratingLevel: getRatingLevel(stats.overallAverage),
      }
    })
  }, [currentTeachers, currentPage])

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const LoadingSkeleton = () => (
    <div className="teacher-grid-wrapper">
      <div className="teacher-grid">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="teacher-card-skeleton">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-name"></div>
            <div className="skeleton-rating"></div>
            <div className="skeleton-actions"></div>
          </div>
        ))}
      </div>
    </div>
  )

  const EmptyState = () => (
    <div className="teacher-grid-wrapper">
      <div className="empty-state">
        <Users size={64} />
        <h3>No Faculty Found</h3>
        <p>Try adjusting your search criteria to discover amazing educators.</p>
      </div>
    </div>
  )

  const ColorLegend = () => (
    <div className="color-legend">
      <div className="legend-header">
        <Info size={16} />
        <span>Rating Color Guide</span>
      </div>
      <div className="legend-items">
        <div className="legend-item">
          <div className="legend-color legendary"></div>
          <span>Legendary (3.8+)</span>
          <Crown size={12} className="crown-icon" />
        </div>
        <div className="legend-item">
          <div className="legend-color excellent"></div>
          <span>Excellent (3.5+)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color very-good"></div>
          <span>Very Good (3.0+)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color good"></div>
          <span>Good (2.5+)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color average"></div>
          <span>Average (2.0+)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color poor"></div>
          <span>Needs Improvement</span>
        </div>
      </div>
    </div>
  )

  const PaginationControls = () => {
    if (totalPages <= 1) return null

    const getPageNumbers = () => {
      const pages = []
      const maxVisible = 5
      let start = Math.max(1, currentPage - 2)
      let end = Math.min(totalPages, start + maxVisible - 1)
      
      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1)
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    }

    return (
      <div className="pagination-controls">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          <ChevronLeft size={16} />
          Previous
        </button>
        
        <div className="page-numbers">
          {getPageNumbers().map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`page-btn ${page === currentPage ? 'active' : ''}`}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    )
  }

  const TeacherCard = ({ teacher }) => {
    const actualReviewCount = teacher.stats.totalReviews || 0
    const isLegendary = teacher.ratingLevel === 'legendary'

    return (
      <div className={`teacher-card hover-${teacher.ratingLevel} ${isLegendary ? 'legendary-card' : ''}`}>
        {teacher.hasReviewed && (
          <div className="reviewed-badge">
            <Check size={14} />
          </div>
        )}

        {isLegendary && (
          <div className="legendary-badge">
            <Crown size={16} />
          </div>
        )}

        <div className="card-content">
          <div className="teacher-header">
            <div
              className={`teacher-avatar ${isLegendary ? 'legendary-avatar' : ''}`}
              style={{ background: teacher.avatarStyle.background }}
            >
              <span>{generateInitials(teacher.name)}</span>
            </div>
            <div className="rating-display">
              <div className={`rating-score ${isLegendary ? 'legendary-score' : ''}`}>
                {teacher.stats.overallAverage}
              </div>
              {renderStars(teacher.stats.overallAverage)}
              <div className="review-count">
                {actualReviewCount} review{actualReviewCount !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          <div className="teacher-info">
            <h3 className={`teacher-name ${isLegendary ? 'legendary-name' : ''}`}>
              {teacher.name}
              {isLegendary && <Crown size={16} className="inline-crown" />}
            </h3>

            {teacher.subjects && teacher.subjects.length > 0 && (
              <div className="subject-tags">
                {teacher.subjects.slice(0, 2).map((subject, idx) => (
                  <span key={idx} className={`subject-tag ${isLegendary ? 'legendary-tag' : ''}`}>
                    {subject.length > 15 ? `${subject.substring(0, 15)}...` : subject}
                  </span>
                ))}
                {teacher.subjects.length > 2 && (
                  <span className={`subject-tag more ${isLegendary ? 'legendary-tag' : ''}`}>
                    +{teacher.subjects.length - 2} more
                  </span>
                )}
              </div>
            )}

            {teacher.sections && teacher.sections.length > 0 && (
              <div className="sections-info">
                <Users size={14} />
                <div className="sections-pills">
                  {teacher.sections.slice(0, 3).map((section, idx) => (
                    <span key={idx} className={`section-pill ${isLegendary ? 'legendary-pill' : ''}`}>
                      {section}
                    </span>
                  ))}
                  {teacher.sections.length > 3 && (
                    <span className={`section-pill ${isLegendary ? 'legendary-pill' : ''}`}>
                      +{teacher.sections.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="card-actions">
            <button
              className="action-btn view-btn"
              onClick={() => openViewReviewsModal(teacher)}
            >
              <Eye size={16} />
              View Reviews
            </button>
            <button
              className={`action-btn review-btn ${!teacher.canReview ? "disabled" : ""} ${isLegendary ? 'legendary-btn' : ''}`}
              onClick={() => teacher.canReview && openGiveReviewModal(teacher)}
              disabled={!teacher.canReview}
            >
              <Edit3 size={16} />
              {teacher.hasReviewed ? "Update" : "Review"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) return <LoadingSkeleton />
  if (!teachers || teachers.length === 0) return <EmptyState />

  return (
    <div className="teacher-grid-wrapper">
      <div className="grid-header">
        <div className="header-content">
          <div className="title-section">
            <div className="title-wrapper">
              <Sparkles size={28} className="title-icon" />
              <h1 className="grid-title">Faculty Excellence</h1>
            </div>
            <div className="subtitle">
              <span>Page {currentPage} of {totalPages} • {teachers.length} total educators</span>
              <Award size={16} className="subtitle-icon" />
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-badge">
              <Users size={16} />
              <span>Showing {currentTeachers.length} of {teachers.length}</span>
            </div>
            <div className="stat-badge">
              <BookOpen size={16} />
              <span>All Subjects</span>
            </div>
          </div>
        </div>
      </div>

      <ColorLegend />

      <div className="teacher-grid">
        {teacherCardsData.map((teacher) => (
          <TeacherCard key={teacher.id} teacher={teacher} />
        ))}
      </div>

      <PaginationControls />
    </div>
  )
}

export default TeacherGrid

// "use client"

// import { useState, useMemo } from "react"
// import { Edit3, Check, Users, BookOpen, Award, Sparkles, ChevronLeft, ChevronRight, Info } from "lucide-react"
// import "./styles.css"

// const TEACHERS_PER_PAGE = 30

// const TeacherGrid = ({
//   isLoading = false,
//   teachers = [],
//   openViewReviewsModal,
//   openGiveReviewModal,
//   hasReviewedTeacherInAnyYear,
//   getTeacherReviewStats,
//   canSubmitMoreReviews,
//   reviewsLastUpdated, // added
// }) => {
//   const [currentPage, setCurrentPage] = useState(1)

//   // Calculate pagination
//   const totalPages = Math.ceil(teachers.length / TEACHERS_PER_PAGE)
//   const startIndex = (currentPage - 1) * TEACHERS_PER_PAGE
//   const endIndex = startIndex + TEACHERS_PER_PAGE
//   const currentTeachers = teachers.slice(startIndex, endIndex)

//   const generateInitials = (name) => {
//     return name
//       .split(" ")
//       .map((n) => n.charAt(0))
//       .join("")
//       .toUpperCase()
//       .slice(0, 2)
//   }

//   // Memoize only the current page data to prevent unnecessary recalculations
//   const teacherCardsData = useMemo(() => {
//     return currentTeachers.map((teacher) => {
//       const stats = getTeacherReviewStats(teacher.id, teacher.name)
//       const hasReviewed = hasReviewedTeacherInAnyYear(teacher.id)
//       const canReview = canSubmitMoreReviews(teacher.id)
//       return {
//         ...teacher,
//         stats,
//         hasReviewed,
//         canReview,
//       }
//     })
//   }, [
//     currentTeachers,
//     currentPage,
//     reviewsLastUpdated, // added
//     hasReviewedTeacherInAnyYear, // added
//     canSubmitMoreReviews, // added
//     getTeacherReviewStats, // added (ensures stats refresh if logic changes)
//   ])

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page)
//       window.scrollTo({ top: 0, behavior: "smooth" })
//     }
//   }

//   const LoadingSkeleton = () => (
//     <div className="teacher-grid-wrapper">
//       <div className="teacher-grid">
//         {[...Array(12)].map((_, i) => (
//           <div key={i} className="teacher-card-skeleton">
//             <div className="skeleton-avatar"></div>
//             <div className="skeleton-name"></div>
//             <div className="skeleton-rating"></div>
//             <div className="skeleton-actions"></div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )

//   const EmptyState = () => (
//     <div className="teacher-grid-wrapper">
//       <div className="empty-state">
//         <Users size={64} />
//         <h3>No Faculty Found</h3>
//         <p>Try adjusting your search criteria to discover amazing educators.</p>
//       </div>
//     </div>
//   )

//   const PaginationControls = () => {
//     if (totalPages <= 1) return null

//     const getPageNumbers = () => {
//       const pages = []
//       const maxVisible = 5
//       let start = Math.max(1, currentPage - 2)
//       const end = Math.min(totalPages, start + maxVisible - 1)

//       if (end - start < maxVisible - 1) {
//         start = Math.max(1, end - maxVisible + 1)
//       }

//       for (let i = start; i <= end; i++) {
//         pages.push(i)
//       }
//       return pages
//     }

//     return (
//       <div className="pagination-controls">
//         <button
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className="pagination-btn"
//         >
//           <ChevronLeft size={16} />
//           Previous
//         </button>

//         <div className="page-numbers">
//           {getPageNumbers().map((page) => (
//             <button
//               key={page}
//               onClick={() => handlePageChange(page)}
//               className={`page-btn ${page === currentPage ? "active" : ""}`}
//             >
//               {page}
//             </button>
//           ))}
//         </div>

//         <button
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className="pagination-btn"
//         >
//           Next
//           <ChevronRight size={16} />
//         </button>
//       </div>
//     )
//   }

//   const TeacherCard = ({ teacher }) => {
//     return (
//       <div className="teacher-card">
//         {teacher.hasReviewed && (
//           <div className="reviewed-badge">
//             <Check size={14} />
//           </div>
//         )}

//         <div className="card-content">
//           <div className="teacher-header">
//             <div className="teacher-avatar" style={{ background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" }}>
//               <span>{generateInitials(teacher.name)}</span>
//             </div>
//           </div>

//           <div className="teacher-info">
//             <h3 className="teacher-name">{teacher.name}</h3>

//             {teacher.subjects && teacher.subjects.length > 0 && (
//               <div className="subject-tags">
//                 {teacher.subjects.slice(0, 2).map((subject, idx) => (
//                   <span key={idx} className="subject-tag">
//                     {subject.length > 15 ? `${subject.substring(0, 15)}...` : subject}
//                   </span>
//                 ))}
//                 {teacher.subjects.length > 2 && (
//                   <span className="subject-tag more">+{teacher.subjects.length - 2} more</span>
//                 )}
//               </div>
//             )}

//             {teacher.sections && teacher.sections.length > 0 && (
//               <div className="sections-info">
//                 <Users size={14} />
//                 <div className="sections-pills">
//                   {teacher.sections.slice(0, 3).map((section, idx) => (
//                     <span key={idx} className="section-pill">
//                       {section}
//                     </span>
//                   ))}
//                   {teacher.sections.length > 3 && <span className="section-pill">+{teacher.sections.length - 3}</span>}
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="card-actions">
//             <button
//               className={`action-btn review-btn ${!teacher.canReview ? "disabled" : ""}`}
//               onClick={() => teacher.canReview && openGiveReviewModal(teacher)}
//               disabled={!teacher.canReview}
//               aria-disabled={!teacher.canReview}
//               title={!teacher.canReview ? "You have already reviewed this faculty." : "Give a review"}
//               type="button"
//             >
//               <Edit3 size={16} />
//               {teacher.canReview ? "Review" : "Reviewed"}
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (isLoading) return <LoadingSkeleton />
//   if (!teachers || teachers.length === 0) return <EmptyState />

//   return (
//     <div className="teacher-grid-wrapper">
//       <div className="notice-banner">
//         <Info size={18} />
//         <p>
//           This is just to collect data for enhancement. A better designed teacher grid with more features will be
//           updated when it's time for section selection.
//         </p>
//       </div>

//       <div className="grid-header">
//         <div className="header-content">
//           <div className="title-section">
//             <div className="title-wrapper">
//               <Sparkles size={28} className="title-icon" />
//               <h1 className="grid-title">Faculty Excellence</h1>
//             </div>
//             <div className="subtitle">
//               <span>
//                 Page {currentPage} of {totalPages} • {teachers.length} total educators
//               </span>
//               <Award size={16} className="subtitle-icon" />
//             </div>
//           </div>
//           <div className="header-stats">
//             <div className="stat-badge">
//               <Users size={16} />
//               <span>
//                 Showing {currentTeachers.length} of {teachers.length}
//               </span>
//             </div>
//             <div className="stat-badge">
//               <BookOpen size={16} />
//               <span>All Subjects</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="teacher-grid">
//         {teacherCardsData.map((teacher) => (
//           <TeacherCard key={teacher.id} teacher={teacher} />
//         ))}
//       </div>

//       <PaginationControls />
//     </div>
//   )
// }

// export default TeacherGrid
