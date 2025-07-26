import { storage } from "./firebase"
import { ref, listAll, getDownloadURL } from "firebase/storage"

// Cache for storing loaded data
let cachedData = null
let cacheTimestamp = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Enhanced function to get download URL with CORS handling
export const getSecureDownloadURL = async (fileRef) => {
  try {
    const url = await getDownloadURL(fileRef)
    const urlObj = new URL(url)
    urlObj.searchParams.set("alt", "media")
    return urlObj.toString()
  } catch (error) {
    console.error("Error getting download URL:", error)
    throw error
  }
}

// SILENT loading - no popup, just background loading
export const loadSubjectsFromStorage = async () => {
  if (!storage) {
    console.error("Firebase Storage not configured")
    return { error: "Firebase Storage not configured" }
  }

  // Check cache first
  if (cachedData && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
    console.log("🚀 Using cached data")
    return { data: cachedData.data, totalFiles: cachedData.totalFiles }
  }

  try {
    console.log("🔍 Silent loading from Firebase Storage...")
    const data = {}
    let totalFilesFound = 0

    const rootRef = ref(storage, "")
    const rootResult = await listAll(rootRef)

    // Process only numbered folders (1-8) for speed
    const numberedFolders = rootResult.prefixes.filter((folder) => /^\d+$/.test(folder.name))

    for (let i = 0; i < numberedFolders.length; i++) {
      const folderRef = numberedFolders[i]
      const folderName = folderRef.name
      const semesterKey = `semester_${folderName}`

      if (!data[semesterKey]) {
        data[semesterKey] = {}
      }

      try {
        const folderResult = await listAll(folderRef)

        // Process subjects in parallel for speed
        const subjectPromises = folderResult.prefixes.map(async (subjectRef) => {
          const subjectName = subjectRef.name
          const subjectData = {}

          try {
            const subjectResult = await listAll(subjectRef)

            // Process document types in parallel
            const docTypePromises = subjectResult.prefixes.map(async (docTypeRef) => {
              const docTypeName = docTypeRef.name.toLowerCase()

              try {
                const docTypeResult = await listAll(docTypeRef)
                const pdfFiles = docTypeResult.items.filter((item) => item.name.toLowerCase().endsWith(".pdf"))

                if (pdfFiles.length > 0) {
                  const pdfData = {}

                  // Load ALL PDFs for better browsing experience
                  const pdfPromises = pdfFiles.map(async (pdfFile) => {
                    try {
                      const downloadURL = await getSecureDownloadURL(pdfFile)
                      const cleanFileName = cleanPDFName(pdfFile.name)
                      return { name: cleanFileName, url: downloadURL }
                    } catch (error) {
                      console.error(`Error loading PDF ${pdfFile.name}:`, error)
                      return null
                    }
                  })

                  const loadedPDFs = await Promise.all(pdfPromises)
                  loadedPDFs.forEach((pdf) => {
                    if (pdf) {
                      pdfData[pdf.name] = pdf.url
                      totalFilesFound++
                    }
                  })

                  return { docType: docTypeName, data: pdfData }
                }
              } catch (error) {
                console.error(`Error processing doc type ${docTypeName}:`, error)
              }
              return null
            })

            const docTypeResults = await Promise.all(docTypePromises)
            docTypeResults.forEach((result) => {
              if (result) {
                subjectData[result.docType] = result.data
              }
            })

            return { subject: subjectName, data: subjectData }
          } catch (error) {
            console.error(`Error processing subject ${subjectName}:`, error)
            return null
          }
        })

        const subjectResults = await Promise.all(subjectPromises)
        subjectResults.forEach((result) => {
          if (result && Object.keys(result.data).length > 0) {
            data[semesterKey][result.subject] = result.data
          }
        })
      } catch (error) {
        console.error(`Error processing folder ${folderName}:`, error)
      }
    }

    // Cache the results
    cachedData = { data, totalFiles: totalFilesFound }
    cacheTimestamp = Date.now()

    console.log(`🎉 Silent loaded ${totalFilesFound} files`)
    return { data, totalFiles: totalFilesFound }
  } catch (error) {
    console.error("❌ Error loading from Firebase Storage:", error)
    return { error: error.message, data: {} }
  }
}

// Helper function to clean PDF names
const cleanPDFName = (fileName) => {
  return fileName
    .replace(/\.pdf$/i, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

// STRICT category matching with new categories
const matchesCategory = (docName, categoryType) => {
  if (!categoryType) return true

  const docLower = docName.toLowerCase()
  const categoryLower = categoryType.toLowerCase()

  // STRICT matching for new categories
  switch (categoryLower) {
    case "midsem":
    case "mid":
      return docLower.includes("mid") && !docLower.includes("end")
    case "endsem":
    case "end":
      return docLower.includes("end") && !docLower.includes("mid")
    case "syllabus":
      return docLower.includes("syllabus")
    case "notes":
      return docLower.includes("notes") && !docLower.includes("question") && !docLower.includes("paper")
    case "questions":
    case "papers":
      return (
        (docLower.includes("question") || docLower.includes("paper")) &&
        !docLower.includes("solution") &&
        !docLower.includes("answer")
      )
    case "solutions":
      return docLower.includes("solution") || docLower.includes("answer") || docLower.includes("key")
    default:
      return true
  }
}

// Enhanced search with STRICT category filtering
export const searchInStorageData = (searchTerm, category, subjectsData) => {
  const results = []
  const searchWords = searchTerm.toLowerCase().split(" ")

  Object.entries(subjectsData).forEach(([semester, semesterData]) => {
    Object.entries(semesterData).forEach(([subject, subjectData]) => {
      Object.entries(subjectData).forEach(([docType, docTypeData]) => {
        // STRICT Category filtering - must match exactly
        if (category && !matchesCategory(docType, category)) {
          return // Skip if doesn't match category exactly
        }

        if (typeof docTypeData === "object" && docTypeData !== null) {
          Object.entries(docTypeData).forEach(([pdfName, url]) => {
            if (pdfName.startsWith("_")) return // Skip metadata

            const subjectMatch = searchWords.some((word) => subject.toLowerCase().includes(word))
            const docTypeMatch = searchWords.some((word) => docType.toLowerCase().includes(word))
            const pdfNameMatch = searchWords.some((word) => pdfName.toLowerCase().includes(word))

            if (subjectMatch || docTypeMatch || pdfNameMatch) {
              results.push({
                subject,
                docType,
                semester,
                url,
                fileName: pdfName,
                pdfName: pdfName,
              })
            }
          })
        }
      })
    })
  })

  return results.slice(0, 12) // Limit to 12 results for grid
}

// Get all PDFs for a specific category across all subjects and semesters
export const getAllPDFsByCategory = (category, subjectsData) => {
  const results = []

  Object.entries(subjectsData).forEach(([semester, semesterData]) => {
    Object.entries(semesterData).forEach(([subject, subjectData]) => {
      Object.entries(subjectData).forEach(([docType, docTypeData]) => {
        // STRICT Category filtering
        if (category && !matchesCategory(docType, category)) {
          return
        }

        if (typeof docTypeData === "object" && docTypeData !== null) {
          Object.entries(docTypeData).forEach(([pdfName, url]) => {
            if (pdfName.startsWith("_")) return // Skip metadata

            results.push({
              subject,
              docType,
              semester,
              url,
              fileName: pdfName,
              pdfName: pdfName,
            })
          })
        }
      })
    })
  })

  return results
}

// Clear cache function
export const clearCache = () => {
  cachedData = null
  cacheTimestamp = null
}
