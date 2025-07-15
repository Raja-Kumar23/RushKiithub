'use client'

import React from 'react'
import { ArrowLeft, Users, RefreshCw, CheckCircle, Calendar, Clock, UserCheck } from 'lucide-react'
import { FiUsers, FiFilter, FiMessageCircle, FiBell } from "react-icons/fi";

import './styles.css'

const SectionSwappingWorkflowPage = () => {
  const steps = [
  {
    id: 1,
    icon: <Users className="step-icon" />,
    title: "Select Your Section",
    description: "Choose your preferred section during the course registration window.",
    details:
      "Search by course code, faculty name, time slots, or available capacity. If your desired section is available, proceed to enroll directly through the university portal."
  },
  {
    id: 2,
    icon: <UserCheck className="step-icon" />,
    title: "Didn't Get Your Desired Section?",
    description: "Don't worry! KIITHub offers a section swap platform to help you out.",
    details:
      "If your preferred section is unavailable, use our swapping feature to connect with other students looking for a mutual swap."
  },
  {
    id: 3,
    icon: <RefreshCw className="step-icon" />,
    title: "Request a Section Swap",
    description: "Fill out a simple form to request a swap.",
    details:
      "Your name is auto-fetched. Enter your phone number, current section, desired section, and an optional message. Your listing becomes visible to others instantly."
  },
  {
    id: 4,
    icon: <Users className="step-icon" />,
    title: "Browse Other Swap Requests",
    description: "Explore requests from other students on the platform.",
    details:
      "Find a matching student who wants to switch to your current section. Connect directly via WhatsApp and discuss the swap possibilities."
  },
  {
    id: 5,
    icon: <CheckCircle className="step-icon" />,
    title: "Complete the Swap",
    description: "Once a mutual agreement is made, follow official procedures to finalize it.",
    details:
      "According to KIIT's academic rules, submit a joint swap request through official notice. Once approved, you'll receive updated enrollment confirmation."
  }
];


  const features = [
  {
    icon: <FiUsers className="feature-icon" />,
    title: "Smart Mutual Matching",
    description:
      "Get connected with students who are looking to swap into your section while you want theirs—automatically matched for smooth exchanges."
  },
  {
    icon: <FiFilter className="feature-icon" />,
    title: "Advanced Filter Options",
    description:
      "Easily filter by desired section, current section, or see all available requests. Stay focused only on what matters to you."
  },
  {
    icon: <FiMessageCircle className="feature-icon" />,
    title: "WhatsApp Integration",
    description:
      "Directly connect with potential swap partners via WhatsApp in one click—no third-party communication needed."
  },
  {
    icon: <FiBell className="feature-icon" />,
    title: "Instant Match Alerts",
    description:
      "Get notified instantly through popup alerts when someone posts exactly what you're looking for in a swap request."
  }
];


  const handleGoBack = () => {
    window.close()
  }

  return (
    <div className="workflow-container">
      {/* Header */}
      <header className="workflow-header">
        <button onClick={handleGoBack} className="back-button">
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="header-content">
          <h1 className="workflow-title">How Section Swapping Works</h1>
          <p className="workflow-subtitle">
            A comprehensive guide to swapping course sections with fellow students
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="workflow-main">
        {/* Steps Section */}
        <section className="steps-section">
          <h2 className="section-title">4 Simple Steps to Swap Sections</h2>
          <div className="steps-grid">
            {steps.map((step, index) => (
              <div key={step.id} className="step-card">
                <div className="step-number">{step.id}</div>
                <div className="step-icon-container">
                  {step.icon}
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
                <p className="step-details">{step.details}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon-container">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Guidelines Section */}
        <section className="guidelines-section">
          <h2 className="section-title">Swap Guidelines</h2>
          <div className="guidelines-content">
            <div className="guideline-card">
              <h3 className="guideline-title">Be Flexible & Patient</h3>
              <p className="guideline-text">
                Section swaps depend on mutual agreement and availability. Be open to different options and timing.
              </p>
            </div>
            <div className="guideline-card">
              <h3 className="guideline-title">Provide Accurate Information</h3>
              <p className="guideline-text">
                Ensure all your section details, schedule, and contact information are correct and up-to-date.
              </p>
            </div>
            <div className="guideline-card">
              <h3 className="guideline-title">Communicate Clearly</h3>
              <p className="guideline-text">
                Be responsive and clear in your communications with potential swap partners and administrators.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">Join Us for Every Update</h2>
            <p className="cta-description">
              Stay connected with our community and get the latest updates on section swapping opportunities
            </p>
            <a 
              href="https://chat.whatsapp.com/L49NFqYQ1aWCRObYUBpZax" 
              target="_blank" 
              rel="noopener noreferrer"
              className="cta-button"
            >
              Join WhatsApp Group
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}

export default SectionSwappingWorkflowPage