"use client"

import { useState } from "react"
import { ChevronRight, ArrowLeft, Eye, BookOpen } from "lucide-react"

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

  // Fixed function to get available semesters - handles flat structure
  const getAvailableSemesters = () => {
    try {
      const availableSemesters = []

      if (!subjectsData || typeof subjectsData !== "object") {
        console.log("❌ No valid subjects data available:", subjectsData)
        return availableSemesters
      }

      const dataKeys = Object.keys(subjectsData)
      console.log("📊 Processing semester data keys:", dataKeys)

      dataKeys.forEach((key) => {
        const semesterData = subjectsData[key]

        if (!semesterData || typeof semesterData !== "object") {
          console.log(`⚠️ Skipping invalid semester data for ${key}:`, semesterData)
          return
        }

        // Find matching semester info - handle both cases
        const semesterInfo = semesterMapping[key]
        if (semesterInfo) {
          // Count valid subjects with files - FIXED: Handle flat structure
          let subjectCount = 0
          let totalFiles = 0

          Object.entries(semesterData).forEach(([subjectName, subjectData]) => {
            if (subjectData && typeof subjectData === "object") {
              let hasValidFiles = false

              // FIXED: Handle direct fields as categories/files
              Object.entries(subjectData).forEach(([fieldName, fieldValue]) => {
                // Check if field value is a valid URL string
                if (
                  typeof fieldValue === "string" &&
                  fieldValue.trim() !== "" &&
                  fieldValue !== "undefined" &&
                  fieldValue.toLowerCase() !== "null" &&
                  (fieldValue.includes("http") || fieldValue.includes("drive.google.com"))
                ) {
                  hasValidFiles = true
                  totalFiles++
                  console.log(`✅ Found valid file: ${subjectName} - ${fieldName}`)
                }
              })

              if (hasValidFiles) {
                subjectCount++
              }
            }
          })

          if (subjectCount > 0) {
            availableSemesters.push({
              ...semesterInfo,
              actualKey: key,
              subjectCount,
              totalFiles,
            })
            console.log(`✅ Added ${key}: ${subjectCount} subjects, ${totalFiles} files`)
          } else {
            console.log(`⚠️ Skipping ${key}: no valid subjects found`)
          }
        } else {
          console.log(`⚠️ No mapping found for key: ${key}`)
        }
      })

      // Sort semesters
      const sorted = availableSemesters.sort((a, b) => {
        if (a.key === "Routine" || a.key === "routine") return 1
        if (b.key === "Routine" || b.key === "routine") return -1
        return Number.parseInt(a.number) - Number.parseInt(b.number)
      })

      console.log(
        "📈 Available semesters:",
        sorted.map((s) => `${s.name} (${s.subjectCount} subjects)`),
      )
      return sorted
    } catch (error) {
      console.error("❌ Error getting available semesters:", error)
      return []
    }
  }

  // Fixed function to get subjects for a semester - simplified to show only names
  const getSubjectsForSemester = (semesterKey) => {
    try {
      const semesterData = subjectsData[semesterKey] || {}
      console.log(`📚 Processing subjects for ${semesterKey}:`, Object.keys(semesterData))

      const subjects = Object.entries(semesterData)
        .map(([subjectName, subjectData]) => {
          if (!subjectData || typeof subjectData !== "object") {
            console.log(`⚠️ Skipping invalid subject data for ${subjectName}`)
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
            console.log(`✅ ${subjectName}: has valid files`)
            return {
              name: subjectName,
              data: subjectData,
            }
          } else {
            console.log(`⚠️ ${subjectName}: no valid files found`)
            return null
          }
        })
        .filter((subject) => subject !== null)

      console.log(`📊 Found ${subjects.length} valid subjects for ${semesterKey}`)
      return subjects
    } catch (error) {
      console.error("❌ Error getting subjects for semester:", error)
      return []
    }
  }

  // New function to get categories for a subject - shows exact database names
  const getCategoriesForSubject = (semesterKey, subjectName) => {
    try {
      const semesterData = subjectsData[semesterKey] || {}
      const subjectData = semesterData[subjectName] || {}

      console.log(`📂 Processing categories for ${subjectName}:`, Object.keys(subjectData))

      const categories = []

      // Process direct fields as categories - show EXACT names from database
      Object.entries(subjectData).forEach(([fieldName, fieldValue]) => {
        if (
          typeof fieldValue === "string" &&
          fieldValue.trim() !== "" &&
          fieldValue !== "undefined" &&
          fieldValue.toLowerCase() !== "null" &&
          (fieldValue.includes("http") || fieldValue.includes("drive.google.com"))
        ) {
          // Determine category type for icon only, but keep original name
          let categoryIcon = "📄"
          let categoryType = "Other"

          if (fieldName.toLowerCase().includes("syllabus")) {
            categoryIcon = "📋"
            categoryType = "Syllabus"
          } else if (fieldName.toLowerCase().includes("end semester") || fieldName.toLowerCase().includes("end sem")) {
            categoryIcon = "📝"
            categoryType = "End Semester"
          } else if (fieldName.toLowerCase().includes("mid semester") || fieldName.toLowerCase().includes("mid sem")) {
            categoryIcon = "📄"
            categoryType = "Mid Semester"
          } else if (fieldName.toLowerCase().includes("notes")) {
            categoryIcon = "📚"
            categoryType = "Notes"
          }

          categories.push({
            name: fieldName, // EXACT name from database
            type: categoryType, // For sorting only
            icon: categoryIcon,
            url: fieldValue,
            originalField: fieldName,
            displayName: fieldName, // Show exact database name
          })
        }
      })

      // Sort categories by type, then alphabetically
      const sortedCategories = categories.sort((a, b) => {
        const categoryOrder = { Syllabus: 1, Notes: 2, "Mid Semester": 3, "End Semester": 4, Other: 5 }
        const aOrder = categoryOrder[a.type] || 5
        const bOrder = categoryOrder[b.type] || 5

        if (aOrder !== bOrder) {
          return aOrder - bOrder
        }

        return a.name.localeCompare(b.name) // Alphabetical order within same type
      })

      console.log(`📊 Found ${sortedCategories.length} categories for ${subjectName}`)
      return sortedCategories
    } catch (error) {
      console.error("❌ Error getting categories for subject:", error)
      return []
    }
  }

  const handleOpenPaper = (subject, category, year, categoryData = null) => {
    if (!user) {
      setShowLoginPrompt(true)
      if (setHasInteracted) setHasInteracted(true)
      return
    }

    // If we have the category data with URL, use it directly
    if (categoryData && categoryData.url) {
      console.log("📖 Opening paper directly with URL:", categoryData.url)
      const previewUrl = getPreviewLink(categoryData.url)
      const fileUrl = encodeURIComponent(previewUrl)
      const fileTitle = encodeURIComponent(`${subject} - ${categoryData.displayName}`)
      window.open(`/viewer?url=${fileUrl}&title=${fileTitle}`, "_blank")
      showNotification(`📖 Opening: ${categoryData.displayName}`, "success")
      return
    }

    // Fallback to original logic
    console.log("📖 Opening paper:", { subject, category, year })
    openPaper(subject, category, year)
    showNotification(`📖 Opening: ${subject} - ${category} - ${year}`, "success")
  }

  // Helper function to get preview link
  const getPreviewLink = (fullUrl) => {
    const match = fullUrl.match(/(?:id=|\/d\/)([-\w]{25,})/)
    if (match) {
      console.log("getPreviewLink: Detected Google Drive ID, generating preview link.")
      return `https://drive.google.com/file/d/${match[1]}/preview`
    }
    console.log("getPreviewLink: No Google Drive ID found, returning original URL.")
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
      const categories = getCategoriesForSubject(semesterKey, subjectName)
      const uniqueTypes = {}

      categories.forEach((category) => {
        if (!uniqueTypes[category.type]) {
          uniqueTypes[category.type] = {
            type: category.type,
            icon: category.icon,
            count: 0,
          }
        }
        uniqueTypes[category.type].count++
      })

      // Sort by the predefined order
      const categoryOrder = { Syllabus: 1, Notes: 2, "Mid Semester": 3, "End Semester": 4, Other: 5 }

      return Object.values(uniqueTypes).sort((a, b) => {
        const aOrder = categoryOrder[a.type] || 5
        const bOrder = categoryOrder[b.type] || 5
        return aOrder - bOrder
      })
    } catch (error) {
      console.error("❌ Error getting category types:", error)
      return []
    }
  }

  const getFilesForCategoryType = (semesterKey, subjectName, categoryType) => {
    try {
      const categories = getCategoriesForSubject(semesterKey, subjectName)
      return categories.filter((category) => category.type === categoryType)
    } catch (error) {
      console.error("❌ Error getting files for category type:", error)
      return []
    }
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
          <p>Navigate through your organized study materials</p>
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
                    {availableSemesters.find((s) => s.actualKey === selectedSemester)?.name}
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
                    key={semester.actualKey}
                    className="semester-card"
                    onClick={() => setSelectedSemester(semester.actualKey)}
                  >
                    <div className="semester-number">{semester.number}</div>
                    <div className="semester-info">
                      <h4>{semester.name}</h4>
                      <p>
                        {semester.subjectCount} subjects • {semester.totalFiles} files
                      </p>
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
                  <ChevronRight size={20} className="arrow-icon" />
                </button>
              ))}
            </div>
            {getCategoryTypesForSubject(selectedSemester, selectedSubject).length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">📄</div>
                <h4>No materials found</h4>
                <p>This subject doesn't have any study materials yet.</p>
              </div>
            )}
          </div>
        )}

        {selectedSemester && selectedSubject && selectedCategory && (
          <div className="step-container">
            <div className="step-header">
              <div className="step-number">4</div>
              <h3>Select File</h3>
              <p className="step-subtitle">
                {selectedCategory} materials for {selectedSubject}
              </p>
            </div>
            <div className="files-grid">
              {getFilesForCategoryType(selectedSemester, selectedSubject, selectedCategory).map((file, index) => (
                <button
                  key={`${file.name}-${index}`}
                  className="file-card"
                  onClick={() => handleOpenPaper(selectedSubject, file.name, "", file)}
                >
                  <div className="file-icon">{file.icon}</div>
                  <div className="file-info">
                    <h4>{file.displayName}</h4>
                    <p>Click to view</p>
                  </div>
                  <div className="view-btn-small">
                    <Eye size={16} />
                  </div>
                </button>
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
          text-align: left;
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
          text-align: left;
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

        .view-btn-small {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: ${theme.primary}20;
          color: ${theme.primary};
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .category-card:hover .view-btn-small {
          background: ${theme.primary};
          color: white;
          transform: scale(1.1);
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
          .category-grid {
            grid-template-columns: 1fr;
          }

          .step-header {
            flex-direction: column;
            text-align: center;
            gap: 12px;
          }
        }

        @media (max-width: 480px) {
          .semester-card,
          .subject-card,
          .category-card {
            padding: 16px;
          }

          .semester-number {
            width: 40px;
            height: 40px;
            font-size: 18px;
          }

          .semester-info h4,
          .subject-info h4,
          .category-info h4 {
            font-size: 1rem;
          }
        }

        .step-subtitle {
          font-size: 1rem;
          color: ${theme.textMuted};
          margin: 0;
        }

        .files-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .file-card {
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

        .file-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px ${theme.primary}20;
          border-color: ${theme.primary};
        }

        .file-icon {
          font-size: 2rem;
        }

        .file-info {
          flex: 1;
          text-align: left;
        }

        .file-info h4 {
          font-size: 1.1rem;
          font-weight: 700;
          color: ${theme.textPrimary};
          margin: 0;
        }

        .file-info p {
          font-size: 0.9rem;
          color: ${theme.textMuted};
          margin: 0;
        }
      `}</style>
    </>
  )
}

export default BrowseMethod
