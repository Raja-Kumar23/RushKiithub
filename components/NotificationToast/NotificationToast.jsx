import React, { useEffect } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import './NotificationToast.css'

const NotificationToast = ({ message, type = 'info', onClose, theme }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />
      case 'error':
        return <AlertCircle size={20} />
      case 'warning':
        return <AlertCircle size={20} />
      default:
        return <Info size={20} />
    }
  }

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          background: `${theme.success}15`,
          border: `${theme.success}30`,
          icon: theme.success,
          text: theme.success
        }
      case 'error':
        return {
          background: `${theme.error}15`,
          border: `${theme.error}30`,
          icon: theme.error,
          text: theme.error
        }
      case 'warning':
        return {
          background: `${theme.warning}15`,
          border: `${theme.warning}30`,
          icon: theme.warning,
          text: theme.warning
        }
      default:
        return {
          background: `${theme.primary}15`,
          border: `${theme.primary}30`,
          icon: theme.primary,
          text: theme.primary
        }
    }
  }

  const colors = getColors()

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 4000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="toast-container">
      <div 
        className={`toast ${type}`}
        style={{
          background: colors.background,
          borderColor: colors.border,
          boxShadow: theme.shadow
        }}
      >
        <div className="toast-content">
          <div className="toast-icon" style={{ color: colors.icon }}>
            {getIcon()}
          </div>
          
          <span className="toast-message" style={{ color: theme.textPrimary }}>
            {message}
          </span>
          
          <button
            className="toast-close"
            onClick={onClose}
            style={{ color: theme.textMuted }}
          >
            <X size={18} />
          </button>
        </div>
        
        <div 
          className="toast-progress"
          style={{ background: colors.icon }}
        ></div>
      </div>
    </div>
  )
}

export default NotificationToast