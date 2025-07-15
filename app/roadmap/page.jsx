'use client'

import React, { useState } from 'react'
import { 
  Code2, Database, Palette, Server, Layers, 
  Brain, Shield, Smartphone, ArrowRight, 
  Clock, Users, TrendingUp, Star, ChevronRight,
  BookOpen, Target, Award, ExternalLink, Search
} from 'lucide-react'

import './roadmap.css'

const RoadmapPage = () => {
  const [hoveredCard, setHoveredCard] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const careerPaths = [
    {
      id: 'dsa',
      title: 'DSA Expert',
      description: 'Master Data Structures & Algorithms for competitive programming and interviews',
      icon: Code2,
      gradient: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
      difficulty: 'Intermediate',
      duration: '6-8 months',
      popularity: 95,
      trending: true,
      skills: ['Arrays', 'Trees', 'Graphs', 'Dynamic Programming', 'Sorting', 'Searching']
    },
    {
      id: 'frontend',
      title: 'Frontend Developer',
      description: 'Build stunning user interfaces and web experiences',
      icon: Palette,
      gradient: 'linear-gradient(135deg, #00ff88 0%, #00b366 100%)',
      difficulty: 'Beginner',
      duration: '4-6 months',
      popularity: 92,
      trending: true,
      skills: ['HTML/CSS', 'JavaScript', 'React', 'TypeScript', 'Tailwind CSS', 'Git']
    },
    {
      id: 'backend',
      title: 'Backend Developer',
      description: 'Design and build scalable server-side applications',
      icon: Server,
      gradient: 'linear-gradient(135deg, #00ff88 0%, #009955 100%)',
      difficulty: 'Intermediate',
      duration: '5-7 months',
      popularity: 88,
      trending: true,
      skills: ['Node.js', 'Python', 'APIs', 'Databases', 'Cloud', 'DevOps']
    },
    {
      id: 'fullstack',
      title: 'Full Stack Developer',
      description: 'Master both frontend and backend development',
      icon: Layers,
      gradient: 'linear-gradient(135deg, #00ff88 0%, #00aa5a 100%)',
      difficulty: 'Advanced',
      duration: '8-12 months',
      popularity: 90,
      trending: true,
      skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'Docker', 'Testing']
    },
    {
      id: 'datascience',
      title: 'Data Scientist',
      description: 'Extract insights from data using ML and statistical analysis',
      icon: Brain,
      gradient: 'linear-gradient(135deg, #00ff88 0%, #008844 100%)',
      difficulty: 'Advanced',
      duration: '10-14 months',
      popularity: 85,
      trending: true,
      skills: ['Python', 'Machine Learning', 'Statistics', 'SQL', 'Pandas', 'TensorFlow']
    },
    {
      id: 'mobile',
      title: 'Mobile Developer',
      description: 'Create native and cross-platform mobile applications',
      icon: Smartphone,
      gradient: 'linear-gradient(135deg, #00ff88 0%, #007733 100%)',
      difficulty: 'Intermediate',
      duration: '6-9 months',
      popularity: 82,
      skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'App Store']
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity Expert',
      description: 'Protect digital assets and secure systems from threats',
      icon: Shield,
      gradient: 'linear-gradient(135deg, #00ff88 0%, #006622 100%)',
      difficulty: 'Advanced',
      duration: '12-18 months',
      popularity: 78,
      skills: ['Network Security', 'Penetration Testing', 'Cryptography', 'Risk Assessment']
    },
    {
      id: 'devops',
      title: 'DevOps Engineer',
      description: 'Bridge development and operations for seamless deployment',
      icon: Database,
      gradient: 'linear-gradient(135deg, #00ff88 0%, #005511 100%)',
      difficulty: 'Advanced',
      duration: '8-12 months',
      popularity: 80,
      skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform', 'Monitoring']
    }
  ]

  const handlePathClick = (pathId) => {
    window.open(`/roadmap/${pathId}`, '_blank')
  }

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Beginner': return '#00ff88'
      case 'Intermediate': return '#ffaa00'
      case 'Advanced': return '#ff4444'
      default: return '#6b7280'
    }
  }

  const filteredPaths = careerPaths.filter(path =>
    path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    path.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    path.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="roadmap-container">
      <div className="roadmap-header">
        <div className="header-content">
          <div className="trending-badge">
            <TrendingUp size={16} />
            <span>Trending Career Paths 2025</span>
          </div>
          
          <h1 className="roadmap-title">
            Choose Your <span className="gradient-text">Tech Career</span> Path
          </h1>
          
          <p className="roadmap-subtitle">
            Discover comprehensive learning roadmaps for the most in-demand tech careers. 
            Each path includes structured learning approaches, resources, and real-world projects.
          </p>

          <div className="search-container">
            <div className="search-box">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search career paths, skills, or technologies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="paths-grid">
        {filteredPaths.map((path, index) => {
          const Icon = path.icon
          const isHovered = hoveredCard === path.id
          
          return (
            <div
              key={path.id}
              className={`path-card ${isHovered ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredCard(path.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handlePathClick(path.id)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {path.trending && (
                <div className="trending-indicator">
                  <Star size={12} />
                  <span>Trending</span>
                </div>
              )}

              <div className="card-header">
                <div 
                  className="path-icon"
                  style={{ background: path.gradient }}
                >
                  <Icon size={24} color="white" />
                </div>
                
                <div className="path-info">
                  <h3 className="path-title">{path.title}</h3>
                  <p className="path-description">{path.description}</p>
                </div>

                <div className="external-link-icon">
                  <ExternalLink size={16} />
                </div>
              </div>

              <div className="path-metrics">
                <div className="metric">
                  <Clock size={14} />
                  <span>{path.duration}</span>
                </div>
                <div className="metric">
                  <Target size={14} />
                  <span 
                    className="difficulty-badge"
                    style={{ backgroundColor: getDifficultyColor(path.difficulty) }}
                  >
                    {path.difficulty}
                  </span>
                </div>
              </div>

              <div className="skills-preview">
                <div className="skills-label">Key Skills:</div>
                <div className="skills-list">
                  {path.skills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="skill-tag">{skill}</span>
                  ))}
                  {path.skills.length > 3 && (
                    <span className="skill-tag more">+{path.skills.length - 3} more</span>
                  )}
                </div>
              </div>

              <div className="card-overlay" style={{ background: path.gradient }}></div>
              
              <div className="hover-effect">
                <div className="action-button">
                  <BookOpen size={16} />
                  <span>Start Learning</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredPaths.length === 0 && (
        <div className="no-results">
          <div className="no-results-content">
            <Search size={48} />
            <h3>No career paths found</h3>
            <p>Try searching with different keywords or browse all available paths.</p>
          </div>
        </div>
      )}

      <div className="best-of-luck">
        <h2>Best of Luck on Your Learning Journey! 🚀</h2>
        <p>Choose your path and start building your future in tech</p>
      </div>

 
    </div>
  )
}

export default RoadmapPage