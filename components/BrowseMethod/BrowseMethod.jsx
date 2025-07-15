"use client"
import { useState } from "react"
import {
  ChevronRight,
  FileText,
  ExternalLink,
  ArrowLeft,
  FolderOpen,
  BookOpen,
  FileCheck,
  Clipboard,
} from "lucide-react"
import "./BrowseMethod.css"

const BrowseMethod = ({ subjectsData, theme, user, setShowLoginPrompt, showNotification, setHasInteracted }) => {
  const [selectedSemester, setSelectedSemester] = useState(null)
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [selectedDocumentType, setSelectedDocumentType] = useState(null)

  const semesters = [
    { key: "first", name: "1st Semester", icon: "📚", description: "Foundation courses" },
    { key: "second", name: "2nd Semester", icon: "📖", description: "Core subjects" },
    { key: "third", name: "3rd Semester", icon: "📝", description: "Specialized topics" },
    { key: "fourth", name: "4th Semester", icon: "📄", description: "Advanced concepts" },
    { key: "fifth", name: "5th Semester", icon: "📑", description: "Professional courses" },
    { key: "sixth", name: "6th Semester", icon: "📋", description: "Industry focus" },
    { key: "seventh", name: "7th Semester", icon: "📓", description: "Project work" },
    { key: "eighth", name: "8th Semester", icon: "📔", description: "Final semester" },
  ]

  // Predefined document types with enhanced styling
  const documentTypeOptions = [
    {
      key: "mid",
      name: "Mid Semester Papers",
      icon: <FileCheck size={32} />,
      emoji: "📝",
      description: "Mid-semester examination papers and question banks",
      color: "#3B82F6",
      bgGradient: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
    },
    {
      key: "end",
      name: "End Semester Papers",
      icon: <FileText size={32} />,
      emoji: "📄",
      description: "End-semester examination papers and solutions",
      color: "#EF4444",
      bgGradient: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
    },
    {
      key: "syllabus",
      name: "Syllabus",
      icon: <Clipboard size={32} />,
      emoji: "📋",
      description: "Complete course syllabus and curriculum details",
      color: "#10B981",
      bgGradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    },
    {
      key: "notes",
      name: "Study Notes",
      icon: <BookOpen size={32} />,
      emoji: "📚",
      description: "Comprehensive study materials and lecture notes",
      color: "#F59E0B",
      bgGradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    },
  ]

  const getSubjectsForSemester = (semesterKey) => {
    const semesterData = subjectsData[semesterKey] || {}
    if (Object.keys(semesterData).length > 0) {
      return Object.keys(semesterData).map((subject) => ({
        name: subject,
        icon: getSubjectIcon(subject),
        data: semesterData[subject],
      }))
    }
    return []
  }

  const getSubjectIcon = (subject) => {
    const lower = subject.toLowerCase()
    if (lower.includes("math") || lower.includes("calculus")) return "🔢"
    if (lower.includes("physics")) return "⚛️"
    if (lower.includes("chemistry")) return "🧪"
    if (lower.includes("computer") || lower.includes("programming") || lower.includes("cse")) return "💻"
    if (lower.includes("english")) return "📝"
    if (lower.includes("mechanical") || lower.includes("mech")) return "⚙️"
    if (lower.includes("electrical") || lower.includes("eee") || lower.includes("ece")) return "⚡"
    if (lower.includes("civil") || lower.includes("bce")) return "🏗️"
    if (lower.includes("bio") || lower.includes("bme")) return "🧬"
    if (lower.includes("data")) return "📊"
    return "📖"
  }

  const getAvailableDocumentTypes = (semesterKey, subjectName) => {
    const semesterData = subjectsData[semesterKey] || {}
    const subjectData = semesterData[subjectName] || {}
    const availableTypes = Object.keys(subjectData)
    return documentTypeOptions
      .filter((docType) => {
        return availableTypes.some((availableType) => {
          const lowerAvailable = availableType.toLowerCase()
          const lowerKey = docType.key.toLowerCase()
          if (lowerKey === "mid") {
            return lowerAvailable.includes("mid")
          }
          if (lowerKey === "end") {
            return lowerAvailable.includes("end")
          }
          if (lowerKey === "syllabus") {
            return lowerAvailable.includes("syllabus")
          }
          if (lowerKey === "notes") {
            return lowerAvailable.includes("notes")
          }
          return false
        })
      })
      .map((docType) => ({
        ...docType,
        actualKey: availableTypes.find((availableType) => {
          const lowerAvailable = availableType.toLowerCase()
          const lowerKey = docType.key.toLowerCase()
          if (lowerKey === "mid") return lowerAvailable.includes("mid")
          if (lowerKey === "end") return lowerAvailable.includes("end")
          if (lowerKey === "syllabus") return lowerAvailable.includes("syllabus")
          if (lowerKey === "notes") return lowerAvailable.includes("notes")
          return false
        }),
        url: subjectData[
          availableTypes.find((availableType) => {
            const lowerAvailable = availableType.toLowerCase()
            const lowerKey = docType.key.toLowerCase()
            if (lowerKey === "mid") return lowerAvailable.includes("mid")
            if (lowerKey === "end") return lowerAvailable.includes("end")
            if (lowerKey === "syllabus") return lowerAvailable.includes("syllabus")
            if (lowerKey === "notes") return lowerAvailable.includes("notes")
            return false
          })
        ],
      }))
  }

  const openDocument = (url, title) => {
    // Simple authentication check
    if (!user) {
      console.log("User not authenticated, showing login prompt")
      setShowLoginPrompt(true)
      setHasInteracted(true) // Mark user interaction
      return
    }
    if (url && url.startsWith("http")) {
      const previewUrl = getPreviewLink(url)
      const encodedUrl = encodeURIComponent(previewUrl)
      const fileTitle = encodeURIComponent(title)

      // Open in new tab/window
      const newWindow = window.open(`/viewer?url=${encodedUrl}&title=${fileTitle}`, "_blank")

      if (newWindow) {
        showNotification(`📖 Opening: ${title}`, "success")
      } else {
        showNotification("Please allow pop-ups for this website to open documents", "warning")
      }
    } else {
      showNotification(`📄 Opening: ${title}\n\nThis document will open when available.`, "info")
    }
  }

  const getPreviewLink = (fullUrl) => {
    const match = fullUrl.match(/(?:id=|\/d\/)([-\w]{25,})/)
    return match ? `https://drive.google.com/file/d/${match[1]}/preview` : fullUrl
  }

  const resetSelection = () => {
    setSelectedSemester(null)
    setSelectedSubject(null)
    setSelectedDocumentType(null)
  }

  const goBack = () => {
    if (selectedDocumentType) {
      setSelectedDocumentType(null)
    } else if (selectedSubject) {
      setSelectedSubject(null)
    } else if (selectedSemester) {
      setSelectedSemester(null)
    }
  }

  return (
    <div className="browse-method">
      <div className="browse-header">
        <div className="browse-icon-wrapper" style={{ color: theme.primary }}>
          <FolderOpen size={36} />
        </div>
        <h2 className="browse-title" style={{ color: theme.textPrimary }}>
          Browse by Semester
        </h2>
        <p className="browse-subtitle" style={{ color: theme.textMuted }}>
          Navigate through semesters to find your study materials organized by academic progression
        </p>
      </div>
      {/* Navigation Breadcrumb */}
      {(selectedSemester || selectedSubject || selectedDocumentType) && (
        <div
          className="browse-navigation"
          style={{
            background: theme.glassBg,
            borderColor: theme.border,
          }}
        >
          <button onClick={goBack} className="back-button" style={{ color: theme.primary }}>
            <ArrowLeft size={18} />
            Back
          </button>
          <div className="breadcrumb">
            <button onClick={resetSelection} style={{ color: theme.primary }}>
              🏠 Home
            </button>
            {selectedSemester && (
              <>
                <ChevronRight size={16} color={theme.textMuted} />
                <button
                  onClick={() => {
                    setSelectedSubject(null)
                    setSelectedDocumentType(null)
                  }}
                  style={{ color: theme.primary }}
                >
                  {semesters.find((s) => s.key === selectedSemester)?.name}
                </button>
              </>
            )}
            {selectedSubject && (
              <>
                <ChevronRight size={16} color={theme.textMuted} />
                <button onClick={() => setSelectedDocumentType(null)} style={{ color: theme.primary }}>
                  {selectedSubject}
                </button>
              </>
            )}
            {selectedDocumentType && (
              <>
                <ChevronRight size={16} color={theme.textMuted} />
                <span style={{ color: theme.textMuted }}>{selectedDocumentType}</span>
              </>
            )}
          </div>
        </div>
      )}
      {/* Step 1: Select Semester */}
      {!selectedSemester && (
        <div className="browse-step">
          <h3 className="step-title" style={{ color: theme.textPrimary }}>
            📚 Step 1: Select Your Semester
          </h3>
          <div className="browse-grid">
            {semesters.map((semester) => {
              const subjectCount = getSubjectsForSemester(semester.key).length
              return (
                <button
                  key={semester.key}
                  className="browse-card large-card"
                  onClick={() => setSelectedSemester(semester.key)}
                  style={{
                    background: theme.glassBg,
                    borderColor: theme.border,
                    boxShadow: theme.shadow,
                  }}
                >
                  <div className="card-icon">{semester.icon}</div>
                  <div className="card-content">
                    <h4 style={{ color: theme.textPrimary }}>{semester.name}</h4>
                    <p style={{ color: theme.textMuted }}>
                      {semester.description} • {subjectCount} subject{subjectCount !== 1 ? "s" : ""} available
                    </p>
                  </div>
                  <div className="card-arrow" style={{ color: theme.primary }}>
                    →
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
      {/* Step 2: Select Subject */}
      {selectedSemester && !selectedSubject && (
        <div className="browse-step">
          <h3 className="step-title" style={{ color: theme.textPrimary }}>
            📖 Step 2: Select Subject for {semesters.find((s) => s.key === selectedSemester)?.name}
          </h3>
          <div className="browse-grid">
            {getSubjectsForSemester(selectedSemester).map((subject) => {
              const docCount = subject.data ? Object.keys(subject.data).length : 0
              return (
                <button
                  key={subject.name}
                  className="browse-card"
                  onClick={() => setSelectedSubject(subject.name)}
                  style={{
                    background: theme.glassBg,
                    borderColor: theme.border,
                    boxShadow: theme.shadow,
                  }}
                >
                  <div className="card-icon">{subject.icon}</div>
                  <div className="card-content">
                    <h4 style={{ color: theme.textPrimary }}>{subject.name}</h4>
                    <p style={{ color: theme.textMuted }}>
                      {docCount} document type{docCount !== 1 ? "s" : ""} available
                    </p>
                  </div>
                  <div className="card-arrow" style={{ color: theme.primary }}>
                    →
                  </div>
                </button>
              )
            })}
          </div>
          {getSubjectsForSemester(selectedSemester).length === 0 && (
            <div className="empty-state" style={{ color: theme.textMuted }}>
              <div className="empty-icon">📚</div>
              <h4>No subjects found for this semester</h4>
              <p>Subjects for this semester will be added soon. Check back later!</p>
            </div>
          )}
        </div>
      )}
      {/* Step 3: Select Document Type */}
      {selectedSemester && selectedSubject && !selectedDocumentType && (
        <div className="browse-step">
          <h3 className="step-title" style={{ color: theme.textPrimary }}>
            📄 Step 3: What do you need for {selectedSubject}?
          </h3>
          <p
            style={{
              color: theme.textMuted,
              textAlign: "center",
              marginBottom: "40px",
              fontSize: "1.1rem",
            }}
          >
            Choose the type of document you want to access
          </p>
          <div className="browse-grid">
            {getAvailableDocumentTypes(selectedSemester, selectedSubject).map((docType) => (
              <button
                key={docType.key}
                className="browse-card large-card"
                onClick={() => setSelectedDocumentType(docType.actualKey)}
                style={{
                  background: theme.glassBg,
                  borderColor: theme.border,
                  boxShadow: theme.shadow,
                }}
              >
                <div className="card-icon">{docType.emoji}</div>
                <div className="card-content">
                  <h4 style={{ color: theme.textPrimary }}>{docType.name}</h4>
                  <p style={{ color: theme.textMuted }}>{docType.description}</p>
                </div>
                <div className="card-arrow" style={{ color: theme.primary }}>
                  →
                </div>
              </button>
            ))}
          </div>
          {getAvailableDocumentTypes(selectedSemester, selectedSubject).length === 0 && (
            <div className="empty-state" style={{ color: theme.textMuted }}>
              <div className="empty-icon">📄</div>
              <h4>No documents available</h4>
              <p>Documents for {selectedSubject} will be added soon. Stay tuned!</p>
            </div>
          )}
        </div>
      )}
      {/* Step 4: Final Document View */}
      {selectedSemester && selectedSubject && selectedDocumentType && (
        <div className="browse-step">
          <h3 className="step-title" style={{ color: theme.textPrimary }}>
            📋 {selectedDocumentType} - {selectedSubject}
          </h3>
          <div className="document-list">
            {(() => {
              const semesterData = subjectsData[selectedSemester] || {}
              const subjectData = semesterData[selectedSubject] || {}
              // Find all documents that match the selected document type
              const matchingDocuments = Object.keys(subjectData).filter((docKey) => {
                const lowerDocKey = docKey.toLowerCase()
                const lowerSelectedType = selectedDocumentType.toLowerCase()
                // Check if the document key contains the selected type
                return (
                  lowerDocKey.includes(lowerSelectedType) ||
                  lowerSelectedType.includes(lowerDocKey.split(" ")[0]) ||
                  (lowerSelectedType.includes("mid") && lowerDocKey.includes("mid")) ||
                  (lowerSelectedType.includes("end") && lowerDocKey.includes("end")) ||
                  (lowerSelectedType.includes("syllabus") && lowerDocKey.includes("syllabus")) ||
                  (lowerSelectedType.includes("notes") && lowerDocKey.includes("notes"))
                )
              })
              if (matchingDocuments.length === 0) {
                return (
                  <div className="empty-state" style={{ color: theme.textMuted }}>
                    <div className="empty-icon">📄</div>
                    <h4>No documents found</h4>
                    <p>
                      No {selectedDocumentType} documents are available for {selectedSubject} at the moment.
                    </p>
                  </div>
                )
              }
              return matchingDocuments.map((docKey, index) => {
                const docUrl = subjectData[docKey]
                return (
                  <div
                    key={docKey}
                    className="document-card"
                    style={{
                      background: theme.glassBg,
                      borderColor: theme.border,
                      boxShadow: theme.shadow,
                      marginBottom: index < matchingDocuments.length - 1 ? "16px" : "0",
                    }}
                  >
                    <div className="document-info">
                      <div className="document-icon" style={{ color: theme.primary, background: `${theme.primary}15` }}>
                        📄
                      </div>
                      <div className="document-details">
                        <h4 style={{ color: theme.textPrimary }}>{docKey}</h4>
                        <p style={{ color: theme.textMuted }}>
                          {selectedSubject} • {semesters.find((s) => s.key === selectedSemester)?.name}
                        </p>
                        <p style={{ color: theme.textMuted, fontSize: "0.9rem", marginTop: "8px" }}>
                          Click to open and view this document
                        </p>
                      </div>
                    </div>
                    <div className="document-actions">
                      <button
                        onClick={() => {
                          openDocument(docUrl, `${selectedSubject} - ${docKey}`)
                        }}
                        className="action-button"
                        style={{
                          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                          color: "white",
                        }}
                      >
                        <ExternalLink size={18} />
                        Open Document
                      </button>
                    </div>
                  </div>
                )
              })
            })()}
          </div>
        </div>
      )}
    </div>
  )
}

export default BrowseMethod
