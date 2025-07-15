'use client'

import React, { useState } from 'react'
import { 
  Code2, Clock, CheckCircle, Circle, Star, 
  BookOpen, Play, ExternalLink, ArrowLeft,
  Target, Award, Users, TrendingUp, Brain,
  FileText, Video, Globe, Github
} from 'lucide-react'

import '../roadmap.css'
import './dsa.css'

const DSARoadmap = () => {
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [selectedPhase, setSelectedPhase] = useState(0)

  const roadmapPhases = [
    {
      id: 1,
      title: 'Foundation Phase',
      duration: '4-6 weeks',
      description: 'Build strong programming fundamentals',
      color: '#10b981',
      topics: [
        {
          name: 'Programming Basics',
          duration: '1 week',
          resources: [
            { type: 'article', title: 'Choose Your Language (C++/Java/Python)', url: '#' },
            { type: 'video', title: 'Setup Development Environment', url: '#' },
            { type: 'practice', title: 'Basic Syntax Practice', url: '#' }
          ]
        },
        {
          name: 'Time & Space Complexity',
          duration: '1 week',
          resources: [
            { type: 'article', title: 'Big O Notation Explained', url: '#' },
            { type: 'video', title: 'Complexity Analysis Examples', url: '#' },
            { type: 'practice', title: 'Calculate Time Complexity', url: '#' }
          ]
        },
        {
          name: 'Basic Math & Logic',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'Mathematical Foundations', url: '#' },
            { type: 'practice', title: 'Logic Building Problems', url: '#' },
            { type: 'video', title: 'Problem Solving Techniques', url: '#' }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Data Structures',
      duration: '8-10 weeks',
      description: 'Master essential data structures',
      color: '#3b82f6',
      topics: [
        {
          name: 'Arrays & Strings',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'Array Operations & Techniques', url: '#' },
            { type: 'practice', title: 'LeetCode Array Problems', url: '#' },
            { type: 'video', title: 'String Manipulation Masterclass', url: '#' }
          ]
        },
        {
          name: 'Linked Lists',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'Linked List Implementation', url: '#' },
            { type: 'practice', title: 'Linked List Problem Set', url: '#' },
            { type: 'video', title: 'Advanced Linked List Techniques', url: '#' }
          ]
        },
        {
          name: 'Stacks & Queues',
          duration: '1.5 weeks',
          resources: [
            { type: 'article', title: 'Stack & Queue Operations', url: '#' },
            { type: 'practice', title: 'Stack/Queue Problem Practice', url: '#' },
            { type: 'video', title: 'Real-world Applications', url: '#' }
          ]
        },
        {
          name: 'Trees & Binary Search Trees',
          duration: '2.5 weeks',
          resources: [
            { type: 'article', title: 'Tree Traversal Methods', url: '#' },
            { type: 'practice', title: 'Binary Tree Problems', url: '#' },
            { type: 'video', title: 'BST Operations Deep Dive', url: '#' }
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Algorithms',
      duration: '10-12 weeks',
      description: 'Learn fundamental algorithms',
      color: '#8b5cf6',
      topics: [
        {
          name: 'Searching & Sorting',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'Binary Search Mastery', url: '#' },
            { type: 'practice', title: 'Sorting Algorithm Implementation', url: '#' },
            { type: 'video', title: 'Advanced Search Techniques', url: '#' }
          ]
        },
        {
          name: 'Recursion & Backtracking',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'Recursion Patterns', url: '#' },
            { type: 'practice', title: 'Backtracking Problems', url: '#' },
            { type: 'video', title: 'Recursive Problem Solving', url: '#' }
          ]
        },
        {
          name: 'Dynamic Programming',
          duration: '4 weeks',
          resources: [
            { type: 'article', title: 'DP Patterns & Approaches', url: '#' },
            { type: 'practice', title: 'Classical DP Problems', url: '#' },
            { type: 'video', title: 'DP Optimization Techniques', url: '#' }
          ]
        },
        {
          name: 'Graph Algorithms',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'Graph Representation & Traversal', url: '#' },
            { type: 'practice', title: 'Graph Algorithm Problems', url: '#' },
            { type: 'video', title: 'Advanced Graph Algorithms', url: '#' }
          ]
        }
      ]
    },
    {
      id: 4,
      title: 'Advanced Topics',
      duration: '6-8 weeks',
      description: 'Master advanced concepts',
      color: '#f59e0b',
      topics: [
        {
          name: 'Advanced Data Structures',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'Heaps & Priority Queues', url: '#' },
            { type: 'practice', title: 'Trie & Segment Tree Problems', url: '#' },
            { type: 'video', title: 'Union-Find Data Structure', url: '#' }
          ]
        },
        {
          name: 'String Algorithms',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'KMP & Z Algorithm', url: '#' },
            { type: 'practice', title: 'String Matching Problems', url: '#' },
            { type: 'video', title: 'Advanced String Techniques', url: '#' }
          ]
        },
        {
          name: 'Mathematical Algorithms',
          duration: '1.5 weeks',
          resources: [
            { type: 'article', title: 'Number Theory & Combinatorics', url: '#' },
            { type: 'practice', title: 'Mathematical Problem Set', url: '#' },
            { type: 'video', title: 'Competitive Math Techniques', url: '#' }
          ]
        }
      ]
    },
    {
      id: 5,
      title: 'Interview Preparation',
      duration: '4-6 weeks',
      description: 'Get ready for technical interviews',
      color: '#ef4444',
      topics: [
        {
          name: 'System Design Basics',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'System Design Fundamentals', url: '#' },
            { type: 'practice', title: 'Design Popular Systems', url: '#' },
            { type: 'video', title: 'System Design Interviews', url: '#' }
          ]
        },
        {
          name: 'Mock Interviews',
          duration: '2 weeks',
          resources: [
            { type: 'practice', title: 'Company-specific Problems', url: '#' },
            { type: 'video', title: 'Interview Simulation', url: '#' },
            { type: 'article', title: 'Interview Tips & Strategies', url: '#' }
          ]
        },
        {
          name: 'Behavioral Questions',
          duration: '1 week',
          resources: [
            { type: 'article', title: 'STAR Method Guide', url: '#' },
            { type: 'practice', title: 'Common Behavioral Questions', url: '#' },
            { type: 'video', title: 'Interview Communication Skills', url: '#' }
          ]
        }
      ]
    }
  ]

  const practiceResources = [
    {
      platform: 'LeetCode',
      description: 'Most popular coding interview platform',
      difficulty: 'All Levels',
      problems: '2000+',
      url: 'https://leetcode.com',
      color: '#ffa500'
    },
    {
      platform: 'HackerRank',
      description: 'Structured learning with certificates',
      difficulty: 'Beginner-Advanced',
      problems: '1000+',
      url: 'https://hackerrank.com',
      color: '#10b981'
    },
    {
      platform: 'CodeChef',
      description: 'Competitive programming platform',
      difficulty: 'Intermediate-Expert',
      problems: '3000+',
      url: 'https://codechef.com',
      color: '#8b5cf6'
    },
    {
      platform: 'Codeforces',
      description: 'Competitive programming contests',
      difficulty: 'Advanced',
      problems: '5000+',
      url: 'https://codeforces.com',
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
    <div className="roadmap-container dsa-roadmap">
      <div className="breadcrumb">
        <button onClick={() => window.location.href = '/roadmap'} className="back-button">
          <ArrowLeft size={16} />
          Back to Roadmaps
        </button>
      </div>

      <div className="roadmap-hero">
        <div className="hero-content">
          <div className="hero-icon">
            <Code2 size={48} />
          </div>
          
          <h1 className="hero-title">
            Data Structures & <span className="gradient-text">Algorithms</span> Mastery
          </h1>
          
          <p className="hero-description">
            Complete roadmap to master DSA for competitive programming and technical interviews. 
            This comprehensive guide covers everything from basics to advanced concepts.
          </p>

          <div className="hero-stats">
            <div className="stat">
              <Clock size={20} />
              <div>
                <div className="stat-value">6-8 months</div>
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
            <div className="progress-circle">
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
          Strengthen your skills with these recommended coding platforms
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
                  <span className="stat-label">Problems:</span>
                  <span className="stat-value">{platform.problems}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="best-of-luck">
        <h2>Best of Luck on Your DSA Journey! 🚀</h2>
        <p>Master these concepts and ace your technical interviews</p>
      </div>

  
    </div>
  )
}

export default DSARoadmap