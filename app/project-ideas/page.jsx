"use client"
import React, { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { Search, ExternalLink, Youtube, Code, X } from 'lucide-react'
import { auth } from '../../lib/firebase'
import projectsData from './projects.json'
import './styles.css'

const ProjectIdeasPage = () => {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedTech, setSelectedTech] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredProjects, setFilteredProjects] = useState([])
  const [showPopup, setShowPopup] = useState(false)

  const theme = {
    primary: '#8b5cf6',
    secondary: '#7c3aed',
    accent: '#a855f7',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    cardBg: '#1e293b',
    textPrimary: '#f8fafc',
    textSecondary: '#e2e8f0',
    textMuted: '#94a3b8',
    border: '#334155',
    shadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
  }

  const technologies = ['all', 'HTML/CSS', 'JavaScript', 'React', 'Next.js', 'Python', 'Node.js', 'Vue.js', 'Angular', 'Flutter']

  // Authentication check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        if (currentUser.email.endsWith('@kiit.ac.in')) {
          const rollNumber = currentUser.email.split('@')[0]
          if (rollNumber.startsWith('22') || rollNumber.startsWith('23')) {
            setUser(currentUser)
          } else {
            // Show message for other KIIT students and redirect after 20 seconds
            setAuthLoading(false)
            setTimeout(() => {
              window.location.href = '/'
            }, 20000)
          }
        } else {
          // Non-KIIT email - redirect to sign in
          setAuthLoading(false)
          setTimeout(() => {
            window.location.href = '/'
          }, 3000)
        }
      } else {
        // No user - redirect to sign in
        setAuthLoading(false)
        setTimeout(() => {
          window.location.href = '/'
        }, 3000)
      }
      setAuthLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Filter projects based on search, level, and technology
  useEffect(() => {
    let allProjects = []
    
    if (selectedLevel === 'all') {
      allProjects = [...projectsData.beginner, ...projectsData.intermediate, ...projectsData.advanced]
    } else {
      allProjects = projectsData[selectedLevel] || []
    }

    if (selectedTech !== 'all') {
      allProjects = allProjects.filter(project => 
        project.technology === selectedTech
      )
    }

    if (searchTerm) {
      allProjects = allProjects.filter(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredProjects(allProjects)
  }, [selectedLevel, selectedTech, searchTerm])

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#10b981'
      case 'Intermediate': return '#f59e0b'
      case 'Advanced': return '#ef4444'
      default: return theme.primary
    }
  }

  const getButtonGradient = (index) => {
    const gradients = [
      'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', // Purple
      'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', // Blue
      'linear-gradient(135deg, #10b981 0%, #059669 100%)', // Green
      'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', // Orange
      'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', // Red
      'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)', // Purple to Blue
      'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', // Cyan
      'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)', // Lime
      'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', // Orange Red
      'linear-gradient(135deg, #ec4899 0%, #db2777 100%)', // Pink
    ]
    return gradients[index % gradients.length]
  }

  const getTechColor = (tech) => {
    const colors = {
      'HTML/CSS': '#e34c26',
      'JavaScript': '#f7df1e',
      'React': '#61dafb',
      'Next.js': '#000000',
      'Python': '#3776ab',
      'Node.js': '#339933',
      'Vue.js': '#4fc08d',
      'Angular': '#dd0031',
      'Flutter': '#02569b'
    }
    return colors[tech] || theme.primary
  }

  const handleSourceCodeClick = () => {
    setShowPopup(true)
  }

  if (authLoading) {
    return (
      <div className="loading-container" style={{ background: theme.background }}>
        <div className="loading-spinner" style={{ borderTopColor: theme.primary }}></div>
        <p style={{ color: theme.textPrimary }}>Verifying access...</p>
      </div>
    )
  }

  // Show message for non-KIIT emails
  if (!user && !authLoading) {
    const currentUser = auth.currentUser
    if (!currentUser || (currentUser && !currentUser.email.endsWith('@kiit.ac.in'))) {
      return (
        <div className="access-denied-container" style={{ background: theme.background }}>
          <div className="access-denied-content" style={{ background: theme.cardBg, color: theme.textPrimary }}>
            <h2>Please Sign In</h2>
            <p>Only KIIT Gmail accounts are allowed to access this feature.</p>
            <p>Redirecting to sign in page...</p>
          </div>
        </div>
      )
    }
    
    // Show message for other KIIT students (not 3rd/4th year)
    if (currentUser && currentUser.email.endsWith('@kiit.ac.in')) {
      const rollNumber = currentUser.email.split('@')[0]
      if (!rollNumber.startsWith('22') && !rollNumber.startsWith('23')) {
        return (
          <div className="access-denied-container" style={{ background: theme.background }}>
            <div className="access-denied-content" style={{ background: theme.cardBg, color: theme.textPrimary }}>
              <h2>Feature Coming Soon</h2>
              <p>For now, only 3rd and 4th year students can access this feature.</p>
              <p>Redirecting to main page...</p>
            </div>
          </div>
        )
      }
    }
  }

  return (
    <div className="project-ideas-container" style={{ background: theme.background }}>
      {/* Header */}
      <div className="header" style={{ background: theme.cardBg, borderBottom: `1px solid ${theme.border}` }}>
        <div className="header-content">
          {/* Left side - Logo */}
          <div className="header-left">
            <div className="logo-section" onClick={() => window.location.href = '/'}>
              <img src="/logo.png" alt="KiitHub Logo" className="logo" />
              <span style={{ color: theme.textPrimary }}>KiitHub</span>
            </div>
          </div>

          {/* Center - Title */}
          <div className="header-center">
            <h1 style={{ color: theme.textPrimary }}>Project Ideas Hub</h1>
            <p style={{ color: theme.textMuted }}>50+ Amazing Projects with Tutorials</p>
          </div>

          {/* Right side - Search and Filters */}
          <div className="header-right">
            <div className="search-box" style={{ border: `1px solid ${theme.border}` }}>
              <Search size={18} style={{ color: theme.textMuted }} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: 'transparent',
                  color: theme.textPrimary,
                  border: 'none',
                  outline: 'none'
                }}
              />
            </div>
            
            <div className="filter-group">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                style={{
                  background: theme.cardBg,
                  color: theme.textPrimary,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  padding: '6px 10px',
                  fontSize: '0.85rem'
                }}
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              
              <select
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value)}
                style={{
                  background: theme.cardBg,
                  color: theme.textPrimary,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  padding: '6px 10px',
                  fontSize: '0.85rem'
                }}
              >
                {technologies.map(tech => (
                  <option key={tech} value={tech}>
                    {tech === 'all' ? 'All Technologies' : tech}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="projects-section">
        <div className="projects-grid">
          {filteredProjects.map((project, index) => (
            <div 
              key={project.id} 
              className="project-card"
              style={{
                background: theme.cardBg,
                border: `1px solid ${theme.border}`,
                boxShadow: theme.shadow
              }}
            >
              <div className="project-header">
                <span 
                  className="difficulty-badge"
                  style={{ 
                    background: getDifficultyColor(project.difficulty),
                    color: 'white'
                  }}
                >
                  {project.difficulty}
                </span>
                
                <span 
                  className="tech-badge"
                  style={{ 
                    background: getTechColor(project.technology),
                    color: project.technology === 'JavaScript' ? '#000' : 'white'
                  }}
                >
                  {project.technology}
                </span>
              </div>

              <div className="project-content">
                <h3 className="project-title" style={{ color: theme.textPrimary }}>
                  {project.title}
                </h3>
                <p className="project-description" style={{ color: theme.textMuted }}>
                  {project.description}
                </p>
              </div>

              <div className="project-actions">
                <a
                  href={project.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="watch-tutorial-btn"
                  style={{
                    background: getButtonGradient(index),
                    color: 'white'
                  }}
                >
                  <Youtube size={16} />
                  Watch Tutorial
                  <ExternalLink size={14} />
                </a>
                
                <button
                  onClick={handleSourceCodeClick}
                  className="source-code-btn"
                  style={{
                    background: 'transparent',
                    color: theme.textMuted,
                    border: `1px solid ${theme.border}`
                  }}
                >
                  <Code size={16} />
                  Source Code
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="no-results" style={{ color: '#94a3b8' }}>
            <Search size={48} />
            <h3>No projects found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Beautiful Popup */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>Source Code Coming Soon! 🚀</h3>
              <button 
                className="popup-close"
                onClick={() => setShowPopup(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="popup-body">
              <div className="popup-icon">
                <Code size={48} />
              </div>
              <p>We're working hard to bring you the complete source code for all projects.</p>
              <p>This feature will be available very soon!</p>
              <div className="popup-features">
                <div className="feature-item">
                  <span className="feature-icon">📁</span>
                  <span>Complete project files</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">💻</span>
                  <span>Ready-to-run code</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📚</span>
                  <span>Detailed documentation</span>
                </div>
              </div>
            </div>
            <div className="popup-footer">
              <button 
                className="popup-button"
                onClick={() => setShowPopup(false)}
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectIdeasPage