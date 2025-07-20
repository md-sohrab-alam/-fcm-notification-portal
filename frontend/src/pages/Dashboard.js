import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Users, 
  Send, 
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { healthAPI } from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [serverStatus, setServerStatus] = useState('checking');
  const [stats, setStats] = useState({
    totalNotifications: 0,
    successRate: 0,
    activeTopics: 0,
    recentActivity: []
  });

  useEffect(() => {
    checkServerHealth();
    // Mock data for demonstration
    setStats({
      totalNotifications: 1247,
      successRate: 98.5,
      activeTopics: 12,
      recentActivity: [
        { id: 1, type: 'sent', title: 'Welcome Notification', time: '2 minutes ago', status: 'success' },
        { id: 2, type: 'topic', title: 'News Update', time: '5 minutes ago', status: 'success' },
        { id: 3, type: 'sent', title: 'Promotional Offer', time: '10 minutes ago', status: 'failed' },
        { id: 4, type: 'topic', title: 'System Maintenance', time: '15 minutes ago', status: 'success' },
      ]
    });
  }, []);

  const checkServerHealth = async () => {
    try {
      await healthAPI.checkHealth();
      setServerStatus('online');
    } catch (error) {
      setServerStatus('offline');
      toast.error('Backend server is offline');
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'primary' }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const getIcon = () => {
      switch (activity.type) {
        case 'sent':
          return Send;
        case 'topic':
          return Users;
        default:
          return Bell;
      }
    };

    const getStatusColor = () => {
      return activity.status === 'success' ? 'text-success-600' : 'text-error-600';
    };

    const Icon = getIcon();

    return (
      <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-gray-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
          <p className="text-xs text-gray-500">{activity.time}</p>
        </div>
        <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
          {activity.status === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span className="text-xs font-medium capitalize">{activity.status}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor your FCM notification system</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            serverStatus === 'online' ? 'bg-success-500' : 'bg-error-500'
          }`} />
          <span className="text-sm text-gray-600">
            Backend {serverStatus === 'online' ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Bell}
          title="Total Notifications"
          value={stats.totalNotifications.toLocaleString()}
          subtitle="All time"
          color="primary"
        />
        <StatCard
          icon={TrendingUp}
          title="Success Rate"
          value={`${stats.successRate}%`}
          subtitle="Last 24 hours"
          color="success"
        />
        <StatCard
          icon={Users}
          title="Active Topics"
          value={stats.activeTopics}
          subtitle="Currently subscribed"
          color="warning"
        />
        <StatCard
          icon={Activity}
          title="Recent Activity"
          value={stats.recentActivity.length}
          subtitle="Last hour"
          color="primary"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-2">
            {stats.recentActivity.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full btn btn-primary flex items-center justify-center space-x-2">
              <Send className="w-4 h-4" />
              <span>Send Notification</span>
            </button>
            <button className="w-full btn btn-secondary flex items-center justify-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Manage Topics</span>
            </button>
            <button className="w-full btn btn-secondary flex items-center justify-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>View History</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 