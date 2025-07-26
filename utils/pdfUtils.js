// Utility functions for PDF handling

export const validateFirebaseURL = (url) => {
  if (!url || typeof url !== "string") {
    return { valid: false, error: "No URL provided" }
  }

  if (!url.startsWith("https://firebasestorage.googleapis.com")) {
    return { valid: false, error: "Invalid Firebase Storage URL" }
  }

  try {
    new URL(url)
    return { valid: true }
  } catch (error) {
    return { valid: false, error: "Malformed URL" }
  }
}

export const createSecureURL = (firebaseURL) => {
  try {
    const url = new URL(firebaseURL)
    url.searchParams.set("alt", "media")
    return url.toString()
  } catch (error) {
    console.error("Error creating secure URL:", error)
    return firebaseURL
  }
}

export const getViewerMethods = () => [
  {
    name: "iframe",
    description: "Standard iframe method",
    createURL: (url) => `${url}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH`,
  },
  {
    name: "embed",
    description: "HTML5 embed element",
    createURL: (url) => url,
  },
  {
    name: "google",
    description: "Google Docs viewer",
    createURL: (url) => `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`,
  },
]
