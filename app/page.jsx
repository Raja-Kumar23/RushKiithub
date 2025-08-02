// "use client"
// import { useEffect, useState } from "react"
// import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
// import { auth, provider } from "../lib/firebase"
// import { loadSubjectsFromStorage } from "../lib/storageHelpers"

// // Import Components
// import ProfileSection from "../components/ProfileSection/ProfileSection"
// import HistorySidebar from "../components/HistorySidebar/HistorySidebar"
// import FeatureGrid from "../components/FeatureGrid/FeatureGrid"
// import LoginPrompt from "../components/LoginPrompt/LoginPrompt"
// import HeroSection from "../components/HeroSection/HeroSection"
// import TestimonialsSection from "../components/TestimonialsSection/TestimonialsSection"
// import FacultyReviewSection from "../components/FacultyReviewSection/FacultyReviewSection"
// import SectionSwappingSection from "../components/SectionSwappingSection/SectionSwappingSection"
// import Footer from "../components/Footer/Footer"
// import NotificationToast from "../components/NotificationToast/NotificationToast"
// import LoadingScreen from "../components/LoadingScreen/LoadingScreen"

// export default function Home() {
//   const [user, setUser] = useState(null)
//   const [authLoading, setAuthLoading] = useState(true)
//   const [isHistorySidebarOpen, setIsHistorySidebarOpen] = useState(false)
//   const [searchHistory, setSearchHistory] = useState([])
//   const [subjectsData, setSubjectsData] = useState({})
//   const [selectedCategory, setSelectedCategory] = useState(null)
//   const [searchInput, setSearchInput] = useState("")
//   const [suggestions, setSuggestions] = useState([])
//   const [showSuggestions, setShowSuggestions] = useState(false)
//   const [showProfileDropdown, setShowProfileDropdown] = useState(false)
//   const [showLoginPrompt, setShowLoginPrompt] = useState(false)
//   const [loginError, setLoginError] = useState("")
//   const [hasInteracted, setHasInteracted] = useState(false)
//   const [isLoading, setIsLoading] = useState(true)
//   const [notification, setNotification] = useState(null)
//   const [isDarkMode, setIsDarkMode] = useState(true)
//   const [activeMethod, setActiveMethod] = useState("search")
//   const [isAnimating, setIsAnimating] = useState(false)
//   // Silent loading states - no popup
//   const [isLoadingData, setIsLoadingData] = useState(false)
//   const [dataError, setDataError] = useState(null)
//   const [totalFiles, setTotalFiles] = useState(0)

//   // Enhanced Theme Configuration
//   const theme = {
//     light: {
//       primary: "#22c55e",
//       secondary: "#16a34a",
//       accent: "#15803d",
//       success: "#10b981",
//       warning: "#f59e0b",
//       error: "#ef4444",
//       background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 30%, #bbf7d0 70%, #a7f3d0 100%)",
//       cardBg: "rgba(255, 255, 255, 0.95)",
//       textPrimary: "#1f2937",
//       textSecondary: "#374151",
//       textMuted: "#6b7280",
//       border: "rgba(34, 197, 94, 0.2)",
//       shadow: "0 20px 60px rgba(34, 197, 94, 0.15)",
//       glassBg: "rgba(255, 255, 255, 0.4)",
//     },
//     dark: {
//       primary: "#22c55e",
//       secondary: "#16a34a",
//       accent: "#15803d",
//       success: "#10b981",
//       warning: "#f59e0b",
//       error: "#ef4444",
//       background: "linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #334155 70%, #475569 100%)",
//       cardBg: "rgba(30, 41, 59, 0.95)",
//       textPrimary: "#f8fafc",
//       textSecondary: "#e2e8f0",
//       textMuted: "#94a3b8",
//       border: "rgba(34, 197, 94, 0.3)",
//       shadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
//       glassBg: "rgba(30, 41, 59, 0.4)",
//     },
//   }

//   const currentTheme = isDarkMode ? theme.dark : theme.light

//   const handleMethodChange = (method) => {
//     // Disabled for now - show notification instead
//     showNotification("This feature will be available soon! 🚀", "info")
//   }

//   // Authentication state management
//   useEffect(() => {
//     if (!auth) {
//       setAuthLoading(false)
//       setIsLoading(false)
//       return
//     }

//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       console.log("Auth state changed:", currentUser?.email || "No user")
//       if (currentUser && (currentUser.email.endsWith("@kiit.ac.in") || currentUser.email === "davidtomdon@gmail.com")) {
//         const userData = {
//           uid: currentUser.uid,
//           displayName: currentUser.displayName,
//           email: currentUser.email,
//           photoURL: currentUser.photoURL || "/default-profile.png",
//         }
//         setUser(userData)
//         setLoginError("")
//         setShowLoginPrompt(false)
//         loadSubjectsFromStorageAsync()
//       } else if (currentUser) {
//         console.log("Invalid email domain, signing out:", currentUser.email)
//         signOut(auth)
//         setLoginError("Please use your KIIT Gmail account (@kiit.ac.in) to sign in")
//         setUser(null)
//       } else {
//         console.log("No user signed in.")
//         setUser(null)
//       }
//       setAuthLoading(false)
//       setIsLoading(false)
//     })

//     return () => unsubscribe()
//   }, [])

//   // SILENT loading - no popup, just background loading
//   const loadSubjectsFromStorageAsync = async () => {
//     setIsLoadingData(true)
//     setDataError(null)
//     try {
//       console.log("🔄 Silent loading subjects from Firebase Storage...")
//       const result = await loadSubjectsFromStorage()
//       if (result.error) {
//         setDataError(result.error)
//         setSubjectsData({})
//         setTotalFiles(0)
//         showNotification(`Error loading data: ${result.error}`, "error")
//       } else {
//         setSubjectsData(result.data || {})
//         setTotalFiles(result.totalFiles || 0)
//         localStorage.setItem("subjectsData", JSON.stringify(result.data || {}))
//         if (result.totalFiles > 0) {
//           showNotification(`🚀 Loaded ${result.totalFiles} study materials !`, "success")
//           console.log("✅ Successfully loaded subjects from storage")
//         } else {
//           showNotification("No study materials found in Firebase Storage", "warning")
//         }
//       }
//     } catch (error) {
//       console.error("❌ Error loading subjects from storage:", error)
//       setDataError(error.message)
//       setSubjectsData({})
//       setTotalFiles(0)
//       showNotification(`Failed to load data: ${error.message}`, "error")
//     } finally {
//       setIsLoadingData(false)
//     }
//   }

//   const handleGoogleSignIn = async () => {
//     if (!auth || !provider) {
//       setLoginError("Authentication service is not available. Please try again later.")
//       return
//     }

//     try {
//       setLoginError("")
//       const result = await signInWithPopup(auth, provider)
//       const currentUser = result.user

//       if (!currentUser.email.endsWith("@kiit.ac.in") && currentUser.email !== "davidtomdon@gmail.com") {
//         setLoginError("Please use your KIIT Gmail account (@kiit.ac.in) to sign in")
//         await signOut(auth)
//         return
//       }

//       const userData = {
//         uid: currentUser.uid,
//         displayName: currentUser.displayName,
//         email: currentUser.email,
//         photoURL: currentUser.photoURL || "/default-profile.png",
//       }
//       setUser(userData)
//       setShowLoginPrompt(false)
//       setHasInteracted(true)
//       showNotification(`Welcome, ${currentUser.displayName?.split(" ")[0]}!`, "success")
//     } catch (error) {
//       console.error("Sign in error:", error)
//       if (error.code === "auth/popup-closed-by-user") {
//         setLoginError("Sign in was cancelled. Please try again.")
//       } else if (error.code === "auth/popup-blocked") {
//         setLoginError("Popup was blocked. Please allow popups and try again.")
//       } else {
//         setLoginError("Sign in failed. Please check your internet connection and try again.")
//       }
//     }
//   }

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth)
//       setUser(null)
//       setShowLoginPrompt(false)
//       showNotification("Successfully signed out!", "info")
//     } catch (error) {
//       console.error("Error signing out:", error)
//       showNotification("Error signing out. Please try again.", "error")
//     }
//   }

//   const showNotification = (message, type = "info") => {
//     setNotification({ message, type, id: Date.now() })
//     setTimeout(() => setNotification(null), 4000)
//   }

//   const toggleTheme = () => {
//     const newTheme = !isDarkMode
//     setIsDarkMode(newTheme)
//     localStorage.setItem("theme", newTheme ? "dark" : "light")
//     showNotification(`Switched to ${newTheme ? "dark" : "light"} mode`, "success")
//   }

//   useEffect(() => {
//     if (!authLoading && !user && hasInteracted) {
//       setShowLoginPrompt(true)
//     }
//   }, [authLoading, user, hasInteracted])

//   // Load data on component mount
//   useEffect(() => {
//     loadSubjectsFromStorageAsync()
//   }, [])

//   if (isLoading) {
//     return <LoadingScreen theme={currentTheme} />
//   }

//   return (
//     <div className={`app ${isDarkMode ? "dark" : "light"}`} style={{ background: currentTheme.background }}>
//       <ProfileSection
//         user={user}
//         showProfileDropdown={showProfileDropdown}
//         setShowProfileDropdown={setShowProfileDropdown}
//         handleSignOut={handleSignOut}
//         handleGoogleSignIn={handleGoogleSignIn}
//         theme={currentTheme}
//         isDarkMode={isDarkMode}
//         toggleTheme={toggleTheme}
//       />

//       <HistorySidebar
//         isOpen={isHistorySidebarOpen}
//         setIsOpen={setIsHistorySidebarOpen}
//         searchHistory={searchHistory}
//         theme={currentTheme}
//         user={user}
//         setShowLoginPrompt={setShowLoginPrompt}
//       />

//       <HeroSection user={user} theme={currentTheme} />

//       <div className="main-content">
//         {/* Enhanced Method Toggle - Disabled */}
//         <div className="method-toggle-container">
//           {/* Background decoration */}
//           <div className="toggle-background">
//             <div className="floating-orb orb-1"></div>
//             <div className="floating-orb orb-2"></div>
//             <div className="floating-orb orb-3"></div>
//           </div>

//           {/* Main toggle wrapper - Disabled state */}
//           <div className="toggle-wrapper disabled">
//             {/* Search Method Button - Disabled */}
//             <button
//               onClick={() => handleMethodChange("search")}
//               className="method-button search-button disabled"
//               disabled={true}
//             >
//               <div className="button-content">
//                 <div className="icon-wrapper">
//                   <span className="method-icon">🔍</span>
//                   <span className="lock-icon">🔒</span>
//                 </div>
//                 <div className="text-content">
//                   <span className="method-title">Smart Search</span>
//                   <span className="method-subtitle">Coming Soon</span>
//                 </div>
//               </div>
//             </button>

//             {/* Browse Method Button - Disabled */}
//             <button
//               onClick={() => handleMethodChange("browse")}
//               className="method-button browse-button disabled"
//               disabled={true}
//             >
//               <div className="button-content">
//                 <div className="icon-wrapper">
//                   <span className="method-icon">📂</span>
//                   <span className="lock-icon">🔒</span>
//                 </div>
//                 <div className="text-content">
//                   <span className="method-title">Browse All</span>
//                   <span className="method-subtitle">Coming Soon</span>
//                 </div>
//               </div>
//             </button>
//           </div>

//          </div>
//         <FeatureGrid
//           theme={currentTheme}
//           user={user}
//           setShowLoginPrompt={setShowLoginPrompt}
//           showNotification={showNotification}
//         />
//         <FacultyReviewSection theme={currentTheme} />
//         <SectionSwappingSection theme={currentTheme} />
//         <TestimonialsSection theme={currentTheme} />
//       </div>

//       <Footer theme={currentTheme} />

//       {showLoginPrompt && !user && !authLoading && (
//         <LoginPrompt
//           onClose={() => setShowLoginPrompt(false)}
//           onSignIn={handleGoogleSignIn}
//           error={loginError}
//           theme={currentTheme}
//         />
//       )}

//       {notification && (
//         <NotificationToast
//           message={notification.message}
//           type={notification.type}
//           onClose={() => setNotification(null)}
//           theme={currentTheme}
//         />
//       )}

//       {/* Small loading indicator in corner instead of popup */}
//       {isLoadingData && (
//         <div
//           style={{
//             position: "fixed",
//             bottom: "20px",
//             right: "20px",
//             background: currentTheme.cardBg,
//             padding: "12px 16px",
//             borderRadius: "12px",
//             border: `2px solid ${currentTheme.border}`,
//             display: "flex",
//             alignItems: "center",
//             gap: "12px",
//             zIndex: 1000,
//             boxShadow: currentTheme.shadow,
//           }}
//         >
//           <div
//             style={{
//               width: "16px",
//               height: "16px",
//               border: `2px solid ${currentTheme.primary}20`,
//               borderTop: `2px solid ${currentTheme.primary}`,
//               borderRadius: "50%",
//               animation: "spin 1s linear infinite",
//             }}
//           ></div>
//           <span style={{ color: currentTheme.textPrimary, fontSize: "14px", fontWeight: "500" }}>
//             Loading all the pdfs...
//           </span>
//         </div>
//       )}

//       <style jsx>{`
//         /* Fix for white side issue */
//         .app {
//           width: 100vw;
//           min-height: 100vh;
//           margin: 0;
//           padding: 0;
//           overflow-x: hidden;
//           box-sizing: border-box;
//         }

//         .main-content {
//           width: 100%;
//           max-width: 100vw;
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//           overflow-x: hidden;
//         }

//         .method-toggle-container {
//           position: relative;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           margin: 40px auto 60px auto;
//           padding: 0 20px;
//           width: 100%;
//           max-width: 1200px;
//           box-sizing: border-box;
//         }

//         .toggle-background {
//           position: absolute;
//           top: -30px;
//           left: 50%;
//           transform: translateX(-50%);
//           width: 100%;
//           max-width: 600px;
//           height: 140px;
//           pointer-events: none;
//           overflow: hidden;
//         }

//         .floating-orb {
//           position: absolute;
//           border-radius: 50%;
//           background: linear-gradient(135deg, ${currentTheme.primary}20, ${currentTheme.secondary}10);
//           animation: float 8s ease-in-out infinite;
//           filter: blur(2px);
//           opacity: 0.6;
//         }

//         .orb-1 {
//           width: 80px;
//           height: 80px;
//           top: 20px;
//           left: 15%;
//           animation-delay: 0s;
//         }

//         .orb-2 {
//           width: 60px;
//           height: 60px;
//           top: 40px;
//           right: 20%;
//           animation-delay: 2s;
//         }

//         .orb-3 {
//           width: 40px;
//           height: 40px;
//           bottom: 20px;
//           left: 65%;
//           animation-delay: 4s;
//         }

//         @keyframes float {
//           0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
//           33% { transform: translateY(-10px) rotate(120deg); opacity: 0.6; }
//           66% { transform: translateY(5px) rotate(240deg); opacity: 0.3; }
//         }

//         .toggle-wrapper {
//           position: relative;
//           display: flex;
//           background: ${currentTheme.glassBg};
//           backdrop-filter: blur(25px);
//           border: 2px solid ${currentTheme.border};
//           border-radius: 28px;
//           padding: 10px;
//           box-shadow: ${currentTheme.shadow}, inset 0 1px 0 rgba(255, 255, 255, 0.1);
//           overflow: hidden;
//           width: fit-content;
//           max-width: calc(100vw - 40px);
//           opacity: 0.7;
//           filter: grayscale(0.3);
//         }

//         .toggle-wrapper.disabled {
//           cursor: not-allowed;
//         }

//         .method-button {
//           position: relative;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 24px 36px;
//           border: none;
//           background: transparent;
//           cursor: not-allowed;
//           transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
//           border-radius: 18px;
//           min-width: 200px;
//           overflow: hidden;
//           opacity: 0.6;
//         }

//         .method-button.disabled {
//           cursor: not-allowed;
//           opacity: 0.6;
//         }

//         .method-button.disabled:hover {
//           transform: none;
//         }

//         .button-content {
//           display: flex;
//           align-items: center;
//           gap: 18px;
//           position: relative;
//           z-index: 2;
//         }

//         .icon-wrapper {
//           position: relative;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           width: 32px;
//           height: 32px;
//         }

//         .method-icon {
//           font-size: 28px;
//           transition: all 0.4s ease;
//           filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1)) grayscale(0.5);
//           opacity: 0.7;
//         }

//         .lock-icon {
//           position: absolute;
//           font-size: 12px;
//           top: -6px;
//           right: -6px;
//           opacity: 0.8;
//           background: ${currentTheme.cardBg};
//           border-radius: 50%;
//           padding: 2px;
//           border: 1px solid ${currentTheme.border};
//         }

//         .text-content {
//           display: flex;
//           flex-direction: column;
//           align-items: flex-start;
//           gap: 4px;
//         }

//         .method-title {
//           font-size: 18px;
//           font-weight: 800;
//           line-height: 1.2;
//           transition: all 0.4s ease;
//           letter-spacing: -0.5px;
//           color: ${currentTheme.textMuted};
//         }

//         .method-subtitle {
//           font-size: 13px;
//           font-weight: 600;
//           opacity: 0.85;
//           transition: all 0.4s ease;
//           letter-spacing: 0.2px;
//           color: ${currentTheme.warning};
//         }

//         /* Coming Soon Message */
//         .coming-soon-message {
//           margin-top: 40px;
//           width: 100%;
//           max-width: 600px;
//           display: flex;
//           justify-content: center;
//         }

//         .coming-soon-content {
//           background: ${currentTheme.glassBg};
//           backdrop-filter: blur(25px);
//           border: 2px solid ${currentTheme.border};
//           border-radius: 24px;
//           padding: 40px 32px;
//           text-align: center;
//           box-shadow: ${currentTheme.shadow};
//           width: 100%;
//         }

//         .coming-soon-icon {
//           font-size: 48px;
//           margin-bottom: 20px;
//           animation: bounce 2s infinite;
//         }

//         @keyframes bounce {
//           0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
//           40% { transform: translateY(-10px); }
//           60% { transform: translateY(-5px); }
//         }

//         .coming-soon-title {
//           font-size: 28px;
//           font-weight: 800;
//           color: ${currentTheme.textPrimary};
//           margin: 0 0 16px 0;
//           letter-spacing: -0.5px;
//         }

//         .coming-soon-description {
//           font-size: 16px;
//           color: ${currentTheme.textSecondary};
//           line-height: 1.6;
//           margin: 0 0 32px 0;
//           font-weight: 500;
//         }

//         .coming-soon-features {
//           display: flex;
//           flex-direction: column;
//           gap: 16px;
//           align-items: center;
//         }

//         .feature-item {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           padding: 12px 20px;
//           background: ${currentTheme.primary}10;
//           border: 1px solid ${currentTheme.primary}20;
//           border-radius: 12px;
//           color: ${currentTheme.textPrimary};
//           font-weight: 600;
//           font-size: 14px;
//           min-width: 200px;
//           justify-content: center;
//         }

//         .feature-icon {
//           font-size: 18px;
//         }

//         /* Mobile Responsive Design */
//         @media (max-width: 768px) {
//           .method-toggle-container {
//             margin: 30px auto 50px auto;
//             padding: 0 16px;
//           }

//           .toggle-wrapper {
//             flex-direction: column;
//             width: 100%;
//             max-width: 350px;
//             padding: 8px;
//           }

//           .method-button {
//             width: 100%;
//             min-width: unset;
//             padding: 20px 28px;
//             justify-content: flex-start;
//           }

//           .button-content {
//             gap: 16px;
//           }

//           .method-title {
//             font-size: 16px;
//           }

//           .method-subtitle {
//             font-size: 12px;
//           }

//           .method-icon {
//             font-size: 24px;
//           }

//           .lock-icon {
//             font-size: 10px;
//             top: -4px;
//             right: -4px;
//           }

//           .coming-soon-content {
//             padding: 32px 24px;
//           }

//           .coming-soon-title {
//             font-size: 24px;
//           }

//           .coming-soon-description {
//             font-size: 14px;
//           }

//           .coming-soon-features {
//             gap: 12px;
//           }

//           .feature-item {
//             min-width: 180px;
//             padding: 10px 16px;
//             font-size: 13px;
//           }

//           .feature-icon {
//             font-size: 16px;
//           }
//         }

//         @media (max-width: 480px) {
//           .method-toggle-container {
//             padding: 0 12px;
//           }

//           .toggle-wrapper {
//             max-width: 320px;
//           }

//           .method-button {
//             padding: 18px 24px;
//           }

//           .button-content {
//             gap: 14px;
//           }

//           .method-title {
//             font-size: 15px;
//           }

//           .method-subtitle {
//             font-size: 11px;
//           }

//           .coming-soon-content {
//             padding: 28px 20px;
//           }

//           .coming-soon-title {
//             font-size: 22px;
//           }

//           .coming-soon-description {
//             font-size: 13px;
//           }

//           .feature-item {
//             min-width: 160px;
//             font-size: 12px;
//           }
//         }

//         /* Accessibility improvements */
//         @media (prefers-reduced-motion: reduce) {
//           .method-button,
//           .method-icon,
//           .lock-icon {
//             transition: none;
//           }
//           .floating-orb {
//             animation: none;
//           }
//           .coming-soon-icon {
//             animation: none;
//           }
//         }

//         /* High contrast mode */
//         @media (prefers-contrast: high) {
//           .toggle-wrapper {
//             border-width: 3px;
//           }
//           .coming-soon-content {
//             border-width: 3px;
//           }
//         }

//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   )
// }











// another code 







// "use client"

// import { useEffect, useState } from "react"
// import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
// import { auth, provider } from "../lib/firebase"
// import { loadSubjectsFromStorage } from "../lib/storageHelpers"

// // Import Components
// import ProfileSection from "../components/ProfileSection/ProfileSection"
// import HistorySidebar from "../components/HistorySidebar/HistorySidebar"
// import CategorySelector from "../components/CategorySelector/CategorySelector"
// import SearchBox from "../components/SearchBox/SearchBox"
// import BrowseMethod from "../components/BrowseMethod/BrowseMethod"
// import FeatureGrid from "../components/FeatureGrid/FeatureGrid"
// import LoginPrompt from "../components/LoginPrompt/LoginPrompt"
// import HeroSection from "../components/HeroSection/HeroSection"
// import TestimonialsSection from "../components/TestimonialsSection/TestimonialsSection"
// import FacultyReviewSection from "../components/FacultyReviewSection/FacultyReviewSection"
// import SectionSwappingSection from "../components/SectionSwappingSection/SectionSwappingSection"
// import Footer from "../components/Footer/Footer"
// import NotificationToast from "../components/NotificationToast/NotificationToast"
// import LoadingScreen from "../components/LoadingScreen/LoadingScreen"

// export default function Home() {
//   const [user, setUser] = useState(null)
//   const [authLoading, setAuthLoading] = useState(true)
//   const [isHistorySidebarOpen, setIsHistorySidebarOpen] = useState(false)
//   const [searchHistory, setSearchHistory] = useState([])
//   const [subjectsData, setSubjectsData] = useState({})
//   const [selectedCategory, setSelectedCategory] = useState(null)
//   const [searchInput, setSearchInput] = useState("")
//   const [suggestions, setSuggestions] = useState([])
//   const [showSuggestions, setShowSuggestions] = useState(false)
//   const [showProfileDropdown, setShowProfileDropdown] = useState(false)
//   const [showLoginPrompt, setShowLoginPrompt] = useState(false)
//   const [loginError, setLoginError] = useState("")
//   const [hasInteracted, setHasInteracted] = useState(false)
//   const [isLoading, setIsLoading] = useState(true)
//   const [notification, setNotification] = useState(null)
//   const [isDarkMode, setIsDarkMode] = useState(true)
//   const [activeMethod, setActiveMethod] = useState("search")
//   const [isAnimating, setIsAnimating] = useState(false)

//   // Silent loading states - no popup
//   const [isLoadingData, setIsLoadingData] = useState(false)
//   const [dataError, setDataError] = useState(null)
//   const [totalFiles, setTotalFiles] = useState(0)

//   // Enhanced Theme Configuration
//   const theme = {
//     light: {
//       primary: "#22c55e",
//       secondary: "#16a34a",
//       accent: "#15803d",
//       success: "#10b981",
//       warning: "#f59e0b",
//       error: "#ef4444",
//       background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 30%, #bbf7d0 70%, #a7f3d0 100%)",
//       cardBg: "rgba(255, 255, 255, 0.95)",
//       textPrimary: "#1f2937",
//       textSecondary: "#374151",
//       textMuted: "#6b7280",
//       border: "rgba(34, 197, 94, 0.2)",
//       shadow: "0 20px 60px rgba(34, 197, 94, 0.15)",
//       glassBg: "rgba(255, 255, 255, 0.4)",
//     },
//     dark: {
//       primary: "#22c55e",
//       secondary: "#16a34a",
//       accent: "#15803d",
//       success: "#10b981",
//       warning: "#f59e0b",
//       error: "#ef4444",
//       background: "linear-gradient(135deg, #0f172a 0%, #1e293b 30%, #334155 70%, #475569 100%)",
//       cardBg: "rgba(30, 41, 59, 0.95)",
//       textPrimary: "#f8fafc",
//       textSecondary: "#e2e8f0",
//       textMuted: "#94a3b8",
//       border: "rgba(34, 197, 94, 0.3)",
//       shadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
//       glassBg: "rgba(30, 41, 59, 0.4)",
//     },
//   }

//   const currentTheme = isDarkMode ? theme.dark : theme.light

//   const handleMethodChange = (method) => {
//     if (method === activeMethod || isAnimating) return

//     setIsAnimating(true)
//     setTimeout(() => {
//       setActiveMethod(method)
//       setIsAnimating(false)
//     }, 150)
//   }

//   // Authentication state management
//   useEffect(() => {
//     if (!auth) {
//       setAuthLoading(false)
//       setIsLoading(false)
//       return
//     }

//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       console.log("Auth state changed:", currentUser?.email || "No user")
//       if (currentUser && (currentUser.email.endsWith("@kiit.ac.in") || currentUser.email === "davidtomdon@gmail.com")) {
//         const userData = {
//           uid: currentUser.uid,
//           displayName: currentUser.displayName,
//           email: currentUser.email,
//           photoURL: currentUser.photoURL || "/default-profile.png",
//         }
//         setUser(userData)
//         setLoginError("")
//         setShowLoginPrompt(false)
//         loadSubjectsFromStorageAsync()
//       } else if (currentUser) {
//         console.log("Invalid email domain, signing out:", currentUser.email)
//         signOut(auth)
//         setLoginError("Please use your KIIT Gmail account (@kiit.ac.in) to sign in")
//         setUser(null)
//       } else {
//         console.log("No user signed in.")
//         setUser(null)
//       }
//       setAuthLoading(false)
//       setIsLoading(false)
//     })

//     return () => unsubscribe()
//   }, [])

//   // SILENT loading - no popup, just background loading
//   const loadSubjectsFromStorageAsync = async () => {
//     setIsLoadingData(true)
//     setDataError(null)
//     try {
//       console.log("🔄 Silent loading subjects from Firebase Storage...")
//       const result = await loadSubjectsFromStorage()
//       if (result.error) {
//         setDataError(result.error)
//         setSubjectsData({})
//         setTotalFiles(0)
//         showNotification(`Error loading data: ${result.error}`, "error")
//       } else {
//         setSubjectsData(result.data || {})
//         setTotalFiles(result.totalFiles || 0)
//         localStorage.setItem("subjectsData", JSON.stringify(result.data || {}))
//         if (result.totalFiles > 0) {
//           showNotification(`🚀 Loaded ${result.totalFiles} study materials !`, "success")
//           console.log("✅ Successfully loaded subjects from storage")
//         } else {
//           showNotification("No study materials found in Firebase Storage", "warning")
//         }
//       }
//     } catch (error) {
//       console.error("❌ Error loading subjects from storage:", error)
//       setDataError(error.message)
//       setSubjectsData({})
//       setTotalFiles(0)
//       showNotification(`Failed to load data: ${error.message}`, "error")
//     } finally {
//       setIsLoadingData(false)
//     }
//   }

//   const handleGoogleSignIn = async () => {
//     if (!auth || !provider) {
//       setLoginError("Authentication service is not available. Please try again later.")
//       return
//     }

//     try {
//       setLoginError("")
//       const result = await signInWithPopup(auth, provider)
//       const currentUser = result.user

//       if (!currentUser.email.endsWith("@kiit.ac.in") && currentUser.email !== "davidtomdon@gmail.com") {
//         setLoginError("Please use your KIIT Gmail account (@kiit.ac.in) to sign in")
//         await signOut(auth)
//         return
//       }

//       const userData = {
//         uid: currentUser.uid,
//         displayName: currentUser.displayName,
//         email: currentUser.email,
//         photoURL: currentUser.photoURL || "/default-profile.png",
//       }

//       setUser(userData)
//       setShowLoginPrompt(false)
//       setHasInteracted(true)
//       showNotification(`Welcome, ${currentUser.displayName?.split(" ")[0]}!`, "success")
//     } catch (error) {
//       console.error("Sign in error:", error)
//       if (error.code === "auth/popup-closed-by-user") {
//         setLoginError("Sign in was cancelled. Please try again.")
//       } else if (error.code === "auth/popup-blocked") {
//         setLoginError("Popup was blocked. Please allow popups and try again.")
//       } else {
//         setLoginError("Sign in failed. Please check your internet connection and try again.")
//       }
//     }
//   }

//   const handleSignOut = async () => {
//     try {
//       await signOut(auth)
//       setUser(null)
//       setShowLoginPrompt(false)
//       showNotification("Successfully signed out!", "info")
//     } catch (error) {
//       console.error("Error signing out:", error)
//       showNotification("Error signing out. Please try again.", "error")
//     }
//   }

//   const showNotification = (message, type = "info") => {
//     setNotification({ message, type, id: Date.now() })
//     setTimeout(() => setNotification(null), 4000)
//   }

//   const toggleTheme = () => {
//     const newTheme = !isDarkMode
//     setIsDarkMode(newTheme)
//     localStorage.setItem("theme", newTheme ? "dark" : "light")
//     showNotification(`Switched to ${newTheme ? "dark" : "light"} mode`, "success")
//   }

//   useEffect(() => {
//     if (!authLoading && !user && hasInteracted) {
//       setShowLoginPrompt(true)
//     }
//   }, [authLoading, user, hasInteracted])

//   // Load data on component mount
//   useEffect(() => {
//     loadSubjectsFromStorageAsync()
//   }, [])

//   if (isLoading) {
//     return <LoadingScreen theme={currentTheme} />
//   }

//   return (
//     <div className={`app ${isDarkMode ? "dark" : "light"}`} style={{ background: currentTheme.background }}>
//       <ProfileSection
//         user={user}
//         showProfileDropdown={showProfileDropdown}
//         setShowProfileDropdown={setShowProfileDropdown}
//         handleSignOut={handleSignOut}
//         handleGoogleSignIn={handleGoogleSignIn}
//         theme={currentTheme}
//         isDarkMode={isDarkMode}
//         toggleTheme={toggleTheme}
//       />

//       <HistorySidebar
//         isOpen={isHistorySidebarOpen}
//         setIsOpen={setIsHistorySidebarOpen}
//         searchHistory={searchHistory}
//         theme={currentTheme}
//         user={user}
//         setShowLoginPrompt={setShowLoginPrompt}
//       />

//       <HeroSection user={user} theme={currentTheme} />

//       <div className="main-content">
//         {/* Enhanced Method Toggle */}
//         <div className="method-toggle-container">
//           {/* Background decoration */}
//           <div className="toggle-background">
//             <div className="floating-orb orb-1"></div>
//             <div className="floating-orb orb-2"></div>
//             <div className="floating-orb orb-3"></div>
//           </div>

//           {/* Main toggle wrapper */}
//           <div className="toggle-wrapper">
//             {/* Sliding background indicator */}
//             <div className={`sliding-indicator ${activeMethod === "browse" ? "slide-right" : "slide-left"}`} />

//             {/* Search Method Button */}
//             <button
//               onClick={() => handleMethodChange("search")}
//               className={`method-button search-button ${activeMethod === "search" ? "active" : "inactive"}`}
//               disabled={isAnimating}
//             >
//               <div className="button-content">
//                 <div className="icon-wrapper">
//                   <span className="method-icon">🔍</span>
//                   <span className="sparkle-icon">✨</span>
//                 </div>
//                 <div className="text-content">
//                   <span className="method-title">Smart Search</span>
//                   <span className="method-subtitle">Find instantly</span>
//                 </div>
//               </div>
//               {activeMethod === "search" && <div className="ripple-effect" />}
//             </button>

//             {/* Browse Method Button */}
//             <button
//               onClick={() => handleMethodChange("browse")}
//               className={`method-button browse-button ${activeMethod === "browse" ? "active" : "inactive"}`}
//               disabled={isAnimating}
//             >
//               <div className="button-content">
//                 <div className="icon-wrapper">
//                   <span className="method-icon">📂</span>
//                   <span className="sparkle-icon">⚡</span>
//                 </div>
//                 <div className="text-content">
//                   <span className="method-title">Browse All</span>
//                   <span className="method-subtitle">Explore topics</span>
//                 </div>
//               </div>
//               {activeMethod === "browse" && <div className="ripple-effect" />}
//             </button>
//           </div>

          
//         </div>

//         {activeMethod === "search" ? (
//           <>
//             <CategorySelector
//               selectedCategory={selectedCategory}
//               setSelectedCategory={setSelectedCategory}
//               theme={currentTheme}
//               user={user}
//               setShowLoginPrompt={setShowLoginPrompt}
//             />
//             <SearchBox
//               searchInput={searchInput}
//               setSearchInput={setSearchInput}
//               showSuggestions={showSuggestions}
//               setShowSuggestions={setShowSuggestions}
//               suggestions={suggestions}
//               setSuggestions={setSuggestions}
//               subjectsData={subjectsData}
//               selectedCategory={selectedCategory}
//               theme={currentTheme}
//               user={user}
//               setShowLoginPrompt={setShowLoginPrompt}
//               setSearchHistory={setSearchHistory}
//               searchHistory={searchHistory}
//               setHasInteracted={setHasInteracted}
//               isLoadingData={isLoadingData}
//               dataError={dataError}
//               totalFiles={totalFiles}
//             />
//           </>
//         ) : (
//           <BrowseMethod
//             subjectsData={subjectsData}
//             theme={currentTheme}
//             user={user}
//             setShowLoginPrompt={setShowLoginPrompt}
//             showNotification={showNotification}
//             setHasInteracted={setHasInteracted}
//           />
//         )}

//         <FeatureGrid
//           theme={currentTheme}
//           user={user}
//           setShowLoginPrompt={setShowLoginPrompt}
//           showNotification={showNotification}
//         />

//         <FacultyReviewSection theme={currentTheme} />
//         <SectionSwappingSection theme={currentTheme} />
//         <TestimonialsSection theme={currentTheme} />
//       </div>

//       <Footer theme={currentTheme} />

//       {showLoginPrompt && !user && !authLoading && (
//         <LoginPrompt
//           onClose={() => setShowLoginPrompt(false)}
//           onSignIn={handleGoogleSignIn}
//           error={loginError}
//           theme={currentTheme}
//         />
//       )}

//       {notification && (
//         <NotificationToast
//           message={notification.message}
//           type={notification.type}
//           onClose={() => setNotification(null)}
//           theme={currentTheme}
//         />
//       )}

//       {/* Small loading indicator in corner instead of popup */}
//       {isLoadingData && (
//         <div
//           style={{
//             position: "fixed",
//             bottom: "20px",
//             right: "20px",
//             background: currentTheme.cardBg,
//             padding: "12px 16px",
//             borderRadius: "12px",
//             border: `2px solid ${currentTheme.border}`,
//             display: "flex",
//             alignItems: "center",
//             gap: "12px",
//             zIndex: 1000,
//             boxShadow: currentTheme.shadow,
//           }}
//         >
//           <div
//             style={{
//               width: "16px",
//               height: "16px",
//               border: `2px solid ${currentTheme.primary}20`,
//               borderTop: `2px solid ${currentTheme.primary}`,
//               borderRadius: "50%",
//               animation: "spin 1s linear infinite",
//             }}
//           ></div>
//           <span style={{ color: currentTheme.textPrimary, fontSize: "14px", fontWeight: "500" }}>
//             Loading all the pdfs...
//           </span>
//         </div>
//       )}

//       <style jsx>{`
//         /* Fix for white side issue */
//         .app {
//           width: 100vw;
//           min-height: 100vh;
//           margin: 0;
//           padding: 0;
//           overflow-x: hidden;
//           box-sizing: border-box;
//         }

//         .main-content {
//           width: 100%;
//           max-width: 100vw;
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//           overflow-x: hidden;
//         }

//         .method-toggle-container {
//           position: relative;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           margin: 40px auto 60px auto;
//           padding: 0 20px;
//           width: 100%;
//           max-width: 1200px;
//           box-sizing: border-box;
//         }

//         .toggle-background {
//           position: absolute;
//           top: -30px;
//           left: 50%;
//           transform: translateX(-50%);
//           width: 100%;
//           max-width: 600px;
//           height: 140px;
//           pointer-events: none;
//           overflow: hidden;
//         }

//         .floating-orb {
//           position: absolute;
//           border-radius: 50%;
//           background: linear-gradient(135deg, ${currentTheme.primary}40, ${currentTheme.secondary}20);
//           animation: float 6s ease-in-out infinite;
//           filter: blur(1px);
//         }

//         .orb-1 {
//           width: 80px;
//           height: 80px;
//           top: 20px;
//           left: 15%;
//           animation-delay: 0s;
//         }

//         .orb-2 {
//           width: 60px;
//           height: 60px;
//           top: 40px;
//           right: 20%;
//           animation-delay: 2s;
//         }

//         .orb-3 {
//           width: 40px;
//           height: 40px;
//           bottom: 20px;
//           left: 65%;
//           animation-delay: 4s;
//         }

//         @keyframes float {
//           0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
//           33% { transform: translateY(-15px) rotate(120deg); opacity: 0.8; }
//           66% { transform: translateY(8px) rotate(240deg); opacity: 0.4; }
//         }

//         .toggle-wrapper {
//           position: relative;
//           display: flex;
//           background: ${currentTheme.glassBg};
//           backdrop-filter: blur(25px);
//           border: 2px solid ${currentTheme.border};
//           border-radius: 28px;
//           padding: 10px;
//           box-shadow: ${currentTheme.shadow}, inset 0 1px 0 rgba(255, 255, 255, 0.1);
//           overflow: hidden;
//           width: fit-content;
//           max-width: calc(100vw - 40px);
//         }

//         .sliding-indicator {
//           position: absolute;
//           top: 10px;
//           bottom: 10px;
//           width: calc(50% - 5px);
//           background: linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary});
//           border-radius: 18px;
//           transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
//           box-shadow: 0 10px 40px ${currentTheme.primary}50, inset 0 1px 0 rgba(255, 255, 255, 0.2);
//         }

//         .slide-left {
//           left: 5px;
//         }

//         .slide-right {
//           left: calc(50% + 5px);
//         }

//         .method-button {
//           position: relative;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 24px 36px;
//           border: none;
//           background: transparent;
//           cursor: pointer;
//           transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
//           border-radius: 18px;
//           min-width: 200px;
//           overflow: hidden;
//         }

//         .method-button:disabled {
//           cursor: not-allowed;
//           opacity: 0.7;
//         }

//         .button-content {
//           display: flex;
//           align-items: center;
//           gap: 18px;
//           position: relative;
//           z-index: 2;
//         }

//         .icon-wrapper {
//           position: relative;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           width: 32px;
//           height: 32px;
//         }

//         .method-icon {
//           font-size: 28px;
//           transition: all 0.4s ease;
//           filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
//         }

//         .sparkle-icon {
//           position: absolute;
//           font-size: 14px;
//           top: -8px;
//           right: -8px;
//           opacity: 0;
//           transform: scale(0) rotate(0deg);
//           transition: all 0.4s ease;
//         }

//         .text-content {
//           display: flex;
//           flex-direction: column;
//           align-items: flex-start;
//           gap: 4px;
//         }

//         .method-title {
//           font-size: 18px;
//           font-weight: 800;
//           line-height: 1.2;
//           transition: all 0.4s ease;
//           letter-spacing: -0.5px;
//         }

//         .method-subtitle {
//           font-size: 13px;
//           font-weight: 600;
//           opacity: 0.85;
//           transition: all 0.4s ease;
//           letter-spacing: 0.2px;
//         }

//         .active {
//           color: white;
//           text-shadow: 0 1px 2px rgba(0,0,0,0.1);
//         }

//         .active .sparkle-icon {
//           opacity: 1;
//           transform: scale(1) rotate(180deg);
//         }

//         .active .method-icon {
//           transform: scale(1.15);
//         }

//         .inactive {
//           color: ${currentTheme.textSecondary};
//         }

//         .inactive:hover {
//           color: ${currentTheme.textPrimary};
//           transform: translateY(-3px);
//         }

//         .inactive:hover .method-icon {
//           transform: scale(1.08);
//         }

//         .ripple-effect {
//           position: absolute;
//           top: 50%;
//           left: 50%;
//           width: 0;
//           height: 0;
//           background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
//           border-radius: 50%;
//           transform: translate(-50%, -50%);
//           animation: ripple 3s infinite;
//         }

//         @keyframes ripple {
//           0% {
//             width: 0;
//             height: 0;
//             opacity: 1;
//           }
//           100% {
//             width: 300px;
//             height: 300px;
//             opacity: 0;
//           }
//         }

//         .method-description {
//           margin-top: 32px;
//           text-align: center;
//           max-width: 500px;
//           width: 100%;
//         }

//         .method-description p {
//           color: ${currentTheme.textSecondary};
//           font-size: 16px;
//           font-weight: 600;
//           margin: 0;
//           padding: 16px 24px;
//           background: ${currentTheme.glassBg};
//           border-radius: 16px;
//           border: 1px solid ${currentTheme.border};
//           backdrop-filter: blur(15px);
//           box-shadow: 0 8px 32px rgba(0,0,0,0.1);
//           line-height: 1.5;
//         }

//         /* Mobile Responsive Design */
//         @media (max-width: 768px) {
//           .method-toggle-container {
//             margin: 30px auto 50px auto;
//             padding: 0 16px;
//           }

//           .toggle-wrapper {
//             flex-direction: column;
//             width: 100%;
//             max-width: 350px;
//             padding: 8px;
//           }

//           .sliding-indicator {
//             width: calc(100% - 16px);
//             height: calc(50% - 4px);
//             left: 8px;
//             transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
//           }

//           .slide-left {
//             top: 8px;
//           }

//           .slide-right {
//             top: calc(50% + 4px);
//           }

//           .method-button {
//             width: 100%;
//             min-width: unset;
//             padding: 20px 28px;
//             justify-content: flex-start;
//           }

//           .button-content {
//             gap: 16px;
//           }

//           .method-title {
//             font-size: 16px;
//           }

//           .method-subtitle {
//             font-size: 12px;
//           }

//           .method-icon {
//             font-size: 24px;
//           }

//           .sparkle-icon {
//             font-size: 12px;
//             top: -6px;
//             right: -6px;
//           }

//           .method-description p {
//             font-size: 14px;
//             padding: 14px 20px;
//           }
//         }

//         @media (max-width: 480px) {
//           .method-toggle-container {
//             padding: 0 12px;
//           }

//           .toggle-wrapper {
//             max-width: 320px;
//           }

//           .method-button {
//             padding: 18px 24px;
//           }

//           .button-content {
//             gap: 14px;
//           }

//           .method-title {
//             font-size: 15px;
//           }

//           .method-subtitle {
//             font-size: 11px;
//           }

//           .method-description p {
//             font-size: 13px;
//             padding: 12px 18px;
//           }
//         }

//         /* Accessibility improvements */
//         @media (prefers-reduced-motion: reduce) {
//           .sliding-indicator,
//           .method-button,
//           .method-icon,
//           .sparkle-icon {
//             transition: none;
//           }

//           .floating-orb {
//             animation: none;
//           }

//           .ripple-effect {
//             animation: none;
//           }
//         }

//         /* High contrast mode */
//         @media (prefers-contrast: high) {
//           .toggle-wrapper {
//             border-width: 3px;
//           }

//           .sliding-indicator {
//             box-shadow: none;
//             border: 2px solid white;
//           }
//         }
//       `}</style>
//     </div>
//   )
// }












//drive pdf viewer 


"use client"
import { useEffect, useState } from "react"
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import { collection, getDocs, onSnapshot } from "firebase/firestore" // Added onSnapshot for real-time updates
import { auth, provider, db } from "../lib/firebase"

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
  const [realtimeListeners, setRealtimeListeners] = useState([]) // Track listeners for cleanup

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

  // Real-time data loading with Firestore listeners
  const setupRealtimeListeners = () => {
    if (!db) {
      console.error("Cloud Firestore not initialized or available.")
      setDataError("Cloud Firestore not initialized or available.")
      showNotification("Database connection failed", "error")
      return
    }

    setIsLoadingData(true)
    setDataError(null)

    try {
      console.log("🔄 Setting up real-time listeners for Cloud Firestore...")
      
      const collectionNames = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "Routine"]
      const listeners = []
      const combinedData = {}
      let completedCollections = 0

      const updateCombinedData = () => {
        let fileCount = 0
        
        // Count files in combined data
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
            showNotification(`🚀 Real-time sync active! ${fileCount} study materials loaded`, "success")
          }
        }
      }

      // Set up listeners for each collection
      collectionNames.forEach((collectionName) => {
        const unsubscribe = onSnapshot(
          collection(db, collectionName),
          (querySnapshot) => {
            console.log(`📡 Real-time update received for /${collectionName}`)
            
            const semesterData = {}
            querySnapshot.forEach((doc) => {
              const subjectName = doc.id
              const subjectCategories = doc.data()
              
              if (subjectCategories && typeof subjectCategories === "object") {
                semesterData[subjectName] = subjectCategories
              }
            })

            // Update combined data
            combinedData[`${collectionName.charAt(0).toUpperCase() + collectionName.slice(1)}`] = semesterData
            completedCollections++
            
            updateCombinedData()
            console.log(`✅ Real-time data updated for /${collectionName}`)
          },
          (error) => {
            console.error(`❌ Error in real-time listener for /${collectionName}:`, error)
            completedCollections++
            if (completedCollections === collectionNames.length) {
              setIsLoadingData(false)
            }
          }
        )

        listeners.push(unsubscribe)
      })

      setRealtimeListeners(listeners)
      console.log("✅ Real-time listeners set up successfully")

    } catch (error) {
      console.error("❌ Error setting up real-time listeners:", error)
      setDataError(error.message)
      setSubjectsData({})
      setTotalFiles(0)
      setIsLoadingData(false)
      showNotification(`Failed to set up real-time sync: ${error.message}`, "error")
    }
  }

  // Cleanup listeners
  const cleanupListeners = () => {
    realtimeListeners.forEach(unsubscribe => {
      if (typeof unsubscribe === 'function') {
        unsubscribe()
      }
    })
    setRealtimeListeners([])
    console.log("🧹 Real-time listeners cleaned up")
  }

  // Force refresh data (fallback method)
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

  // Open paper function
  const openPaper = (subject, category, year) => {
    console.log("openPaper: Attempting to open paper:", { subject, category, year })
    if (!user) {
      setShowLoginPrompt(true)
      console.log("openPaper: User not logged in, showing login prompt.")
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
              console.log(`openPaper: Found raw URL for ${formattedSubject} - ${category} - ${year}:`, foundUrl)
              break
            }
          }
        }
      }
    }

    if (foundUrl && typeof foundUrl === "string" && foundUrl.trim() !== "") {
      const previewUrl = getPreviewLink(foundUrl)
      console.log("openPaper: Generated preview URL:", previewUrl)
      const fileUrl = encodeURIComponent(previewUrl)
      const fileTitle = encodeURIComponent(`${formattedSubject} - ${category} - ${year}`)
      console.log("openPaper: Opening viewer with encoded URL:", fileUrl, "and title:", fileTitle)
      window.open(`/viewer?url=${fileUrl}&title=${fileTitle}`, "_blank")
      showNotification(`📖 Opening: ${formattedSubject} - ${category} - ${year}`, "success")
    } else {
      console.error("openPaper: Paper URL not found or invalid for:", { subject, category, year, foundUrl })
      showNotification("❌ Paper not found or URL is invalid for this subject/category/year.", "error")
    }
  }

  const getPreviewLink = (fullUrl) => {
    const match = fullUrl.match(/(?:id=|\/d\/)([-\w]{25,})/)
    if (match) {
      console.log("getPreviewLink: Detected Google Drive ID, generating preview link.")
      return `https://drive.google.com/file/d/${match[1]}/preview`
    }
    console.log("getPreviewLink: No Google Drive ID found, returning original URL.")
    return fullUrl
  }

  useEffect(() => {
    if (!authLoading && !user && hasInteracted) {
      setShowLoginPrompt(true)
    }
  }, [authLoading, user, hasInteracted])

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark")
    }
  }, [])

  // Set up real-time listeners on component mount
  useEffect(() => {
    setupRealtimeListeners()
    
    // Cleanup on unmount
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
        {/* Enhanced Method Toggle */}
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

        {/* Dynamic Content Based on Active Method */}
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

      {/* Real-time sync indicator */}
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
            🔄 Real-time sync active...
          </span>
        </div>
      )}

      <style jsx>{`
        .app {
          width: 100vw;
          min-height: 100vh;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          box-sizing: border-box;
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
