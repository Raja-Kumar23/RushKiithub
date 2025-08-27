import { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  User, 
  Clock, 
  MessageSquare, 
  UserCheck,
  AlertCircle,
  Send
} from 'lucide-react'

export default function TicketDetail({ 
  ticket, 
  onBack, 
  user, 
  onStatusChange, 
  onAssignToSubAdmin, 
  onReply,
  subAdmins = [],
  canReply = true,
  canChangeStatus = false,
  canAssign = false 
}) {
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [selectedSubAdmin, setSelectedSubAdmin] = useState('')
  const [assigning, setAssigning] = useState(false)
  const [error, setError] = useState('')

  // Get student information
  const studentName = ticket?.userInfo?.name || ticket?.userName || 'Student'
  const studentEmail = ticket?.userEmail || 'No email'
  const rollNumber = ticket?.userInfo?.rollNumber || ticket?.rollNumber || 'N/A'
  const ticketTitle = ticket?.title || 'No Title'

  // Filter sub-admins based on category
  const relevantSubAdmins = subAdmins.filter(subAdmin => {
    if (!subAdmin.categories || subAdmin.categories.length === 0) return true
    return subAdmin.categories.includes(ticket?.category)
  })

  const formatDate = (date) => {
    if (!date) return 'N/A'
    
    const dateObj = date?.toDate ? date.toDate() : new Date(date)
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(dateObj)
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return { color: '#4ade80', backgroundColor: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.3)' }
      case 'closed':
        return { color: '#9ca3af', backgroundColor: 'rgba(156, 163, 175, 0.1)', border: '1px solid rgba(156, 163, 175, 0.3)' }
      case 'assigned':
        return { color: '#60a5fa', backgroundColor: 'rgba(96, 165, 250, 0.1)', border: '1px solid rgba(96, 165, 250, 0.3)' }
      case 'in_progress':
        return { color: '#fbbf24', backgroundColor: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)' }
      default:
        return { color: '#fb923c', backgroundColor: 'rgba(251, 146, 60, 0.1)', border: '1px solid rgba(251, 146, 60, 0.3)' }
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return { color: '#f87171', backgroundColor: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.3)' }
      case 'medium':
        return { color: '#fbbf24', backgroundColor: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)' }
      case 'low':
        return { color: '#4ade80', backgroundColor: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.3)' }
      default:
        return { color: '#9ca3af', backgroundColor: 'rgba(156, 163, 175, 0.1)', border: '1px solid rgba(156, 163, 175, 0.3)' }
    }
  }

  const handleReply = async (e) => {
    e.preventDefault()
    
    if (!reply.trim()) {
      setError('Please enter a reply message')
      return
    }


    setSending(true)
    setError('')

    try {
      const replyData = {
        message: reply.trim(),
        author: {
          name: user?.displayName || user?.name || user?.email || 'Admin',
          email: user?.email || 'admin@example.com',
          role: user?.role || 'admin'
        },
        timestamp: new Date()
      }

      await onReply(ticket.id, replyData)
      setReply('')
    } catch (error) {
      console.error('Error sending reply:', error)
      setError('Failed to send reply. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const handleStatusChange = async (newStatus) => {

    try {
      await onStatusChange(ticket.id, newStatus)
      setError('')
    } catch (error) {
      console.error('Error updating status:', error)
      setError('Failed to update ticket status. Please try again.')
    }
  }

  const handleAssignToSubAdmin = async () => {
    if (!selectedSubAdmin) {
      setError('Please select a sub-admin')
      return
    }


    setAssigning(true)
    setError('')

    try {
      await onAssignToSubAdmin(ticket.id, selectedSubAdmin)
      setSelectedSubAdmin('')
    } catch (error) {
      console.error('Error assigning ticket:', error)
      setError('Failed to assign ticket. Please try again.')
    } finally {
      setAssigning(false)
    }
  }

  const handleBack = () => {
    if (typeof onBack === 'function') {
      onBack()
    } else {
      console.warn('Back function not available')
    }
  }


  return (
    <div className="ticket-container">
      <div className="header">
        <button onClick={handleBack} className="btn btn-secondary flex" style={{ gap: "8px", alignItems: "center" }}>
          <ArrowLeft size={16} />
          Back to Tickets
        </button>
        <div>
          <h1 className="title">{ticketTitle}</h1>
          <p className="ticket-id">ID: {ticket?.id}</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: "24px" }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="layout">
        {/* Main Content */}
        <div className="main">
          {/* Ticket Info */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">{ticketTitle}</h2>
              <div className="status-priority">
                <span 
                  className="status" 
                  style={{
                    ...getStatusColor(ticket?.status),
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "0.75rem",
                    fontWeight: "500",
                    textTransform: "capitalize"
                  }}
                >
                  {ticket?.status || 'pending'}
                </span>
                <span 
                  className="priority" 
                  style={{
                    ...getPriorityColor(ticket?.priority),
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "0.75rem",
                    fontWeight: "500",
                    textTransform: "capitalize"
                  }}
                >
                  {ticket?.priority || 'medium'} priority
                </span>
              </div>
            </div>

            <div className="ticket-meta">
              <div className="meta-item flex" style={{ gap: "8px", alignItems: "center" }}>
                <User size={16} />
                <span>{studentName}</span>
              </div>
              <div className="meta-item flex" style={{ gap: "8px", alignItems: "center" }}>
                <Clock size={16} />
                <span>{formatDate(ticket?.createdAt)}</span>
              </div>
            </div>

            <div className="description-box">
              <h3>Description</h3>
              <p>{ticket?.description || 'No description provided'}</p>
            </div>

            {ticket?.assignedTo && (
              <div className="assigned-box flex" style={{ gap: "8px", alignItems: "center" }}>
                <UserCheck size={16} />
                <span>
                  Assigned to: {subAdmins?.find(sa => sa.email === ticket?.assignedTo)?.name || ticket?.assignedTo}
                </span>
              </div>
            )}
          </div>

          {/* Replies */}
          <div className="card">
            <h3 className="section-title flex" style={{ gap: "8px", alignItems: "center" }}>
              <MessageSquare size={18} /> Replies ({ticket?.replies?.length || 0})
            </h3>

            <div className="replies">
              {ticket?.replies && ticket.replies.length > 0 ? (
                ticket?.replies.map((reply, index) => (
                  <div key={index} className="reply">
                    <div className="reply-header">
                      <div className="reply-author flex" style={{ gap: "12px", alignItems: "center" }}>
                        <div className="avatar">
                          {reply.author?.name?.charAt(0) || reply.author?.email?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <p className="author-name">{reply.author?.name || reply.author?.email || 'Admin'}</p>
                          <p className="author-role">{reply.author?.role || 'admin'}</p>
                        </div>
                      </div>
                      <span className="reply-date">{formatDate(reply.timestamp)}</span>
                    </div>
                    <p className="reply-message">{reply.message}</p>
                  </div>
                ))
              ) : (
                <p className="no-replies">No replies yet</p>
              )}
            </div>

            {/* Reply Form */}
            {canReply && (
              <form onSubmit={handleReply} className="reply-form">
                <div className="form-group">
                  <label className="form-label">Add Reply</label>
                  <textarea
                    className="form-input form-textarea"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your reply..."
                    rows={4}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={sending || !reply.trim()}
                >
                  {sending ? (
                    <div className="flex" style={{ gap: "8px", alignItems: "center", justifyContent: "center" }}>
                      <div className="loading"></div>
                      Sending...
                    </div>
                  ) : (
                    <div className="flex" style={{ gap: "8px", alignItems: "center", justifyContent: "center" }}>
                      <Send size={16} />
                      Send Reply
                    </div>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          {/* Status Actions */}
          {canChangeStatus && (
            <div className="card">
              <h3 className="section-title">Status Actions</h3>
              <div className="actions" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {ticket?.status !== "resolved" && (
                  <button onClick={() => handleStatusChange("resolved")} className="btn btn-primary">
                    Mark as Resolved
                  </button>
                )}
                {ticket?.status !== "closed" && (
                  <button onClick={() => handleStatusChange("closed")} className="btn btn-secondary">
                    Close Ticket
                  </button>
                )}
                {ticket?.status === "closed" && (
                  <button onClick={() => handleStatusChange("assigned")} className="btn btn-secondary">
                    Reopen Ticket
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Assignment */}
          {canAssign && ticket?.status !== "closed" && (
            <div className="card">
              <h3 className="section-title">Assign to Sub-Admin</h3>
              <div className="assign-box">
                <div className="form-group">
                  <label className="form-label">Select Sub-Admin</label>
                  <select
                    className="form-input"
                    value={selectedSubAdmin}
                    onChange={(e) => setSelectedSubAdmin(e.target.value)}
                  >
                    <option value="">Choose sub-admin...</option>
                    {relevantSubAdmins.map((subAdmin) => (
                      <option key={subAdmin.email} value={subAdmin.email}>
                        {subAdmin.name} ({subAdmin.rollNumber})
                      </option>
                    ))}
                  </select>
                </div>
                <button 
                  onClick={handleAssignToSubAdmin} 
                  disabled={!selectedSubAdmin || assigning} 
                  className="btn btn-primary"
                  style={{ width: "100%" }}
                >
                  {assigning ? (
                    <div className="flex" style={{ gap: "8px", alignItems: "center", justifyContent: "center" }}>
                      <div className="loading"></div>
                      Assigning...
                    </div>
                  ) : (
                    "Assign Ticket"
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Ticket Information */}
          <div className="card">
            <h3 className="section-title">Ticket Information</h3>
            <div className="ticket-info" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <p><strong>Category:</strong> {ticket?.category || 'Not specified'}</p>
              <p><strong>Email:</strong> {studentEmail}</p>
              <p><strong>Name:</strong> {studentName}</p>
              <p><strong>Roll No:</strong> {rollNumber}</p>
              <p><strong>Priority:</strong> {(ticket?.priority || 'medium').toUpperCase()}</p>
              <p><strong>Status:</strong> {(ticket?.status || 'pending').toUpperCase()}</p>
              <p><strong>Created:</strong> {formatDate(ticket?.createdAt)}</p>
              {ticket?.updatedAt && <p><strong>Last Updated:</strong> {formatDate(ticket?.updatedAt)}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}