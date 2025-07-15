'use client'

import React, { useState } from 'react'
import { 
  Server, Clock, CheckCircle, Circle, Star, 
  BookOpen, Play, ExternalLink, ArrowLeft,
  Target, Award, Users, TrendingUp, Brain,
  FileText, Video, Globe, Github, Code2
} from 'lucide-react'
import './backend.css'
import '../roadmap.css'

const BackendRoadmap = () => {
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [selectedPhase, setSelectedPhase] = useState(0)

  const roadmapPhases = [
    {
      id: 1,
      title: 'Foundation Phase',
      duration: '6-8 weeks',
      description: 'Master server-side programming fundamentals',
      color: '#10b981',
      topics: [
        {
          name: 'Programming Language Choice',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'Node.js vs Python vs Java Comparison', url: '#' },
            { type: 'video', title: 'Backend Language Selection Guide', url: '#' },
            { type: 'practice', title: 'Basic Server Setup', url: '#' }
          ]
        },
        {
          name: 'HTTP & Web Fundamentals',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'HTTP Protocol Deep Dive', url: '#' },
            { type: 'video', title: 'REST API Principles', url: '#' },
            { type: 'practice', title: 'Build Simple HTTP Server', url: '#' }
          ]
        },
        {
          name: 'Version Control & Git',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'Git Workflow for Backend', url: '#' },
            { type: 'practice', title: 'Collaborative Development', url: '#' },
            { type: 'video', title: 'Advanced Git Techniques', url: '#' }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'API Development',
      duration: '8-10 weeks',
      description: 'Build robust APIs and web services',
      color: '#3b82f6',
      topics: [
        {
          name: 'RESTful API Design',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'REST API Best Practices', url: '#' },
            { type: 'practice', title: 'Build CRUD Operations', url: '#' },
            { type: 'video', title: 'API Design Patterns', url: '#' }
          ]
        },
        {
          name: 'Database Integration',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'SQL vs NoSQL Databases', url: '#' },
            { type: 'practice', title: 'Database Design & Queries', url: '#' },
            { type: 'video', title: 'ORM and Database Optimization', url: '#' }
          ]
        },
        {
          name: 'Authentication & Authorization',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'JWT vs Session Authentication', url: '#' },
            { type: 'practice', title: 'Implement Auth System', url: '#' },
            { type: 'video', title: 'Security Best Practices', url: '#' }
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Advanced Backend',
      duration: '10-12 weeks',
      description: 'Scale and optimize backend systems',
      color: '#8b5cf6',
      topics: [
        {
          name: 'Microservices Architecture',
          duration: '4 weeks',
          resources: [
            { type: 'article', title: 'Monolith to Microservices', url: '#' },
            { type: 'practice', title: 'Service Communication', url: '#' },
            { type: 'video', title: 'Microservices Patterns', url: '#' }
          ]
        },
        {
          name: 'Caching & Performance',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'Redis & Caching Strategies', url: '#' },
            { type: 'practice', title: 'Performance Optimization', url: '#' },
            { type: 'video', title: 'Load Balancing Techniques', url: '#' }
          ]
        },
        {
          name: 'Message Queues & Events',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'RabbitMQ vs Apache Kafka', url: '#' },
            { type: 'practice', title: 'Event-Driven Architecture', url: '#' },
            { type: 'video', title: 'Async Processing Patterns', url: '#' }
          ]
        }
      ]
    },
    {
      id: 4,
      title: 'DevOps & Deployment',
      duration: '6-8 weeks',
      description: 'Deploy and maintain production systems',
      color: '#f59e0b',
      topics: [
        {
          name: 'Containerization',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'Docker for Backend Apps', url: '#' },
            { type: 'practice', title: 'Container Orchestration', url: '#' },
            { type: 'video', title: 'Kubernetes Fundamentals', url: '#' }
          ]
        },
        {
          name: 'CI/CD Pipelines',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'Automated Testing & Deployment', url: '#' },
            { type: 'practice', title: 'GitHub Actions Setup', url: '#' },
            { type: 'video', title: 'DevOps Best Practices', url: '#' }
          ]
        },
        {
          name: 'Monitoring & Logging',
          duration: '1.5 weeks',
          resources: [
            { type: 'article', title: 'Application Monitoring Tools', url: '#' },
            { type: 'practice', title: 'Error Tracking Setup', url: '#' },
            { type: 'video', title: 'Production Debugging', url: '#' }
          ]
        }
      ]
    },
    {
      id: 5,
      title: 'Professional Skills',
      duration: '4-6 weeks',
      description: 'Industry-ready backend development',
      color: '#ef4444',
      topics: [
        {
          name: 'System Design',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'Scalable System Architecture', url: '#' },
            { type: 'practice', title: 'Design Popular Systems', url: '#' },
            { type: 'video', title: 'System Design Interviews', url: '#' }
          ]
        },
        {
          name: 'Testing Strategies',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'Unit & Integration Testing', url: '#' },
            { type: 'practice', title: 'Test-Driven Development', url: '#' },
            { type: 'video', title: 'Testing Best Practices', url: '#' }
          ]
        },
        {
          name: 'Documentation & APIs',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'API Documentation with Swagger', url: '#' },
            { type: 'practice', title: 'Technical Writing', url: '#' },
            { type: 'video', title: 'Developer Experience', url: '#' }
          ]
        }
      ]
    }
  ]

  const practiceResources = [
    {
      platform: 'HackerRank',
      description: 'Backend development challenges',
      difficulty: 'Beginner-Advanced',
      problems: '500+',
      url: 'https://hackerrank.com',
      color: '#10b981'
    },
    {
      platform: 'LeetCode',
      description: 'System design and algorithms',
      difficulty: 'Intermediate-Advanced',
      problems: '300+',
      url: 'https://leetcode.com',
      color: '#ffa500'
    },
    {
      platform: 'Exercism',
      description: 'Language-specific backend exercises',
      difficulty: 'All Levels',
      problems: '200+',
      url: 'https://exercism.org',
      color: '#8b5cf6'
    },
    {
      platform: 'Codewars',
      description: 'Backend programming kata',
      difficulty: 'Beginner-Expert',
      problems: '1000+',
      url: 'https://codewars.com',
      color: '#ef4444'
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
    <div className="roadmap-container backend-roadmap">
      <div className="breadcrumb">
        <button onClick={() => window.location.href = '/roadmap'} className="back-button">
          <ArrowLeft size={16} />
          Back to Roadmaps
        </button>
      </div>

      <div className="roadmap-hero">
        <div className="hero-content">
          <div className="hero-icon">
            <Server size={48} />
          </div>
          
          <h1 className="hero-title">
            Backend <span className="gradient-text">Development</span> Mastery
          </h1>
          
          <p className="hero-description">
            Complete roadmap to become a professional backend developer. Master server-side programming, 
            databases, APIs, and scalable system architecture.
          </p>

          <div className="hero-stats">
            <div className="stat">
              <Clock size={20} />
              <div>
                <div className="stat-value">5-7 months</div>
                <div className="stat-label">Duration</div>
              </div>
            </div>
            <div className="stat">
              <Target size={20} />
              <div>
                <div className="stat-value">Intermediate</div>
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
          Strengthen your backend skills with these coding platforms
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
                  <span className="stat-label">Challenges:</span>
                  <span className="stat-value">{platform.problems}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="best-of-luck">
        <h2>Best of Luck on Your Backend Journey! 🚀</h2>
        <p>Build scalable systems and robust server-side applications</p>
      </div>

    </div>
  )
}

export default BackendRoadmap