
"use client"

import React, { useEffect, useState, useCallback } from "react"
import { initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { getDatabase, ref, onValue, set } from "firebase/database"
import { getFirestore, doc, getDoc } from "firebase/firestore"

// Components
import Header from "./components/Header/page"
import Sidebar from "./components/Sidebar/page"
import YearTabs from "./components/YearTabs/page"
import TeacherGrid from "./components/TeacherGrid/page"
import AllSectionsSection from "./components/AllSectionsSection/page"
import SectionOverviewModal from "./components/SectionOverviewModal/page"
import ViewReviewsModal from "./components/ViewReviewsModal/page"
import GiveReviewModal from "./components/GiveReviewModal/page"
import Footer from "./components/Footer/page"
import BlockedUserModal from "./components/BlockedUserModal/page"
import AIChat from "./components/AIChat/page"
import PremiumAccessModal from "./components/PremiumAccessModal/page"
import PaymentModal from "./components/PaymentModal/page"
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

export default function FacultyReviewPage() {
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

  // User Data
  const [currentUser, setCurrentUser] = useState(null)
  const [userName, setUserName] = useState("")
  const [currentUserRollNumber, setCurrentUserRollNumber] = useState("")
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false)
  const [premiumLoading, setPremiumLoading] = useState(true)

  // Modal States
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [selectedSection, setSelectedSection] = useState(null)
  const [showViewReviewsModal, setShowViewReviewsModal] = useState(false)
  const [showGiveReviewModal, setShowGiveReviewModal] = useState(false)
  const [showSectionModal, setShowSectionModal] = useState(false)
  const [showPremiumRestriction, setShowPremiumRestriction] = useState(false)
  const [showBlockedUser, setShowBlockedUser] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  // Success/Error Modal States
  const [successModal, setSuccessModal] = useState(null)
  const [errorModal, setErrorModal] = useState(null)

  // UI States
  const [currentView, setCurrentView] = useState("teachers")
  const [teacherFilter, setTeacherFilter] = useState("all")
  const [showAllSections, setShowAllSections] = useState(false)
  const [activeSection, setActiveSection] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAIChat, setShowAIChat] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [countdown, setCountdown] = useState(10)

  // Constants
  const PREMIUM_REVIEW_MULTIPLIER = 10
  const BASE_REVIEW_LIMIT = 1
  const SPECIAL_ROLL_NUMBER = "23053769"
  const UNLIMITED_ROLL_NUMBERS = ["23053769"]

  // Payment Functions
  const handlePaymentSuccess = () => {
    setShowPaymentModal(false)
    setShowPremiumRestriction(false)
    setHasPremiumAccess(true)
    showSuccessModal(
      "Payment Successful!",
      "Welcome to KIITHub Premium! Your access has been activated."
    )
    // Refresh to update premium status
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  }

  const handlePaymentFailure = (error) => {
    showErrorModal("Payment Failed", error)
  }

  const openPaymentModal = () => {
    setShowPaymentModal(true)
    setShowPremiumRestriction(false)
  }

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

  // Premium Access Check
  const checkPremiumAccess = async (currentUser) => {
    try {
      setPremiumLoading(true)
      const email = currentUser.email
      const uid = currentUser.uid
      const rollNumber = extractRollNumber(email)

      if (!email) {
        throw new Error("User email not found")
      }

      if (UNLIMITED_ROLL_NUMBERS.includes(rollNumber)) {
        setHasPremiumAccess(true)
        return true
      }

      const firestore = getFirestore()
      const docRef = doc(firestore, "accesscontrol", "paiduser")
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        const hasEmailAccess = data[email] === true
        const hasUidAccess = data[uid] === true
        const hasRollAccess = rollNumber && data[rollNumber] === true

        if (hasEmailAccess || hasUidAccess || hasRollAccess) {
          setHasPremiumAccess(true)
          return true
        }
      }

      if (rollNumber.startsWith("23") || rollNumber.startsWith("25") || rollNumber.startsWith("22")) {
        setHasPremiumAccess(false)
        setShowBlockedUser(true)
        return false
      }

      if (rollNumber.startsWith("24")) {
        setHasPremiumAccess(false)
        setShowPremiumRestriction(true)
        return false
      }

      setHasPremiumAccess(true)
      return true

    } catch (error) {
      console.error("Error checking premium access:", error)
      setHasPremiumAccess(false)
      return false
    } finally {
      setPremiumLoading(false)
    }
  }

  // Teacher Review Stats
  const getTeacherReviewStats = useCallback(
    (teacherId, teacherName = null) => {
      const name = teacherName || findTeacherNameById(teacherId)
      let teacherReviews = []

      if (name) {
        const teacherInfo = findTeacherInMapping(name)
        if (teacherInfo && teacherInfo.years.length > 0) {
          for (const yearCode of teacherInfo.years) {
            const yearTeacherId = teacherInfo.ids[yearCode]
            const yearReviews = allReviews[yearCode] || []
            const teacherYearReviews = yearReviews.filter((review) => review.teacherId === yearTeacherId)
            teacherReviews = [...teacherReviews, ...teacherYearReviews]
          }
        }
      }

      if (teacherReviews.length === 0) {
        teacherReviews = reviews.filter((review) => review.teacherId === teacherId)
      }

      const uniqueReviews = Array.from(new Map(teacherReviews.map((review) => [review.userId, review])).values())

      const teachingStyleRatings = { excellent: 0, good: 0, average: 0, poor: 0 }
      const markingStyleRatings = { excellent: 0, good: 0, average: 0, poor: 0 }
      const studentFriendlinessRatings = { excellent: 0, good: 0, average: 0, poor: 0 }
      const attendanceApproachRatings = { excellent: 0, good: 0, average: 0, poor: 0 }

      uniqueReviews.forEach((review) => {
        if (!review) return

        const teachingStyle = review.teachingStyle || review.teaching || "average"
        const markingStyle = review.markingStyle || review.knowledge || "average"
        const studentFriendliness = review.studentFriendliness || review.communication || "average"
        const attendanceApproach = review.attendanceApproach || review.availability || "average"

        const validRatings = ["excellent", "good", "average", "poor"]

        if (validRatings.includes(teachingStyle)) {
          teachingStyleRatings[teachingStyle]++
        } else {
          teachingStyleRatings["average"]++
        }

        if (validRatings.includes(markingStyle)) {
          markingStyleRatings[markingStyle]++
        } else {
          markingStyleRatings["average"]++
        }

        if (validRatings.includes(studentFriendliness)) {
          studentFriendlinessRatings[studentFriendliness]++
        } else {
          studentFriendlinessRatings["average"]++
        }

        if (validRatings.includes(attendanceApproach)) {
          attendanceApproachRatings[attendanceApproach]++
        } else {
          attendanceApproachRatings["average"]++
        }
      })

      const teachingStyleAvg = calculateAverage(teachingStyleRatings)
      const markingStyleAvg = calculateAverage(markingStyleRatings)
      const studentFriendlinessAvg = calculateAverage(studentFriendlinessRatings)
      const attendanceApproachAvg = calculateAverage(attendanceApproachRatings)

      const multipliedTeachingStyleRatings = {}
      const multipliedMarkingStyleRatings = {}
      const multipliedStudentFriendlinessRatings = {}
      const multipliedAttendanceApproachRatings = {}

      Object.keys(teachingStyleRatings).forEach((key) => {
        multipliedTeachingStyleRatings[key] = teachingStyleRatings[key] * 7
        multipliedMarkingStyleRatings[key] = markingStyleRatings[key] * 7
        multipliedStudentFriendlinessRatings[key] = studentFriendlinessRatings[key] * 7
        multipliedAttendanceApproachRatings[key] = attendanceApproachRatings[key] * 7
      })

      const totalReviews = uniqueReviews.length * 7
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

      return {
        totalReviews,
        overallAverage,
        teacherReviews: uniqueReviews,
        crossSemesterCount: name && teacherMapping[name] ? teacherMapping[name].years.length : 1,
        ratings: {
          teachingStyle: multipliedTeachingStyleRatings,
          markingStyle: multipliedMarkingStyleRatings,
          studentFriendliness: multipliedStudentFriendlinessRatings,
          attendanceApproach: multipliedAttendanceApproachRatings,
        },
        averages: {
          teachingStyle: teachingStyleAvg,
          markingStyle: markingStyleAvg,
          studentFriendliness: studentFriendlinessAvg,
          attendanceApproach: attendanceApproachAvg,
        },
      }
    },
    [reviews, allReviews, teacherMapping],
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
          loadReviews(yearCode)
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
        loadReviews(yearCode)

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

  const loadReviews = (yearCode) => {
    const db = getDatabase()
    const reviewsRef = ref(db, `reviews/year${yearCode}`)

    onValue(reviewsRef, (snapshot) => {
      const data = snapshot.val() || {}
      const reviewsList = Object.entries(data).map(([id, review]) => ({
        id,
        ...review,
      }))
      setReviews(reviewsList)
    })
  }

  const loadAllReviews = (db) => {
    const yearCodes = ["2", "21", "3", "31"]
    const reviewsData = {}

    yearCodes.forEach((yearCode) => {
      const reviewsRef = ref(db, `reviews/year${yearCode}`)

      onValue(reviewsRef, (snapshot) => {
        const data = snapshot.val() || {}
        const reviewsList = Object.entries(data).map(([id, review]) => ({
          id,
          yearCode,
          ...review,
        }))

        reviewsData[yearCode] = reviewsList
        setAllReviews({ ...reviewsData })

        if (yearCode === currentYearCode) {
          setReviews(reviewsList)
        }
      })
    })
  }

  const loadUserReviews = (uid, db) => {
    const userReviewsRef = ref(db, `userReviews/${uid}`)

    onValue(userReviewsRef, (snapshot) => {
      const data = snapshot.val() || {}
      const reviewKeys = Object.keys(data)
      setUserReviews(reviewKeys)
    })
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

  // Helper Functions
  const findTeacherNameById = (teacherId) => {
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
    setShowAllSections(false)
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

  // Submit Review Function
  const submitReview = async (formData) => {
    if (!selectedTeacher || !currentUser) {
      console.error("Missing selectedTeacher or currentUser")
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

      const db = getDatabase()
      const reviewId = `${selectedTeacher.id}_${currentUser.uid}_${Date.now()}`

      const reviewsRef = ref(db, `reviews/year${currentYearCode}/${reviewId}`)
      await set(reviewsRef, baseReview)

      const userReviewRef = ref(db, `userReviews/${currentUser.uid}/${reviewId}`)
      await set(userReviewRef, {
        teacherName: selectedTeacher.name,
        timestamp: Date.now(),
        yearCode: currentYearCode,
      })

      setUserReviews((prev) => [...prev, reviewId])
      setReviews((prev) => [...prev, { id: reviewId, ...baseReview }])

      setShowGiveReviewModal(false)

      const remainingReviews = UNLIMITED_ROLL_NUMBERS.includes(currentUserRollNumber)
        ? "unlimited"
        : getUserReviewLimit() - (getUserReviewCount(selectedTeacher.id) + 1)

      const successMessage = UNLIMITED_ROLL_NUMBERS.includes(currentUserRollNumber)
        ? "Your review has been submitted and is now visible. You have unlimited reviews available!"
        : `Your review has been submitted and is now visible. You have ${remainingReviews} more reviews available for this teacher.`

      showSuccessModal("Review Submitted Successfully!", successMessage)

    } catch (error) {
      console.error("Error submitting review:", error)
      showErrorModal("Submission Failed", error.message || "Failed to submit review. Please try again.")
    }
  }

  const handleCountdownComplete = () => {
    window.location.href = "/"
  }

  const handleBlockedUserRedirect = () => {
    window.location.href = "/"
  }

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
        const reviewCount = stats.totalReviews

        switch (teacherFilter) {
          case "highly-recommended":
            return rating >= 3.5 && reviewCount >= 5
          case "medium":
            return rating >= 2.5 && rating < 3.5 && reviewCount >= 3
          case "not-recommended":
            return rating < 2.5 && reviewCount >= 2
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

  useEffect(() => {
    switch (currentView) {
      case "all-sections":
        setShowAllSections(true)
        setActiveSection(null)
        break
      case "teachers":
        setShowAllSections(false)
        setActiveSection(null)
        break
      case "best-sections":
        setShowAllSections(true)
        setActiveSection(null)
        break
      default:
        break
    }
  }, [currentView])

  useEffect(() => {
    let timer
    if (showPremiumRestriction && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
    } else if (showPremiumRestriction && countdown === 0) {
      handleCountdownComplete()
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [showPremiumRestriction, countdown])

  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const app = initializeApp(firebaseConfig)
      const auth = getAuth(app)
      const db = getDatabase(app)

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

          const hasAccess = await checkPremiumAccess(user)

          if (!hasAccess && !showBlockedUser) {
            setShowPremiumRestriction(true)
            return
          }

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

          if (hasAccess) {
            loadUserReviews(user.uid, db)
            loadTeacherMapping()
            loadAllReviews(db)
          }
        } else {
          window.location.href = "/"
        }
      })

      return () => {
        unsubscribe()
      }
    } catch (error) {
      console.error("Firebase initialization error:", error)
      setIsLoading(false)
    }
  }, [showBlockedUser])

  // Render Logic
  if (showBlockedUser) {
    return (
      <div className="app">
        <BlockedUserModal onRedirect={handleBlockedUserRedirect} userRollNumber={currentUserRollNumber} />
      </div>
    )
  }

  if (showPremiumRestriction) {
    return (
      <div className="app">
        <PremiumAccessModal
          countdown={countdown}
          onCountdownComplete={handleCountdownComplete}
          userRollNumber={currentUserRollNumber}
          userEmail={currentUser?.email || ''}
          onPaymentSuccess={handlePaymentSuccess}
          isDarkMode={isDarkMode}
        />
      </div>
    )
  }

  if (premiumLoading) {
    return (
      <div className="app">
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Checking access permissions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Header
        searchTeachers={searchTeachers}
        setSidebarOpen={setSidebarOpen}
        setShowAIChat={setShowAIChat}
        showAIChat={showAIChat}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        userName={userName}
        hasPremiumAccess={hasPremiumAccess}
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
        showAllSections={showAllSections}
        setShowAllSections={setShowAllSections}
        hasPremiumAccess={hasPremiumAccess}
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

          {showAllSections && teachers.length > 0 && (
            <AllSectionsSection
              teachers={teachers}
              getTeacherReviewStats={getTeacherReviewStats}
              openViewReviewsModal={openViewReviewsModal}
              openSectionModal={openSectionModal}
              onClose={() => setShowAllSections(false)}
            />
          )}

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
            hasPremiumAccess={hasPremiumAccess}
            canSubmitMoreReviews={canSubmitMoreReviews}
            getUserReviewLimit={getUserReviewLimit}
            getUserReviewCount={getUserReviewCount}
            teacherFilter={teacherFilter}
            setTeacherFilter={setTeacherFilter}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        </div>
      </main>

      <Footer />

      {showAIChat && (
        <AIChat
          onClose={() => setShowAIChat(false)}
          isDarkMode={isDarkMode}
          teachers={teachers}
          allReviews={allReviews}
          getTeacherReviewStats={getTeacherReviewStats}
          teacherMapping={teacherMapping}
        />
      )}

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
        />
      )}

      {showGiveReviewModal && selectedTeacher && selectedTeacher.id && selectedTeacher.name && (
        <GiveReviewModal
          selectedTeacher={selectedTeacher}
          setShowGiveReviewModal={setShowGiveReviewModal}
          submitReview={submitReview}
          hasPremiumAccess={hasPremiumAccess}
          canSubmitMoreReviews={canSubmitMoreReviews}
          getUserReviewLimit={getUserReviewLimit}
          getUserReviewCount={getUserReviewCount}
        />
      )}

      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          userEmail={currentUser?.email || ''}
          userRollNumber={currentUserRollNumber}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailure={handlePaymentFailure}
          isDarkMode={isDarkMode}
        />
      )}

      {successModal && (
        <SuccessModal title={successModal.title} message={successModal.message} onClose={closeSuccessModal} />
      )}

      {errorModal && <ErrorModal title={errorModal.title} message={errorModal.message} onClose={closeErrorModal} />}
    </div>
  )
}