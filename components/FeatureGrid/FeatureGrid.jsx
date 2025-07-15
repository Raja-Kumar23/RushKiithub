import React from 'react'
import { Calculator, CheckSquare, Star, Users, HeadphonesIcon, MessageSquare, ArrowUpRight, Map, FileText } from 'lucide-react'
import './FeatureGrid.css'

const FeatureGrid = ({ theme, user, setShowLoginPrompt, showNotification }) => {
  const features = [
    {
      id: 'cgpa',
      title: 'CGPA Calculator',
      description: 'Calculate your CGPA instantly',
      icon: Calculator,
      gradient: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
      action: () => handleFeatureClick('cgpa'),
      available: true
    },
    {
      id: 'todo',
      title: 'Todo List',
      description: 'Organize your tasks efficiently',
      icon: CheckSquare,
      gradient: `linear-gradient(135deg, ${theme.secondary} 0%, ${theme.accent} 100%)`,
      action: () => handleFeatureClick('todo'),
      available: true
    },
    {
      id: 'faculty',
      title: 'Faculty Reviews',
      description: 'Read and write reviews about faculty members',
      icon: Star,
      gradient: `linear-gradient(135deg, #FFD700 0%, #FFA500 100%)`,
      action: () => handleFeatureClick('faculty'),
      available: true
    },
    {
      id: 'section',
      title: 'Section Swapping',
      description: 'Find students to swap sections',
      icon: Users,
      gradient: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.primary} 100%)`,
      action: () => handleFeatureClick('section'),
      available: true
    },
    {
      id: 'support',
      title: 'Support Hub',
      description: 'Get help and support from our community',
      icon: HeadphonesIcon,
      gradient: `linear-gradient(135deg, #10b981 0%, #059669 100%)`,
      action: () => handleFeatureClick('support'),
      available: true
    },
    {
      id: 'roadmap',
      title: 'Career Roadmap',
      description: 'Explore tech career paths and learning guides',
      icon: Map,
      gradient: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
      action: () => handleFeatureClick('roadmap'),
      available: true
    },
    {
      id: 'pdf-upload',
      title: 'PDF Upload Hub',
      description: 'Share unavailable PDFs and earn rewards',
      icon: FileText,
      gradient: `linear-gradient(135deg, #f59e0b 0%, #d97706 100%)`,
      action: () => handleFeatureClick('pdf-upload'),
      available: true
    },
  ]

  const handleFeatureClick = (featureId) => {
    if (!user) {
      setShowLoginPrompt(true)
      return
    }

    switch (featureId) {
      case 'faculty':
        showNotification('Opening Faculty Reviews...', 'info')
        window.open('/faculty-review', '_blank')
        break
      case 'cgpa':
        showNotification('Opening CGPA Calculator...', 'info')
        window.open('/cgpa', '_blank')
        break
      case 'todo':
        showNotification('Opening Todo List...', 'info')
        window.open('/to-do-list', '_blank')
        break
      case 'section':
        showNotification('Opening Section Swapping...', 'info')
        window.open('/section-swapping', '_blank')
        break
      case 'support':
        showNotification('Opening Support Hub...', 'info')
        window.open('/support-hub', '_blank')
        break
      case 'roadmap':
        showNotification('Opening Career Roadmap...', 'info')
        window.open('/roadmap', '_blank')
        break
      case 'pdf-upload':
        showNotification('Opening PDF Upload Hub...', 'info')
        window.open('/pdf-upload', '_blank')
        break
      default:
        break
    }
  }

  return (
    <div className="feature-grid-section">
      <div className="feature-grid-header">
        <h2 className="feature-grid-title" style={{ color: theme.textPrimary }}>
          Essential Tools
        </h2>
        <p className="feature-grid-subtitle" style={{ color: theme.textMuted }}>
          Everything you need for academic success
        </p>
      </div>

      <div className="feature-grid">
        {features.map((feature, index) => {
          const Icon = feature.icon
          
          return (
            <div
              key={feature.id}
              className="feature-card available"
              onClick={feature.action}
              style={{
                background: theme.glassBg,
                borderColor: theme.border,
                boxShadow: theme.shadow,
                cursor: 'pointer'
              }}
            >
              <div className="feature-card-inner">
                <div className="feature-header">
                  <div 
                    className="feature-icon"
                    style={{ background: feature.gradient }}
                  >
                    <Icon size={20} color="white" />
                  </div>
                  
                  <div className="feature-arrow" style={{ color: theme.textMuted }}>
                    <ArrowUpRight size={16} />
                  </div>
                </div>

                <div className="feature-content">
                  <h3 className="feature-title" style={{ color: theme.textPrimary }}>
                    {feature.title}
                  </h3>
                  <p className="feature-description" style={{ color: theme.textMuted }}>
                    {feature.description}
                  </p>
                </div>

                <div className="feature-footer">
                  <span 
                    className="status-text" 
                    style={{ color: theme.success }}
                  >
                    
                  </span>
                </div>
              </div>

              <div className="feature-overlay" style={{ background: feature.gradient }}></div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FeatureGrid