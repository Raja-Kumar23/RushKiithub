'use client'

import React, { useState } from 'react'
import { 
  Brain, Clock, CheckCircle, Circle, Star, 
  BookOpen, Play, ExternalLink, ArrowLeft,
  Target, Award, Users, TrendingUp,
  FileText, Video, Globe, Github, Code2
} from 'lucide-react'
import './datasceince.css'
import '../roadmap.css'

const DataScienceRoadmap = () => {
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [selectedPhase, setSelectedPhase] = useState(0)

  const roadmapPhases = [
    {
      id: 1,
      title: 'Mathematics & Statistics',
      duration: '8-10 weeks',
      description: 'Build strong mathematical foundation',
      color: '#10b981',
      topics: [
        {
          name: 'Linear Algebra',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'Vectors, Matrices & Operations', url: '#' },
            { type: 'video', title: 'Linear Algebra for ML', url: '#' },
            { type: 'practice', title: 'NumPy Linear Algebra', url: '#' }
          ]
        },
        {
          name: 'Statistics & Probability',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'Descriptive & Inferential Statistics', url: '#' },
            { type: 'practice', title: 'Statistical Analysis with Python', url: '#' },
            { type: 'video', title: 'Probability Distributions', url: '#' }
          ]
        },
        {
          name: 'Calculus Basics',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'Derivatives & Optimization', url: '#' },
            { type: 'practice', title: 'Calculus for Machine Learning', url: '#' },
            { type: 'video', title: 'Gradient Descent Mathematics', url: '#' }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Programming & Tools',
      duration: '10-12 weeks',
      description: 'Master data science programming',
      color: '#3b82f6',
      topics: [
        {
          name: 'Python for Data Science',
          duration: '4 weeks',
          resources: [
            { type: 'article', title: 'Python Fundamentals', url: '#' },
            { type: 'practice', title: 'NumPy, Pandas & Matplotlib', url: '#' },
            { type: 'video', title: 'Data Manipulation Techniques', url: '#' }
          ]
        },
        {
          name: 'SQL & Databases',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'SQL for Data Analysis', url: '#' },
            { type: 'practice', title: 'Database Queries & Joins', url: '#' },
            { type: 'video', title: 'Advanced SQL Techniques', url: '#' }
          ]
        },
        {
          name: 'Data Visualization',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'Matplotlib, Seaborn & Plotly', url: '#' },
            { type: 'practice', title: 'Interactive Dashboards', url: '#' },
            { type: 'video', title: 'Storytelling with Data', url: '#' }
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Machine Learning',
      duration: '12-14 weeks',
      description: 'Learn ML algorithms and techniques',
      color: '#8b5cf6',
      topics: [
        {
          name: 'Supervised Learning',
          duration: '5 weeks',
          resources: [
            { type: 'article', title: 'Regression & Classification', url: '#' },
            { type: 'practice', title: 'Scikit-learn Projects', url: '#' },
            { type: 'video', title: 'Model Evaluation & Selection', url: '#' }
          ]
        },
        {
          name: 'Unsupervised Learning',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'Clustering & Dimensionality Reduction', url: '#' },
            { type: 'practice', title: 'PCA & K-means Implementation', url: '#' },
            { type: 'video', title: 'Feature Engineering', url: '#' }
          ]
        },
        {
          name: 'Deep Learning',
          duration: '4 weeks',
          resources: [
            { type: 'article', title: 'Neural Networks & TensorFlow', url: '#' },
            { type: 'practice', title: 'CNN & RNN Projects', url: '#' },
            { type: 'video', title: 'Deep Learning Applications', url: '#' }
          ]
        }
      ]
    },
    {
      id: 4,
      title: 'Advanced Topics',
      duration: '8-10 weeks',
      description: 'Specialized data science skills',
      color: '#f59e0b',
      topics: [
        {
          name: 'Natural Language Processing',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'Text Processing & NLTK', url: '#' },
            { type: 'practice', title: 'Sentiment Analysis Project', url: '#' },
            { type: 'video', title: 'Transformers & BERT', url: '#' }
          ]
        },
        {
          name: 'Computer Vision',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'Image Processing & OpenCV', url: '#' },
            { type: 'practice', title: 'Image Classification', url: '#' },
            { type: 'video', title: 'Object Detection Techniques', url: '#' }
          ]
        },
        {
          name: 'Time Series Analysis',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'ARIMA & Forecasting Models', url: '#' },
            { type: 'practice', title: 'Stock Price Prediction', url: '#' },
            { type: 'video', title: 'Time Series Patterns', url: '#' }
          ]
        }
      ]
    },
    {
      id: 5,
      title: 'Production & Deployment',
      duration: '6-8 weeks',
      description: 'Deploy ML models in production',
      color: '#ef4444',
      topics: [
        {
          name: 'MLOps & Model Deployment',
          duration: '3 weeks',
          resources: [
            { type: 'article', title: 'Model Versioning & Monitoring', url: '#' },
            { type: 'practice', title: 'Flask API for ML Models', url: '#' },
            { type: 'video', title: 'Cloud ML Platforms', url: '#' }
          ]
        },
        {
          name: 'Big Data Tools',
          duration: '2 weeks',
          resources: [
            { type: 'article', title: 'Spark & Hadoop Ecosystem', url: '#' },
            { type: 'practice', title: 'Distributed Computing', url: '#' },
            { type: 'video', title: 'Big Data Processing', url: '#' }
          ]
        },
        {
          name: 'Portfolio & Communication',
          duration: '1 week',
          resources: [
            { type: 'article', title: 'Data Science Portfolio', url: '#' },
            { type: 'practice', title: 'Jupyter Notebook Best Practices', url: '#' },
            { type: 'video', title: 'Presenting Data Insights', url: '#' }
          ]
        }
      ]
    }
  ]

  const practiceResources = [
    {
      platform: 'Kaggle',
      description: 'Data science competitions and datasets',
      difficulty: 'All Levels',
      problems: '1000+',
      url: 'https://kaggle.com',
      color: '#20beff'
    },
    {
      platform: 'Google Colab',
      description: 'Free GPU/TPU for ML experiments',
      difficulty: 'Beginner-Advanced',
      problems: 'Unlimited',
      url: 'https://colab.research.google.com',
      color: '#f9ab00'
    },
    {
      platform: 'DataCamp',
      description: 'Interactive data science courses',
      difficulty: 'Beginner-Intermediate',
      problems: '300+',
      url: 'https://datacamp.com',
      color: '#03ef62'
    },
    {
      platform: 'Coursera ML',
      description: 'University-level ML courses',
      difficulty: 'Intermediate-Advanced',
      problems: '100+',
      url: 'https://coursera.org',
      color: '#0056d3'
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
    <div className="roadmap-container datascience-roadmap">
      <div className="breadcrumb">
        <button onClick={() => window.location.href = '/roadmap'} className="back-button">
          <ArrowLeft size={16} />
          Back to Roadmaps
        </button>
      </div>

      <div className="roadmap-hero">
        <div className="hero-content">
          <div className="hero-icon">
            <Brain size={48} />
          </div>
          
          <h1 className="hero-title">
            Data Science & <span className="gradient-text">Machine Learning</span> Mastery
          </h1>
          
          <p className="hero-description">
            Complete roadmap to become a professional data scientist. Master statistics, programming, 
            machine learning, and deploy AI models to solve real-world problems.
          </p>

          <div className="hero-stats">
            <div className="stat">
              <Clock size={20} />
              <div>
                <div className="stat-value">10-14 months</div>
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
          Enhance your data science skills with these specialized platforms
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
        <h2>Best of Luck on Your Data Science Journey! 🚀</h2>
        <p>Unlock insights from data and build intelligent systems</p>
      </div>

   
    </div>
  )
}

export default DataScienceRoadmap