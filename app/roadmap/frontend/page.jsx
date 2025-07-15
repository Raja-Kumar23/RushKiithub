'use client'

import React, { useState } from 'react'
import { 
  Palette, Clock, CheckCircle, Circle, Star, 
  BookOpen, Play, ExternalLink, ArrowLeft,
  Target, Award, Users, TrendingUp, Brain,
  FileText, Video, Globe, Github, Code2
} from 'lucide-react'

import '../roadmap.css'
import './frontend.css'

const FrontendRoadmap = () => {
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [selectedPhase, setSelectedPhase] = useState(0)

  const roadmapPhases = [
    {
      id: 1,
      title: 'Foundation Phase',
      duration: '6-8 weeks',
      description: 'Master the building blocks of web development',
      color: '#f97316',
      topics: [
        {
          name: 'HTML5 Fundamentals',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'HTML5 Semantic Elements Guide', url: '#' },
            { type: 'video', title: 'HTML5 Complete Course', url: '#' },
            { type: 'practice', title: 'Build Your First Webpage', url: '#' }
          ]
        },
        {
          name: 'CSS3 & Styling',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'CSS Grid & Flexbox Mastery', url: '#' },
            { type: 'video', title: 'CSS Animations & Transitions', url: '#' },
            { type: 'practice', title: 'Responsive Design Projects', url: '#' }
          ]
        },
        {
          name: 'JavaScript Basics',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'JavaScript ES6+ Features', url: '#' },
            { type: 'practice', title: 'DOM Manipulation Projects', url: '#' },
            { type: 'video', title: 'JavaScript Fundamentals', url: '#' }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Intermediate Skills',
      duration: '8-10 weeks',
      description: 'Advance your frontend development skills',
      color: '#3b82f6',
      topics: [
        {
          name: 'Advanced JavaScript',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'Async/Await & Promises', url: '#' },
            { type: 'practice', title: 'API Integration Projects', url: '#' },
            { type: 'video', title: 'JavaScript Design Patterns', url: '#' }
          ]
        },
        {
          name: 'CSS Frameworks',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'Tailwind CSS Complete Guide', url: '#' },
            { type: 'practice', title: 'Bootstrap vs Tailwind Projects', url: '#' },
            { type: 'video', title: 'Modern CSS Architecture', url: '#' }
          ]
        },
        {
          name: 'Version Control & Git',
          duration: '1 week',
          resources: [
            { type: 'article', title: 'Git Workflow Best Practices', url: '#' },
            { type: 'practice', title: 'GitHub Collaboration', url: '#' },
            { type: 'video', title: 'Git Commands Masterclass', url: '#' }
          ]
        },
        {
          name: 'Build Tools & Package Managers',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'Webpack vs Vite Comparison', url: '#' },
            { type: 'practice', title: 'Set up Development Environment', url: '#' },
            { type: 'video', title: 'NPM Package Management', url: '#' }
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'React Development',
      duration: '10-12 weeks',
      description: 'Master React and component-based development',
      color: '#06b6d4',
      topics: [
        {
          name: 'React Fundamentals',
          duration: '4 weeks',
          resources: [
            { type: 'article', title: 'React Hooks Deep Dive', url: '#' },
            { type: 'practice', title: 'React Component Library', url: '#' },
            { type: 'video', title: 'React Complete Tutorial', url: '#' }
          ]
        },
        {
          name: 'State Management',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'Redux vs Context API', url: '#' },
            { type: 'practice', title: 'State Management Projects', url: '#' },
            { type: 'video', title: 'Advanced React Patterns', url: '#' }
          ]
        },
        {
          name: 'React Router & Navigation',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'React Router v6 Guide', url: '#' },
            { type: 'practice', title: 'Multi-page Applications', url: '#' },
            { type: 'video', title: 'Client-side Routing', url: '#' }
          ]
        },
        {
          name: 'Testing React Applications',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'Jest & React Testing Library', url: '#' },
            { type: 'practice', title: 'Testing Best Practices', url: '#' },
            { type: 'video', title: 'End-to-End Testing', url: '#' }
          ]
        }
      ]
    },
    {
      id: 4,
      title: 'Advanced Topics',
      duration: '6-8 weeks',
      description: 'Professional development practices',
      color: '#8b5cf6',
      topics: [
        {
          name: 'TypeScript',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'TypeScript with React', url: '#' },
            { type: 'practice', title: 'Type-safe Applications', url: '#' },
            { type: 'video', title: 'Advanced TypeScript', url: '#' }
          ]
        },
        {
          name: 'Performance Optimization',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'React Performance Best Practices', url: '#' },
            { type: 'practice', title: 'Optimization Techniques', url: '#' },
            { type: 'video', title: 'Web Performance Metrics', url: '#' }
          ]
        },
        {
          name: 'Progressive Web Apps',
          duration: '1.5 weeks',
          resources: [
            { type: 'article', title: 'PWA Implementation Guide', url: '#' },
            { type: 'practice', title: 'Service Workers & Caching', url: '#' },
            { type: 'video', title: 'Offline-first Applications', url: '#' }
          ]
        }
      ]
    },
    {
      id: 5,
      title: 'Professional Skills',
      duration: '4-6 weeks',
      description: 'Industry-ready skills and portfolio',
      color: '#10b981',
      topics: [
        {
          name: 'Design Systems',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'Building Component Libraries', url: '#' },
            { type: 'practice', title: 'Storybook Implementation', url: '#' },
            { type: 'video', title: 'Design System Architecture', url: '#' }
          ]
        },
        {
          name: 'Deployment & DevOps',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'CI/CD for Frontend Apps', url: '#' },
            { type: 'practice', title: 'Deploy to Netlify/Vercel', url: '#' },
            { type: 'video', title: 'Docker for Frontend', url: '#' }
          ]
        },
        {
          name: 'Portfolio Development',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'Portfolio Best Practices', url: '#' },
            { type: 'practice', title: 'Showcase Projects', url: '#' },
            { type: 'video', title: 'Personal Branding', url: '#' }
          ]
        }
      ]
    }
  ]

  const practiceResources = [
    {
      platform: 'Frontend Mentor',
      description: 'Real-world frontend challenges with designs',
      difficulty: 'Beginner-Advanced',
      problems: '100+',
      url: 'https://frontendmentor.io',
      color: '#3b82f6'
    },
    {
      platform: 'CodePen',
      description: 'Social development environment for frontend',
      difficulty: 'All Levels',
      problems: 'Unlimited',
      url: 'https://codepen.io',
      color: '#10b981'
    },
    {
      platform: 'React Challenges',
      description: 'React-specific coding challenges',
      difficulty: 'Intermediate-Advanced',
      problems: '50+',
      url: 'https://react-challenges.vercel.app',
      color: '#06b6d4'
    },
    {
      platform: 'CSS Battle',
      description: 'CSS challenges and code golf',
      difficulty: 'Beginner-Expert',
      problems: '100+',
      url: 'https://cssbattle.dev',
      color: '#f97316'
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
    <div className="roadmap-container frontend-roadmap">
      <div className="breadcrumb">
        <button onClick={() => window.location.href = '/roadmap'} className="back-button">
          <ArrowLeft size={16} />
          Back to Roadmaps
        </button>
      </div>

      <div className="roadmap-hero">
        <div className="hero-content">
          <div className="hero-icon">
            <Palette size={48} />
          </div>
          
          <h1 className="hero-title">
            Frontend <span className="gradient-text">Development</span> Mastery
          </h1>
          
          <p className="hero-description">
            Complete roadmap to become a professional frontend developer. Master HTML, CSS, JavaScript, 
            React, and modern development tools to build stunning web applications.
          </p>

          <div className="hero-stats">
            <div className="stat">
              <Clock size={20} />
              <div>
                <div className="stat-value">4-6 months</div>
                <div className="stat-label">Duration</div>
              </div>
            </div>
            <div className="stat">
              <Target size={20} />
              <div>
                <div className="stat-value">Beginner</div>
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
          Enhance your frontend skills with these specialized platforms
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
        <h2>Best of Luck on Your Frontend Journey! 🚀</h2>
        <p>Build amazing user interfaces and create stunning web experiences</p>
      </div>

      
    </div>
  )
}

export default FrontendRoadmap