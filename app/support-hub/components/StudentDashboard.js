"use client"

import { useState } from "react"
import CreateTicket from "./CreateTicket"
import TicketList from "./TicketList"
import { Ticket, Plus, Clock, Award, Zap, Star } from "lucide-react"

export default function StudentDashboard({ tickets, loading, activeTab, onTicketSelect, user }) {
  const [showCreateTicket, setShowCreateTicket] = useState(false)

  const stats = {
    total: tickets.length,
    pending: tickets.filter((t) => t.status === "pending").length,
    assigned: tickets.filter((t) => t.status === "assigned").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
  }

  const userName = user.displayName || user.email.split("@")[0]

  if (activeTab === "create") {
    return (
      <div>
        <div className="mb-32">
          <h2 className="text-3xl font-bold text-gradient mb-8">Create New Ticket</h2>
          <p className="text-gray-400 text-lg">Submit a support request and get expert assistance</p>
        </div>
        <CreateTicket user={user} onSuccess={() => setShowCreateTicket(false)} />
      </div>
    )
  }

  if (activeTab === "tickets") {
    return (
      <div>
        <div className="mb-32">
          <h2 className="text-3xl font-bold text-gradient mb-8">My Tickets</h2>
          <p className="text-gray-400 text-lg">Track and manage your support requests</p>
        </div>
        <TicketList tickets={tickets} loading={loading} onTicketSelect={onTicketSelect} userRole="student" />
      </div>
    )
  }

  return (
    <div>
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h2 className="welcome-title">Welcome back, {userName}! 👋</h2>
          <p className="welcome-subtitle">Here's your support dashboard overview</p>
          <div className="welcome-badges">
            <div className="welcome-badge">
              <Zap size={14} />
              <span>Active User</span>
            </div>
            <div className="welcome-badge">
              <Star size={14} />
              <span>Verified Student</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-card-content">
            <div className="stat-card-info">
              <h3>Total Tickets</h3>
              <p>{stats.total}</p>
            </div>
            <div className="stat-card-icon">
              <Ticket size={24} />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-card-info">
              <h3>Pending Review</h3>
              <p className="text-yellow-400">{stats.pending}</p>
            </div>
            <div className="stat-card-icon" style={{ background: "rgba(245, 158, 11, 0.2)" }}>
              <Clock size={24} className="text-yellow-400" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-card-info">
              <h3>In Progress</h3>
              <p className="text-blue-400">{stats.assigned}</p>
            </div>
            <div className="stat-card-icon" style={{ background: "rgba(59, 130, 246, 0.2)" }}>
              <Clock size={24} className="text-blue-400" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-card-info">
              <h3>Resolved</h3>
              <p className="text-green-400">{stats.resolved}</p>
            </div>
            <div className="stat-card-icon" style={{ background: "rgba(34, 197, 94, 0.2)" }}>
              <Award size={24} className="text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-grid">
        <div className="content-main">
          <div className="card">
            <div className="section-header">
              <h3 className="section-title">Recent Tickets</h3>
              <button onClick={() => setShowCreateTicket(true)} className="btn btn-primary">
                <Plus size={16} />
                New Ticket
              </button>
            </div>
            <TicketList
              tickets={tickets.slice(0, 5)}
              loading={loading}
              onTicketSelect={onTicketSelect}
              userRole="student"
            />
          </div>
        </div>

        <div className="content-sidebar">
          <div className="card mb-24">
            <h3 className="section-title mb-20">Quick Actions</h3>
            <div className="flex flex-direction: column; gap: 12px;">
              <button onClick={() => setShowCreateTicket(true)} className="btn btn-primary w-full">
                <Plus size={16} />
                Create New Ticket
              </button>
              <button className="btn btn-secondary w-full">
                <Ticket size={16} />
                View All Tickets
              </button>
            </div>
          </div>

          <div className="card">
            <h3 className="section-title mb-20">Support Categories</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div className="category-item">
                <div className="category-dot category-dot-1"></div>
                <span className="category-label">Mental & Emotional Support</span>
              </div>
              <div className="category-item">
                <div className="category-dot category-dot-2"></div>
                <span className="category-label">Academic Guidance</span>
              </div>
              <div className="category-item">
                <div className="category-dot category-dot-3"></div>
                <span className="category-label">General Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreateTicket && (
        <div className="modal-overlay">
          <div className="modal-content">
            <CreateTicket
              user={user}
              onSuccess={() => setShowCreateTicket(false)}
              onCancel={() => setShowCreateTicket(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
