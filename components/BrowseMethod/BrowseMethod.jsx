"use client"

import { useState } from "react"
import { ChevronRight, ArrowLeft, Eye, BookOpen, FileText, CheckCircle } from "lucide-react"

const BrowseMethod = ({
  subjectsData,
  theme,
  user,
  setShowLoginPrompt,
  showNotification,
  setHasInteracted,
  openPaper,
}) => {
  const [selectedSemester, setSelectedSemester] = useState(null)
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)

  // Enhanced semester mapping to handle both cases
  const semesterMapping = {
    // Lowercase (for backward compatibility)
    first: { name: "1st Semester", number: "1", key: "first" },
    second: { name: "2nd Semester", number: "2", key: "second" },
    third: { name: "3rd Semester", number: "3", key: "third" },
    fourth: { name: "4th Semester", number: "4", key: "fourth" },
    fifth: { name: "5th Semester", number: "5", key: "fifth" },
    sixth: { name: "6th Semester", number: "6", key: "sixth" },
    seventh: { name: "7th Semester", number: "7", key: "seventh" },
    routine: { name: "Routine & Schedule", number: "📅", key: "routine" },
    // Capitalized (current Firestore structure)
    First: { name: "1st Semester", number: "1", key: "First" },
    Second: { name: "2nd Semester", number: "2", key: "Second" },
    Third: { name: "3rd Semester", number: "3", key: "Third" },
    Fourth: { name: "4th Semester", number: "4", key: "Fourth" },
    Fifth: { name: "5th Semester", number: "5", key: "Fifth" },
    Sixth: { name: "6th Semester", number: "6", key: "Sixth" },
    Seventh: { name: "7th Semester", number: "7", key: "Seventh" },
    Routine: { name: "Routine & Schedule", number: "📅", key: "Routine" },
  }

  const isSolutionField = (fieldName) => {
    const lowerName = fieldName.toLowerCase()
    return (
      lowerName.includes("solution") ||
      lowerName.includes("answer") ||
      lowerName.includes("key") ||
      lowerName.includes("solved") ||
      lowerName.endsWith("_sol") ||
      lowerName.endsWith("_solution")
    )
  }

  const getPaperSolutionPairs = (subjectData) => {
    const pairs = []
    const processedFields = new Set()

    Object.entries(subjectData).forEach(([fieldName, fieldValue]) => {
      if (
        processedFields.has(fieldName) ||
        !fieldValue ||
        typeof fieldValue !== "string" ||
        fieldValue.trim() === "" ||
        fieldValue === "undefined" ||
        fieldValue.toLowerCase() === "null" ||
        (!fieldValue.includes("http") && !fieldValue.includes("drive.google.com"))
      ) {
        return
      }

      const isSolution = isSolutionField(fieldName)

      if (isSolution) {
        // This is a solution, try to find its corresponding paper
        const baseName = fieldName
          .toLowerCase()
          .replace(/[_\s]*(solution|answer|key|solved|sol)s?[_\s]*$/i, "")
          .trim()

        // Look for corresponding paper
        const paperField = Object.keys(subjectData).find((key) => {
          const keyLower = key.toLowerCase()
          const keyBase = keyLower.replace(/[_\s]*(paper|question|exam)s?[_\s]*$/i, "").trim()
          return keyBase === baseName && !isSolutionField(key) && key !== fieldName
        })

        if (paperField && subjectData[paperField]) {
          pairs.push({
            baseName: baseName || fieldName.replace(/[_\s]*(solution|answer|key|solved|sol)s?[_\s]*$/i, ""),
            paperField,
            paperUrl: subjectData[paperField],
            solutionField: fieldName,
            solutionUrl: fieldValue,
            displayName: paperField,
            type: getCategoryType(paperField),
            icon: getCategoryIcon(paperField),
          })
          processedFields.add(paperField)
          processedFields.add(fieldName)
        } else {
          // Solution without corresponding paper
          pairs.push({
            baseName: baseName || fieldName,
            paperField: null,
            paperUrl: null,
            solutionField: fieldName,
            solutionUrl: fieldValue,
            displayName: fieldName,
            type: getCategoryType(fieldName),
            icon: getCategoryIcon(fieldName),
          })
          processedFields.add(fieldName)
        }
      } else {
        // This is a paper, check if it has a solution
        const baseName = fieldName
          .toLowerCase()
          .replace(/[_\s]*(paper|question|exam)s?[_\s]*$/i, "")
          .trim()

        const solutionField = Object.keys(subjectData).find((key) => {
          if (!isSolutionField(key)) return false
          const keyBase = key
            .toLowerCase()
            .replace(/[_\s]*(solution|answer|key|solved|sol)s?[_\s]*$/i, "")
            .trim()
          return keyBase === baseName
        })

        pairs.push({
          baseName: baseName || fieldName,
          paperField: fieldName,
          paperUrl: fieldValue,
          solutionField: solutionField || null,
          solutionUrl: solutionField ? subjectData[solutionField] : null,
          displayName: fieldName,
          type: getCategoryType(fieldName),
          icon: getCategoryIcon(fieldName),
        })
        processedFields.add(fieldName)
        if (solutionField) processedFields.add(solutionField)
      }
    })

    return pairs
  }

  const getCategoryType = (fieldName) => {
    const lowerName = fieldName.toLowerCase()
    if (lowerName.includes("syllabus")) return "Syllabus"
    if (lowerName.includes("end semester") || lowerName.includes("end sem")) return "End Semester"
    if (lowerName.includes("mid semester") || lowerName.includes("mid sem")) return "Mid Semester"
    if (lowerName.includes("notes")) return "Notes"
    return "Other"
  }

  const getCategoryIcon = (fieldName) => {
    const lowerName = fieldName.toLowerCase()
    if (lowerName.includes("syllabus")) return "📋"
    if (lowerName.includes("end semester") || lowerName.includes("end sem")) return "📝"
    if (lowerName.includes("mid semester") || lowerName.includes("mid sem")) return "📄"
    if (lowerName.includes("notes")) return "📚"
    return "📄"
  }

  // Fixed function to get available semesters - handles flat structure
  const getAvailableSemesters = () => {
    try {
      const availableSemesters = []

      if (!subjectsData || typeof subjectsData !== "object") {
        
        return availableSemesters
      }

      const dataKeys = Object.keys(subjectsData)
      

      dataKeys.forEach((key) => {
        const semesterData = subjectsData[key]

        if (semesterData && typeof semesterData === "object") {
          const semesterNumber = extractSemesterNumber(key)
          if (semesterNumber !== null) {
            availableSemesters.push({
              key,
              name: key,
              number: semesterNumber,
              isRoutine: key.toLowerCase().includes("routine"),
            })
          }
        }
      })

      // Sort semesters: regular semesters first (ascending), then routine
      availableSemesters.sort((a, b) => {
        if (a.isRoutine && !b.isRoutine) return 1
        if (!a.isRoutine && b.isRoutine) return -1
        return a.number - b.number // Ascending order: 1st, 2nd, 3rd, etc.
      })

     
      return availableSemesters
    } catch (error) {
      console.error("❌ Error getting available semesters:", error)
      return []
    }
  }

  // Fixed function to get subjects for a semester - simplified to show only names
  const getSubjectsForSemester = (semesterKey) => {
    try {
      const semesterData = subjectsData[semesterKey] || {}
      

      const subjects = Object.entries(semesterData)
        .map(([subjectName, subjectData]) => {
          if (!subjectData || typeof subjectData !== "object") {
           
            return null
          }

          let hasValidFiles = false

          // Check if subject has any valid files
          Object.entries(subjectData).forEach(([fieldName, fieldValue]) => {
            if (
              typeof fieldValue === "string" &&
              fieldValue.trim() !== "" &&
              fieldValue !== "undefined" &&
              fieldValue.toLowerCase() !== "null" &&
              (fieldValue.includes("http") || fieldValue.includes("drive.google.com"))
            ) {
              hasValidFiles = true
            }
          })

          if (hasValidFiles) {
            
            return {
              name: subjectName,
              data: subjectData,
            }
          } else {
            
            return null
          }
        })
        .filter((subject) => subject !== null)

     
      return subjects
    } catch (error) {
     
      return []
    }
  }

  const getCategoriesForSubject = (semesterKey, subjectName) => {
    try {
      const semesterData = subjectsData[semesterKey] || {}
      const subjectData = semesterData[subjectName] || {}

     

      const pairs = getPaperSolutionPairs(subjectData)

      // Sort pairs by type, then alphabetically
      const sortedPairs = pairs.sort((a, b) => {
        const categoryOrder = { Syllabus: 1, Notes: 2, "Mid Semester": 3, "End Semester": 4, Other: 5 }
        const aOrder = categoryOrder[a.type] || 5
        const bOrder = categoryOrder[b.type] || 5

        if (aOrder !== bOrder) {
          return aOrder - bOrder
        }

        return a.displayName.localeCompare(b.displayName)
      })

      
      return sortedPairs
    } catch (error) {
     
      return []
    }
  }

  const handleOpenPaper = (subject, pair, type = "paper") => {
    if (!user) {
      setShowLoginPrompt(true)
      if (setHasInteracted) setHasInteracted(true)
      return
    }

    let url, title
    if (type === "solution" && pair.solutionUrl) {
      url = pair.solutionUrl
      title = `${subject} - ${pair.displayName} (Solution)`
    } else if (pair.paperUrl) {
      url = pair.paperUrl
      title = `${subject} - ${pair.displayName}`
    } else {
      showNotification("❌ File not available", "error")
      return
    }

  
    const previewUrl = getPreviewLink(url)
    const fileUrl = encodeURIComponent(previewUrl)
    const fileTitle = encodeURIComponent(title)
    window.open(`/viewer?url=${fileUrl}&title=${fileTitle}`, "_blank")
    showNotification(`📖 Opening: ${title}`, "success")
  }

  // Helper function to get preview link
  const getPreviewLink = (fullUrl) => {
    const match = fullUrl.match(/(?:id=|\/d\/)([-\w]{25,})/)
    if (match) {
      
      return `https://drive.google.com/file/d/${match[1]}/preview`
    }
   
    return fullUrl
  }

  const goBack = () => {
    if (selectedCategory) {
      setSelectedCategory(null)
    } else if (selectedSubject) {
      setSelectedSubject(null)
    } else if (selectedSemester) {
      setSelectedSemester(null)
    }
  }

  const resetSelection = () => {
    setSelectedSemester(null)
    setSelectedSubject(null)
    setSelectedCategory(null)
  }

  const getCategoryTypesForSubject = (semesterKey, subjectName) => {
    try {
      const pairs = getCategoriesForSubject(semesterKey, subjectName)
      const uniqueTypes = {}

      pairs.forEach((pair) => {
        if (!uniqueTypes[pair.type]) {
          uniqueTypes[pair.type] = {
            type: pair.type,
            icon: pair.icon,
            count: 0,
          }
        }
        uniqueTypes[pair.type].count++
      })

      // Sort by the predefined order
      const categoryOrder = { Syllabus: 1, Notes: 2, "Mid Semester": 3, "End Semester": 4, Other: 5 }

      return Object.values(uniqueTypes).sort((a, b) => {
        const aOrder = categoryOrder[a.type] || 5
        const bOrder = categoryOrder[b.type] || 5
        return aOrder - bOrder
      })
    } catch (error) {
      
      return []
    }
  }

  const getFilesForCategoryType = (semesterKey, subjectName, categoryType) => {
    try {
      const semesterData = subjectsData[semesterKey]
      if (!semesterData || !semesterData[subjectName]) {
        return []
      }

      const subjectData = semesterData[subjectName]
      const pairs = getPaperSolutionPairs(subjectData)

      const sortedPairs = pairs
        .filter((pair) => pair.type === categoryType)
        .sort((a, b) => {
          // First, sort by year (newest first)
          const yearA = extractYearFromFilename(a.displayName)
          const yearB = extractYearFromFilename(b.displayName)

          if (yearA !== yearB) {
            return yearB - yearA // Descending order: 2025, 2024, 2023, etc.
          }

          // If years are the same (or no year found), sort alphabetically
          return a.displayName.localeCompare(b.displayName)
        })

    
      return sortedPairs
    } catch (error) {
      console.error("❌ Error getting files for category:", error)
      return []
    }
  }

  const extractSemesterNumber = (key) => {
    const lowerKey = key.toLowerCase()
    const match = lowerKey.match(/(first|second|third|fourth|fifth|sixth|seventh)/)
    if (match) {
      const semesterName = match[1]
      return semesterMapping[semesterName]?.number || null
    }
    return null
  }

  const extractYearFromFilename = (filename) => {
    // Look for 4-digit years (2020-2030 range)
    const yearMatch = filename.match(/20[2-3][0-9]/)
    return yearMatch ? Number.parseInt(yearMatch[0]) : 0
  }

  const availableSemesters = getAvailableSemesters()

  return (
    <>
      <div className="browse-container">
        {/* Header */}
        <div className="browse-header">
          <div className="header-icon">
            <BookOpen size={32} />
          </div>
          <h2>Browse Study Materials</h2>
          <p>Navigate through your organized study materials with papers and solutions</p>
        </div>

        {/* Navigation */}
        {(selectedSemester || selectedSubject || selectedCategory) && (
          <div className="navigation-bar">
            <button onClick={goBack} className="back-btn">
              <ArrowLeft size={18} />
              Back
            </button>
            <div className="breadcrumb">
              <button onClick={resetSelection}>Home</button>
              {selectedSemester && (
                <>
                  <ChevronRight size={16} />
                  <button
                    onClick={() => {
                      setSelectedSubject(null)
                      setSelectedCategory(null)
                    }}
                  >
                    {availableSemesters.find((s) => s.key === selectedSemester)?.name}
                  </button>
                </>
              )}
              {selectedSubject && (
                <>
                  <ChevronRight size={16} />
                  <button onClick={() => setSelectedCategory(null)}>{selectedSubject}</button>
                </>
              )}
              {selectedCategory && (
                <>
                  <ChevronRight size={16} />
                  <span>{selectedCategory}</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 1: Select Semester */}
        {!selectedSemester && (
          <div className="step-container">
            <div className="step-header">
              <div className="step-number">1</div>
              <h3>Choose Your Semester</h3>
            </div>
            {availableSemesters.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h4>No study materials found</h4>
                <p>Please add study materials to your Cloud Firestore to start browsing.</p>
              </div>
            ) : (
              <div className="semester-grid">
                {availableSemesters.map((semester) => (
                  <button
                    key={semester.key}
                    className="semester-card"
                    onClick={() => setSelectedSemester(semester.key)}
                  >
                    <div className="semester-number">{semester.number}</div>
                    <div className="semester-info">
                      <h4>{semester.name}</h4>
                    </div>
                    <ChevronRight size={20} className="arrow-icon" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select Subject */}
        {selectedSemester && !selectedSubject && (
          <div className="step-container">
            <div className="step-header">
              <div className="step-number">2</div>
              <h3>Choose Your Subject</h3>
            </div>
            <div className="subject-grid">
              {getSubjectsForSemester(selectedSemester).map((subject) => (
                <button key={subject.name} className="subject-card" onClick={() => setSelectedSubject(subject.name)}>
                  <div className="subject-icon">📚</div>
                  <div className="subject-info">
                    <h4>{subject.name}</h4>
                  </div>
                  <ChevronRight size={20} className="arrow-icon" />
                </button>
              ))}
            </div>
            {getSubjectsForSemester(selectedSemester).length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">📚</div>
                <h4>No subjects found</h4>
                <p>This semester doesn't have any valid study materials yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Select Material Type */}
        {selectedSemester && selectedSubject && !selectedCategory && (
          <div className="step-container">
            <div className="step-header">
              <div className="step-number">3</div>
              <h3>Choose Material Type</h3>
            </div>
            <div className="category-grid">
              {getCategoryTypesForSubject(selectedSemester, selectedSubject).map((categoryType, index) => (
                <button
                  key={`${categoryType.type}-${index}`}
                  className="category-card"
                  onClick={() => setSelectedCategory(categoryType.type)}
                >
                  <div className="category-icon">{categoryType.icon}</div>
                  <div className="category-info">
                    <h4>{categoryType.type}</h4>
                    <p>
                      {categoryType.count} file{categoryType.count !== 1 ? "s" : ""} available
                    </p>
                  </div>
                </button>
              ))}
            </div>
            {getCategoryTypesForSubject(selectedSemester, selectedSubject).length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">📄</div>
                <h4>No materials found</h4>
                <p>No study materials available for this subject.</p>
              </div>
            )}
          </div>
        )}

        {selectedSemester && selectedSubject && selectedCategory && (
          <div className="step-container">
            <div className="step-header">
              <div className="step-number">4</div>
              <h3>Select Files</h3>
              <p className="step-subtitle">
                {selectedCategory} materials for {selectedSubject}
              </p>
            </div>
            <div className="files-grid">
              {getFilesForCategoryType(selectedSemester, selectedSubject, selectedCategory).map((pair, index) => (
                <div key={`${pair.displayName}-${index}`} className="file-card-container">
                  <div className="file-card">
                    <div className="file-icon">{pair.icon}</div>
                    <div className="file-info">
                      <h4>{pair.displayName}</h4>
                      <div className="file-status">
                        {pair.paperUrl && (
                          <span className="status-badge paper">
                            <FileText size={12} />
                            Paper Available
                          </span>
                        )}
                        {pair.solutionUrl && (
                          <span className="status-badge solution">
                            <CheckCircle size={12} />
                            Solution Available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="action-buttons">
                    {pair.paperUrl && (
                      <button
                        className="action-btn primary"
                        onClick={() => handleOpenPaper(selectedSubject, pair, "paper")}
                      >
                        <Eye size={16} />
                        View Paper
                      </button>
                    )}
                    {pair.solutionUrl && (
                      <button
                        className="action-btn secondary"
                        onClick={() => handleOpenPaper(selectedSubject, pair, "solution")}
                      >
                        <CheckCircle size={16} />
                        View Solution
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {getFilesForCategoryType(selectedSemester, selectedSubject, selectedCategory).length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">📄</div>
                <h4>No files found</h4>
                <p>No {selectedCategory.toLowerCase()} materials available for this subject.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .browse-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .browse-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .header-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary || theme.primary});
          border-radius: 16px;
          color: white;
          margin-bottom: 20px;
        }

        .browse-header h2 {
          font-size: 2.2rem;
          font-weight: 800;
          color: ${theme.textPrimary};
          margin: 0 0 12px 0;
        }

        .browse-header p {
          font-size: 1.1rem;
          color: ${theme.textMuted};
          margin: 0;
        }

        .navigation-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: ${theme.glassBg};
          border: 1px solid ${theme.border};
          border-radius: 12px;
          margin-bottom: 40px;
          backdrop-filter: blur(10px);
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: ${theme.primary};
          font-weight: 600;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          background: ${theme.primary}20;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .breadcrumb button {
          background: none;
          border: none;
          color: ${theme.primary};
          font-weight: 500;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .breadcrumb button:hover {
          background: ${theme.primary}20;
        }

        .breadcrumb span {
          color: ${theme.textMuted};
          font-weight: 500;
        }

        .step-container {
          margin-bottom: 50px;
        }

        .step-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 30px;
        }

        .step-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary || theme.primary});
          color: white;
          border-radius: 12px;
          font-weight: 700;
          font-size: 18px;
        }

        .step-header h3 {
          font-size: 1.6rem;
          font-weight: 700;
          color: ${theme.textPrimary};
          margin: 0;
        }

        .semester-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .semester-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: ${theme.glassBg};
          border: 2px solid ${theme.border};
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .semester-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px ${theme.primary}20;
          border-color: ${theme.primary};
        }

        .semester-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary || theme.primary});
          color: white;
          border-radius: 12px;
          font-weight: 800;
          font-size: 20px;
        }

        .semester-info {
          flex: 1;
          text-align: left;
        }

        .semester-info h4 {
          font-size: 1.2rem;
          font-weight: 700;
          color: ${theme.textPrimary};
          margin: 0 0 4px 0;
        }

        .semester-info p {
          font-size: 0.9rem;
          color: ${theme.textMuted};
          margin: 0;
        }

        .arrow-icon {
          color: ${theme.primary};
          transition: transform 0.3s ease;
        }

        .semester-card:hover .arrow-icon,
        .subject-card:hover .arrow-icon {
          transform: translateX(4px);
        }

        .subject-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .subject-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: ${theme.glassBg};
          border: 2px solid ${theme.border};
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .subject-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px ${theme.primary}20;
          border-color: ${theme.primary};
        }

        .subject-icon {
          font-size: 2rem;
        }

        .subject-info {
          flex: 1;
        }

        .subject-info h4 {
          font-size: 1.1rem;
          font-weight: 700;
          color: ${theme.textPrimary};
          margin: 0;
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .category-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: ${theme.glassBg};
          border: 2px solid ${theme.border};
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .category-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px ${theme.primary}20;
          border-color: ${theme.primary};
        }

        .category-icon {
          font-size: 2rem;
        }

        .category-info {
          flex: 1;
        }

        .category-info h4 {
          font-size: 1.1rem;
          font-weight: 700;
          color: ${theme.textPrimary};
          margin: 0 0 4px 0;
        }

        .category-info p {
          font-size: 0.9rem;
          color: ${theme.textMuted};
          margin: 0;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: ${theme.textMuted};
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 16px;
        }

        .empty-state h4 {
          font-size: 1.3rem;
          font-weight: 700;
          margin: 0 0 12px 0;
          color: ${theme.textPrimary};
        }

        .empty-state p {
          font-size: 1rem;
          margin: 0 0 16px 0;
        }

        .step-subtitle {
          font-size: 1rem;
          color: ${theme.textMuted};
          margin: 0;
        }

        .files-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
        }

        /* Enhanced file card styles with paper/solution options */
        .file-card-container {
          background: ${theme.glassBg};
          border: 2px solid ${theme.border};
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .file-card-container:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px ${theme.primary}20;
          border-color: ${theme.primary};
        }

        .file-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
        }

        .file-icon {
          font-size: 2rem;
        }

        .file-info {
          flex: 1;
        }

        .file-info h4 {
          font-size: 1.1rem;
          font-weight: 700;
          color: ${theme.textPrimary};
          margin: 0 0 8px 0;
        }

        .file-status {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-badge.paper {
          background: ${theme.primary}20;
          color: ${theme.primary};
        }

        .status-badge.solution {
          background: #10b98120;
          color: #10b981;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
          padding: 16px 20px;
          background: ${theme.glassBg}50;
          border-top: 1px solid ${theme.border};
        }

        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 16px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn.primary {
          background: ${theme.primary};
          color: white;
        }

        .action-btn.primary:hover {
          background: ${theme.primary}dd;
          transform: translateY(-2px);
        }

        .action-btn.secondary {
          background: #10b981;
          color: white;
        }

        .action-btn.secondary:hover {
          background: #059669;
          transform: translateY(-2px);
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .browse-container {
            padding: 0 16px;
          }

          .browse-header h2 {
            font-size: 1.8rem;
          }

          .navigation-bar {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }

          .breadcrumb {
            justify-content: center;
          }

          .semester-grid,
          .subject-grid,
          .category-grid,
          .files-grid {
            grid-template-columns: 1fr;
          }

          .step-header {
            flex-direction: column;
            text-align: center;
            gap: 12px;
          }

          .action-buttons {
            flex-direction: column;
          }

          .action-btn {
            flex: none;
          }
        }

        @media (max-width: 480px) {
          .semester-card,
          .subject-card,
          .category-card,
          .file-card {
            padding: 16px;
          }

          .semester-number {
            width: 40px;
            height: 40px;
            font-size: 18px;
          }

          .semester-info h4,
          .subject-info h4,
          .category-info h4,
          .file-info h4 {
            font-size: 1rem;
          }
        }
      `}</style>
    </>
  )
}

export default BrowseMethod
