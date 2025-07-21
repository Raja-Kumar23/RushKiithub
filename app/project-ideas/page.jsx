"use client"
import { useState, useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import {
  Search,
  Youtube,
  Code,
  X,
  TrendingUp,
  Zap,
  Send,
  Star,
  CheckCircle,
  ArrowRight,
  Target,
  Lightbulb,
  Rocket,
  User,
  Briefcase,
  Globe,
  ChevronLeft,
  ChevronRight,
  Clock,
  Mail,
  Phone,
} from "lucide-react"
import { auth, db } from "../../lib/firebase"
import projectsData from "./projects.json"
import "./styles.css"

const ProjectIdeasPage = () => {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedTech, setSelectedTech] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProjects, setFilteredProjects] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [projectsPerPage] = useState(6)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    projectTitle: "",
    projectDescription: "",
    technologies: "",
    complexity: "intermediate",
    timeline: "2-4 weeks",
    additionalRequirements: "",
    contactEmail: "",
    rollNumber: "",
    phoneNumber: "",
  })

  const theme = {
    primary: "#8b5cf6",
    secondary: "#7c3aed",
    accent: "#a855f7",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    cardBg: "rgba(30, 41, 59, 0.8)",
    textPrimary: "#f8fafc",
    textSecondary: "#e2e8f0",
    textMuted: "#94a3b8",
    border: "rgba(51, 65, 85, 0.6)",
    shadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
    glow: "0 0 50px rgba(139, 92, 246, 0.3)",
  }

  const technologies = [
    "all",
    "HTML/CSS",
    "JavaScript",
    "React",
    "Next.js",
    "Python",
    "Node.js",
    "Vue.js",
    "Angular",
    "Flutter",
  ]

  // Authentication check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        if (currentUser.email.endsWith("@kiit.ac.in")) {
          const rollNumber = currentUser.email.split("@")[0]
          if (rollNumber.startsWith("22") || rollNumber.startsWith("23")) {
            setUser(currentUser)
            setFormData((prev) => ({
              ...prev,
              contactEmail: currentUser.email,
              rollNumber: rollNumber,
            }))
          } else {
            setAuthLoading(false)
            setTimeout(() => {
              window.location.href = "/"
            }, 20000)
          }
        } else {
          setAuthLoading(false)
          setTimeout(() => {
            window.location.href = "/"
          }, 3000)
        }
      } else {
        setAuthLoading(false)
        setTimeout(() => {
          window.location.href = "/"
        }, 3000)
      }
      setAuthLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // Filter projects
  useEffect(() => {
    let allProjects = []

    if (selectedLevel === "all") {
      allProjects = [...projectsData.beginner, ...projectsData.intermediate, ...projectsData.advanced]
    } else {
      allProjects = projectsData[selectedLevel] || []
    }

    if (selectedTech !== "all") {
      allProjects = allProjects.filter((project) => project.technology === selectedTech)
    }

    if (searchTerm) {
      allProjects = allProjects.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredProjects(allProjects)
    setCurrentPage(1) // Reset to first page when filters change
  }, [selectedLevel, selectedTech, searchTerm])

  // Pagination logic
  const indexOfLastProject = currentPage * projectsPerPage
  const indexOfFirstProject = indexOfLastProject - projectsPerPage
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject)
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "linear-gradient(135deg, #10b981 0%, #059669 100%)"
      case "Intermediate":
        return "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
      case "Advanced":
        return "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
      default:
        return theme.primary
    }
  }

  const getTechColor = (tech) => {
    const colors = {
      "HTML/CSS": "linear-gradient(135deg, #e34c26 0%, #f16529 100%)",
      JavaScript: "linear-gradient(135deg, #f7df1e 0%, #ffeb3b 100%)",
      React: "linear-gradient(135deg, #61dafb 0%, #21d4fd 100%)",
      "Next.js": "linear-gradient(135deg, #000000 0%, #434343 100%)",
      Python: "linear-gradient(135deg, #3776ab 0%, #ffd43b 100%)",
      "Node.js": "linear-gradient(135deg, #339933 0%, #66bb6a 100%)",
      "Vue.js": "linear-gradient(135deg, #4fc08d 0%, #44a08d 100%)",
      Angular: "linear-gradient(135deg, #dd0031 0%, #c3002f 100%)",
      Flutter: "linear-gradient(135deg, #02569b 0%, #0277bd 100%)",
    }
    return colors[tech] || theme.primary
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Add document to Firebase Firestore
      const docRef = await addDoc(collection(db, "projectRequests"), {
        ...formData,
        submittedAt: serverTimestamp(),
        status: "pending",
        userEmail: user?.email,
      })

      console.log("Document written with ID: ", docRef.id)

      // Show success popup
      setShowSuccessPopup(true)
      setShowProjectForm(false)

      // Reset form
      setFormData({
        projectTitle: "",
        projectDescription: "",
        technologies: "",
        complexity: "intermediate",
        timeline: "2-4 weeks",
        additionalRequirements: "",
        contactEmail: user?.email || "",
        rollNumber: user?.email ? user.email.split("@")[0] : "",
        phoneNumber: "",
      })
    } catch (error) {
      console.error("Error adding document: ", error)
      alert("There was an error submitting your request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSourceCodeClick = () => {
    setShowPopup(true)
  }

  const scrollToProjects = () => {
    const projectsSection = document.getElementById("projects-section")
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleLogoClick = () => {
    window.location.reload()
  }

  if (authLoading) {
    return (
      <div className="loading-container" style={{ background: theme.background }}>
        <div className="loading-content">
          <div className="loading-spinner" style={{ borderTopColor: theme.primary }}></div>
          <p style={{ color: theme.textPrimary }}>Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!user && !authLoading) {
    const currentUser = auth.currentUser
    if (!currentUser || (currentUser && !currentUser.email.endsWith("@kiit.ac.in"))) {
      return (
        <div className="access-denied" style={{ background: theme.background }}>
          <div className="access-denied-content">
            <h2>Access Restricted</h2>
            <p>This page is only accessible to KIIT students with valid @kiit.ac.in email addresses.</p>
            <p>Redirecting to home page...</p>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="project-ideas-page" style={{ background: theme.background }}>
      {/* Updated Header */}
      <header className="page-header">
        <div className="header-content">
          {/* Updated logo brand area */}
          <div className="updated-logo-brand" onClick={handleLogoClick}>
            <img src="/logo.png" alt="Website Logo" className="website-logo" />
            <div className="updated-brand-info">
              <div className="updated-brand-name">KiitHub</div>
              <div className="updated-brand-tagline">PROJECT IDEAS</div>
            </div>
          </div>

          <div className="header-right">
            <div className="user-info-display">
              <div className="user-avatar-container">
                <User size={18} />
              </div>
              <div className="user-details">
                <span className="user-roll-number">{user?.email?.split("@")[0]}</span>
                <span className="user-label">KIIT Student</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content-wrapper">
          <div className="hero-text-content">
            <div className="hero-badge">
              <Globe size={16} />
              <span>50+ Premium Projects Available</span>
            </div>
            <h1 className="hero-title">
              Transform Your Ideas Into
              <span className="gradient-text"> Reality</span>
            </h1>
            <p className="hero-description">
              Master cutting-edge technologies through hands-on projects designed for the modern tech industry
            </p>
            <div className="hero-cta">
              <button className="primary-cta-btn" onClick={scrollToProjects}>
                <Rocket size={20} />
                Explore Projects
              </button>
              <button className="secondary-cta-btn" onClick={() => setShowProjectForm(true)}>
                <Lightbulb size={20} />
                Get Custom Help
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Insights Section */}
      <section className="industry-section">
        <div className="industry-container">
          <div className="section-header">
            <div className="section-badge">
              <TrendingUp size={16} />
              <span>Industry Insights</span>
            </div>
            <h2>Why Projects Matter More Than Ever in 2025</h2>
            <p>The tech industry has fundamentally shifted. Here's what top companies are really looking for:</p>
          </div>

          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-header">
                <div className="insight-icon">
                  <Briefcase size={28} />
                </div>
                <div className="insight-stats">
                  <span className="stat-number">87%</span>
                  <span className="stat-label">of hiring managers</span>
                </div>
              </div>
              <h3>Practical Experience Over Grades</h3>
              <p>
                Top-tier companies like Google, Microsoft, and startups prioritize candidates who can demonstrate real
                problem-solving through projects.
              </p>
              <div className="insight-details">
                <div className="detail-item">
                  <CheckCircle size={16} />
                  <span>Portfolio-based hiring is now standard</span>
                </div>
                <div className="detail-item">
                  <CheckCircle size={16} />
                  <span>Live coding interviews focus on project experience</span>
                </div>
              </div>
            </div>

            <div className="insight-card">
              <div className="insight-header">
                <div className="insight-icon">
                  <Globe size={28} />
                </div>
                <div className="insight-stats">
                  <span className="stat-number">3x</span>
                  <span className="stat-label">higher salary</span>
                </div>
              </div>
              <h3>Remote Work Revolution</h3>
              <p>
                With remote work becoming permanent, companies need developers who can independently build and deploy
                applications.
              </p>
              <div className="insight-details">
                <div className="detail-item">
                  <CheckCircle size={16} />
                  <span>Self-directed project completion skills</span>
                </div>
                <div className="detail-item">
                  <CheckCircle size={16} />
                  <span>End-to-end development capabilities</span>
                </div>
              </div>
            </div>

            <div className="insight-card">
              <div className="insight-header">
                <div className="insight-icon">
                  <Zap size={28} />
                </div>
                <div className="insight-stats">
                  <span className="stat-number">95%</span>
                  <span className="stat-label">of unicorn startups</span>
                </div>
              </div>
              <h3>Modern Tech Stack Mastery</h3>
              <p>
                Today's fastest-growing companies use cutting-edge technologies. Projects help you master skills that
                command premium salaries.
              </p>
              <div className="insight-details">
                <div className="detail-item">
                  <CheckCircle size={16} />
                  <span>AI/ML integration in web apps</span>
                </div>
                <div className="detail-item">
                  <CheckCircle size={16} />
                  <span>Cloud-native development capabilities</span>
                </div>
              </div>
            </div>
          </div>

          <div className="market-reality">
            <div className="reality-header">
              <h3>The Current Market Reality</h3>
              <p>What separates hired candidates from rejected ones in 2025:</p>
            </div>
            <div className="comparison-grid">
              <div className="comparison-card rejected">
                <div className="comparison-header">
                  <X size={20} />
                  <span>Often Rejected</span>
                </div>
                <ul>
                  <li>Only theoretical knowledge</li>
                  <li>No GitHub portfolio</li>
                  <li>Can't explain real-world applications</li>
                  <li>Struggles with practical coding tests</li>
                </ul>
              </div>
              <div className="comparison-card hired">
                <div className="comparison-header">
                  <CheckCircle size={20} />
                  <span>Gets Hired</span>
                </div>
                <ul>
                  <li>Portfolio of deployed projects</li>
                  <li>Can discuss technical decisions</li>
                  <li>Demonstrates problem-solving process</li>
                  <li>Shows continuous learning through projects</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Project Assistance Section */}
      <section className="assistance-section">
        <div className="assistance-content">
          <div className="assistance-header">
            <Lightbulb className="section-icon" />
            <h2>Need Help Building Your Dream Project?</h2>
            <p>
              Have a unique project idea but lack the technical skills? KiitHub's expert team is here to help you bring
              your vision to life!
            </p>
          </div>

          <div className="assistance-features">
            <div className="assistance-grid">
              <div className="assistance-card">
                <div className="assistance-card-icon">
                  <Target size={32} />
                </div>
                <h3>Project Planning</h3>
                <p>We help structure your idea into a comprehensive development roadmap</p>
              </div>

              <div className="assistance-card">
                <div className="assistance-card-icon">
                  <Code size={32} />
                </div>
                <h3>Technical Implementation</h3>
                <p>Our experts will guide you through coding challenges and best practices</p>
              </div>

              <div className="assistance-card">
                <div className="assistance-card-icon">
                  <Rocket size={32} />
                </div>
                <h3>Deployment & Launch</h3>
                <p>Get your project live with proper hosting and optimization</p>
              </div>

              <div className="assistance-card">
                <div className="assistance-card-icon">
                  <Star size={32} />
                </div>
                <h3>Ongoing Support</h3>
                <p>Receive continued support and mentorship throughout development</p>
              </div>
            </div>
          </div>

          <div className="assistance-cta">
            <button className="cta-button" onClick={() => setShowProjectForm(true)}>
              <Send size={20} />
              Request Custom Project Help
              <ArrowRight size={16} />
            </button>
            <p className="cta-note">
              Charges apply based on project complexity • Expert guidance included • 24/7 support
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section id="projects-section" className="projects-section">
        <div className="projects-header">
          <div className="projects-title-section">
            <h2>Featured Project Ideas</h2>
            <p>Hand-picked projects with comprehensive tutorials and source code</p>
          </div>

          <div className="projects-filters">
            <div className="search-wrapper">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} className="filter-select">
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <select value={selectedTech} onChange={(e) => setSelectedTech(e.target.value)} className="filter-select">
              {technologies.map((tech) => (
                <option key={tech} value={tech}>
                  {tech === "all" ? "All Tech" : tech}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="projects-grid">
          {currentProjects.map((project, index) => (
            <div
              key={project.id}
              className="project-card"
              style={{
                background: theme.cardBg,
                border: `1px solid ${theme.border}`,
                boxShadow: theme.shadow,
              }}
            >
              <div className="project-header">
                <span
                  className="difficulty-badge"
                  style={{
                    background: getDifficultyColor(project.difficulty),
                  }}
                >
                  {project.difficulty}
                </span>

                <span
                  className="tech-badge"
                  style={{
                    background: getTechColor(project.technology),
                  }}
                >
                  {project.technology}
                </span>
              </div>
              <div className="project-content">
                <h3 className="project-title" style={{ color: theme.textPrimary }}>
                  {project.title}
                </h3>
                <p className="project-description" style={{ color: theme.textMuted }}>
                  {project.description}
                </p>
              </div>
              <div className="project-actions">
                <a
                  href={project.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-icon-btn youtube-btn"
                >
                  <Youtube size={18} />
                </a>
                <button onClick={handleSourceCodeClick} className="action-icon-btn source-btn">
                  <Code size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="enhanced-pagination">
            <button className="pagination-btn" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              <ChevronLeft size={16} />
            </button>

            <div className="pagination-numbers">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1
                const isCurrentPage = pageNumber === currentPage

                // Show first page, last page, current page, and pages around current
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      className={`pagination-number ${isCurrentPage ? "active" : ""}`}
                      onClick={() => paginate(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  )
                } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                  return (
                    <span key={pageNumber} className="pagination-dots">
                      ...
                    </span>
                  )
                }
                return null
              })}
            </div>

            <button
              className="pagination-btn"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>

            <div className="pagination-info">
              <span>
                Showing {indexOfFirstProject + 1}-{Math.min(indexOfLastProject, filteredProjects.length)} of{" "}
                {filteredProjects.length} projects
              </span>
            </div>
          </div>
        )}

        {filteredProjects.length === 0 && (
          <div className="no-results" style={{ color: theme.textMuted }}>
            <Search size={48} />
            <h3>No projects found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </section>

      {/* Source Code Popup */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>Source Code Coming Soon! 🚀</h3>
              <button className="popup-close" onClick={() => setShowPopup(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="popup-body">
              <div className="popup-icon">
                <Code size={48} />
              </div>
              <p>We're working hard to bring you the complete source code for all projects.</p>
              <p>This premium feature will be available very soon!</p>
              <div className="popup-features">
                <div className="feature-item">
                  <CheckCircle size={20} />
                  <span>Complete project files</span>
                </div>
                <div className="feature-item">
                  <CheckCircle size={20} />
                  <span>Ready-to-run code</span>
                </div>
                <div className="feature-item">
                  <CheckCircle size={20} />
                  <span>Detailed documentation</span>
                </div>
                <div className="feature-item">
                  <CheckCircle size={20} />
                  <span>Video explanations</span>
                </div>
              </div>
            </div>
            <div className="popup-footer">
              <button className="popup-button" onClick={() => setShowPopup(false)}>
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="popup-overlay" onClick={() => setShowSuccessPopup(false)}>
          <div className="success-popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="success-popup-header">
              <div className="success-icon-container">
                <CheckCircle size={48} />
              </div>
              <button className="popup-close" onClick={() => setShowSuccessPopup(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="success-popup-body">
              <h3>Request Submitted Successfully! 🎉</h3>
              <p>
                Thank you for your project request. Our expert team has received your submission and will review it
                carefully.
              </p>

              <div className="success-timeline">
                <div className="timeline-item">
                  <div className="timeline-icon">
                    <CheckCircle size={20} />
                  </div>
                  <div className="timeline-content">
                    <h4>Request Received</h4>
                    <p>Your project details have been successfully submitted</p>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-icon">
                    <Clock size={20} />
                  </div>
                  <div className="timeline-content">
                    <h4>Team Review</h4>
                    <p>Our experts will analyze your requirements within 24 hours</p>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-icon">
                    <Mail size={20} />
                  </div>
                  <div className="timeline-content">
                    <h4>Detailed Quote</h4>
                    <p>You'll receive a comprehensive proposal via email</p>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-icon">
                    <Phone size={20} />
                  </div>
                  <div className="timeline-content">
                    <h4>Personal Consultation</h4>
                    <p>Schedule a call to discuss your project in detail</p>
                  </div>
                </div>
              </div>

              <div className="success-contact-info">
                <div className="contact-item">
                  <Mail size={16} />
                  <span>Check your email: {user?.email}</span>
                </div>
                <div className="contact-item">
                  <User size={16} />
                  <span>
                    Reference ID: {user?.email?.split("@")[0]}-{Date.now().toString().slice(-6)}
                  </span>
                </div>
              </div>
            </div>
            <div className="success-popup-footer">
              <button className="success-button" onClick={() => setShowSuccessPopup(false)}>
                <CheckCircle size={16} />
                Perfect! Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Request Form */}
      {showProjectForm && (
        <div className="popup-overlay" onClick={() => setShowProjectForm(false)}>
          <div className="form-popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="form-header">
              <h3>
                <Lightbulb size={24} />
                Request Custom Project Help
              </h3>
              <button className="popup-close" onClick={() => setShowProjectForm(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="project-form">
              <div className="form-section">
                <h4>Project Details</h4>

                <div className="form-group">
                  <label>Project Title</label>
                  <input
                    type="text"
                    value={formData.projectTitle}
                    onChange={(e) => setFormData((prev) => ({ ...prev, projectTitle: e.target.value }))}
                    placeholder="e.g., E-commerce Mobile App"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Project Description</label>
                  <textarea
                    value={formData.projectDescription}
                    onChange={(e) => setFormData((prev) => ({ ...prev, projectDescription: e.target.value }))}
                    placeholder="Describe your project idea, features, and goals..."
                    rows={4}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Technologies</label>
                  <textarea
                    value={formData.technologies}
                    onChange={(e) => setFormData((prev) => ({ ...prev, technologies: e.target.value }))}
                    placeholder="e.g., React, Node.js, MongoDB, Express.js..."
                    rows={3}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Complexity Level</label>
                    <select
                      value={formData.complexity}
                      onChange={(e) => setFormData((prev) => ({ ...prev, complexity: e.target.value }))}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert Level</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Timeline</label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => setFormData((prev) => ({ ...prev, timeline: e.target.value }))}
                    >
                      <option value="1-2 weeks">1-2 weeks</option>
                      <option value="2-4 weeks">2-4 weeks</option>
                      <option value="1-2 months">1-2 months</option>
                      <option value="2-3 months">2-3 months</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Special Requirements (Optional)</label>
                  <textarea
                    value={formData.additionalRequirements}
                    onChange={(e) => setFormData((prev) => ({ ...prev, additionalRequirements: e.target.value }))}
                    placeholder="Any specific features, integrations, or requirements..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="form-section">
                <h4>Contact Information</h4>

                <div className="form-row">
                  <div className="form-group">
                    <label>KIIT Gmail</label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      readOnly
                      style={{
                        backgroundColor: "rgba(51, 65, 85, 0.3)",
                        cursor: "not-allowed",
                        opacity: 0.7,
                      }}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-footer">
                <div className="form-note">
                  <CheckCircle size={16} />
                  <span>
                    Our team will contact you within 24 hours with a detailed quote based on your project requirements.
                  </span>
                </div>

                <div className="form-actions">
                  <button type="button" className="cancel-button" onClick={() => setShowProjectForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="submit-button" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="loading-spinner-small"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Submit Request
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectIdeasPage
