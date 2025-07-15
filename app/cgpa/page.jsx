"use client"

import { useState, useEffect } from "react"
import { Calculator, ArrowLeft, FileText, MessageSquare, Home, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import "./cgpa.css"

export default function CGPACalculator() {
  const router = useRouter()
  const [isSetupComplete, setIsSetupComplete] = useState(false)
  const [selectedSemester, setSelectedSemester] = useState(null)
  const [currentSemester, setCurrentSemester] = useState(null)
  const [motivationIndex, setMotivationIndex] = useState(0)
  const [showExportMessage, setShowExportMessage] = useState(false)
  

  // Motivational quotes that keep changing
  const motivationalQuotes = [
  "🎓 Grades don’t define you — consistency does.",
  "⚖️ Balance CGPA with real-world skills.",
  "🌟 Every grade counts towards your dreams!",
  "🎯 Aim for a great CGPA, but never stop learning beyond it.",
  "📈 Let CGPA track your effort — not limit your potential.",
  "📚 Knowledge is the key to success!",
  "🔁 Focus on progress, not perfection!",
  "🛠️ You're building your future, one subject at a time!",
  "🚀 Excellence is a habit, not an act!",
  "✨ Your hard work will pay off!",
  "🏆 Champions are made in the classroom!",
  "💡 Learning today, leading tomorrow!",
  "🌈 Every challenge is an opportunity to grow!",
  "⭐ Believe in yourself and achieve greatness!"
]


  // Semester-wise subjects with credits
  const semesterSubjects = {
    1: [
      { name: "Transform And Numerical Methods", credits: 4 },
      { name: "Chemistry", credits: 3 },
      { name: "English", credits: 2 },
      { name: "Basic Electronics", credits: 2 },
      { name: "Chemistry Lab", credits: 1 },
      { name: "Yoga", credits: 1 },
      { name: "Engineering Lab", credits: 1 },
      { name: "Workshop", credits: 1 },
      { name: "Communication Lab", credits: 1 },
      { name: "Elective", credits: 2 },
      { name: "Basic Electrical Engineering", credits: 2 },
    ],
    2: [
      { name: "Physics", credits: 3 },
      { name: "Science of Living Systems", credits: 2 },
      { name: "Environmental Science", credits: 2 },
      { name: "Physics Lab", credits: 1 },
      { name: "Programming Lab", credits: 4 },
      { name: "Engineering Drawing and Graphics", credits: 1 },
      { name: "Elective 1", credits: 2 },
      { name: "Elective 2", credits: 2 },
      { name: "Differential Equations and Linear Algebra", credits: 4 },
    ],
    3: [
      { name: "Scientific and Technical Writing", credits: 2 },
      { name: "Probability and Statistics", credits: 4 },
      { name: "Industry 4.0 Technologies", credits: 2 },
      { name: "Data Structures", credits: 4 },
      { name: "Digital System Design", credits: 3 },
      { name: "Automata Theory and Formal Language", credits: 4 },
      { name: "Data Structure Lab", credits: 1 },
      { name: "Digital System Design Lab", credits: 1 },
    ],
    4: [
      { name: "Discrete Mathematics", credits: 4 },
      { name: "Operating System", credits: 3 },
      { name: "Object Oriented Programming in JAVA", credits: 3 },
      { name: "Database Management Systems", credits: 3 },
      { name: "Computer Organization and Architecture", credits: 4 },
      { name: "Operating System Lab", credits: 1 },
      { name: "Java Programming Lab", credits: 1 },
      { name: "Database Management Systems Lab", credits: 1 },
      { name: "Elective 1", credits: 2 },
      { name: "Vocational Training Lab", credits: 1 },
    ],
    5: [
      { name: "Computer Networks", credits: 3 },
      { name: "Design and Analysis of ALGO", credits: 3 },
      { name: "Software Engineering", credits: 4 },
      { name: "Engineering Economics", credits: 3 },
      { name: "Network Lab", credits: 1 },
      { name: "Algorithm Lab", credits: 1 },
      { name: "Professional Elective 1", credits: 3 },
      { name: "Professional Elective 2", credits: 3 },
      { name: "K-Explore Open Elective 1", credits: 1 },
    ],
    6: [
      { name: "ML", credits: 4 },
      { name: "AI", credits: 3 },
      { name: "AI LAB", credits: 1 },
      { name: "UHV", credits: 3 },
      { name: "Minor Project", credits: 2 },
      { name: "AD LAB", credits: 2 },
      { name: "Professional Elective 3", credits: 3 },
      { name: "HASS Elective 3", credits: 3 },
      { name: "Open-Elective 1", credits: 3 },
    ],
    7: [
      { name: "HRM", credits: 3 },
      { name: "Professional Practice Law and Ethics", credits: 2 },
      { name: "Project 1/ Internship", credits: 3 },
      { name: "Practical Training", credits: 2 },
      { name: "Coursera Elective", credits: 3 },
    ],
    8: [
      { name: "Project 2", credits: 10 },
      { name: "Comprehensive Viva", credits: 2 },
    ],
  }

  // Updated grading mapping with percentage ranges
  const gradesMapping = {
    O: { points: 10, range: "90-100" },
    E: { points: 9, range: "80-89" },
    A: { points: 8, range: "70-79" },
    B: { points: 7, range: "60-69" },
    C: { points: 6, range: "50-59" },
    D: { points: 5, range: "40-49" },
    F: { points: 0, range: "Below 40" },
  }

  // Change motivational quote every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMotivationIndex((prev) => (prev + 1) % motivationalQuotes.length)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedSetup = localStorage.getItem("cgpa-setup-complete")
    const savedSemester = localStorage.getItem("cgpa-current-semester")

    if (savedSetup && savedSemester) {
      setIsSetupComplete(true)
      setCurrentSemester(JSON.parse(savedSemester))
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (isSetupComplete && currentSemester) {
      localStorage.setItem("cgpa-current-semester", JSON.stringify(currentSemester))
    }
  }, [currentSemester, isSetupComplete])

  const handleSemesterSelect = (semesterNum) => {
    setSelectedSemester(semesterNum)
  }

  const completeSetup = () => {
    if (!selectedSemester) return

    const initialSemester = {
      id: `semester-${selectedSemester}`,
      name: `Semester ${selectedSemester}`,
      number: selectedSemester,
      subjects: semesterSubjects[selectedSemester].map((subject, index) => ({
        id: `${selectedSemester}-${index}`,
        name: subject.name,
        credits: subject.credits,
        grade: "A",
      })),
    }

    setCurrentSemester(initialSemester)
    setIsSetupComplete(true)
    localStorage.setItem("cgpa-setup-complete", "true")
  }

  const updateSubjectGrade = (subjectId, grade) => {
    setCurrentSemester((prev) => ({
      ...prev,
      subjects: prev.subjects.map((sub) => (sub.id === subjectId ? { ...sub, grade } : sub)),
    }))
  }

  const calculateSGPA = () => {
    if (!currentSemester || currentSemester.subjects.length === 0) return 0

    const totalCredits = currentSemester.subjects.reduce((sum, sub) => sum + sub.credits, 0)
    const totalPoints = currentSemester.subjects.reduce(
      (sum, sub) => sum + sub.credits * gradesMapping[sub.grade].points,
      0,
    )

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0
  }

  const getTotalCredits = () => {
    if (!currentSemester) return 0
    return currentSemester.subjects.reduce((total, sub) => total + sub.credits, 0)
  }

  const getAverageGrade = () => {
    const sgpa = Number.parseFloat(calculateSGPA())
    if (sgpa >= 9.5) return "O"
    if (sgpa >= 8.5) return "E"
    if (sgpa >= 7.5) return "A"
    if (sgpa >= 6.5) return "B"
    if (sgpa >= 5.5) return "C"
    if (sgpa >= 4.5) return "D"
    return "F"
  }

  const resetCalculator = () => {
    localStorage.removeItem("cgpa-setup-complete")
    localStorage.removeItem("cgpa-current-semester")
    setIsSetupComplete(false)
    setCurrentSemester(null)
    setSelectedSemester(null)
  }

  const exportToWord = () => {
    const sgpa = calculateSGPA()
    const totalCredits = getTotalCredits()
    const averageGrade = getAverageGrade()
    const currentDate = new Date().toLocaleDateString()

    // Create Word document content with MS Word specific XML
    const wordContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>SGPA Report - ${currentSemester.name}</title>
        <style>
          body { font-family: 'Calibri', sans-serif; margin: 1in; }
          .header { text-align: center; margin-bottom: 20pt; border-bottom: 1pt solid #10b981; padding-bottom: 10pt; }
          .header h1 { color: #10b981; margin: 0; font-size: 24pt; }
          .header p { margin: 5pt 0; color: #666; }
          .summary { background: #f0fdf4; padding: 15pt; border-radius: 5pt; margin: 15pt 0; }
          .summary-grid { display: table; width: 100%; border-collapse: separate; border-spacing: 10pt; }
          .summary-row { display: table-row; }
          .summary-item { display: table-cell; background: white; padding: 10pt; border-radius: 5pt; border: 1pt solid #10b981; text-align: center; width: 33%; }
          .summary-value { font-size: 18pt; font-weight: bold; color: #10b981; }
          .summary-label { font-size: 10pt; color: #666; margin-top: 5pt; }
          table.subjects-table { width: 100%; border-collapse: collapse; margin: 15pt 0; }
          table.subjects-table th, table.subjects-table td { border: 1pt solid #ddd; padding: 8pt; text-align: left; }
          table.subjects-table th { background: #10b981; color: white; font-weight: bold; }
          table.subjects-table tr:nth-child(even) { background: #f9f9f9; }
          .grade-scale { margin-top: 20pt; }
          .grade-scale h3 { color: #10b981; margin-bottom: 10pt; }
          .grade-grid { display: table; width: 100%; border-collapse: separate; border-spacing: 5pt; }
          .grade-row { display: table-row; }
          .grade-item { display: table-cell; background: #f7fafc; padding: 8pt; border-radius: 3pt; text-align: center; font-size: 9pt; width: 25%; }
          .footer { margin-top: 30pt; text-align: center; color: #666; font-size: 9pt; border-top: 1pt solid #ddd; padding-top: 15pt; }
          .feedback { margin-top: 20pt; text-align: center; padding: 10pt; background: #f0fdf4; border-radius: 5pt; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>SGPA Report</h1>
          <p><strong>${currentSemester.name}</strong></p>
          <p>Generated on: ${currentDate}</p>
        </div>

        <div class="summary">
          <div class="summary-grid">
            <div class="summary-row">
              <div class="summary-item">
                <div class="summary-value">${sgpa}</div>
                <div class="summary-label">SGPA</div>
              </div>
              <div class="summary-item">
                <div class="summary-value">${averageGrade}</div>
                <div class="summary-label">Grade</div>
              </div>
              <div class="summary-item">
                <div class="summary-value">${totalCredits}</div>
                <div class="summary-label">Total Credits</div>
              </div>
            </div>
          </div>
        </div>

        <table class="subjects-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Credits</th>
              <th>Grade</th>
              <th>Percentage Range</th>
            </tr>
          </thead>
          <tbody>
            ${currentSemester.subjects
              .map(
                (subject) => `
              <tr>
                <td>${subject.name}</td>
                <td>${subject.credits}</td>
                <td>${subject.grade}</td>
                <td>${gradesMapping[subject.grade].range}%</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>

        <div class="grade-scale">
          <h3>Grade Scale Reference</h3>
          <div class="grade-grid">
            <div class="grade-row">
            ${Object.entries(gradesMapping)
              .slice(0, 4)
              .map(
                ([grade, info]) => `
              <div class="grade-item">
                <strong>${grade}</strong><br>
                ${info.points} points<br>
                ${info.range}%
              </div>
            `,
              )
              .join("")}
            </div>
            <div class="grade-row">
            ${Object.entries(gradesMapping)
              .slice(4)
              .map(
                ([grade, info]) => `
              <div class="grade-item">
                <strong>${grade}</strong><br>
                ${info.points} points<br>
                ${info.range}%
              </div>
            `,
              )
              .join("")}
            </div>
          </div>
        </div>

        <div class="feedback">
          <p>Missing any subject or found an issue? Please contact us through the feedback section on the main page.</p>
        </div>

        <div class="footer">
          <p>This report was generated by CGPA Calculator</p>
          <p>Academic Performance Summary - ${currentSemester.name}</p>
        </div>
      </body>
      </html>
    `

    // Create and download the Word document
    const blob = new Blob([wordContent], { type: "application/msword" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `SGPA-Report-Semester-${currentSemester.number}.doc`
    a.click()
    URL.revokeObjectURL(url)

    // Show export message
    setShowExportMessage(true)
    setTimeout(() => {
      setShowExportMessage(false)
    }, 3000)
  }

  // Setup Screen
  if (!isSetupComplete) {
    return (
      <div className="setup-container">
        <div className="setup-card">
          <div className="setup-header">
            <Calculator size={48} />
            <h1>CGPA Calculator</h1>
            <p>Select your semester to calculate SGPA</p>
          </div>

          <div className="motivation-text">{motivationalQuotes[motivationIndex]}</div>

          <div className="semesters-selection">
            <h3>Choose Your Semester</h3>
            <div className="semesters-grid">
              {Object.keys(semesterSubjects).map((semNum) => (
                <div
                  key={semNum}
                  className={`semester-option ${selectedSemester === Number.parseInt(semNum) ? "selected" : ""}`}
                  onClick={() => handleSemesterSelect(Number.parseInt(semNum))}
                >
                  <div className="semester-number">Sem {semNum}</div>
                  <div className="semester-credits">
                    {semesterSubjects[semNum].reduce((total, subject) => total + subject.credits, 0)} Credits
                  </div>
                  <div className="semester-subjects">{semesterSubjects[semNum].length} Subjects</div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={completeSetup} disabled={!selectedSemester} className="setup-btn">
            <CheckCircle size={20} />
            Start Calculating
          </button>
        </div>
      </div>
    )
  }

  const sgpa = calculateSGPA()
  const totalCredits = getTotalCredits()
  const averageGrade = getAverageGrade()

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <button onClick={() => router.back()} className="back-btn">
              <ArrowLeft size={24} />
            </button>
            <Calculator size={32} />
            <h1>SCGPA Calculator</h1>
          </div>
          <div className="motivation-display">{motivationalQuotes[motivationIndex]}</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Action Buttons */}
        <div className="action-buttons">
          <button onClick={resetCalculator} className="reset-btn">
            <Calculator size={20} />
            Change Semester
          </button>
          <button onClick={exportToWord} className="export-btn">
            <FileText size={20} />
            Export to MS Word
          </button>
        </div>

        {showExportMessage && <div className="export-message">Report exported successfully as MS Word document!</div>}

        {/* Current Semester */}
        <div className="semester-card">
          <div className="semester-header">
            <h3>{currentSemester.name}</h3>
            <div className="semester-info">
              <span className="semester-credits">{totalCredits} Credits</span>
              <span className="semester-subjects">{currentSemester.subjects.length} Subjects</span>
            </div>
          </div>

          <div className="subjects-container">
            <div className="subjects-header">
              <span>Subject</span>
              <span>Credits</span>
              <span>Grade</span>
            </div>

            {currentSemester.subjects.map((subject) => (
              <div key={subject.id} className="subject-row">
                <div className="subject-name">{subject.name}</div>
                <div className="subject-credits">{subject.credits}</div>
                <select
                  value={subject.grade}
                  onChange={(e) => updateSubjectGrade(subject.id, e.target.value)}
                  className="subject-grade"
                >
                  {Object.entries(gradesMapping).map(([grade, info]) => (
                    <option key={grade} value={grade}>
                      {grade} ({info.range}%)
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* CGPA Result at Bottom */}
        <div className="cgpa-result-card">
          <div className="cgpa-display">
            <div className="cgpa-main">
              <span className="cgpa-label">Your SGPA</span>
              <span className="cgpa-value">{sgpa}</span>
              <span className="cgpa-grade">Grade: {averageGrade}</span>
            </div>
            <div className="cgpa-details">
              <div className="cgpa-detail">
                <span className="detail-value">{totalCredits}</span>
                <span className="detail-label">Total Credits</span>
              </div>
              <div className="cgpa-detail">
                <span className="detail-value">{currentSemester.subjects.length}</span>
                <span className="detail-label">Subjects</span>
              </div>
              <div className="cgpa-detail">
                <span className="detail-value">{averageGrade}</span>
                <span className="detail-label">Average Grade</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grade Scale */}
        <div className="grade-scale-card">
          <h3>Grade Scale Reference</h3>
          <div className="grade-scale-grid">
            {Object.entries(gradesMapping).map(([grade, info]) => (
              <div key={grade} className="grade-item">
                <span className="grade">{grade}</span>
                <span className="points">{info.points} points</span>
                <span className="percentage">{info.range}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Section */}
        <div className="feedback-section">
          <div className="feedback-content">
            <MessageSquare size={24} />
            <p>Missing any subject or something? Contact us through feedback section at main page</p>
            <button onClick={() => router.push("/")} className="feedback-btn">
              <Home size={16} />
              Go to Main Page
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
