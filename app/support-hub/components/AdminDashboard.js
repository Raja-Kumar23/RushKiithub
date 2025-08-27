'use client';

import { useState } from 'react';
import TicketList from './TicketList';
import { assignTicket } from '@/lib/tickets';
import { Users, Ticket, TrendingUp, Clock, Award } from 'lucide-react';

export default function AdminDashboard({ tickets, loading, activeTab, onTicketSelect, subAdmins }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const stats = {
    total: tickets.length,
    pending: tickets.filter(t => t.status === 'pending').length,
    assigned: tickets.filter(t => t.status === 'assigned').length,
    resolved: tickets.filter(t => t.status === 'resolved').length
  };

  const handleAssignTicket = async (ticketId, subAdminId) => {
    try {
      await assignTicket(ticketId, subAdminId);
      setShowAssignModal(false);
      setSelectedTicket(null);
    } catch (error) {
      console.error('Error assigning ticket:', error);
    }
  };

  if (activeTab === 'admins') {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Student Sub-Administrators</h2>
          <p className="text-gray-400">Manage student sub-admin assignments and specializations</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subAdmins.map((admin) => (
            <div key={admin.id} className="card">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {admin.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{admin.name}</h3>
                  <p className="text-sm text-gray-400">{admin.email}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-300 mb-2">Student Details</p>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>Roll: {admin.rollNumber}</p>
                  <p>Year: {admin.year}</p>
                  <p>Branch: {admin.branch}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-300 mb-2">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {admin.categories.map((category) => (
                    <span
                      key={category}
                      className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeTab === 'analytics') {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Analytics Overview</h2>
          <p className="text-gray-400">System performance and ticket insights</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Tickets</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Ticket size={24} className="text-blue-400" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-full">
                <Clock size={24} className="text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Sub-Admins</p>
                <p className="text-2xl font-bold text-blue-400">{subAdmins.length}</p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Users size={24} className="text-blue-400" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Resolution Rate</p>
                <p className="text-2xl font-bold text-green-400">
                  {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                </p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-full">
                <Award size={24} className="text-green-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Category Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Mental & Emotional Support', 'Academic Guidance', 'General'].map((category) => {
              const categoryTickets = tickets.filter(t => t.category === category);
              const percentage = stats.total > 0 ? (categoryTickets.length / stats.total) * 100 : 0;
              
              return (
                <div key={category} className="p-4 bg-gray-800 rounded-lg">
                  <h4 className="font-medium text-white mb-2">{category}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">{categoryTickets.length}</span>
                    <span className="text-sm text-gray-400">{percentage.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h2>
        <p className="text-gray-400">Manage all support tickets and sub-administrator assignments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Tickets</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-full">
              <Ticket size={24} className="text-blue-400" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-full">
              <Clock size={24} className="text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Sub-Admins</p>
              <p className="text-2xl font-bold text-blue-400">{subAdmins.length}</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-full">
              <Users size={24} className="text-blue-400" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Resolved</p>
              <p className="text-2xl font-bold text-green-400">{stats.resolved}</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-full">
              <TrendingUp size={24} className="text-green-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">All Tickets</h3>
          <div className="flex space-x-2">
            <select className="form-input bg-gray-800 border-gray-600 text-white">
              <option>All Categories</option>
              <option>Mental & Emotional Support</option>
              <option>Academic Guidance</option>
              <option>General</option>
            </select>
            <select className="form-input bg-gray-800 border-gray-600 text-white">
              <option>All Status</option>
              <option>Pending</option>
              <option>Assigned</option>
              <option>Resolved</option>
            </select>
          </div>
        </div>
        
        <TicketList
          tickets={tickets}
          loading={loading}
          onTicketSelect={onTicketSelect}
          userRole="admin"
          subAdmins={subAdmins}
        />
      </div>

      {showAssignModal && selectedTicket && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="text-lg font-semibold text-white mb-4">Assign Ticket</h3>
            <p className="text-gray-400 mb-4">Select a sub-admin to assign this ticket:</p>
            
            <div className="space-y-3 mb-6">
              {subAdmins
                .filter(admin => admin.categories.includes(selectedTicket.category))
                .map((admin) => (
                  <button
                    key={admin.id}
                    onClick={() => handleAssignTicket(selectedTicket.id, admin.id)}
                    className="w-full p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {admin.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{admin.name}</p>
                        <p className="text-sm text-gray-400">{admin.rollNumber} - {admin.branch}</p>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAssignModal(false)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}