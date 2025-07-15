import React from 'react'
import { X, History, Trash2, Search, ArrowRight } from 'lucide-react'
import './HistorySidebar.css'

const HistorySidebar = ({ 
  isOpen, 
  setIsOpen, 
  searchHistory, 
  theme, 
  user, 
  setShowLoginPrompt 
}) => {
  const clearHistory = () => {
    localStorage.removeItem("searchHistory")
    window.location.reload()
  }

  const openPaper = (query) => {
    if (!user) {
      setShowLoginPrompt(true)
      return
    }
    // Implementation would go here
    console.log('Opening paper:', query)
  }

  return (
    <>
      {isOpen && (
        <div 
          className="history-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <div 
        className={`history-sidebar ${isOpen ? 'open' : ''}`}
        style={{
          background: theme.cardBg,
          borderColor: theme.border,
          boxShadow: theme.shadow
        }}
      >
        <div className="history-header">
          <div className="history-title-section">
            <div className="history-icon" style={{ color: theme.primary }}>
              <History size={22} />
            </div>
            <h3 className="history-title" style={{ color: theme.textPrimary }}>
              Search History
            </h3>
          </div>
          
          <button
            className="close-history"
            onClick={() => setIsOpen(false)}
            style={{ color: theme.textMuted }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="history-content">
          {searchHistory.length > 0 ? (
            <>
              <div className="history-actions">
                <button
                  className="clear-history-btn"
                  onClick={clearHistory}
                  style={{
                    background: `${theme.error}15`,
                    color: theme.error,
                    borderColor: `${theme.error}30`
                  }}
                >
                  <Trash2 size={16} />
                  Clear All
                </button>
              </div>

              <div className="history-list">
                {searchHistory.map((item, index) => (
                  <button
                    key={index}
                    className="history-item"
                    onClick={() => openPaper(item)}
                    style={{ 
                      borderColor: theme.border,
                      color: theme.textPrimary
                    }}
                  >
                    <div className="history-item-content">
                      <Search size={16} color={theme.primary} />
                      <span className="history-item-text">{item}</span>
                    </div>
                    <ArrowRight size={14} color={theme.textMuted} />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="history-empty">
              <div className="empty-icon" style={{ color: theme.textMuted }}>
                <Search size={48} />
              </div>
              <h4 className="empty-title" style={{ color: theme.textPrimary }}>
                No Search History
              </h4>
              <p className="empty-description" style={{ color: theme.textMuted }}>
                Start searching for study materials to see your history here
              </p>
            </div>
          )}
        </div>

        <div className="history-footer" style={{ borderColor: theme.border }}>
          <p className="history-info" style={{ color: theme.textMuted }}>
            {searchHistory.length} recent searches
          </p>
        </div>
      </div>
    </>
  )
}

export default HistorySidebar