"use client"

import { Home, Plus, Ticket, Users, Settings, BarChart3, Zap, Star, Shield, X, Menu } from "lucide-react"

export default function Navigation({ 
  userRole, 
  activeTab, 
  setActiveTab, 
  ticketCount = 0, 
  isOpen, 
  onToggle 
}) {
  const menuItems = {
    student: [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "create", label: "Create Ticket", icon: Plus },
      { id: "tickets", label: "My Tickets", icon: Ticket, count: ticketCount },
    ],
    admin: [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "tickets", label: "All Tickets", icon: Ticket, count: ticketCount },
      { id: "admins", label: "Sub-Admins", icon: Users },
      { id: "analytics", label: "Analytics", icon: BarChart3 },
      { id: "settings", label: "Settings", icon: Settings },
    ],
    "sub-admin": [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "tickets", label: "Assigned Tickets", icon: Ticket, count: ticketCount },
      { id: "analytics", label: "Analytics", icon: BarChart3 },
    ],
  }

  const items = menuItems[userRole] || []

  const getRoleIcon = () => {
    switch (userRole) {
      case "admin":
        return <Shield size={16} />
      case "sub-admin":
        return <Star size={16} />
      default:
        return <Zap size={16} />
    }
  }

  const getRoleLabel = () => {
    switch (userRole) {
      case "admin":
        return "Administrator"
      case "sub-admin":
        return "Sub-Administrator"
      default:
        return "Student"
    }
  }

  const handleItemClick = (itemId) => {
    setActiveTab(itemId)
    // Close mobile menu after selection
    if (window.innerWidth <= 768) {
      onToggle()
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="mobile-overlay" onClick={onToggle}></div>
      )}

      {/* Navigation Sidebar */}
      <nav className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Mobile Close Button */}
        <button className="mobile-close" onClick={onToggle}>
          <X size={20} />
        </button>

        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">
              <Zap size={16} />
            </div>
            <div className="sidebar-brand-text">SupportHub</div>
          </div>
          <div className="sidebar-role">
            {getRoleIcon()}
            <span>{getRoleLabel()}</span>
          </div>
        </div>

        <div className="nav-section">
          <div className="nav-section-title">Navigation</div>
          {items.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                <div className="nav-item-icon">
                  <Icon size={18} />
                </div>
                <span>{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <div className="nav-item-badge">{item.count}</div>
                )}
              </button>
            )
          })}
        </div>

        <div className="categories">
          <div className="categories-title">Categories</div>
          <div className="category-item">
            <div className="category-dot category-dot-1"></div>
            <span className="category-label">Mental & Emotional</span>
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
      </nav>
    </>
  )
}