"use client"
import { useEffect, useState } from "react"
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import { auth, provider } from "../lib/firebase"
import { loadSubjectsFromStorage } from "../lib/storageHelpers"

// Import Components
import ProfileSection from "../components/ProfileSection/ProfileSection"
import HistorySidebar from "../components/HistorySidebar/HistorySidebar"
import CategorySelector from "../components/CategorySelector/CategorySelector"
import SearchBox from "../components/SearchBox/SearchBox"
import BrowseMethod from "../components/BrowseMethod/BrowseMethod"
import FeatureGrid from "../components/FeatureGrid/FeatureGrid"
import LoginPrompt from "../components/LoginPrompt/LoginPrompt"
import HeroSection from "../components/HeroSection/HeroSection"
import TestimonialsSection from "../components/TestimonialsSection/TestimonialsSection"
import FacultyReviewSection from "../components/FacultyReviewSection/FacultyReviewSection"
import SectionSwappingSection from "../components/SectionSwappingSection/SectionSwappingSection"
import Footer from "../components/Footer/Footer"
import NotificationToast from "../components/NotificationToast/NotificationToast"
import LoadingScreen from "../components/LoadingScreen/LoadingScreen"

export default function Home() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [isHistorySidebarOpen, setIsHistorySidebarOpen] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])
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

  // Silent loading states - no popup
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [dataError, setDataError] = useState(null)
  const [totalFiles, setTotalFiles] = useState(0)

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

  // Authentication state management
  useEffect(() => {
    if (!auth) {
      setAuthLoading(false)
      setIsLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser?.email || "No user")
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
        loadSubjectsFromStorageAsync()
      } else if (currentUser) {
        console.log("Invalid email domain, signing out:", currentUser.email)
        signOut(auth)
        setLoginError("Please use your KIIT Gmail account (@kiit.ac.in) to sign in")
        setUser(null)
      } else {
        console.log("No user signed in.")
        setUser(null)
      }
      setAuthLoading(false)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // SILENT loading - no popup, just background loading
  const loadSubjectsFromStorageAsync = async () => {
    setIsLoadingData(true)
    setDataError(null)

    try {
      console.log("🔄 Silent loading subjects from Firebase Storage...")
      const result = await loadSubjectsFromStorage()

      if (result.error) {
        setDataError(result.error)
        setSubjectsData({})
        setTotalFiles(0)
        showNotification(`Error loading data: ${result.error}`, "error")
      } else {
        setSubjectsData(result.data || {})
        setTotalFiles(result.totalFiles || 0)
        localStorage.setItem("subjectsData", JSON.stringify(result.data || {}))

        if (result.totalFiles > 0) {
          showNotification(`🚀 Loaded ${result.totalFiles} study materials silently!`, "success")
          console.log("✅ Successfully loaded subjects from storage")
        } else {
          showNotification("No study materials found in Firebase Storage", "warning")
        }
      }
    } catch (error) {
      console.error("❌ Error loading subjects from storage:", error)
      setDataError(error.message)
      setSubjectsData({})
      setTotalFiles(0)
      showNotification(`Failed to load data: ${error.message}`, "error")
    } finally {
      setIsLoadingData(false)
    }
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
      setShowLoginPrompt(false)
      setHasInteracted(true)
      showNotification(`Welcome, ${currentUser.displayName?.split(" ")[0]}!`, "success")
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
      setShowLoginPrompt(false)
      showNotification("Successfully signed out!", "info")
    } catch (error) {
      console.error("Error signing out:", error)
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

  useEffect(() => {
    if (!authLoading && !user && hasInteracted) {
      setShowLoginPrompt(true)
    }
  }, [authLoading, user, hasInteracted])

  // Load data on component mount
  useEffect(() => {
    loadSubjectsFromStorageAsync()
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
      />

      <HistorySidebar
        isOpen={isHistorySidebarOpen}
        setIsOpen={setIsHistorySidebarOpen}
        searchHistory={searchHistory}
        theme={currentTheme}
        user={user}
        setShowLoginPrompt={setShowLoginPrompt}
      />

      <HeroSection user={user} theme={currentTheme} />

      <div className="main-content">
        {/* Enhanced Method Toggle */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "50px",
            gap: "20px",
          }}
        >
          <button
            onClick={() => setActiveMethod("search")}
            style={{
              padding: "16px 32px",
              borderRadius: "16px",
              border: `2px solid ${currentTheme.border}`,
              background:
                activeMethod === "search"
                  ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
                  : currentTheme.glassBg,
              color: activeMethod === "search" ? "white" : currentTheme.textPrimary,
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              fontSize: "16px",
              boxShadow: activeMethod === "search" ? currentTheme.shadow : "none",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            🔍 Search Method
          </button>
          <button
            onClick={() => setActiveMethod("browse")}
            style={{
              padding: "16px 32px",
              borderRadius: "16px",
              border: `2px solid ${currentTheme.border}`,
              background:
                activeMethod === "browse"
                  ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
                  : currentTheme.glassBg,
              color: activeMethod === "browse" ? "white" : currentTheme.textPrimary,
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              fontSize: "16px",
              boxShadow: activeMethod === "browse" ? currentTheme.shadow : "none",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            📂 Browse Method
          </button>
        </div>

        {activeMethod === "search" ? (
          <>
            <CategorySelector
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              theme={currentTheme}
              user={user}
              setShowLoginPrompt={setShowLoginPrompt}
            />
            <SearchBox
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              showSuggestions={showSuggestions}
              setShowSuggestions={setShowSuggestions}
              suggestions={suggestions}
              setSuggestions={setSuggestions}
              subjectsData={subjectsData}
              selectedCategory={selectedCategory}
              theme={currentTheme}
              user={user}
              setShowLoginPrompt={setShowLoginPrompt}
              setSearchHistory={setSearchHistory}
              searchHistory={searchHistory}
              setHasInteracted={setHasInteracted}
              isLoadingData={isLoadingData}
              dataError={dataError}
              totalFiles={totalFiles}
            />
          </>
        ) : (
          <BrowseMethod
            subjectsData={subjectsData}
            theme={currentTheme}
            user={user}
            setShowLoginPrompt={setShowLoginPrompt}
            showNotification={showNotification}
            setHasInteracted={setHasInteracted}
          />
        )}

        <FeatureGrid
          theme={currentTheme}
          user={user}
          setShowLoginPrompt={setShowLoginPrompt}
          showNotification={showNotification}
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

      {/* Small loading indicator in corner instead of popup */}
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
            Loading silently...
          </span>
        </div>
      )}
    </div>
  )
}
