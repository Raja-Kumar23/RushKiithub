import { db } from "./firebase"
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore"

export const createTicket = async (ticketData) => {
  try {
    console.log("Creating ticket with data:", ticketData)

    // Validate required fields
    if (!ticketData.title || !ticketData.description || !ticketData.category) {
      throw new Error("Missing required fields: title, description, or category")
    }

    if (!ticketData.userId || !ticketData.userEmail) {
      throw new Error("Missing user information")
    }

    const docRef = await addDoc(collection(db, "tickets"), {
      ...ticketData,
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      assignedTo: null,
      replies: [],
    })

    console.log("Ticket created successfully with ID:", docRef.id)
    return docRef.id
  } catch (error) {
    console.error("Error in createTicket function:", error)
    throw error
  }
}

// Fixed query for user tickets - no ordering to avoid index requirement
export const getTicketsByUser = (userId, callback) => {
  try {
    const q = query(collection(db, "tickets"), where("userId", "==", userId))

    return onSnapshot(
      q,
      (snapshot) => {
        try {
          const tickets = snapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .sort((a, b) => {
              // Client-side sorting by createdAt
              const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt || 0)
              const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt || 0)
              return bTime - aTime
            })

          callback({ docs: tickets.map((ticket) => ({ id: ticket.id, data: () => ticket })) })
        } catch (error) {
          console.error("Error processing user tickets:", error)
          callback({ docs: [] })
        }
      },
      (error) => {
        console.error("Error fetching user tickets:", error)
        callback({ docs: [] })
      },
    )
  } catch (error) {
    console.error("Error setting up user tickets listener:", error)
    return () => {} // Return empty unsubscribe function
  }
}

// Fixed query for category tickets - simplified for sub-admins
export const getTicketsByCategory = (categories, callback) => {
  try {
    console.log("Setting up category listener for:", categories)

    // Simple query without ordering
    const q = query(collection(db, "tickets"), where("category", "in", categories))

    return onSnapshot(
      q,
      (snapshot) => {
        try {
          console.log("Received category tickets snapshot:", snapshot.docs.length)

          const tickets = snapshot.docs
            .map((doc) => {
              const data = doc.data()
              console.log("Ticket data:", { id: doc.id, category: data.category, status: data.status })
              return {
                id: doc.id,
                ...data,
              }
            })
            .sort((a, b) => {
              // Client-side sorting by createdAt
              const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt || 0)
              const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt || 0)
              return bTime - aTime
            })

          console.log("Processed tickets for categories:", tickets.length)
          callback({ docs: tickets.map((ticket) => ({ id: ticket.id, data: () => ticket })) })
        } catch (error) {
          console.error("Error processing category tickets:", error)
          callback({ docs: [] })
        }
      },
      (error) => {
        console.error("Error fetching category tickets:", error)
        callback({ docs: [] })
      },
    )
  } catch (error) {
    console.error("Error setting up category tickets listener:", error)
    return () => {} // Return empty unsubscribe function
  }
}

// Fixed query for all tickets - no ordering
export const getAllTickets = (callback) => {
  try {
    const q = query(collection(db, "tickets"))

    return onSnapshot(
      q,
      (snapshot) => {
        try {
          const tickets = snapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .sort((a, b) => {
              // Client-side sorting by createdAt
              const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt || 0)
              const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt || 0)
              return bTime - aTime
            })

          callback({ docs: tickets.map((ticket) => ({ id: ticket.id, data: () => ticket })) })
        } catch (error) {
          console.error("Error processing all tickets:", error)
          callback({ docs: [] })
        }
      },
      (error) => {
        console.error("Error fetching all tickets:", error)
        callback({ docs: [] })
      },
    )
  } catch (error) {
    console.error("Error setting up all tickets listener:", error)
    return () => {} // Return empty unsubscribe function
  }
}

export const assignTicket = async (ticketId, subAdminId) => {
  try {
    console.log("Assigning ticket:", ticketId, "to sub-admin:", subAdminId)

    const ticketRef = doc(db, "tickets", ticketId)
    await updateDoc(ticketRef, {
      assignedTo: subAdminId,
      status: "assigned",
      updatedAt: serverTimestamp(),
    })

    console.log("Ticket assigned successfully")
  } catch (error) {
    console.error("Error assigning ticket:", error)
    throw error
  }
}

export const addReply = async (ticketId, reply) => {
  try {
    const ticketRef = doc(db, "tickets", ticketId)
    const ticketDoc = await getDoc(ticketRef)

    if (ticketDoc.exists()) {
      const currentReplies = ticketDoc.data().replies || []
      await updateDoc(ticketRef, {
        replies: [
          ...currentReplies,
          {
            ...reply,
            timestamp: serverTimestamp(),
            id: Date.now().toString(),
          },
        ],
        updatedAt: serverTimestamp(),
      })
    }
  } catch (error) {
    console.error("Error adding reply:", error)
    throw error
  }
}

export const updateTicketStatus = async (ticketId, status) => {
  try {
    const ticketRef = doc(db, "tickets", ticketId)
    await updateDoc(ticketRef, {
      status,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating ticket status:", error)
    throw error
  }
}
