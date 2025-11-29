import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  User, 
  Activity, 
  Clock, 
  Award, 
  Target,
  BarChart3,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Settings,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useVendors } from '../hooks/useVendors';
import { useSBOMAnalyses } from '../hooks/useSBOMAnalyses';
import { useSupplyChainAssessments } from '../hooks/useSupplyChainAssessments';

const UserDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const { vendors } = useVendors();
  const { analyses } = useSBOMAnalyses();
  const { assessments } = useSupplyChainAssessments();

  const recentActivity = [
    {
      id: 1,
      action: 'Completed Supply Chain Assessment',
      timestamp: '2 hours ago',
      icon: <CheckCircle className="h-4 w-4 text-green-500" />
    },
    {
      id: 2,
      action: 'Added new vendor: TechCorp Solutions',
      timestamp: '1 day ago',
      icon: <Target className="h-4 w-4 text-blue-500" />
    },
    {
      id: 3,
      action: 'Analyzed SBOM file: app-v2.1.json',
      timestamp: '2 days ago',
      icon: <Shield className="h-4 w-4 text-purple-500" />
    },
    {
      id: 4,
      action: 'Updated profile information',
      timestamp: '3 days ago',
      icon: <User className="h-4 w-4 text-gray-500" />
    }
  ];

  const achievements = [
    {
      id: 1,
      title: 'Risk Assessment Expert',
      description: 'Completed 5 supply chain assessments',
      icon: <Award className="h-6 w-6 text-yellow-500" />,
      earned: true
    },
    {
      id: 2,
      title: 'SBOM Analyzer',
      description: 'Analyzed 10 software bills of materials',
      icon: <Shield className="h-6 w-6 text-blue-500" />,
      earned: analyses.length >= 10
    },
    {
      id: 3,
      title: 'Vendor Manager',
      description: 'Managed 25+ vendor relationships',
      icon: <Target className="h-6 w-6 text-green-500" />,
      earned: vendors.length >= 25
    },
    {
      id: 4,
      title: 'Compliance Champion',
      description: 'Maintained 90%+ compliance score',
      icon: <CheckCircle className="h-6 w-6 text-purple-500" />,
      earned: false
    }
  ];

  const quickStats = [
    {
      label: 'Vendors Managed',
      value: vendors.length,
      change: '+3 this month',
      trend: 'up'
    },
    {
      label: 'Assessments Completed',
      value: assessments.length,
      change: '+2 this week',
      trend: 'up'
    },
    {
      label: 'SBOMs Analyzed',
      value: analyses.length,
      change: '+1 this week',
      trend: 'up'
    },
    {
      label: 'Risk Score',
      value: '78%',
      change: '+5% this month',
      trend: 'up'
    }
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-vendorsoluce-navy rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
              {(profile?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {profile?.full_name || 'User'}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {profile?.role || 'Security Professional'} at {profile?.company || 'Your Organization'}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link to="/profile">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
            <Link to="/account">
              <Button variant="outline" size="sm">
                Account Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                </div>
                <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {stat.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-vendorsoluce-green" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{activity.action}</p>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link to="/user-activity">
                  <Button variant="outline" className="w-full">
                    View All Activity
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/vendor-risk-dashboard">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-vendorsoluce-green transition-colors cursor-pointer">
                    <div className="flex items-center">
                      <Target className="h-6 w-6 text-vendorsoluce-green mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Add Vendor</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Add a new vendor to your portfolio</p>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link to="/supply-chain-assessment">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-vendorsoluce-green transition-colors cursor-pointer">
                    <div className="flex items-center">
                      <BarChart3 className="h-6 w-6 text-vendorsoluce-green mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Run Assessment</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Start a new risk assessment</p>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link to="/sbom-analyzer">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-vendorsoluce-green transition-colors cursor-pointer">
                    <div className="flex items-center">
                      <Shield className="h-6 w-6 text-vendorsoluce-green mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Analyze SBOM</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Upload and analyze components</p>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link to="/templates">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-vendorsoluce-green transition-colors cursor-pointer">
                    <div className="flex items-center">
                      <Calendar className="h-6 w-6 text-vendorsoluce-green mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Download Templates</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Get assessment templates</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-yellow-500" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-lg border ${
                      achievement.earned
                        ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800'
                        : 'border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={achievement.earned ? 'text-yellow-500' : 'text-gray-400'}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${
                          achievement.earned 
                            ? 'text-yellow-800 dark:text-yellow-300' 
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {achievement.title}
                        </h4>
                        <p className={`text-sm ${
                          achievement.earned 
                            ? 'text-yellow-700 dark:text-yellow-400' 
                            : 'text-gray-500 dark:text-gray-500'
                        }`}>
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.earned && (
                        <CheckCircle className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Profile Completion */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Profile Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Profile completed</span>
                  <span className="font-medium text-gray-900 dark:text-white">85%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-vendorsoluce-green h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Basic information completed</span>
                  </div>
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Security preferences set</span>
                  </div>
                  <div className="flex items-center text-yellow-600 dark:text-yellow-400">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <span>Add profile picture</span>
                  </div>
                </div>
                <Link to="/profile">
                  <Button variant="outline" size="sm" className="w-full">
                    Complete Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;