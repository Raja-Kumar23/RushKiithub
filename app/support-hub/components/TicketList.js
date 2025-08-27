"use client"

import { Clock, User, Tag, AlertCircle } from "lucide-react"

export default function TicketList({ tickets, loading, onTicketSelect, userRole }) {
  if (loading) {
    return (
      <div className="ticket-list">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card">
            <div className="loading-skeleton skeleton-title"></div>
            <div className="loading-skeleton skeleton-text" style={{ width: "60%" }}></div>
            <div className="loading-skeleton skeleton-text" style={{ width: "40%" }}></div>
          </div>
        ))}
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <div className="card empty-state">
        <AlertCircle size={48} className="empty-state-icon" />
        <h3>No tickets found</h3>
        <p>
          {userRole === "student"
            ? "You haven't created any support tickets yet."
            : "No tickets to display at the moment."}
        </p>
      </div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "status-pending"
      case "assigned":
        return "status-assigned"
      case "resolved":
        return "status-resolved"
      case "closed":
        return "status-closed"
      default:
        return "status-pending"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "priority-high"
      case "medium":
        return "priority-medium"
      case "low":
        return "priority-low"
      default:
        return "text-gray-400"
    }
  }

  const formatDate = (date) => {
    if (!date) return "Unknown"

    try {
      const dateObj = date.toDate ? date.toDate() : new Date(date)
      return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      return "Invalid date"
    }
  }

  return (
    <div className="ticket-list">
      {tickets.map((ticket) => (
        <div key={ticket.id} onClick={() => onTicketSelect && onTicketSelect(ticket)} className="ticket-item">
          <div className="ticket-header">
            <div>
              <h4 className="ticket-title">{ticket.title}</h4>
              <div className="ticket-meta">
                <div className="ticket-meta-item">
                  <Clock size={14} />
                  <span>{formatDate(ticket.createdAt)}</span>
                </div>
                {userRole !== "student" && (
                  <div className="ticket-meta-item">
                    <User size={14} />
                    <span>{ticket.userEmail}</span>
                  </div>
                )}
                <div className="ticket-meta-item">
                  <Tag size={14} />
                  <span>{ticket.category}</span>
                </div>
              </div>
            </div>
            <div className="ticket-badges">
              {ticket.priority && (
                <span className={`priority-badge ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority.toUpperCase()}
                </span>
              )}
              <span className={`status-badge ${getStatusColor(ticket.status)}`}>{ticket.status}</span>
            </div>
          </div>
          <p className="ticket-description">{ticket.description}</p>
          {onTicketSelect && (
            <div className="ticket-footer">
              <a href="#" className="ticket-link">
                Click to view details →
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
