"use client"

import { useState, useEffect } from "react"
import "./styles.css"

export default function AuthPopup({ userRollNumber, onAuthenticated, isDarkMode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [studentData, setStudentData] = useState(null)
  const [selectedSection, setSelectedSection] = useState("")
  const [selectedView, setSelectedView] = useState("")
  const [error, setError] = useState(null)

  const allSections = Array.from({ length: 54 }, (_, i) => String(i + 1))

  useEffect(() => {
    authenticateStudent()
  }, [userRollNumber])

  const authenticateStudent = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/students.json")
      if (!response.ok) {
        throw new Error("Failed to load student data")
      }

      const data = await response.json()
      const student = data.students.find((s) => s.rollNumber === userRollNumber)

      if (!student) {
        setError("Your roll number is not authorized. Please contact admin.")
        setIsLoading(false)
        return
      }

      let semester = "3"
      if (student.year === "2") semester = "3"
      else if (student.year === "21") semester = "4"
      else if (student.year === "3") semester = "5"
      else if (student.year === "31") semester = "6"

      setStudentData({
        rollNumber: userRollNumber,
        year: student.year,
        semester: semester,
      })
      setIsLoading(false)
    } catch (err) {
      console.error("Authentication error:", err)
      setError("Failed to authenticate. Please try again.")
      setIsLoading(false)
    }
  }

  const handleSubmit = () => {
    if (!selectedSection) {
      setError("Please select a section")
      return
    }
    if (!selectedView) {
      setError("Please select a view option")
      return
    }

    setError(null)

    if (selectedView === "section") {
      onAuthenticated({
        ...studentData,
        section: selectedSection,
        viewType: "section",
        filterSection: selectedSection,
      })
    } else {
      onAuthenticated({
        ...studentData,
        section: selectedSection,
        viewType: "all",
        filterSection: null,
      })
    }
  }

  if (isLoading) {
    return (
      <div className="auth-popup-overlay">
        <div className={`auth-popup ${isDarkMode ? "dark" : ""}`}>
          <div className="auth-loading">
            <div className="spinner"></div>
            <p>Authenticating your access...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !studentData) {
    return (
      <div className="auth-popup-overlay">
        <div className={`auth-popup ${isDarkMode ? "dark" : ""}`}>
          <div className="auth-error">
            <div className="error-icon">⚠️</div>
            <h2>Authentication Failed</h2>
            <p>{error}</p>
            <div className="contact-admin">
              <h3>Contact Admin</h3>
              <div className="contact-methods">
                <a
                  href="https://wa.me/917004688371"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-btn whatsapp"
                >
                  <span className="contact-icon">📱</span>
                  <span>WhatsApp: 7004688371</span>
                </a>
                <a href="mailto:kiithub025@gmail.com" className="contact-btn email">
                  <span className="contact-icon">✉️</span>
                  <span>kiithub025@gmail.com</span>
                </a>
                <a
                  href="https://kiithub.in/feedback/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-btn feedback"
                >
                  <span className="contact-icon">📝</span>
                  <span>Feedback Form</span>
                </a>
              </div>
            </div>
            <button className="retry-btn" onClick={authenticateStudent}>
              Retry Authentication
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!studentData) {
    return null
  }

  return (
    <div className="auth-popup-overlay">
      <div className={`auth-popup-compact ${isDarkMode ? "dark" : ""}`}>
        <div className="auth-header-compact">
          <div className="welcome-icon-compact">🎓</div>
          <h2>Faculty Reviews</h2>
          <div className="student-info-inline">
            <span className="info-pill">Roll: {studentData.rollNumber}</span>
            <span className="info-pill">Semester: {studentData.semester}</span>
          </div>
        </div>

        <div className="auth-content-compact">
          <div className="selection-group">
            <label className="selection-label">Select Your Section</label>
            <div className="sections-grid">
              {allSections.map((section) => (
                <button
                  key={section}
                  className={`section-btn ${selectedSection === section ? "active" : ""}`}
                  onClick={() => {
                    setSelectedSection(section)
                    setError(null)
                  }}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>

          <div className="selection-group">
            <label className="selection-label">Choose View</label>
            <div className="view-options-compact">
              <button
                className={`view-btn ${selectedView === "section" ? "active" : ""}`}
                onClick={() => {
                  setSelectedView("section")
                  setError(null)
                }}
              >
                <span className="view-icon">👥</span>
                <span className="view-text">My Section</span>
              </button>
              <button
                className={`view-btn ${selectedView === "all" ? "active" : ""}`}
                onClick={() => {
                  setSelectedView("all")
                  setError(null)
                }}
              >
                <span className="view-icon">🌐</span>
                <span className="view-text">All Faculties</span>
              </button>
            </div>
          </div>

          {error && <p className="error-message-compact">{error}</p>}

          <button className="submit-btn-compact" onClick={handleSubmit} disabled={!selectedSection || !selectedView}>
            Continue to Reviews
          </button>
        </div>
      </div>
    </div>
  )
}
