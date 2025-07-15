'use client'

import React, { useState } from 'react'
import { 
  Database, Clock, CheckCircle, Circle, Star, 
  BookOpen, Play, ExternalLink, ArrowLeft,
  Target, Award, Users, TrendingUp, Brain,
  FileText, Video, Globe, Github, Code2
} from 'lucide-react'
import './devops.css'
import '../roadmap.css'

const DevOpsRoadmap = () => {
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [selectedPhase, setSelectedPhase] = useState(0)

  const roadmapPhases = [
    {
      id: 1,
      title: 'DevOps Fundamentals',
      duration: '6-8 weeks',
      description: 'Learn DevOps culture and basic concepts',
      color: '#10b981',
      topics: [
        {
          name: 'DevOps Culture & Principles',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'DevOps Philosophy & Benefits', url: '#' },
            { type: 'video', title: 'DevOps vs Traditional IT', url: '#' },
            { type: 'practice', title: 'DevOps Assessment', url: '#' }
          ]
        },
        {
          name: 'Linux System Administration',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'Linux Commands & Shell Scripting', url: '#' },
            { type: 'practice', title: 'Server Management Tasks', url: '#' },
            { type: 'video', title: 'Linux for DevOps Engineers', url: '#' }
          ]
        },
        {
          name: 'Networking & Security Basics',
          duration: '1 week',
          resources: [
            { type: 'article', title: 'TCP/IP, DNS & Load Balancing', url: '#' },
            { type: 'practice', title: 'Network Configuration', url: '#' },
            { type: 'video', title: 'Security Best Practices', url: '#' }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Version Control & CI/CD',
      duration: '8-10 weeks',
      description: 'Master continuous integration and deployment',
      color: '#3b82f6',
      topics: [
        {
          name: 'Git & Version Control',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'Advanced Git Workflows', url: '#' },
            { type: 'practice', title: 'Branching Strategies', url: '#' },
            { type: 'video', title: 'Git for DevOps Teams', url: '#' }
          ]
        },
        {
          name: 'CI/CD Pipelines',
          duration: '4 weeks',
          resources: [
            { type: 'article', title: 'Jenkins, GitHub Actions, GitLab CI', url: '#' },
            { type: 'practice', title: 'Build Automated Pipelines', url: '#' },
            { type: 'video', title: 'Pipeline Best Practices', url: '#' }
          ]
        },
        {
          name: 'Testing & Quality Gates',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'Automated Testing in CI/CD', url: '#' },
            { type: 'practice', title: 'Quality Gate Implementation', url: '#' },
            { type: 'video', title: 'Testing Strategies', url: '#' }
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Containerization & Orchestration',
      duration: '10-12 weeks',
      description: 'Master Docker and Kubernetes',
      color: '#8b5cf6',
      topics: [
        {
          name: 'Docker Fundamentals',
          duration: '4 weeks',
          resources: [
            { type: 'article', title: 'Containerization Concepts', url: '#' },
            { type: 'practice', title: 'Docker Images & Containers', url: '#' },
            { type: 'video', title: 'Docker Best Practices', url: '#' }
          ]
        },
        {
          name: 'Kubernetes Orchestration',
          duration: '5 weeks',
          resources: [
            { type: 'article', title: 'K8s Architecture & Components', url: '#' },
            { type: 'practice', title: 'Deploy Applications on K8s', url: '#' },
            { type: 'video', title: 'Kubernetes Administration', url: '#' }
          ]
        },
        {
          name: 'Service Mesh & Networking',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'Istio & Service Communication', url: '#' },
            { type: 'practice', title: 'Microservices Networking', url: '#' },
            { type: 'video', title: 'Advanced K8s Networking', url: '#' }
          ]
        }
      ]
    },
    {
      id: 4,
      title: 'Infrastructure as Code',
      duration: '8-10 weeks',
      description: 'Automate infrastructure provisioning',
      color: '#f59e0b',
      topics: [
        {
          name: 'Terraform',
          duration: '4 weeks',
          resources: [
            { type: 'article', title: 'Infrastructure Provisioning', url: '#' },
            { type: 'practice', title: 'Multi-cloud Deployments', url: '#' },
            { type: 'video', title: 'Terraform Best Practices', url: '#' }
          ]
        },
        {
          name: 'Configuration Management',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'Ansible, Chef, Puppet', url: '#' },
            { type: 'practice', title: 'Server Configuration', url: '#' },
            { type: 'video', title: 'Configuration Automation', url: '#' }
          ]
        },
        {
          name: 'Cloud Platforms',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'AWS, Azure, GCP Services', url: '#' },
            { type: 'practice', title: 'Cloud Infrastructure Setup', url: '#' },
            { type: 'video', title: 'Cloud Architecture Patterns', url: '#' }
          ]
        }
      ]
    },
    {
      id: 5,
      title: 'Monitoring & Operations',
      duration: '6-8 weeks',
      description: 'Implement monitoring and observability',
      color: '#ef4444',
      topics: [
        {
          name: 'Monitoring & Alerting',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'Prometheus, Grafana, ELK Stack', url: '#' },
            { type: 'practice', title: 'Monitoring Setup', url: '#' },
            { type: 'video', title: 'Observability Best Practices', url: '#' }
          ]
        },
        {
          name: 'Log Management',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'Centralized Logging', url: '#' },
            { type: 'practice', title: 'Log Analysis & Correlation', url: '#' },
            { type: 'video', title: 'Logging Strategies', url: '#' }
          ]
        },
        {
          name: 'Incident Response',
          duration: '1 week',
          resources: [
            { type: 'article', title: 'On-call & Incident Management', url: '#' },
            { type: 'practice', title: 'Runbook Creation', url: '#' },
            { type: 'video', title: 'Post-mortem Analysis', url: '#' }
          ]
        }
      ]
    }
  ]

  const practiceResources = [
    {
      platform: 'Katacoda',
      description: 'Interactive DevOps learning scenarios',
      difficulty: 'Beginner-Advanced',
      problems: '200+',
      url: 'https://katacoda.com',
      color: '#326ce5'
    },
    {
      platform: 'Play with Docker',
      description: 'Docker playground environment',
      difficulty: 'Beginner-Intermediate',
      problems: '50+',
      url: 'https://labs.play-with-docker.com',
      color: '#2496ed'
    },
    {
      platform: 'Kubernetes Playground',
      description: 'K8s hands-on learning',
      difficulty: 'Intermediate-Advanced',
      problems: '100+',
      url: 'https://kubernetes.io/docs/tutorials',
      color: '#326ce5'
    },
    {
      platform: 'AWS Free Tier',
      description: 'Cloud services practice',
      difficulty: 'All Levels',
      problems: 'Unlimited',
      url: 'https://aws.amazon.com/free',
      color: '#ff9900'
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
    <div className="roadmap-container devops-roadmap">
      <div className="breadcrumb">
        <button onClick={() => window.location.href = '/roadmap'} className="back-button">
          <ArrowLeft size={16} />
          Back to Roadmaps
        </button>
      </div>

      <div className="roadmap-hero">
        <div className="hero-content">
          <div className="hero-icon">
            <Database size={48} />
          </div>
          
          <h1 className="hero-title">
            DevOps <span className="gradient-text">Engineer</span> Mastery
          </h1>
          
          <p className="hero-description">
            Complete roadmap to become a DevOps professional. Master CI/CD, containerization, 
            infrastructure as code, and cloud technologies for seamless software delivery.
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
          Master DevOps skills with these hands-on learning platforms
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
                  <span className="stat-label">Labs:</span>
                  <span className="stat-value">{platform.problems}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="best-of-luck">
        <h2>Best of Luck on Your DevOps Journey! 🚀</h2>
        <p>Bridge development and operations for seamless software delivery</p>
      </div>


    </div>
  )
}

export default DevOpsRoadmap