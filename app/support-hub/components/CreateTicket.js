"use client"

import { useState, useEffect } from "react"
import { createTicket } from "@/lib/tickets"
import { X, AlertCircle, CheckCircle, Sparkles, Clock, Ban } from "lucide-react"

export default function CreateTicket({ user, onSuccess, onCancel, userTickets = [] }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showThankYou, setShowThankYou] = useState(false)
  const [canCreateTicket, setCanCreateTicket] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState("")
  const [nextAllowedTime, setNextAllowedTime] = useState(null)

  const categories = ["Mental & Emotional Support", "Academic Guidance", "General"]

  // Check if user can create a ticket (24-hour cooldown)
  useEffect(() => {
    const checkTicketCooldown = () => {
      if (!userTickets || userTickets.length === 0) {
        setCanCreateTicket(true)
        return
      }

      // Find the most recent ticket created by this user
      const sortedTickets = userTickets
        .filter(ticket => ticket.userId === user.uid)
        .sort((a, b) => {
          const aTime = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt)
          const bTime = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt)
          return bTime - aTime
        })

      if (sortedTickets.length === 0) {
        setCanCreateTicket(true)
        return
      }

      const lastTicket = sortedTickets[0]
      const lastTicketTime = lastTicket.createdAt?.toDate ? lastTicket.createdAt.toDate() : new Date(lastTicket.createdAt)
      const currentTime = new Date()
      const timeDifference = currentTime - lastTicketTime
      const twentyFourHours = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

      if (timeDifference < twentyFourHours) {
        setCanCreateTicket(false)
        const nextAllowed = new Date(lastTicketTime.getTime() + twentyFourHours)
        setNextAllowedTime(nextAllowed)
      } else {
        setCanCreateTicket(true)
        setNextAllowedTime(null)
      }
    }

    checkTicketCooldown()
  }, [userTickets, user.uid])

  // Update countdown timer
  useEffect(() => {
    let interval = null

    if (!canCreateTicket && nextAllowedTime) {
      interval = setInterval(() => {
        const now = new Date()
        const timeDiff = nextAllowedTime - now

        if (timeDiff <= 0) {
          setCanCreateTicket(true)
          setNextAllowedTime(null)
          setTimeRemaining("")
          clearInterval(interval)
        } else {
          const hours = Math.floor(timeDiff / (1000 * 60 * 60))
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`)
        }
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [canCreateTicket, nextAllowedTime])

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name === "title") {
      const wordCount = value.trim().split(/\s+/).length
      if (wordCount > 50 && value.trim() !== "") {
        return
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const getWordCount = (text) => {
    return text.trim() === "" ? 0 : text.trim().split(/\s+/).length
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!canCreateTicket) {
      setError("You can only create one ticket every 24 hours. Please wait before creating another ticket.")
      return
    }

    setLoading(true)
    setError("")

    try {
      if (!user || !user.uid || !user.email) {
        throw new Error("User information is missing. Please try logging in again.")
      }

      if (!formData.title.trim()) {
        throw new Error("Please enter a subject for your ticket.")
      }

      if (!formData.description.trim()) {
        throw new Error("Please provide a description of your issue.")
      }

      if (!formData.category) {
        throw new Error("Please select a category for your ticket.")
      }

      const ticketData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        priority: formData.priority,
        userId: user.uid,
        userEmail: user.email,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await createTicket(ticketData)
      setShowThankYou(true)

      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "medium",
      })

      setTimeout(() => {
        setShowThankYou(false)
        if (onSuccess) {
          onSuccess()
        }
      }, 3000)
    } catch (error) {
      console.error("Error creating ticket:", error)
      setError(error.message || "Failed to create ticket. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (showThankYou) {
    return (
      <div className="max-w-2xl" style={{ margin: "0 auto" }}>
        <div className="card text-center">
          <div className="mb-32">
            <div
              className="flex flex-center mb-24 shadow-glow"
              style={{
                width: "96px",
                height: "96px",
                margin: "0 auto",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              }}
            >
              <CheckCircle size={48} className="text-white" />
            </div>
            <div className="flex flex-center gap-8 mb-16">
              <Sparkles size={20} className="text-green-400 animate-pulse" />
              <h3 className="text-3xl font-bold text-gradient">Thank You!</h3>
              <Sparkles size={20} className="text-green-400 animate-pulse" />
            </div>
            <p className="text-gray-300 text-lg mb-24">
              Your support ticket has been created successfully. Our team will review it and get back to you soon.
            </p>
          </div>

          <div className="glass rounded-16 p-24 mb-32" style={{ border: "1px solid rgba(34, 197, 94, 0.2)" }}>
            <div className="flex flex-center gap-8 mb-16">
              <Sparkles size={20} className="text-green-400" />
              <h4 className="text-lg font-semibold text-white">What happens next?</h4>
              <Sparkles size={20} className="text-green-400" />
            </div>
            <div className="text-sm text-gray-300" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div className="flex gap-12">
                <div className="w-8 h-8 rounded-full" style={{ background: "#22c55e" }}></div>
                <span>Your ticket will be reviewed by our team</span>
              </div>
              <div className="flex gap-12">
                <div className="w-8 h-8 rounded-full" style={{ background: "#22c55e" }}></div>
                <span>You'll receive email updates on progress</span>
              </div>
              <div className="flex gap-12">
                <div className="w-8 h-8 rounded-full" style={{ background: "#22c55e" }}></div>
                <span>Expected response time: 24-48 hours</span>
              </div>
            </div>
          </div>

          <div className="alert alert-warning mb-24" style={{ background: "rgba(251, 146, 60, 0.1)", border: "1px solid rgba(251, 146, 60, 0.3)" }}>
            <Clock size={20} className="text-orange-400" />
            <div className="text-left">
              <p className="text-orange-300 font-medium">Ticket Creation Limit</p>
              <p className="text-orange-400 text-sm">You can create your next ticket in 24 hours from now.</p>
            </div>
          </div>

          <button
            onClick={() => {
              setShowThankYou(false)
              if (onSuccess) onSuccess()
            }}
            className="btn btn-primary text-lg px-32 py-16"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Show cooldown message if user cannot create ticket
  if (!canCreateTicket) {
    return (
      <div className="max-w-2xl" style={{ margin: "0 auto" }}>
        <div className="card text-center">
          <div className="mb-32">
            <div
              className="flex flex-center mb-24 shadow-glow"
              style={{
                width: "96px",
                height: "96px",
                margin: "0 auto",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              }}
            >
              <Clock size={48} className="text-white" />
            </div>
            <div className="flex flex-center gap-8 mb-16">
              <Ban size={20} className="text-orange-400" />
              <h3 className="text-3xl font-bold text-gradient">Ticket Creation Limit</h3>
              <Ban size={20} className="text-orange-400" />
            </div>
            <p className="text-gray-300 text-lg mb-24">
              You can only create one support ticket every 24 hours. This helps us manage requests efficiently and ensures quality support for all users.
            </p>
          </div>

          <div className="glass rounded-16 p-24 mb-32" style={{ border: "1px solid rgba(251, 146, 60, 0.2)" }}>
            <div className="flex flex-center gap-8 mb-16">
              <Clock size={20} className="text-orange-400" />
              <h4 className="text-lg font-semibold text-white">Time Remaining</h4>
            </div>
            <div className="text-2xl font-bold text-orange-400 mb-8">{timeRemaining}</div>
            <p className="text-sm text-gray-300">
              You can create your next ticket at{" "}
              <span className="text-orange-400 font-medium">
                {nextAllowedTime?.toLocaleString()}
              </span>
            </p>
          </div>

          <div className="glass rounded-16 p-24 mb-32" style={{ border: "1px solid rgba(59, 130, 246, 0.2)" }}>
            <div className="flex flex-center gap-8 mb-16">
              <Sparkles size={20} className="text-blue-400" />
              <h4 className="text-lg font-semibold text-white">In the meantime</h4>
              <Sparkles size={20} className="text-blue-400" />
            </div>
            <div className="text-sm text-gray-300" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div className="flex gap-12">
                <div className="w-8 h-8 rounded-full" style={{ background: "#3b82f6" }}></div>
                <span>Check your existing tickets for updates</span>
              </div>
              <div className="flex gap-12">
                <div className="w-8 h-8 rounded-full" style={{ background: "#3b82f6" }}></div>
                <span>Browse our FAQ for quick answers</span>
              </div>
              <div className="flex gap-12">
                <div className="w-8 h-8 rounded-full" style={{ background: "#3b82f6" }}></div>
                <span>Prepare details for your next ticket</span>
              </div>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="btn btn-secondary text-lg px-32 py-16"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl" style={{ margin: "0 auto" }}>
      <div className="card">
        <div className="flex flex-between mb-32">
          <div>
            <h3 className="text-2xl font-bold text-gradient mb-8">Create Support Ticket</h3>
            <p className="text-gray-400">Submit your issue and get expert assistance</p>
            <p className="text-xs text-orange-400 mt-8 flex gap-4">
              <AlertCircle size={12} />
              Note: You can only create one ticket every 24 hours
            </p>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-gray-400 p-8 rounded-8"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.color = "#ffffff"
                e.target.style.background = "rgba(255, 255, 255, 0.1)"
              }}
              onMouseOut={(e) => {
                e.target.style.color = "#9ca3af"
                e.target.style.background = "none"
              }}
            >
              <X size={24} />
            </button>
          )}
        </div>

        {error && (
          <div className="alert alert-error mb-24">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label flex flex-between">
              <span>Subject *</span>
              <span className="text-xs text-gray-500 font-normal">({getWordCount(formData.title)}/50 words)</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Brief description of your issue (max 50 words)"
              required
            />
            {getWordCount(formData.title) >= 45 && (
              <p className="text-xs text-yellow-400 mt-8 flex gap-4">
                <AlertCircle size={12} />
                Approaching word limit ({getWordCount(formData.title)}/50)
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="form-input"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Priority</label>
            <select name="priority" value={formData.priority} onChange={handleInputChange} className="form-input">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-input form-textarea"
              placeholder="Provide detailed information about your issue..."
              required
              rows={5}
            />
          </div>

          <div className="flex gap-16">
            {onCancel && (
              <button type="button" onClick={onCancel} className="btn btn-secondary flex-1" disabled={loading}>
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading || !formData.title || !formData.category || !formData.description || !canCreateTicket}
              className="btn btn-primary flex-1"
            >
              {loading ? (
                <div className="flex gap-8">
                  <div className="loading"></div>
                  Creating...
                </div>
              ) : (
                "Create Ticket"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}