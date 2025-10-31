// "use client"
// import "./styles.css"
// import { useState, useEffect, useCallback, createContext, useContext } from "react"
// import { database, auth } from "../../lib/firebase"
// import {
//   Phone,
//   RefreshCw,
//   MessageSquare,
//   AlertTriangle,
//   Users,
//   Trash2,
//   Sparkles,
//   HelpCircle,
//   ExternalLink,
//   BarChart2,
//   Activity,
//   TrendingUp,
//   Clock,
//   Moon,
//   Sun,
//   Filter,
//   Eye,
//   Target,
// } from "lucide-react"
// import { onAuthStateChanged } from "firebase/auth"
// import { ref, push, remove, get, set, increment, serverTimestamp } from "firebase/database"
// import { useRouter } from "next/navigation"

// // Theme Context
// const ThemeContext = createContext({
//   isDark: false,
//   toggleTheme: () => {},
// })

// const useTheme = () => useContext(ThemeContext)

// const MAX_SECTION_LENGTH = 20
// const MAX_DELETION_ATTEMPTS = 3
// const ADMIN_USER_ID = "23053769"

// // Whitelist of allowed roll numbers
// const ALLOWED_ROLL_NUMBERS = [
//   "23053769",
//   "23053668",
//   // Add more allowed roll numbers here
// ]

// export default function EnhancedSectionSwap() {
//   // Theme state
//   const [isDark, setIsDark] = useState(false)

//   // Existing states
//   const [currentYear, setCurrentYear] = useState(null)
//   const [userId, setUserId] = useState("")
//   const [userEmail, setUserEmail] = useState("")
//   const [userName, setUserName] = useState("")
//   const [userRoll, setUserRoll] = useState("")
//   const [showSwapInterface, setShowSwapInterface] = useState(false)
//   const [activeView, setActiveView] = useState("swap")
//   const [notification, setNotification] = useState({ show: false, message: "", type: "info" })
//   const [listings, setListings] = useState([])
//   const [filteredListings, setFilteredListings] = useState([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [hasPosted, setHasPosted] = useState(false)
//   const [yearSelected, setYearSelected] = useState(false)
//   const [userListing, setUserListing] = useState(null)
//   const [formData, setFormData] = useState({
//     name: "",
//     currentSection: "",
//     desiredSection: "",
//     contact: "",
//     message: "",
//   })
//   const [isBrowser, setIsBrowser] = useState(false)
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [isBlocked, setIsBlocked] = useState(false)
//   const [isRollNumberBlocked, setIsRollNumberBlocked] = useState(false)
//   const [loading, setLoading] = useState(true)
//   const router = useRouter()
//   const [isCheckingYearSelection, setIsCheckingYearSelection] = useState(true)
//   const [deletionAttempts, setDeletionAttempts] = useState(0)

//   // Dashboard states
//   const [showDashboard, setShowDashboard] = useState(false)
//   const [dashboardTab, setDashboardTab] = useState("overview")
//   const [analyticsData, setAnalyticsData] = useState({
//     mostDemandedSections: [],
//     mostOfferedSections: [],
//     recentActivity: [],
//     totalSwaps: 0,
//     activeUsers: 0,
//     whatsappClicks: 0,
//   })

//   // New filtering states
//   const [listingFilter, setListingFilter] = useState("all") // "all", "relevant", "desired"
//   const [isAdminUser, setIsAdminUser] = useState(false)

//   useEffect(() => {
//     setIsBrowser(true)
//   }, [])

//   // Theme toggle function
//   const toggleTheme = useCallback(() => {
//     setIsDark((prev) => {
//       const newTheme = !prev
//       localStorage.setItem("theme", newTheme ? "dark" : "light")
//       return newTheme
//     })
//   }, [])

//   // Initialize theme from localStorage
//   useEffect(() => {
//     const savedTheme = localStorage.getItem("theme")
//     const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
//     setIsDark(savedTheme ? savedTheme === "dark" : prefersDark)
//   }, [])

//   // Apply theme to document
//   useEffect(() => {
//     document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light")
//   }, [isDark])

//   // Security measures
//   const disableDevTools = useCallback(() => {
//     const disableRightClick = (e) => {
//       e.preventDefault()
//       return false
//     }

//     const disableKeyboardShortcuts = (e) => {
//       if (
//         e.keyCode === 123 ||
//         (e.ctrlKey && e.shiftKey && e.keyCode === 73) ||
//         (e.ctrlKey && e.shiftKey && e.keyCode === 74) ||
//         (e.ctrlKey && e.keyCode === 85) ||
//         (e.ctrlKey && e.shiftKey && e.keyCode === 67) ||
//         (e.ctrlKey && e.keyCode === 83)
//       ) {
//         e.preventDefault()
//         return false
//       }
//     }

//     document.addEventListener("contextmenu", disableRightClick)
//     document.addEventListener("keydown", disableKeyboardShortcuts)
//     document.addEventListener("selectstart", (e) => e.preventDefault())
//     document.addEventListener("dragstart", (e) => e.preventDefault())

//     return () => {
//       document.removeEventListener("contextmenu", disableRightClick)
//       document.removeEventListener("keydown", disableKeyboardShortcuts)
//     }
//   }, [])

//   useEffect(() => {
//     if (!isBrowser || !auth) return

//     const cleanup = disableDevTools()

//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         if (!user.email?.toLowerCase().endsWith("@kiit.ac.in")) {
//           try {
//             await auth.signOut()
//             router.push("/")
//           } catch {
//             router.push("/")
//           }
//           return
//         }

//         setUserId(user.uid)
//         setUserEmail(user.email)
//         setUserName(user.displayName || "")
//         setIsAuthenticated(true)

//         await checkIfUserIsBlocked(user.uid, user.email)

//         // Enhanced roll number checking logic
//         const rollNumberMatch = user.email.match(/(\d+)@kiit\.ac\.in/)
//         if (rollNumberMatch) {
//           const rollNumber = rollNumberMatch[1]
//           // Check if roll number is in whitelist
//           if (ALLOWED_ROLL_NUMBERS.includes(rollNumber)) {
//             setIsRollNumberBlocked(false)
//           } else {
//             // Check if roll number starts with blocked prefixes
//             const blockedPrefixes = ["22", "21", "20", "25"]
//             const isBlocked = blockedPrefixes.some((prefix) => rollNumber.startsWith(prefix))
//             if (isBlocked) {
//               setIsRollNumberBlocked(true)
//             } else {
//               setIsRollNumberBlocked(false)
//             }
//           }
//         } else {
//           setIsRollNumberBlocked(false)
//         }

//         setLoading(false)
//       } else {
//         setUserId("")
//         setUserEmail("")
//         setUserName("")
//         setIsAuthenticated(false)
//         setIsBlocked(false)
//         setIsRollNumberBlocked(false)
//         setLoading(false)
//         router.push("/")
//       }
//     })

//     return () => {
//       unsubscribe()
//       cleanup()
//     }
//   }, [isBrowser, router, disableDevTools])

//   // Check if user is blocked
//   const checkIfUserIsBlocked = async (uid, email) => {
//     if (!database) return

//     try {
//       const blockedRef = ref(database, `blockedUsers/${uid}`)
//       const snapshot = await get(blockedRef)
//       if (snapshot.exists()) {
//         setIsBlocked(true)
//         showNotification("Your account has been blocked from using this feature.", "error")
//         return
//       }
//       setIsBlocked(false)
//     } catch (error) {
//       console.error("Error checking blocked status:", error)
//     }
//   }

//   // Initialize user state and check year selection
//   useEffect(() => {
//     if (!isBrowser || !isAuthenticated || isBlocked || !database || !userId) return

//     const initializeUserData = async () => {
//       try {
//         const yearRef = ref(database, `userYears/${userId}`)
//         const yearSnapshot = await get(yearRef)

//         if (yearSnapshot.exists()) {
//           const selectedYear = yearSnapshot.val()
//           setCurrentYear(selectedYear)
//           setYearSelected(true)
//           setShowSwapInterface(true)
//           await trackActiveUser(userId, selectedYear)

//           const deletionAttemptsRef = ref(database, `userDeletionAttempts/${userId}`)
//           const deletionAttemptsSnapshot = await get(deletionAttemptsRef)
//           if (deletionAttemptsSnapshot.exists()) {
//             setDeletionAttempts(deletionAttemptsSnapshot.val())
//           }

//           await checkUserHasPosted(userId, selectedYear)
//           await loadListings(selectedYear)
//           // Load analytics for all users
//           await loadAnalytics()
//         }
//         setIsCheckingYearSelection(false)
//       } catch (error) {
//         console.error("Error initializing user data:", error)
//         setIsCheckingYearSelection(false)
//       }
//     }

//     initializeUserData()
//   }, [isBrowser, isAuthenticated, isBlocked, userId, database])

//   const trackActiveUser = async (userId, year) => {
//     if (!database) return
//     try {
//       const activeUserRef = ref(database, `activeUsers/year${year}/${userId}`)
//       await set(activeUserRef, true)
//     } catch (error) {
//       console.error("Error tracking active user:", error)
//     }
//   }

//   const loadAnalytics = async () => {
//     if (!database) return
//     try {
//       const years = ["2", "3"]
//       const combinedData = {
//         mostDemandedSections: {},
//         mostOfferedSections: {},
//         recentActivity: [],
//         totalSwaps: 0,
//         totalActiveUsers: 0,
//         whatsappClicks: 0,
//       }

//       for (const year of years) {
//         const analyticsRef = ref(database, `analytics/year${year}`)
//         const snapshot = await get(analyticsRef)
//         const data = snapshot.val() || {}

//         const demandedSections = data.demandedSections || {}
//         Object.entries(demandedSections).forEach(([section, count]) => {
//           combinedData.mostDemandedSections[section] = (combinedData.mostDemandedSections[section] || 0) + count
//         })

//         const offeredSections = data.offeredSections || {}
//         Object.entries(offeredSections).forEach(([section, count]) => {
//           combinedData.mostOfferedSections[section] = (combinedData.mostOfferedSections[section] || 0) + count
//         })

//         const recentActivityData = data.recentActivity || {}
//         const activities = Object.entries(recentActivityData).map(([id, activity]) => ({ id, ...activity, year }))
//         combinedData.recentActivity.push(...activities)

//         combinedData.totalSwaps += data.totalSwapsEver || 0

//         const activeUsersRef = ref(database, `activeUsers/year${year}`)
//         const activeUsersSnapshot = await get(activeUsersRef)
//         if (activeUsersSnapshot.exists()) {
//           combinedData.totalActiveUsers += Object.keys(activeUsersSnapshot.val()).length
//         }

//         combinedData.whatsappClicks += data.whatsappClicks || 0
//       }

//       const mostDemanded = Object.entries(combinedData.mostDemandedSections)
//         .map(([section, count]) => ({ section, count }))
//         .sort((a, b) => b.count - a.count)
//         .slice(0, 10)

//       const mostOffered = Object.entries(combinedData.mostOfferedSections)
//         .map(([section, count]) => ({ section, count }))
//         .sort((a, b) => b.count - a.count)
//         .slice(0, 10)

//       const recentActivity = combinedData.recentActivity.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10)

//       setAnalyticsData({
//         mostDemandedSections: mostDemanded,
//         mostOfferedSections: mostOffered,
//         recentActivity,
//         totalSwaps: combinedData.totalSwaps,
//         activeUsers: combinedData.totalActiveUsers,
//         whatsappClicks: combinedData.whatsappClicks,
//       })
//     } catch (error) {
//       console.error("Error loading analytics:", error)
//     }
//   }

//   // Enhanced filtering - now shows different views based on filter
//   useEffect(() => {
//     let filtered = listings
//     // Hide user's own listing from the listings view
//     filtered = filtered.filter((listing) => listing.userId !== userId)

//     if (!hasPosted || !userListing) {
//       setFilteredListings([])
//       return
//     }

//     // Apply filters based on selection
//     if (listingFilter === "all") {
//       // Show all listings
//       setFilteredListings(filtered)
//     } else if (listingFilter === "relevant") {
//       // Show relevant sections based on user's listing
//       const userCurrentSection = userListing.currentSection.toLowerCase().trim()
//       const userDesiredSection = userListing.desiredSection.toLowerCase().trim()

//       filtered = filtered.filter((listing) => {
//         const listingCurrent = listing.currentSection.toLowerCase().trim()
//         const listingDesired = listing.desiredSection.toLowerCase().trim()

//         return (
//           listingCurrent === userCurrentSection ||
//           listingCurrent === userDesiredSection ||
//           listingDesired === userCurrentSection ||
//           listingDesired === userDesiredSection
//         )
//       })
//       setFilteredListings(filtered)
//     } else if (listingFilter === "desired") {
//       // Show only listings that have user's desired section
//       const userDesiredSection = userListing.desiredSection.toLowerCase().trim()
//       filtered = filtered.filter((listing) => {
//         const listingCurrent = listing.currentSection.toLowerCase().trim()
//         return listingCurrent === userDesiredSection
//       })
//       setFilteredListings(filtered)
//     }
//   }, [listings, hasPosted, userListing, userId, listingFilter])

//   // Select year - Only allow 2nd year
//   const selectYear = async (year) => {
//     if (yearSelected || !isAuthenticated || isBlocked || !database || !userId || year !== "2") {
//       return
//     }

//     try {
//       const yearRef = ref(database, `userYears/${userId}`)
//       await set(yearRef, year)
//       setCurrentYear(year)
//       setYearSelected(true)
//       setShowSwapInterface(true)
//       await trackActiveUser(userId, year)
//       await checkUserHasPosted(userId, year)
//       await loadListings(year)
//       showNotification(`Year ${year} selected successfully!`, "success")
//     } catch (error) {
//       showNotification("Failed to save year selection. Please try again.", "error")
//     }
//   }

//   // Load listings from Firebase
//   const loadListings = async (year) => {
//     if (!database) {
//       return
//     }
//     setIsLoading(true)
//     const listingsRef = ref(database, `listings/year${year}`)
//     try {
//       const snapshot = await get(listingsRef)
//       setIsLoading(false)
//       const data = snapshot.val()
//       if (!data) {
//         setListings([])
//         return
//       }

//       const listingsArray = Object.entries(data).map(([id, listing]) => ({
//         id,
//         name: listing.name,
//         currentSection: listing.currentSection,
//         desiredSection: listing.desiredSection,
//         contact: listing.contact,
//         message: listing.message || "",
//         userId: listing.userId,
//         timestamp: listing.timestamp || Date.now(),
//       }))

//       setListings(listingsArray)

//       if (!userListing) {
//         const foundUserListing = listingsArray.find((listing) => listing.userId === userId)
//         if (foundUserListing) {
//           setUserListing(foundUserListing)
//           setHasPosted(true)
//         }
//       }
//     } catch (error) {
//       setIsLoading(false)
//       showNotification("Failed to load listings: " + error.message, "error")
//     }
//   }

//   // Check if user has already posted
//   const checkUserHasPosted = async (userIdToCheck, year) => {
//     if (!database || !userIdToCheck) return

//     try {
//       const listingsRef = ref(database, `listings/year${year}`)
//       const snapshot = await get(listingsRef)
//       if (snapshot.exists()) {
//         const data = snapshot.val()
//         const userListingEntry = Object.entries(data).find(([_, listing]) => listing.userId === userIdToCheck)
//         if (userListingEntry) {
//           const [id, listing] = userListingEntry
//           setUserListing({
//             id,
//             ...listing,
//           })
//           setHasPosted(true)
//           return
//         }
//       }

//       const otherYear = year === "2" ? "3" : "2"
//       const otherListingsRef = ref(database, `listings/year${otherYear}`)
//       const otherSnapshot = await get(otherListingsRef)
//       if (otherSnapshot.exists()) {
//         const otherData = otherSnapshot.val()
//         const userListingEntry = Object.entries(otherData).find(([_, listing]) => listing.userId === userIdToCheck)
//         if (userListingEntry) {
//           const [id, listing] = userListingEntry
//           setUserListing({
//             id,
//             ...listing,
//           })
//           setHasPosted(true)
//         }
//       }
//     } catch (error) {
//       console.error("Error checking user posts:", error)
//     }
//   }

//   // Handle form input changes with validation
//   const handleInputChange = (e) => {
//     const { id, value } = e.target

//     if (id === "name") {
//       return
//     }

//     if (id === "contact") {
//       const digitsOnly = value.replace(/\D/g, "")
//       if (digitsOnly.length <= 10) {
//         setFormData((prev) => ({ ...prev, [id]: digitsOnly }))
//       }
//       return
//     }

//     if (id === "currentSection" || id === "desiredSection") {
//       if (value.length <= MAX_SECTION_LENGTH) {
//         setFormData((prev) => ({ ...prev, [id]: value }))
//       }
//       return
//     }

//     setFormData((prev) => ({ ...prev, [id]: value }))
//   }

//   // Enhanced form submission
//   const handleFormSubmit = async (e) => {
//     e.preventDefault()

//     if (!isAuthenticated || isBlocked || isRollNumberBlocked) {
//       showNotification("You are not authorized to post a listing", "error")
//       return
//     }

//     if (!database) {
//       showNotification("Database connection error. Please refresh the page.", "error")
//       return
//     }

//     const targetYear = currentYear
//     if (!targetYear) {
//       showNotification("Please select a year first", "error")
//       return
//     }

//     if (formData.contact.length !== 10) {
//       showNotification("Please enter a valid 10-digit phone number", "error")
//       return
//     }

//     setIsLoading(true)

//     try {
//       // Check if user has already posted
//       const years = ["2", "3"]
//       let userHasPosted = false

//       for (const year of years) {
//         const listingsRef = ref(database, `listings/year${year}`)
//         const snapshot = await get(listingsRef)
//         if (snapshot.exists()) {
//           const data = snapshot.val()
//           const hasPosted = Object.values(data).some((listing) => listing.userId === userId)
//           if (hasPosted) {
//             userHasPosted = true
//             break
//           }
//         }
//       }

//       if (userHasPosted) {
//         setIsLoading(false)
//         setHasPosted(true)
//         showNotification("You are only allowed to post one swap request.", "error")
//         return
//       }
//     } catch (error) {
//       console.error("Error checking existing posts:", error)
//       setIsLoading(false)
//     }

//     if (formData.currentSection.trim().toLowerCase() === formData.desiredSection.trim().toLowerCase()) {
//       showNotification("Current and desired sections cannot be the same.", "error")
//       setIsLoading(false)
//       return
//     }

//     const listing = {
//       name: userName,
//       currentSection: formData.currentSection.trim(),
//       desiredSection: formData.desiredSection.trim(),
//       contact: formData.contact.trim(),
//       message: formData.message.trim(),
//       userId: userId,
//       timestamp: serverTimestamp(),
//     }

//     const listingsRef = ref(database, `listings/year${targetYear}`)
//     try {
//       const result = await push(listingsRef, listing)
//       setHasPosted(true)
//       setUserListing({
//         id: result.key,
//         ...listing,
//         timestamp: Date.now(),
//       })

//       setFormData({
//         name: "",
//         currentSection: "",
//         desiredSection: "",
//         contact: "",
//         message: "",
//       })

//       updateAnalyticsData(targetYear, formData.currentSection.trim(), formData.desiredSection.trim())
//       showNotification("Your swap request has been posted successfully!", "success")
//       loadListings(targetYear)
//       setIsLoading(false)
//     } catch (error) {
//       setIsLoading(false)
//       showNotification(`Failed to post your request: ${error.message}`, "error")
//     }
//   }

//   // Delete listing - only for user's own posts
//   const deleteListing = async () => {
//     if (!database || !currentYear || !userListing) return

//     if (deletionAttempts >= MAX_DELETION_ATTEMPTS) {
//       showNotification(`You have reached the maximum number of deletion attempts (${MAX_DELETION_ATTEMPTS})`, "error")
//       return
//     }

//     const listingRef = ref(database, `listings/year${currentYear}/${userListing.id}`)
//     try {
//       const snapshot = await get(listingRef)
//       if (snapshot.exists()) {
//         await remove(listingRef)
//         showNotification("Your listing has been deleted", "success")
//         setDeletionAttempts((prev) => prev + 1)
//         setHasPosted(false)
//         setUserListing(null)
//         setFilteredListings([])

//         // Store deletion attempts
//         const deletionAttemptsRef = ref(database, `userDeletionAttempts/${userId}`)
//         await set(deletionAttemptsRef, deletionAttempts + 1)

//         setFormData({
//           name: "",
//           currentSection: "",
//           desiredSection: "",
//           contact: "",
//           message: "",
//         })

//         loadListings(currentYear)
//       } else {
//         showNotification("Listing not found. It may have been already deleted.", "error")
//       }
//     } catch (error) {
//       showNotification("Failed to delete listing. Please try again.", "error")
//     }
//   }

//   // Refresh listings
//   const refreshListings = () => {
//     if (currentYear) {
//       loadListings(currentYear)
//       showNotification("Listings refreshed!", "success")
//     }
//   }

//   // Show notification
//   const showNotification = (message, type = "info") => {
//     setNotification({ show: true, message, type })
//     setTimeout(() => {
//       setNotification((prev) => ({ ...prev, show: false }))
//     }, 3000)
//   }

//   // Update analytics data
//   const updateAnalyticsData = async (year, currentSection, desiredSection) => {
//     if (!database) return

//     try {
//       const demandedSectionRef = ref(database, `analytics/year${year}/demandedSections/${desiredSection}`)
//       await set(demandedSectionRef, increment(1))

//       const offeredSectionRef = ref(database, `analytics/year${year}/offeredSections/${currentSection}`)
//       await set(offeredSectionRef, increment(1))

//       const recentActivityRef = ref(database, `analytics/year${year}/recentActivity/${Date.now()}`)
//       await set(recentActivityRef, {
//         type: "new_listing",
//         user: userName,
//         userId: userId,
//         currentSection,
//         desiredSection,
//         timestamp: Date.now(),
//       })

//       const totalSwapsRef = ref(database, `analytics/year${year}/totalSwapsEver`)
//       await set(totalSwapsRef, increment(1))
//     } catch (error) {
//       console.error("Error updating analytics data:", error)
//     }
//   }

//   // Track WhatsApp clicks
//   const trackWhatsAppClick = async () => {
//     if (!database || !currentYear) return
//     try {
//       const whatsappClicksRef = ref(database, `analytics/year${currentYear}/whatsappClicks`)
//       await set(whatsappClicksRef, increment(1))
//     } catch (error) {
//       console.error("Error tracking WhatsApp click:", error)
//     }
//   }

//   const handleDashboardAccess = () => {
//     setShowDashboard(true)
//     setActiveView("")
//     loadAnalytics()
//   }

//   // Helper functions
//   const getUserIconColor = (name) => {
//     if (!name) return "#10b981"
//     const colors = ["#ff6b35", "#f7931e", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"]
//     let hash = 0
//     for (let i = 0; i < name.length; i++) {
//       hash = name.charCodeAt(i) + ((hash << 5) - hash)
//     }
//     return colors[Math.abs(hash) % colors.length]
//   }

//   const getUserInitials = (name) => {
//     if (!name) return "U"
//     const parts = name.trim().split(/\s+/)
//     if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
//     return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
//   }

//   const formatTimestamp = (timestamp) => {
//     if (!timestamp) return "Unknown"
//     const date = new Date(timestamp)
//     return date.toLocaleString("en-IN", {
//       day: "numeric",
//       month: "long",
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   }

//   const connectViaWhatsApp = async (phoneNumber) => {
//     await trackWhatsAppClick()
//     const whatsappURL = `https://wa.me/91${phoneNumber}`
//     window.open(whatsappURL, "_blank")
//   }

//   // Handle support
//   const handleSupport = () => {
//     window.open("https://kiithub.in/feedback/", "_blank")
//   }

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="loading-card">
//           <div className="loading-spinner"></div>
//           <p className="loading-text">Loading KIITHub...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!isBrowser) {
//     return (
//       <div className="enhanced-loading-container">
//         <div className="enhanced-loading-spinner"></div>
//         <p>Loading KIITHub...</p>
//       </div>
//     )
//   }

//   if (isRollNumberBlocked) {
//     return (
//       <div className="enhanced-container">
//         <div className="enhanced-blocked-message">
//           <div className="blocked-icon">🎓</div>
//           <h2>Eligibility Notice</h2>
//           <p>Only 3rd semester students are eligible for section swapping at this time.</p>
//           <div className="blocked-details">
//             <p>This feature will be available for other semesters soon.</p>
//             <p>Thank you for your patience!</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (isBlocked) {
//     return (
//       <div className="enhanced-container">
//         <div className="enhanced-blocked-message">
//           <div className="blocked-icon">🔒</div>
//           <h2>Access Restricted</h2>
//           <p>This feature is not available for your account.</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <ThemeContext.Provider value={{ isDark, toggleTheme }}>
//       <div className="enhanced-container">
//         <header className="enhanced-header">
//           <div className="enhanced-logo">
//             <div className="logo-icon">
//               <Sparkles size={28} />
//             </div>
//             <div className="logo-text">
//               <h1>KIITHub</h1>
//               <span>Section Swap</span>
//             </div>
//           </div>
//           <nav className="enhanced-nav">
//             <button
//               className={`nav-btn ${activeView === "swap" && !showDashboard ? "active" : ""}`}
//               onClick={() => {
//                 setActiveView("swap")
//                 setShowDashboard(false)
//               }}
//             >
//               <RefreshCw size={16} />
//               <span className="nav-text">Swap Section</span>
//             </button>
//             <button className={`nav-btn ${showDashboard ? "active" : ""}`} onClick={handleDashboardAccess}>
//               <BarChart2 size={16} />
//               <span className="nav-text">Analytics</span>
//             </button>
//             <button
//               className={`nav-btn ${activeView === "policy" && !showDashboard ? "active" : ""}`}
//               onClick={() => {
//                 setActiveView("policy")
//                 setShowDashboard(false)
//               }}
//             >
//               <span className="nav-text">📜Terms & Policy</span>
//             </button>
//             <button className="nav-btn support-btn" onClick={handleSupport}>
//               <HelpCircle size={16} />
//               <span className="nav-text">Support</span>
//               <ExternalLink size={12} />
//             </button>
//             <button className="nav-btn theme-btn" onClick={toggleTheme}>
//               {isDark ? <Sun size={16} /> : <Moon size={16} />}
//               <span className="nav-text">{isDark ? "Light" : "Dark"}</span>
//             </button>
//           </nav>
//         </header>

//         <main className="enhanced-main">
//           {isAuthenticated && showDashboard && (
//             <section className="enhanced-dashboard">
//               <div className="dashboard-header">
//                 <div className="dashboard-title">
//                   <BarChart2 size={32} />
//                   <div>
//                     <h2>Section Swap Analytics</h2>
//                     <p>Real-time analytics and insights for section swapping</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="enhanced-stats-grid">
//                 <div className="enhanced-stat-card total-swaps">
//                   <div className="stat-icon trending">
//                     <TrendingUp size={28} />
//                   </div>
//                   <div className="stat-content">
//                     <h3>Total Swap Requests</h3>
//                     <p className="stat-value">{analyticsData.totalSwaps}</p>
//                     <span className="stat-subtitle">Including deleted requests</span>
//                   </div>
//                 </div>

//                 <div className="enhanced-stat-card active-users">
//                   <div className="stat-icon users">
//                     <Users size={28} />
//                   </div>
//                   <div className="stat-content">
//                     <h3>Active Users</h3>
//                     <p className="stat-value">{analyticsData.activeUsers}</p>
//                     <span className="stat-subtitle">Users who selected years</span>
//                   </div>
//                 </div>

//                 <div className="enhanced-stat-card whatsapp-clicks">
//                   <div className="stat-icon whatsapp">
//                     <Phone size={28} />
//                   </div>
//                   <div className="stat-content">
//                     <h3>WhatsApp Connections</h3>
//                     <p className="stat-value">{analyticsData.whatsappClicks}</p>
//                     <span className="stat-subtitle">Total WhatsApp clicks</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="enhanced-dashboard-tabs">
//                 <button
//                   className={dashboardTab === "overview" ? "active" : ""}
//                   onClick={() => setDashboardTab("overview")}
//                 >
//                   <Activity size={16} />
//                   <span>Overview</span>
//                 </button>
//                 <button className={dashboardTab === "demand" ? "active" : ""} onClick={() => setDashboardTab("demand")}>
//                   <TrendingUp size={16} />
//                   <span>Most Demanded</span>
//                 </button>
//                 <button
//                   className={dashboardTab === "offered" ? "active" : ""}
//                   onClick={() => setDashboardTab("offered")}
//                 >
//                   <RefreshCw size={16} />
//                   <span>Most Offered</span>
//                 </button>
//                 <button
//                   className={dashboardTab === "activity" ? "active" : ""}
//                   onClick={() => setDashboardTab("activity")}
//                 >
//                   <Clock size={16} />
//                   <span>Recent Activity</span>
//                 </button>
//               </div>

//               <div className="enhanced-dashboard-content">
//                 {dashboardTab === "overview" && (
//                   <div className="overview-section">
//                     <h3>Platform Overview</h3>
//                     <p className="chart-description">Complete analytics overview of the section swap platform</p>
//                     <div className="overview-grid">
//                       <div className="overview-card">
//                         <div className="overview-icon">
//                           <Users size={24} />
//                         </div>
//                         <div className="overview-content">
//                           <h4>Total Active Users</h4>
//                           <p className="overview-value">{analyticsData.activeUsers}</p>
//                           <span className="overview-desc">Users who selected their year</span>
//                         </div>
//                       </div>
//                       <div className="overview-card">
//                         <div className="overview-icon">
//                           <TrendingUp size={24} />
//                         </div>
//                         <div className="overview-content">
//                           <h4>Total Requests</h4>
//                           <p className="overview-value">{analyticsData.totalSwaps}</p>
//                           <span className="overview-desc">All swap requests ever made</span>
//                         </div>
//                       </div>
//                       <div className="overview-card">
//                         <div className="overview-icon">
//                           <Phone size={24} />
//                         </div>
//                         <div className="overview-content">
//                           <h4>WhatsApp Connections</h4>
//                           <p className="overview-value">{analyticsData.whatsappClicks}</p>
//                           <span className="overview-desc">Total connection attempts</span>
//                         </div>
//                       </div>
//                       <div className="overview-card">
//                         <div className="overview-icon">
//                           <Activity size={24} />
//                         </div>
//                         <div className="overview-content">
//                           <h4>Engagement Rate</h4>
//                           <p className="overview-value">
//                             {analyticsData.totalSwaps > 0
//                               ? Math.round((analyticsData.whatsappClicks / analyticsData.totalSwaps) * 100)
//                               : 0}
//                             %
//                           </p>
//                           <span className="overview-desc">Platform engagement</span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {dashboardTab === "demand" && (
//                   <div className="enhanced-chart-section">
//                     <h3>Most Demanded Sections</h3>
//                     <p className="chart-description">These sections are the most requested by students</p>
//                     {analyticsData.mostDemandedSections.length > 0 ? (
//                       <div className="enhanced-chart-bars">
//                         {analyticsData.mostDemandedSections.map((item, index) => (
//                           <div className="enhanced-chart-item" key={index}>
//                             <div className="chart-rank">#{index + 1}</div>
//                             <div className="chart-label">Section {item.section}</div>
//                             <div className="chart-bar-container">
//                               <div
//                                 className="enhanced-chart-bar demand"
//                                 style={{
//                                   width: `${Math.min(
//                                     100,
//                                     (item.count / (analyticsData.mostDemandedSections[0]?.count || 1)) * 100,
//                                   )}%`,
//                                 }}
//                               ></div>
//                               <span className="chart-value">{item.count} requests</span>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="enhanced-empty-state">
//                         <div className="empty-icon">📊</div>
//                         <p>No demand data available yet</p>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {dashboardTab === "offered" && (
//                   <div className="enhanced-chart-section">
//                     <h3>Most Offered Sections</h3>
//                     <p className="chart-description">These sections are the most offered by students</p>
//                     {analyticsData.mostOfferedSections.length > 0 ? (
//                       <div className="enhanced-chart-bars">
//                         {analyticsData.mostOfferedSections.map((item, index) => (
//                           <div className="enhanced-chart-item" key={index}>
//                             <div className="chart-rank">#{index + 1}</div>
//                             <div className="chart-label">Section {item.section}</div>
//                             <div className="chart-bar-container">
//                               <div
//                                 className="enhanced-chart-bar offer"
//                                 style={{
//                                   width: `${Math.min(
//                                     100,
//                                     (item.count / (analyticsData.mostOfferedSections[0]?.count || 1)) * 100,
//                                   )}%`,
//                                 }}
//                               ></div>
//                               <span className="chart-value">{item.count} offers</span>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="enhanced-empty-state">
//                         <div className="empty-icon">📈</div>
//                         <p>No offer data available yet</p>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {dashboardTab === "activity" && (
//                   <div className="enhanced-activity-section">
//                     <h3>Recent Activity</h3>
//                     <p className="chart-description">Latest section swap activities (All Years)</p>
//                     {analyticsData.recentActivity.length > 0 ? (
//                       <div className="enhanced-activity-list">
//                         {analyticsData.recentActivity.map((activity, index) => (
//                           <div className="enhanced-activity-item" key={index}>
//                             <div className="activity-icon">
//                               {activity.type === "new_listing" ? <MessageSquare size={16} /> : <RefreshCw size={16} />}
//                             </div>
//                             <div className="activity-content">
//                               <p>
//                                 <strong>{activity.user}</strong>{" "}
//                                 {activity.type === "new_listing" ? "posted a new swap request" : "completed a swap"}
//                                 {activity.year && <span className="year-badge">Year {activity.year}</span>}
//                               </p>
//                               <p className="activity-details">
//                                 Section {activity.currentSection} → Section {activity.desiredSection}
//                               </p>
//                               <p className="activity-time">
//                                 <Clock size={12} /> {formatTimestamp(activity.timestamp)}
//                               </p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="enhanced-empty-state">
//                         <div className="empty-icon">⚡</div>
//                         <p>No recent activity</p>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               <div className="dashboard-footer">
//                 <p>
//                   <Activity size={14} /> Data updates in real-time
//                 </p>
//               </div>
//             </section>
//           )}

//           {isAuthenticated && activeView === "swap" && !showDashboard && (
//             <section className="enhanced-swap-section">
//               {!yearSelected && !currentYear && !isCheckingYearSelection && (
//                 <div className="premium-year-selection">
//                   <div className="year-selection-container">
//                     <div className="year-selection-header">
//                       <Sparkles size={48} className="sparkle-icon" />
//                       <h2>Welcome to Section Swap</h2>
//                       <p>Currently available for 2nd year students only</p>
//                     </div>
//                     <div className="premium-year-cards">
//                       <div
//                         className={`premium-year-card ${currentYear === "2" ? "selected" : ""}`}
//                         onClick={() => selectYear("2")}
//                       >
//                         <div className="year-card-icon">
//                           <Users size={32} />
//                         </div>
//                         <div className="year-card-content">
//                           <h3>2nd Year</h3>
//                           <p>Connect with your 2nd year batchmates</p>
//                           <div className="year-card-features">
//                             <span>✨ Access 2nd-year section swaps</span>
//                             <span>📈 Track your swap progress</span>
//                             <span>🔄 Exchange sections easily</span>
//                           </div>
//                         </div>
//                         <div className="year-card-arrow">
//                           <RefreshCw size={20} />
//                         </div>
//                       </div>
//                       <div className="premium-year-card disabled">
//                         <div className="year-card-icon disabled">
//                           <Users size={32} />
//                         </div>
//                         <div className="year-card-content">
//                           <h3>3rd Year</h3>
//                           <p>Coming Soon...</p>
//                           <div className="year-card-features">
//                             <span>🚧 Under Development</span>
//                             <span>⏳ Available Soon</span>
//                             <span>🔒 Currently Restricted</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="year-selection-warning">
//                       <AlertTriangle size={20} />
//                       <div>
//                         <h4>Important Notice</h4>
//                         <p>Year selection is permanent and cannot be changed later. Choose carefully!</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {isCheckingYearSelection && (
//                 <div className="enhanced-loading">
//                   <div className="enhanced-loading-spinner"></div>
//                   <p>Loading your profile...</p>
//                 </div>
//               )}

//               {yearSelected && currentYear && !isCheckingYearSelection && (
//                 <div className="enhanced-year-info">
//                   <div className="year-info-content">
//                     <div className="year-info-text">
//                       <h3>Year: {currentYear === "2" ? "2nd Year" : "3rd Year"}</h3>
//                       <div className="year-locked">
//                         <span>Settings locked for consistency</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {yearSelected && currentYear && !hasPosted && showSwapInterface && (
//                 <div className="enhanced-form-section">
//                   <div className="form-card">
//                     <div className="form-header">
//                       <h2>Post Your Section Swap Request</h2>
//                       <p>Fill out the form below to post your swap request</p>
//                     </div>
//                     <form onSubmit={handleFormSubmit} className="enhanced-form">
//                       <div className="form-row">
//                         <div className="form-group">
//                           <label htmlFor="name">Your Name</label>
//                           <input type="text" id="name" value={userName} disabled className="form-input disabled" />
//                         </div>
//                         <div className="form-group">
//                           <label htmlFor="contact">Contact Number</label>
//                           <input
//                             type="tel"
//                             id="contact"
//                             value={formData.contact}
//                             onChange={handleInputChange}
//                             placeholder="Enter 10-digit number (only indian numbers)"
//                             required
//                             className="form-input"
//                           />
//                         </div>
//                       </div>
//                       <div className="form-row">
//                         <div className="form-group">
//                           <label htmlFor="currentSection">Current Section</label>
//                           <input
//                             type="text"
//                             id="currentSection"
//                             value={formData.currentSection}
//                             onChange={handleInputChange}
//                             placeholder="e.g., 1"
//                             required
//                             className="form-input"
//                           />
//                         </div>
//                         <div className="form-group">
//                           <label htmlFor="desiredSection">Desired Section</label>
//                           <input
//                             type="text"
//                             id="desiredSection"
//                             value={formData.desiredSection}
//                             onChange={handleInputChange}
//                             placeholder="e.g., 2"
//                             required
//                             className="form-input"
//                           />
//                         </div>
//                       </div>
//                       <div className="form-group">
//                         <label htmlFor="message">Additional Message (Optional)</label>
//                         <textarea
//                           id="message"
//                           value={formData.message}
//                           onChange={handleInputChange}
//                           placeholder="Any additional information or preferences..."
//                           rows={3}
//                           className="form-textarea"
//                         />
//                       </div>
//                       <button type="submit" disabled={isLoading} className="submit-btn">
//                         {isLoading ? (
//                           <>
//                             <div className="loading-spinner"></div>
//                             Posting...
//                           </>
//                         ) : (
//                           <>
//                             <RefreshCw size={16} />
//                             Post Swap Request
//                           </>
//                         )}
//                       </button>
//                     </form>
//                   </div>
//                 </div>
//               )}

//               {hasPosted && userListing && (
//                 <div className="user-listing-section">
//                   <div className="user-posted-card">
//                     <div className="posted-header">
//                       <div className="posted-title">
//                         <h3>Your Posted Request</h3>
//                       </div>
//                       <button
//                         onClick={deleteListing}
//                         className="delete-icon-btn"
//                         disabled={deletionAttempts >= MAX_DELETION_ATTEMPTS}
//                         title="Delete your request"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     </div>
//                     <div className="posted-content">
//                       <div className="posted-user">
//                         <div className="posted-avatar" style={{ backgroundColor: getUserIconColor(userListing.name) }}>
//                           {getUserInitials(userListing.name)}
//                         </div>
//                         <div className="posted-info">
//                           <h4>{userListing.name}</h4>
//                           <p>{formatTimestamp(userListing.timestamp)}</p>
//                         </div>
//                       </div>
//                       <div className="posted-sections">
//                         <div className="section-has">
//                           <span className="section-label">Section {userListing.currentSection}</span>
//                         </div>
//                         <div className="swap-arrow">
//                           <RefreshCw size={16} />
//                         </div>
//                         <div className="section-wants">
//                           <span className="wants-text">WANTS</span>
//                           <span className="section-label">Section {userListing.desiredSection}</span>
//                         </div>
//                       </div>
//                       <div className="posted-contact">
//                         <Phone size={14} />
//                         <span>{userListing.contact}</span>
//                       </div>
//                       {userListing.message && (
//                         <div className="posted-message">
//                           <MessageSquare size={14} />
//                           <p>{userListing.message}</p>
//                         </div>
//                       )}
//                     </div>
//                     <div className="deletion-info">
//                       <AlertTriangle size={12} />
//                       <span>
//                         Deletions: {deletionAttempts}/{MAX_DELETION_ATTEMPTS}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {yearSelected && currentYear && hasPosted && userListing && (
//                 <div className="enhanced-listings-section">
//                   <div className="listings-header">
//                     <h2>Section Swap Requests</h2>
//                     <p>Browse and filter swap requests from other students</p>
//                     <div className="listings-count">
//                       {filteredListings.length} {filteredListings.length === 1 ? "listing" : "listings"} found
//                     </div>
//                   </div>

//                   <div className="filter-section">
//                     <div className="filter-buttons">
//                       <button
//                         className={`filter-btn ${listingFilter === "all" ? "active" : ""}`}
//                         onClick={() => setListingFilter("all")}
//                       >
//                         <Eye size={16} />
//                         <span>Show All</span>
//                         <span className="filter-count">{listings.filter((l) => l.userId !== userId).length}</span>
//                       </button>
//                       <button
//                         className={`filter-btn ${listingFilter === "relevant" ? "active" : ""}`}
//                         onClick={() => setListingFilter("relevant")}
//                       >
//                         <Filter size={16} />
//                         <span>Show Relevant</span>
//                         <span className="filter-count">
//                           {
//                             listings.filter((listing) => {
//                               if (listing.userId === userId) return false
//                               const userCurrentSection = userListing.currentSection.toLowerCase().trim()
//                               const userDesiredSection = userListing.desiredSection.toLowerCase().trim()
//                               const listingCurrent = listing.currentSection.toLowerCase().trim()
//                               const listingDesired = listing.desiredSection.toLowerCase().trim()
//                               return (
//                                 listingCurrent === userCurrentSection ||
//                                 listingCurrent === userDesiredSection ||
//                                 listingDesired === userCurrentSection ||
//                                 listingDesired === userDesiredSection
//                               )
//                             }).length
//                           }
//                         </span>
//                       </button>
//                       <button
//                         className={`filter-btn ${listingFilter === "desired" ? "active" : ""}`}
//                         onClick={() => setListingFilter("desired")}
//                       >
//                         <Target size={16} />
//                         <span>My Desired Section</span>
//                         <span className="filter-count">
//                           {
//                             listings.filter((listing) => {
//                               if (listing.userId === userId) return false
//                               const userDesiredSection = userListing.desiredSection.toLowerCase().trim()
//                               const listingCurrent = listing.currentSection.toLowerCase().trim()
//                               return listingCurrent === userDesiredSection
//                             }).length
//                           }
//                         </span>
//                       </button>
//                     </div>
//                   </div>

//                   <div className="refresh-notice">
//                     <div className="refresh-content">
//                       <RefreshCw size={16} />
//                       <span>Refresh the page to see the latest updated data</span>
//                       <button onClick={refreshListings} className="refresh-btn">
//                         Refresh Now
//                       </button>
//                     </div>
//                   </div>

//                   {isLoading ? (
//                     <div className="enhanced-loading">
//                       <div className="enhanced-loading-spinner"></div>
//                       <p>Loading listings...</p>
//                     </div>
//                   ) : filteredListings.length > 0 ? (
//                     <div className="enhanced-listings-grid">
//                       {filteredListings.map((listing) => (
//                         <div key={listing.id} className="clean-listing-card">
//                           <div className="card-header">
//                             <div className="user-avatar" style={{ backgroundColor: getUserIconColor(listing.name) }}>
//                               {getUserInitials(listing.name)}
//                             </div>
//                             <div className="user-info">
//                               <h4 className="user-name">{listing.name}</h4>
//                               <p className="listing-time">{formatTimestamp(listing.timestamp)}</p>
//                             </div>
//                           </div>
//                           <div className="section-display">
//                             <div className="section-has">
//                               <span className="section-label">Section {listing.currentSection}</span>
//                             </div>
//                             <div className="swap-icon">
//                               <RefreshCw size={20} />
//                             </div>
//                             <div className="section-wants">
//                               <span className="wants-text">WANTS</span>
//                               <span className="section-label">Section {listing.desiredSection}</span>
//                             </div>
//                           </div>
//                           {listing.message && (
//                             <div className="message-display">
//                               <p>{listing.message}</p>
//                             </div>
//                           )}
//                           <button onClick={() => connectViaWhatsApp(listing.contact)} className="whatsapp-btn">
//                             <MessageSquare size={18} />
//                             WhatsApp
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="enhanced-empty-state">
//                       <div className="empty-icon">🔍</div>
//                       <h3>No listings found</h3>
//                       <p>
//                         {listingFilter === "all" && "No swap requests available at the moment"}
//                         {listingFilter === "relevant" &&
//                           `No relevant listings for sections ${userListing.currentSection} and ${userListing.desiredSection}`}
//                         {listingFilter === "desired" &&
//                           `No listings available for your desired section ${userListing.desiredSection}`}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {yearSelected && currentYear && !hasPosted && (
//                 <div className="enhanced-empty-state">
//                   <div className="empty-icon">📝</div>
//                   <h3>Post Your Request First</h3>
//                   <p>You need to post your section swap request before you can see other listings</p>
//                 </div>
//               )}
//             </section>
//           )}

//           {activeView === "policy" && !showDashboard && (
//             <section className="enhanced-policy-section">
//               <div className="enhanced-policy-card">
//                 <h2>Terms & Policy</h2>
//                 <div className="policy-content">
//                   <h3>How KIITHub Section Swap Works</h3>
//                   <p>
//                     KIITHub Section Swap is a platform designed to help KIIT University students find others who are
//                     interested in swapping their assigned sections.
//                   </p>

//                   <h3>Guidelines</h3>
//                   <ul>
//                     <li>Each user is allowed to post only three swap request</li>
//                     <li>Year selection is permanent for all users</li>
//                     <li>Contact only if swap matches</li>
//                     <li>Be respectful and courteous in your communications</li>
//                     <li>Follow the university's official process for section changes</li>
//                     <li>Remove post after successful swap</li>
//                   </ul>

//                   <h3>Features</h3>
//                   <ul>
//                     <li>
//                       <strong>Flexible Section Input:</strong> Post sections up to 20 characters (e.g., 2,3,5)
//                     </li>
//                     <li>
//                       <strong>View All Requests:</strong> See all users' swap listings
//                     </li>
//                     <li>
//                       <strong>Relevant Matches:</strong> See requests matching your section
//                     </li>
//                     <li>
//                       <strong>Desired Section Search:</strong> View others wanting your section
//                     </li>
//                     <li>
//                       <strong>WhatsApp Integration:</strong> Connect directly via WhatsApp
//                     </li>
//                   </ul>

//                   <h3>Support</h3>
//                   <p>
//                     For any issues, errors, or support needs, please visit our main website at{" "}
//                     <a
//                       href="https://kiithub.in/feedback/"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="support-link"
//                     >
//                       kiithub.in
//                     </a>
//                   </p>

//                   <h3>Disclaimer</h3>
//                   <p>
//                     KIITHub Section Swap is an unofficial student-driven platform to help you find potential section
//                     swap partners. This platform does <strong>not</strong> perform the actual swapping. All official
//                     swaps must be done through KIIT University's administration.
//                   </p>
//                 </div>
//               </div>
//             </section>
//           )}
//         </main>

//         <footer className="enhanced-footer">
//           <p>&copy; {new Date().getFullYear()} KIITHub Section Swap | Made with ❤️ for KIIT Students</p>
//           <div className="footer-support">
//             <button onClick={handleSupport} className="footer-support-btn">
//               <HelpCircle size={14} />
//               Need Help? Visit KIITHub.in
//               <ExternalLink size={12} />
//             </button>
//           </div>
//         </footer>

//         {notification.show && (
//           <div className={`enhanced-notification ${notification.type}`}>
//             <div className="notification-content">
//               {notification.type === "success" && "✅"}
//               {notification.type === "error" && "❌"}
//               {notification.type === "info" && "ℹ️"}
//               <span>{notification.message}</span>
//             </div>
//           </div>
//         )}
//       </div>
//     </ThemeContext.Provider>
//   )
// }





"use client"

import React from 'react';
import { ArrowLeft, RefreshCw, MessageSquare } from 'lucide-react';
import './styles.css';

export default function SectionSwapping({ onGoBack }) {
  const handleWhatsAppClick = () => {
    window.open('https://chat.whatsapp.com/L49NFqYQ1aWCRObYUBpZax', '_blank');
  };

  return (
    <div className="coming-soon-container">
      <div className="coming-soon-card">
        <div className="coming-soon-icon">
          <RefreshCw size={48} />
        </div>
        
        <h1 className="coming-soon-title">Coming Next Semester</h1>
        <div className="coming-soon-divider"></div>
        
        <p className="coming-soon-description">
          Section Swapping will be available after you complete your current semester and selection process is officially announced by the university.
        </p>
        
        <p className="coming-soon-subtitle">
          Stay tuned and join our WhatsApp community in the meantime!
        </p>
        
        <div className="coming-soon-buttons">
          <button onClick={handleWhatsAppClick} className="whatsapp-btn">
            <MessageSquare size={20} />
            Join WhatsApp
          </button>
          
          <button onClick={onGoBack} className="back-btn">
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}