"use client"

import { useEffect, useState } from "react"
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
} from "lucide-react"
import "./styles.css"
import { auth, provider } from "../../lib/firebase"

export default function TimetablePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [sectionsData, setSectionsData] = useState({})
  const [timetableData, setTimetableData] = useState({})
  const [userSection, setUserSection] = useState(null)
  const [selectedSubjectType, setSelectedSubjectType] = useState("coreSubjects")
  const [selectedDay, setSelectedDay] = useState("monday")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeView, setActiveView] = useState("current") // current, all

  // Enhanced Theme Configuration
  const theme = {
    light: {
      primary: "#22c55e",
      secondary: "#16a34a",
      accent: "#15803d",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 30%, #bbf7d0 70%, #a7f3d0 100%)",
      cardBg: "rgba(255, 255, 255, 0.95)",
      textPrimary: "#1f2937", // Dark text for light mode
      textSecondary: "#374151",
      textMuted: "#6b7280",
      border: "rgba(34, 197, 94, 0.2)",
      shadow: "0 20px 60px rgba(34, 197, 94, 0.15)",
      glassBg: "rgba(255, 255, 255, 0.4)",
    },
    dark: {
      primary: "#22c55e",
      secondary: "#16a34a",
      accent: "#15803d",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #334155 70%, #475569 100%)",
      cardBg: "rgba(30, 41, 59, 0.95)",
      textPrimary: "#f8fafc", // Light text for dark mode
      textSecondary: "#e2e8f0",
      textMuted: "#94a3b8",
      border: "rgba(34, 197, 94, 0.3)",
      shadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
      glassBg: "rgba(30, 41, 59, 0.4)",
    },
  }

  const currentTheme = isDarkMode ? theme.dark : theme.light

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
  const getCurrentDay = () => {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    return days[currentTime.getDay()]
  }

  // Format current time
  const getCurrentTimeString = () => {
    return currentTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  // Get current date string
  const getCurrentDateString = () => {
    return currentTime.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Set default day to current day
  useEffect(() => {
    const currentDay = getCurrentDay()
    if (currentDay !== "sunday" && currentDay !== "saturday") {
      setSelectedDay(currentDay)
    }
  }, [currentTime])

  // Authentication check with Firebase
  useEffect(() => {
    if (!auth) {
      setAuthLoading(false)
      return
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && (currentUser.email.endsWith("@kiit.ac.in") || currentUser.email === "davidtomdon@gmail.com")) {
        const userData = {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL || "/default-profile.png",
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
  }, [router])

  const loadData = async (userData) => {
    try {
      const sectionsResponse = await fetch("/data/sections.json")
      const sections = await sectionsResponse.json()
      setSectionsData(sections)
      const timetableResponse = await fetch("/data/timetables.json")
      const timetables = await timetableResponse.json()
      setTimetableData(timetables)
      if (userData) {
        const rollNumber = userData.email.split("@")[0]
        const section = findUserSection(sections, rollNumber)
        setUserSection(section)
      }
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const findUserSection = (sections, rollNumber) => {
    for (const [sectionId, sectionInfo] of Object.entries(sections)) {
      if (sectionInfo.students.includes(rollNumber)) {
        return {
          id: sectionId,
          name: sectionInfo.name,
          rollNumber: rollNumber,
        }
      }
    }
    return null
  }

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
        photoURL: currentUser.photoURL || "/default-profile.png",
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
      await signOut(auth)
      setUser(null)
      setShowProfileDropdown(false)
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleBackToHome = () => {
    router.push("/")
  }

  const parseTime = (timeStr) => {
    if (!timeStr || typeof timeStr !== "string" || !timeStr.includes("-")) {
      return 0
    }
    try {
      const [time] = timeStr.split("-")
      if (!time || !time.includes(":")) {
        return 0
      }
      const [hours, minutes] = time.split(":").map(Number)
      if (isNaN(hours) || isNaN(minutes)) {
        return 0
      }
      return hours * 60 + minutes
    } catch (error) {
      console.error("Error parsing time:", timeStr, error)
      return 0
    }
  }

  const isCurrentClass = (classItem) => {
    if (!classItem || !classItem.time || typeof classItem.time !== "string") {
      return false
    }
    const currentDay = getCurrentDay()
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes()
    if (!classItem.time.includes("-")) {
      return false
    }
    const [startTime, endTime] = classItem.time.split("-")
    if (!startTime || !endTime) {
      return false
    }
    const startMinutes = parseTime(startTime + "-00:00")
    const endMinutes = parseTime(endTime + "-00:00")
    return currentDay === selectedDay && currentMinutes >= startMinutes && currentMinutes <= endMinutes
  }

  const getUpcomingClasses = () => {
    if (!userSection || !timetableData[userSection.id]) return []

    const today = getCurrentDay()
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes()
    const allClassesForToday = [
      ...(timetableData[userSection.id].coreSubjects?.[today] || []),
      ...(timetableData[userSection.id].electiveSubjects?.[today] || []),
    ]

    return allClassesForToday
      .filter((classItem) => {
        if (!classItem || !classItem.time || !classItem.time.includes("-")) {
          return false
        }
        const [startTime] = classItem.time.split("-")
        if (!startTime) return false
        const startMinutes = parseTime(startTime + "-00:00")
        return startMinutes > currentMinutes // Only show classes that haven't started yet
      })
      .sort((a, b) => parseTime(a.time) - parseTime(b.time)) // Sort by time
      .slice(0, 5) // Show up to 5 upcoming classes for today
  }

  const getCurrentClasses = () => {
    if (!userSection || !timetableData[userSection.id]) return []

    const today = getCurrentDay()
    const coreClasses = timetableData[userSection.id].coreSubjects?.[today] || []
    const electiveClasses = timetableData[userSection.id].electiveSubjects?.[today] || []
    const allClasses = [...coreClasses, ...electiveClasses]

    return allClasses
      .filter((classItem) => classItem && classItem.time)
      .map((classItem) => ({
        ...classItem,
        isCurrent: isCurrentClass(classItem),
      }))
      .filter((classItem) => classItem.isCurrent)
  }

  // New function to get all classes for the current day
  const getTodaysSchedule = () => {
    if (!userSection || !timetableData[userSection.id]) return []

    const today = getCurrentDay()
    const coreClasses = timetableData[userSection.id].coreSubjects?.[today] || []
    const electiveClasses = timetableData[userSection.id].electiveSubjects?.[today] || []
    const allClasses = [...coreClasses, ...electiveClasses]

    return allClasses
      .filter((classItem) => classItem && classItem.time)
      .map((classItem) => ({
        ...classItem,
        isCurrent: isCurrentClass(classItem), // Still mark current class for highlighting
      }))
      .sort((a, b) => parseTime(a.time) - parseTime(b.time)) // Sort by time
  }

  const getSelectedDaySchedule = () => {
    if (!userSection || !timetableData[userSection.id]) return []

    const classes = timetableData[userSection.id][selectedSubjectType]?.[selectedDay] || []

    return classes
      .filter((classItem) => classItem && classItem.time)
      .map((classItem) => ({
        ...classItem,
        isCurrent: isCurrentClass(classItem),
      }))
      .sort((a, b) => parseTime(a.time) - parseTime(b.time)) // Sort by time
  }

  const days = [
    { key: "monday", label: "Monday", emoji: "📅" },
    { key: "tuesday", label: "Tuesday", emoji: "📋" },
    { key: "wednesday", label: "Wednesday", emoji: "📊" },
    { key: "thursday", label: "Thursday", emoji: "📝" },
    { key: "friday", label: "Friday", emoji: "🎯" },
  ]

  const getTimeUntilNext = (classItem) => {
    if (!classItem || !classItem.time || !classItem.time.includes("-")) {
      return "N/A"
    }
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes()
    const [startTime] = classItem.time.split("-")
    if (!startTime) return "N/A"
    const startMinutes = parseTime(startTime + "-00:00")
    const diff = startMinutes - currentMinutes

    if (diff <= 0) return "Started" // Class has already started or passed
    if (diff < 60) return `${diff} min`
    const hours = Math.floor(diff / 60)
    const minutes = diff % 60
    return `${hours}h ${minutes}m`
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest(".profile-container")) {
        setShowProfileDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showProfileDropdown])

  const tableClick = () => {
    setShowProfileDropdown(false) // Ensure dropdown closes when "My Timetable" is clicked
  }

  if (authLoading) {
    return (
      <div className="loading-container" style={{ background: currentTheme.background }}>
        <div
          className="loading-card"
          style={{
            background: currentTheme.cardBg,
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: currentTheme.border,
            boxShadow: currentTheme.shadow,
          }}
        >
          <div
            style={{
              color: currentTheme.textPrimary,
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "20px",
            }}
          >
            Loading your timetable...
          </div>
          <div
            className="loading-spinner"
            style={{
              borderWidth: "4px",
              borderStyle: "solid",
              borderColor: currentTheme.border,
              borderTopWidth: "4px",
              borderTopStyle: "solid",
              borderTopColor: currentTheme.primary,
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
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: currentTheme.border,
            boxShadow: currentTheme.shadow,
          }}
        >
          <div
            style={{
              color: currentTheme.textPrimary,
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "20px",
            }}
          >
            Please sign in to view your timetable
          </div>
          <button
            onClick={handleGoogleSignIn}
            style={{
              background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`,
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            Sign In with Google
          </button>
          {loginError && (
            <div
              style={{
                color: currentTheme.error,
                fontSize: "14px",
                marginTop: "10px",
              }}
            >
              {loginError}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="timetable-container" style={{ background: currentTheme.background }}>
      {/* New Combined Header */}
      <div
        className="main-header"
        style={{
          background: currentTheme.cardBg,
          borderWidth: "2px",
          borderStyle: "solid",
          borderColor: currentTheme.border,
          boxShadow: currentTheme.shadow,
        }}
      >
        <div className="header-left">
          <div className="kiithub-logo-container">
            <img src="/logo.png" alt="KiitHub Logo" className="kiithub-main-logo" />
            <div className="logo-text">
              <h1 style={{ color: currentTheme.textPrimary }}>KiitHub</h1>
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
                borderWidth: "2px",
                borderStyle: "solid",
                borderColor: `${currentTheme.primary}30`,
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
                  borderWidth: "2px",
                  borderStyle: "solid",
                  borderColor: currentTheme.border,
                  boxShadow: currentTheme.shadow,
                  color: currentTheme.textPrimary,
                }}
              >
                <img src={user.photoURL || "/default-profile.png"} alt="Profile" className="profile-image" />
                <span className="profile-name">{user.displayName?.split(" ")[0]}</span>
              </button>
              {showProfileDropdown && (
                <div
                  className="profile-dropdown"
                  style={{
                    background: currentTheme.cardBg,
                    borderWidth: "2px",
                    borderStyle: "solid",
                    borderColor: currentTheme.border,
                    boxShadow: currentTheme.shadow,
                  }}
                >
                  <div className="profile-info">
                    <img src={user.photoURL || "/default-profile.png"} alt="Profile" className="dropdown-image" />
                    <div className="user-details">
                      <p className="user-name" style={{ color: currentTheme.textPrimary }}>
                        {user.displayName}
                      </p>
                      <p className="user-email" style={{ color: currentTheme.textMuted }}>
                        {user.email}
                      </p>
                      <p className="user-section" style={{ color: currentTheme.textMuted }}>
                        Section: {userSection ? userSection.id : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="profile-divider" style={{ background: currentTheme.border }}></div>

                  <div className="profile-actions">
                    <button
                      className="profile-action timetable"
                      onClick={tableClick}
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
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Current Time and Day Display */}
      <div
        className="current-time-card"
        style={{
          background: currentTheme.cardBg,
          borderWidth: "2px",
          borderStyle: "solid",
          borderColor: currentTheme.border,
          boxShadow: currentTheme.shadow,
        }}
      >
        <div className="time-display">
          <div className="current-time">
            <Clock size={24} style={{ color: currentTheme.primary }} />
            <span style={{ color: currentTheme.textPrimary }}>{getCurrentTimeString()}</span>
          </div>
          <div className="current-date">
            <Calendar size={20} style={{ color: currentTheme.secondary }} />
            <span style={{ color: currentTheme.textSecondary }}>{getCurrentDateString()}</span>
          </div>
        </div>
      </div>

      {/* Student Info Card */}
      {userSection && (
        <div
          className="student-info-card"
          style={{
            background: currentTheme.cardBg,
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: currentTheme.border,
            boxShadow: currentTheme.shadow,
          }}
        >
          <div
            className="student-info"
            style={{
              background: `${currentTheme.primary}10`,
              borderWidth: "2px",
              borderStyle: "solid",
              borderColor: `${currentTheme.primary}20`,
            }}
          >
            <img
              src={user.photoURL || "/default-profile.png"}
              alt="Profile"
              className="student-avatar"
              style={{
                borderWidth: "3px",
                borderStyle: "solid",
                borderColor: currentTheme.primary,
              }}
            />
            <div className="student-details">
              <h3 style={{ color: currentTheme.textPrimary }}>{user.displayName}</h3>
              <div className="student-info-row">
                <div className="info-item">
                  <User size={16} style={{ color: currentTheme.primary }} />
                  <span style={{ color: currentTheme.textSecondary }}>Roll: {userSection.rollNumber}</span>
                </div>
                <div className="info-item">
                  <GraduationCap size={16} style={{ color: currentTheme.primary }} />
                  <span style={{ color: currentTheme.textSecondary }}>{userSection.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Overview Cards */}
      <div className="overview-grid">
        {/* Current Classes */}
        <div
          className="overview-card current-classes"
          style={{
            background: currentTheme.cardBg,
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: currentTheme.border,
            boxShadow: currentTheme.shadow,
          }}
        >
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
                    borderWidth: "2px",
                    borderStyle: "solid",
                    borderColor: `${currentTheme.primary}30`,
                  }}
                >
                  <div className="class-main-info">
                    <div className="subject-info">
                      <h4 style={{ color: currentTheme.textPrimary }}>{classItem.subject}</h4>
                      <div className="class-meta">
                        <span className="time-info" style={{ color: currentTheme.primary }}>
                          <Clock size={14} />
                          {classItem.time}
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

        {/* Upcoming Classes */}
        <div
          className="overview-card upcoming-classes"
          style={{
            background: currentTheme.cardBg,
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: currentTheme.border,
            boxShadow: currentTheme.shadow,
          }}
        >
          <div className="overview-header">
            <div className="overview-title">
              <Timer size={20} style={{ color: currentTheme.secondary }} />
              <h3 style={{ color: currentTheme.textPrimary }}>Upcoming Classes (Today)</h3>
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
                    borderWidth: "2px",
                    borderStyle: "solid",
                    borderColor: `${currentTheme.secondary}20`,
                  }}
                >
                  <div className="class-main-info">
                    <div className="subject-info">
                      <h4 style={{ color: currentTheme.textPrimary }}>{classItem.subject}</h4>
                      <div className="class-meta">
                        <span className="time-info" style={{ color: currentTheme.secondary }}>
                          <Clock size={14} />
                          {classItem.time}
                        </span>
                        <span
                          className="countdown"
                          style={{
                            background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`,
                            color: "white",
                          }}
                        >
                          {getTimeUntilNext(classItem)}
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
                <p>No upcoming classes for today</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Controls */}
      <div
        className="controls-card"
        style={{
          background: currentTheme.cardBg,
          borderWidth: "2px",
          borderStyle: "solid",
          borderColor: currentTheme.border,
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
                  borderWidth: "2px",
                  borderStyle: "solid",
                  borderColor: currentTheme.border,
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
            <div className="control-section">
              <h3 style={{ color: currentTheme.textPrimary }}>📚 Subject Type</h3>
              <div className="button-group">
                {[
                  { key: "coreSubjects", label: "Core Subjects", icon: "📖" },
                  { key: "electiveSubjects", label: "Elective Subjects", icon: "⭐" },
                ].map((type) => (
                  <button
                    key={type.key}
                    onClick={() => setSelectedSubjectType(type.key)}
                    className={`control-button ${selectedSubjectType === type.key ? "active" : ""}`}
                    style={{
                      borderWidth: "2px",
                      borderStyle: "solid",
                      borderColor: currentTheme.border,
                      background:
                        selectedSubjectType === type.key
                          ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
                          : currentTheme.glassBg,
                      color: selectedSubjectType === type.key ? "white" : currentTheme.textPrimary,
                    }}
                  >
                    <span>{type.icon}</span>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="control-section">
              <h3 style={{ color: currentTheme.textPrimary }}>📆 Select Day</h3>
              <div className="button-group">
                {days.map((day) => (
                  <button
                    key={day.key}
                    onClick={() => setSelectedDay(day.key)}
                    className={`control-button ${selectedDay === day.key ? "active" : ""}`}
                    style={{
                      borderWidth: "2px",
                      borderStyle: "solid",
                      borderColor: currentTheme.border,
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
      </div>

      {/* Dynamic Content Based on View */}
      {activeView === "current" && (
        <div
          className="timetable-card"
          style={{
            background: currentTheme.cardBg,
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: currentTheme.border,
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
                    borderWidth: "2px",
                    borderStyle: "solid",
                    borderColor: classItem.isCurrent ? `${currentTheme.primary}30` : `${currentTheme.primary}20`,
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
                          {classItem.time}
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
        </div>
      )}

      {activeView === "all" && (
        <div
          className="timetable-card"
          style={{
            background: currentTheme.cardBg,
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: currentTheme.border,
            boxShadow: currentTheme.shadow,
          }}
        >
          <h3 className="timetable-title" style={{ color: currentTheme.textPrimary }}>
            🕐 {days.find((d) => d.key === selectedDay)?.label} Schedule -{" "}
            {selectedSubjectType === "coreSubjects" ? "Core Subjects" : "Elective Subjects"}
          </h3>
          {getSelectedDaySchedule().length > 0 ? (
            <div className="schedule-grid-new">
              {getSelectedDaySchedule().map((classItem, index) => (
                <div
                  key={index}
                  className={`class-card-detailed ${classItem.isCurrent ? "current-class" : ""}`}
                  style={{
                    background: classItem.isCurrent ? `${currentTheme.primary}15` : `${currentTheme.primary}08`,
                    borderWidth: "2px",
                    borderStyle: "solid",
                    borderColor: classItem.isCurrent ? `${currentTheme.primary}30` : `${currentTheme.primary}20`,
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
                          {classItem.time}
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
        </div>
      )}
    </div>
  )
}
