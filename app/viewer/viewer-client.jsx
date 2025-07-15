"use client"
import { useEffect, useState } from "react"
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

  // Handle authentication check
  useEffect(() => {
    if (typeof window === "undefined" || !auth) return

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email && user.email.toLowerCase().endsWith("@kiit.ac.in")) {
        setIsAuthorized(true)
      } else {
        setIsAuthorized(false)
        if (authCheckComplete) {
          router.push("/")
        }
      }
      setAuthCheckComplete(true)
    })

    return () => unsubscribe()
  }, [router, authCheckComplete])

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
      if (key === "f12" || (e.ctrlKey && e.shiftKey && (key === "i" || key === "j")) || (e.ctrlKey && key === "u")) {
        e.preventDefault()
        showWarning()
      }
    }
    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("keydown", handleKeyEvents)
    document.addEventListener("keyup", handleKeyEvents)
    document.addEventListener("keypress", handleKeyEvents)
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("keydown", handleKeyEvents)
      document.removeEventListener("keyup", handleKeyEvents)
      document.removeEventListener("keypress", handleKeyEvents)
    }
  }, [isAuthorized])

  // Title observer
  useEffect(() => {
    if (!title || typeof window === "undefined") return
    const titleObserver = new MutationObserver(() => {
      const expectedTitle = `${title} | KIITHub`
      if (document.title !== expectedTitle) {
        document.title = expectedTitle
      }
    })
    titleObserver.observe(document.querySelector("title") || document.head, {
      subtree: true,
      characterData: true,
      childList: true,
    })
    return () => titleObserver.disconnect()
  }, [title])

  const showWarning = () => {
    const warningDiv = document.createElement("div")
    warningDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    `
    warningDiv.innerHTML = `
      <div style="
        background: #222;
        padding: 2rem;
        border-radius: 10px;
        text-align: center;
        max-width: 400px;
      ">
        <h2 style="color: #ff4444; margin-bottom: 1rem;">Security Alert</h2>
        <p style="color: white; margin-bottom: 1.5rem;">
          This action is not permitted for security reasons.
        </p>
        <button 
          onclick="this.parentElement.parentElement.remove()"
          style="
            background: #ff4444;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
          "
        >
          Close
        </button>
      </div>
    `
    document.body.appendChild(warningDiv)
  }

  if (!authCheckComplete) {
    return (
      <div className="loading-screen">
        <h2>🔐 Authenticating...</h2>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="loading-screen">
        <h2>🚫 Unauthorized Access. Redirecting...</h2>
      </div>
    )
  }

  if (!url) {
    return (
      <div className="loading-screen">
        <h2>📑 Loading PDF...</h2>
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