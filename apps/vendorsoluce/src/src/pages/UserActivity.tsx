import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Activity, 
  Clock, 
  Target, 
  Shield, 
  Settings, 
  Download,
  Search,
  FileText,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

interface ActivityItem {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'vendor' | 'assessment' | 'sbom' | 'settings' | 'security' | 'compliance';
  status: 'success' | 'warning' | 'error' | 'info';
}

const UserActivity: React.FC = () => {
  // const { profile } = useAuth(); // Not used currently
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock activity data - in a real app this would come from an API
  const activities: ActivityItem[] = [
    {
      id: '1',
      action: 'Completed Supply Chain Assessment',
      details: 'NIST SP 800-161 assessment with 78% compliance score',
      timestamp: '2025-01-17T14:30:00Z',
      type: 'assessment',
      status: 'success'
    },
    {
      id: '2',
      action: 'Added new vendor',
      details: 'TechCorp Solutions added to vendor portfolio',
      timestamp: '2025-01-16T09:15:00Z',
      type: 'vendor',
      status: 'success'
    },
    {
      id: '3',
      action: 'SBOM Analysis completed',
      details: 'Analyzed app-v2.1.json - 3 critical vulnerabilities found',
      timestamp: '2025-01-15T16:45:00Z',
      type: 'sbom',
      status: 'warning'
    },
    {
      id: '4',
      action: 'Security settings updated',
      details: 'Two-factor authentication enabled',
      timestamp: '2025-01-14T11:20:00Z',
      type: 'security',
      status: 'success'
    },
    {
      id: '5',
      action: 'Vendor assessment failed',
      details: 'CloudSecure Inc assessment incomplete due to missing responses',
      timestamp: '2025-01-13T13:30:00Z',
      type: 'vendor',
      status: 'error'
    },
    {
      id: '6',
      action: 'Profile information updated',
      details: 'Company and role information updated',
      timestamp: '2025-01-12T10:00:00Z',
      type: 'settings',
      status: 'success'
    },
    {
      id: '7',
      action: 'Compliance report generated',
      details: 'Q4 2024 supply chain compliance report exported',
      timestamp: '2025-01-11T15:30:00Z',
      type: 'compliance',
      status: 'success'
    },
    {
      id: '8',
      action: 'Risk threshold exceeded',
      details: 'DevTools Pro vendor risk score increased to 85 (High)',
      timestamp: '2025-01-10T08:45:00Z',
      type: 'vendor',
      status: 'warning'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'vendor': return <Target className="h-5 w-5" />;
      case 'assessment': return <BarChart3 className="h-5 w-5" />;
      case 'sbom': return <Shield className="h-5 w-5" />;
      case 'settings': return <Settings className="h-5 w-5" />;
      case 'security': return <Shield className="h-5 w-5" />;
      case 'compliance': return <FileText className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'error': return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
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

  const filteredActivities = activities.filter(activity => {
    const matchesFilter = filter === 'all' || activity.type === filter;
    const matchesSearch = activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.details.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const activityTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'vendor', label: 'Vendor Management' },
    { value: 'assessment', label: 'Assessments' },
    { value: 'sbom', label: 'SBOM Analysis' },
    { value: 'security', label: 'Security' },
    { value: 'compliance', label: 'Compliance' }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Activity History</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Track your actions and system events across VendorSoluce
            </p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Activity Log
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {activityTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {activities.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Activities</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {activities.filter(a => a.status === 'success').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Successful Actions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {activities.filter(a => a.status === 'warning').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Warnings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {activities.filter(a => a.status === 'error').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Errors</div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2 text-vendorsoluce-green" />
            Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No activities found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm ? 'Try adjusting your search terms' : 'Your activity will appear here as you use VendorSoluce'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className={`border-l-4 p-4 rounded-lg ${getStatusColor(activity.status)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {activity.action}
                          </h3>
                          {getStatusIcon(activity.status)}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {activity.details}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTimestamp(activity.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Insights */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Activity Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-vendorsoluce-green mb-2">
                {activities.filter(a => a.type === 'vendor').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Vendor Actions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-vendorsoluce-blue mb-2">
                {activities.filter(a => a.type === 'assessment').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Assessments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-vendorsoluce-teal mb-2">
                {activities.filter(a => a.type === 'sbom').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">SBOM Analyses</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserActivity;