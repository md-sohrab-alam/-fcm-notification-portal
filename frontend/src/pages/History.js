import React, { useState, useEffect } from 'react';
import { History, Search, Filter, Download, Calendar, Clock, CheckCircle, AlertCircle, Send, Users } from 'lucide-react';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    // Mock data for demonstration
    const mockHistory = [
      {
        id: 1,
        type: 'sent',
        title: 'Welcome Notification',
        body: 'Welcome to our app!',
        status: 'success',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        tokens: 5,
        successCount: 5,
        failureCount: 0,
        topic: null
      },
      {
        id: 2,
        type: 'topic',
        title: 'News Update',
        body: 'Breaking news: New features available',
        status: 'success',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        tokens: null,
        successCount: null,
        failureCount: null,
        topic: 'news'
      },
      {
        id: 3,
        type: 'sent',
        title: 'Promotional Offer',
        body: 'Get 50% off on all items',
        status: 'failed',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        tokens: 3,
        successCount: 1,
        failureCount: 2,
        topic: null
      },
      {
        id: 4,
        type: 'topic',
        title: 'System Maintenance',
        body: 'Scheduled maintenance in 2 hours',
        status: 'success',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        tokens: null,
        successCount: null,
        failureCount: null,
        topic: 'system'
      },
      {
        id: 5,
        type: 'sent',
        title: 'Daily Reminder',
        body: 'Don\'t forget to check your tasks',
        status: 'success',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        tokens: 8,
        successCount: 7,
        failureCount: 1,
        topic: null
      }
    ];
    setHistory(mockHistory);
    setFilteredHistory(mockHistory);
  }, []);

  useEffect(() => {
    let filtered = history;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.body.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === typeFilter);
    }

    setFilteredHistory(filtered);
  }, [history, searchTerm, statusFilter, typeFilter]);

  const getStatusIcon = (status) => {
    return status === 'success' ? (
      <CheckCircle className="w-4 h-4 text-success-600" />
    ) : (
      <AlertCircle className="w-4 h-4 text-error-600" />
    );
  };

  const getTypeIcon = (type) => {
    return type === 'sent' ? (
      <Send className="w-4 h-4 text-primary-600" />
    ) : (
      <Users className="w-4 h-4 text-warning-600" />
    );
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  };

  const exportHistory = () => {
    const csvContent = [
      ['ID', 'Type', 'Title', 'Body', 'Status', 'Timestamp', 'Tokens', 'Success Count', 'Failure Count', 'Topic'].join(','),
      ...filteredHistory.map(item => [
        item.id,
        item.type,
        `"${item.title}"`,
        `"${item.body}"`,
        item.status,
        item.timestamp.toISOString(),
        item.tokens || '',
        item.successCount || '',
        item.failureCount || '',
        item.topic || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notification-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notification History</h1>
          <p className="text-gray-600 mt-1">View and manage your notification history</p>
        </div>
        <button
          onClick={exportHistory}
          className="btn btn-secondary flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="form-label">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                className="input pl-10"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="form-label">Status</label>
            <select
              className="input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          
          <div>
            <label className="form-label">Type</label>
            <select
              className="input"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="sent">Sent to Tokens</option>
              <option value="topic">Sent to Topic</option>
            </select>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {filteredHistory.length === 0 ? (
          <div className="card text-center py-12">
            <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div key={item.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getTypeIcon(item.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      {getStatusIcon(item.status)}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{item.body}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatTimestamp(item.timestamp)}</span>
                      </div>
                      
                      {item.type === 'sent' && (
                        <>
                          <div className="flex items-center space-x-1">
                            <Send className="w-4 h-4" />
                            <span>{item.tokens} tokens</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-success-600">{item.successCount} success</span>
                            {item.failureCount > 0 && (
                              <span className="text-error-600">{item.failureCount} failed</span>
                            )}
                          </div>
                        </>
                      )}
                      
                      {item.type === 'topic' && (
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>Topic: {item.topic}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'success' 
                      ? 'bg-success-100 text-success-800' 
                      : 'bg-error-100 text-error-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {filteredHistory.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{filteredHistory.length}</p>
              <p className="text-sm text-gray-600">Total Notifications</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success-600">
                {filteredHistory.filter(item => item.status === 'success').length}
              </p>
              <p className="text-sm text-gray-600">Successful</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-error-600">
                {filteredHistory.filter(item => item.status === 'failed').length}
              </p>
              <p className="text-sm text-gray-600">Failed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">
                {filteredHistory.filter(item => item.type === 'topic').length}
              </p>
              <p className="text-sm text-gray-600">Topic Messages</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage; 