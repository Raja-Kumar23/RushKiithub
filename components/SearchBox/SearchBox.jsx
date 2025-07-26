"use client"
import { useRef, useEffect, useState } from "react"
import { Search, RefreshCw, X, AlertCircle, Loader, FileText, Eye } from "lucide-react"
import { searchInStorageData } from "../../lib/storageHelpers"
import PDFViewer from "../PDFViewer/PDFViewer"
import "./SearchBox.css"

const SearchBox = ({
  searchInput,
  setSearchInput,
  showSuggestions,
  setShowSuggestions,
  suggestions,
  setSuggestions,
  subjectsData,
  selectedCategory,
  theme,
  user,
  setShowLoginPrompt,
  setSearchHistory,
  searchHistory,
  setHasInteracted,
  isLoadingData,
  dataError,
  totalFiles,
}) => {
  const searchInputRef = useRef(null)
  const suggestionsRef = useRef(null)
  const [pdfViewer, setPdfViewer] = useState({
    isOpen: false,
    fileUrl: "",
    fileName: "",
  })

  // Check if we have any real data
  const hasRealData = totalFiles > 0 && Object.keys(subjectsData).length > 0

  const handleSearchInput = (e) => {
    if (!user) {
      setShowLoginPrompt(true)
      setHasInteracted(true)
      return
    }

    const input = e.target.value.toLowerCase().trim()
    setSearchInput(input)

    if (!input) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    if (!hasRealData) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    // Use the enhanced storage-based search with category filtering
    const results = searchInStorageData(input, selectedCategory, subjectsData)
    console.log("Search results:", results)

    setSuggestions(results)
    setShowSuggestions(results.length > 0)
  }

  const openPaper = (subject, docType, url, fileName, pdfName) => {
    if (!user) {
      setShowLoginPrompt(true)
      setHasInteracted(true)
      return
    }

    if (url && url.startsWith("https://firebasestorage.googleapis.com")) {
      const displayName = pdfName || fileName || `${subject} - ${docType}`

      setPdfViewer({
        isOpen: true,
        fileUrl: url,
        fileName: displayName,
      })

      storeSearch(displayName)
      setShowSuggestions(false)
      setSearchInput("")
    } else {
      alert(`Unable to open: ${subject} - ${docType}\n\nThe file URL is invalid or the document is not available.`)
      return
    }
  }

  const closePDFViewer = () => {
    setPdfViewer({
      isOpen: false,
      fileUrl: "",
      fileName: "",
    })
  }

  const storeSearch = (query) => {
    const history = JSON.parse(localStorage.getItem("searchHistory")) || []
    if (!history.includes(query)) {
      const newHistory = [query, ...history].slice(0, 10)
      localStorage.setItem("searchHistory", JSON.stringify(newHistory))
      setSearchHistory(newHistory)
    }
  }

  const clearSearch = () => {
    setSearchInput("")
    setSuggestions([])
    setShowSuggestions(false)
    searchInputRef.current?.focus()
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [setShowSuggestions])

  const getStatusMessage = () => {
    if (isLoadingData) {
      return {
        icon: <Loader size={20} className="animate-spin" color={theme.primary} />,
        title: "Loading study materials...",
        message: "Please wait while we fetch your documents from Firebase Storage.",
      }
    }

    if (dataError) {
      return {
        icon: <AlertCircle size={20} color={theme.error} />,
        title: "Error loading data",
        message: `Failed to load study materials: ${dataError}`,
      }
    }

    if (!hasRealData) {
      return {
        icon: <AlertCircle size={20} color={theme.warning} />,
        title: "No study materials found",
        message: "Please upload PDF files to your Firebase Storage to enable search functionality.",
      }
    }

    return null
  }

  const statusMessage = getStatusMessage()

  return (
    <>
      <div className="search-section">
        <div className="search-container">
          <div
            className="search-box"
            style={{
              background: theme.glassBg,
              borderColor: theme.border,
              boxShadow: theme.shadow,
            }}
          >
            <div className="search-icon">
              <Search size={20} color={theme.primary} />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder={
                isLoadingData
                  ? "Loading..."
                  : hasRealData
                    ? `Search through ${totalFiles} study materials...`
                    : "No data available - please upload files to Firebase Storage"
              }
              value={searchInput}
              onChange={handleSearchInput}
              className="search-input"
              disabled={!hasRealData || isLoadingData}
              style={{
                color: hasRealData ? theme.textPrimary : theme.textMuted,
                background: "transparent",
                cursor: hasRealData && !isLoadingData ? "text" : "not-allowed",
              }}
            />
            {searchInput && (
              <button className="clear-search" onClick={clearSearch} style={{ color: theme.textMuted }}>
                <X size={16} />
              </button>
            )}
            <div className="search-actions">
              <button
                className="search-action refresh"
                onClick={() => window.location.reload()}
                style={{ color: theme.textMuted }}
                title="Refresh page"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div
              style={{
                marginTop: "20px",
                padding: "16px",
                background: `${statusMessage.icon.props.color}20`,
                border: `1px solid ${statusMessage.icon.props.color}`,
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: theme.textPrimary,
              }}
            >
              {statusMessage.icon}
              <div>
                <p style={{ margin: 0, fontWeight: "600" }}>{statusMessage.title}</p>
                <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: theme.textMuted }}>{statusMessage.message}</p>
              </div>
            </div>
          )}

          {/* Data Summary */}
          {hasRealData && !isLoadingData && (
            <div
              style={{
                marginTop: "16px",
                padding: "12px 16px",
                background: `${theme.success}20`,
                border: `1px solid ${theme.success}`,
                borderRadius: "8px",
                textAlign: "center",
                color: theme.textPrimary,
                fontSize: "14px",
              }}
            >
              📚 {totalFiles} study materials loaded successfully
              {selectedCategory && (
                <span style={{ marginLeft: "8px", color: theme.primary }}>• Filtered by {selectedCategory}</span>
              )}
            </div>
          )}

          {/* Search Results Grid */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="search-results-grid"
              style={{
                background: theme.cardBg,
                borderColor: theme.border,
                boxShadow: theme.shadow,
              }}
            >
              <div className="search-results-header" style={{ color: theme.textMuted }}>
                <Search size={16} />
                <span>Search Results ({suggestions.length})</span>
                {selectedCategory && (
                  <span className="filter-badge" style={{ background: theme.primary, color: "white" }}>
                    {selectedCategory}
                  </span>
                )}
              </div>
              <div className="results-grid">
                {suggestions.map((suggestion, index) => {
                  const displayName =
                    suggestion.pdfName || suggestion.fileName || `${suggestion.subject} - ${suggestion.docType}`

                  return (
                    <div
                      key={`${suggestion.url}-${index}`}
                      className="result-card"
                      style={{
                        background: theme.glassBg,
                        borderColor: theme.border,
                      }}
                    >
                      <div className="result-card-header">
                        <div className="result-icon" style={{ color: theme.primary }}>
                          <FileText size={20} />
                        </div>
                        <div className="result-type" style={{ background: theme.primary, color: "white" }}>
                          {suggestion.docType}
                        </div>
                      </div>
                      <div className="result-content">
                        <h4 className="result-title" style={{ color: theme.textPrimary }}>
                          {displayName}
                        </h4>
                        <div className="result-meta">
                          <span style={{ color: theme.textMuted }}>📁 {suggestion.subject}</span>
                          <span style={{ color: theme.textMuted }}>🎓 {suggestion.semester}</span>
                        </div>
                      </div>
                      <button
                        className="result-action"
                        onClick={() =>
                          openPaper(
                            suggestion.subject,
                            suggestion.docType,
                            suggestion.url,
                            suggestion.fileName,
                            suggestion.pdfName,
                          )
                        }
                        style={{
                          background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`,
                          color: "white",
                        }}
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
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

export default SearchBox
