"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, User, MessageSquare, Send, UserCheck, CheckCircle, XCircle, Edit3 } from "lucide-react"
import { updateTicketStatus, assignTicketToSubAdmin, addReplyToTicket } from "@/lib/tickets"

export default function TicketDetail({ ticket, onBack, userRole, currentUser, subAdmins }) {
  const [reply, setReply] = useState("")
  const [sending, setSending] = useState(false)
  const [assigning, setAssigning] = useState(false)
  const [selectedSubAdmin, setSelectedSubAdmin] = useState("")

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
        return "priority-medium"
    }
  }

  const formatDate = (date) => {
    if (!date) return "Not available"
    
    try {
      // Handle Firestore timestamp or regular date
      const dateObj = date.toDate ? date.toDate() : new Date(date)
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    } catch (error) {
      console.error('Error formatting date:', error)
      return "Invalid date"
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTicketStatus(ticket.id, newStatus)
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Failed to update ticket status")
    }
  }

  const handleAssignToSubAdmin = async () => {
    if (!selectedSubAdmin) return

    setAssigning(true)
    try {
      await assignTicketToSubAdmin(ticket.id, selectedSubAdmin)
      setSelectedSubAdmin("")
      alert("Ticket assigned successfully!")
    } catch (error) {
      console.error("Error assigning ticket:", error)
      alert("Failed to assign ticket")
    } finally {
      setAssigning(false)
    }
  }

  const handleReply = async (e) => {
    e.preventDefault()
    if (!reply.trim()) return

    setSending(true)
    try {
      const replyData = {
        message: reply.trim(),
        author: {
          name: currentUser.displayName || currentUser.email.split('@')[0],
          email: currentUser.email,
          role: userRole
        },
        timestamp: new Date().toISOString(),
      }

      await addReplyToTicket(ticket.id, replyData)
      setReply("")
    } catch (error) {
      console.error("Error sending reply:", error)
      alert("Failed to send reply")
    } finally {
      setSending(false)
    }
  }

  const canReply = userRole === "admin" || userRole === "sub-admin"
  const canAssign = userRole === "admin"
  const canChangeStatus = userRole === "admin" || userRole === "sub-admin"

  // Filter sub-admins by category for this ticket
  const relevantSubAdmins = subAdmins?.filter(sa => 
    sa.categories && sa.categories.includes(ticket.category)
  ) || []

  // Get ticket title (handle both 'title' and 'subject' properties)
  const ticketTitle = ticket.title || ticket.subject || 'Untitled Ticket'
  
  // Get user information (handle different property names)
  const studentEmail = ticket.userEmail || ticket.studentEmail || 'Not provided'
  const studentName = ticket.studentName || ticket.userName || studentEmail.split('@')[0]
  const rollNumber = ticket.rollNumber || ticket.userId || 'Not provided'

//   return (
//     <div className="max-w-4xl mx-auto">
//       <div className="flex items-center gap-4 mb-6">
//         <button onClick={onBack} className="btn-secondary">
//           <ArrowLeft size={16} />
//           Back to Tickets
//         </button>
//         <div>
//           <h1 className="text-2xl font-bold text-white">Ticket Details</h1>
//           <p className="text-gray-400">ID: {ticket.id}</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Main Content */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Ticket Info */}
//           <div className="card">
//             <div className="flex items-start justify-between mb-4">
//               <h2 className="text-xl font-semibold text-white">{ticketTitle}</h2>
//               <div className="flex items-center gap-2">
//                 <span className={`status-badge ${getStatusColor(ticket.status)}`}>
//                   {ticket.status}
//                 </span>
//                 <span className={`priority-badge ${getPriorityColor(ticket.priority)}`}>
//                   {ticket.priority} priority
//                 </span>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mb-4">
//               <div className="flex items-center gap-2">
//                 <User size={16} />
//                 <span>{studentName}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Clock size={16} />
//                 <span>{formatDate(ticket.createdAt)}</span>
//               </div>
//             </div>

//             <div className="bg-gray-800 rounded-lg p-4">
//               <h3 className="font-semibold text-white mb-2">Description</h3>
//               <p className="text-gray-300 leading-relaxed">{ticket.description || 'No description provided'}</p>
//             </div>

//             {ticket.assignedTo && (
//               <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
//                 <div className="flex items-center gap-2 text-blue-400">
//                   <UserCheck size={16} />
//                   <span className="font-medium">
//                     Assigned to: {subAdmins?.find(sa => sa.email === ticket.assignedTo)?.name || ticket.assignedTo}
//                   </span>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Replies */}
//           <div className="card">
//             <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//               <MessageSquare size={18} />
//               Replies ({ticket.replies?.length || 0})
//             </h3>

//             <div className="space-y-4">
//               {ticket.replies && ticket.replies.length > 0 ? (
//                 ticket.replies.map((reply, index) => (
//                   <div key={index} className="bg-gray-800 rounded-lg p-4">
//                     <div className="flex items-center justify-between mb-2">
//                       <div className="flex items-center gap-2">
//                         <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
//                           {reply.author?.name?.charAt(0) || reply.author?.email?.charAt(0) || 'A'}
//                         </div>
//                         <div>
//                           <p className="font-medium text-white">
//                             {reply.author?.name || reply.author?.email || 'Admin'}
//                           </p>
//                           <p className="text-xs text-gray-400 capitalize">
//                             {reply.author?.role || 'admin'}
//                           </p>
//                         </div>
//                       </div>
//                       <span className="text-xs text-gray-400">
//                         {formatDate(reply.timestamp)}
//                       </span>
//                     </div>
//                     <p className="text-gray-300">{reply.message}</p>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-400 text-center py-4">No replies yet</p>
//               )}
//             </div>

//             {/* Reply Form */}
//             {canReply && (
//               <form onSubmit={handleReply} className="mt-6">
//                 <div className="form-group">
//                   <label className="form-label">Add Reply</label>
//                   <textarea
//                     value={reply}
//                     onChange={(e) => setReply(e.target.value)}
//                     className="form-input form-textarea"
//                     placeholder="Type your reply..."
//                     rows={4}
//                     required
//                   />
//                 </div>
//                 <button 
//                   type="submit" 
//                   className="btn-primary"
//                   disabled={sending || !reply.trim()}
//                 >
//                   {sending ? (
//                     <>
//                       <div className="loading" />
//                       Sending...
//                     </>
//                   ) : (
//                     <>
//                       <Send size={16} />
//                       Send Reply
//                     </>
//                   )}
//                 </button>
//               </form>
//             )}
//           </div>
//         </div>

//         {/* Sidebar */}
//         <div className="space-y-6">
//           {/* Status Actions */}
//           {canChangeStatus && (
//             <div className="card">
//               <h3 className="font-semibold text-white mb-4">Status Actions</h3>
//               <div className="space-y-2">
//                 {ticket.status !== "resolved" && (
//                   <button
//                     onClick={() => handleStatusChange("resolved")}
//                     className="w-full btn-primary"
//                   >
//                     <CheckCircle size={16} />
//                     Mark as Resolved
//                   </button>
//                 )}
//                 {ticket.status !== "closed" && (
//                   <button
//                     onClick={() => handleStatusChange("closed")}
//                     className="w-full btn-secondary"
//                   >
//                     <XCircle size={16} />
//                     Close Ticket
//                   </button>
//                 )}
//                 {ticket.status === "closed" && (
//                   <button
//                     onClick={() => handleStatusChange("assigned")}
//                     className="w-full btn-secondary"
//                   >
//                     <Edit3 size={16} />
//                     Reopen Ticket
//                   </button>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Assignment */}
//           {canAssign && ticket.status !== "closed" && (
//             <div className="card">
//               <h3 className="font-semibold text-white mb-4">Assign to Sub-Admin</h3>
//               <div className="space-y-3">
//                 <div className="form-group">
//                   <label className="form-label">Select Sub-Admin</label>
//                   <select
//                     value={selectedSubAdmin}
//                     onChange={(e) => setSelectedSubAdmin(e.target.value)}
//                     className="form-input"
//                   >
//                     <option value="">Choose sub-admin...</option>
//                     {relevantSubAdmins.map((subAdmin) => (
//                       <option key={subAdmin.email} value={subAdmin.email}>
//                         {subAdmin.name} ({subAdmin.rollNumber})
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <button
//                   onClick={handleAssignToSubAdmin}
//                   disabled={!selectedSubAdmin || assigning}
//                   className="w-full btn-primary"
//                 >
//                   {assigning ? (
//                     <>
//                       <div className="loading" />
//                       Assigning...
//                     </>
//                   ) : (
//                     <>
//                       <UserCheck size={16} />
//                       Assign Ticket
//                     </>
//                   )}
//                 </button>
//               </div>

//               {relevantSubAdmins.length === 0 && (
//                 <p className="text-yellow-400 text-sm mt-2">
//                   No sub-admins available for {ticket.category} category
//                 </p>
//               )}
//             </div>
//           )}

//           {/* Ticket Information */}
//           <div className="card">
//             <h3 className="font-semibold text-white mb-4">Ticket Information</h3>
//             <div className="space-y-4 text-sm">
//               <div className="border-b border-gray-700 pb-3">
//                 <span className="text-gray-400 block mb-1">Category:</span>
//                 <p className="text-white font-medium">{ticket.category || 'Not specified'}</p>
//               </div>
              
//               <div className="border-b border-gray-700 pb-3">
//                 <span className="text-gray-400 block mb-1">Student Email:</span>
//                 <p className="text-white break-all">{studentEmail}</p>
//               </div>
              
//               <div className="border-b border-gray-700 pb-3">
//                 <span className="text-gray-400 block mb-1">Student Name:</span>
//                 <p className="text-white">{studentName}</p>
//               </div>
              
//               <div className="border-b border-gray-700 pb-3">
//                 <span className="text-gray-400 block mb-1">Roll Number/ID:</span>
//                 <p className="text-white">{rollNumber}</p>
//               </div>
              
//               <div className="border-b border-gray-700 pb-3">
//                 <span className="text-gray-400 block mb-1">Priority:</span>
//                 <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
//                   {(ticket.priority || 'medium').toUpperCase()}
//                 </span>
//               </div>
              
//               <div className="border-b border-gray-700 pb-3">
//                 <span className="text-gray-400 block mb-1">Status:</span>
//                 <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(ticket.status)}`}>
//                   {(ticket.status || 'pending').toUpperCase()}
//                 </span>
//               </div>
              
//               <div className="border-b border-gray-700 pb-3">
//                 <span className="text-gray-400 block mb-1">Created:</span>
//                 <p className="text-white">{formatDate(ticket.createdAt)}</p>
//               </div>
              
//               {ticket.updatedAt && (
//                 <div className="pb-3">
//                   <span className="text-gray-400 block mb-1">Last Updated:</span>
//                   <p className="text-white">{formatDate(ticket.updatedAt)}</p>
//                 </div>
//               )}
              
//               {ticket.assignedTo && (
//                 <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3">
//                   <span className="text-blue-400 block mb-1">Assigned To:</span>
//                   <p className="text-white font-medium">
//                     {subAdmins?.find(sa => sa.email === ticket.assignedTo)?.name || ticket.assignedTo}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

return (
  <div className="ticket-container">
    <div className="header">
      <button onClick={onBack} className="btn-secondary">
        <ArrowLeft size={16} />
        Back to Tickets
      </button>
      <div>
        <h1 className="title">Ticket Details</h1>
        <p className="ticket-id">ID: {ticket.id}</p>
      </div>
    </div>

    <div className="layout">
      {/* Main Content */}
      <div className="main">
        {/* Ticket Info */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">{ticketTitle}</h2>
            <div className="status-priority">
              <span className={`status ${getStatusColor(ticket.status)}`}>
                {ticket.status}
              </span>
              <span className={`priority ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority} priority
              </span>
            </div>
          </div>

          <div className="ticket-meta">
            <div className="meta-item">
              <User size={16} />
              <span>{studentName}</span>
            </div>
            <div className="meta-item">
              <Clock size={16} />
              <span>{formatDate(ticket.createdAt)}</span>
            </div>
          </div>

          <div className="description-box">
            <h3>Description</h3>
            <p>{ticket.description || 'No description provided'}</p>
          </div>

          {ticket.assignedTo && (
            <div className="assigned-box">
              <UserCheck size={16} />
              <span>
                Assigned to: {subAdmins?.find(sa => sa.email === ticket.assignedTo)?.name || ticket.assignedTo}
              </span>
            </div>
          )}
        </div>

        {/* Replies */}
        <div className="card">
          <h3 className="section-title">
            <MessageSquare size={18} /> Replies ({ticket.replies?.length || 0})
          </h3>

          <div className="replies">
            {ticket.replies && ticket.replies.length > 0 ? (
              ticket.replies.map((reply, index) => (
                <div key={index} className="reply">
                  <div className="reply-header">
                    <div className="reply-author">
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
              <label>Add Reply</label>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply..."
                rows={4}
                required
              />
              <button 
                type="submit" 
                className="btn-primary"
                disabled={sending || !reply.trim()}
              >
                {sending ? "Sending..." : "Send Reply"}
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
            <div className="actions">
              {ticket.status !== "resolved" && (
                <button onClick={() => handleStatusChange("resolved")} className="btn-primary">
                  Mark as Resolved
                </button>
              )}
              {ticket.status !== "closed" && (
                <button onClick={() => handleStatusChange("closed")} className="btn-secondary">
                  Close Ticket
                </button>
              )}
              {ticket.status === "closed" && (
                <button onClick={() => handleStatusChange("assigned")} className="btn-secondary">
                  Reopen Ticket
                </button>
              )}
            </div>
          </div>
        )}

        {/* Assignment */}
        {canAssign && ticket.status !== "closed" && (
          <div className="card">
            <h3 className="section-title">Assign to Sub-Admin</h3>
            <div className="assign-box">
              <label>Select Sub-Admin</label>
              <select
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
              <button onClick={handleAssignToSubAdmin} disabled={!selectedSubAdmin || assigning} className="btn-primary">
                {assigning ? "Assigning..." : "Assign Ticket"}
              </button>
            </div>
          </div>
        )}

        {/* Ticket Information */}
        <div className="card">
          <h3 className="section-title">Ticket Information</h3>
          <div className="ticket-info">
            <p><strong>Category:</strong> {ticket.category || 'Not specified'}</p>
            <p><strong>Email:</strong> {studentEmail}</p>
            <p><strong>Name:</strong> {studentName}</p>
            <p><strong>Roll No:</strong> {rollNumber}</p>
            <p><strong>Priority:</strong> {(ticket.priority || 'medium').toUpperCase()}</p>
            <p><strong>Status:</strong> {(ticket.status || 'pending').toUpperCase()}</p>
            <p><strong>Created:</strong> {formatDate(ticket.createdAt)}</p>
            {ticket.updatedAt && <p><strong>Last Updated:</strong> {formatDate(ticket.updatedAt)}</p>}
          </div>
        </div>
      </div>
    </div>
  </div>
)
}