"use client"

import { useState, useEffect } from "react"
import { getAllTickets, getTicketsByUser, getTicketsByCategory } from "@/lib/tickets"
import { subAdmins } from "@/data/sub-admins"
import Navigation from "./Navigation"
import StudentDashboard from "./StudentDashboard"
import AdminDashboard from "./AdminDashboard"
import SubAdminDashboard from "./SubAdminDashboard"
import TicketDetail from "./TicketDetail"
import { User, Zap, Menu } from "lucide-react"

export default function Dashboard({ user, userRole }) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    let unsubscribe

    const handleTicketData = (snapshot) => {
      try {
        let ticketData = []
        if (snapshot && snapshot.docs) {
          ticketData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        }
        setTickets(ticketData)
        setLoading(false)
      } catch (error) {
        console.error("Error processing ticket data:", error)
        setLoading(false)
      }
    }

    try {
      if (userRole === "admin") {
        unsubscribe = getAllTickets(handleTicketData)
      } else if (userRole === "sub-admin") {
        const subAdmin = subAdmins.find((sa) => sa.email === user.email)
        if (subAdmin && subAdmin.categories) {
          unsubscribe = getTicketsByCategory(subAdmin.categories, handleTicketData)
        } else {
          setLoading(false)
        }
      } else {
        unsubscribe = getTicketsByUser(user.uid, handleTicketData)
      }
    } catch (error) {
      console.error("Error setting up ticket listener:", error)
      setLoading(false)
    }

    return () => {
      if (unsubscribe && typeof unsubscribe === "function") {
        unsubscribe()
      }
    }
  }, [user, userRole])

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const currentSubAdmin = subAdmins.find((sa) => sa.email === user.email)
  const userName = user.displayName || currentSubAdmin?.name || user.email.split("@")[0]

  if (!mounted) {
    return (
      <div className="min-h-screen flex-center">
        <div className="loading"></div>
      </div>
    )
  }

  return (
    <div className="dashboard-layout">
      <Navigation 
        userRole={userRole} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        ticketCount={tickets.length}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />

      <div className="main-content">
        <header className="header">
          <div className="header-content">
            <div className="header-left">
              {/* Mobile Menu Button */}
              <button className="mobile-menu-btn" onClick={toggleSidebar}>
                <Menu size={20} />
              </button>
              
              <div className="header-brand">
                <div className="header-brand-icon">
                  <Zap size={20} />
                </div>
                <div className="header-brand-info">
                  <h1>SupportHub</h1>
                  <div className="header-brand-role">
                    <span>{userRole.toUpperCase()}</span>
                    <div className="role-indicator"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="header-right">
              <div className="user-profile">
                <div className="user-avatar">
                  {user.photoURL ? (
                    <img src={user.photoURL || "/placeholder.svg"} alt={userName} />
                  ) : (
                    <div className="user-avatar-fallback">
                      <User size={16} />
                    </div>
                  )}
                  <div className="user-status"></div>
                </div>
                <div className="user-info">
                  <div className="user-name">{userName}</div>
                  <div className="user-email">{user.email}</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container">
          {selectedTicket ? (
            <TicketDetail
              ticket={selectedTicket}
              onBack={() => setSelectedTicket(null)}
              userRole={userRole}
              currentUser={user}
              subAdmins={subAdmins}
            />
          ) : (
            <>
              {userRole === "student" && (
                <StudentDashboard
                  tickets={tickets}
                  loading={loading}
                  activeTab={activeTab}
                  onTicketSelect={setSelectedTicket}
                  user={user}
                />
              )}
              {userRole === "admin" && (
                <AdminDashboard
                  tickets={tickets}
                  loading={loading}
                  activeTab={activeTab}
                  onTicketSelect={setSelectedTicket}
                  subAdmins={subAdmins}
                />
              )}
              {userRole === "sub-admin" && (
                <SubAdminDashboard
                  tickets={tickets}
                  loading={loading}
                  activeTab={activeTab}
                  onTicketSelect={setSelectedTicket}
                  subAdmin={currentSubAdmin}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}