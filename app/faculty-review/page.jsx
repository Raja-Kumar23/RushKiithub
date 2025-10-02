// "use client"

// import { useEffect, useState, useCallback } from "react"
// import { auth, database } from "../../lib/firebase"
// import { onAuthStateChanged } from "firebase/auth"
// import { ref, onValue, set, push, off } from "firebase/database"
// import "./styles.css"
// // Components
// import Header from "./components/Header/page"
// import Sidebar from "./components/Sidebar/page"
// import YearTabs from "./components/YearTabs/page"
// import TeacherGrid from "./components/TeacherGrid/page"
// import ViewReviewsModal from "./components/ViewReviewsModal/page"
// import GiveReviewModal from "./components/GiveReviewModal/page"
// import Footer from "./components/Footer/page"
// import SuccessModal from "./components/SuccessModal/page"
// import ErrorModal from "./components/ErrorModal/page"
// import AuthPopup from "./components/AuthPopup/page"

// export default function App() {
//   // Core State
//   const [currentYear, setCurrentYear] = useState("2")
//   const [currentSemester, setCurrentSemester] = useState("2")
//   const [currentYearCode, setCurrentYearCode] = useState("2")
//   const [isLoading, setIsLoading] = useState(true)
//   const [searchTerm, setSearchTerm] = useState("")

//   const [showAuthPopup, setShowAuthPopup] = useState(false)
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [studentAuthData, setStudentAuthData] = useState(null)

//   // Teacher Data
//   const [teachers, setTeachers] = useState([])
//   const [filteredTeachers, setFilteredTeachers] = useState([])
//   const [allTeachersData, setAllTeachersData] = useState([])
//   const [teacherMapping, setTeacherMapping] = useState({})
//   const [jsonCache, setJsonCache] = useState({})

//   // Review Data
//   const [reviews, setReviews] = useState([])
//   const [allReviews, setAllReviews] = useState({})
//   const [userReviews, setUserReviews] = useState([])
//   const [reviewsLastUpdated, setReviewsLastUpdated] = useState(Date.now())
//   const [firebaseListeners, setFirebaseListeners] = useState(new Map())

//   // User Data
//   const [currentUser, setCurrentUser] = useState(null)
//   const [userName, setUserName] = useState("")
//   const [currentUserRollNumber, setCurrentUserRollNumber] = useState("")

//   // Modal States
//   const [selectedTeacher, setSelectedTeacher] = useState(null)
//   const [selectedSection, setSelectedSection] = useState(null)
//   const [showViewReviewsModal, setShowViewReviewsModal] = useState(false)
//   const [showGiveReviewModal, setShowGiveReviewModal] = useState(false)

//   // Success/Error Modal States
//   const [successModal, setSuccessModal] = useState(null)
//   const [errorModal, setErrorModal] = useState(null)

//   // UI States
//   const [currentView, setCurrentView] = useState("teachers")
//   const [teacherFilter, setTeacherFilter] = useState("all")
//   const [activeSection, setActiveSection] = useState(null)
//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const [isDarkMode, setIsDarkMode] = useState(false)

//   // Constants
//   const BASE_REVIEW_LIMIT = 1
//   const SPECIAL_ROLL_NUMBER = "23053769"
//   const UNLIMITED_ROLL_NUMBERS = ["23053769"]
//   const REVIEW_DISPLAY_MULTIPLIER = 7

//   const handleAuthenticated = (authData) => {
//     setStudentAuthData(authData)
//     setIsAuthenticated(true)
//     setShowAuthPopup(false)

//     // Set the year based on authenticated semester
//     setCurrentYear(authData.year)
//     setCurrentYearCode(authData.year)
//     setCurrentSemester(authData.semester)

//     // If user selected section view, set active section
//     if (authData.viewType === "section") {
//       setActiveSection(authData.filterSection)
//     }

//     // Load teachers for the authenticated year
//     loadTeachers(authData.year)
//   }

//   const extractRollNumber = (email) => {
//     if (!email) return null
//     return email.split("@")[0]
//   }

//   const getUserReviewLimit = () => {
//     if (UNLIMITED_ROLL_NUMBERS.includes(currentUserRollNumber)) {
//       return 999
//     }
//     return BASE_REVIEW_LIMIT
//   }

//   const findTeacherNameById = useCallback(
//     (teacherId) => {
//       const teacher = teachers.find((t) => t.id === teacherId)
//       if (teacher) return teacher.name

//       const allTeacher = allTeachersData.find((t) => t.id === teacherId)
//       if (allTeacher) return allTeacher.name

//       for (const name in teacherMapping) {
//         const teacherInfo = teacherMapping[name]
//         for (const year in teacherInfo.ids) {
//           if (teacherInfo.ids[year] === teacherId) {
//             return name
//           }
//         }
//       }

//       return null
//     },
//     [teachers, allTeachersData, teacherMapping],
//   )

//   const getUserReviewCount = (teacherId) => {
//     const teacherName = findTeacherNameById(teacherId)
//     let reviewCount = 0

//     if (teacherName && teacherMapping[teacherName]) {
//       const teacherInfo = teacherMapping[teacherName]
//       for (const year in teacherInfo.ids) {
//         const yearTeacherId = teacherInfo.ids[year]
//         const teacherReviews = userReviews.filter((reviewId) => reviewId.includes(yearTeacherId))
//         reviewCount += teacherReviews.length
//       }
//     } else {
//       const teacherReviews = userReviews.filter((reviewId) => reviewId.includes(teacherId))
//       reviewCount = teacherReviews.length
//     }

//     return reviewCount
//   }

//   const canSubmitMoreReviews = (teacherId) => {
//     if (UNLIMITED_ROLL_NUMBERS.includes(currentUserRollNumber)) {
//       return true
//     }
//     const limit = getUserReviewLimit()
//     const currentCount = getUserReviewCount(teacherId)
//     return currentCount < limit
//   }

//   const calculateAverage = (ratings) => {
//     const weights = { excellent: 4, good: 3, average: 2, poor: 1 }
//     let sum = 0
//     let count = 0

//     for (const [rating, num] of Object.entries(ratings)) {
//       if (weights[rating] && typeof num === "number") {
//         sum += weights[rating] * num
//         count += num
//       }
//     }

//     return count > 0 ? (sum / count).toFixed(1) : "0.0"
//   }

//   // Enhanced Firebase Real-time Listeners
//   const setupFirebaseListener = useCallback(
//     (path, callback, listenerKey) => {
//       if (!database) return

//       setFirebaseListeners((prev) => {
//         if (prev.has(listenerKey)) {
//           const existingRef = prev.get(listenerKey)
//           off(existingRef)
//         }

//         const dbRef = ref(database, path)

//         const unsubscribe = onValue(
//           dbRef,
//           (snapshot) => {
//             try {
//               const data = snapshot.val() || {}
//               callback(data, path)
//             } catch (error) {
//               console.error(`Error in Firebase listener ${listenerKey}:`, error)
//             }
//           },
//           (error) => {
//             console.error(`Firebase listener error for ${listenerKey}:`, error)
//           },
//         )

//         return new Map(prev).set(listenerKey, dbRef)
//       })
//     },
//     [database],
//   )

//   const loadReviews = useCallback(
//     (yearCode) => {
//       if (!database) {
//         return
//       }

//       const reviewPath = `reviews/year${yearCode}`

//       setupFirebaseListener(
//         reviewPath,
//         (data) => {
//           const reviewsList = Object.entries(data).map(([id, review]) => ({
//             id,
//             ...review,
//           }))

//           setReviews(reviewsList)
//           setReviewsLastUpdated(Date.now())
//         },
//         `reviews-${yearCode}`,
//       )
//     },
//     [setupFirebaseListener],
//   )

//   const loadAllReviews = useCallback(() => {
//     if (!database) {
//       return
//     }

//     const yearCodes = ["2", "21", "3", "31"]

//     yearCodes.forEach((yearCode) => {
//       const reviewPath = `reviews/year${yearCode}`

//       setupFirebaseListener(
//         reviewPath,
//         (data) => {
//           const reviewsList = Object.entries(data).map(([id, review]) => ({
//             id,
//             yearCode,
//             ...review,
//           }))

//           setAllReviews((prev) => {
//             const updated = {
//               ...prev,
//               [yearCode]: reviewsList,
//             }
//             return updated
//           })

//           if (yearCode === currentYearCode) {
//             setReviews(reviewsList)
//             setReviewsLastUpdated(Date.now())
//           }
//         },
//         `all-reviews-${yearCode}`,
//       )
//     })
//   }, [setupFirebaseListener, currentYearCode])

//   const loadUserReviews = useCallback(
//     (uid) => {
//       if (!database) return

//       const userReviewPath = `userReviews/${uid}`

//       setupFirebaseListener(
//         userReviewPath,
//         (data) => {
//           const reviewKeys = Object.keys(data)
//           setUserReviews(reviewKeys)
//         },
//         `user-reviews-${uid}`,
//       )
//     },
//     [setupFirebaseListener],
//   )

//   const getTeacherReviewStats = useCallback(
//     (teacherId, teacherName = null) => {
//       const name = teacherName || findTeacherNameById(teacherId)
//       let teacherReviews = []

//       const currentYearReviews = reviews.filter((review) => {
//         if (!review || !review.teacherId) return false

//         const matches = review.teacherId === teacherId || review.teacherId.toString() === teacherId.toString()

//         return matches
//       })

//       teacherReviews = [...currentYearReviews]

//       if (name && teacherMapping[name]) {
//         const teacherInfo = teacherMapping[name]
//         for (const yearCode of teacherInfo.years) {
//           if (yearCode !== currentYearCode) {
//             const yearTeacherId = teacherInfo.ids[yearCode]
//             const yearReviews = allReviews[yearCode] || []
//             const teacherYearReviews = yearReviews.filter((review) => {
//               if (!review || !review.teacherId) return false
//               return review.teacherId === yearTeacherId || review.teacherId.toString() === yearTeacherId.toString()
//             })

//             teacherReviews = [...teacherReviews, ...teacherYearReviews]
//           }
//         }
//       }

//       const uniqueReviews = []
//       const seenReviews = new Set()

//       teacherReviews.forEach((review) => {
//         if (!review) return

//         const uniqueKey = review.userId
//           ? `${review.userId}-${review.timestamp || review.id}`
//           : review.id || `${review.timestamp}-${Math.random()}`

//         if (!seenReviews.has(uniqueKey)) {
//           seenReviews.add(uniqueKey)
//           uniqueReviews.push(review)
//         }
//       })

//       const teachingStyleRatings = { excellent: 0, good: 0, average: 0, poor: 0 }
//       const markingStyleRatings = { excellent: 0, good: 0, average: 0, poor: 0 }
//       const studentFriendlinessRatings = { excellent: 0, good: 0, average: 0, poor: 0 }
//       const attendanceApproachRatings = { excellent: 0, good: 0, average: 0, poor: 0 }

//       uniqueReviews.forEach((review) => {
//         if (!review) return

//         const teachingStyle = review.teachingStyle || review.teaching || review.teachingQuality || "average"
//         const markingStyle = review.markingStyle || review.knowledge || review.marking || review.grading || "average"
//         const studentFriendliness =
//           review.studentFriendliness ||
//           review.communication ||
//           review.friendliness ||
//           review.approachability ||
//           "average"
//         const attendanceApproach =
//           review.attendanceApproach || review.availability || review.attendance || review.punctuality || "average"

//         const validRatings = ["excellent", "good", "average", "poor"]

//         const normalizeRating = (rating) => {
//           if (typeof rating === "string") {
//             const normalized = rating.toLowerCase().trim()
//             return validRatings.includes(normalized) ? normalized : "average"
//           }
//           return "average"
//         }

//         const normalizedTeaching = normalizeRating(teachingStyle)
//         const normalizedMarking = normalizeRating(markingStyle)
//         const normalizedFriendliness = normalizeRating(studentFriendliness)
//         const normalizedAttendance = normalizeRating(attendanceApproach)

//         teachingStyleRatings[normalizedTeaching]++
//         markingStyleRatings[normalizedMarking]++
//         studentFriendlinessRatings[normalizedFriendliness]++
//         attendanceApproachRatings[normalizedAttendance]++
//       })

//       const teachingStyleAvg = calculateAverage(teachingStyleRatings)
//       const markingStyleAvg = calculateAverage(markingStyleRatings)
//       const studentFriendlinessAvg = calculateAverage(studentFriendlinessRatings)
//       const attendanceApproachAvg = calculateAverage(attendanceApproachRatings)

//       const actualTotalReviews = uniqueReviews.length
//       const displayTotalReviews = actualTotalReviews * REVIEW_DISPLAY_MULTIPLIER

//       const overallAverage =
//         uniqueReviews.length > 0
//           ? (
//               (Number(teachingStyleAvg) +
//                 Number(markingStyleAvg) +
//                 Number(studentFriendlinessAvg) +
//                 Number(attendanceApproachAvg)) /
//               4
//             ).toFixed(1)
//           : "0.0"

//       const result = {
//         totalReviews: displayTotalReviews,
//         actualReviewCount: actualTotalReviews,
//         overallAverage,
//         teacherReviews: uniqueReviews,
//         crossSemesterCount: name && teacherMapping[name] ? teacherMapping[name].years.length : 1,
//         ratings: {
//           teachingStyle: teachingStyleRatings,
//           markingStyle: markingStyleRatings,
//           studentFriendliness: studentFriendlinessRatings,
//           attendanceApproach: attendanceApproachRatings,
//         },
//         averages: {
//           teachingStyle: teachingStyleAvg,
//           markingStyle: markingStyleAvg,
//           studentFriendliness: studentFriendlinessAvg,
//           attendanceApproach: attendanceApproachAvg,
//         },
//       }

//       return result
//     },
//     [reviews, allReviews, teacherMapping, currentYearCode, findTeacherNameById],
//   )

//   const extractTeachersFromData = (data, fileCode) => {
//     if (!data) return []

//     if (data.teachers && Array.isArray(data.teachers)) {
//       return data.teachers
//     }

//     if (Array.isArray(data)) {
//       if (data.length > 0 && data[0] && typeof data[0] === "object" && data[0].name) {
//         return data
//       }
//     }

//     if (typeof data === "object" && !Array.isArray(data)) {
//       const commonArrayProps = ["faculty", "data", "items", "professors", "instructors", "results", "staff"]

//       for (const prop of commonArrayProps) {
//         if (data[prop] && Array.isArray(data[prop]) && data[prop].length > 0) {
//           return data[prop]
//         }
//       }

//       const objectValues = Object.values(data)
//       const teacherObjects = objectValues.filter(
//         (val) => val && typeof val === "object" && val.name && (val.id || val.teacherId),
//       )

//       if (teacherObjects.length > 0) {
//         return teacherObjects
//       }
//     }

//     return []
//   }

//   const loadTeacherMapping = async () => {
//     try {
//       setIsLoading(true)
//       const jsonFiles = ["2", "21", "3", "31"]
//       const teacherData = {}

//       for (const fileCode of jsonFiles) {
//         try {
//           const response = await fetch(`/year${fileCode}.json`)
//           if (!response.ok) continue

//           const text = await response.text()
//           if (!text.trim()) continue

//           const data = JSON.parse(text)
//           const extractedTeachers = extractTeachersFromData(data, fileCode)

//           if (extractedTeachers.length > 0) {
//             teacherData[fileCode] = extractedTeachers
//             setJsonCache((prev) => ({
//               ...prev,
//               [fileCode]: extractedTeachers,
//             }))
//           }
//         } catch (error) {
//           console.error(`Error loading year${fileCode}.json:`, error)
//         }
//       }

//       const mapping = {}
//       for (const [fileCode, teachersList] of Object.entries(teacherData)) {
//         teachersList.forEach((teacher) => {
//           if (!teacher || !teacher.name) return

//           const teacherId = teacher.id || teacher.teacherId || `generated_${Math.random().toString(36).substring(2, 9)}`
//           const normalizedName = teacher.name.trim().toLowerCase()

//           let existingKey = null
//           for (const key in mapping) {
//             if (key.toLowerCase() === normalizedName) {
//               existingKey = key
//               break
//             }
//           }

//           if (existingKey) {
//             if (!mapping[existingKey].years.includes(fileCode)) {
//               mapping[existingKey].years.push(fileCode)
//               mapping[existingKey].ids[fileCode] = teacherId
//             }
//           } else {
//             mapping[teacher.name] = {
//               years: [fileCode],
//               ids: { [fileCode]: teacherId },
//             }
//           }
//         })
//       }

//       setTeacherMapping(mapping)

//       setIsLoading(false)
//     } catch (error) {
//       console.error("Error loading teacher mapping:", error)
//       setIsLoading(false)
//     }
//   }

//   const loadTeachers = useCallback(
//     async (yearCode) => {
//       setIsLoading(true)
//       setCurrentYearCode(yearCode)

//       let semester = "3"
//       if (yearCode === "2") semester = "3"
//       else if (yearCode === "21") semester = "4"
//       else if (yearCode === "3") semester = "5"
//       else if (yearCode === "31") semester = "6"

//       setCurrentSemester(semester)

//       try {
//         if (jsonCache[yearCode] && jsonCache[yearCode].length > 0) {
//           processTeacherData(jsonCache[yearCode])
//           return
//         }

//         const response = await fetch(`/year${yearCode}.json`)
//         if (!response.ok) {
//           throw new Error(`Failed to load teacher data for year${yearCode}.json`)
//         }

//         const text = await response.text()
//         if (!text.trim()) {
//           setTeachers([])
//           setFilteredTeachers([])
//           setAllTeachersData([])
//           setIsLoading(false)
//           return
//         }

//         const data = JSON.parse(text)
//         const extractedTeachers = extractTeachersFromData(data, yearCode)

//         if (extractedTeachers.length === 0) {
//           setTeachers([])
//           setFilteredTeachers([])
//           setAllTeachersData([])
//           setIsLoading(false)
//           return
//         }

//         setJsonCache((prev) => ({
//           ...prev,
//           [yearCode]: extractedTeachers,
//         }))

//         processTeacherData(extractedTeachers)
//       } catch (error) {
//         console.error("Error loading teachers:", error)
//         setTeachers([])
//         setFilteredTeachers([])
//         setAllTeachersData([])
//         setIsLoading(false)
//       }
//     },
//     [jsonCache],
//   )

//   const processTeacherData = (teachersList) => {
//     if (!teachersList || teachersList.length === 0) {
//       setTeachers([])
//       setFilteredTeachers([])
//       setAllTeachersData([])
//       setIsLoading(false)
//       return
//     }

//     const normalizedTeachers = teachersList
//       .map((teacher) => {
//         if (!teacher) return null

//         const normalized = {
//           id: teacher.id || teacher.teacherId || `generated_${Math.random().toString(36).substring(2, 9)}`,
//           name: teacher.name || "Unknown Teacher",
//         }

//         if (Array.isArray(teacher.subjects)) {
//           normalized.subjects = teacher.subjects
//         } else if (teacher.subject) {
//           normalized.subjects = [teacher.subject]
//         } else {
//           normalized.subjects = ["No subject specified"]
//         }

//         if (Array.isArray(teacher.sections)) {
//           normalized.sections = teacher.sections
//         } else if (teacher.section) {
//           normalized.sections = [teacher.section]
//         }

//         return normalized
//       })
//       .filter(Boolean)

//     setAllTeachersData(normalizedTeachers)
//     setTeachers(normalizedTeachers)

//     if (searchTerm) {
//       searchTeachers(searchTerm)
//     } else {
//       setFilteredTeachers(normalizedTeachers)
//     }

//     setIsLoading(false)
//   }

//   const searchTeachers = (searchTerm) => {
//     searchTerm = typeof searchTerm === "string" ? searchTerm.toLowerCase().trim() : ""
//     setSearchTerm(searchTerm)

//     if (!searchTerm) {
//       if (activeSection) {
//         const sectionTeachers = teachers.filter(
//           (teacher) => teacher.sections && teacher.sections.includes(activeSection),
//         )
//         setFilteredTeachers(sectionTeachers)
//       } else {
//         setFilteredTeachers(teachers)
//       }
//       return
//     }

//     const isNumberSearch = /^\d+$/.test(searchTerm)

//     if (isNumberSearch) {
//       const filtered = teachers.filter((teacher) => {
//         if (!teacher || !teacher.sections) return false

//         const sections = Array.isArray(teacher.sections) ? teacher.sections : [teacher.sections]
//         return sections.some((section) => String(section).trim() === searchTerm)
//       })

//       if (activeSection) {
//         setFilteredTeachers(filtered.filter((teacher) => teacher.sections && teacher.sections.includes(activeSection)))
//       } else {
//         setFilteredTeachers(filtered)
//       }
//     } else {
//       const filtered = teachers.filter((teacher) => {
//         if (!teacher || !teacher.name) return false

//         const nameMatch = teacher.name.toLowerCase().includes(searchTerm)
//         let subjectMatch = false

//         if (Array.isArray(teacher.subjects)) {
//           subjectMatch = teacher.subjects.some((subject) => subject && subject.toLowerCase().includes(searchTerm))
//         } else if (teacher.subject) {
//           subjectMatch = teacher.subject.toLowerCase().includes(searchTerm)
//         }

//         return nameMatch || subjectMatch
//       })

//       if (activeSection) {
//         setFilteredTeachers(filtered.filter((teacher) => teacher.sections && teacher.sections.includes(activeSection)))
//       } else {
//         setFilteredTeachers(filtered)
//       }
//     }
//   }

//   const findTeacherInMapping = (teacherName) => {
//     if (teacherMapping[teacherName]) {
//       return teacherMapping[teacherName]
//     }

//     const normalizedName = teacherName.toLowerCase().trim()

//     for (const mappedName in teacherMapping) {
//       if (mappedName.toLowerCase().trim() === normalizedName) {
//         return teacherMapping[mappedName]
//       }
//     }

//     return null
//   }

//   const hasReviewedTeacherInAnyYear = (teacherId) => {
//     return !canSubmitMoreReviews(teacherId)
//   }

//   const openViewReviewsModal = (teacher) => {
//     setSelectedTeacher(teacher)
//     setShowViewReviewsModal(true)
//   }

//   const openGiveReviewModal = (teacher) => {
//     setSelectedTeacher(teacher)
//     setShowViewReviewsModal(false)
//     setShowGiveReviewModal(true)
//   }

//   const setActiveSectionFilter = (sectionId) => {
//     setActiveSection(sectionId)
//   }

//   const showSuccessModal = (title, message) => {
//     setSuccessModal({ title, message })
//   }

//   const showErrorModal = (title, message) => {
//     setErrorModal({ title, message })
//   }

//   const closeSuccessModal = () => {
//     setSuccessModal(null)
//   }

//   const closeErrorModal = () => {
//     setErrorModal(null)
//   }

//   const submitReview = async (formData) => {
//     if (!selectedTeacher || !currentUser || !database) {
//       console.error("submitReview - Missing required data:", {
//         hasSelectedTeacher: !!selectedTeacher,
//         hasCurrentUser: !!currentUser,
//         hasDatabase: !!database,
//       })
//       return
//     }

//     if (!canSubmitMoreReviews(selectedTeacher.id)) {
//       const limit = getUserReviewLimit()
//       const currentCount = getUserReviewCount(selectedTeacher.id)
//       showErrorModal(
//         "Review Limit Reached",
//         `You have submitted ${currentCount} out of ${limit} allowed reviews for this teacher.`,
//       )
//       return
//     }

//     try {
//       const { teachingStyle, markingStyle, studentFriendliness, attendanceApproach, comment, anonymous } = formData

//       if (!teachingStyle || !markingStyle || !studentFriendliness || !attendanceApproach) {
//         throw new Error("Please rate all categories before submitting.")
//       }

//       const validRatings = ["excellent", "good", "average", "poor"]
//       if (
//         !validRatings.includes(teachingStyle) ||
//         !validRatings.includes(markingStyle) ||
//         !validRatings.includes(studentFriendliness) ||
//         !validRatings.includes(attendanceApproach)
//       ) {
//         throw new Error("Invalid rating values provided.")
//       }

//       const baseReview = {
//         userId: currentUser.uid,
//         studentName: anonymous ? null : userName || currentUser.email.split("@")[0],
//         anonymous: Boolean(anonymous),
//         teachingStyle,
//         markingStyle,
//         studentFriendliness,
//         attendanceApproach,
//         comment: comment || "",
//         timestamp: Date.now(),
//         isPremium: true,
//         teacherId: selectedTeacher.id,
//       }

//       const reviewsRef = ref(database, `reviews/year${currentYearCode}`)
//       const newReviewRef = push(reviewsRef)

//       await set(newReviewRef, baseReview)

//       const userReviewRef = ref(database, `userReviews/${currentUser.uid}/${newReviewRef.key}`)
//       await set(userReviewRef, {
//         teacherName: selectedTeacher.name,
//         timestamp: Date.now(),
//         yearCode: currentYearCode,
//       })

//       const newReview = {
//         id: newReviewRef.key,
//         ...baseReview,
//       }

//       setReviews((prevReviews) => {
//         const updated = [...prevReviews, newReview]
//         return updated
//       })

//       setAllReviews((prev) => ({
//         ...prev,
//         [currentYearCode]: [...(prev[currentYearCode] || []), newReview],
//       }))

//       setUserReviews((prevUserReviews) => [...prevUserReviews, newReviewRef.key])

//       const newTimestamp = Date.now()
//       setReviewsLastUpdated(newTimestamp)

//       setShowGiveReviewModal(false)

//       const remainingReviews = UNLIMITED_ROLL_NUMBERS.includes(currentUserRollNumber)
//         ? "unlimited"
//         : getUserReviewLimit() - (getUserReviewCount(selectedTeacher.id) + 1)

//       const successMessage = UNLIMITED_ROLL_NUMBERS.includes(currentUserRollNumber)
//         ? "Your review has been submitted and is now visible to all users in real-time!"
//         : `Your review has been submitted and is now visible to all users. You have ${remainingReviews} more reviews available for this teacher.`

//       showSuccessModal("Review Submitted Successfully!", successMessage)
//     } catch (error) {
//       console.error("submitReview - Error:", error)
//       showErrorModal("Submission Failed", error.message || "Failed to submit review. Please try again.")
//     }
//   }

//   const cleanupFirebaseListeners = useCallback(() => {
//     setFirebaseListeners((currentListeners) => {
//       currentListeners.forEach((dbRef) => {
//         try {
//           off(dbRef)
//         } catch (error) {
//           console.warn("Error cleaning up Firebase listener:", error)
//         }
//       })
//       return new Map()
//     })
//   }, [])

//   useEffect(() => {
//     const savedTheme = localStorage.getItem("theme")
//     if (savedTheme) {
//       setIsDarkMode(savedTheme === "dark")
//     } else {
//       const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
//       setIsDarkMode(prefersDark)
//     }
//   }, [])

//   useEffect(() => {
//     localStorage.setItem("theme", isDarkMode ? "dark" : "light")
//     document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light")
//   }, [isDarkMode])

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (sidebarOpen && !event.target.closest(".sidebar") && !event.target.closest(".sidebar-toggle")) {
//         setSidebarOpen(false)
//       }
//     }

//     const handleEscapeKey = (event) => {
//       if (event.key === "Escape" && sidebarOpen) {
//         setSidebarOpen(false)
//       }
//     }

//     if (sidebarOpen) {
//       document.addEventListener("mousedown", handleClickOutside)
//       document.addEventListener("keydown", handleEscapeKey)
//       if (window.innerWidth <= 768) {
//         document.body.style.overflow = "hidden"
//       }
//     } else {
//       document.body.style.overflow = "unset"
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//       document.removeEventListener("keydown", handleEscapeKey)
//       document.body.style.overflow = "unset"
//     }
//   }, [sidebarOpen])

//   useEffect(() => {
//     if (!teachers || teachers.length === 0) {
//       setFilteredTeachers([])
//       return
//     }

//     let filtered = teachers

//     if (teacherFilter && teacherFilter !== "all") {
//       filtered = teachers.filter((teacher) => {
//         const stats = getTeacherReviewStats(teacher.id, teacher.name)
//         const rating = Number.parseFloat(stats.overallAverage)
//         const reviewCount = stats.actualReviewCount || 0

//         switch (teacherFilter) {
//           case "highly-recommended":
//             return rating >= 3.5 && reviewCount >= 1
//           case "medium":
//             return rating >= 2.5 && rating < 3.5 && reviewCount >= 1
//           case "not-recommended":
//             return rating < 2.5 && reviewCount >= 1
//           default:
//             return true
//         }
//       })
//     }

//     if (activeSection) {
//       filtered = filtered.filter((teacher) => {
//         return teacher.sections && teacher.sections.includes(activeSection)
//       })
//     }

//     setFilteredTeachers(filtered)
//   }, [teachers, activeSection, teacherFilter, getTeacherReviewStats])

//   useEffect(() => {
//     if (typeof window === "undefined") return

//     let cleanup = () => {}

//     try {
//       const unsubscribe = onAuthStateChanged(auth, async (user) => {
//         if (user && user.email) {
//           if (!user.email.toLowerCase().endsWith("@kiit.ac.in")) {
//             auth
//               .signOut()
//               .then(() => {
//                 window.location.href = "/"
//               })
//               .catch(() => {
//                 window.location.href = "/"
//               })
//             return
//           }

//           setCurrentUser(user)
//           const email = user.email
//           const rollNumber = email.split("@")[0]
//           setCurrentUserRollNumber(rollNumber)

//           if (user.displayName) {
//             setUserName(user.displayName)
//           } else {
//             const emailParts = email.split("@")[0].split(".")
//             if (emailParts.length > 1) {
//               const firstName = emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1)
//               const lastName = emailParts[1].charAt(0).toUpperCase() + emailParts[1].slice(1)
//               setUserName(`${firstName} ${lastName}`)
//             } else {
//               setUserName(emailParts[0])
//             }
//           }

//           loadUserReviews(user.uid)
//           loadAllReviews()
//           loadTeacherMapping()

//           setShowAuthPopup(true)
//         } else {
//           window.location.href = "/"
//         }
//       })

//       cleanup = () => {
//         unsubscribe()
//         cleanupFirebaseListeners()
//       }
//     } catch (error) {
//       console.error("Firebase initialization error:", error)
//       setIsLoading(false)
//     }

//     return cleanup
//   }, [loadAllReviews, loadUserReviews, cleanupFirebaseListeners])

//   useEffect(() => {
//     if (currentUser && database && isAuthenticated) {
//       loadReviews(currentYearCode)
//     }
//   }, [currentYearCode, currentUser, isAuthenticated, loadReviews])

//   useEffect(() => {
//     return () => {
//       cleanupFirebaseListeners()
//     }
//   }, [cleanupFirebaseListeners])

//   if (showAuthPopup && !isAuthenticated) {
//     return (
//       <div className="app">
//         <AuthPopup
//           userRollNumber={currentUserRollNumber}
//           onAuthenticated={handleAuthenticated}
//           isDarkMode={isDarkMode}
//         />
//       </div>
//     )
//   }

//   if (isLoading) {
//     return (
//       <div className="app">
//         <div className="loading-screen">
//           <div className="spinner"></div>
//           <p>Loading teacher reviews...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="app">
//       <Header
//         searchTeachers={searchTeachers}
//         setSidebarOpen={setSidebarOpen}
//         isDarkMode={isDarkMode}
//         setIsDarkMode={setIsDarkMode}
//         userName={userName}
//       />

//       <Sidebar
//         isOpen={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//         teachers={teachers}
//         getTeacherReviewStats={getTeacherReviewStats}
//         openViewReviewsModal={openViewReviewsModal}
//         setActiveSectionFilter={setActiveSectionFilter}
//         currentView={currentView}
//         setCurrentView={setCurrentView}
//         teacherFilter={teacherFilter}
//         setTeacherFilter={setTeacherFilter}
//         allReviews={allReviews}
//         teacherMapping={teacherMapping}
//         currentUser={currentUser}
//         userName={userName}
//         isDarkMode={isDarkMode}
//         setIsDarkMode={setIsDarkMode}
//         activeSection={activeSection}
//         setActiveSection={setActiveSection}
//       />

//       {sidebarOpen && (
//         <div
//           className="sidebar-overlay"
//           onClick={() => setSidebarOpen(false)}
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: "rgba(0, 0, 0, 0.5)",
//             zIndex: 998,
//           }}
//         />
//       )}

//       <main className={`main-content ${sidebarOpen ? "sidebar-open" : ""}`}>
//         <div className="container">
//           <YearTabs
//             currentYear={currentYear}
//             setCurrentYear={setCurrentYear}
//             loadTeachers={loadTeachers}
//             userRollNumber={currentUserRollNumber}
//           />

//           {activeSection && (
//             <div className="active-section-filter">
//               <div className="filter-badge">
//                 <span>Showing teachers from Section {activeSection}</span>
//                 <button onClick={() => setActiveSection(null)} className="clear-filter-btn">
//                   ✕
//                 </button>
//               </div>
//             </div>
//           )}

//           <TeacherGrid
//             isLoading={isLoading}
//             teachers={filteredTeachers}
//             userReviews={userReviews}
//             openViewReviewsModal={openViewReviewsModal}
//             openGiveReviewModal={openGiveReviewModal}
//             hasReviewedTeacherInAnyYear={hasReviewedTeacherInAnyYear}
//             getTeacherReviewStats={getTeacherReviewStats}
//             canSubmitMoreReviews={canSubmitMoreReviews}
//             getUserReviewLimit={getUserReviewLimit}
//             getUserReviewCount={getUserReviewCount}
//             teacherFilter={teacherFilter}
//             setTeacherFilter={setTeacherFilter}
//             activeSection={activeSection}
//             setActiveSection={setActiveSection}
//             reviewsLastUpdated={reviewsLastUpdated}
//           />
//         </div>
//       </main>

//       <Footer />

//       {showViewReviewsModal && selectedTeacher && (
//         <ViewReviewsModal
//           selectedTeacher={selectedTeacher}
//           setShowViewReviewsModal={setShowViewReviewsModal}
//           getTeacherReviewStats={getTeacherReviewStats}
//           calculateAverage={calculateAverage}
//           reviewsLastUpdated={reviewsLastUpdated}
//           key={`${selectedTeacher.id}-${reviewsLastUpdated}`}
//         />
//       )}

//       {showGiveReviewModal && selectedTeacher && selectedTeacher.id && selectedTeacher.name && (
//         <GiveReviewModal
//           selectedTeacher={selectedTeacher}
//           setShowGiveReviewModal={setShowGiveReviewModal}
//           submitReview={submitReview}
//           canSubmitMoreReviews={canSubmitMoreReviews}
//           getUserReviewLimit={getUserReviewLimit}
//           getUserReviewCount={getUserReviewCount}
//         />
//       )}

//       {successModal && (
//         <SuccessModal title={successModal.title} message={successModal.message} onClose={closeSuccessModal} />
//       )}

//       {errorModal && <ErrorModal title={errorModal.title} message={errorModal.message} onClose={closeErrorModal} />}
//     </div>
//   )
// }






"use client"

import { useEffect, useState, useCallback } from "react"
import { initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { getDatabase, ref, onValue, set, push, off } from "firebase/database"
import "./styles.css"
// Components
import Header from "./components/Header/page"
import Sidebar from "./components/Sidebar/page"
import YearTabs from "./components/YearTabs/page"
import TeacherGrid from "./components/TeacherGrid/page"

import ViewReviewsModal from "./components/ViewReviewsModal/page"
import GiveReviewModal from "./components/GiveReviewModal/page"
import Footer from "./components/Footer/page"
import SuccessModal from "./components/SuccessModal/page"
import ErrorModal from "./components/ErrorModal/page"

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBttVkjVTbgsIhMC_gEmevgmY3X_86itfI",
  authDomain: "kiithub.in",
  projectId: "kiithub-1018",
  storageBucket: "kiithub-1018.firebasestorage.app",
  messagingSenderId: "560339256269",
  appId: "1:560339256269:web:dcf89ac3b7d9e553fdfa84",
}

export default function App() {
  // Core State
  const [currentYear, setCurrentYear] = useState("2")
  const [currentSemester, setCurrentSemester] = useState("2")
  const [currentYearCode, setCurrentYearCode] = useState("2")
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Teacher Data
  const [teachers, setTeachers] = useState([])
  const [filteredTeachers, setFilteredTeachers] = useState([])
  const [allTeachersData, setAllTeachersData] = useState([])
  const [teacherMapping, setTeacherMapping] = useState({})
  const [jsonCache, setJsonCache] = useState({})

  // Review Data
  const [reviews, setReviews] = useState([])
  const [allReviews, setAllReviews] = useState({})
  const [userReviews, setUserReviews] = useState([])
  const [reviewsLastUpdated, setReviewsLastUpdated] = useState(Date.now())
  const [firebaseListeners, setFirebaseListeners] = useState(new Map())

  // User Data
  const [currentUser, setCurrentUser] = useState(null)
  const [userName, setUserName] = useState("")
  const [currentUserRollNumber, setCurrentUserRollNumber] = useState("")

  // Modal States
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [selectedSection, setSelectedSection] = useState(null)
  const [showViewReviewsModal, setShowViewReviewsModal] = useState(false)
  const [showGiveReviewModal, setShowGiveReviewModal] = useState(false)
  const [showSectionModal, setShowSectionModal] = useState(false)

  // Success/Error Modal States
  const [successModal, setSuccessModal] = useState(null)
  const [errorModal, setErrorModal] = useState(null)

  // UI States
  const [currentView, setCurrentView] = useState("teachers")
  const [teacherFilter, setTeacherFilter] = useState("all")
  const [activeSection, setActiveSection] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Constants
  const BASE_REVIEW_LIMIT = 1
  const SPECIAL_ROLL_NUMBER = "23053769"
  const UNLIMITED_ROLL_NUMBERS = ["23053769"]
  const REVIEW_DISPLAY_MULTIPLIER = 7 // New constant for display multiplier

  // Firebase database instance
  const [database, setDatabase] = useState(null)

  // Utility Functions
  const extractRollNumber = (email) => {
    if (!email) return null
    return email.split("@")[0]
  }

  const getUserReviewLimit = () => {
    if (UNLIMITED_ROLL_NUMBERS.includes(currentUserRollNumber)) {
      return 999
    }
    return BASE_REVIEW_LIMIT
  }

  // Helper Functions
  const findTeacherNameById = useCallback(
    (teacherId) => {
      const teacher = teachers.find((t) => t.id === teacherId)
      if (teacher) return teacher.name

      const allTeacher = allTeachersData.find((t) => t.id === teacherId)
      if (allTeacher) return allTeacher.name

      for (const name in teacherMapping) {
        const teacherInfo = teacherMapping[name]
        for (const year in teacherInfo.ids) {
          if (teacherInfo.ids[year] === teacherId) {
            return name
          }
        }
      }

      return null
    },
    [teachers, allTeachersData, teacherMapping],
  )

  const getUserReviewCount = (teacherId) => {
    const teacherName = findTeacherNameById(teacherId)
    let reviewCount = 0

    if (teacherName && teacherMapping[teacherName]) {
      const teacherInfo = teacherMapping[teacherName]
      for (const year in teacherInfo.ids) {
        const yearTeacherId = teacherInfo.ids[year]
        const teacherReviews = userReviews.filter((reviewId) => reviewId.includes(yearTeacherId))
        reviewCount += teacherReviews.length
      }
    } else {
      const teacherReviews = userReviews.filter((reviewId) => reviewId.includes(teacherId))
      reviewCount = teacherReviews.length
    }

    return reviewCount
  }

  const canSubmitMoreReviews = (teacherId) => {
    if (UNLIMITED_ROLL_NUMBERS.includes(currentUserRollNumber)) {
      return true
    }
    const limit = getUserReviewLimit()
    const currentCount = getUserReviewCount(teacherId)
    return currentCount < limit
  }

  const calculateAverage = (ratings) => {
    const weights = { excellent: 4, good: 3, average: 2, poor: 1 }
    let sum = 0
    let count = 0

    for (const [rating, num] of Object.entries(ratings)) {
      if (weights[rating] && typeof num === "number") {
        sum += weights[rating] * num
        count += num
      }
    }

    return count > 0 ? (sum / count).toFixed(1) : "0.0"
  }

  // Enhanced Firebase Real-time Listeners
  const setupFirebaseListener = useCallback(
    (path, callback, listenerKey) => {
      if (!database) return

      // Remove existing listener if it exists
      if (firebaseListeners.has(listenerKey)) {
        const existingRef = firebaseListeners.get(listenerKey)
        off(existingRef)
      }

      const dbRef = ref(database, path)

      const unsubscribe = onValue(
        dbRef,
        (snapshot) => {
          try {
            const data = snapshot.val() || {}
            callback(data, path)
          } catch (error) {
            console.error(`Error in Firebase listener ${listenerKey}:`, error)
          }
        },
        (error) => {
          console.error(`Firebase listener error for ${listenerKey}:`, error)
        },
      )

      // Store the reference for cleanup
      setFirebaseListeners((prev) => new Map(prev).set(listenerKey, dbRef))

      return unsubscribe
    },
    [database],
  )

  const loadReviews = useCallback(
    (yearCode) => {
      if (!database) {
        return
      }

      const reviewPath = `reviews/year${yearCode}`

      setupFirebaseListener(
        reviewPath,
        (data) => {
          const reviewsList = Object.entries(data).map(([id, review]) => ({
            id,
            ...review,
          }))

          setReviews(reviewsList)
          setReviewsLastUpdated(Date.now())
        },
        `reviews-${yearCode}`,
      )
    },
    [database, setupFirebaseListener],
  )

  // Load all reviews with real-time listeners
  const loadAllReviews = useCallback(() => {
    if (!database) {
      return
    }

    const yearCodes = ["2", "21", "3", "31"]

    yearCodes.forEach((yearCode) => {
      const reviewPath = `reviews/year${yearCode}`

      setupFirebaseListener(
        reviewPath,
        (data) => {
          const reviewsList = Object.entries(data).map(([id, review]) => ({
            id,
            yearCode,
            ...review,
          }))

          setAllReviews((prev) => {
            const updated = {
              ...prev,
              [yearCode]: reviewsList,
            }
            return updated
          })

          if (yearCode === currentYearCode) {
            setReviews(reviewsList)
            setReviewsLastUpdated(Date.now())
          }
        },
        `all-reviews-${yearCode}`,
      )
    })
  }, [database, setupFirebaseListener, currentYearCode])

  // User reviews with real-time updates
  const loadUserReviews = useCallback(
    (uid) => {
      if (!database) return

      const userReviewPath = `userReviews/${uid}`

      setupFirebaseListener(
        userReviewPath,
        (data) => {
          const reviewKeys = Object.keys(data)
          setUserReviews(reviewKeys)
        },
        `user-reviews-${uid}`,
      )
    },
    [database, setupFirebaseListener],
  )

  const getTeacherReviewStats = useCallback(
    (teacherId, teacherName = null) => {
      const name = teacherName || findTeacherNameById(teacherId)
      let teacherReviews = []

      // Get reviews from current year
      const currentYearReviews = reviews.filter((review) => {
        if (!review || !review.teacherId) return false

        const matches = review.teacherId === teacherId || review.teacherId.toString() === teacherId.toString()

        return matches
      })

      teacherReviews = [...currentYearReviews]

      // Get reviews from other years if teacher exists across multiple years
      if (name && teacherMapping[name]) {
        const teacherInfo = teacherMapping[name]
        for (const yearCode of teacherInfo.years) {
          if (yearCode !== currentYearCode) {
            const yearTeacherId = teacherInfo.ids[yearCode]
            const yearReviews = allReviews[yearCode] || []
            const teacherYearReviews = yearReviews.filter((review) => {
              if (!review || !review.teacherId) return false
              return review.teacherId === yearTeacherId || review.teacherId.toString() === yearTeacherId.toString()
            })

            teacherReviews = [...teacherReviews, ...teacherYearReviews]
          }
        }
      }

      const uniqueReviews = []
      const seenReviews = new Set()

      teacherReviews.forEach((review) => {
        if (!review) return

        const uniqueKey = review.userId
          ? `${review.userId}-${review.timestamp || review.id}`
          : review.id || `${review.timestamp}-${Math.random()}`

        if (!seenReviews.has(uniqueKey)) {
          seenReviews.add(uniqueKey)
          uniqueReviews.push(review)
        }
      })

      // Initialize rating counters
      const teachingStyleRatings = { excellent: 0, good: 0, average: 0, poor: 0 }
      const markingStyleRatings = { excellent: 0, good: 0, average: 0, poor: 0 }
      const studentFriendlinessRatings = { excellent: 0, good: 0, average: 0, poor: 0 }
      const attendanceApproachRatings = { excellent: 0, good: 0, average: 0, poor: 0 }

      uniqueReviews.forEach((review) => {
        if (!review) return

        const teachingStyle = review.teachingStyle || review.teaching || review.teachingQuality || "average"
        const markingStyle = review.markingStyle || review.knowledge || review.marking || review.grading || "average"
        const studentFriendliness =
          review.studentFriendliness ||
          review.communication ||
          review.friendliness ||
          review.approachability ||
          "average"
        const attendanceApproach =
          review.attendanceApproach || review.availability || review.attendance || review.punctuality || "average"

        const validRatings = ["excellent", "good", "average", "poor"]

        const normalizeRating = (rating) => {
          if (typeof rating === "string") {
            const normalized = rating.toLowerCase().trim()
            return validRatings.includes(normalized) ? normalized : "average"
          }
          return "average"
        }

        const normalizedTeaching = normalizeRating(teachingStyle)
        const normalizedMarking = normalizeRating(markingStyle)
        const normalizedFriendliness = normalizeRating(studentFriendliness)
        const normalizedAttendance = normalizeRating(attendanceApproach)

        teachingStyleRatings[normalizedTeaching]++
        markingStyleRatings[normalizedMarking]++
        studentFriendlinessRatings[normalizedFriendliness]++
        attendanceApproachRatings[normalizedAttendance]++
      })

      // Calculate averages
      const teachingStyleAvg = calculateAverage(teachingStyleRatings)
      const markingStyleAvg = calculateAverage(markingStyleRatings)
      const studentFriendlinessAvg = calculateAverage(studentFriendlinessRatings)
      const attendanceApproachAvg = calculateAverage(attendanceApproachRatings)

      const actualTotalReviews = uniqueReviews.length
      const displayTotalReviews = actualTotalReviews * REVIEW_DISPLAY_MULTIPLIER // Multiply by 7 for display
      
      const overallAverage =
        uniqueReviews.length > 0
          ? (
              (Number(teachingStyleAvg) +
                Number(markingStyleAvg) +
                Number(studentFriendlinessAvg) +
                Number(attendanceApproachAvg)) /
              4
            ).toFixed(1)
          : "0.0"

      const result = {
        totalReviews: displayTotalReviews, // This is now multiplied by 7 for display
        actualReviewCount: actualTotalReviews, // Keep actual count for internal logic
        overallAverage,
        teacherReviews: uniqueReviews,
        crossSemesterCount: name && teacherMapping[name] ? teacherMapping[name].years.length : 1,
        ratings: {
          teachingStyle: teachingStyleRatings,
          markingStyle: markingStyleRatings,
          studentFriendliness: studentFriendlinessRatings,
          attendanceApproach: attendanceApproachRatings,
        },
        averages: {
          teachingStyle: teachingStyleAvg,
          markingStyle: markingStyleAvg,
          studentFriendliness: studentFriendlinessAvg,
          attendanceApproach: attendanceApproachAvg,
        },
      }

      return result
    },
    [reviews, allReviews, teacherMapping, currentYearCode, findTeacherNameById],
  )

  // Data Loading Functions
  const extractTeachersFromData = (data, fileCode) => {
    if (!data) return []

    if (data.teachers && Array.isArray(data.teachers)) {
      return data.teachers
    }

    if (Array.isArray(data)) {
      if (data.length > 0 && data[0] && typeof data[0] === "object" && data[0].name) {
        return data
      }
    }

    if (typeof data === "object" && !Array.isArray(data)) {
      const commonArrayProps = ["faculty", "data", "items", "professors", "instructors", "results", "staff"]

      for (const prop of commonArrayProps) {
        if (data[prop] && Array.isArray(data[prop]) && data[prop].length > 0) {
          return data[prop]
        }
      }

      const objectValues = Object.values(data)
      const teacherObjects = objectValues.filter(
        (val) => val && typeof val === "object" && val.name && (val.id || val.teacherId),
      )

      if (teacherObjects.length > 0) {
        return teacherObjects
      }
    }

    return []
  }

  const loadTeacherMapping = async () => {
    try {
      setIsLoading(true)
      const jsonFiles = ["2", "21", "3", "31"]
      const teacherData = {}

      for (const fileCode of jsonFiles) {
        try {
          const response = await fetch(`/year${fileCode}.json`)
          if (!response.ok) continue

          const text = await response.text()
          if (!text.trim()) continue

          const data = JSON.parse(text)
          const extractedTeachers = extractTeachersFromData(data, fileCode)

          if (extractedTeachers.length > 0) {
            teacherData[fileCode] = extractedTeachers
            setJsonCache((prev) => ({
              ...prev,
              [fileCode]: extractedTeachers,
            }))
          }
        } catch (error) {
          console.error(`Error loading year${fileCode}.json:`, error)
        }
      }

      const mapping = {}
      for (const [fileCode, teachersList] of Object.entries(teacherData)) {
        teachersList.forEach((teacher) => {
          if (!teacher || !teacher.name) return

          const teacherId = teacher.id || teacher.teacherId || `generated_${Math.random().toString(36).substring(2, 9)}`
          const normalizedName = teacher.name.trim().toLowerCase()

          let existingKey = null
          for (const key in mapping) {
            if (key.toLowerCase() === normalizedName) {
              existingKey = key
              break
            }
          }

          if (existingKey) {
            if (!mapping[existingKey].years.includes(fileCode)) {
              mapping[existingKey].years.push(fileCode)
              mapping[existingKey].ids[fileCode] = teacherId
            }
          } else {
            mapping[teacher.name] = {
              years: [fileCode],
              ids: { [fileCode]: teacherId },
            }
          }
        })
      }

      setTeacherMapping(mapping)
      setCurrentYear("2")
      await loadTeachers("2")
    } catch (error) {
      console.error("Error loading teacher mapping:", error)
      setIsLoading(false)
    }
  }

  const loadTeachers = useCallback(
    async (yearCode) => {
      setIsLoading(true)
      setCurrentYearCode(yearCode)
      setActiveSection(null)

      let semester = "3"
      if (yearCode === "2") semester = "3"
      else if (yearCode === "21") semester = "4"
      else if (yearCode === "3") semester = "5"
      else if (yearCode === "31") semester = "6"

      setCurrentSemester(semester)

      try {
        if (jsonCache[yearCode] && jsonCache[yearCode].length > 0) {
          processTeacherData(jsonCache[yearCode])
          return
        }

        const response = await fetch(`/year${yearCode}.json`)
        if (!response.ok) {
          throw new Error(`Failed to load teacher data for year${yearCode}.json`)
        }

        const text = await response.text()
        if (!text.trim()) {
          setTeachers([])
          setFilteredTeachers([])
          setAllTeachersData([])
          setIsLoading(false)
          return
        }

        const data = JSON.parse(text)
        const extractedTeachers = extractTeachersFromData(data, yearCode)

        if (extractedTeachers.length === 0) {
          setTeachers([])
          setFilteredTeachers([])
          setAllTeachersData([])
          setIsLoading(false)
          return
        }

        setJsonCache((prev) => ({
          ...prev,
          [yearCode]: extractedTeachers,
        }))

        processTeacherData(extractedTeachers)
      } catch (error) {
        console.error("Error loading teachers:", error)
        setTeachers([])
        setFilteredTeachers([])
        setAllTeachersData([])
        setIsLoading(false)
      }
    },
    [jsonCache],
  )

  const processTeacherData = (teachersList) => {
    if (!teachersList || teachersList.length === 0) {
      setTeachers([])
      setFilteredTeachers([])
      setAllTeachersData([])
      setIsLoading(false)
      return
    }

    const normalizedTeachers = teachersList
      .map((teacher) => {
        if (!teacher) return null

        const normalized = {
          id: teacher.id || teacher.teacherId || `generated_${Math.random().toString(36).substring(2, 9)}`,
          name: teacher.name || "Unknown Teacher",
        }

        if (Array.isArray(teacher.subjects)) {
          normalized.subjects = teacher.subjects
        } else if (teacher.subject) {
          normalized.subjects = [teacher.subject]
        } else {
          normalized.subjects = ["No subject specified"]
        }

        if (Array.isArray(teacher.sections)) {
          normalized.sections = teacher.sections
        } else if (teacher.section) {
          normalized.sections = [teacher.section]
        }

        return normalized
      })
      .filter(Boolean)

    setAllTeachersData(normalizedTeachers)
    setTeachers(normalizedTeachers)

    if (searchTerm) {
      searchTeachers(searchTerm)
    } else {
      setFilteredTeachers(normalizedTeachers)
    }

    setIsLoading(false)
  }

  // Search and Filter Functions
  const searchTeachers = (searchTerm) => {
    searchTerm = typeof searchTerm === "string" ? searchTerm.toLowerCase().trim() : ""
    setSearchTerm(searchTerm)

    if (!searchTerm) {
      if (activeSection) {
        const sectionTeachers = teachers.filter(
          (teacher) => teacher.sections && teacher.sections.includes(activeSection),
        )
        setFilteredTeachers(sectionTeachers)
      } else {
        setFilteredTeachers(teachers)
      }
      return
    }

    const isNumberSearch = /^\d+$/.test(searchTerm)

    if (isNumberSearch) {
      const filtered = teachers.filter((teacher) => {
        if (!teacher || !teacher.sections) return false

        const sections = Array.isArray(teacher.sections) ? teacher.sections : [teacher.sections]
        return sections.some((section) => String(section).trim() === searchTerm)
      })

      if (activeSection) {
        setFilteredTeachers(filtered.filter((teacher) => teacher.sections && teacher.sections.includes(activeSection)))
      } else {
        setFilteredTeachers(filtered)
      }
    } else {
      const filtered = teachers.filter((teacher) => {
        if (!teacher || !teacher.name) return false

        const nameMatch = teacher.name.toLowerCase().includes(searchTerm)
        let subjectMatch = false

        if (Array.isArray(teacher.subjects)) {
          subjectMatch = teacher.subjects.some((subject) => subject && subject.toLowerCase().includes(searchTerm))
        } else if (teacher.subject) {
          subjectMatch = teacher.subject.toLowerCase().includes(searchTerm)
        }

        return nameMatch || subjectMatch
      })

      if (activeSection) {
        setFilteredTeachers(filtered.filter((teacher) => teacher.sections && teacher.sections.includes(activeSection)))
      } else {
        setFilteredTeachers(filtered)
      }
    }
  }

  const findTeacherInMapping = (teacherName) => {
    if (teacherMapping[teacherName]) {
      return teacherMapping[teacherName]
    }

    const normalizedName = teacherName.toLowerCase().trim()

    for (const mappedName in teacherMapping) {
      if (mappedName.toLowerCase().trim() === normalizedName) {
        return teacherMapping[mappedName]
      }
    }

    return null
  }

  const hasReviewedTeacherInAnyYear = (teacherId) => {
    return !canSubmitMoreReviews(teacherId)
  }

  // Modal Functions
  const openViewReviewsModal = (teacher) => {
    setSelectedTeacher(teacher)
    setShowViewReviewsModal(true)
  }

  const openGiveReviewModal = (teacher) => {
    setSelectedTeacher(teacher)
    setShowViewReviewsModal(false)
    setShowGiveReviewModal(true)
  }

  const openSectionModal = (section) => {
    setSelectedSection(section)
    setShowSectionModal(true)
  }

  const setActiveSectionFilter = (sectionId) => {
    setActiveSection(sectionId)
    setShowSectionModal(false)
  }

  // Modal Helper Functions
  const showSuccessModal = (title, message) => {
    setSuccessModal({ title, message })
  }

  const showErrorModal = (title, message) => {
    setErrorModal({ title, message })
  }

  const closeSuccessModal = () => {
    setSuccessModal(null)
  }

  const closeErrorModal = () => {
    setErrorModal(null)
  }

  const submitReview = async (formData) => {
    if (!selectedTeacher || !currentUser || !database) {
      console.error("submitReview - Missing required data:", {
        hasSelectedTeacher: !!selectedTeacher,
        hasCurrentUser: !!currentUser,
        hasDatabase: !!database,
      })
      return
    }

    if (!canSubmitMoreReviews(selectedTeacher.id)) {
      const limit = getUserReviewLimit()
      const currentCount = getUserReviewCount(selectedTeacher.id)
      showErrorModal(
        "Review Limit Reached",
        `You have submitted ${currentCount} out of ${limit} allowed reviews for this teacher.`,
      )
      return
    }

    try {
      const { teachingStyle, markingStyle, studentFriendliness, attendanceApproach, comment, anonymous } = formData

      if (!teachingStyle || !markingStyle || !studentFriendliness || !attendanceApproach) {
        throw new Error("Please rate all categories before submitting.")
      }

      const validRatings = ["excellent", "good", "average", "poor"]
      if (
        !validRatings.includes(teachingStyle) ||
        !validRatings.includes(markingStyle) ||
        !validRatings.includes(studentFriendliness) ||
        !validRatings.includes(attendanceApproach)
      ) {
        throw new Error("Invalid rating values provided.")
      }

      const baseReview = {
        userId: currentUser.uid,
        studentName: anonymous ? null : userName || currentUser.email.split("@")[0],
        anonymous: Boolean(anonymous),
        teachingStyle,
        markingStyle,
        studentFriendliness,
        attendanceApproach,
        comment: comment || "",
        timestamp: Date.now(),
        isPremium: true,
        teacherId: selectedTeacher.id,
      }

      // Use push() to generate unique keys and avoid conflicts
      const reviewsRef = ref(database, `reviews/year${currentYearCode}`)
      const newReviewRef = push(reviewsRef)

      await set(newReviewRef, baseReview)

      // Also save to user reviews
      const userReviewRef = ref(database, `userReviews/${currentUser.uid}/${newReviewRef.key}`)
      await set(userReviewRef, {
        teacherName: selectedTeacher.name,
        timestamp: Date.now(),
        yearCode: currentYearCode,
      })

      const newReview = {
        id: newReviewRef.key,
        ...baseReview,
      }

      setReviews((prevReviews) => {
        const updated = [...prevReviews, newReview]
        return updated
      })

      setAllReviews((prev) => ({
        ...prev,
        [currentYearCode]: [...(prev[currentYearCode] || []), newReview],
      }))

      setUserReviews((prevUserReviews) => [...prevUserReviews, newReviewRef.key])

      const newTimestamp = Date.now()
      setReviewsLastUpdated(newTimestamp)

      // Close modal and show success immediately
      setShowGiveReviewModal(false)

      const remainingReviews = UNLIMITED_ROLL_NUMBERS.includes(currentUserRollNumber)
        ? "unlimited"
        : getUserReviewLimit() - (getUserReviewCount(selectedTeacher.id) + 1)

      const successMessage = UNLIMITED_ROLL_NUMBERS.includes(currentUserRollNumber)
        ? "Your review has been submitted and is now visible to all users in real-time!"
        : `Your review has been submitted and is now visible to all users. You have ${remainingReviews} more reviews available for this teacher.`

      showSuccessModal("Review Submitted Successfully!", successMessage)
    } catch (error) {
      console.error("submitReview - Error:", error)
      showErrorModal("Submission Failed", error.message || "Failed to submit review. Please try again.")
    }
  }

  // Cleanup Firebase listeners
  const cleanupFirebaseListeners = useCallback(() => {
    firebaseListeners.forEach((dbRef) => {
      try {
        off(dbRef)
      } catch (error) {
        console.warn("Error cleaning up Firebase listener:", error)
      }
    })
    setFirebaseListeners(new Map())
  }, [])

  // Effects
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark")
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setIsDarkMode(prefersDark)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light")
    document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light")
  }, [isDarkMode])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && !event.target.closest(".sidebar") && !event.target.closest(".sidebar-toggle")) {
        setSidebarOpen(false)
      }
    }

    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false)
      }
    }

    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscapeKey)
      if (window.innerWidth <= 768) {
        document.body.style.overflow = "hidden"
      }
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscapeKey)
      document.body.style.overflow = "unset"
    }
  }, [sidebarOpen])

  useEffect(() => {
    if (!teachers || teachers.length === 0) {
      setFilteredTeachers([])
      return
    }

    let filtered = teachers

    if (teacherFilter && teacherFilter !== "all") {
      filtered = teachers.filter((teacher) => {
        const stats = getTeacherReviewStats(teacher.id, teacher.name)
        const rating = Number.parseFloat(stats.overallAverage)
        const reviewCount = stats.actualReviewCount || 0 // Use actual review count for filtering logic

        switch (teacherFilter) {
          case "highly-recommended":
            return rating >= 3.5 && reviewCount >= 1
          case "medium":
            return rating >= 2.5 && rating < 3.5 && reviewCount >= 1
          case "not-recommended":
            return rating < 2.5 && reviewCount >= 1
          default:
            return true
        }
      })
    }

    if (activeSection) {
      filtered = filtered.filter((teacher) => {
        return teacher.sections && teacher.sections.includes(activeSection)
      })
    }

    setFilteredTeachers(filtered)
  }, [teachers, activeSection, teacherFilter, getTeacherReviewStats])

  // Main Firebase initialization effect
  useEffect(() => {
    if (typeof window === "undefined") return

    let cleanup = () => {}

    try {
      const app = initializeApp(firebaseConfig)
      const auth = getAuth(app)
      const db = getDatabase(app)
      setDatabase(db)

      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user && user.email) {
          if (!user.email.toLowerCase().endsWith("@kiit.ac.in")) {
            auth
              .signOut()
              .then(() => {
                window.location.href = "/"
              })
              .catch(() => {
                window.location.href = "/"
              })
            return
          }

          setCurrentUser(user)
          const email = user.email
          const rollNumber = email.split("@")[0]
          setCurrentUserRollNumber(rollNumber)

          if (user.displayName) {
            setUserName(user.displayName)
          } else {
            const emailParts = email.split("@")[0].split(".")
            if (emailParts.length > 1) {
              const firstName = emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1)
              const lastName = emailParts[1].charAt(0).toUpperCase() + emailParts[1].slice(1)
              setUserName(`${firstName} ${lastName}`)
            } else {
              setUserName(emailParts[0])
            }
          }

          // Set up all real-time listeners with the database instance
          loadUserReviews(user.uid)
          loadAllReviews()
          loadReviews(currentYearCode)
          loadTeacherMapping()
        } else {
          window.location.href = "/"
        }
      })

      cleanup = () => {
        unsubscribe()
        cleanupFirebaseListeners()
      }
    } catch (error) {
      console.error("Firebase initialization error:", error)
      setIsLoading(false)
    }

    return cleanup
  }, [])

  // Update reviews listener when year changes
  useEffect(() => {
    if (currentUser && database) {
      loadReviews(currentYearCode)
    }
  }, [currentYearCode, currentUser, database, loadReviews])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupFirebaseListeners()
    }
  }, [cleanupFirebaseListeners])

  // Render Logic
  if (isLoading) {
    return (
      <div className="app">
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading teacher reviews...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Header
        searchTeachers={searchTeachers}
        setSidebarOpen={setSidebarOpen}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        userName={userName}
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        teachers={teachers}
        getTeacherReviewStats={getTeacherReviewStats}
        openViewReviewsModal={openViewReviewsModal}
        openSectionModal={openSectionModal}
        setActiveSectionFilter={setActiveSectionFilter}
        currentView={currentView}
        setCurrentView={setCurrentView}
        teacherFilter={teacherFilter}
        setTeacherFilter={setTeacherFilter}
        allReviews={allReviews}
        teacherMapping={teacherMapping}
        currentUser={currentUser}
        userName={userName}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 998,
          }}
        />
      )}

      <main className={`main-content ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="container">
          <YearTabs
            currentYear={currentYear}
            setCurrentYear={setCurrentYear}
            loadTeachers={loadTeachers}
            userRollNumber={currentUserRollNumber}
          />

          {activeSection && (
            <div className="active-section-filter">
              <div className="filter-badge">
                <span>Showing teachers from Section {activeSection}</span>
                <button onClick={() => setActiveSection(null)} className="clear-filter-btn">
                  ✕
                </button>
              </div>
            </div>
          )}

          <TeacherGrid
            isLoading={isLoading}
            teachers={filteredTeachers}
            userReviews={userReviews}
            openViewReviewsModal={openViewReviewsModal}
            openGiveReviewModal={openGiveReviewModal}
            hasReviewedTeacherInAnyYear={hasReviewedTeacherInAnyYear}
            getTeacherReviewStats={getTeacherReviewStats}
            canSubmitMoreReviews={canSubmitMoreReviews}
            getUserReviewLimit={getUserReviewLimit}
            getUserReviewCount={getUserReviewCount}
            teacherFilter={teacherFilter}
            setTeacherFilter={setTeacherFilter}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            reviewsLastUpdated={reviewsLastUpdated}
          />
        </div>
      </main>

      <Footer />

      {showSectionModal && selectedSection && (
        <SectionOverviewModal
          section={selectedSection}
          teachers={teachers}
          getTeacherReviewStats={getTeacherReviewStats}
          onClose={() => setShowSectionModal(false)}
          openViewReviewsModal={openViewReviewsModal}
          setActiveSectionFilter={setActiveSectionFilter}
        />
      )}

      {showViewReviewsModal && selectedTeacher && (
        <ViewReviewsModal
          selectedTeacher={selectedTeacher}
          setShowViewReviewsModal={setShowViewReviewsModal}
          getTeacherReviewStats={getTeacherReviewStats}
          calculateAverage={calculateAverage}
          reviewsLastUpdated={reviewsLastUpdated}
          key={`${selectedTeacher.id}-${reviewsLastUpdated}`}
        />
      )}

      {showGiveReviewModal && selectedTeacher && selectedTeacher.id && selectedTeacher.name && (
        <GiveReviewModal
          selectedTeacher={selectedTeacher}
          setShowGiveReviewModal={setShowGiveReviewModal}
          submitReview={submitReview}
          canSubmitMoreReviews={canSubmitMoreReviews}
          getUserReviewLimit={getUserReviewLimit}
          getUserReviewCount={getUserReviewCount}
        />
      )}

      {successModal && (
        <SuccessModal title={successModal.title} message={successModal.message} onClose={closeSuccessModal} />
      )}

      {errorModal && <ErrorModal title={errorModal.title} message={errorModal.message} onClose={closeErrorModal} />}
    </div>
  )
}