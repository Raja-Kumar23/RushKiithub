"use client";

import React from "react";
import "./styles.css";

const AllSectionsSection = ({
  teachers = [], // ✅ default empty array to prevent undefined errors
  getTeacherReviewStats,
  openViewReviewsModal,
  openSectionModal,
  onClose,
}) => {
  const getSectionStats = () => {
    const sectionMap = new Map();

    // ✅ Only loop if teachers exists
    (teachers || []).forEach((teacher) => {
      if (teacher.sections && Array.isArray(teacher.sections)) {
        teacher.sections.forEach((section) => {
          if (!sectionMap.has(section)) {
            sectionMap.set(section, {
              teachers: [],
              totalReviews: 0,
              totalRating: 0,
            });
          }

          const stats = getTeacherReviewStats
            ? getTeacherReviewStats(teacher.id, teacher.name)
            : { totalReviews: 0, overallAverage: 0 };

          const sectionData = sectionMap.get(section);

          sectionData.teachers.push({
            ...teacher,
            stats,
          });
          sectionData.totalReviews += stats.totalReviews || 0;
          sectionData.totalRating += parseFloat(stats.overallAverage || 0);
        });
      }
    });

    // Calculate average ratings for sections
    const sectionsArray = Array.from(sectionMap.entries()).map(
      ([section, data]) => {
        const averageRating =
          data.teachers.length > 0
            ? (data.totalRating / data.teachers.length).toFixed(1)
            : 0;

        return {
          section,
          ...data,
          averageRating: parseFloat(averageRating),
        };
      }
    );

    return sectionsArray.sort((a, b) => b.averageRating - a.averageRating);
  };

  const getRatingColor = (rating) => {
    if (rating >= 3.5) return "excellent";
    if (rating >= 2.5) return "good";
    if (rating >= 1.5) return "average";
    return "poor";
  };

  const getRatingText = (rating) => {
    if (rating >= 3.5) return "Excellent";
    if (rating >= 2.5) return "Good";
    if (rating >= 1.5) return "Average";
    return "Poor";
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="stars">
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
    );
  };

  const sectionStats = getSectionStats();

  return (
    <div className="all-sections-container">
      <div className="sections-header">
        <div className="header-content">
          <h2>Section Overview</h2>
          <p>Compare faculty performance across different sections</p>
        </div>
        <button className="close-btn" onClick={onClose}>
          <svg
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

      <div className="sections-grid">
        {sectionStats.map(
          ({ section, teachers: sectionTeachers, averageRating, totalReviews }) => {
            const ratingColor = getRatingColor(averageRating);
            const ratingText = getRatingText(averageRating);

            return (
              <div key={section} className={`section-card ${ratingColor}`}>
                <div className="section-header">
                  <div className="section-title">
                    <h3>Section {section}</h3>
                    <span className="teacher-count">
                      {sectionTeachers.length} teachers
                    </span>
                  </div>
                  <div className="section-rating">
                    <div className="rating-score">{averageRating}</div>
                    <div className="rating-label">{ratingText}</div>
                  </div>
                </div>

                <div className="section-stats">
                  <div className="stat-row">
                    <div className="stat">
                      <span className="stat-value">{totalReviews}</span>
                      <span className="stat-label">Total Reviews</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{averageRating}</span>
                      <span className="stat-label">Avg Rating</span>
                    </div>
                  </div>

                  <div className="rating-stars">
                    {renderStars(averageRating)}
                  </div>
                </div>

                <div className="section-teachers">
                  <h4>Top Teachers</h4>
                  <div className="teachers-list">
                    {sectionTeachers
                      .sort(
                        (a, b) =>
                          parseFloat(b.stats.overallAverage) -
                          parseFloat(a.stats.overallAverage)
                      )
                      .slice(0, 3)
                      .map((teacher) => (
                        <div key={teacher.id} className="teacher-item">
                          <div className="teacher-avatar">
                            {teacher.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="teacher-info">
                            <span className="teacher-name">{teacher.name}</span>
                            <span className="teacher-rating">
                              ★ {teacher.stats.overallAverage}
                            </span>
                          </div>
                          <button
                            className="view-teacher-btn"
                            onClick={() => openViewReviewsModal?.(teacher)}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                        </div>
                      ))}
                  </div>

                  {sectionTeachers.length > 3 && (
                    <button
                      className="view-all-btn"
                      onClick={() => openSectionModal?.(section)}
                    >
                      View All {sectionTeachers.length} Teachers
                    </button>
                  )}
                </div>

                <div className="section-performance">
                  <div className="performance-bar">
                    <div
                      className={`performance-fill ${ratingColor}`}
                      style={{ width: `${(averageRating / 4) * 100}%` }}
                    ></div>
                  </div>
                  <span className="performance-text">
                    Section Performance: {((averageRating / 4) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          }
        )}
      </div>

      {sectionStats.length === 0 && (
        <div className="empty-sections">
          <div className="empty-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </div>
          <h3>No Sections Found</h3>
          <p>No section data available for the selected teachers.</p>
        </div>
      )}
    </div>
  );
};

export default AllSectionsSection;
