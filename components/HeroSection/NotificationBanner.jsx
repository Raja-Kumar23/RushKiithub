"use client"

import { useState, useEffect } from "react"
import { X, AlertTriangle, Clock, Mail } from "lucide-react"

const NotificationBanner = ({ theme }) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Show loading message for 5-6 seconds
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 8000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div
      className="notification-banner"
      style={{
        background: `linear-gradient(135deg, ${theme.primary}15 0%, ${theme.secondary}15 100%)`,
        borderColor: theme.border,
        color: theme.textPrimary,
      }}
    >
      <div className="notification-content">
        <div className="notification-icon">
          {isLoading ? <Clock size={20} color={theme.primary} /> : <AlertTriangle size={20} color={theme.secondary} />}
        </div>

        <div className="notification-text">
          {isLoading ? (
            <div>
              <strong>Please wait 5-6 seconds while all PDFs are being loaded...</strong>
            </div>
          ) : (
            <div>
              <div className="notification-title">
                <strong>🚧 Update in Progress</strong>
              </div>
              <div className="notification-message">
                We're sorry for any inconvenience during this update period. Currently, only
                <strong> 3rd and 5th semester PYQs</strong> have been updated.
                <br></br>
                 We'll be updating everything gradually
                and the complete update will be finished within a week. Thank you for your patience!
              </div>
              <div className="notification-contact" style={{ color: theme.textMuted }}>
                <Mail size={14} />
                Having problems viewing PDFs? Please mail us or contact support.
              </div>
            </div>
          )}
        </div>
      </div>

      <button className="notification-close" onClick={() => setIsVisible(false)} style={{ color: theme.textMuted }}>
        <X size={18} />
      </button>
    </div>
  )
}

export default NotificationBanner
