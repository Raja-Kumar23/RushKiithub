"use client"

import { useState, useEffect } from "react"
import { Shield, Clock, CheckCircle2, Globe, AlertCircle, RefreshCw } from "lucide-react"
import "./styles.css"

export default function AuthPopup({ userRollNumber, onAuthenticated }) {
  const [isLoading, setIsLoading] = useState(true)
  const [studentData, setStudentData] = useState(null)
  const [selectedSemester, setSelectedSemester] = useState("")
  const [error, setError] = useState(null)
  const [accessType, setAccessType] = useState(null)
  const [semesterSelected, setSemesterSelected] = useState(false)

  const getSemesterYearMapping = (semester) => {
    const mapping = {
      "3": "2",
      "4": "21",
      "5": "3",
      "6": "31",
    }
    return mapping[semester]
  }

  useEffect(() => {
    authenticateStudent()
  }, [userRollNumber])

  const authenticateStudent = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const rollPrefix = userRollNumber.substring(0, 2)

      if (rollPrefix === "22") {
        setAccessType("senior")
        setStudentData({
          rollNumber: userRollNumber,
          year: "4",
          semester: "7/8",
        })
        setIsLoading(false)
        return
      }

      if (rollPrefix === "25" || rollPrefix === "26") {
        setAccessType("firstYear")
        setStudentData({
          rollNumber: userRollNumber,
          year: "1",
          semester: "1/2",
        })
        setIsLoading(false)
        return
      }

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

      setAccessType("normal")
      setStudentData({
        rollNumber: userRollNumber,
        year: student.year,
        semester: semester,
      })

      onAuthenticated({
        rollNumber: userRollNumber,
        year: student.year,
        semester: semester,
        section: null,
        viewType: "all",
        filterSection: null,
      })
      // </CHANGE>

      setIsLoading(false)
    } catch (err) {
      console.error("Authentication error:", err)
      setError("Failed to authenticate. Please try again.")
      setIsLoading(false)
    }
  }

  const handleSubmit = () => {
    if (accessType === "senior") {
      if (!selectedSemester) {
        setError("Please select a semester to view faculty reviews")
        return
      }
      const yearFile = getSemesterYearMapping(selectedSemester)
      onAuthenticated({
        ...studentData,
        semester: selectedSemester,
        year: yearFile,
        section: null,
        viewType: "all",
        filterSection: null,
        isSenior: true,
      })
      return
    }

    setError(null)
    onAuthenticated({
      ...studentData,
      section: null,
      viewType: "all",
      filterSection: null,
    })
  }

  if (isLoading) {
    return (
      <div className="auth-overlay">
        <div className="auth-modal">
          <div className="loading-container">
            <div className="spinner-wrapper">
              <div className="spinner"></div>
              <div className="spinner-glow"></div>
              <div className="spinner-icon">
                <Shield size={28} />
              </div>
            </div>
            <div className="loading-text-container">
              <h3 className="loading-title">Authenticating</h3>
              <p className="loading-text">Verifying your access credentials...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (accessType === "normal") {
    return null
  }
  // </CHANGE>

  if (accessType === "firstYear") {
    return (
      <div className="auth-overlay">
        <div className="auth-modal">
          <div className="modal-header header-warning">
            <div className="header-pattern"></div>
            <div className="header-glow"></div>
            <div className="header-content">
              <div className="header-icon-wrapper">
                <div className="header-icon">
                  <Clock size={52} />
                </div>
              </div>
              <h2 className="header-title">Coming Soon!</h2>
              <p className="header-subtitle">Faculty reviews will be available next year</p>
            </div>
          </div>

          <div className="modal-body">
            <div className="info-card card-success">
              <div className="info-card-content">
                <div className="info-icon-badge badge-success">
                  <Shield size={24} />
                </div>
                <div className="info-text">
                  <p className="info-label">Your Roll Number</p>
                  <p className="info-value">{studentData.rollNumber}</p>
                </div>
              </div>
            </div>

            <div className="message-list">
              <div className="message-item">
                <div className="message-icon icon-warning">
                  <Clock size={22} />
                </div>
                <div className="message-content">
                  <h3 className="message-title">Faculty Reviews Not Available Yet</h3>
                  <p className="message-text">
                    Faculty reviews will be available after you complete your first year. Focus on your studies now, and
                    you'll get access to this feature next year!
                  </p>
                </div>
              </div>

              <div className="message-item">
                <div className="message-icon icon-info">
                  <CheckCircle2 size={22} />
                </div>
                <div className="message-content">
                  <h3 className="message-title">What to do now?</h3>
                  <p className="message-text">
                    Make the most of your first year! Build strong foundations, attend classes regularly, and engage
                    with your professors directly.
                  </p>
                </div>
              </div>
            </div>

            <div className="footer-note">
              <p>Have questions? Contact admin for assistance</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (accessType === "senior") {
    return (
      <div className="auth-overlay">
        <div className="auth-modal modal-wide">
          <div className="modal-header header-success header-compact">
            <div className="header-pattern"></div>
            <div className="header-glow"></div>
            <div className="header-content">
              <div className="header-icon-wrapper">
                <div className="header-icon header-icon-small">
                  <CheckCircle2 size={40} />
                </div>
              </div>
              <h2 className="header-title header-title-compact">Welcome, Senior!</h2>
              <p className="header-subtitle">Full access to all faculty reviews</p>
              <div className="header-badges">
                <div className="badge">
                  <span className="badge-icon">🎓</span>
                  Roll: {studentData.rollNumber}
                </div>
                <div className="badge">
                  <span className="badge-icon">📚</span>
                  Year: {studentData.year}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-body modal-body-scrollable modal-body-compact">
            <div className="access-card access-card-compact">
              <div className="access-content">
                <div className="access-icon access-icon-small">
                  <Globe size={28} />
                </div>
                <div className="access-text">
                  <h3 className="access-title">Full Access Granted</h3>
                  <p className="access-description">
                    As a senior student, you have unrestricted access to view all faculty reviews across all sections
                    and semesters. Select any semester below to view its faculty reviews.
                  </p>
                </div>
              </div>
            </div>

            <div className="form-section form-section-compact">
              <label className="form-label">Select Semester to View</label>
              <p className="form-helper">Choose which semester's faculty reviews you want to explore</p>
              <div className="semester-grid">
                {["3", "4", "5", "6"].map((sem) => (
                  <button
                    key={sem}
                    onClick={() => {
                      setSelectedSemester(sem)
                      setError(null)
                      setSemesterSelected(true)
                    }}
                    className={`semester-option ${selectedSemester === sem ? "active" : ""}`}
                  >
                    <div className="semester-icon-wrapper">
                      <Globe size={32} className="semester-icon" />
                    </div>
                    <p className="semester-title">Semester {sem}</p>
                    <p className="semester-subtitle">View all faculties</p>
                  </button>
                ))}
              </div>
            </div>

            {semesterSelected && (
              <div className="reload-message">
                <AlertCircle size={18} />
                <p>To select a different semester again, please reload the page</p>
              </div>
            )}

            {error && (
              <div className="validation-error">
                <AlertCircle size={20} />
                <p>{error}</p>
              </div>
            )}
          </div>

          <div className="modal-footer modal-footer-compact">
            <button onClick={handleSubmit} disabled={!selectedSemester} className="btn btn-primary btn-large btn-full">
              {selectedSemester ? `View Semester ${selectedSemester} Faculty Reviews` : "Select a Semester to Continue"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (error && !studentData) {
    return (
      <div className="auth-overlay">
        <div className="auth-modal">
          <div className="modal-header header-error">
            <div className="header-pattern"></div>
            <div className="header-glow"></div>
            <div className="header-content">
              <div className="header-icon-wrapper">
                <div className="header-icon">
                  <AlertCircle size={52} />
                </div>
              </div>
              <h2 className="header-title">Access Denied</h2>
              <p className="header-subtitle">Unable to verify your credentials</p>
            </div>
          </div>

          <div className="modal-body">
            <div className="error-message">
              <AlertCircle size={24} />
              <p>{error}</p>
            </div>

            <div className="contact-section">
              <p className="contact-heading">Contact Admin for Help</p>

              <a
                href="https://wa.me/917004688371"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link contact-whatsapp"
              >
                <div className="contact-icon">💬</div>
                <div className="contact-info">
                  <p className="contact-name">WhatsApp</p>
                  <p className="contact-detail">+91 7004688371</p>
                </div>
              </a>

              <a href="mailto:kiithub025@gmail.com" className="contact-link contact-email">
                <div className="contact-icon">✉️</div>
                <div className="contact-info">
                  <p className="contact-name">Email</p>
                  <p className="contact-detail">kiithub025@gmail.com</p>
                </div>
              </a>

              <a
                href="https://kiithub.in/feedback/"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link contact-feedback"
              >
                <div className="contact-icon">📝</div>
                <div className="contact-info">
                  <p className="contact-name">Feedback</p>
                  <p className="contact-detail">Submit your query</p>
                </div>
              </a>
            </div>

            <button onClick={authenticateStudent} className="btn btn-secondary btn-full">
              <RefreshCw size={18} />
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
  // </CHANGE>
}
