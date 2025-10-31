// Page-level security initialization
export function initializePageSecurity() {
  if (typeof window === "undefined") return

  // Disable right-click context menu
  document.addEventListener("contextmenu", (e) => e.preventDefault())

  // Disable text selection
  document.body.style.userSelect = "none"
  document.body.style.webkitUserSelect = "none"

  // Block keyboard shortcuts for DevTools and inspection
  const blockedKeys = [
    "F12", // F12
    "I", // Ctrl+Shift+I
    "C", // Ctrl+Shift+C
    "J", // Ctrl+Shift+J
    "K", // Ctrl+Shift+K
  ]

  document.addEventListener("keydown", (e) => {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0
    const isCtrlOrCmd = isMac ? e.metaKey : e.ctrlKey

    // Block F12
    if (e.key === "F12") {
      e.preventDefault()
      return false
    }

    // Block Ctrl+Shift+I/C/J/K (Windows/Linux)
    if (isCtrlOrCmd && e.shiftKey && blockedKeys.includes(e.key.toUpperCase())) {
      e.preventDefault()
      return false
    }

    // Block Cmd+Option+I/U (Mac)
    if (isMac && e.metaKey && e.altKey && (e.key === "i" || e.key === "u")) {
      e.preventDefault()
      return false
    }
  })

  // Detect and block DevTools
  const detectDevTools = () => {
    const threshold = 160
    if (window.outerHeight - window.innerHeight > threshold || window.outerWidth - window.innerWidth > threshold) {
      document.body.innerHTML = ""
      window.location.href = "about:blank"
    }
  }

  setInterval(detectDevTools, 500)

  // Override console methods to prevent logging
  const noop = () => {}
  window.console.log = noop
  window.console.debug = noop
  window.console.info = noop
  window.console.warn = noop
  window.console.error = noop
  window.console.table = noop
  window.console.group = noop
  window.console.groupCollapsed = noop
  window.console.groupEnd = noop

  // Prevent debugger attachment
  try {
    setInterval(() => {
      debugger
    }, 100)
  } catch (e) {}
}
