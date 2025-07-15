"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import { 
  ArrowLeft, 
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
  School,
  Zap
} from "lucide-react"
import { auth, provider } from "../../lib/firebase"
import "./styles.css"

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
  const [activeView, setActiveView] = useState("current") // current, upcoming, all

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
      textPrimary: "#1f2937",
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
      textPrimary: "#f8fafc",
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
      const sectionsResponse = await fetch('/data/sections.json')
      const sections = await sectionsResponse.json()
      setSectionsData(sections)

      const timetableResponse = await fetch('/data/timetables.json')
      const timetables = await timetableResponse.json()
      setTimetableData(timetables)

      if (userData) {
        const rollNumber = userData.email.split('@')[0]
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
          rollNumber: rollNumber
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

  const handleTimetableClick = () => {
    setShowProfileDropdown(false)
    // Already on timetable page, no need to navigate
  }

  const parseTime = (timeStr) => {
    // Safety check for undefined or invalid time string
    if (!timeStr || typeof timeStr !== 'string' || !timeStr.includes('-')) {
      return 0 // Return 0 for invalid time
    }
    
    try {
      const [time] = timeStr.split('-')
      if (!time || !time.includes(':')) {
        return 0
      }
      
      const [hours, minutes] = time.split(':').map(Number)
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
    // Safety check for classItem and time property
    if (!classItem || !classItem.time || typeof classItem.time !== 'string') {
      return false
    }
    
    const currentDay = getCurrentDay()
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes()
    
    // Check if time contains '-' separator
    if (!classItem.time.includes('-')) {
      return false
    }
    
    const [startTime, endTime] = classItem.time.split('-')
    if (!startTime || !endTime) {
      return false
    }
    
    const startMinutes = parseTime(startTime + '-00:00')
    const endMinutes = parseTime(endTime + '-00:00')
    
    return currentDay === selectedDay && 
           currentMinutes >= startMinutes && 
           currentMinutes <= endMinutes
  }

  const getUpcomingClasses = () => {
    if (!userSection || !timetableData[userSection.id]) return []
    
    const today = getCurrentDay()
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes()
    const allClasses = []
    
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday"]
    const todayIndex = days.indexOf(today)
    
    // Get classes for remaining days of the week
    for (let i = 0; i < days.length; i++) {
      const dayIndex = (todayIndex + i) % days.length
      const day = days[dayIndex]
      const dayClasses = [
        ...(timetableData[userSection.id].coreSubjects?.[day] || []),
        ...(timetableData[userSection.id].electiveSubjects?.[day] || [])
      ]
      
      dayClasses.forEach(classItem => {
        // Safety check for classItem
        if (!classItem || !classItem.time || !classItem.time.includes('-')) {
          return
        }
        
        const [startTime] = classItem.time.split('-')
        if (!startTime) return
        
        const startMinutes = parseTime(startTime + '-00:00')
        
        // For today, only show classes that haven't started yet
        if (day === today && startMinutes <= currentMinutes) return
        
        allClasses.push({
          ...classItem,
          day,
          startMinutes,
          isToday: day === today,
          dayLabel: day.charAt(0).toUpperCase() + day.slice(1)
        })
      })
    }
    
    return allClasses
      .sort((a, b) => {
        if (a.isToday && !b.isToday) return -1
        if (!a.isToday && b.isToday) return 1
        return a.startMinutes - b.startMinutes
      })
      .slice(0, 5)
  }

  const getCurrentClasses = () => {
    if (!userSection || !timetableData[userSection.id]) return []
    
    const today = getCurrentDay()
    const allClasses = [
      ...(timetableData[userSection.id].coreSubjects?.[today] || []),
      ...(timetableData[userSection.id].electiveSubjects?.[today] || [])
    ]
    
    return allClasses
      .filter(classItem => classItem && classItem.time) // Filter out invalid items
      .map(classItem => ({
        ...classItem,
        isCurrent: isCurrentClass(classItem)
      }))
      .filter(classItem => classItem.isCurrent)
  }

  const getCurrentSchedule = () => {
    if (!userSection || !timetableData[userSection.id]) return []
    
    const classes = timetableData[userSection.id][selectedSubjectType]?.[selectedDay] || []
    
    return classes
      .filter(classItem => classItem && classItem.time) // Filter out invalid items
      .map(classItem => ({
        ...classItem,
        isCurrent: isCurrentClass(classItem)
      }))
  }

  const days = [
    { key: "monday", label: "Monday", emoji: "📅" },
    { key: "tuesday", label: "Tuesday", emoji: "📋" },
    { key: "wednesday", label: "Wednesday", emoji: "📊" },
    { key: "thursday", label: "Thursday", emoji: "📝" },
    { key: "friday", label: "Friday", emoji: "🎯" }
  ]

  const getTimeUntilNext = (classItem) => {
    if (!classItem || !classItem.time || !classItem.time.includes('-')) {
      return "N/A"
    }
    
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes()
    const [startTime] = classItem.time.split('-')
    if (!startTime) return "N/A"
    
    const startMinutes = parseTime(startTime + '-00:00')
    const diff = startMinutes - currentMinutes
    
    if (diff < 60) return `${diff} min`
    const hours = Math.floor(diff / 60)
    const minutes = diff % 60
    return `${hours}h ${minutes}m`
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
          <div style={{ 
            color: currentTheme.textPrimary, 
            fontSize: "18px", 
            fontWeight: "600",
            marginBottom: "20px"
          }}>
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
          <div style={{ 
            color: currentTheme.textPrimary, 
            fontSize: "18px", 
            fontWeight: "600",
            marginBottom: "20px"
          }}>
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
              fontSize: "14px"
            }}
          >
            Sign In with Google
          </button>
          {loginError && (
            <div style={{ 
              color: currentTheme.error, 
              fontSize: "14px", 
              marginTop: "10px" 
            }}>
              {loginError}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="timetable-container" style={{ background: currentTheme.background }}>
      {/* Integrated Profile Section */}
      <div className="profile-section">
        {user ? (
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
                color: currentTheme.textPrimary
              }}
            >
              <img
                src={user.photoURL || "/default-profile.png"}
                alt="Profile"
                className="profile-image"
              />
              <span className="profile-name">
                {user.displayName?.split(' ')[0]}
              </span>
            </button>

            {showProfileDropdown && (
              <div 
                className="profile-dropdown"
                style={{
                  background: currentTheme.cardBg,
                  borderWidth: "2px",
                  borderStyle: "solid",
                  borderColor: currentTheme.border,
                  boxShadow: currentTheme.shadow
                }}
              >
                <div className="profile-info">
                  <img
                    src={user.photoURL || "/default-profile.png"}
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
                    <p className="user-section" style={{ color: currentTheme.textMuted }}>
                      Section: {userSection ? userSection.id : "N/A"}
                    </p>
                  </div>
                </div>
                
                <div className="profile-divider" style={{ background: currentTheme.border }}></div>
                
                <div className="profile-actions">
                  <button 
                    className="profile-action timetable"
                    onClick={handleTimetableClick}
                    style={{ color: currentTheme.textPrimary }}
                  >
                    <Calendar size={18} />
                    My Timetable
                  </button>
                  
                  {/* Theme Toggle inside Profile Dropdown */}
                  <button 
                    className="profile-action theme-toggle"
                    onClick={toggleTheme}
                    style={{ color: currentTheme.textPrimary }}
                  >
                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
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
        ) : (
          <button
            className="login-button"
            onClick={handleGoogleSignIn}
            style={{
              background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`,
              boxShadow: currentTheme.shadow
            }}
          >
            <User size={20} />
            Sign In
          </button>
        )}
      </div>

      {/* KiitHub Logo Header */}
      <div 
        className="kiithub-header"
        style={{
          background: currentTheme.cardBg,
          borderWidth: "2px",
          borderStyle: "solid",
          borderColor: currentTheme.border,
          boxShadow: currentTheme.shadow,
        }}
      >
        <div className="kiithub-logo-container">
          <div className="kiithub-logo">
            <div 
              className="logo-icon"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`,
              }}
            >
              <School size={32} color="white" />
            </div>
            <div className="logo-text">
              <h1 style={{ 
                color: currentTheme.textPrimary,
                background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                KiitHub
              </h1>
              <p style={{ color: currentTheme.textMuted }}>
                Your Smart Campus Companion
              </p>
            </div>
          </div>
          <div className="kiithub-tagline">
            <div 
              className="tagline-badge"
              style={{
                background: `${currentTheme.primary}15`,
                borderWidth: "2px",
                borderStyle: "solid",
                borderColor: `${currentTheme.primary}30`,
                color: currentTheme.primary
              }}
            >
              <Zap size={16} />
              Smart Timetable
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div 
        className="nav-bar"
        style={{
          background: currentTheme.cardBg,
          borderWidth: "2px",
          borderStyle: "solid",
          borderColor: currentTheme.border,
          boxShadow: currentTheme.shadow,
        }}
      >
        <button
          className="nav-back-button"
          onClick={handleBackToHome}
          style={{
            background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`,
          }}
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>
        
        <div className="nav-title">
          <h2 style={{ color: currentTheme.textPrimary }}>
            📅 My Timetable
          </h2>
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
              borderColor: `${currentTheme.primary}20`
            }}
          >
            <img
              src={user.photoURL || "/default-profile.png"}
              alt="Profile"
              className="student-avatar"
              style={{
                borderWidth: "3px",
                borderStyle: "solid",
                borderColor: currentTheme.primary
              }}
            />
            <div className="student-details">
              <h3 style={{ color: currentTheme.textPrimary }}>
                {user.displayName}
              </h3>
              <div className="student-info-row">
                <div className="info-item">
                  <User size={16} style={{ color: currentTheme.primary }} />
                  <span style={{ color: currentTheme.textSecondary }}>
                    Roll: {userSection.rollNumber}
                  </span>
                </div>
                <div className="info-item">
                  <GraduationCap size={16} style={{ color: currentTheme.primary }} />
                  <span style={{ color: currentTheme.textSecondary }}>
                    {userSection.name}
                  </span>
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
              <h3 style={{ color: currentTheme.textPrimary }}>
                Current Classes
              </h3>
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
                  className="mini-class-card current"
                  style={{
                    background: `${currentTheme.primary}15`,
                    borderWidth: "2px",
                    borderStyle: "solid",
                    borderColor: `${currentTheme.primary}30`,
                  }}
                >
                  <div className="mini-class-header">
                    <span className="mini-subject" style={{ color: currentTheme.textPrimary }}>
                      📚 {classItem.subject}
                    </span>
                  </div>
                  <div className="mini-class-details">
                    <span style={{ color: currentTheme.textSecondary }}>
                      <Clock size={14} /> {classItem.time}
                    </span>
                    <span style={{ color: currentTheme.textSecondary }}>
                      <MapPin size={14} /> {classItem.room}
                    </span>
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
              <h3 style={{ color: currentTheme.textPrimary }}>
                Upcoming Classes
              </h3>
            </div>
          </div>
          
          <div className="overview-content">
            {getUpcomingClasses().length > 0 ? (
              getUpcomingClasses().map((classItem, index) => (
                <div 
                  key={index}
                  className="mini-class-card upcoming"
                  style={{
                    background: `${currentTheme.secondary}10`,
                    borderWidth: "2px",
                    borderStyle: "solid",
                    borderColor: `${currentTheme.secondary}20`,
                  }}
                >
                  <div className="mini-class-header">
                    <span className="mini-subject" style={{ color: currentTheme.textPrimary }}>
                      📚 {classItem.subject}
                    </span>
                    <div className="class-badges">
                      {classItem.isToday && (
                        <span 
                          className="time-badge"
                          style={{
                            background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`,
                            color: "white",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "12px"
                          }}
                        >
                          {getTimeUntilNext(classItem)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mini-class-details">
                    <span style={{ color: currentTheme.textSecondary }}>
                      <Calendar size={14} /> {classItem.dayLabel}
                    </span>
                    <span style={{ color: currentTheme.textSecondary }}>
                      <Clock size={14} /> {classItem.time}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-classes-mini" style={{ color: currentTheme.textMuted }}>
                <Timer size={24} />
                <p>No upcoming classes</p>
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
          <h3 style={{ color: currentTheme.textPrimary }}>
            👁️ View Mode
          </h3>
          <div className="button-group">
            {[
              { key: "current", label: "Current Day", icon: "📅" },
              { key: "upcoming", label: "Upcoming", icon: "⏰" },
              { key: "all", label: "All Schedule", icon: "📊" }
            ].map((view) => (
              <button
                key={view.key}
                onClick={() => setActiveView(view.key)}
                className={`control-button ${activeView === view.key ? 'active' : ''}`}
                style={{
                  borderWidth: "2px",
                  borderStyle: "solid",
                  borderColor: currentTheme.border,
                  background: activeView === view.key 
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
              <h3 style={{ color: currentTheme.textPrimary }}>
                📚 Subject Type
              </h3>
              <div className="button-group">
                {[
                  { key: "coreSubjects", label: "Core Subjects", icon: "📖" },
                  { key: "electiveSubjects", label: "Elective Subjects", icon: "⭐" }
                ].map((type) => (
                  <button
                    key={type.key}
                    onClick={() => setSelectedSubjectType(type.key)}
                    className={`control-button ${selectedSubjectType === type.key ? 'active' : ''}`}
                    style={{
                      borderWidth: "2px",
                      borderStyle: "solid",
                      borderColor: currentTheme.border,
                      background: selectedSubjectType === type.key 
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
              <h3 style={{ color: currentTheme.textPrimary }}>
                📆 Select Day
              </h3>
              <div className="button-group">
                {days.map((day) => (
                  <button
                    key={day.key}
                    onClick={() => setSelectedDay(day.key)}
                    className={`control-button ${selectedDay === day.key ? 'active' : ''}`}
                    style={{
                      borderWidth: "2px",
                      borderStyle: "solid",
                      borderColor: currentTheme.border,
                      background: selectedDay === day.key 
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

          {getCurrentClasses().length > 0 ? (
            <div className="schedule-grid">
              {getCurrentClasses().map((classItem, index) => (
                <div
                  key={index}
                  className="class-card current-class"
                  style={{
                    background: `${currentTheme.primary}15`,
                    borderWidth: "2px",
                    borderStyle: "solid",
                    borderColor: `${currentTheme.primary}30`,
                  }}
                >
                  <div className="class-header">
                    <h4 style={{ color: currentTheme.textPrimary }}>
                      📚 {classItem.subject}
                    </h4>
                    <div className="class-actions">
                      <div 
                        className="time-badge current"
                        style={{
                          background: `linear-gradient(135deg, ${currentTheme.error} 0%, ${currentTheme.warning} 100%)`,
                        }}
                      >
                        <Clock size={14} />
                        {classItem.time}
                        <span className="live-indicator-small">LIVE</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="class-details">
                    <div className="detail-item">
                      <MapPin size={16} style={{ color: currentTheme.primary }} />
                      <span style={{ color: currentTheme.textSecondary }}>
                        {classItem.room}
                      </span>
                    </div>
                    <div className="detail-item">
                      <User size={16} style={{ color: currentTheme.primary }} />
                      <span style={{ color: currentTheme.textSecondary }}>
                        {classItem.faculty}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-classes" style={{ color: currentTheme.textMuted }}>
              <BookOpen size={48} />
              <p>No classes running right now</p>
              <p>Time to relax! 🎉</p>
            </div>
          )}
        </div>
      )}

      {activeView === "upcoming" && (
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
            ⏰ Upcoming Classes
          </h3>

          {getUpcomingClasses().length > 0 ? (
            <div className="schedule-grid">
              {getUpcomingClasses().map((classItem, index) => (
                <div
                  key={index}
                  className="class-card upcoming-class"
                  style={{
                    background: `${currentTheme.secondary}10`,
                    borderWidth: "2px",
                    borderStyle: "solid",
                    borderColor: `${currentTheme.secondary}20`,
                  }}
                >
                  <div className="class-header">
                    <h4 style={{ color: currentTheme.textPrimary }}>
                      📚 {classItem.subject}
                    </h4>
                    <div className="class-actions">
                      <div 
                        className="time-badge upcoming"
                        style={{
                          background: `linear-gradient(135deg, ${currentTheme.secondary} 0%, ${currentTheme.accent} 100%)`,
                        }}
                      >
                        <Clock size={14} />
                        {classItem.time}
                        {classItem.isToday && (
                          <span className="countdown-badge">
                            in {getTimeUntilNext(classItem)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="class-details">
                    <div className="detail-item">
                      <Calendar size={16} style={{ color: currentTheme.secondary }} />
                      <span style={{ color: currentTheme.textSecondary }}>
                        {classItem.dayLabel}
                      </span>
                    </div>
                    <div className="detail-item">
                      <MapPin size={16} style={{ color: currentTheme.secondary }} />
                      <span style={{ color: currentTheme.textSecondary }}>
                        {classItem.room}
                      </span>
                    </div>
                    <div className="detail-item">
                      <User size={16} style={{ color: currentTheme.secondary }} />
                      <span style={{ color: currentTheme.textSecondary }}>
                        {classItem.faculty}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-classes" style={{ color: currentTheme.textMuted }}>
              <Timer size={48} />
              <p>No upcoming classes</p>
              <p>All caught up! 🎉</p>
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
            🕐 {days.find(d => d.key === selectedDay)?.label} Schedule - {selectedSubjectType === "coreSubjects" ? "Core Subjects" : "Elective Subjects"}
          </h3>

          {getCurrentSchedule().length > 0 ? (
            <div className="schedule-grid">
              {getCurrentSchedule().map((classItem, index) => (
                <div
                  key={index}
                  className={`class-card ${classItem.isCurrent ? 'current-class' : ''}`}
                  style={{
                    background: classItem.isCurrent 
                      ? `${currentTheme.primary}15` 
                      : `${currentTheme.primary}08`,
                    borderWidth: "2px",
                    borderStyle: "solid",
                    borderColor: classItem.isCurrent 
                      ? `${currentTheme.primary}30` 
                      : `${currentTheme.primary}20`,
                  }}
                >
                  <div className="class-header">
                    <h4 style={{ color: currentTheme.textPrimary }}>
                      📚 {classItem.subject}
                    </h4>
                    <div className="class-actions">
                      <div 
                        className={`time-badge ${classItem.isCurrent ? 'current' : ''}`}
                        style={{
                          background: classItem.isCurrent 
                            ? `linear-gradient(135deg, ${currentTheme.error} 0%, ${currentTheme.warning} 100%)`
                            : `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`,
                        }}
                      >
                        <Clock size={14} />
                        {classItem.time}
                        {classItem.isCurrent && (
                          <span className="live-indicator-small">LIVE</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="class-details">
                    <div className="detail-item">
                      <MapPin size={16} style={{ color: currentTheme.primary }} />
                      <span style={{ color: currentTheme.textSecondary }}>
                        {classItem.room}
                      </span>
                    </div>
                    <div className="detail-item">
                      <User size={16} style={{ color: currentTheme.primary }} />
                      <span style={{ color: currentTheme.textSecondary }}>
                        {classItem.faculty}
                      </span>
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