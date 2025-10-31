"use client"

import { useEffect, useState } from "react"
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import { collection, onSnapshot } from "firebase/firestore"
import { auth, provider, db } from "../lib/firebase"

import { initializePageSecurity } from "../lib/page-security"

// Import Components
import ProfileSection from "../components/ProfileSection/ProfileSection"
import FeatureGrid from "../components/FeatureGrid/FeatureGrid"
import LoginPrompt from "../components/LoginPrompt/LoginPrompt"
import HeroSection from "../components/HeroSection/HeroSection"
import TestimonialsSection from "../components/TestimonialsSection/TestimonialsSection"
import FacultyReviewSection from "../components/FacultyReviewSection/FacultyReviewSection"
import SectionSwappingSection from "../components/SectionSwappingSection/SectionSwappingSection"
import Footer from "../components/Footer/Footer"
import NotificationToast from "../components/NotificationToast/NotificationToast"
import LoadingScreen from "../components/LoadingScreen/LoadingScreen"
import SearchInterface from "../components/SearchBox/SearchBox"
import BrowseInterface from "../components/BrowseMethod/BrowseMethod"

export default function Home() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [subjectsData, setSubjectsData] = useState({})
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchInput, setSearchInput] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [hasInteracted, setHasInteracted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [notification, setNotification] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [activeMethod, setActiveMethod] = useState("search")
  const [isAnimating, setIsAnimating] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [dataError, setDataError] = useState(null)
  const [totalFiles, setTotalFiles] = useState(0)
  const [realtimeListeners, setRealtimeListeners] = useState([])

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

  useEffect(() => {
    initializePageSecurity()
  }, [])

  const setupRealtimeListeners = () => {
    if (!db) {
      setDataError("Service temporarily unavailable")
      showNotification("Service temporarily unavailable", "error")
      return
    }

    setIsLoadingData(true)
    setDataError(null)

    try {
      const collectionNames = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "Routine"]
      const listeners = []
      const combinedData = {}
      let completedCollections = 0

      const updateCombinedData = () => {
        let fileCount = 0

        Object.values(combinedData).forEach((semesterData) => {
          if (semesterData && typeof semesterData === "object") {
            Object.values(semesterData).forEach((subjectData) => {
              if (subjectData && typeof subjectData === "object") {
                Object.values(subjectData).forEach((categoryData) => {
                  if (categoryData && typeof categoryData === "object") {
                    Object.values(categoryData).forEach((url) => {
                      if (typeof url === "string" && url.trim() !== "") {
                        fileCount++
                      }
                    })
                  }
                })
              }
            })
          }
        })

        setSubjectsData({ ...combinedData })
        setTotalFiles(fileCount)

        if (completedCollections === collectionNames.length) {
          setIsLoadingData(false)
          if (fileCount > 0) {
            showNotification(`Real-time sync active! ${fileCount} study materials loaded`, "success")
          }
        }
      }

      collectionNames.forEach((collectionName) => {
        const unsubscribe = onSnapshot(
          collection(db, collectionName),
          (querySnapshot) => {
            const semesterData = {}
            querySnapshot.forEach((doc) => {
              const subjectName = doc.id
              const subjectCategories = doc.data()

              if (subjectCategories && typeof subjectCategories === "object") {
                semesterData[subjectName] = subjectCategories
              }
            })

            combinedData[`${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)}`] = semesterData
            completedCollections++

            updateCombinedData()
          },
          (error) => {
            completedCollections++
            if (completedCollections === collectionNames.length) {
              setIsLoadingData(false)
            }
          },
        )

        listeners.push(unsubscribe)
      })

      setRealtimeListeners(listeners)
    } catch (error) {
      setDataError(sanitizeError(error))
      setSubjectsData({})
      setTotalFiles(0)
      setIsLoadingData(false)
      showNotification("Service error occurred", "error")
    }
  }

  const cleanupListeners = () => {
    realtimeListeners.forEach((unsubscribe) => {
      if (typeof unsubscribe === "function") {
        unsubscribe()
      }
    })
    setRealtimeListeners([])
  }

  const refreshSubjectsData = async () => {
    showNotification("Refreshing real-time connection...", "info")
    cleanupListeners()
    setTimeout(() => {
      setupRealtimeListeners()
    }, 1000)
  }

  const handleMethodChange = (method) => {
    setIsAnimating(true)
    setTimeout(() => {
      setActiveMethod(method)
      setIsAnimating(false)
    }, 200)
  }

  useEffect(() => {
    if (!auth) {
      setAuthLoading(false)
      setIsLoading(false)
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
        setLoginError("")
        setShowLoginPrompt(false)
      } else if (currentUser) {
        signOut(auth)
        setLoginError("Please use your KIIT Gmail account (@kiit.ac.in) to sign in")
        setUser(null)
      } else {
        setUser(null)
      }
      setAuthLoading(false)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

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
      setShowLoginPrompt(false)
      setHasInteracted(true)
      showNotification(`Welcome, ${currentUser.displayName?.split(" ")[0]}!`, "success")
    } catch (error) {
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
      setShowLoginPrompt(false)
      showNotification("Successfully signed out!", "info")
    } catch (error) {
      showNotification("Error signing out. Please try again.", "error")
    }
  }

  const showNotification = (message, type = "info") => {
    setNotification({ message, type, id: Date.now() })
    setTimeout(() => setNotification(null), 4000)
  }

  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    localStorage.setItem("theme", newTheme ? "dark" : "light")
    showNotification(`Switched to ${newTheme ? "dark" : "light"} mode`, "success")
  }

  const openPaper = (subject, category, year) => {
    if (!user) {
      setShowLoginPrompt(true)
      return
    }

    const formattedSubject = subject.trim()
    let foundUrl = null

    for (const semesterKey in subjectsData) {
      if (subjectsData[semesterKey] && typeof subjectsData[semesterKey] === "object") {
        const semesterSubjects = subjectsData[semesterKey]
        if (semesterSubjects[formattedSubject]) {
          const subjectData = semesterSubjects[formattedSubject]
          if (subjectData[category]) {
            const categoryData = subjectData[category]
            const keys = Object.keys(categoryData)
            const matchKey =
              keys.find((key) => key.toLowerCase() === year.toLowerCase()) ||
              keys.find((key) => year.toLowerCase().includes(key.toLowerCase())) ||
              keys.find((key) => key.toLowerCase().includes(year.toLowerCase()))

            if (matchKey) {
              foundUrl = categoryData[matchKey]
              break
            }
          }
        }
      }
    }

    if (foundUrl && typeof foundUrl === "string" && foundUrl.trim() !== "") {
      const previewUrl = getPreviewLink(foundUrl)
      const fileUrl = encodeURIComponent(previewUrl)
      const fileTitle = encodeURIComponent(`${formattedSubject} - ${category} - ${year}`)
      window.open(`/viewer?url=${fileUrl}&title=${fileTitle}`, "_blank")
      showNotification(`Opening: ${formattedSubject} - ${category} - ${year}`, "success")
    } else {
      showNotification("Paper not found or URL is invalid for this subject/category/year.", "error")
    }
  }

  const getPreviewLink = (fullUrl) => {
    const match = fullUrl.match(/(?:id=|\/d\/)([-\w]{25,})/)
    if (match) {
      return `https://drive.google.com/file/d/${match[1]}/preview`
    }
    return fullUrl
  }

  useEffect(() => {
    if (!authLoading && !user && hasInteracted) {
      setShowLoginPrompt(true)
    }
  }, [authLoading, user, hasInteracted])

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark")
    }
  }, [])

  useEffect(() => {
    setupRealtimeListeners()

    return () => {
      cleanupListeners()
    }
  }, [])

  if (isLoading) {
    return <LoadingScreen theme={currentTheme} />
  }

  return (
    <div className={`app ${isDarkMode ? "dark" : "light"}`} style={{ background: currentTheme.background }}>
      <ProfileSection
        user={user}
        showProfileDropdown={showProfileDropdown}
        setShowProfileDropdown={setShowProfileDropdown}
        handleSignOut={handleSignOut}
        handleGoogleSignIn={handleGoogleSignIn}
        theme={currentTheme}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        refreshData={refreshSubjectsData}
      />

      <HeroSection user={user} theme={currentTheme} />

      <div className="main-content">
        <div className="method-toggle-container">
          <div className="toggle-background">
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>
          </div>

          <div className="toggle-wrapper">
            <button
              onClick={() => handleMethodChange("search")}
              className={`method-button search-button ${activeMethod === "search" ? "active" : ""}`}
            >
              <div className="button-content">
                <div className="icon-wrapper">
                  <span className="method-icon">🔍</span>
                </div>
                <div className="text-content">
                  <span className="method-title">Smart Search</span>
                  <span className="method-subtitle">Find specific materials</span>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleMethodChange("browse")}
              className={`method-button browse-button ${activeMethod === "browse" ? "active" : ""}`}
            >
              <div className="button-content">
                <div className="icon-wrapper">
                  <span className="method-icon">📂</span>
                </div>
                <div className="text-content">
                  <span className="method-title">Browse All</span>
                  <span className="method-subtitle">Explore all subjects</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {activeMethod === "search" ? (
          <SearchInterface
            theme={currentTheme}
            subjectsData={subjectsData}
            openPaper={openPaper}
            user={user}
            setShowLoginPrompt={setShowLoginPrompt}
            showNotification={showNotification}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            isLoadingData={isLoadingData}
            dataError={dataError}
            totalFiles={totalFiles}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            suggestions={suggestions}
            setSuggestions={setSuggestions}
            showSuggestions={showSuggestions}
            setShowSuggestions={setShowSuggestions}
          />
        ) : (
          <BrowseInterface
            theme={currentTheme}
            subjectsData={subjectsData}
            openPaper={openPaper}
            user={user}
            setShowLoginPrompt={setShowLoginPrompt}
            showNotification={showNotification}
          />
        )}

        <FeatureGrid
          theme={currentTheme}
          user={user}
          setShowLoginPrompt={setShowLoginPrompt}
          showNotification={showNotification}
          subjectsData={subjectsData}
          openPaper={openPaper}
        />
        <FacultyReviewSection theme={currentTheme} />
        <SectionSwappingSection theme={currentTheme} />
        <TestimonialsSection theme={currentTheme} />
      </div>

      <Footer theme={currentTheme} />

      {showLoginPrompt && !user && !authLoading && (
        <LoginPrompt
          onClose={() => setShowLoginPrompt(false)}
          onSignIn={handleGoogleSignIn}
          error={loginError}
          theme={currentTheme}
        />
      )}

      {notification && (
        <NotificationToast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
          theme={currentTheme}
        />
      )}

      {isLoadingData && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: currentTheme.cardBg,
            padding: "12px 16px",
            borderRadius: "12px",
            border: `2px solid ${currentTheme.border}`,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            zIndex: 1000,
            boxShadow: currentTheme.shadow,
          }}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              border: `2px solid ${currentTheme.primary}20`,
              borderTop: `2px solid ${currentTheme.primary}`,
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <span style={{ color: currentTheme.textPrimary, fontSize: "14px", fontWeight: "500" }}>
            Real-time sync active...
          </span>
        </div>
      )}

      <style jsx>{`
        .app {
          width: 100%;
          min-height: 100vh;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          box-sizing: border-box;
          overflow-y: hidden;
        }

        .main-content {
          width: 100%;
          max-width: 100vw;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        .method-toggle-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 40px auto 60px auto;
          padding: 0 20px;
          width: 100%;
          max-width: 1200px;
          box-sizing: border-box;
        }

        .toggle-background {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 600px;
          height: 140px;
          pointer-events: none;
          overflow: hidden;
        }

        .floating-orb {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, ${currentTheme.primary}20, ${currentTheme.secondary}10);
          animation: float 8s ease-in-out infinite;
          filter: blur(2px);
          opacity: 0.6;
        }

        .orb-1 {
          width: 80px;
          height: 80px;
          top: 20px;
          left: 15%;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 60px;
          height: 60px;
          top: 40px;
          right: 20%;
          animation-delay: 2s;
        }

        .orb-3 {
          width: 40px;
          height: 40px;
          bottom: 20px;
          left: 65%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
          33% { transform: translateY(-10px) rotate(120deg); opacity: 0.6; }
          66% { transform: translateY(5px) rotate(240deg); opacity: 0.3; }
        }

        .toggle-wrapper {
          position: relative;
          display: flex;
          background: ${currentTheme.glassBg};
          backdrop-filter: blur(25px);
          border: 2px solid ${currentTheme.border};
          border-radius: 28px;
          padding: 10px;
          box-shadow: ${currentTheme.shadow}, inset 0 1px 0 rgba(255, 255, 255, 0.1);
          overflow: hidden;
          width: fit-content;
          max-width: calc(100vw - 40px);
        }

        .method-button {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 36px;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 18px;
          min-width: 200px;
          overflow: hidden;
        }

        .button-content {
          display: flex;
          align-items: center;
          gap: 18px;
          position: relative;
          z-index: 2;
        }

        .icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
        }

        .method-icon {
          font-size: 28px;
          transition: all 0.4s ease;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1)) grayscale(0.5);
          opacity: 0.7;
        }

        .text-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
        }

        .method-title {
          font-size: 18px;
          font-weight: 800;
          line-height: 1.2;
          transition: all 0.4s ease;
          letter-spacing: -0.5px;
          color: ${currentTheme.textMuted};
        }

        .method-subtitle {
          font-size: 13px;
          font-weight: 600;
          opacity: 0.85;
          transition: all 0.4s ease;
          letter-spacing: 0.2px;
          color: ${currentTheme.warning};
        }

        .method-button.active {
          background: ${currentTheme.primary};
          color: white;
          opacity: 1;
          transform: scale(1.02);
        }

        .method-button.active .method-icon {
          filter: none;
          opacity: 1;
        }

        .method-button.active .method-title {
          color: white;
        }

        .method-button.active .method-subtitle {
          color: rgba(255, 255, 255, 0.9);
        }

        .method-button:not(.active):hover {
          background: ${currentTheme.primary}10;
          transform: translateY(-2px);
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .method-toggle-container {
            margin: 30px auto 50px auto;
            padding: 0 16px;
          }

          .toggle-wrapper {
            flex-direction: column;
            width: 100%;
            max-width: 350px;
            padding: 8px;
          }

          .method-button {
            width: 100%;
            min-width: unset;
            padding: 20px 28px;
            justify-content: flex-start;
          }

          .button-content {
            gap: 16px;
          }

          .method-title {
            font-size: 16px;
          }

          .method-subtitle {
            font-size: 12px;
          }

          .method-icon {
            font-size: 24px;
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
