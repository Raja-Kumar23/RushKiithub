import React, { useState } from 'react'
import { BookOpen, Users, Award, X } from 'lucide-react'
import './HeroSection.css'

const HeroSection = ({ user, theme }) => {
  // 🔹 State to control WhatsApp box visibility
  const [showWhatsapp, setShowWhatsapp] = useState(true)

  return (
    <section className="hero-section" style={{ color: theme.textPrimary }}>
      
      
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Welcome to{' '}
              <span className="hero-brand" style={{ 
                background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                KIITHub
              </span>
            </h1>
            <p className="hero-subtitle" style={{ color: theme.textMuted }}>
              Access study materials, previous year questions, notes, solutions, CGPA calculator, section swapping, faculty reviews, and more — everything you need to excel at KIIT in one place.
            </p>
            {user ? (
              <div className="hero-welcome" style={{ 
                background: theme.glassBg,
                borderColor: theme.border,
                color: theme.textPrimary
              }}>
                <div className="welcome-icon">👋</div>
                <span>Welcome back, <strong>{user.displayName?.split(' ')[0]}!</strong></span>
              </div>
            ) : (
              <div className="hero-cta">
                <p style={{ color: theme.textMuted }}>
                  Sign in with your KIIT email to unlock all features
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat-item" style={{ 
            background: theme.glassBg,
            borderColor: theme.border 
          }}>
            <div className="stat-number" style={{ color: theme.primary }}>5K+</div>
            <div className="stat-label" style={{ color: theme.textMuted }}>Students</div>
          </div>
          <div className="stat-item" style={{ 
            background: theme.glassBg,
            borderColor: theme.border 
          }}>
            <div className="stat-number" style={{ color: theme.secondary }}>500+</div>
            <div className="stat-label" style={{ color: theme.textMuted }}>Resources</div>
          </div>
          <div className="stat-item" style={{ 
            background: theme.glassBg,
            borderColor: theme.border 
          }}>
            <div className="stat-number" style={{ color: theme.accent }}>50+</div>
            <div className="stat-label" style={{ color: theme.textMuted }}>Subjects</div>
          </div>
        </div>
      </div>

      <div className="hero-decoration">
        <div className="floating-element" style={{ background: `${theme.primary}20` }}>
          <BookOpen size={20} color={theme.primary} />
        </div>
        <div className="floating-element" style={{ background: `${theme.secondary}20` }}>
          <Users size={18} color={theme.secondary} />
        </div>
        <div className="floating-element" style={{ background: `${theme.accent}20` }}>
          <Award size={22} color={theme.accent} />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
