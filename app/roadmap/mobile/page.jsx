'use client'

import React, { useState } from 'react'
import { 
  Smartphone, Clock, CheckCircle, Circle, Star, 
  BookOpen, Play, ExternalLink, ArrowLeft,
  Target, Award, Users, TrendingUp, Brain,
  FileText, Video, Globe, Github, Code2
} from 'lucide-react'
import './mobile.css'
import '../roadmap.css'

const MobileRoadmap = () => {
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [selectedPhase, setSelectedPhase] = useState(0)

  const roadmapPhases = [
    {
      id: 1,
      title: 'Mobile Development Basics',
      duration: '6-8 weeks',
      description: 'Learn mobile app development fundamentals',
      color: '#10b981',
      topics: [
        {
          name: 'Mobile Platform Overview',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'iOS vs Android Development', url: '#' },
            { type: 'video', title: 'Mobile App Architecture', url: '#' },
            { type: 'practice', title: 'Development Environment Setup', url: '#' }
          ]
        },
        {
          name: 'Programming Fundamentals',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'JavaScript for Mobile Apps', url: '#' },
            { type: 'practice', title: 'Basic Programming Concepts', url: '#' },
            { type: 'video', title: 'Mobile Development Patterns', url: '#' }
          ]
        },
        {
          name: 'UI/UX for Mobile',
          duration: '1 week',
          resources: [
            { type: 'article', title: 'Mobile Design Principles', url: '#' },
            { type: 'practice', title: 'Responsive Mobile Layouts', url: '#' },
            { type: 'video', title: 'User Experience Best Practices', url: '#' }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'React Native Development',
      duration: '10-12 weeks',
      description: 'Master cross-platform mobile development',
      color: '#3b82f6',
      topics: [
        {
          name: 'React Native Fundamentals',
          duration: '4 weeks',
          resources: [
            { type: 'article', title: 'Components & Navigation', url: '#' },
            { type: 'practice', title: 'Build Your First App', url: '#' },
            { type: 'video', title: 'React Native Architecture', url: '#' }
          ]
        },
        {
          name: 'State Management',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'Redux & Context API', url: '#' },
            { type: 'practice', title: 'Global State Management', url: '#' },
            { type: 'video', title: 'Advanced React Patterns', url: '#' }
          ]
        },
        {
          name: 'Native Features',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'Camera, GPS & Sensors', url: '#' },
            { type: 'practice', title: 'Device API Integration', url: '#' },
            { type: 'video', title: 'Platform-specific Code', url: '#' }
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Native Development',
      duration: '12-14 weeks',
      description: 'Learn platform-specific development',
      color: '#8b5cf6',
      topics: [
        {
          name: 'iOS Development (Swift)',
          duration: '6 weeks',
          resources: [
            { type: 'article', title: 'Swift Programming Language', url: '#' },
            { type: 'practice', title: 'UIKit & SwiftUI', url: '#' },
            { type: 'video', title: 'iOS App Development', url: '#' }
          ]
        },
        {
          name: 'Android Development (Kotlin)',
          duration: '6 weeks',
          resources: [
            { type: 'article', title: 'Kotlin Programming', url: '#' },
            { type: 'practice', title: 'Android Studio & Jetpack', url: '#' },
            { type: 'video', title: 'Android App Architecture', url: '#' }
          ]
        },
        {
          name: 'Platform Integration',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'Native Modules & Bridges', url: '#' },
            { type: 'practice', title: 'Cross-platform Communication', url: '#' },
            { type: 'video', title: 'Performance Optimization', url: '#' }
          ]
        }
      ]
    },
    {
      id: 4,
      title: 'Advanced Mobile Features',
      duration: '8-10 weeks',
      description: 'Implement advanced mobile functionality',
      color: '#f59e0b',
      topics: [
        {
          name: 'Backend Integration',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'REST APIs & GraphQL', url: '#' },
            { type: 'practice', title: 'Data Synchronization', url: '#' },
            { type: 'video', title: 'Offline-first Architecture', url: '#' }
          ]
        },
        {
          name: 'Push Notifications',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'Firebase Cloud Messaging', url: '#' },
            { type: 'practice', title: 'Notification Handling', url: '#' },
            { type: 'video', title: 'Real-time Updates', url: '#' }
          ]
        },
        {
          name: 'App Performance',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'Memory Management', url: '#' },
            { type: 'practice', title: 'Performance Profiling', url: '#' },
            { type: 'video', title: 'Optimization Techniques', url: '#' }
          ]
        }
      ]
    },
    {
      id: 5,
      title: 'Deployment & Distribution',
      duration: '4-6 weeks',
      description: 'Publish apps to app stores',
      color: '#ef4444',
      topics: [
        {
          name: 'App Store Deployment',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'iOS App Store Guidelines', url: '#' },
            { type: 'practice', title: 'App Store Connect', url: '#' },
            { type: 'video', title: 'App Review Process', url: '#' }
          ]
        },
        {
          name: 'Google Play Store',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'Android Publishing Process', url: '#' },
            { type: 'practice', title: 'Play Console Management', url: '#' },
            { type: 'video', title: 'App Optimization', url: '#' }
          ]
        },
        {
          name: 'App Analytics & Monitoring',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'Firebase Analytics', url: '#' },
            { type: 'practice', title: 'Crash Reporting', url: '#' },
            { type: 'video', title: 'User Behavior Tracking', url: '#' }
          ]
        }
      ]
    }
  ]

  const practiceResources = [
    {
      platform: 'React Native',
      description: 'Official React Native documentation',
      difficulty: 'Beginner-Advanced',
      problems: '100+',
      url: 'https://reactnative.dev',
      color: '#61dafb'
    },
    {
      platform: 'Flutter',
      description: 'Google\'s UI toolkit for mobile',
      difficulty: 'Beginner-Advanced',
      problems: '200+',
      url: 'https://flutter.dev',
      color: '#02569b'
    },
    {
      platform: 'iOS Developer',
      description: 'Apple\'s official iOS development',
      difficulty: 'Intermediate-Advanced',
      problems: '150+',
      url: 'https://developer.apple.com',
      color: '#007aff'
    },
    {
      platform: 'Android Developers',
      description: 'Google\'s Android development platform',
      difficulty: 'Beginner-Advanced',
      problems: '300+',
      url: 'https://developer.android.com',
      color: '#3ddc84'
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
    <div className="roadmap-container mobile-roadmap">
      <div className="breadcrumb">
        <button onClick={() => window.location.href = '/roadmap'} className="back-button">
          <ArrowLeft size={16} />
          Back to Roadmaps
        </button>
      </div>

      <div className="roadmap-hero">
        <div className="hero-content">
          <div className="hero-icon">
            <Smartphone size={48} />
          </div>
          
          <h1 className="hero-title">
            Mobile <span className="gradient-text">Development</span> Mastery
          </h1>
          
          <p className="hero-description">
            Complete roadmap to become a professional mobile developer. Master React Native, iOS, Android, 
            and cross-platform development to build amazing mobile applications.
          </p>

          <div className="hero-stats">
            <div className="stat">
              <Clock size={20} />
              <div>
                <div className="stat-value">6-9 months</div>
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
        <h2 className="section-title">Development Platforms</h2>
        <p className="section-description">
          Master mobile development with these official platforms and tools
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
                  <span className="stat-label">Resources:</span>
                  <span className="stat-value">{platform.problems}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="best-of-luck">
        <h2>Best of Luck on Your Mobile Development Journey! 🚀</h2>
        <p>Build amazing mobile apps that users love</p>
      </div>

   
    </div>
  )
}

export default MobileRoadmap