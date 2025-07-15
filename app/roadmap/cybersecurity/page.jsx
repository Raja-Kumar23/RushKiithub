'use client'

import React, { useState } from 'react'
import { 
  Shield, Clock, CheckCircle, Circle, Star, 
  BookOpen, Play, ExternalLink, ArrowLeft,
  Target, Award, Users, TrendingUp, Brain,
  FileText, Video, Globe, Github, Code2
} from 'lucide-react'
import './cybersecurity.css'
import '../roadmap.css'

const CybersecurityRoadmap = () => {
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [selectedPhase, setSelectedPhase] = useState(0)

  const roadmapPhases = [
    {
      id: 1,
      title: 'Security Fundamentals',
      duration: '8-10 weeks',
      description: 'Build strong cybersecurity foundation',
      color: '#10b981',
      topics: [
        {
          name: 'Information Security Basics',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'CIA Triad & Security Principles', url: '#' },
            { type: 'video', title: 'Cybersecurity Overview', url: '#' },
            { type: 'practice', title: 'Security Risk Assessment', url: '#' }
          ]
        },
        {
          name: 'Networking Fundamentals',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'TCP/IP & Network Protocols', url: '#' },
            { type: 'practice', title: 'Network Analysis with Wireshark', url: '#' },
            { type: 'video', title: 'Network Security Concepts', url: '#' }
          ]
        },
        {
          name: 'Operating Systems Security',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'Windows & Linux Security', url: '#' },
            { type: 'practice', title: 'System Hardening Techniques', url: '#' },
            { type: 'video', title: 'OS Security Best Practices', url: '#' }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Ethical Hacking',
      duration: '12-14 weeks',
      description: 'Learn penetration testing and ethical hacking',
      color: '#3b82f6',
      topics: [
        {
          name: 'Penetration Testing Methodology',
          duration: '4 weeks',
          resources: [
            { type: 'article', title: 'OWASP Testing Guide', url: '#' },
            { type: 'practice', title: 'Vulnerability Assessment', url: '#' },
            { type: 'video', title: 'Penetration Testing Process', url: '#' }
          ]
        },
        {
          name: 'Web Application Security',
          duration: '4 weeks',
          resources: [
            { type: 'article', title: 'OWASP Top 10 Vulnerabilities', url: '#' },
            { type: 'practice', title: 'Web App Penetration Testing', url: '#' },
            { type: 'video', title: 'SQL Injection & XSS Attacks', url: '#' }
          ]
        },
        {
          name: 'Network Penetration Testing',
          duration: '4 weeks',
          resources: [
            { type: 'article', title: 'Network Scanning & Enumeration', url: '#' },
            { type: 'practice', title: 'Metasploit Framework', url: '#' },
            { type: 'video', title: 'Advanced Network Attacks', url: '#' }
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Security Tools & Technologies',
      duration: '10-12 weeks',
      description: 'Master cybersecurity tools and technologies',
      color: '#8b5cf6',
      topics: [
        {
          name: 'Security Information & Event Management',
          duration: '4 weeks',
          resources: [
            { type: 'article', title: 'SIEM Implementation', url: '#' },
            { type: 'practice', title: 'Log Analysis & Correlation', url: '#' },
            { type: 'video', title: 'Splunk & ELK Stack', url: '#' }
          ]
        },
        {
          name: 'Incident Response',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'Incident Response Framework', url: '#' },
            { type: 'practice', title: 'Digital Forensics', url: '#' },
            { type: 'video', title: 'Malware Analysis', url: '#' }
          ]
        },
        {
          name: 'Cryptography & PKI',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'Encryption Algorithms', url: '#' },
            { type: 'practice', title: 'Certificate Management', url: '#' },
            { type: 'video', title: 'Cryptographic Protocols', url: '#' }
          ]
        }
      ]
    },
    {
      id: 4,
      title: 'Advanced Security',
      duration: '8-10 weeks',
      description: 'Specialized cybersecurity domains',
      color: '#f59e0b',
      topics: [
        {
          name: 'Cloud Security',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'AWS/Azure Security', url: '#' },
            { type: 'practice', title: 'Cloud Security Assessment', url: '#' },
            { type: 'video', title: 'Container Security', url: '#' }
          ]
        },
        {
          name: 'Mobile Security',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'iOS & Android Security', url: '#' },
            { type: 'practice', title: 'Mobile App Security Testing', url: '#' },
            { type: 'video', title: 'Mobile Device Management', url: '#' }
          ]
        },
        {
          name: 'IoT Security',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'IoT Security Challenges', url: '#' },
            { type: 'practice', title: 'IoT Device Assessment', url: '#' },
            { type: 'video', title: 'Industrial Control Systems', url: '#' }
          ]
        }
      ]
    },
    {
      id: 5,
      title: 'Professional Development',
      duration: '6-8 weeks',
      description: 'Industry certifications and career skills',
      color: '#ef4444',
      topics: [
        {
          name: 'Security Certifications',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'CISSP, CEH, OSCP Prep', url: '#' },
            { type: 'practice', title: 'Certification Practice Tests', url: '#' },
            { type: 'video', title: 'Certification Study Guide', url: '#' }
          ]
        },
        {
          name: 'Compliance & Governance',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'GDPR, HIPAA, SOX Compliance', url: '#' },
            { type: 'practice', title: 'Risk Management Framework', url: '#' },
            { type: 'video', title: 'Security Policy Development', url: '#' }
          ]
        },
        {
          name: 'Security Leadership',
          duration: '1 week',
          resources: [
            { type: 'article', title: 'Security Program Management', url: '#' },
            { type: 'practice', title: 'Security Awareness Training', url: '#' },
            { type: 'video', title: 'Executive Communication', url: '#' }
          ]
        }
      ]
    }
  ]

  const practiceResources = [
    {
      platform: 'TryHackMe',
      description: 'Hands-on cybersecurity training',
      difficulty: 'Beginner-Advanced',
      problems: '500+',
      url: 'https://tryhackme.com',
      color: '#c41e3a'
    },
    {
      platform: 'Hack The Box',
      description: 'Penetration testing labs',
      difficulty: 'Intermediate-Expert',
      problems: '300+',
      url: 'https://hackthebox.com',
      color: '#9fef00'
    },
    {
      platform: 'OverTheWire',
      description: 'Security wargames and challenges',
      difficulty: 'Beginner-Advanced',
      problems: '200+',
      url: 'https://overthewire.org',
      color: '#ff6b35'
    },
    {
      platform: 'VulnHub',
      description: 'Vulnerable VMs for practice',
      difficulty: 'All Levels',
      problems: '400+',
      url: 'https://vulnhub.com',
      color: '#2e86ab'
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
    <div className="roadmap-container cybersecurity-roadmap">
      <div className="breadcrumb">
        <button onClick={() => window.location.href = '/roadmap'} className="back-button">
          <ArrowLeft size={16} />
          Back to Roadmaps
        </button>
      </div>

      <div className="roadmap-hero">
        <div className="hero-content">
          <div className="hero-icon">
            <Shield size={48} />
          </div>
          
          <h1 className="hero-title">
            Cybersecurity <span className="gradient-text">Expert</span> Mastery
          </h1>
          
          <p className="hero-description">
            Complete roadmap to become a cybersecurity professional. Master ethical hacking, 
            penetration testing, incident response, and security architecture.
          </p>

          <div className="hero-stats">
            <div className="stat">
              <Clock size={20} />
              <div>
                <div className="stat-value">12-18 months</div>
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
          Enhance your cybersecurity skills with these hands-on platforms
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
        <h2>Best of Luck on Your Cybersecurity Journey! 🚀</h2>
        <p>Protect digital assets and secure the cyber world</p>
      </div>

    </div>
  )
}

export default CybersecurityRoadmap