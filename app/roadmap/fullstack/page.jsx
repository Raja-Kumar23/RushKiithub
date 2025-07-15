'use client'

import React, { useState } from 'react'
import { 
  Layers, Clock, CheckCircle, Circle, Star, 
  BookOpen, Play, ExternalLink, ArrowLeft,
  Target, Award, Users, TrendingUp, Brain,
  FileText, Video, Globe, Github, Code2
} from 'lucide-react'
import './fullstack.css'
import '../roadmap.css'

const FullStackRoadmap = () => {
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [selectedPhase, setSelectedPhase] = useState(0)

  const roadmapPhases = [
    {
      id: 1,
      title: 'Frontend Foundation',
      duration: '8-10 weeks',
      description: 'Master client-side development',
      color: '#f97316',
      topics: [
        {
          name: 'HTML, CSS & JavaScript',
          duration: '4 weeks',
          resources: [
            { type: 'article', title: 'Modern HTML5 & CSS3', url: '#' },
            { type: 'video', title: 'JavaScript ES6+ Features', url: '#' },
            { type: 'practice', title: 'Responsive Web Design', url: '#' }
          ]
        },
        {
          name: 'React Fundamentals',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'React Hooks & Components', url: '#' },
            { type: 'practice', title: 'Build React Applications', url: '#' },
            { type: 'video', title: 'State Management Patterns', url: '#' }
          ]
        },
        {
          name: 'Frontend Tools',
          duration: '1 week',
          resources: [
            { type: 'article', title: 'Webpack, Vite & Build Tools', url: '#' },
            { type: 'practice', title: 'Development Environment Setup', url: '#' },
            { type: 'video', title: 'Package Management', url: '#' }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Backend Development',
      duration: '10-12 weeks',
      description: 'Build server-side applications',
      color: '#10b981',
      topics: [
        {
          name: 'Node.js & Express',
          duration: '4 weeks',
          resources: [
            { type: 'article', title: 'Node.js Runtime & APIs', url: '#' },
            { type: 'practice', title: 'RESTful API Development', url: '#' },
            { type: 'video', title: 'Express.js Framework', url: '#' }
          ]
        },
        {
          name: 'Database Management',
          duration: '4 weeks',
          resources: [
            { type: 'article', title: 'MongoDB & PostgreSQL', url: '#' },
            { type: 'practice', title: 'Database Design & Queries', url: '#' },
            { type: 'video', title: 'ORM & Database Integration', url: '#' }
          ]
        },
        {
          name: 'Authentication & Security',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'JWT & Session Management', url: '#' },
            { type: 'practice', title: 'Secure API Development', url: '#' },
            { type: 'video', title: 'Security Best Practices', url: '#' }
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Full Stack Integration',
      duration: '8-10 weeks',
      description: 'Connect frontend and backend',
      color: '#3b82f6',
      topics: [
        {
          name: 'API Integration',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'Frontend-Backend Communication', url: '#' },
            { type: 'practice', title: 'CRUD Operations', url: '#' },
            { type: 'video', title: 'Error Handling & Validation', url: '#' }
          ]
        },
        {
          name: 'State Management',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'Redux & Context API', url: '#' },
            { type: 'practice', title: 'Global State Management', url: '#' },
            { type: 'video', title: 'Advanced React Patterns', url: '#' }
          ]
        },
        {
          name: 'Real-time Features',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'WebSockets & Socket.io', url: '#' },
            { type: 'practice', title: 'Live Chat Application', url: '#' },
            { type: 'video', title: 'Real-time Data Sync', url: '#' }
          ]
        }
      ]
    },
    {
      id: 4,
      title: 'Advanced Concepts',
      duration: '8-10 weeks',
      description: 'Professional development practices',
      color: '#8b5cf6',
      topics: [
        {
          name: 'Testing & Quality',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'Unit & Integration Testing', url: '#' },
            { type: 'practice', title: 'Test-Driven Development', url: '#' },
            { type: 'video', title: 'Testing Best Practices', url: '#' }
          ]
        },
        {
          name: 'Performance Optimization',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'Frontend & Backend Optimization', url: '#' },
            { type: 'practice', title: 'Caching Strategies', url: '#' },
            { type: 'video', title: 'Performance Monitoring', url: '#' }
          ]
        },
        {
          name: 'TypeScript',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'TypeScript for Full Stack', url: '#' },
            { type: 'practice', title: 'Type-safe Applications', url: '#' },
            { type: 'video', title: 'Advanced TypeScript', url: '#' }
          ]
        }
      ]
    },
    {
      id: 5,
      title: 'Deployment & DevOps',
      duration: '6-8 weeks',
      description: 'Deploy and maintain applications',
      color: '#ef4444',
      topics: [
        {
          name: 'Cloud Deployment',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'AWS, Heroku & Vercel', url: '#' },
            { type: 'practice', title: 'Production Deployment', url: '#' },
            { type: 'video', title: 'Cloud Services Overview', url: '#' }
          ]
        },
        {
          name: 'CI/CD & Automation',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'GitHub Actions & Pipelines', url: '#' },
            { type: 'practice', title: 'Automated Deployment', url: '#' },
            { type: 'video', title: 'DevOps Best Practices', url: '#' }
          ]
        },
        {
          name: 'Monitoring & Maintenance',
          duration: '1 week',
          resources: [
            { type: 'article', title: 'Application Monitoring', url: '#' },
            { type: 'practice', title: 'Error Tracking Setup', url: '#' },
            { type: 'video', title: 'Production Debugging', url: '#' }
          ]
        }
      ]
    }
  ]

  const practiceResources = [
    {
      platform: 'freeCodeCamp',
      description: 'Full stack development curriculum',
      difficulty: 'Beginner-Advanced',
      problems: '300+',
      url: 'https://freecodecamp.org',
      color: '#10b981'
    },
    {
      platform: 'The Odin Project',
      description: 'Complete full stack course',
      difficulty: 'Beginner-Intermediate',
      problems: '100+',
      url: 'https://theodinproject.com',
      color: '#f97316'
    },
    {
      platform: 'Fullstack Open',
      description: 'University-level full stack course',
      difficulty: 'Intermediate-Advanced',
      problems: '200+',
      url: 'https://fullstackopen.com',
      color: '#3b82f6'
    },
    {
      platform: 'LeetCode',
      description: 'System design and algorithms',
      difficulty: 'All Levels',
      problems: '2000+',
      url: 'https://leetcode.com',
      color: '#ffa500'
    }
  ]

  const getResourceIcon = (type) => {
    switch(type) {
      case 'article': return <FileText size={16} />
      case 'video': return <Video size={16} />
      case 'practice': return <Code2 size={16} />
      case 'website': return <Globe size={16} />
      default: return <BookOpen size={16} />
    }
  }

  const getCompletionPercentage = () => {
    const totalSteps = roadmapPhases.reduce((acc, phase) => acc + phase.topics.length, 0)
    return Math.round((completedSteps.size / totalSteps) * 100)
  }

  return (
    <div className="roadmap-container fullstack-roadmap">
      <div className="breadcrumb">
        <button onClick={() => window.location.href = '/roadmap'} className="back-button">
          <ArrowLeft size={16} />
          Back to Roadmaps
        </button>
      </div>

      <div className="roadmap-hero">
        <div className="hero-content">
          <div className="hero-icon">
            <Layers size={48} />
          </div>
          
          <h1 className="hero-title">
            Full Stack <span className="gradient-text">Development</span> Mastery
          </h1>
          
          <p className="hero-description">
            Complete roadmap to become a professional full stack developer. Master both frontend and backend 
            technologies to build complete web applications from scratch.
          </p>

          <div className="hero-stats">
            <div className="stat">
              <Clock size={20} />
              <div>
                <div className="stat-value">8-12 months</div>
                <div className="stat-label">Duration</div>
              </div>
            </div>
            <div className="stat">
              <Target size={20} />
              <div>
                <div className="stat-value">Advanced</div>
                <div className="stat-label">Difficulty</div>
              </div>
            </div>
            <div className="stat">
              <TrendingUp size={20} />
              <div>
                <div className="stat-value">{getCompletionPercentage()}%</div>
                <div className="stat-label">Your Progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="roadmap-content">
        <div className="sidebar">
          <div className="progress-card">
            <h3>Learning Progress</h3>
            <div className="progress-circle" style={{ '--progress': getCompletionPercentage() }}>
              <div className="progress-value">{getCompletionPercentage()}%</div>
            </div>
            <p>{completedSteps.size} topics completed</p>
          </div>

          <div className="phase-navigation">
            <h3>Roadmap Phases</h3>
            {roadmapPhases.map((phase, index) => (
              <button
                key={phase.id}
                className={`phase-nav-item ${selectedPhase === index ? 'active' : ''}`}
                onClick={() => setSelectedPhase(index)}
                style={{ '--phase-color': phase.color }}
              >
                <div className="phase-number">{index + 1}</div>
                <div className="phase-info">
                  <div className="phase-name">{phase.title}</div>
                  <div className="phase-duration">{phase.duration}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="main-content">
          <div className="phase-header">
            <div className="phase-title-section">
              <h2 className="phase-title" style={{ color: roadmapPhases[selectedPhase].color }}>
                Phase {selectedPhase + 1}: {roadmapPhases[selectedPhase].title}
              </h2>
              <p className="phase-description">{roadmapPhases[selectedPhase].description}</p>
              <div className="phase-meta">
                <span className="duration-badge">
                  <Clock size={14} />
                  {roadmapPhases[selectedPhase].duration}
                </span>
              </div>
            </div>
          </div>

          <div className="topics-list">
            {roadmapPhases[selectedPhase].topics.map((topic, index) => {
              return (
                <div key={index} className="topic-card">
                  <div className="topic-header">
                    <div className="topic-info">
                      <h3 className="topic-title">{topic.name}</h3>
                      <span className="topic-duration">{topic.duration}</span>
                    </div>
                  </div>

                  <div className="resources-grid">
                    {topic.resources.map((resource, resIndex) => (
                      <div key={resIndex} className="resource-item">
                        <div className="resource-icon">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div className="resource-content">
                          <div className="resource-title">{resource.title}</div>
                          <div className="resource-type">{resource.type}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="practice-section">
        <h2 className="section-title">Practice Platforms</h2>
        <p className="section-description">
          Master full stack development with these comprehensive platforms
        </p>
        
        <div className="practice-grid">
          {practiceResources.map((platform, index) => (
            <a
              key={index}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="practice-card"
              style={{ '--platform-color': platform.color }}
            >
              <div className="practice-header">
                <h3 className="platform-name">{platform.platform}</h3>
                <ExternalLink size={16} />
              </div>
              <p className="platform-description">{platform.description}</p>
              <div className="platform-stats">
                <div className="stat-item">
                  <span className="stat-label">Difficulty:</span>
                  <span className="stat-value">{platform.difficulty}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Projects:</span>
                  <span className="stat-value">{platform.problems}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="best-of-luck">
        <h2>Best of Luck on Your Full Stack Journey! 🚀</h2>
        <p>Build complete applications and become a versatile developer</p>
      </div>

      
    </div>
  )
}

export default FullStackRoadmap