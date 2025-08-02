"use client"
import { useState } from "react"
import { Bell, Calendar, ArrowRight, CheckCircle, ExternalLink, Sparkles, AlertTriangle, Monitor, Smartphone, Shield } from 'lucide-react'
import "./styles.css"

const UpdatesPage = () => {
  const [theme, setTheme] = useState({
    primary: "#60a5fa",
    secondary: "#a78bfa",
    accent: "#22d3ee",
    warning: "#fbbf24",
    error: "#f87171",
    success: "#34d399",
    textPrimary: "#f9fafb",
    textSecondary: "#e5e7eb",
    textMuted: "#9ca3af",
    cardBg: "#1f2937",
    glassBg: "rgba(31, 41, 55, 0.8)",
    border: "#374151",
    background: "#111827",
  })

  const updates = [
    {
      id: 1,
      date: "2025-07-27",
      title: "KIITHUB Just Got a Major Upgrade!",
      type: "major",
      icon: "🚀",
      description: "We've improved the entire experience to make it smoother, smarter, and more useful for students.",
      features: [
        {
          title: "High-Quality PDFs",
          description: "Open directly on the site with better clarity",
          icon: "📄",
        },
        {
          title: "Text-Copy Enabled",
          description: "Most PDFs now allow easy text copying",
          icon: "📋",
        },
        {
          title: "GitHub README Generator",
          description: "Create dynamic GitHub profiles",
          link: "https://kiithub.in/github-readme-generator/",
          icon: "🔧",
        },
        {
          title: "Smarter Search & Suggestions",
          description: "Quickly find what you need",
          icon: "🔍",
        },
        {
          title: "Project Ideas Hub",
          description: "Now includes custom project help, C projects, tutorials & more",
          link: "https://kiithub.in/project-ideas/",
          icon: "💡",
        },
        {
          title: "Visit KIITHub.in Main Page",
          description: "Access the complete platform with 5K+ students, 500+ resources, and 50+ subjects",
          link: "https://kiithub.in",
          icon: "🏠",
        },
      ],
      notes: [
        "Core features like PYQs, Notes, CGPA tools, etc., remain completely FREE",
        "Faculty Reviews & Section Swapping will be launched as premium features in the future with minimal charges",
      ],
      limitations: [
        {
          text: "For now, all PYQs, notes, and important documents are only accessible on laptop or Windows devices due to some technical problems. We couldn't complete the mobile PDF updates yet.",
          icon: <Monitor size={16} />,
          type: "device"
        },
        {
          text: "Mobile device support for PDF viewing  will be completed in future updates. We're working hard to resolve this issue.",
          icon: <Smartphone size={16} />,
          type: "mobile"
        },
        {
          text: "For security reasons, we have blocked developer tools access. If developer tools are detected more than 3 times, the user will be permanently blocked from the site.",
          icon: <Shield size={16} />,
          type: "security"
        },
        {
          text: "After opening the site, you may need to wait a few seconds while all PDFs are being loaded for optimal performance",
          icon: <AlertTriangle size={16} />,
          type: "performance"
        },
        {
          text: "Currently, we have updated only 3rd and 5th semester PDFs with all required materials. We will gradually be updating every semester's PYQs, notes, and everything else",
          icon: <Calendar size={16} />,
          type: "content"
        },
        {
          text: "We still have many things to do and many bugs are there. We are actively fixing them and trying to make it completely the best. Keep supporting us! ",
          icon: <Sparkles size={16} />,
          type: "general"
        },
      ],
    },
    {
      id: 2,
      date: "2025-07-27",
      title: "Security & Performance Improvements",
      type: "improvement",
      icon: "🔒",
      description: "Enhanced security measures and performance optimizations for better user experience.",
      features: [
        {
          title: "Developer Tools Protection",
          description: "Advanced security to prevent unauthorized access",
          icon: "🛡️",
        },
        {
          title: "50% Faster Loading",
          description: "Optimized performance for better user experience",
          icon: "🚀",
        },
        {
          title: "Desktop Optimization",
          description: "Enhanced experience for laptop and desktop users",
          icon: "💻",
        },
      ],
      limitations: [
        {
          text: "Mobile users will see a notification that features are currently desktop-only",
          icon: <Smartphone size={16} />,
          type: "mobile"
        },
        {
          text: "Users attempting to access developer tools will receive warnings before being blocked",
          icon: <Shield size={16} />,
          type: "security"
        },
      ],
    },
  ]

  const getUpdateTypeColor = (type) => {
    switch (type) {
      case "major":
        return theme.primary
      case "feature":
        return theme.success
      case "improvement":
        return theme.warning
      default:
        return theme.secondary
    }
  }

  const getUpdateTypeLabel = (type) => {
    switch (type) {
      case "major":
        return "Major Update"
      case "feature":
        return "New Feature"
      case "improvement":
        return "Improvement"
      default:
        return "Update"
    }
  }

  const getLimitationColor = (type) => {
    switch (type) {
      case "device":
        return theme.warning
      case "mobile":
        return theme.accent
      case "security":
        return theme.error
      case "performance":
        return theme.primary
      case "content":
        return theme.secondary
      default:
        return theme.error
    }
  }

  const getLimitationBg = (type) => {
    switch (type) {
      case "device":
        return `${theme.warning}15`
      case "mobile":
        return `${theme.accent}15`
      case "security":
        return `${theme.error}15`
      case "performance":
        return `${theme.primary}15`
      case "content":
        return `${theme.secondary}15`
      default:
        return `${theme.error}15`
    }
  }

  return (
    <div className="updates-page" style={{ background: theme.background }}>
      <div className="updates-container">
        {/* Header */}
        <div className="updates-header">
          <div className="header-content">
            <div
              className="header-icon"
              style={{ background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)` }}
            >
              <Bell size={32} color="white" />
            </div>
            <div className="header-text">
              <h1 className="header-title" style={{ color: theme.textPrimary }}>
                Latest Updates
              </h1>
              <p className="header-description" style={{ color: theme.textMuted }}>
                Stay up to date with the latest features, improvements, and announcements from KIITHub
              </p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number" style={{ color: theme.primary }}>
                {updates.length}
              </span>
              <span className="stat-label" style={{ color: theme.textMuted }}>
                Updates
              </span>
            </div>
          </div>
        </div>

        {/* Updates List */}
        <div className="updates-list">
          {updates.map((update) => (
            <div
              key={update.id}
              className="update-card"
              style={{
                background: theme.cardBg,
                borderColor: theme.border,
              }}
            >
              <div className="update-header">
                <div className="update-meta">
                  <div
                    className="update-type-badge"
                    style={{
                      background: `${getUpdateTypeColor(update.type)}20`,
                      color: getUpdateTypeColor(update.type),
                      borderColor: `${getUpdateTypeColor(update.type)}30`,
                    }}
                  >
                    <Sparkles size={12} />
                    {getUpdateTypeLabel(update.type)}
                  </div>
                  <div className="update-date" style={{ color: theme.textMuted }}>
                    <Calendar size={14} />
                    {new Date(update.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div className="update-icon">{update.icon}</div>
              </div>

              <div className="update-content">
                <h2 className="update-title" style={{ color: theme.textPrimary }}>
                  {update.title}
                </h2>
                <p className="update-description" style={{ color: theme.textSecondary }}>
                  {update.description}
                </p>

                {update.features && (
                  <div className="update-features">
                    <h3 className="features-title" style={{ color: theme.textPrimary }}>
                      ✨ What's New?
                    </h3>
                    <div className="features-grid">
                      {update.features.map((feature, index) => (
                        <div
                          key={index}
                          className="feature-item"
                          style={{
                            background: theme.glassBg,
                            borderColor: theme.border,
                          }}
                        >
                          <div className="feature-icon">{feature.icon}</div>
                          <div className="feature-content">
                            <h4 className="feature-title" style={{ color: theme.textPrimary }}>
                              {feature.title}
                            </h4>
                            <p className="feature-description" style={{ color: theme.textMuted }}>
                              {feature.description}
                            </p>
                            {feature.link && (
                              <a href={feature.link} className="feature-link" style={{ color: theme.primary }}>
                                Try it now <ArrowRight size={12} />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {update.notes && (
                  <div className="update-notes">
                    <h3 className="notes-title" style={{ color: theme.textPrimary }}>
                      📌 Important Notes
                    </h3>
                    <ul className="notes-list">
                      {update.notes.map((note, index) => (
                        <li key={index} className="note-item" style={{ color: theme.textSecondary }}>
                          <CheckCircle size={16} color={theme.success} />
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {update.limitations && (
                  <div className="update-limitations">
                    <h3 className="limitations-title" style={{ color: theme.textPrimary }}>
                      ⚠️ Current Limitations & Known Issues
                    </h3>
                    <div className="limitations-grid">
                      {update.limitations.map((limitation, index) => (
                        <div
                          key={index}
                          className="limitation-item"
                          style={{
                            background: getLimitationBg(limitation.type),
                            borderColor: `${getLimitationColor(limitation.type)}30`,
                            color: theme.textSecondary,
                          }}
                        >
                          <div className="limitation-icon" style={{ color: getLimitationColor(limitation.type) }}>
                            {limitation.icon}
                          </div>
                          <div className="limitation-content">
                            <span className="limitation-text">{limitation.text}</span>
                            <span className="limitation-type" style={{ color: getLimitationColor(limitation.type) }}>
                              {limitation.type.charAt(0).toUpperCase() + limitation.type.slice(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div
          className="updates-footer"
          style={{
            background: `linear-gradient(135deg, ${theme.primary}10 0%, ${theme.secondary}10 100%)`,
            borderColor: theme.border,
          }}
        >
          <div className="footer-content">
            <h3 className="footer-title" style={{ color: theme.textPrimary }}>
              Stay Connected
            </h3>
            <p className="footer-description" style={{ color: theme.textMuted }}>
              Join our WhatsApp group to get instant updates and connect with fellow KIIT students
            </p>
            <a
              href="https://chat.whatsapp.com/L49NFqYQ1aWCRObYUBpZax"
              className="footer-cta"
              style={{
                background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                color: "white",
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Join WhatsApp Group
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdatesPage
