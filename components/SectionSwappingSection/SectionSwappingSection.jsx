'use client'

import "./SectionSwappingSection.css"

const SectionSwappingSection = ({ theme }) => {
  const stats = [
    { number: "350+", label: "Swap Requests", color: theme.primary },
    { number: "500+", label: "WhatsApp Connections", color: theme.secondary },
    { number: "143%", label: "Engagement Ratio", color: theme.accent },
  ]

  const handleHowItWorksClick = () => {
    // Navigate to the section swapping workflow page in new tab
    window.open('/section-swapping-workflow', '_blank')
  }

  return (
    <div className="section-swapping-section">
      <div className="section-header">
        <h2 className="section-title" style={{ color: theme.textPrimary }}>
          Section Swapping
        </h2>
        <p className="section-subtitle" style={{ color: theme.textMuted }}>
          Connect with fellow students to swap sections and get your preferred schedule
        </p>
      </div>

      {/* Stats Grid */}
      <div className="section-stats-grid">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="section-stat-card"
            style={{
              background: theme.glassBg,
              borderColor: theme.border,
              boxShadow: theme.shadow,
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

      <div className="section-cta" style={{ textAlign: "center", marginTop: "40px" }}>
        <button
          onClick={handleHowItWorksClick}
          style={{
            display: 'inline-block',
            background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
            color: 'white',
            padding: '16px 32px',
            borderRadius: '16px',
            fontSize: '1.1rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: theme.shadow,
            border: 'none',
            marginBottom: '30px',
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
          How Section Swapping Works
        </button>
      </div>

      {/* WhatsApp CTA */}
      <div className="whatsapp-cta">
        <div
          className="whatsapp-banner"
          style={{
            background: `linear-gradient(135deg, ${theme.success}15 0%, ${theme.primary}15 100%)`,
            borderColor: `${theme.success}30`,
          }}
        >
          <div className="whatsapp-icon" style={{ color: theme.success }}>
            💬
          </div>
          <div className="whatsapp-content">
            <h3 style={{ color: theme.success }}>Join Our WhatsApp Community!</h3>
            <p style={{ color: theme.textMuted }}>
              Connect with 1300+ KIIT students for section swapping, study groups, and more
            </p>
            <a
              href="https://chat.whatsapp.com/L49NFqYQ1aWCRObYUBpZax"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-button"
              style={{
                background: `linear-gradient(135deg, ${theme.success} 0%, ${theme.primary} 100%)`,
                color: "white",
              }}
            >
              Join WhatsApp Group
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SectionSwappingSection