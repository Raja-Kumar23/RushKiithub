"use client"
import { useEffect, useState } from "react"
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import { collection, getDocs } from "firebase/firestore"
import { History } from "lucide-react"
import { auth, db, provider } from "../lib/firebase" // Import from centralized file

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
  const [hasInteracted, setHasInteracted] = useState(false) // State to track user interaction
  const [isLoading, setIsLoading] = useState(true)
  const [notification, setNotification] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [activeMethod, setActiveMethod] = useState("search")

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

  // // Load theme preference and search history
  // useEffect(() => {
  //   const savedTheme = localStorage.getItem("theme")
  //   if (savedTheme === "dark") {
  //     setIsDarkMode(true)
  //   }

  //   const history = JSON.parse(localStorage.getItem("searchHistory")) || []
  //   setSearchHistory(history)
  // }, [])

  // Authentication state management with Firebase persistence
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
        setShowLoginPrompt(false) // Hide prompt if user successfully authenticated

        loadSubjects() // Load subjects only when a valid user is authenticated
      } else if (currentUser) {
        // Invalid email domain
        console.log("Invalid email domain, signing out:", currentUser.email)
        signOut(auth) // Sign out the invalid user
        setLoginError("Please use your KIIT Gmail account (@kiit.ac.in) to sign in")
        setUser(null) // Clear user state
      } else {
        // No user signed in
        console.log("No user signed in.")
        setUser(null) // Clear user state
      }

      setAuthLoading(false) // Auth check is complete
      setIsLoading(false) // Initial loading is complete
    })

    return () => unsubscribe()
  }, []) // Dependencies: auth (should be stable after initial render)

  const loadSubjects = async () => {
    if (!db) {
      const sampleData = {
        first: {
          Mathematics: {
            Syllabus: "https://drive.google.com/file/d/1d1Tftn_oZJjCYaqZjA_PlOusp=drive_link",
            Notes: "https://drive.google.com/file/d/1d1Tftn_oZJjCYaqZjA_PlOusp=drive_link",
            "Mid Sem Papers": "https://drive.google.com/file/d/1d1Tftn_oZJjCYaqZjA_PlOusp=drive_link",
            "End Sem Papers": "https://drive.google.com/file/d/1d1Tftn_oZJjCYaqZjA_PlOusp=drive_link",
          },
          Physics: {
            Syllabus: "https://drive.google.com/file/d/1d1Tftn_oZJjCYaqZjA_PlOusp=drive_link",
            Notes: "https://drive.google.com/file/d/1d1Tftn_oZJjCYaqZjA_PlOusp=drive_link",
            "Mid Sem Papers": "https://drive.google.com/file/d/1d1Tftn_oZJjCYaqZjA_PlOusp=drive_link",
            "End Sem Papers": "https://drive.google.com/file/d/1d1Tftn_oZJjCYaqZjA_PlOusp=drive_link",
          },
          Chemistry: {
            Syllabus: "https://drive.google.com/file/d/1d1Tftn_oZJjCYaqZjA_PlOusp=drive_link",
            Notes: "https://drive.google.com/file/d/1d1Tftn_oZJjCYaqZjA_PlOusp=drive_link",
            "Mid Sem Papers": "https://drive.google.com/file/d/1d1Tftn_oZJjCYaqZjA_PlOusp=drive_link",
            "End Sem Papers": "https://drive.google.com/file/d/1d1Tftn_oZJjCYaqZjA_PlOusp=drive_link",
          },
        },
        second: {
          Mathematics: {
            Syllabus: "https://drive.google.com/file/d/1d1Tftn_oZJjCYaqZjA_PlOusp=drive_link",
            Notes: "https://drive.google.com/file/d/1d1Tftn_oZJjCYaqZjA_PlOusp=drive_link",
            "Mid Sem Papers": "https://drive.google.com/file/d/1d1Tftn_oZJjCYaqZjA_PlOusp=drive_link",
            "End Sem Papers": "https://drive.google.com/file/d/1d1Tftn_oZJjCYaqZjA_PlOusp=drive_link",
          },
          "Computer Science": {
            Syllabus: "https://drive.google.com/file/d/1d1Tftn_oZJjCYaqZjA_PlOusp=drive_link",
            Notes: "https://drive.google.com/file/d/1d1Tftn_oZJjCYaqZjA_PlOusp=drive_link",
            "Mid Sem Papers": "https://drive.google.com/file/d/1d1Tftn_oZJjCYaqZjA_PlOusp=drive_link",
            "End Sem Papers": "https://drive.google.com/file/d/1d1Tftn_oZJjCYaqZjA_PlOusp=drive_link",
          },
        },
      }
      setSubjectsData(sampleData)
      return
    }

    try {
      const collections = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth"]
      const data = {}
      for (const collectionName of collections) {
        const collectionRef = collection(db, collectionName)
        const querySnapshot = await getDocs(collectionRef)
        const collectionData = {}

        querySnapshot.forEach((doc) => {
          collectionData[doc.id] = doc.data()
        })

        if (Object.keys(collectionData).length > 0) {
          data[collectionName] = collectionData
        }
      }
      setSubjectsData(data)
      localStorage.setItem("subjectsData", JSON.stringify(data))
    } catch (error) {
      console.error("Error loading subjects:", error)
      const sampleData = {
        first: {
          Mathematics: {
            Syllabus: "sample-link-1",
            Notes: "sample-link-2",
          },
        },
      }
      setSubjectsData(sampleData)
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
      setHasInteracted(true) // User has interacted by trying to sign in

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

  // Simplified isAuthenticated: relies solely on the 'user' state
  const isAuthenticated = () => {
    return !!user
  }

  // This effect ensures the login prompt is shown if no user is authenticated
  // and the auth check is complete, and the user has interacted.
  useEffect(() => {
    if (!authLoading && !user && hasInteracted) {
      setShowLoginPrompt(true)
    }
  }, [authLoading, user, hasInteracted])

  useEffect(() => {
    loadSubjects()
  }, [])

  if (isLoading) {
    return <LoadingScreen theme={currentTheme} />
  }

  return (
    <div className={`app ${isDarkMode ? "dark" : "light"}`} style={{ background: currentTheme.background }}>
      {/* History Button
      <button
        onClick={() => setIsHistorySidebarOpen(true)}
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          zIndex: 1001,
          background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`,
          color: "white",
          border: "none",
          padding: "14px 18px",
          borderRadius: "14px",
          cursor: "pointer",
          fontWeight: "600",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: currentTheme.shadow,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "14px",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "translateY(-3px) scale(1.05)"
          e.target.style.boxShadow = `0 25px 60px ${currentTheme.primary}40`
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateY(0)"
          e.target.style.boxShadow = currentTheme.shadow
        }}
      >
        <History size={20} />
        History
      </button> */}

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
            onMouseEnter={(e) => {
              if (activeMethod !== "search") {
                e.target.style.transform = "translateY(-2px)"
                e.target.style.background = `${currentTheme.primary}20`
              }
            }}
            onMouseLeave={(e) => {
              if (activeMethod !== "search") {
                e.target.style.transform = "translateY(0)"
                e.target.style.background = currentTheme.glassBg
              }
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
            onMouseEnter={(e) => {
              if (activeMethod !== "browse") {
                e.target.style.transform = "translateY(-2px)"
                e.target.style.background = `${currentTheme.primary}20`
              }
            }}
            onMouseLeave={(e) => {
              if (activeMethod !== "browse") {
                e.target.style.transform = "translateY(0)"
                e.target.style.background = currentTheme.glassBg
              }
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
              setHasInteracted={setHasInteracted} // Pass setHasInteracted
            />
          </>
        ) : (
          <BrowseMethod
            subjectsData={subjectsData}
            theme={currentTheme}
            user={user}
            setShowLoginPrompt={setShowLoginPrompt}
            showNotification={showNotification}
            setHasInteracted={setHasInteracted} // Pass setHasInteracted
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
      {showLoginPrompt &&
        !user &&
        !authLoading && ( // Updated condition
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
    </div>
  )
}
