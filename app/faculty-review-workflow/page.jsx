'use client'

import React from 'react'
import { ArrowLeft, Users, MessageSquare, Star, CheckCircle, BookOpen, TrendingUp } from 'lucide-react'
import './styles.css'

const FacultyReviewWorkflowPage = () => {
const steps = [
  {
    id: 1,
    icon: <Users className="step-icon" />,
    title: "Browse Faculty",
    description: "Explore CSE faculty by name, department, or course.",
    details: "Faculty review is currently available only for CSE branch students."
  },
  {
    id: 2,
    icon: <Star className="step-icon" />,
    title: "Submit Your Review",
    description: "Share your feedback on professors.",
    details: "Only 2nd year and above can submit one review per teacher. 1st years are not allowed."
  },
  {
    id: 3,
    icon: <MessageSquare className="step-icon" />,
    title: "View Reviews",
    description: "Read reviews before selecting sections.",
    details: "Visible only during section selection for 2nd year and above."
  },
  {
    id: 4,
    icon: <CheckCircle className="step-icon" />,
    title: "Choose Smartly",
    description: "Use student feedback to decide your sections.",
    details: "All reviews are verified and stored securely in KIITHub."
  }
];




  

  
    const features = [
  {
    icon: <BookOpen className="feature-icon" />,
    title: "Search by Section or Professor",
    description: "Easily find reviews using section, course code, or faculty name."
  },
  {
    icon: <TrendingUp className="feature-icon" />,
    title: "Section-wise Overview",
    description: "See how each faculty performed across different sections."
  },
  {
    icon: <Users className="feature-icon" />,
    title: "Teacher-wise Reviews",
    description: "View all feedback grouped by each professor for better clarity."
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
          <h1 className="workflow-title">How Faculty Reviews Work</h1>
          <p className="workflow-subtitle">
            A comprehensive guide to using our faculty review system effectively
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="workflow-main">
        {/* Steps Section */}
        <section className="steps-section">
          <h2 className="section-title">4 Simple Steps to Get Started</h2>
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
  <h2 className="section-title">Review Guidelines</h2>
  <div className="guidelines-content">
    <div className="guideline-card">
      <h3 className="guideline-title">Be Honest & Constructive</h3>
      <p className="guideline-text">
        Share your genuine experience to help others, but always keep it respectful and helpful.
      </p>
    </div>
    <div className="guideline-card">
  <h3 className="guideline-title">Respect Every Educator</h3>
  <p className="guideline-text">
    Each faculty member brings their own unique teaching style and strengths. Maintain a respectful tone and avoid using negative or offensive language.
  </p>
</div>

    <div className="guideline-card">
      <h3 className="guideline-title">Keep It Within KIIT</h3>
      <p className="guideline-text">
        These reviews are for KIIT students only. Do not share any review content outside this platform.
      </p>
    </div>
    <div className="guideline-card">
      <h3 className="guideline-title">Focus on Teaching</h3>
      <p className="guideline-text">
        Talk about course delivery, clarity, and teaching approach—not personal traits.
      </p>
    </div>
    <div className="guideline-card">
      <h3 className="guideline-title">Be Specific</h3>
      <p className="guideline-text">
        Mention examples—like how assignments, attendance, or exams were handled. This helps future students a lot.
      </p>
    </div>
  </div>
</section>


        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">Join Us for Every Update</h2>
            <p className="cta-description">
              Stay connected with our community and get the latest updates on faculty reviews
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

export default FacultyReviewWorkflowPage