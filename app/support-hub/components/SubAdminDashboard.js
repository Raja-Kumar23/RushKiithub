'use client';

import TicketList from './TicketList';
import { Ticket, TrendingUp, Clock, CheckCircle, User, BookOpen } from 'lucide-react';

export default function SubAdminDashboard({ tickets, loading, activeTab, onTicketSelect, subAdmin }) {
  const stats = {
    total: tickets.length,
    pending: tickets.filter(t => t.status === 'pending').length,
    assigned: tickets.filter(t => t.status === 'assigned').length,
    resolved: tickets.filter(t => t.status === 'resolved').length
  };

  if (activeTab === 'analytics') {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">My Analytics</h2>
          <p className="text-gray-400">Performance overview for your assigned tickets</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Handled</p>
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
                <p className="text-gray-400 text-sm">In Progress</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.assigned}</p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-full">
                <Clock size={24} className="text-yellow-400" />
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
                <CheckCircle size={24} className="text-green-400" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Success Rate</p>
                <p className="text-2xl font-bold text-green-400">
                  {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                </p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-full">
                <TrendingUp size={24} className="text-green-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">My Specializations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subAdmin?.categories.map((category) => {
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
        <h2 className="text-2xl font-bold text-white mb-2">
          Welcome, {subAdmin?.name}!
        </h2>
        <div className="flex items-center space-x-4 text-gray-400">
          <div className="flex items-center space-x-2">
            <User size={16} />
            <span>{subAdmin?.rollNumber}</span>
          </div>
          <div className="flex items-center space-x-2">
            <BookOpen size={16} />
            <span>{subAdmin?.branch} - {subAdmin?.year}</span>
          </div>
        </div>
        <p className="text-gray-400 mt-2">
          Managing tickets for: {subAdmin?.categories.join(', ')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Assigned Tickets</p>
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
              <p className="text-gray-400 text-sm">Pending</p>
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
              <p className="text-gray-400 text-sm">In Progress</p>
              <p className="text-2xl font-bold text-blue-400">{stats.assigned}</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-full">
              <TrendingUp size={24} className="text-blue-400" />
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
              <CheckCircle size={24} className="text-green-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">My Tickets</h3>
          <div className="flex space-x-2">
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
          userRole="sub-admin"
        />
      </div>
    </div>
  );
}