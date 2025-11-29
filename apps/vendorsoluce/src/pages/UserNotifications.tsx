import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Bell, Settings, Check, X, Clock, AlertTriangle, Info, Shield, Target, FileText, ArrowLeft, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  category: 'vendor' | 'assessment' | 'sbom' | 'security' | 'system';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

const UserNotifications: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Critical Vulnerability Detected',
      message: 'High-severity vulnerability found in React component used by TechCorp Solutions',
      type: 'error',
      category: 'sbom',
      timestamp: '2025-01-17T10:30:00Z',
      read: false,
      actionUrl: '/sbom-analyzer'
    },
    {
      id: '2',
      title: 'Vendor Assessment Overdue',
      message: 'CloudSecure Inc assessment is 3 days overdue. Please follow up.',
      type: 'warning',
      category: 'vendor',
      timestamp: '2025-01-16T14:15:00Z',
      read: false,
      actionUrl: '/vendor-assessments'
    },
    {
      id: '3',
      title: 'Assessment Completed',
      message: 'Your NIST SP 800-161 supply chain assessment has been completed with a score of 78%',
      type: 'success',
      category: 'assessment',
      timestamp: '2025-01-15T16:45:00Z',
      read: true,
      actionUrl: '/supply-chain-results'
    },
    {
      id: '4',
      title: 'New Vendor Added',
      message: 'DevTools Pro has been successfully added to your vendor portfolio',
      type: 'info',
      category: 'vendor',
      timestamp: '2025-01-14T09:20:00Z',
      read: true
    },
    {
      id: '5',
      title: 'Security Settings Updated',
      message: 'Two-factor authentication has been enabled for your account',
      type: 'success',
      category: 'security',
      timestamp: '2025-01-13T11:30:00Z',
      read: true
    },
    {
      id: '6',
      title: 'System Maintenance Scheduled',
      message: 'Scheduled maintenance on January 20th from 2:00 AM to 4:00 AM EST',
      type: 'info',
      category: 'system',
      timestamp: '2025-01-12T08:00:00Z',
      read: false
    }
  ]);

  const getNotificationIcon = (type: string, category: string) => {
    if (type === 'error') return <AlertTriangle className="h-5 w-5 text-red-500" />;
    if (type === 'warning') return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    if (type === 'success') return <Check className="h-5 w-5 text-green-500" />;
    
    switch (category) {
      case 'vendor': return <Target className="h-5 w-5 text-blue-500" />;
      case 'assessment': return <FileText className="h-5 w-5 text-purple-500" />;
      case 'sbom': return <Shield className="h-5 w-5 text-teal-500" />;
      case 'security': return <Shield className="h-5 w-5 text-red-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'error': return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'success': return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      default: return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.category === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const filterOptions = [
    { value: 'all', label: 'All Notifications' },
    { value: 'unread', label: 'Unread' },
    { value: 'vendor', label: 'Vendor Management' },
    { value: 'assessment', label: 'Assessments' },
    { value: 'sbom', label: 'SBOM Analysis' },
    { value: 'security', label: 'Security' },
    { value: 'system', label: 'System' }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link to="/user-dashboard" className="mr-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <Bell className="h-8 w-8 mr-3 text-vendorsoluce-green" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-3 px-2 py-1 bg-red-500 text-white rounded-full text-sm">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Stay updated with your supply chain security activities
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
            <Link to="/account">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Notification Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No notifications found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === 'unread' ? 'All caught up! No unread notifications.' : 'You\'ll see notifications here as they arrive.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`border-l-4 ${getNotificationColor(notification.type)} ${
                !notification.read ? 'ring-2 ring-blue-100 dark:ring-blue-900/20' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type, notification.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className={`font-medium ${
                          !notification.read 
                            ? 'text-gray-900 dark:text-white' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className={`text-sm mt-1 ${
                        !notification.read 
                          ? 'text-gray-700 dark:text-gray-300' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTimestamp(notification.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {notification.actionUrl && (
                      <Link to={notification.actionUrl}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    )}
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Notification Preferences Quick Access */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Customize when and how you receive notifications to stay informed without being overwhelmed.
          </p>
          <Link to="/account">
            <Button variant="primary">
              <Settings className="h-4 w-4 mr-2" />
              Manage Notification Settings
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserNotifications;