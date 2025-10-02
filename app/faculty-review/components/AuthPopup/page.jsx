"use client"

import { useState, useEffect } from "react"
import "./styles.css"

export default function AuthPopup({ userRollNumber, onAuthenticated, isDarkMode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [studentData, setStudentData] = useState(null)
  const [selectedSection, setSelectedSection] = useState("")
  const [error, setError] = useState(null)
  const [step, setStep] = useState(1) // 1: loading, 2: select section, 3: select view

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
      setStep(2) // Move to section selection
    } catch (err) {
      console.error("Authentication error:", err)
      setError("Failed to authenticate. Please try again.")
      setIsLoading(false)
    }
  }

  const handleSectionSelect = () => {
    if (!selectedSection) {
      setError("Please select a section")
      return
    }
    setError(null)
    setStep(3) // Move to view selection
  }

  const handleViewSelection = (viewType) => {
    if (viewType === "section") {
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
            <button className="retry-btn" onClick={authenticateStudent}>
              Retry
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
      <div className={`auth-popup ${isDarkMode ? "dark" : ""}`}>
        <div className="auth-header">
          <div className="welcome-icon">🎓</div>
          <h2>Welcome to Faculty Reviews</h2>
          <p className="roll-number">Roll Number: {studentData.rollNumber}</p>
        </div>

        <div className="auth-info">
          <div className="info-card">
            <span className="info-label">Your Semester</span>
            <span className="info-value">{studentData.semester}</span>
          </div>
        </div>

        {step === 2 && (
          <div className="section-selection">
            <h3>Select Your Section</h3>
            <p className="selection-description">Choose your section number from the list below</p>

            <div className="section-dropdown-container">
              <select
                className="section-dropdown"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
              >
                <option value="">-- Select Section --</option>
                {allSections.map((section) => (
                  <option key={section} value={section}>
                    Section {section}
                  </option>
                ))}
              </select>
            </div>

            {error && <p className="error-message">{error}</p>}

            <button className="continue-btn" onClick={handleSectionSelect}>
              Continue
            </button>
          </div>
        )}

        {step === 3 && (
          <>
            <div className="selected-section-display">
              <span className="info-label">Selected Section</span>
              <span className="info-value">{selectedSection}</span>
              <button className="change-section-btn" onClick={() => setStep(2)}>
                Change
              </button>
            </div>

            <div className="view-selection">
              <h3>Choose Your View</h3>
              <p className="view-description">Select how you want to view faculty information</p>

              <div className="view-options">
                <button className="view-option-btn section-view" onClick={() => handleViewSelection("section")}>
                  <div className="option-icon">👥</div>
                  <div className="option-content">
                    <h4>My Section Only</h4>
                    <p>View faculties teaching Section {selectedSection}</p>
                  </div>
                </button>

                <button className="view-option-btn all-view" onClick={() => handleViewSelection("all")}>
                  <div className="option-icon">🌐</div>
                  <div className="option-content">
                    <h4>All Faculties</h4>
                    <p>View all faculties across all sections</p>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}

        <div className="auth-footer">
          <p className="semester-info">You have access to Semester {studentData.semester} faculty reviews</p>
        </div>
      </div>
    </div>
  )
}
