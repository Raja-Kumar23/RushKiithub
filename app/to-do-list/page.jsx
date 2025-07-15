"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, List, Clock, Check, Edit, Trash, CheckCircle, Info, X, AlertTriangle, ArrowLeft, Moon } from "lucide-react"
import { useRouter } from "next/navigation"
import "./styles.css"

function Notification({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`notification notification-${type}`}>
      {type === "success" ? <CheckCircle size={20} /> : <Info size={20} />}
      <span>{message}</span>
    </div>
  )
}

export default function TodoPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [tasks, setTasks] = useState([])
  const [currentFilter, setCurrentFilter] = useState("all")
  const [taskInput, setTaskInput] = useState("")
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editTaskInput, setEditTaskInput] = useState("")
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteTaskId, setDeleteTaskId] = useState(null)
  const [notification, setNotification] = useState(null)
  const editInputRef = useRef(null)

  // Check authentication
  useEffect(() => {
    const checkAuth = () => {
      // For demo purposes, let's allow access without strict authentication
      // You can modify this logic based on your actual authentication system
      const userEmail = localStorage.getItem("userEmail") || "demo@kiit.ac.in"
      const userData = localStorage.getItem("user") || JSON.stringify({ email: "demo@kiit.ac.in", name: "Demo User" })

      console.log("Checking auth - Email:", userEmail, "UserData:", userData)
      
      // Allow KIIT Gmail accounts OR specific authorized emails OR demo access
      if (userEmail && userData && 
          (userEmail.endsWith("@kiit.ac.in") || 
           userEmail === "davidtomdon@gmail.com" ||
           userEmail.includes("kiit") ||
           userEmail === "demo@kiit.ac.in")) {
        setIsAuthorized(true)
        console.log("Access granted for:", userEmail)
      } else {
        setIsAuthorized(false)
        console.log("Access denied for:", userEmail)
        // For demo, let's allow access anyway - remove this in production
        setIsAuthorized(true)
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  // Load tasks from localStorage on mount
  useEffect(() => {
    if (!isAuthorized) return
    const savedTasks = localStorage.getItem("notes-tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    } else {
      const sampleTasks = [
        {
          id: "1",
          text: "Complete assignment for Data Structures",
          completed: false,
          createdAt: new Date().toISOString(),
          completedAt: null,
        },
        {
          id: "2",
          text: "Study for upcoming mid-semester exam",
          completed: false,
          createdAt: new Date(Date.now() - 60000).toISOString(),
          completedAt: null,
        },
        {
          id: "3",
          text: "Submit lab report",
          completed: true,
          createdAt: new Date(Date.now() - 120000).toISOString(),
          completedAt: new Date().toISOString(),
        },
      ]
      setTasks(sampleTasks)
      localStorage.setItem("notes-tasks", JSON.stringify(sampleTasks))
    }
  }, [isAuthorized])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (isAuthorized) {
      localStorage.setItem("notes-tasks", JSON.stringify(tasks))
    }
  }, [tasks, isAuthorized])

  // Focus edit input when modal opens
  useEffect(() => {
    if (showEditModal && editInputRef.current) {
      editInputRef.current.focus()
    }
  }, [showEditModal])

  const addTask = () => {
    const text = taskInput.trim()
    if (!text) return

    const newTask = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    }

    setTasks((prev) => [newTask, ...prev])
    setTaskInput("")
    showNotification("Task added successfully!", "success")
  }

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          const completed = !task.completed
          return {
            ...task,
            completed,
            completedAt: completed ? new Date().toISOString() : null,
          }
        }
        return task
      }),
    )

    const task = tasks.find((t) => t.id === id)
    if (task) {
      const message = !task.completed ? "Task completed!" : "Task marked as pending"
      showNotification(message, !task.completed ? "success" : "info")
    }
  }

  const deleteTask = (id) => {
    setDeleteTaskId(id)
    setShowDeleteModal(true)
  }

  const confirmDeleteTask = () => {
    if (!deleteTaskId) return

    if (deleteTaskId === "clear-completed") {
      const completedCount = tasks.filter((t) => t.completed).length
      setTasks((prev) => prev.filter((t) => !t.completed))
      showNotification(`${completedCount} completed task${completedCount > 1 ? "s" : ""} deleted!`, "success")
    } else {
      setTasks((prev) => prev.filter((t) => t.id !== deleteTaskId))
      showNotification("Task deleted successfully!", "success")
    }

    setShowDeleteModal(false)
    setDeleteTaskId(null)
  }

  const editTask = (id) => {
    const task = tasks.find((t) => t.id === id)
    if (task) {
      setEditingTaskId(id)
      setEditTaskInput(task.text)
      setShowEditModal(true)
    }
  }

  const saveEdit = () => {
    const newText = editTaskInput.trim()
    if (!newText || !editingTaskId) return

    setTasks((prev) => prev.map((task) => (task.id === editingTaskId ? { ...task, text: newText } : task)))
    setShowEditModal(false)
    setEditingTaskId(null)
    setEditTaskInput("")
    showNotification("Task updated successfully!", "success")
  }

  const clearCompleted = () => {
    const completedCount = tasks.filter((t) => t.completed).length
    if (completedCount === 0) return

    setDeleteTaskId("clear-completed")
    setShowDeleteModal(true)
  }

  const showNotification = (message, type) => {
    setNotification({ message, type })
  }

  const getFilteredTasks = () => {
    switch (currentFilter) {
      case "completed":
        return tasks.filter((t) => t.completed)
      case "pending":
        return tasks.filter((t) => !t.completed)
      default:
        return tasks
    }
  }

  const goBack = () => {
    router.push("/")
  }

  // Show loading or unauthorized state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="unauthorized-container">
        <div className="unauthorized-content">
          <AlertTriangle size={64} />
          <h2>Access Restricted</h2>
          <p>Only KIIT Gmail accounts and authorized users can access this feature.</p>
          <button onClick={() => router.push("/")} className="btn-primary">
            Go Back to Home
          </button>
        </div>
      </div>
    )
  }

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.completed).length
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const today = new Date().toDateString()
  const todayTasks = tasks.filter((t) => new Date(t.createdAt).toDateString() === today).length

  const getStartOfWeek = () => {
    const now = new Date()
    const day = now.getDay()
    const diff = now.getDate() - day
    return new Date(now.setDate(diff))
  }

  const weekTasks = tasks.filter((t) => new Date(t.createdAt) >= getStartOfWeek()).length
  const filteredTasks = getFilteredTasks()
  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <div className="dark-todo-container">
      {/* Background Elements */}
      <div className="dark-bg-overlay"></div>
      <div className="dark-bg-particles"></div>
      
      {/* Header */}
      <header className="dark-header">
        <div className="dark-header-content">
          <div className="dark-header-left">
            <button onClick={goBack} className="dark-back-btn">
              <ArrowLeft size={24} />
            </button>
            <div className="dark-logo">
              
              <h1>My Notes</h1>
            </div>
          </div>
          <div className="dark-header-stats">
            <div className="dark-stat-card">
              <span className="dark-stat-number">{totalTasks}</span>
              <span className="dark-stat-label">Total</span>
            </div>
            <div className="dark-stat-card">
              <span className="dark-stat-number">{completedTasks}</span>
              <span className="dark-stat-label">Completed</span>
            </div>
            <div className="dark-progress-mini">
              <div className="dark-progress-mini-fill" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dark-main-content">
        <div className="dark-main-tasks">
          {/* Task Input */}
          <div className="dark-input-section">
            <div className="dark-input-container">
              <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTask()}
                placeholder="What needs to be done?"
                maxLength={200}
                className="dark-task-input"
              />
              <button onClick={addTask} className="dark-add-btn">
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="dark-filter-section">
            <div className="dark-filter-tabs">
              <button
                className={`dark-filter-btn ${currentFilter === "all" ? "active" : ""}`}
                onClick={() => setCurrentFilter("all")}
              >
                <List size={16} />
                All Tasks
                <span className="dark-filter-count">{tasks.length}</span>
              </button>
              <button
                className={`dark-filter-btn ${currentFilter === "pending" ? "active" : ""}`}
                onClick={() => setCurrentFilter("pending")}
              >
                <Clock size={16} />
                Pending
                <span className="dark-filter-count">{tasks.filter(t => !t.completed).length}</span>
              </button>
              <button
                className={`dark-filter-btn ${currentFilter === "completed" ? "active" : ""}`}
                onClick={() => setCurrentFilter("completed")}
              >
                <Check size={16} />
                Completed
                <span className="dark-filter-count">{completedCount}</span>
              </button>
            </div>
          </div>

          {/* Tasks List */}
          <div className="dark-tasks-section">
            {filteredTasks.length === 0 ? (
              <div className="dark-empty-state">
                {currentFilter === "completed" ? (
                  <>
                    <CheckCircle size={64} className="dark-empty-icon" />
                    <h3>No completed tasks</h3>
                    <p>Complete some tasks to see them here!</p>
                  </>
                ) : currentFilter === "pending" ? (
                  <>
                    <Clock size={64} className="dark-empty-icon" />
                    <h3>No pending tasks</h3>
                    <p>Great job! All your tasks are completed.</p>
                  </>
                ) : (
                  <>
                    <List size={64} className="dark-empty-icon" />
                    <h3>No tasks yet</h3>
                    <p>Add a task above to get started with your productivity journey!</p>
                  </>
                )}
              </div>
            ) : (
              <div className="dark-tasks-list">
                {filteredTasks.map((task) => (
                  <div key={task.id} className={`dark-task-item ${task.completed ? "completed" : ""}`}>
                    <div className="dark-task-content">
                      <button
                        className={`dark-task-checkbox ${task.completed ? "checked" : ""}`}
                        onClick={() => toggleTask(task.id)}
                      >
                        {task.completed && <Check size={16} />}
                      </button>
                      <div className="dark-task-body">
                        <div className={`dark-task-text ${task.completed ? "completed" : ""}`}>
                          {task.text}
                        </div>
                        <div className="dark-task-meta">
                          <span className="dark-task-date">
                            {new Date(task.createdAt).toLocaleDateString()} at {" "}
                            {new Date(task.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {task.completed && task.completedAt && (
                            <span className="dark-task-completed">
                              ✓ Completed {new Date(task.completedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="dark-task-actions">
                        <button 
                          className="dark-action-btn dark-edit-btn" 
                          onClick={() => editTask(task.id)} 
                          title="Edit task"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="dark-action-btn dark-delete-btn" 
                          onClick={() => deleteTask(task.id)} 
                          title="Delete task"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          {completedCount > 0 && (
            <div className="dark-actions-section">
              <button onClick={clearCompleted} className="dark-clear-btn">
                <Trash size={16} />
                Clear {completedCount} Completed Task{completedCount > 1 ? "s" : ""}
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="dark-sidebar">
          {/* Progress Card */}
          <div className="dark-progress-card">
            <h3 className="dark-sidebar-title">
              <CheckCircle size={20} />
              Progress Overview
            </h3>
            <div className="dark-progress-circle">
              <svg viewBox="0 0 100 100" className="dark-progress-svg">
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(16, 185, 129, 0.1)"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(progressPercentage / 100) * 283} 283`}
                  transform="rotate(-90 50 50)"
                />
                <text x="50" y="50" textAnchor="middle" dy="0.3em" className="dark-progress-text">
                  {progressPercentage}%
                </text>
              </svg>
            </div>
            <div className="dark-progress-stats">
              <div className="dark-progress-stat">
                <span className="dark-progress-stat-number">{completedTasks}</span>
                <span className="dark-progress-stat-label">Completed</span>
              </div>
              <div className="dark-progress-stat">
                <span className="dark-progress-stat-number">{totalTasks - completedTasks}</span>
                <span className="dark-progress-stat-label">Remaining</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="dark-stats-card">
            <h3 className="dark-sidebar-title">
              <Clock size={20} />
              Quick Stats
            </h3>
            <div className="dark-quick-stats">
              <div className="dark-quick-stat">
                <span className="dark-quick-stat-number">{todayTasks}</span>
                <span className="dark-quick-stat-label">Today</span>
              </div>
              <div className="dark-quick-stat">
                <span className="dark-quick-stat-number">{weekTasks}</span>
                <span className="dark-quick-stat-label">This Week</span>
              </div>
            </div>
          </div>

          {/* Productivity Tips */}
          <div className="dark-tips-card">
            <h3 className="dark-sidebar-title">
              <Info size={20} />
              Productivity Tips
            </h3>
            <div className="dark-tips-list">
              <div className="dark-tip-item">
                <div className="dark-tip-icon">💡</div>
                <div className="dark-tip-content">
                  <h4>Break Down Tasks</h4>
                  <p>Split large tasks into smaller, manageable pieces for better progress tracking.</p>
                </div>
              </div>
              <div className="dark-tip-item">
                <div className="dark-tip-icon">⚡</div>
                <div className="dark-tip-content">
                  <h4>Use Time Blocking</h4>
                  <p>Allocate specific time slots for different tasks to maintain focus.</p>
                </div>
              </div>
              <div className="dark-tip-item">
                <div className="dark-tip-icon">🎯</div>
                <div className="dark-tip-content">
                  <h4>Set Priorities</h4>
                  <p>Focus on high-impact tasks first to maximize your productivity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="dark-modal-overlay">
          <div className="dark-modal">
            <div className="dark-modal-header">
              <h3>Edit Task</h3>
              <button className="dark-modal-close" onClick={() => setShowEditModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="dark-modal-body">
              <input
                ref={editInputRef}
                type="text"
                value={editTaskInput}
                onChange={(e) => setEditTaskInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                placeholder="Edit your task..."
                maxLength={200}
                className="dark-modal-input"
              />
            </div>
            <div className="dark-modal-footer">
              <button onClick={() => setShowEditModal(false)} className="dark-btn-secondary">
                Cancel
              </button>
              <button onClick={saveEdit} className="dark-btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="dark-modal-overlay">
          <div className="dark-modal">
            <div className="dark-modal-header">
              <h3>Delete Task</h3>
              <button className="dark-modal-close" onClick={() => setShowDeleteModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="dark-modal-body">
              <div className="dark-delete-content">
                <AlertTriangle size={48} className="dark-delete-icon" />
                <p className="dark-delete-message">
                  {deleteTaskId === "clear-completed"
                    ? `Delete ${completedCount} completed task${completedCount > 1 ? "s" : ""}?`
                    : "Are you sure you want to delete this task?"}
                </p>
                <p className="dark-delete-warning">
                  {deleteTaskId === "clear-completed"
                    ? "All completed tasks will be permanently removed."
                    : "This action cannot be undone."}
                </p>
              </div>
            </div>
            <div className="dark-modal-footer">
              <button onClick={() => setShowDeleteModal(false)} className="dark-btn-secondary">
                Cancel
              </button>
              <button onClick={confirmDeleteTask} className="dark-btn-danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}
    </div>
  )
}