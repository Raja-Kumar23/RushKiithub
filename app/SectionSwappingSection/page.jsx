"use client"
import Link from "next/link"
import "./SectionSwappingHowItWorks.css"

// Enhanced default theme with all required properties
const defaultTheme = {
  background: '#0f172a',
  primary: '#6366f1',
  secondary: '#8b5cf6',
  textPrimary: '#f1f5f9',
  textMuted: '#94a3b8',
  glassBg: 'rgba(30, 41, 59, 0.5)',
  border: 'rgba(148, 163, 184, 0.2)',
  shadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
  success: '#10b981',
  cardBg: 'rgba(15, 23, 42, 0.8)',
  gradientStart: '#6366f1',
  gradientEnd: '#8b5cf6'
};

const SectionSwappingHowItWorks = ({ theme = defaultTheme }) => {
  const steps = [
    {
      step: "01",
      title: "Complete Section Selection",
      description: "Premium users must first complete their section selection process to unlock swapping features.",
      icon: "✅",
    },
    {
      step: "02",
      title: "Post Your Swap Request",
      description: "Create up to 3 swap requests with your current section, desired section, and reason for swapping.",
      icon: "📝",
    },
    {
      step: "03",
      title: "Browse Available Swaps",
      description: "View all posted requests, filter by your desired sections, and find potential swap partners.",
      icon: "🔍",
    },
    {
      step: "04",
      title: "Connect via WhatsApp",
      description: "Contact your swap partner directly through integrated WhatsApp to finalize the exchange.",
      icon: "💬",
    },
  ]

  const features = [
    {
      title: "Smart Matching",
      description: "Our system shows you the most relevant swap opportunities based on your preferences.",
      icon: "🎯",
    },
    {
      title: "3 Request Limit",
      description: "Premium users get 3 swap requests to ensure quality and prevent spam.",
      icon: "3️⃣",
    },
    {
      title: "Auto-Fill Forms",
      description: "Your name and details are automatically filled from your profile for quick posting.",
      icon: "⚡",
    },
    {
      title: "WhatsApp Integration",
      description: "Direct contact with swap partners through our integrated WhatsApp system.",
      icon: "📱",
    },
  ]

  return (
    <div className="how-it-works-container" style={{ 
      backgroundColor: theme.background,
      color: theme.textPrimary 
    }}>
      {/* Header Section */}
      <div className="how-it-works-header">
        <Link href="/" className="back-button" style={{ 
          color: theme.primary,
          borderColor: theme.primary 
        }}>
          ← Back to Home
        </Link>
        <h1 className="main-title" style={{ 
          background: `linear-gradient(135deg, ${theme.gradientStart || theme.primary} 0%, ${theme.gradientEnd || theme.secondary} 100%)`,
          textShadow: `0 0 30px ${theme.primary}80`
        }}>
          How Section Swapping Works
        </h1>
        <p className="main-subtitle" style={{ color: theme.textMuted }}>
          A step-by-step guide to finding your perfect section swap partner
        </p>
      </div>

      {/* Steps Section */}
      <div className="steps-section">
        <h2 className="section-title" style={{ color: theme.textPrimary }}>
          Simple 4-Step Process
        </h2>
        <div className="steps-grid">
          {steps.map((step, index) => (
            <div
              key={index}
              className="step-card"
              style={{
                background: theme.cardBg || theme.glassBg,
                borderColor: theme.border,
                boxShadow: theme.shadow,
              }}
            >
              <div className="step-number" style={{ color: theme.primary }}>
                {step.step}
              </div>
              <div className="step-icon">{step.icon}</div>
              <h3 className="step-title" style={{ color: theme.textPrimary }}>
                {step.title}
              </h3>
              <p className="step-description" style={{ color: theme.textMuted }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="section-title" style={{ color: theme.textPrimary }}>
          Key Features
        </h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card"
              style={{
                background: theme.cardBg || theme.glassBg,
                borderColor: theme.border,
                boxShadow: theme.shadow,
              }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title" style={{ color: theme.textPrimary }}>
                {feature.title}
              </h3>
              <p className="feature-description" style={{ color: theme.textMuted }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Form Preview Section */}
      <div className="form-preview-section">
        <h2 className="section-title" style={{ color: theme.textPrimary }}>
          What You'll Need to Post
        </h2>
        <div
          className="form-preview"
          style={{
            background: theme.cardBg || theme.glassBg,
            borderColor: theme.border,
            boxShadow: theme.shadow,
          }}
        >
          <div className="form-field">
            <span className="field-label" style={{ color: theme.textMuted }}>
              Name:
            </span>
            <span className="field-value" style={{ color: theme.success }}>
              Auto-filled from profile
            </span>
          </div>
          <div className="form-field">
            <span className="field-label" style={{ color: theme.textMuted }}>
              Phone Number:
            </span>
            <span className="field-value" style={{ color: theme.textPrimary }}>
              Required for contact
            </span>
          </div>
          <div className="form-field">
            <span className="field-label" style={{ color: theme.textMuted }}>
              Current Section:
            </span>
            <span className="field-value" style={{ color: theme.textPrimary }}>
              Your assigned section
            </span>
          </div>
          <div className="form-field">
            <span className="field-label" style={{ color: theme.textMuted }}>
              Desired Section:
            </span>
            <span className="field-value" style={{ color: theme.textPrimary }}>
              Section you want to swap to
            </span>
          </div>
          <div className="form-field">
            <span className="field-label" style={{ color: theme.textMuted }}>
              Reason:
            </span>
            <span className="field-value" style={{ color: theme.textPrimary }}>
              Why you need this swap
            </span>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div
          className="cta-card"
          style={{
            background: `linear-gradient(135deg, ${theme.primary}15 0%, ${theme.secondary}15 100%)`,
            borderColor: `${theme.primary}30`,
          }}
        >
          <h3 style={{ color: theme.primary }}>Ready to Start Swapping?</h3>
          <p style={{ color: theme.textMuted }}>Join 350+ students who have successfully swapped their sections</p>
          <button
            className="start-swapping-btn"
            style={{
              background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
              color: "white",
            }}
          >
            Start Section Swapping
          </button>
        </div>
      </div>

      {/* WhatsApp CTA */}
      <div className="whatsapp-cta-bottom">
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

export default SectionSwappingHowItWorks