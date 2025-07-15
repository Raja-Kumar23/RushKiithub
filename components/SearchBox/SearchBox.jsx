"use client"

import { useRef, useEffect } from "react"
import { Search, RefreshCw, History, X } from "lucide-react"
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
  setHasInteracted, // Receive setHasInteracted prop
}) => {
  const searchInputRef = useRef(null)
  const suggestionsRef = useRef(null)

  const matchesCategory = (docName, categoryType) => {
    if (!categoryType) return true
    docName = docName.toLowerCase()
    switch (categoryType.toLowerCase()) {
      case "syllabus":
        return docName.includes("syllabus")
      case "notes":
        return docName.includes("notes")
      case "midsem":
        return docName.includes("mid")
      case "endsem":
        return docName.includes("end")
      default:
        return true
    }
  }

  const handleSearchInput = (e) => {
    // Simple authentication check
    if (!user) {
      setShowLoginPrompt(true)
      setHasInteracted(true) // Mark user interaction
      return
    }
    const input = e.target.value.toLowerCase().trim()
    setSearchInput(input)
    if (!input) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    const inputWords = input.split(" ")
    const categoryType = selectedCategory
    console.log("Search input:", input)
    console.log("Selected category:", categoryType)
    console.log("Subjects data:", subjectsData)
    // Search through all semester data
    const matchedSuggestions = []

    Object.entries(subjectsData).forEach(([semesterKey, semesterData]) => {
      if (typeof semesterData === "object" && semesterData !== null) {
        Object.entries(semesterData).forEach(([subject, subjectData]) => {
          if (typeof subjectData === "object" && subjectData !== null) {
            Object.entries(subjectData).forEach(([docType, url]) => {
              const subjectMatch = subject.toLowerCase().includes(inputWords[0])
              const docTypeMatch = inputWords.length > 1 ? docType.toLowerCase().includes(inputWords[1]) : true
              const categoryMatch = matchesCategory(docType, categoryType)

              console.log(`Checking ${subject} - ${docType}:`, {
                subjectMatch,
                docTypeMatch,
                categoryMatch,
                finalMatch: subjectMatch && docTypeMatch && categoryMatch,
              })

              if (subjectMatch && docTypeMatch && categoryMatch) {
                matchedSuggestions.push({
                  subject,
                  year: docType,
                  semester: semesterKey,
                  url: url,
                })
              }
            })
          }
        })
      }
    })
    console.log("Matched suggestions:", matchedSuggestions)
    setSuggestions(matchedSuggestions)
    setShowSuggestions(matchedSuggestions.length > 0)
  }

  const openPaper = (subject, year, url) => {
    // Simple authentication check
    if (!user) {
      setShowLoginPrompt(true)
      setHasInteracted(true) // Mark user interaction
      return
    }
    if (url && url.startsWith("http")) {
      // Real Firebase URL - open in new tab
      const previewUrl = getPreviewLink(url)
      const encodedUrl = encodeURIComponent(previewUrl)
      const fileTitle = encodeURIComponent(`${year} - ${subject}`)
      window.open(`/viewer?url=${encodedUrl}&title=${fileTitle}`, "_blank")
    } else {
      // Sample data - show notification
      alert(`Opening: ${subject} - ${year}\n\nThis is sample data. Real files will open when connected to Firebase.`)
    }

    storeSearch(`${subject} - ${year}`)
    setShowSuggestions(false)
    setSearchInput("")
  }

  const getPreviewLink = (fullUrl) => {
    const match = fullUrl.match(/(?:id=|\/d\/)([-\w]{25,})/)
    return match ? `https://drive.google.com/file/d/${match[1]}/preview` : fullUrl
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

  return (
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
            placeholder="Search for subjects, notes, papers..."
            value={searchInput}
            onChange={handleSearchInput}
            className="search-input"
            style={{
              color: theme.textPrimary,
              background: "transparent",
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
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="suggestions-dropdown"
            style={{
              background: theme.cardBg,
              borderColor: theme.border,
              boxShadow: theme.shadow,
            }}
          >
            <div className="suggestions-header" style={{ color: theme.textMuted }}>
              <History size={14} />
              Search Results ({suggestions.length})
            </div>

            {suggestions.slice(0, 8).map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-item"
                onClick={() => openPaper(suggestion.subject, suggestion.year, suggestion.url)}
                style={{ color: theme.textPrimary }}
              >
                <div className="suggestion-content">
                  <span className="suggestion-subject">{suggestion.subject}</span>
                  <span className="suggestion-year" style={{ color: theme.textMuted }}>
                    {suggestion.year} • {suggestion.semester}
                  </span>
                </div>
                <div className="suggestion-arrow" style={{ color: theme.primary }}>
                  →
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchBox
