"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { Search, X, ChevronDown, FileText, Eye, BookOpen } from "lucide-react"

const SearchBox = ({
  searchInput,
  setSearchInput,
  showSuggestions,
  setShowSuggestions,
  suggestions,
  setSuggestions,
  subjectsData,
  theme,
  user,
  setShowLoginPrompt,
  setHasInteracted,
  isLoadingData,
  dataError,
  totalFiles,
  openPaper,
  showNotification,
  selectedCategory,
  setSelectedCategory,
}) => {
  const searchInputRef = useRef(null)
  const categoryRef = useRef(null)
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

  // Categories for the inline selector
  const categories = [
    { value: "", label: "All" },
    { value: "Syllabus", label: "Syllabus" },
    { value: "Notes", label: "Notes" },
    { value: "Mid Semester", label: "Mid" },
    { value: "End Semester", label: "End" },
  ]

  // Extract year from title
  const extractYear = useCallback((title) => {
    const yearMatch = title.match(/\b(19|20)\d{2}\b/)
    return yearMatch ? yearMatch[0] : ""
  }, [])

  // Helper function to validate URLs
  const isValidUrl = useCallback((url) => {
    if (typeof url !== "string") return false
    const trimmedUrl = url.trim()
    if (trimmedUrl === "" || trimmedUrl === "undefined" || trimmedUrl.toLowerCase() === "null") return false

    return (
      trimmedUrl.includes("http") ||
      trimmedUrl.includes("drive.google.com") ||
      trimmedUrl.includes("docs.google.com") ||
      trimmedUrl.includes("firebasestorage.googleapis.com") ||
      trimmedUrl.startsWith("gs://") ||
      trimmedUrl.includes(".pdf") ||
      trimmedUrl.includes(".doc")
    )
  }, [])

  // Normalize text for better matching
  const normalizeText = useCallback((text) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim()
      .replace(/semester/g, "sem")
      .replace(/\bmid\s*sem\b/g, "midsem")
      .replace(/\bend\s*sem\b/g, "endsem")
  }, [])

  // Get category color scheme
  const getCategoryColors = useCallback(
    (category) => {
      const categoryLower = category.toLowerCase()
      if (categoryLower.includes("mid semester") || categoryLower.includes("midsem")) {
        return { bg: "#3B82F620", border: "#3B82F6", badge: "#3B82F6" } // Blue
      } else if (categoryLower.includes("end semester") || categoryLower.includes("endsem")) {
        return { bg: "#10B98120", border: "#10B981", badge: "#10B981" } // Green
      } else if (categoryLower.includes("notes")) {
        return { bg: "#8B5CF620", border: "#8B5CF6", badge: "#8B5CF6" } // Purple
      } else if (categoryLower.includes("syllabus")) {
        return { bg: "#F59E0B20", border: "#F59E0B", badge: "#F59E0B" } // Orange
      } else if (categoryLower.includes("solution")) {
        return { bg: "#EF444420", border: "#EF4444", badge: "#EF4444" } // Red
      }
      return { bg: theme.primary + "20", border: theme.primary, badge: theme.primary } // Default
    },
    [theme.primary],
  )

  // Improved solution finding function
  const findSolution = useCallback(
    (paperTitle, data, currentSubject) => {
      const normalizedPaperTitle = normalizeText(paperTitle)
      const solutionPattern1 = normalizedPaperTitle + " solution"
      const solutionPattern2 = paperTitle.toLowerCase().trim() + " solution"

      try {
        for (const [semesterKey, semesterData] of Object.entries(data)) {
          if (semesterData && typeof semesterData === "object") {
            for (const [subjectName, subjectData] of Object.entries(semesterData)) {
              if (subjectName !== currentSubject) continue

              if (subjectData && typeof subjectData === "object") {
                for (const [fieldName, fieldValue] of Object.entries(subjectData)) {
                  const normalizedFieldName = normalizeText(fieldName)
                  const cleanFieldName = fieldName.toLowerCase().trim()

                  // Multiple matching patterns
                  const isMatch =
                    normalizedFieldName === solutionPattern1 ||
                    cleanFieldName === solutionPattern2 ||
                    (cleanFieldName.includes("solution") &&
                      (normalizedFieldName.replace(/\s*solution\s*/g, "").trim() === normalizedPaperTitle ||
                        cleanFieldName.replace(/\s*solution\s*/g, "").trim() === paperTitle.toLowerCase().trim()))

                  if (isMatch) {
                    if (fieldValue && typeof fieldValue === "object") {
                      // Handle nested structure
                      for (const [yearKey, url] of Object.entries(fieldValue)) {
                        if (isValidUrl(url)) {
                          return {
                            subject: subjectName,
                            category: fieldName,
                            year: extractYear(yearKey) || extractYear(fieldName) || "Unknown",
                            url: url,
                            fileName: `${subjectName} - ${fieldName} - ${yearKey}`,
                            originalField: fieldName,
                            semester: semesterKey,
                          }
                        }
                      }
                    } else if (isValidUrl(fieldValue)) {
                      // Handle direct URL
                      return {
                        subject: subjectName,
                        category: fieldName,
                        year: extractYear(fieldName) || "Unknown",
                        url: fieldValue,
                        fileName: `${subjectName} - ${fieldName}`,
                        originalField: fieldName,
                        semester: semesterKey,
                      }
                    }
                  }

                  // Also check within nested objects for solution entries
                  if (fieldValue && typeof fieldValue === "object") {
                    for (const [yearKey, url] of Object.entries(fieldValue)) {
                      const normalizedYearKey = normalizeText(yearKey)
                      const cleanYearKey = yearKey.toLowerCase().trim()

                      const isNestedMatch =
                        normalizedYearKey === solutionPattern1 ||
                        cleanYearKey === solutionPattern2 ||
                        (cleanYearKey.includes("solution") &&
                          (normalizedYearKey.replace(/\s*solution\s*/g, "").trim() === normalizedPaperTitle ||
                            cleanYearKey.replace(/\s*solution\s*/g, "").trim() === paperTitle.toLowerCase().trim()))

                      if (isNestedMatch && isValidUrl(url)) {
                        return {
                          subject: subjectName,
                          category: fieldName,
                          year: extractYear(yearKey) || extractYear(fieldName) || "Unknown",
                          url: url,
                          fileName: `${subjectName} - ${fieldName} - ${yearKey}`,
                          originalField: yearKey,
                          semester: semesterKey,
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Error finding solution:", error)
      }
      return null
    },
    [extractYear, isValidUrl, normalizeText],
  )

  const checkSolutionExists = useCallback(
    (paperTitle, data, currentSubject) => {
      const solution = findSolution(paperTitle, data, currentSubject)
      return solution !== null
    },
    [findSolution],
  )

  // Enhanced function to determine if there's searchable data
  const hasSearchableData = useCallback(() => {
    try {
      if (!subjectsData || typeof subjectsData !== "object") {
        return false
      }

      const dataKeys = Object.keys(subjectsData)
      if (dataKeys.length === 0) {
        return false
      }

      let totalValidFiles = 0

      for (const semesterKey of dataKeys) {
        const semesterData = subjectsData[semesterKey]
        if (semesterData && typeof semesterData === "object") {
          const subjects = Object.keys(semesterData)
          for (const subjectName of subjects) {
            const subjectData = semesterData[subjectName]
            if (subjectData && typeof subjectData === "object") {
              Object.entries(subjectData).forEach(([fieldName, fieldValue]) => {
                if (fieldValue && typeof fieldValue === "object") {
                  Object.entries(fieldValue).forEach(([yearKey, url]) => {
                    if (isValidUrl(url)) {
                      totalValidFiles++
                    }
                  })
                } else if (isValidUrl(fieldValue)) {
                  totalValidFiles++
                }
              })
            }
          }
        }
      }

      return totalValidFiles > 0
    } catch (error) {
      console.error("❌ Error checking searchable data:", error)
      return false
    }
  }, [subjectsData, isValidUrl])

  // Improved search function with better deduplication
  const searchInFirestoreData = useCallback(
    (query, data, selectedCategoryFilter) => {
      try {
        const uniqueResultsMap = new Map()
        const searchTerm = query.toLowerCase().trim()
        if (!searchTerm) return []

        Object.entries(data).forEach(([semesterKey, semesterData]) => {
          if (!semesterData || typeof semesterData !== "object") return

          Object.entries(semesterData).forEach(([subjectName, subjectData]) => {
            if (!subjectData || typeof subjectData !== "object") return

            Object.entries(subjectData).forEach(([fieldName, fieldValue]) => {
              // Skip solution entries in main results (they'll be linked to their questions)
              if (fieldName.toLowerCase().includes("solution")) return

              if (fieldValue && typeof fieldValue === "object") {
                const categoryName = fieldName

                Object.entries(fieldValue).forEach(([yearKey, url]) => {
                  if (isValidUrl(url)) {
                    // Skip solution entries in nested results too
                    if (yearKey.toLowerCase().includes("solution")) return

                    // Category filtering
                    if (
                      selectedCategoryFilter &&
                      selectedCategoryFilter.trim() !== "" &&
                      !categoryName.toLowerCase().includes(selectedCategoryFilter.toLowerCase()) &&
                      !selectedCategoryFilter.toLowerCase().includes(categoryName.toLowerCase())
                    ) {
                      return
                    }

                    const subjectLower = subjectName.toLowerCase()
                    const categoryLower = categoryName.toLowerCase()
                    const yearLower = yearKey.toLowerCase()

                    const subjectExact = subjectLower === searchTerm
                    const subjectStartsWith = subjectLower.startsWith(searchTerm)
                    const subjectContains = subjectLower.includes(searchTerm)

                    const categoryExact = categoryLower === searchTerm
                    const categoryStartsWith = categoryLower.startsWith(searchTerm)
                    const categoryContains = categoryLower.includes(searchTerm)

                    const yearExact = yearLower === searchTerm
                    const yearStartsWith = yearLower.startsWith(searchTerm)
                    const yearContains = yearLower.includes(searchTerm)

                    const hasMatch = subjectContains || categoryContains || yearContains

                    if (hasMatch) {
                      // Enhanced relevance scoring: exact match = 10, starts with = 5, contains = 1
                      const subjectScore = subjectExact ? 40 : subjectStartsWith ? 20 : subjectContains ? 4 : 0
                      const categoryScore = categoryExact ? 30 : categoryStartsWith ? 15 : categoryContains ? 3 : 0
                      const yearScore = yearExact ? 20 : yearStartsWith ? 10 : yearContains ? 2 : 0

                      const relevance = subjectScore + categoryScore + yearScore
                      const year = extractYear(yearKey) || extractYear(categoryName) || "Unknown"
                      const hasSolution = checkSolutionExists(categoryName, data, subjectName)

                      // Create unique key for deduplication
                      const uniqueKey = `${subjectName}-${categoryName}-${yearKey}-${url}`

                      const result = {
                        subject: subjectName,
                        category: categoryName,
                        year: year,
                        url: url,
                        fileName: `${subjectName} - ${categoryName} - ${yearKey}`,
                        displayTitle: subjectName,
                        displayCategory: categoryName,
                        displaySubtitle: categoryName,
                        relevance: relevance,
                        semester: semesterKey,
                        originalField: categoryName,
                        isNested: true,
                        hasSolution: hasSolution,
                        colors: getCategoryColors(categoryName),
                        uniqueKey: uniqueKey,
                      }

                      const existingResult = uniqueResultsMap.get(uniqueKey)
                      if (!existingResult || relevance > existingResult.relevance) {
                        uniqueResultsMap.set(uniqueKey, result)
                      }
                    }
                  }
                })
              } else if (isValidUrl(fieldValue)) {
                // Skip solution entries in direct fields too
                if (fieldName.toLowerCase().includes("solution")) return

                let categoryName = fieldName

                const fieldLower = fieldName.toLowerCase()
                if (fieldLower.includes("syllabus")) categoryName = "Syllabus"
                else if (fieldLower.includes("end semester") || fieldLower.includes("endsem"))
                  categoryName = "End Semester"
                else if (fieldLower.includes("mid semester") || fieldLower.includes("midsem"))
                  categoryName = "Mid Semester"
                else if (fieldLower.includes("notes")) categoryName = "Notes"

                // Category filtering
                if (
                  selectedCategoryFilter &&
                  selectedCategoryFilter.trim() !== "" &&
                  !categoryName.toLowerCase().includes(selectedCategoryFilter.toLowerCase()) &&
                  !selectedCategoryFilter.toLowerCase().includes(categoryName.toLowerCase())
                ) {
                  return
                }

                const year = extractYear(fieldName) || "Unknown"

                const subjectLower = subjectName.toLowerCase()
                const fieldNameLower = fieldName.toLowerCase()
                const categoryLower = categoryName.toLowerCase()
                const yearLower = year.toLowerCase()

                const subjectExact = subjectLower === searchTerm
                const subjectStartsWith = subjectLower.startsWith(searchTerm)
                const subjectContains = subjectLower.includes(searchTerm)

                const fieldExact = fieldNameLower === searchTerm
                const fieldStartsWith = fieldNameLower.startsWith(searchTerm)
                const fieldContains = fieldNameLower.includes(searchTerm)

                const categoryExact = categoryLower === searchTerm
                const categoryStartsWith = categoryLower.startsWith(searchTerm)
                const categoryContains = categoryLower.includes(searchTerm)

                const yearExact = yearLower === searchTerm
                const yearStartsWith = yearLower.startsWith(searchTerm)
                const yearContains = yearLower.includes(searchTerm)

                const hasMatch = subjectContains || fieldContains || categoryContains || yearContains

                if (hasMatch) {
                  // Enhanced relevance scoring: exact match = 10, starts with = 5, contains = 1
                  const subjectScore = subjectExact ? 40 : subjectStartsWith ? 20 : subjectContains ? 4 : 0
                  const fieldScore = fieldExact ? 20 : fieldStartsWith ? 10 : fieldContains ? 2 : 0
                  const categoryScore = categoryExact ? 30 : categoryStartsWith ? 15 : categoryContains ? 3 : 0
                  const yearScore = yearExact ? 20 : yearStartsWith ? 10 : yearContains ? 1 : 0

                  const relevance = subjectScore + fieldScore + categoryScore + yearScore
                  const hasSolution = checkSolutionExists(fieldName, data, subjectName)

                  // Create unique key for deduplication
                  const uniqueKey = `${subjectName}-${fieldName}-${fieldValue}`

                  const result = {
                    subject: subjectName,
                    category: categoryName,
                    year: year,
                    url: fieldValue,
                    fileName: `${subjectName} - ${fieldName}`,
                    displayTitle: subjectName,
                    displayCategory: categoryName,
                    displaySubtitle: categoryName,
                    relevance: relevance,
                    semester: semesterKey,
                    originalField: fieldName,
                    isNested: false,
                    hasSolution: hasSolution,
                    colors: getCategoryColors(categoryName),
                    uniqueKey: uniqueKey,
                  }

                  const existingResult = uniqueResultsMap.get(uniqueKey)
                  if (!existingResult || relevance > existingResult.relevance) {
                    uniqueResultsMap.set(uniqueKey, result)
                  }
                }
              }
            })
          })
        })

        // Smart sorting: Mid first, then End, then others, with relevance and year within each group
        const results = Array.from(uniqueResultsMap.values())
          .sort((a, b) => {
            // Priority sorting
            const getPriority = (item) => {
              const cat = item.category.toLowerCase()
              if (cat.includes("mid semester") || cat.includes("midsem")) return 1
              if (cat.includes("end semester") || cat.includes("endsem")) return 2
              return 3
            }

            const priorityA = getPriority(a)
            const priorityB = getPriority(b)

            if (priorityA !== priorityB) return priorityA - priorityB

            if (a.relevance !== b.relevance) return b.relevance - a.relevance

            const yearA = extractYear(a.fileName) || 0
            const yearB = extractYear(b.fileName) || 0

            if (yearA !== yearB) return yearB - yearA // Recent years first

            return a.fileName.localeCompare(b.fileName)
          })
          .slice(0, 50)

        return results
      } catch (error) {
        console.error("❌ Error in search function:", error)
        return []
      }
    },
    [extractYear, checkSolutionExists, getCategoryColors, isValidUrl],
  )

  const handleSearchFocus = () => {
    if (!user) {
      setShowLoginPrompt(true)
      setHasInteracted(true)
      return
    }
    setIsSearchActive(true)
    document.body.style.overflow = "hidden"
  }

  const handleSearchInput = (e) => {
    if (!user) {
      setShowLoginPrompt(true)
      setHasInteracted(true)
      return
    }

    const input = e.target.value
    setSearchInput(input)

    if (input && input.trim() && hasSearchableData()) {
      const results = searchInFirestoreData(input, subjectsData, selectedCategory)
      setSuggestions(results)
      setShowSuggestions(results.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleCategorySelect = (categoryValue) => {
    if (!user) {
      setShowLoginPrompt(true)
      setHasInteracted(true)
      return
    }
    setSelectedCategory(categoryValue)
    setShowCategoryDropdown(false)
  }

  const handleOpenPaper = (suggestion) => {
    if (!user) {
      setShowLoginPrompt(true)
      setHasInteracted(true)
      return
    }

    if (suggestion && suggestion.url) {
      try {
        const previewUrl = getPreviewLink(suggestion.url)
        const fileUrl = encodeURIComponent(previewUrl)
        const fileTitle = encodeURIComponent(suggestion.fileName)
        const viewerUrl = `/viewer?url=${fileUrl}&title=${fileTitle}`

        const newWindow = window.open(viewerUrl, "_blank")
        if (newWindow) {
          showNotification(`📖 Opening: ${suggestion.originalField || suggestion.fileName}`, "success")
        } else {
          showNotification("❌ Popup blocked. Please allow popups and try again.", "error")
        }
      } catch (error) {
        console.error("❌ Error opening PDF:", error)
        showNotification("❌ Error opening PDF. Please try again.", "error")
      }
    }
  }

  const handleOpenSolution = (suggestion) => {
    if (!user) {
      setShowLoginPrompt(true)
      setHasInteracted(true)
      return
    }

    try {
      // Find the solution for this paper
      const solutionData = findSolution(suggestion.originalField, subjectsData, suggestion.subject)

      if (solutionData && solutionData.url && isValidUrl(solutionData.url)) {
        const previewUrl = getPreviewLink(solutionData.url)
        const fileUrl = encodeURIComponent(previewUrl)
        const fileTitle = encodeURIComponent(solutionData.fileName)
        const viewerUrl = `/viewer?url=${fileUrl}&title=${fileTitle}`

        const newWindow = window.open(viewerUrl, "_blank")
        if (newWindow) {
          showNotification(`📖 Opening Solution: ${solutionData.originalField}`, "success")
        } else {
          showNotification("❌ Popup blocked. Please allow popups and try again.", "error")
        }
      } else {
        showNotification("❌ Solution not found or unavailable.", "error")
      }
    } catch (error) {
      console.error("❌ Error opening solution:", error)
      showNotification("❌ Error opening solution. Please try again.", "error")
    }
  }

  const getPreviewLink = (fullUrl) => {
    try {
      const driveMatch = fullUrl.match(/(?:id=|\/d\/)([-\w]{25,})/)
      if (driveMatch) {
        const fileId = driveMatch[1]
        return `https://drive.google.com/file/d/${fileId}/preview`
      }
      return fullUrl
    } catch (error) {
      console.error("❌ Error processing URL:", error)
      return fullUrl
    }
  }

  const clearSearch = () => {
    setSearchInput("")
    setSuggestions([])
    setShowSuggestions(false)
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  const clearCategory = () => {
    setSelectedCategory("")
  }

  const closeSearch = () => {
    setSearchInput("")
    setSuggestions([])
    setShowSuggestions(false)
    setIsSearchActive(false)
    setShowCategoryDropdown(false)
    document.body.style.overflow = "auto"
    if (searchInputRef.current) {
      searchInputRef.current.blur()
    }
  }

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isSearchActive) {
        closeSearch()
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isSearchActive])

  // Handle click outside for category dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setShowCategoryDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  // Re-run search when category changes
  useEffect(() => {
    if (searchInput && searchInput.trim() && hasSearchableData()) {
      const results = searchInFirestoreData(searchInput, subjectsData, selectedCategory)
      setSuggestions(results)
      setShowSuggestions(results.length > 0)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [selectedCategory, searchInput, subjectsData, hasSearchableData, searchInFirestoreData])

  const selectedCategoryLabel = categories.find((cat) => cat.value === selectedCategory)?.label || "All"

  return (
    <>
      {/* Original Search Section - Shows when not active */}
      {!isSearchActive && (
        <div className="search-section">
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
              placeholder="Search here"
              value={searchInput}
              onChange={handleSearchInput}
              onFocus={handleSearchFocus}
              className="search-input"
              disabled={!hasSearchableData() || isLoadingData}
              style={{
                color: hasSearchableData() ? theme.textPrimary : theme.textMuted,
                background: "transparent",
                cursor: hasSearchableData() && !isLoadingData ? "text" : "not-allowed",
              }}
            />
          </div>
        </div>
      )}

      {/* Active Search Interface with Results at Top and Search Bar at Bottom */}
      {isSearchActive && (
        <>
          <div className="search-overlay-background" />

          <div className="inverted-search-container">
            {/* Results Section at Top */}
            <div className="results-section-top">
              {showSuggestions && suggestions.length > 0 && (
                <div className="results-grid-top">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={suggestion.uniqueKey || `${suggestion.url}-${index}`}
                      className="result-card-top"
                      style={{
                        background: suggestion.colors.bg,
                        borderColor: suggestion.colors.border,
                      }}
                    >
                      <div className="result-card-content-top">
                        <div className="result-card-header-top">
                          <div className="result-card-icon-top" style={{ color: suggestion.colors.border }}>
                            <FileText size={20} />
                          </div>
                          {suggestion.year && suggestion.year !== "Unknown" && (
                            <div
                              className="result-card-badge-top"
                              style={{
                                background: suggestion.colors.badge,
                                color: "white",
                              }}
                            >
                              {suggestion.year}
                            </div>
                          )}
                        </div>

                        <div className="result-card-body-top">
                          <h3 className="result-card-title-top" style={{ color: theme.textPrimary }}>
                            {suggestion.displayTitle}
                          </h3>
                          <p className="result-card-category-top" style={{ color: theme.textMuted }}>
                            {suggestion.displaySubtitle}
                          </p>
                        </div>

                        <div className="result-card-actions-top">
                          <button
                            className="action-button-top"
                            onClick={() => handleOpenPaper(suggestion)}
                            style={{
                              background: `${suggestion.colors.border}20`,
                              color: suggestion.colors.border,
                            }}
                          >
                            <Eye size={16} />
                            <span>View Paper</span>
                          </button>

                          {suggestion.hasSolution && (
                            <button
                              className="action-button-top solution-button"
                              onClick={() => handleOpenSolution(suggestion)}
                              style={{
                                background: `${suggestion.colors.border}20`,
                                color: suggestion.colors.border,
                              }}
                            >
                              <BookOpen size={16} />
                              <span>View Solution</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No Results */}
              {searchInput && (!suggestions || suggestions.length === 0) && (
                <div className="no-results-top" style={{ color: theme.textMuted }}>
                  <Search size={48} style={{ opacity: 0.3 }} />
                  <h3>No results found</h3>
                  <p>Try different keywords or adjust your filter</p>
                </div>
              )}

              {/* Search Hint */}
              {!searchInput && (
                <div className="search-hint-top" style={{ color: theme.textMuted }}>
                  <Search size={48} style={{ opacity: 0.3 }} />
                  <h3>Start typing to search</h3>
                  <p>Search by subject short name</p>
                </div>
              )}
            </div>

            {/* Search Bar at Bottom */}
            <div className="search-bar-bottom">
              <div
                className="search-box-bottom"
                style={{
                  background: theme.cardBg,
                  borderColor: theme.primary,
                }}
              >
                {/* Search Icon */}
                <div className="search-icon">
                  <Search size={20} color={theme.primary} />
                </div>

                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search materials..."
                  value={searchInput}
                  onChange={handleSearchInput}
                  className="search-input-bottom"
                  style={{
                    color: theme.textPrimary,
                    background: "transparent",
                  }}
                  autoFocus
                />

                {/* Clear Button */}
                {searchInput && (
                  <button className="clear-button-bottom" onClick={clearSearch} style={{ color: theme.textMuted }}>
                    <X size={16} />
                  </button>
                )}

                {/* Category Selector */}
                <div className="category-selector-bottom" ref={categoryRef}>
                  <button
                    className="category-button-bottom"
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    style={{
                      color: theme.primary,
                      background: `${theme.primary}15`,
                      borderColor: theme.primary,
                    }}
                  >
                    <span>{selectedCategoryLabel}</span>
                    {selectedCategory && (
                      <button
                        className="clear-category-button"
                        onClick={(e) => {
                          e.stopPropagation()
                          clearCategory()
                        }}
                        style={{ color: theme.primary }}
                      >
                        <X size={12} />
                      </button>
                    )}
                    <ChevronDown size={14} className={`chevron ${showCategoryDropdown ? "open" : ""}`} />
                  </button>

                  {showCategoryDropdown && (
                    <div
                      className="category-dropdown-bottom"
                      style={{
                        background: theme.cardBg,
                        borderColor: theme.border,
                        boxShadow: theme.shadow,
                      }}
                    >
                      {categories.map((category) => (
                        <button
                          key={category.value}
                          className={`category-option-bottom ${selectedCategory === category.value ? "selected" : ""}`}
                          onClick={() => handleCategorySelect(category.value)}
                          style={{
                            color: selectedCategory === category.value ? theme.primary : theme.textPrimary,
                            background: selectedCategory === category.value ? `${theme.primary}15` : "transparent",
                          }}
                        >
                          {category.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Close Button */}
                <button className="close-button-bottom" onClick={closeSearch} style={{ color: theme.textMuted }}>
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        /* Original Search Section */
        .search-section {
          width: 100%;
          max-width: 800px;
          margin: 0 auto 30px auto;
          padding: 0 20px;
          position: relative;
          z-index: 10;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border: 2px solid;
          border-radius: 16px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .search-box:focus-within {
          border-color: ${theme.primary};
          box-shadow: 0 0 0 4px ${theme.primary}20;
        }

        .search-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }

        .search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 16px;
          font-weight: 500;
          background: transparent;
        }

        .search-input::placeholder {
          color: ${theme.textMuted};
        }

        /* Active Search Interface */
        .search-overlay-background {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(20px);
          z-index: 9997;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .inverted-search-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Results Section at Top */
        .results-section-top {
          flex: 1;
          overflow-y: auto;
          padding: 40px 20px 20px;
          max-width: 1000px;
          margin: 0 auto;
          width: 100%;
        }

        .results-grid-top {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 16px;
          margin-bottom: 20px;
        }

        .result-card-top {
          border: 2px solid;
          border-radius: 12px;
          backdrop-filter: blur(20px);
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .result-card-top:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .result-card-content-top {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-height: 140px;
        }

        .result-card-header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .result-card-icon-top {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.1);
        }

        .result-card-badge-top {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .result-card-body-top {
          flex: 1;
        }

        .result-card-title-top {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 8px 0;
          line-height: 1.3;
        }

        .result-card-category-top {
          font-size: 14px;
          margin: 0;
          opacity: 0.8;
        }

        .result-card-actions-top {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .action-button-top {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border: none;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          flex: 1;
          min-width: 100px;
          justify-content: center;
        }

        .action-button-top:hover {
          transform: translateY(-1px);
          opacity: 0.9;
        }

        .no-results-top,
        .search-hint-top {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 60px 20px;
          max-width: 400px;
          margin: 0 auto;
        }

        .no-results-top h3,
        .search-hint-top h3 {
          font-size: 24px;
          font-weight: 700;
          margin: 16px 0 8px 0;
          color: ${theme.textPrimary};
        }

        .no-results-top p,
        .search-hint-top p {
          font-size: 16px;
          margin: 0 0 8px 0;
        }

        /* Search Bar at Bottom */
        .search-bar-bottom {
          padding: 20px;
          max-width: 700px;
          margin: 0 auto;
          width: 100%;
        }

        .search-box-bottom {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border: 2px solid;
          border-radius: 50px;
          backdrop-filter: blur(20px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .search-input-bottom {
          flex: 1;
          border: none;
          outline: none;
          font-size: 16px;
          font-weight: 500;
          background: transparent;
          min-width: 0;
        }

        .search-input-bottom::placeholder {
          color: ${theme.textMuted};
        }

        .clear-button-bottom,
        .close-button-bottom {
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 50%;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .clear-button-bottom:hover,
        .close-button-bottom:hover {
          background: ${theme.primary}20;
        }

        /* Category Selector */
        .category-selector-bottom {
          position: relative;
          flex-shrink: 0;
        }

        .category-button-bottom {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: 1px solid;
          border-radius: 25px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          text-align: left;
          transition: all 0.2s ease;
          border-bottom: 1px solid ${theme.border};
        }

        .category-button-bottom:hover {
          background: ${theme.primary}10 !important;
        }

        .clear-category-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 2px;
          border-radius: 50%;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .clear-category-button:hover {
          background: ${theme.primary}30;
        }

        .chevron {
          transition: transform 0.2s ease;
        }

        .chevron.open {
          transform: rotate(180deg);
        }

        .category-dropdown-bottom {
          position: absolute;
          bottom: calc(100% + 8px);
          right: 0;
          min-width: 140px;
          border: 1px solid;
          border-radius: 12px;
          backdrop-filter: blur(20px);
          z-index: 10000;
          overflow: hidden;
        }

        .category-option-bottom {
          width: 100%;
          padding: 12px 16px;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          text-align: left;
          transition: all 0.2s ease;
          border-bottom: 1px solid ${theme.border};
        }

        .category-option-bottom:last-child {
          border-bottom: none;
        }

        .category-option-bottom:hover {
          background: ${theme.primary}10 !important;
        }

        .category-option-bottom.selected {
          font-weight: 600;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .search-section {
            padding: 0 16px;
            margin-bottom: 20px;
          }

          .results-section-top {
            padding: 20px 16px;
          }

          .search-bar-bottom {
            padding: 16px;
          }

          .search-box-bottom {
            padding: 12px 16px;
            gap: 10px;
          }

          .search-input-bottom {
            font-size: 14px;
          }

          .category-button-bottom {
            padding: 6px 12px;
            font-size: 12px;
          }

          .results-grid-top {
            grid-template-columns: 1fr;
          }

          .result-card-content-top {
            padding: 16px;
            min-height: 120px;
          }

          .result-card-title-top {
            font-size: 16px;
          }

          .action-button-top {
            font-size: 11px;
            padding: 6px 10px;
          }
        }

        /* Custom Scrollbar */
        .results-section-top::-webkit-scrollbar {
          width: 6px;
        }

        .results-section-top::-webkit-scrollbar-track {
          background: transparent;
        }

        .results-section-top::-webkit-scrollbar-thumb {
          background: ${theme.primary}40;
          border-radius: 3px;
        }

        .results-section-top::-webkit-scrollbar-thumb:hover {
          background: ${theme.primary}60;
        }
      `}</style>
    </>
  )
}

export default SearchBox
