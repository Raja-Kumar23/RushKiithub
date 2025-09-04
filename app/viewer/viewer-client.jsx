"use client"
import { useEffect, useState, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { auth } from "../../lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import "./viewer.css"

export default function ViewerClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [authCheckComplete, setAuthCheckComplete] = useState(false)
  const [hasRedirected, setHasRedirected] = useState(false)
  const authUnsubscribeRef = useRef(null)

  // Handle authentication check - Fixed to prevent unwanted redirects
  useEffect(() => {
    if (typeof window === "undefined" || !auth) return

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email && user.email.toLowerCase().endsWith("@kiit.ac.in")) {
        setIsAuthorized(true)
        setHasRedirected(false) // Reset redirect flag on successful auth
      } else {
        setIsAuthorized(false)
        // Only redirect if this is the initial auth check or if we haven't redirected yet
        if (!hasRedirected && authCheckComplete) {
          setHasRedirected(true)
          router.push("/")
        }
      }
      setAuthCheckComplete(true)
    })

    authUnsubscribeRef.current = unsubscribe
    return () => {
      if (authUnsubscribeRef.current) {
        authUnsubscribeRef.current()
      }
    }
  }, [router])

  // Handle URL and title once authorized
  useEffect(() => {
    if (!isAuthorized || !searchParams) return
    
    const fileUrl = searchParams.get("url")
    const fileTitle = searchParams.get("title")
    
    if (fileUrl) setUrl(decodeURIComponent(fileUrl))
    if (fileTitle) {
      const decodedTitle = decodeURIComponent(fileTitle)
      setTitle(decodedTitle)
      if (typeof document !== "undefined") {
        document.title = `${decodedTitle} | KIITHub`
      }
    }
  }, [isAuthorized, searchParams])

  // Security event listeners
  useEffect(() => {
    if (!isAuthorized || typeof window === "undefined") return

    const handleContextMenu = (e) => e.preventDefault()
    const handleKeyEvents = (e) => {
      const key = e.key.toLowerCase()
      if (key === "f12" || 
          (e.ctrlKey && e.shiftKey && (key === "i" || key === "j")) || 
          (e.ctrlKey && key === "u")) {
        e.preventDefault()
        showWarning()
      }
    }

    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("keydown", handleKeyEvents)

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("keydown", handleKeyEvents)
    }
  }, [isAuthorized])

  // Prevent back button navigation when viewing PDF
  useEffect(() => {
    if (!isAuthorized || !url) return

    const handlePopState = (e) => {
      // Prevent default back navigation
      e.preventDefault()
      
      // Push current state back to prevent navigation
      window.history.pushState(null, "", window.location.pathname + window.location.search)
    }

    // Add current state to history
    window.history.pushState(null, "", window.location.pathname + window.location.search)
    
    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [isAuthorized, url, router])

  const showWarning = () => {
    // Remove any existing warning
    const existingWarning = document.getElementById('security-warning')
    if (existingWarning) {
      existingWarning.remove()
    }

    const warningDiv = document.createElement("div")
    warningDiv.id = 'security-warning'
    warningDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.95);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 99999;
      font-family: Inter, system-ui, sans-serif;
    `
    warningDiv.innerHTML = `
      <div style="
        background: #1a1a1a;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        max-width: 400px;
        border: 1px solid #333;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      ">
        <h2 style="color: #ef4444; margin-bottom: 1rem; font-size: 1.5rem; font-weight: 600;">
          🔒 Security Alert
        </h2>
        <p style="color: #d1d5db; margin-bottom: 1.5rem; line-height: 1.5;">
          Developer tools and content inspection are disabled for security reasons.
        </p>
        <button 
          onclick="this.parentElement.parentElement.remove()"
          style="
            background: #ef4444;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.2s;
          "
          onmouseover="this.style.background='#dc2626'"
          onmouseout="this.style.background='#ef4444'"
        >
          I Understand
        </button>
      </div>
    `
    document.body.appendChild(warningDiv)

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (document.getElementById('security-warning')) {
        warningDiv.remove()
      }
    }, 5000)
  }

  // Show loading state during auth check
  if (!authCheckComplete) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>🔐 Verifying Access...</h2>
          <p>Please wait while we authenticate your session</p>
        </div>
      </div>
    )
  }

  // Show unauthorized state
  if (!isAuthorized) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <h2>🚫 Access Denied</h2>
          <p>You need a valid KIIT email address to access this content</p>
          <Link 
            href="/" 
            className="home-button"
          >
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  // Show PDF loading state
  if (!url) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>📑 Loading Document...</h2>
          <p>Please wait while we prepare your document</p>
        </div>
      </div>
    )
  }

  return (
    <div className="viewer-wrapper">
      {/* Top overlay to hide white bar */}
      <div className="top-overlay"></div>
      
      {/* Logo with your custom image */}
      <div className="logo">
        <Link href="/">
          <div className="logo-container">
            <img 
              src="/logo.png" 
              alt="KIITHub Logo" 
              className="logo-image"
            />
          </div>
        </Link>
      </div>

      <div className="viewer-container">
        <iframe 
          id="pdf-viewer" 
          src={url} 
          allowFullScreen
          className="pdf-iframe"
        />
      </div>
    </div>
  )
}