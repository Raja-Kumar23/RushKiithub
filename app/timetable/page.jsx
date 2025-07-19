"use client"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import {
  Calendar,
  Clock,
  MapPin,
  User,
  BookOpen,
  GraduationCap,
  Sun,
  Moon,
  LogOut,
  Timer,
  Play,
  Pause,
  Zap,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import "./styles.css"
import { auth, provider } from "../../lib/firebase"

// Import year-specific data files
import sectionsData3rdYear from "../../public/data/sections-3rd-year.json"
import timetablesData3rdYear from "../../public/data/timetables-3rd-year.json"
import sectionsData2ndYear from "../../public/data/sections-2nd-year.json"
import timetablesData2ndYear from "../../public/data/timetables-2nd-year.json"

export default function TimetablePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [userSections, setUserSections] = useState([])
  const [selectedDay, setSelectedDay] = useState("monday")
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeView, setActiveView] = useState("current") // current, all
  // State to hold the currently active sections and timetables data
  const [activeSectionsData, setActiveSectionsData] = useState(sectionsData3rdYear)
  const [activeTimetablesData, setActiveTimetablesData] = useState(timetablesData3rdYear)

  // Enhanced Theme Configuration - now directly used for inline styles
  const currentTheme = isDarkMode
    ? {
        primary: "#22c55e",
        secondary: "#16a34a",
        accent: "#15803d",
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #334155 70%, #475569 100%)",
        cardBg: "rgba(30, 41, 59, 0.95)",
        textPrimary: "#f8fafc",
        textSecondary: "#e2e8f0",
        textMuted: "#94a3b8",
        border: "rgba(34, 197, 94, 0.3)",
        shadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
        glassBg: "rgba(30, 41, 59, 0.4)",
      }
    : {
        primary: "#22c55e",
        secondary: "#16a34a",
        accent: "#15803d",
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 30%, #bbf7d0 70%, #a7f3d0 100%)",
        cardBg: "rgba(255, 255, 255, 0.95)",
        textPrimary: "#1f2937",
        textSecondary: "#374151",
        textMuted: "#6b7280",
        border: "rgba(34, 197, 94, 0.2)",
        shadow: "0 20px 60px rgba(34, 197, 94, 0.15)",
        glassBg: "rgba(255, 255, 255, 0.4)",
      }

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setIsDarkMode(true)
    }
  }, [])

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Get current day
  const getCurrentDay = useCallback(() => {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    return days[currentTime.getDay()]
  }, [currentTime])

  // Format current time
  const getCurrentTimeString = useCallback(() => {
    return currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
  }, [currentTime])

  // Get current date string
  const getCurrentDateString = useCallback(() => {
    return currentTime.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
  }, [currentTime])

  // Set default day to current day
  useEffect(() => {
    const currentDay = getCurrentDay()
    if (currentDay !== "sunday" && currentDay !== "saturday") {
      setSelectedDay(currentDay)
    }
  }, [getCurrentDay])

  // Find all sections a user belongs to based on the active sections data
  const findUserSections = useCallback((sections, rollNumber) => {
    const userSectionsFound = []
    for (const [sectionId, sectionInfo] of Object.entries(sections)) {
      if (sectionInfo.students.includes(rollNumber)) {
        userSectionsFound.push({
          id: sectionId,
          name: sectionInfo.name,
          type: sectionInfo.type,
        })
      }
    }
    return userSectionsFound
  }, [])

  const loadData = useCallback(
    (userData) => {
      try {
        if (userData) {
          const rollNumber = userData.email.split("@")[0]
          const yearPrefix = rollNumber.substring(0, 2) // e.g., "23" or "24"
          let sectionsToUse = sectionsData3rdYear
          let timetablesToUse = timetablesData3rdYear
          if (yearPrefix === "24") {
            // Assuming '24' prefix for 2nd year
            sectionsToUse = sectionsData2ndYear
            timetablesToUse = timetablesData2ndYear
          } else if (yearPrefix === "23") {
            // Assuming '23' prefix for 3rd year
            sectionsToUse = sectionsData3rdYear
            timetablesToUse = timetablesData3rdYear
          }
          // You can add more conditions for other years (e.g., "22" for 4th year)
          setActiveSectionsData(sectionsToUse)
          setActiveTimetablesData(timetablesToUse)
          const sectionsForUser = findUserSections(sectionsToUse, rollNumber)
          setUserSections(sectionsForUser)
        }
      } catch (error) {
        console.error("Error loading data:", error)
      }
    },
    [findUserSections],
  )

  // Authentication check with Firebase
  useEffect(() => {
    if (!auth) {
      // If auth is null (mocked), simulate a successful login for davidtomdon@gmail.com
      // or a failed one for others to show UI states.
      const mockUserEmail = "23053769@kiit.ac.in" // Example user from sections-3rd-year.json
      // const mockUserEmail = "24057001@kiit.ac.in" // Example user for 2nd year
      const mockRollNumber = mockUserEmail.split("@")[0]
      const mockUser = {
        uid: "mock-uid-123",
        displayName: "Raja Sah",
        email: mockUserEmail,
        photoURL: "/placeholder.svg?height=40&width=40", // Placeholder image
      }
      // Determine which sections data to use for the mock user
      const yearPrefix = mockRollNumber.substring(0, 2)
      let sectionsToUseForMock = sectionsData3rdYear
      if (yearPrefix === "24") {
        sectionsToUseForMock = sectionsData2ndYear
      } else if (yearPrefix === "23") {
        sectionsToUseForMock = sectionsData3rdYear
      }
      if (
        findUserSections(sectionsToUseForMock, mockRollNumber).length > 0 ||
        mockUserEmail === "davidtomdon@gmail.com"
      ) {
        setUser(mockUser)
        loadData(mockUser)
        setLoginError("")
      } else {
        setLoginError("Please use your KIIT Gmail account (@kiit.ac.in) to sign in")
        signOut(auth)
        setUser(null)
        router.push("/")
      }
      setAuthLoading(false)
      return
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && (currentUser.email.endsWith("@kiit.ac.in") || currentUser.email === "davidtomdon@gmail.com")) {
        const userData = {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL || "/placeholder.svg?height=40&width=40",
        }
        setUser(userData)
        loadData(userData)
        setLoginError("")
      } else if (currentUser) {
        setLoginError("Please use your KIIT Gmail account (@kiit.ac.in) to sign in")
        signOut(auth)
        setUser(null)
        router.push("/")
      } else {
        setUser(null)
        router.push("/")
      }
      setAuthLoading(false)
    })
    return () => unsubscribe()
  }, [router, loadData, findUserSections])

  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    localStorage.setItem("theme", newTheme ? "dark" : "light")
  }

  const handleGoogleSignIn = async () => {
    if (!auth || !provider) {
      setLoginError("Authentication service is not available. Please try again later.")
      return
    }
    try {
      setLoginError("")
      const result = await signInWithPopup(auth, provider)
      const currentUser = result.user
      if (!currentUser.email.endsWith("@kiit.ac.in") && currentUser.email !== "davidtomdon@gmail.com") {
        setLoginError("Please use your KIIT Gmail account (@kiit.ac.in) to sign in")
        await signOut(auth)
        return
      }
      const userData = {
        uid: currentUser.uid,
        displayName: currentUser.displayName,
        email: currentUser.email,
        photoURL: currentUser.photoURL || "/placeholder.svg?height=40&width=40",
      }
      setUser(userData)
      loadData(userData)
    } catch (error) {
      console.error("Sign in error:", error)
      if (error.code === "auth/popup-closed-by-user") {
        setLoginError("Sign in was cancelled. Please try again.")
      } else if (error.code === "auth/popup-blocked") {
        setLoginError("Popup was blocked. Please allow popups and try again.")
      } else {
        setLoginError("Sign in failed. Please check your internet connection and try again.")
      }
    }
  }

  const handleSignOut = async () => {
    try {
      if (auth) {
        await signOut(auth)
      }
      setUser(null)
      setShowProfileDropdown(false)
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // --- NEW/IMPROVED TIME UTILITIES ---

  // Parses a time string (e.g., "08:00" or "1:00" for 1 PM) into minutes from midnight for sorting
  const parseTime = useCallback((timeStr) => {
    if (!timeStr || typeof timeStr !== "string") {
      return 0
    }
    try {
      // Extract only the start time part if it's a range (e.g., "08:00-09:00" -> "08:00")
      const [time] = timeStr.split("-")
      if (!time || !time.includes(":")) {
        return 0
      }
      let [hours, minutes] = time.split(":").map(Number)

      // Heuristic to correctly interpret 12-hour times without AM/PM for sorting
      // This assumes a typical class schedule where:
      // 12:xx is noon (12 PM)
      // 1:xx to 6:xx are PM (add 12 to convert to 24-hour for sorting)
      // 7:xx to 11:xx are AM (no change)
      // 00:xx (midnight) is 12 AM (no change, or 0 for sorting)

      if (hours === 12) {
        // 12:xx (noon) remains 12 for sorting
      } else if (hours === 0) {
        // 00:xx (midnight) remains 0 for sorting
      } else if (hours < 7) {
        // For hours 1-6, assume PM (e.g., 1:00 means 1 PM)
        hours += 12
      }
      // For hours 7-11, assume AM (no change)

      return hours * 60 + minutes
    } catch (error) {
      console.error("Error parsing time for sorting:", timeStr, error)
      return 0
    }
  }, [])

  // Formats a 24-hour time string (e.g., "08:00") to 12-hour format without AM/PM (e.g., "8:00")
  const formatSingleTime = useCallback((time24hr) => {
    if (!time24hr || typeof time24hr !== "string" || !time24hr.includes(":")) {
      return time24hr // Return as is if invalid
    }
    let [hours, minutes] = time24hr.split(":").map(Number)

    // Convert to 12-hour format without AM/PM
    if (hours === 0) {
      hours = 12 // 00:xx (midnight) becomes 12
    } else if (hours > 12) {
      hours -= 12 // 13:xx becomes 1:xx, 14:xx becomes 2:xx, etc.
    }

    const formattedMinutes = minutes.toString().padStart(2, "0")
    return `${hours}:${formattedMinutes}`
  }, [])

  // Formats a time range string (e.g., "08:00-09:00") to 12-hour format (e.g., "8:00 - 9:00")
  const formatTimeRangeTo12Hour = useCallback(
    (timeRange24hr) => {
      if (!timeRange24hr || typeof timeRange24hr !== "string" || !timeRange24hr.includes("-")) {
        return timeRange24hr // Return as is if invalid
      }
      const [startTime24hr, endTime24hr] = timeRange24hr.split("-")
      const formattedStartTime = formatSingleTime(startTime24hr)
      const formattedEndTime = formatSingleTime(endTime24hr)
      return `${formattedStartTime} - ${formattedEndTime}`
    },
    [formatSingleTime],
  )

  const isCurrentClass = useCallback(
    (classItem) => {
      if (!classItem || !classItem.time || typeof classItem.time !== "string") {
        return false
      }
      const currentDay = getCurrentDay()
      const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes()

      if (!classItem.time.includes("-")) {
        return false
      }
      const [startTimeStr, endTimeStr] = classItem.time.split("-")
      if (!startTimeStr || !endTimeStr) {
        return false
      }

      const startMinutes = parseTime(startTimeStr) // Use parseTime on the start part
      const endMinutes = parseTime(endTimeStr) // Use parseTime on the end part

      return currentDay === selectedDay && currentMinutes >= startMinutes && currentMinutes < endMinutes
    },
    [getCurrentDay, currentTime, selectedDay, parseTime],
  )

  // Helper to get all classes for a given day across all user's sections
  const getAllClassesForDay = useCallback(
    (day) => {
      if (!userSections.length || !Object.keys(activeTimetablesData).length) return []
      let combinedClasses = []
      userSections.forEach((section) => {
        const coreClasses = activeTimetablesData[section.id]?.coreSubjects?.[day] || []
        const electiveClasses = activeTimetablesData[section.id]?.electiveSubjects?.[day] || []
        combinedClasses = combinedClasses.concat(coreClasses, electiveClasses)
      })
      // Filter out duplicates if a class appears in multiple sections a user is part of (e.g., electives)
      const uniqueClasses = []
      const seen = new Set()
      for (const classItem of combinedClasses) {
        const identifier = `${classItem.subject}-${classItem.time}-${classItem.room}`
        if (!seen.has(identifier)) {
          seen.add(identifier)
          uniqueClasses.push(classItem)
        }
      }
      // Sort classes chronologically using the improved parseTime
      return uniqueClasses.sort((a, b) => parseTime(a.time) - parseTime(b.time))
    },
    [userSections, parseTime, activeTimetablesData],
  )

  const getUpcomingClasses = useCallback(() => {
    const today = getCurrentDay()
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes()
    const allClassesForToday = getAllClassesForDay(today)
    return allClassesForToday
      .filter((classItem) => {
        const [startTime] = classItem.time.split("-")
        const startMinutes = parseTime(startTime)
        return startMinutes > currentMinutes // Only show classes that haven't started yet
      })
      .slice(0, 1)
  }, [getCurrentDay, currentTime, getAllClassesForDay, parseTime])

  const getCurrentClasses = useCallback(() => {
    const today = getCurrentDay()
    const allClassesForToday = getAllClassesForDay(today)
    return allClassesForToday.filter((classItem) => isCurrentClass(classItem))
  }, [getCurrentDay, getAllClassesForDay, isCurrentClass])

  const getTodaysSchedule = useCallback(() => {
    const today = getCurrentDay()
    return getAllClassesForDay(today).map((classItem) => ({
      ...classItem,
      isCurrent: isCurrentClass(classItem),
    }))
  }, [getCurrentDay, getAllClassesForDay, isCurrentClass])

  const getSelectedDaySchedule = useCallback(() => {
    if (!userSections.length || !Object.keys(activeTimetablesData).length) return []
    let combinedClasses = []
    userSections.forEach((section) => {
      // Combine both core and elective subjects for the selected day
      const coreClasses = activeTimetablesData[section.id]?.coreSubjects?.[selectedDay] || []
      const electiveClasses = activeTimetablesData[section.id]?.electiveSubjects?.[selectedDay] || []
      combinedClasses = combinedClasses.concat(coreClasses, electiveClasses)
    })
    const uniqueClasses = []
    const seen = new Set()
    for (const classItem of combinedClasses) {
      const identifier = `${classItem.subject}-${classItem.time}-${classItem.room}`
      if (!seen.has(identifier)) {
        seen.add(identifier)
        uniqueClasses.push(classItem)
      }
    }
    return uniqueClasses
      .map((classItem) => ({
        ...classItem,
        isCurrent: isCurrentClass(classItem),
      }))
      .sort((a, b) => parseTime(a.time) - parseTime(b.time))
  }, [userSections, selectedDay, isCurrentClass, parseTime, activeTimetablesData])

  const days = [
    { key: "monday", label: "Monday", emoji: "📅" },
    { key: "tuesday", label: "Tuesday", emoji: "📋" },
    { key: "wednesday", label: "Wednesday", emoji: "📊" },
    { key: "thursday", label: "Thursday", emoji: "📝" },
    { key: "friday", label: "Friday", emoji: "🎯" },
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      const profileContainer = document.querySelector(".profile-container")
      if (profileContainer && !profileContainer.contains(event.target)) {
        setShowProfileDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showProfileDropdown])

  if (authLoading) {
    return (
      <div className="loading-container" style={{ background: currentTheme.background }}>
        <div
          className="loading-card"
          style={{
            background: currentTheme.cardBg,
            border: `2px solid ${currentTheme.border}`,
            boxShadow: currentTheme.shadow,
          }}
        >
          <div style={{ color: currentTheme.textPrimary }}>Loading your timetable...</div>
          <div
            className="loading-spinner"
            style={{
              borderWidth: "4px",
              borderStyle: "solid",
              borderColor: currentTheme.border,
              borderTopColor: currentTheme.primary, // Fixed: Use specific border properties
            }}
          />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="loading-container" style={{ background: currentTheme.background }}>
        <div
          className="loading-card"
          style={{
            background: currentTheme.cardBg,
            border: `2px solid ${currentTheme.border}`,
            boxShadow: currentTheme.shadow,
          }}
        >
          <div style={{ color: currentTheme.textPrimary }}>Please sign in to view your timetable</div>
          <button
            onClick={handleGoogleSignIn}
            style={{
              background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`,
              color: "white",
            }}
            className="login-button"
          >
            Sign In with Google
          </button>
          {loginError && (
            <div style={{ color: currentTheme.error }} className="login-error">
              {loginError}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="timetable-container" style={{ background: currentTheme.background }}>
      {/* Message for 5th Sem Elective Timetable - Moved to top */}
      <div
        style={{
          textAlign: "center",
          padding: "15px",
          color: currentTheme.textPrimary,
          fontSize: "16px",
          fontWeight: "600",
          marginBottom: "20px", // Space below the message
          backgroundColor: isDarkMode ? "rgba(30, 41, 59, 0.7)" : "rgba(255, 255, 255, 0.7)", // Subtle background
          borderRadius: "10px",
          backdropFilter: "blur(10px)",
          border: `1px solid ${currentTheme.border}`,
        }}
      >
        <p style={{ margin: 0 }}>5th Sem Elective Timetable has not been updated yet. It will be updated soon.</p>
      </div>

      {/* New Combined Header */}
      <header
        className="main-header"
        style={{
          background: currentTheme.cardBg,
          border: `2px solid ${currentTheme.border}`,
          boxShadow: currentTheme.shadow,
        }}
      >
        <div className="header-left">
          <div className="kiithub-logo-container">
            <img src="/logo.png" alt="KiitHub Logo" className="kiithub-main-logo" />
            <div className="logo-text">
              <h1 style={{ color: currentTheme.textPrimary }}>KIITHub</h1>
              <p style={{ color: currentTheme.textMuted }}>Your Smart Campus Companion</p>
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="kiithub-tagline">
            <div
              className="tagline-badge"
              style={{
                background: `${currentTheme.primary}15`,
                border: `2px solid ${currentTheme.primary}30`,
                color: currentTheme.primary,
              }}
            >
              <Zap size={16} />
              Smart Timetable
            </div>
          </div>
          {/* Integrated Profile Section */}
          <div className="profile-section-new">
            <div className="profile-container">
              <button
                className="profile-button"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                style={{
                  background: currentTheme.glassBg,
                  border: `2px solid ${currentTheme.border}`,
                  boxShadow: currentTheme.shadow,
                  color: currentTheme.textPrimary,
                }}
              >
                <img
                  src={user.photoURL || "/placeholder.svg?height=36&width=36"}
                  alt="Profile"
                  className="profile-image"
                />
                <span className="profile-name">{user.displayName?.split(" ")[0]}</span>
                {showProfileDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <div
                className="profile-dropdown"
                style={{
                  opacity: showProfileDropdown ? 1 : 0,
                  transform: showProfileDropdown ? "translateY(0)" : "translateY(-15px) scale(0.9)",
                  pointerEvents: showProfileDropdown ? "auto" : "none",
                  background: currentTheme.cardBg,
                  border: `2px solid ${currentTheme.border}`,
                  boxShadow: currentTheme.shadow,
                  zIndex: 9999, // Ensure it's on top
                }}
              >
                <div className="profile-info">
                  <img
                    src={user.photoURL || "/placeholder.svg?height=56&width=56"}
                    alt="Profile"
                    className="dropdown-image"
                  />
                  <div className="user-details">
                    <p className="user-name" style={{ color: currentTheme.textPrimary }}>
                      {user.displayName}
                    </p>
                    <p className="user-email" style={{ color: currentTheme.textMuted }}>
                      {user.email}
                    </p>
                    {userSections.length > 0 && (
                      <div className="user-sections-list">
                        {userSections.map((section) => (
                          <p key={section.id} className="user-section-item" style={{ color: currentTheme.textMuted }}>
                            <GraduationCap size={14} style={{ color: currentTheme.primary }} />
                            {section.name}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="profile-divider" style={{ background: currentTheme.border }}></div>
                <div className="profile-actions">
                  <button
                    className="profile-action timetable"
                    onClick={() => setShowProfileDropdown(false)} // Close dropdown on click
                    style={{ color: currentTheme.textPrimary }}
                  >
                    <Calendar size={18} style={{ color: currentTheme.primary }} />
                    My Timetable
                  </button>
                  <button
                    className="profile-action theme-toggle"
                    onClick={toggleTheme}
                    style={{ color: currentTheme.textPrimary }}
                  >
                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                  </button>
                  <button
                    className="profile-action logout"
                    onClick={handleSignOut}
                    style={{ color: currentTheme.error }}
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="main-content-grid">
        {/* Student Info Card - now spans full width on desktop */}
        {userSections.length > 0 && (
          <section
            className="student-info-card"
            style={{
              background: currentTheme.cardBg,
              border: `2px solid ${currentTheme.border}`,
              boxShadow: currentTheme.shadow,
            }}
          >
            <div
              className="student-info"
              style={{
                background: `${currentTheme.primary}10`,
                border: `2px solid ${currentTheme.primary}20`,
              }}
            >
              <div
                className="student-avatar-wrapper"
                style={{
                  border: `4px solid ${currentTheme.primary}`, // Green border
                }}
              >
                <img
                  src={user.photoURL || "/placeholder.svg?height=80&width=80"}
                  alt="Profile"
                  className="student-avatar"
                />
                {!user.photoURL && (
                  <div
                    className="student-avatar-initial"
                    style={{
                      backgroundColor: "#3b82f6", // Blue background for initial
                      color: "#ffffff", // White text for initial
                    }}
                  >
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </div>
              <div className="student-details">
                <h3 style={{ color: currentTheme.textPrimary }}>{user.displayName}</h3>
                <div className="student-info-row">
                  <div className="info-item">
                    <User size={16} style={{ color: currentTheme.primary }} />
                    <span style={{ color: currentTheme.textSecondary }}>Roll: {user.email.split("@")[0]}</span>
                  </div>
                  {userSections.map((section) => (
                    <div key={section.id} className="info-item">
                      <GraduationCap size={16} style={{ color: currentTheme.primary }} />
                      <span style={{ color: currentTheme.textSecondary }}>{section.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
        {/* Quick Overview Cards */}
        <section className="overview-grid">
          {/* Current Classes */}
          <div
            className="overview-card current-classes"
            style={{
              background: currentTheme.cardBg,
              border: `2px solid ${currentTheme.border}`,
              boxShadow: currentTheme.shadow,
            }}
          >
            {/* Integrated Current Time and Day Display */}
            <div className="time-date-display-in-card">
              <div className="current-time">
                <Clock size={24} style={{ color: currentTheme.primary }} />
                <span style={{ color: currentTheme.textPrimary }}>{getCurrentTimeString()}</span>
              </div>
              <div className="current-date">
                <Calendar size={20} style={{ color: currentTheme.secondary }} />
                <span style={{ color: currentTheme.textSecondary }}>{getCurrentDateString()}</span>
              </div>
            </div>
            <div className="overview-header">
              <div className="overview-title">
                <Play size={20} style={{ color: currentTheme.primary }} />
                <h3 style={{ color: currentTheme.textPrimary }}>Current Classes</h3>
              </div>
              <div
                className="live-indicator"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.error} 0%, ${currentTheme.warning} 100%)`,
                }}
              >
                <div className="live-dot"></div>
                LIVE
              </div>
            </div>
            <div className="overview-content">
              {getCurrentClasses().length > 0 ? (
                getCurrentClasses().map((classItem, index) => (
                  <div
                    key={index}
                    className="class-card-new current"
                    style={{
                      background: `${currentTheme.primary}15`,
                      border: `2px solid ${currentTheme.primary}30`,
                    }}
                  >
                    <div className="class-main-info">
                      <div className="subject-info">
                        <h4 style={{ color: currentTheme.textPrimary }}>{classItem.subject}</h4>
                        <div className="class-meta">
                          <span className="time-info" style={{ color: currentTheme.primary }}>
                            <Clock size={14} />
                            {formatTimeRangeTo12Hour(classItem.time)} {/* Formatted time */}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="class-details-new">
                      <div className="detail-row">
                        <MapPin size={16} style={{ color: currentTheme.secondary }} />
                        <span style={{ color: currentTheme.textSecondary }}>Room: {classItem.room}</span>
                      </div>
                      <div className="detail-row">
                        <User size={16} style={{ color: currentTheme.secondary }} />
                        <span style={{ color: currentTheme.textSecondary }}>{classItem.faculty}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-classes-mini" style={{ color: currentTheme.textMuted }}>
                  <Pause size={24} />
                  <p>No classes running now</p>
                </div>
              )}
            </div>
          </div>
          {/* Next Class */}
          <div
            className="overview-card upcoming-classes"
            style={{
              background: currentTheme.cardBg,
              border: `2px solid ${currentTheme.border}`,
              boxShadow: currentTheme.shadow,
            }}
          >
            <div className="overview-header">
              <div className="overview-title">
                <Timer size={20} style={{ color: currentTheme.secondary }} />
                <h3 style={{ color: currentTheme.textPrimary }}>Next Class</h3>
              </div>
            </div>
            <div className="overview-content">
              {getUpcomingClasses().length > 0 ? (
                getUpcomingClasses().map((classItem, index) => (
                  <div
                    key={index}
                    className="class-card-new upcoming"
                    style={{
                      background: `${currentTheme.secondary}10`,
                      border: `2px solid ${currentTheme.secondary}20`,
                    }}
                  >
                    <div className="class-main-info">
                      <div className="subject-info">
                        <h4 style={{ color: currentTheme.textPrimary }}>{classItem.subject}</h4>
                        <div className="class-meta">
                          <span className="time-info" style={{ color: currentTheme.secondary }}>
                            <Clock size={14} />
                            {formatTimeRangeTo12Hour(classItem.time)} {/* Formatted time */}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="class-details-new">
                      <div className="detail-row">
                        <MapPin size={16} style={{ color: currentTheme.accent }} />
                        <span style={{ color: currentTheme.textSecondary }}>Room: {classItem.room}</span>
                      </div>
                      <div className="detail-row">
                        <User size={16} style={{ color: currentTheme.accent }} />
                        <span style={{ color: currentTheme.textSecondary }}>{classItem.faculty}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-classes-mini" style={{ color: currentTheme.textMuted }}>
                  <Timer size={24} />
                  <p>No next class</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Enhanced Controls */}
        <section
          className="controls-card"
          style={{
            background: currentTheme.cardBg,
            border: `2px solid ${currentTheme.border}`,
            boxShadow: currentTheme.shadow,
          }}
        >
          {/* View Toggle */}
          <div className="control-section">
            <h3 style={{ color: currentTheme.textPrimary }}>👁️ View Mode</h3>
            <div className="button-group">
              {[
                { key: "current", label: "Current Day", icon: "📅" },
                { key: "all", label: "All Schedule", icon: "📊" },
              ].map((view) => (
                <button
                  key={view.key}
                  onClick={() => setActiveView(view.key)}
                  className={`control-button ${activeView === view.key ? "active" : ""}`}
                  style={{
                    border: `2px solid ${currentTheme.border}`,
                    background:
                      activeView === view.key
                        ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
                        : currentTheme.glassBg,
                    color: activeView === view.key ? "white" : currentTheme.textPrimary,
                  }}
                >
                  <span>{view.icon}</span>
                  {view.label}
                </button>
              ))}
            </div>
          </div>
          {/* Subject Type and Day Selection - Only for "all" view */}
          {activeView === "all" && (
            <>
              {/* Removed Subject Type control section */}
              <div className="control-section">
                <h3 style={{ color: currentTheme.textPrimary }}>📆 Select Day</h3>
                <div className="button-group">
                  {days.map((day) => (
                    <button
                      key={day.key}
                      onClick={() => setSelectedDay(day.key)}
                      className={`control-button ${selectedDay === day.key ? "active" : ""}`}
                      style={{
                        border: `2px solid ${currentTheme.border}`,
                        background:
                          selectedDay === day.key
                            ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
                            : currentTheme.glassBg,
                        color: selectedDay === day.key ? "white" : currentTheme.textPrimary,
                      }}
                    >
                      <span>{day.emoji}</span>
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>
        {/* Dynamic Content Based on View */}
        {activeView === "current" && (
          <section
            className="timetable-card"
            style={{
              background: currentTheme.cardBg,
              border: `2px solid ${currentTheme.border}`,
              boxShadow: currentTheme.shadow,
            }}
          >
            <h3 className="timetable-title" style={{ color: currentTheme.textPrimary }}>
              🕐 Today's Schedule - {getCurrentDay().charAt(0).toUpperCase() + getCurrentDay().slice(1)}
            </h3>
            {getTodaysSchedule().length > 0 ? (
              <div className="schedule-grid-new">
                {getTodaysSchedule().map((classItem, index) => (
                  <div
                    key={index}
                    className={`class-card-detailed ${classItem.isCurrent ? "current-class" : ""}`}
                    style={{
                      background: classItem.isCurrent ? `${currentTheme.primary}15` : `${currentTheme.primary}08`,
                      border: `2px solid ${classItem.isCurrent ? `${currentTheme.primary}30` : `${currentTheme.primary}20`}`,
                    }}
                  >
                    <div className="class-header-new">
                      <div className="subject-title">
                        <BookOpen size={20} style={{ color: currentTheme.primary }} />
                        <h4 style={{ color: currentTheme.textPrimary }}>{classItem.subject}</h4>
                      </div>
                      {classItem.isCurrent && (
                        <div className="class-status current">
                          <div className="status-indicator"></div>
                          <span>LIVE NOW</span>
                        </div>
                      )}
                    </div>
                    <div className="class-info-grid">
                      <div className="info-card">
                        <Clock size={18} style={{ color: currentTheme.primary }} />
                        <div className="info-content">
                          <span className="info-label" style={{ color: currentTheme.textMuted }}>
                            Time
                          </span>
                          <span className="info-value" style={{ color: currentTheme.textPrimary }}>
                            {formatTimeRangeTo12Hour(classItem.time)} {/* Formatted time */}
                          </span>
                        </div>
                      </div>
                      <div className="info-card">
                        <MapPin size={18} style={{ color: currentTheme.secondary }} />
                        <div className="info-content">
                          <span className="info-label" style={{ color: currentTheme.textMuted }}>
                            Room
                          </span>
                          <span className="info-value" style={{ color: currentTheme.textPrimary }}>
                            {classItem.room}
                          </span>
                        </div>
                      </div>
                      <div className="info-card">
                        <User size={18} style={{ color: currentTheme.accent }} />
                        <div className="info-content">
                          <span className="info-label" style={{ color: currentTheme.textMuted }}>
                            Faculty
                          </span>
                          <span className="info-value" style={{ color: currentTheme.textPrimary }}>
                            {classItem.faculty}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-classes" style={{ color: currentTheme.textMuted }}>
                <BookOpen size={48} />
                <p>No classes scheduled for today</p>
                <p>Enjoy your free time! 🎉</p>
              </div>
            )}
          </section>
        )}
        {activeView === "all" && (
          <section
            className="timetable-card"
            style={{
              background: currentTheme.cardBg,
              border: `2px solid ${currentTheme.border}`,
              boxShadow: currentTheme.shadow,
            }}
          >
            <h3 className="timetable-title" style={{ color: currentTheme.textPrimary }}>
              🕐 {days.find((d) => d.key === selectedDay)?.label} Schedule
            </h3>
            {getSelectedDaySchedule().length > 0 ? (
              <div className="schedule-grid-new">
                {getSelectedDaySchedule().map((classItem, index) => (
                  <div
                    key={index}
                    className={`class-card-detailed ${classItem.isCurrent ? "current-class" : ""}`}
                    style={{
                      background: classItem.isCurrent ? `${currentTheme.primary}15` : `${currentTheme.primary}08`,
                      border: `2px solid ${classItem.isCurrent ? `${currentTheme.primary}30` : `${currentTheme.primary}20`}`,
                    }}
                  >
                    <div className="class-header-new">
                      <div className="subject-title">
                        <BookOpen size={20} style={{ color: currentTheme.primary }} />
                        <h4 style={{ color: currentTheme.textPrimary }}>{classItem.subject}</h4>
                      </div>
                      {classItem.isCurrent && (
                        <div className="class-status current">
                          <div className="status-indicator"></div>
                          <span>LIVE NOW</span>
                        </div>
                      )}
                    </div>
                    <div className="class-info-grid">
                      <div className="info-card">
                        <Clock size={18} style={{ color: currentTheme.primary }} />
                        <div className="info-content">
                          <span className="info-label" style={{ color: currentTheme.textMuted }}>
                            Time
                          </span>
                          <span className="info-value" style={{ color: currentTheme.textPrimary }}>
                            {formatTimeRangeTo12Hour(classItem.time)} {/* Formatted time */}
                          </span>
                        </div>
                      </div>
                      <div className="info-card">
                        <MapPin size={18} style={{ color: currentTheme.secondary }} />
                        <div className="info-content">
                          <span className="info-label" style={{ color: currentTheme.textMuted }}>
                            Room
                          </span>
                          <span className="info-value" style={{ color: currentTheme.textPrimary }}>
                            {classItem.room}
                          </span>
                        </div>
                      </div>
                      <div className="info-card">
                        <User size={18} style={{ color: currentTheme.accent }} />
                        <div className="info-content">
                          <span className="info-label" style={{ color: currentTheme.textMuted }}>
                            Faculty
                          </span>
                          <span className="info-value" style={{ color: currentTheme.textPrimary }}>
                            {classItem.faculty}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-classes" style={{ color: currentTheme.textMuted }}>
                <BookOpen size={48} />
                <p>No classes scheduled for this day</p>
                <p>Enjoy your free time! 🎉</p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}
