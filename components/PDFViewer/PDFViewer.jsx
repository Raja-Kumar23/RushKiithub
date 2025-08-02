"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { X, Maximize, Minimize, FileText } from "lucide-react"
import "./PDFViewer.css"
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

const PDFViewer = ({ isOpen, onClose, fileUrl, fileName, theme }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [viewerMethod, setViewerMethod] = useState("iframe") // Start with iframe for faster loading
  const [pdfJsLoaded, setPdfJsLoaded] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const canvasRef = useRef(null)
  const iframeRef = useRef(null)
  const pdfDocRef = useRef(null)
  const containerRef = useRef(null)
  const loadingTimeoutRef = useRef(null)

  const [scale, setScale] = useState(1.0)
  const [minScale] = useState(0.5)
  const [maxScale] = useState(3.0)

  // Preload PDF.js in background but don't wait for it
  useEffect(() => {
    const loadPdfJs = async () => {
      if (typeof window !== "undefined" && !window.pdfjsLib) {
        try {
          // Load PDF.js asynchronously without blocking
          const script = document.createElement("script")
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
          script.async = true

          script.onload = () => {
            if (window.pdfjsLib) {
              window.pdfjsLib.GlobalWorkerOptions.workerSrc =
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"
              window.pdfjsLib.GlobalWorkerOptions.disableTextLayer = true
              window.pdfjsLib.GlobalWorkerOptions.disableAnnotationLayer = true
              setPdfJsLoaded(true)
              console.log("PDF.js loaded in background")
            }
          }

          script.onerror = () => {
            console.log("PDF.js failed to load, iframe will be used")
            setPdfJsLoaded(false)
          }

          document.head.appendChild(script)
        } catch (error) {
          console.log("PDF.js loading failed, using iframe fallback")
          setPdfJsLoaded(false)
        }
      } else if (window.pdfjsLib) {
        setPdfJsLoaded(true)
      }
    }

    // Load PDF.js in background without waiting
    loadPdfJs()
  }, [])

  // Handle true fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement

      if (!isCurrentlyFullscreen && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange)
    document.addEventListener("mozfullscreenchange", handleFullscreenChange)
    document.addEventListener("MSFullscreenChange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange)
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange)
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange)
    }
  }, [isFullscreen])

  // Fast loading when modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      resetViewerState()

      if (!fileUrl) {
        setError("No file URL provided.")
        setIsLoading(false)
        return
      }

      // Start with fastest method (iframe) immediately
      loadWithIframe()
    } else {
      document.body.style.overflow = "unset"
      resetViewerState()
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
      if (isFullscreen) {
        exitFullscreen()
      }
    }

    return () => {
      document.body.style.overflow = "unset"
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
    }
  }, [isOpen, fileUrl])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return

      switch (e.key) {
        case "Escape":
          if (isFullscreen) {
            exitFullscreen()
          } else {
            onClose()
          }
          break
        case "ArrowRight":
        case " ":
          if (viewerMethod === "pdfjs" && currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
          }
          break
        case "ArrowLeft":
        case "Backspace":
          if (viewerMethod === "pdfjs" && currentPage > 1) {
            setCurrentPage(currentPage - 1)
          }
          break
        case "f":
        case "F":
          toggleFullscreen()
          break
        case "+":
        case "=":
          zoomIn()
          break
        case "-":
        case "_":
          zoomOut()
          break
        case "0":
          resetZoom()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, currentPage, totalPages, isFullscreen, onClose, viewerMethod, scale])

  // Render page when currentPage changes (PDF.js only)
  useEffect(() => {
    if (viewerMethod === "pdfjs" && pdfDocRef.current && currentPage > 0) {
      renderPage(currentPage)
    }
  }, [currentPage, viewerMethod, scale])

  const resetViewerState = useCallback(() => {
    setIsLoading(true)
    setError(null)
    setCurrentPage(1)
    setTotalPages(0)
    setLoadingProgress(0)
    pdfDocRef.current = null
    setScale(1.0)
    setViewerMethod("iframe") // Always start with iframe for speed
  }, [])

  const getProcessedURL = (url) => {
    try {
      if (url.includes("firebasestorage.googleapis.com")) {
        const urlObj = new URL(url)
        urlObj.searchParams.set("alt", "media")
        // Add cache control for faster loading
        urlObj.searchParams.set("cache", "public")
        return urlObj.toString()
      }
      return url
    } catch (error) {
      console.error("Error processing URL:", error)
      return url
    }
  }

  // Fast iframe loading - primary method
  const loadWithIframe = () => {
    setIsLoading(true)
    setError(null)
    setViewerMethod("iframe")
    setLoadingProgress(10)

    const processedUrl = getProcessedURL(fileUrl)
    console.log("Fast loading with iframe:", processedUrl)

    // Much shorter timeout for iframe
    loadingTimeoutRef.current = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false)
        console.log("Iframe loaded (timeout)")
      }
    }, 1500) // Reduced from 3000ms to 1500ms

    const handleLoad = () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
      setLoadingProgress(100)
      setIsLoading(false)
      console.log("Iframe loaded successfully")
    }

    const handleError = () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
      setIsLoading(false)
      // If iframe fails, try PDF.js if available
      if (pdfJsLoaded) {
        console.log("Iframe failed, trying PDF.js")
        loadPDFDocument()
      } else {
        setError("Unable to load PDF. The file may be inaccessible.")
      }
    }

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 100)

    if (iframeRef.current) {
      iframeRef.current.onload = handleLoad
      iframeRef.current.onerror = handleError
    }

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
      clearInterval(progressInterval)
    }
  }

  // PDF.js loading - fallback method
  const loadPDFDocument = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setViewerMethod("pdfjs")
      setLoadingProgress(20)

      if (!window.pdfjsLib) {
        throw new Error("PDF.js library not loaded")
      }

      const processedUrl = getProcessedURL(fileUrl)
      console.log("Loading with PDF.js:", processedUrl)

      const loadingTask = window.pdfjsLib.getDocument({
        url: processedUrl,
        withCredentials: false,
        disableRange: false, // Enable range requests for faster loading
        disableStream: false, // Enable streaming for faster loading
        disableAutoFetch: true, // Disable auto-fetch for faster initial load
        timeout: 15000, // Reduced timeout
        disableTextLayer: true,
        disableAnnotationLayer: true,
        enableXfa: false,
      })

      // Progress tracking
      loadingTask.onProgress = (progress) => {
        if (progress.total > 0) {
          const percent = Math.min(90, Math.round((progress.loaded / progress.total) * 80) + 20)
          setLoadingProgress(percent)
        }
      }

      const pdf = await loadingTask.promise
      pdfDocRef.current = pdf
      setTotalPages(pdf.numPages)
      setCurrentPage(1)

      console.log(`PDF.js loaded successfully. Pages: ${pdf.numPages}`)
      setLoadingProgress(95)
      await renderPage(1)
      setLoadingProgress(100)
      setIsLoading(false)
    } catch (error) {
      console.error("PDF.js failed:", error)
      // Fallback to iframe if PDF.js fails
      setViewerMethod("iframe")
      loadWithIframe()
    }
  }

  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.25, maxScale))
  }

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.25, minScale))
  }

  const resetZoom = () => {
    setScale(1.0)
  }

  const enterFullscreen = async () => {
    const element = containerRef.current?.parentElement
    if (!element) return

    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen()
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen()
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen()
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen()
      }
      setIsFullscreen(true)
    } catch (error) {
      console.error("Failed to enter fullscreen:", error)
      setIsFullscreen(true)
    }
  }

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen()
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen()
      }
    } catch (error) {
      console.error("Failed to exit fullscreen:", error)
    }
    setIsFullscreen(false)
  }

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen()
    } else {
      enterFullscreen()
    }
  }

  const renderPage = async (pageNumber) => {
    if (!pdfDocRef.current || !canvasRef.current) return

    try {
      const page = await pdfDocRef.current.getPage(pageNumber)
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      context.clearRect(0, 0, canvas.width, canvas.height)

      const container = containerRef.current
      if (!container) return

      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight - (isFullscreen ? 60 : 100)

      const originalViewport = page.getViewport({ scale: 1 })
      const padding = isFullscreen ? 20 : 40
      const scaleX = (containerWidth - padding) / originalViewport.width
      const scaleY = (containerHeight - padding) / originalViewport.height
      const fitScale = Math.min(scaleX, scaleY, 3.0)

      const finalScale = fitScale * scale
      const viewport = page.getViewport({ scale: finalScale })

      const devicePixelRatio = window.devicePixelRatio || 1
      canvas.height = viewport.height * devicePixelRatio
      canvas.width = viewport.width * devicePixelRatio
      canvas.style.height = viewport.height + "px"
      canvas.style.width = viewport.width + "px"

      context.scale(devicePixelRatio, devicePixelRatio)

      await page.render({
        canvasContext: context,
        viewport: viewport,
        enableWebGL: true,
        renderInteractiveForms: false,
      }).promise

      console.log(`Page ${pageNumber} rendered successfully`)
    } catch (error) {
      console.error(`Error rendering page ${pageNumber}:`, error)
    }
  }

  const handleCanvasClick = (e) => {
    if (viewerMethod !== "pdfjs") return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left

    if (x < rect.width / 3) {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
    } else if (x > (rect.width * 2) / 3) {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1)
      }
    }
  }

  const retryLoading = () => {
    if (viewerMethod === "pdfjs") {
      loadPDFDocument()
    } else {
      loadWithIframe()
    }
  }

  const switchToPdfJs = () => {
    if (pdfJsLoaded) {
      loadPDFDocument()
    } else {
      setError("PDF.js is not available. Please try refreshing the page.")
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={`pdf-viewer-overlay ${isFullscreen ? "fullscreen" : ""}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
        background: "rgba(0, 0, 0, 0.98)",
        backdropFilter: "blur(20px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isFullscreen ? "0" : "20px",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "#000000",
          border: "none",
          boxShadow: "none",
          width: isFullscreen ? "100vw" : "90vw",
          height: isFullscreen ? "100vh" : "85vh",
          maxWidth: isFullscreen ? "none" : "1200px",
          borderRadius: isFullscreen ? "0" : "8px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#22c55e",
            padding: isFullscreen ? "12px 20px" : "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
            zIndex: 1000,
            borderRadius: isFullscreen ? "0" : "8px 8px 0 0",
            minHeight: isFullscreen ? "48px" : "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flex: 1,
            }}
          >
            <FileText size={isFullscreen ? 18 : 20} color="white" />
            <div>
              <h3
                style={{
                  color: "white",
                  margin: 0,
                  fontSize: isFullscreen ? "14px" : "16px",
                  fontWeight: "600",
                }}
              >
                {fileName || "PDF Document"}
              </h3>
              {!isFullscreen && (
                <p
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    margin: "2px 0 0 0",
                    fontSize: "12px",
                  }}
                >
                  {isLoading
                    ? `🚀 Fast loading... ${loadingProgress}%`
                    : viewerMethod === "pdfjs" && totalPages > 0
                      ? `📄 Page ${currentPage} of ${totalPages} • PDF.js`
                      : viewerMethod === "iframe"
                        ? "📄 Browser PDF Viewer"
                        : "📄 Ready"}
                </p>
              )}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              style={{
                color: "white",
                background: "rgba(255, 255, 255, 0.1)",
                border: "none",
                padding: isFullscreen ? "6px" : "8px",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
              }}
            >
              {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "3px",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "6px",
                padding: "3px",
              }}
            >
              <button
                onClick={zoomOut}
                disabled={scale <= minScale}
                title="Zoom Out (-)"
                style={{
                  color: "white",
                  background: scale <= minScale ? "rgba(255, 255, 255, 0.1)" : "transparent",
                  border: "none",
                  padding: isFullscreen ? "4px 6px" : "6px 8px",
                  borderRadius: "4px",
                  cursor: scale <= minScale ? "not-allowed" : "pointer",
                  fontSize: isFullscreen ? "14px" : "16px",
                  fontWeight: "bold",
                  opacity: scale <= minScale ? 0.5 : 1,
                }}
              >
                −
              </button>
              <span
                style={{
                  color: "white",
                  fontSize: isFullscreen ? "10px" : "12px",
                  minWidth: isFullscreen ? "35px" : "45px",
                  textAlign: "center",
                }}
              >
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={zoomIn}
                disabled={scale >= maxScale}
                title="Zoom In (+)"
                style={{
                  color: "white",
                  background: scale >= maxScale ? "rgba(255, 255, 255, 0.1)" : "transparent",
                  border: "none",
                  padding: isFullscreen ? "4px 6px" : "6px 8px",
                  borderRadius: "4px",
                  cursor: scale >= maxScale ? "not-allowed" : "pointer",
                  fontSize: isFullscreen ? "14px" : "16px",
                  fontWeight: "bold",
                  opacity: scale >= maxScale ? 0.5 : 1,
                }}
              >
                +
              </button>
            </div>

            <button
              onClick={onClose}
              title="Close"
              style={{
                color: "white",
                background: "rgba(239, 68, 68, 0.8)",
                border: "none",
                padding: isFullscreen ? "6px" : "8px",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          ref={containerRef}
          style={{
            position: "relative",
            flex: 1,
            overflow: "hidden",
            background: "#1a1a1a",
            width: "100%",
            height: "100%",
          }}
        >
          {/* Fast Loading State */}
          {isLoading && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                color: "white",
                zIndex: 10,
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  border: "4px solid rgba(34, 197, 94, 0.1)",
                  borderTop: "4px solid #22c55e",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  margin: "0 auto 20px",
                }}
              ></div>
              <p style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "600" }}>🚀 Fast Loading PDF...</p>
              <div
                style={{
                  width: "200px",
                  height: "4px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "2px",
                  margin: "12px auto",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${loadingProgress}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #22c55e, #16a34a)",
                    borderRadius: "2px",
                    transition: "width 0.3s ease",
                  }}
                ></div>
              </div>
              <p style={{ margin: 0, fontSize: "12px", opacity: 0.7 }}>
                {loadingProgress}% • {viewerMethod === "pdfjs" ? "PDF.js renderer" : "Browser viewer"}
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                color: "white",
                padding: "30px",
                zIndex: 10,
                maxWidth: "500px",
                background: "rgba(239, 68, 68, 0.1)",
                borderRadius: "12px",
                border: "1px solid rgba(239, 68, 68, 0.3)",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "600" }}>Failed to Load PDF</h3>
              <p style={{ marginBottom: "20px", fontSize: "14px", lineHeight: "1.5", opacity: 0.9 }}>{error}</p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  onClick={retryLoading}
                  style={{
                    background: "#22c55e",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  🔄 Retry Loading
                </button>
                {viewerMethod === "iframe" && pdfJsLoaded && (
                  <button
                    onClick={switchToPdfJs}
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      color: "white",
                      border: "1px solid rgba(255, 255, 255, 0.3)",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    📄 Try PDF.js
                  </button>
                )}
                <button
                  onClick={() => window.open(fileUrl, "_blank")}
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  🔗 Open in New Tab
                </button>
              </div>
            </div>
          )}

          {/* PDF.js Canvas */}
          {viewerMethod === "pdfjs" && !isLoading && !error && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: isFullscreen ? "10px" : "20px",
                minHeight: "100%",
                background: "#1a1a1a",
                overflow: scale > 1 ? "auto" : "hidden",
              }}
            >
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  boxShadow: isFullscreen ? "0 4px 20px rgba(0, 0, 0, 0.6)" : "0 8px 32px rgba(0, 0, 0, 0.4)",
                  background: "white",
                  cursor: "pointer",
                  borderRadius: isFullscreen ? "4px" : "8px",
                }}
              />
            </div>
          )}

          {/* Iframe Fallback */}
          {viewerMethod === "iframe" && !error && (
            <iframe
              ref={iframeRef}
              src={`${getProcessedURL(fileUrl)}#toolbar=0&navpanes=0&scrollbar=0`}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                background: "#1a1a1a",
                display: isLoading ? "none" : "block",
                transform: `scale(${scale})`,
                transformOrigin: "center center",
              }}
              title="PDF Document"
            />
          )}

          {/* Navigation Hint - Only show when not fullscreen */}
          {!isFullscreen && viewerMethod === "pdfjs" && totalPages > 1 && !isLoading && !error && (
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(34, 197, 94, 0.9)",
                color: "white",
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "12px",
                pointerEvents: "none",
                opacity: 0.8,
                fontWeight: "500",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              }}
            >
              ← Click sides • Page {currentPage}/{totalPages} • Keys: ↑↓ F +/- →
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PDFViewer
