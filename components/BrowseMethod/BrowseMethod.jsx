"use client"

import { useState } from "react"
import {
  ChevronRight,
  FileText,
  ArrowLeft,
  FolderOpen,
  BookOpen,
  FileCheck,
  Eye,
  Grid,
  PenTool,
  GraduationCap,
} from "lucide-react"
import PDFViewer from "../PDFViewer/PDFViewer"
import { getAllPDFsByCategory } from "../../lib/storageHelpers"
import "./BrowseMethod.css"

const BrowseMethod = ({ subjectsData, theme, user, setShowLoginPrompt, showNotification, setHasInteracted }) => {
  const [selectedSemester, setSelectedSemester] = useState(null)
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [selectedDocumentType, setSelectedDocumentType] = useState(null)
  const [showQuickBrowse, setShowQuickBrowse] = useState(false)
  const [pdfViewer, setPdfViewer] = useState({
    isOpen: false,
    fileUrl: "",
    fileName: "",
  })

  // Updated semesters for numbered folders
  const semesters = [
    { key: "semester_1", name: "Semester 1", icon: "1️⃣", description: "First semester materials", folderNumber: "1" },
    { key: "semester_2", name: "Semester 2", icon: "2️⃣", description: "Second semester materials", folderNumber: "2" },
    { key: "semester_3", name: "Semester 3", icon: "3️⃣", description: "Third semester materials", folderNumber: "3" },
    { key: "semester_4", name: "Semester 4", icon: "4️⃣", description: "Fourth semester materials", folderNumber: "4" },
    { key: "semester_5", name: "Semester 5", icon: "5️⃣", description: "Fifth semester materials", folderNumber: "5" },
    { key: "semester_6", name: "Semester 6", icon: "6️⃣", description: "Sixth semester materials", folderNumber: "6" },
    { key: "semester_7", name: "Semester 7", icon: "7️⃣", description: "Seventh semester materials", folderNumber: "7" },
    { key: "semester_8", name: "Semester 8", icon: "8️⃣", description: "Eighth semester materials", folderNumber: "8" },
  ]

  // Enhanced document types matching new category selector
  const documentTypeOptions = [
    {
      key: "syllabus",
      name: "Syllabus",
      icon: <FileText size={32} />,
      emoji: "📄",
      description: "Course syllabus and curriculum details",
      color: "#06B6D4",
      bgGradient: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
    },
    {
      key: "notes",
      name: "Study Notes",
      icon: <BookOpen size={32} />,
      emoji: "📖",
      description: "Comprehensive study materials and notes",
      color: "#8B5CF6",
      bgGradient: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
    },
    {
      key: "midsem",
      name: "Mid Semester",
      icon: <PenTool size={32} />,
      emoji: "📋",
      description: "Mid-semester examination papers",
      color: "#F59E0B",
      bgGradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    },
    {
      key: "endsem",
      name: "End Semester",
      icon: <GraduationCap size={32} />,
      emoji: "🎓",
      description: "End-semester examination papers",
      color: "#EF4444",
      bgGradient: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
    },
    {
      key: "questions",
      name: "Question Papers",
      icon: <FileText size={32} />,
      emoji: "📝",
      description: "Previous year question papers and exam papers",
      color: "#3B82F6",
      bgGradient: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
    },
    {
      key: "solutions",
      name: "Solutions",
      icon: <FileCheck size={32} />,
      emoji: "✅",
      description: "Answer keys and detailed solutions",
      color: "#10B981",
      bgGradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    },
    {
      key: "general",
      name: "General",
      icon: <FileText size={32} />,
      emoji: "📄",
      description: "General study materials and documents",
      color: "#6B7280",
      bgGradient: "linear-gradient(135deg, #6B7280 0%, #4B5563 100%)",
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
    if (lower.includes("bio") || lower.includes("biology")) return "🧬"
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
          return lowerAvailable.includes(lowerKey) || lowerKey.includes(lowerAvailable)
        })
      })
      .map((docType) => ({
        ...docType,
        actualKey: availableTypes.find((availableType) => {
          const lowerAvailable = availableType.toLowerCase()
          const lowerKey = docType.key.toLowerCase()
          return lowerAvailable.includes(lowerKey) || lowerKey.includes(lowerAvailable)
        }),
        data: subjectData[
          availableTypes.find((availableType) => {
            const lowerAvailable = availableType.toLowerCase()
            const lowerKey = docType.key.toLowerCase()
            return lowerAvailable.includes(lowerKey) || lowerKey.includes(lowerAvailable)
          })
        ],
      }))
  }

  const openDocument = (url, title) => {
    if (!user) {
      console.log("User not authenticated, showing login prompt")
      setShowLoginPrompt(true)
      setHasInteracted(true)
      return
    }
    if (url && url.startsWith("https://firebasestorage.googleapis.com")) {
      setPdfViewer({
        isOpen: true,
        fileUrl: url,
        fileName: title,
      })
      showNotification(`📖 Opening: ${title}`, "success")
    } else {
      showNotification("Invalid document URL. Please try again later.", "error")
    }
  }

  const closePDFViewer = () => {
    setPdfViewer({
      isOpen: false,
      fileUrl: "",
      fileName: "",
    })
  }

  const resetSelection = () => {
    setSelectedSemester(null)
    setSelectedSubject(null)
    setSelectedDocumentType(null)
    setShowQuickBrowse(false)
  }

  const goBack = () => {
    if (selectedDocumentType) {
      setSelectedDocumentType(null)
    } else if (selectedSubject) {
      setSelectedSubject(null)
    } else if (selectedSemester) {
      setSelectedSemester(null)
    } else if (showQuickBrowse) {
      setShowQuickBrowse(false)
    }
  }

  // Show all PDFs for a specific document type (Quick Browse)
  const showAllPDFsForType = (docTypeKey) => {
    setSelectedDocumentType(docTypeKey)
    setShowQuickBrowse(true)
  }

  // Get all PDFs for the selected document type
  const getAllPDFsForSelectedType = () => {
    if (!selectedDocumentType) return []
    return getAllPDFsByCategory(selectedDocumentType, subjectsData)
  }

  return (
    <>
      <div className="browse-method">
        <div className="browse-header">
          <div className="browse-icon-wrapper" style={{ color: theme.primary }}>
            <FolderOpen size={36} />
          </div>
          <h2 className="browse-title" style={{ color: theme.textPrimary }}>
            Browse Question Papers
          </h2>
          <p className="browse-subtitle" style={{ color: theme.textMuted }}>
            Navigate through your academic materials step by step
          </p>
        </div>

        {/* Navigation Breadcrumb */}
        {(selectedSemester || selectedSubject || selectedDocumentType || showQuickBrowse) && (
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
              {showQuickBrowse && (
                <>
                  <ChevronRight size={16} color={theme.textMuted} />
                  <span style={{ color: theme.textMuted }}>
                    Quick Browse - {documentTypeOptions.find((d) => d.key === selectedDocumentType)?.name}
                  </span>
                </>
              )}
              {selectedSemester && !showQuickBrowse && (
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
              {selectedSubject && !showQuickBrowse && (
                <>
                  <ChevronRight size={16} color={theme.textMuted} />
                  <button onClick={() => setSelectedDocumentType(null)} style={{ color: theme.primary }}>
                    {selectedSubject}
                  </button>
                </>
              )}
              {selectedDocumentType && !showQuickBrowse && (
                <>
                  <ChevronRight size={16} color={theme.textMuted} />
                  <span style={{ color: theme.textMuted }}>{selectedDocumentType}</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* INITIAL VIEW: Choose Browse Method */}
        {!selectedSemester && !showQuickBrowse && (
          <div className="browse-step">
            <h3 className="step-title" style={{ color: theme.textPrimary }}>
              Choose Your Browse Method
            </h3>
            <p style={{ color: theme.textMuted, textAlign: "center", marginBottom: "40px", fontSize: "1.1rem" }}>
              How would you like to find your documents?
            </p>
            <div className="browse-grid">
              {/* Method 1: Step by Step (Semester → Subject → Document Type) */}
              <button
                className="browse-card large-card"
                onClick={() => {
                  /* This will show semester selection below */
                }}
                style={{
                  background: theme.glassBg,
                  borderColor: theme.border,
                  boxShadow: theme.shadow,
                }}
              >
                <div className="card-icon">🎯</div>
                <div className="card-content">
                  <h4 style={{ color: theme.textPrimary }}>Step by Step Browse</h4>
                  <p style={{ color: theme.textMuted }}>
                    Navigate systematically: Select Semester → Subject → Document Type
                  </p>
                </div>
                <div className="card-arrow" style={{ color: theme.primary }}>
                  👇
                </div>
              </button>

              {/* Method 2: Quick Browse by Category */}
              <button
                className="browse-card large-card"
                onClick={() => setShowQuickBrowse(true)}
                style={{
                  background: theme.glassBg,
                  borderColor: theme.border,
                  boxShadow: theme.shadow,
                }}
              >
                <div className="card-icon">🚀</div>
                <div className="card-content">
                  <h4 style={{ color: theme.textPrimary }}>Quick Browse by Category</h4>
                  <p style={{ color: theme.textMuted }}>Browse all papers of a specific type across all semesters</p>
                </div>
                <div className="card-arrow" style={{ color: theme.primary }}>
                  →
                </div>
              </button>
            </div>
          </div>
        )}

        {/* QUICK BROWSE: Show Document Categories */}
        {showQuickBrowse && !selectedDocumentType && (
          <div className="browse-step">
            <h3 className="step-title" style={{ color: theme.textPrimary }}>
              🚀 Quick Browse by Category
            </h3>
            <p style={{ color: theme.textMuted, textAlign: "center", marginBottom: "30px" }}>
              Browse all papers of a specific type across all semesters and subjects
            </p>
            <div className="browse-grid">
              {documentTypeOptions.slice(0, 4).map((docType) => {
                const allPDFs = getAllPDFsByCategory(docType.key, subjectsData)
                return (
                  <button
                    key={`quick-${docType.key}`}
                    className="browse-card large-card"
                    onClick={() => showAllPDFsForType(docType.key)}
                    style={{
                      background: theme.glassBg,
                      borderColor: theme.border,
                      boxShadow: theme.shadow,
                    }}
                  >
                    <div className="card-icon">{docType.emoji}</div>
                    <div className="card-content">
                      <h4 style={{ color: theme.textPrimary }}>{docType.name}</h4>
                      <p style={{ color: theme.textMuted }}>
                        {docType.description} • {allPDFs.length} paper{allPDFs.length !== 1 ? "s" : ""} available
                      </p>
                    </div>
                    <div className="card-arrow" style={{ color: theme.primary }}>
                      <Grid size={20} />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* QUICK BROWSE: Show All PDFs Grid */}
        {showQuickBrowse && selectedDocumentType && (
          <div className="browse-step">
            <div className="category-header" style={{ marginBottom: "30px", textAlign: "center" }}>
              <div
                className="category-badge"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                  color: "white",
                  padding: "12px 24px",
                  borderRadius: "25px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "16px",
                  fontWeight: "600",
                  marginBottom: "16px",
                }}
              >
                {documentTypeOptions.find((d) => d.key === selectedDocumentType)?.emoji}
                All {documentTypeOptions.find((d) => d.key === selectedDocumentType)?.name} Papers
              </div>
              <p style={{ color: theme.textMuted, fontSize: "16px" }}>
                {getAllPDFsForSelectedType().length} papers found across all semesters and subjects
              </p>
            </div>
            <div className="pdfs-grid">
              {getAllPDFsForSelectedType().map((pdf, index) => (
                <div
                  key={`${pdf.url}-${index}`}
                  className="pdf-card"
                  style={{
                    background: theme.glassBg,
                    borderColor: theme.border,
                    boxShadow: theme.shadow,
                  }}
                >
                  <div className="pdf-card-header">
                    <div className="pdf-icon" style={{ color: theme.primary }}>
                      <FileText size={20} />
                    </div>
                    <div className="pdf-type" style={{ background: theme.primary, color: "white" }}>
                      {pdf.docType}
                    </div>
                  </div>
                  <div className="pdf-content">
                    <h4 className="pdf-title" style={{ color: theme.textPrimary }}>
                      {pdf.fileName}
                    </h4>
                    <div className="pdf-meta">
                      <span style={{ color: theme.textMuted }}>📁 {pdf.subject}</span>
                      <span style={{ color: theme.textMuted }}>🎓 {pdf.semester}</span>
                    </div>
                  </div>
                  <button
                    className="pdf-action"
                    onClick={() => openDocument(pdf.url, pdf.fileName)}
                    style={{
                      background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                      color: "white",
                    }}
                  >
                    <Eye size={16} />
                    View PDF
                  </button>
                </div>
              ))}
            </div>
            {getAllPDFsForSelectedType().length === 0 && (
              <div className="empty-state" style={{ color: theme.textMuted }}>
                <div className="empty-icon">📄</div>
                <h4>No {documentTypeOptions.find((d) => d.key === selectedDocumentType)?.name} papers found</h4>
                <p>Papers of this type will be added soon. Check back later!</p>
              </div>
            )}
          </div>
        )}

        {/* STEP 1: Select Semester (Only show when not in quick browse mode) */}
        {!selectedSemester && !showQuickBrowse && (
          <div className="browse-step">
            <h3 className="step-title" style={{ color: theme.textPrimary }}>
              📚 Step 1: Select Your Semester
            </h3>
            <p style={{ color: theme.textMuted, textAlign: "center", marginBottom: "30px" }}>
              Choose your semester to see available subjects
            </p>
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

        {/* STEP 2: Select Subject (when semester is selected) */}
        {selectedSemester && !selectedSubject && !showQuickBrowse && (
          <div className="browse-step">
            <h3 className="step-title" style={{ color: theme.textPrimary }}>
              📖 Step 2: Select Subject for {semesters.find((s) => s.key === selectedSemester)?.name}
            </h3>
            <p style={{ color: theme.textMuted, textAlign: "center", marginBottom: "30px" }}>
              Choose a subject to see available document types
            </p>
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
                <p>Question papers for this semester will be added soon. Check back later!</p>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Select Document Type (when subject is selected) */}
        {selectedSemester && selectedSubject && !selectedDocumentType && !showQuickBrowse && (
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

        {/* STEP 4: Final Document View - Show ALL PDFs in Grid (when document type is selected) */}
        {selectedSemester && selectedSubject && selectedDocumentType && !showQuickBrowse && (
          <div className="browse-step">
            <h3 className="step-title" style={{ color: theme.textPrimary }}>
              📋 {selectedDocumentType} - {selectedSubject}
            </h3>
            <div className="pdfs-grid">
              {(() => {
                const semesterData = subjectsData[selectedSemester] || {}
                const subjectData = semesterData[selectedSubject] || {}
                const docTypeData = subjectData[selectedDocumentType]

                if (!docTypeData) {
                  return (
                    <div className="empty-state" style={{ color: theme.textMuted }}>
                      <div className="empty-icon">📄</div>
                      <h4>No documents found</h4>
                      <p>
                        No documents are available for {selectedSubject} - {selectedDocumentType} at the moment.
                      </p>
                    </div>
                  )
                }

                // Handle both old structure (single URL) and new structure (object of PDFs)
                if (typeof docTypeData === "string") {
                  // Old structure - single PDF
                  return (
                    <div
                      className="pdf-card"
                      style={{
                        background: theme.glassBg,
                        borderColor: theme.border,
                        boxShadow: theme.shadow,
                      }}
                    >
                      <div className="pdf-card-header">
                        <div className="pdf-icon" style={{ color: theme.primary }}>
                          <FileText size={20} />
                        </div>
                        <div className="pdf-type" style={{ background: theme.primary, color: "white" }}>
                          {selectedDocumentType}
                        </div>
                      </div>
                      <div className="pdf-content">
                        <h4 className="pdf-title" style={{ color: theme.textPrimary }}>
                          {selectedDocumentType}
                        </h4>
                        <div className="pdf-meta">
                          <span style={{ color: theme.textMuted }}>📁 {selectedSubject}</span>
                          <span style={{ color: theme.textMuted }}>
                            🎓 {semesters.find((s) => s.key === selectedSemester)?.name}
                          </span>
                        </div>
                      </div>
                      <button
                        className="pdf-action"
                        onClick={() => {
                          openDocument(docTypeData, `${selectedSubject} - ${selectedDocumentType}`)
                        }}
                        style={{
                          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                          color: "white",
                        }}
                      >
                        <Eye size={16} />
                        View PDF
                      </button>
                    </div>
                  )
                } else if (typeof docTypeData === "object") {
                  // New structure - multiple PDFs in grid
                  const pdfEntries = Object.entries(docTypeData)
                  if (pdfEntries.length === 0) {
                    return (
                      <div className="empty-state" style={{ color: theme.textMuted }}>
                        <div className="empty-icon">📄</div>
                        <h4>No PDFs found</h4>
                        <p>No PDF files are available in this category at the moment.</p>
                      </div>
                    )
                  }

                  return pdfEntries.map(([pdfName, pdfUrl], index) => (
                    <div
                      key={`${pdfName}-${index}`}
                      className="pdf-card"
                      style={{
                        background: theme.glassBg,
                        borderColor: theme.border,
                        boxShadow: theme.shadow,
                      }}
                    >
                      <div className="pdf-card-header">
                        <div className="pdf-icon" style={{ color: theme.primary }}>
                          <FileText size={20} />
                        </div>
                        <div className="pdf-type" style={{ background: theme.primary, color: "white" }}>
                          {selectedDocumentType}
                        </div>
                      </div>
                      <div className="pdf-content">
                        <h4 className="pdf-title" style={{ color: theme.textPrimary }}>
                          {pdfName}
                        </h4>
                        <div className="pdf-meta">
                          <span style={{ color: theme.textMuted }}>📁 {selectedSubject}</span>
                          <span style={{ color: theme.textMuted }}>
                            🎓 {semesters.find((s) => s.key === selectedSemester)?.name}
                          </span>
                        </div>
                      </div>
                      <button
                        className="pdf-action"
                        onClick={() => {
                          openDocument(pdfUrl, pdfName)
                        }}
                        style={{
                          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                          color: "white",
                        }}
                      >
                        <Eye size={16} />
                        View PDF
                      </button>
                    </div>
                  ))
                }

                return (
                  <div className="empty-state" style={{ color: theme.textMuted }}>
                    <div className="empty-icon">📄</div>
                    <h4>Invalid document structure</h4>
                    <p>There seems to be an issue with the document structure. Please try again later.</p>
                  </div>
                )
              })()}
            </div>
          </div>
        )}
      </div>

      {/* PDF Viewer Modal */}
      <PDFViewer
        isOpen={pdfViewer.isOpen}
        onClose={closePDFViewer}
        fileUrl={pdfViewer.fileUrl}
        fileName={pdfViewer.fileName}
        theme={theme}
      />
    </>
  )
}

export default BrowseMethod
