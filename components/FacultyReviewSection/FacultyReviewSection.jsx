import React, { useState } from 'react'
import './FacultyReviewSection.css'

const FacultyReviewSection = ({ theme }) => {
  const stats = [
    { number: '250+', label: 'Faculty Members', color: theme.primary },
    { number: '100+', label: 'Reviews Posted', color: theme.secondary },
    { number: '50+', label: 'Departments', color: theme.accent }
  ]

  const handleHowItWorksClick = () => {
    // Navigate to the faculty review workflow page
    window.open('/faculty-review-workflow', '_blank')
  }

  return (
    <div className="faculty-review-section">
      <div className="faculty-header">
        <h2 className="faculty-title" style={{ color: theme.textPrimary }}>
          Faculty Review System
        </h2>
        <p className="faculty-subtitle" style={{ color: theme.textMuted }}>
          Help fellow students make informed decisions about course selections
        </p>
      </div>

      {/* Stats Grid */}
      <div className="faculty-stats-grid">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="faculty-stat-card"
            style={{
              background: theme.glassBg,
              borderColor: theme.border,
              boxShadow: theme.shadow
            }}
          >
            <div className="stat-number" style={{ color: stat.color }}>
              {stat.number}
            </div>
            <div className="stat-label" style={{ color: theme.textMuted }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* How it Works Button */}
      <div className="faculty-cta">
        <button
          onClick={handleHowItWorksClick}
          className="how-it-works-btn"
          style={{
            background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
            color: 'white',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '16px',
            fontSize: '1.1rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: theme.shadow
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)'
            e.target.style.boxShadow = `0 15px 40px ${theme.primary}40`
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = theme.shadow
          }}
        >
          How Faculty Reviews Work
        </button>
      </div>
    </div>
  )
}

export default FacultyReviewSection