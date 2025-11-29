import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Shield, 
  Users, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  Target,
  FileText,
  Lock,
  Eye,
  User,
  Activity,
  Database,
  Award,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardDemoPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // If user is authenticated, redirect to actual dashboard
  if (isAuthenticated) {
    window.location.href = '/dashboard';
    return null;
  }

  const demoMetrics = [
    { label: 'Total Vendors', value: 47, icon: <Users className="h-6 w-6 text-blue-500" />, change: '+12 this month' },
    { label: 'High Risk Vendors', value: 8, icon: <AlertTriangle className="h-6 w-6 text-orange-500" />, change: '-3 resolved' },
    { label: 'Assessments', value: 23, icon: <FileText className="h-6 w-6 text-green-500" />, change: '+5 completed' },
    { label: 'SBOM Analyses', value: 15, icon: <Shield className="h-6 w-6 text-purple-500" />, change: '+7 this week' }
  ];

  const recentActivity = [
    { action: 'Completed NIST 800-161 Assessment', time: '2 hours ago', type: 'success' },
    { action: 'Added new vendor: CloudSecure Inc', time: '1 day ago', type: 'info' },
    { action: 'Critical vulnerability detected in SBOM', time: '2 days ago', type: 'warning' },
    { action: 'Generated compliance report', time: '3 days ago', type: 'success' }
  ];

  const quickActions = [
    {
      title: 'Add Vendor',
      description: 'Add a new vendor to your risk portfolio',
      icon: <Plus className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Run Assessment',
      description: 'Start a supply chain risk assessment',
      icon: <BarChart3 className="h-6 w-6" />,
      color: 'bg-green-500'
    },
    {
      title: 'Analyze SBOM',
      description: 'Upload and analyze software components',
      icon: <Database className="h-6 w-6" />,
      color: 'bg-purple-500'
    },
    {
      title: 'View Reports',
      description: 'Generate compliance reports',
      icon: <FileText className="h-6 w-6" />,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Demo Banner */}
        <div className="mb-8 bg-gradient-to-r from-vendorsoluce-navy to-vendorsoluce-teal text-white rounded-lg p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center mb-2">
                <Eye className="h-6 w-6 mr-2" />
                <span className="text-lg font-semibold">Dashboard Preview</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Supply Chain Risk Management Dashboard</h1>
              <p className="text-xl text-gray-100">
                Explore VendorRiskRadar's capabilities with a 14-day free trial. No credit card required.
              </p>
              <p className="text-sm text-gray-200 mt-2">
                <strong>Trial includes:</strong> Full dashboard access, Supply Chain Risk Assessment, SBOM Analysis, 
                Vendor Risk Monitoring, and all Professional tier features. Start your free trial today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/checkout?plan=professional">
                <Button variant="secondary" size="lg" className="bg-white text-vendorsoluce-navy hover:bg-gray-100">
                  <User className="h-5 w-5 mr-2" />
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/signin">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/20">
                  <Lock className="h-5 w-5 mr-2" />
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {demoMetrics.map((metric, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">{metric.change}</p>
                  </div>
                  <div className="opacity-20">
                    {metric.icon}
                  </div>
                </div>
              </CardContent>
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-vendorsoluce-green/10 to-vendorsoluce-blue/10 rounded-bl-full"></div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Risk Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-vendorsoluce-green" />
                  Risk Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Low Risk</span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">31 vendors</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full risk-bar-low"></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Medium Risk</span>
                    <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">8 vendors</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full risk-bar-medium"></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">High Risk</span>
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">8 vendors</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full risk-bar-high"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-vendorsoluce-blue" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg opacity-75 cursor-not-allowed">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white mr-3`}>
                          {action.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-500 dark:text-gray-400">{action.title}</h3>
                          <p className="text-sm text-gray-400 dark:text-gray-500">{action.description}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-vendorsoluce-blue text-sm">
                        <Lock className="h-3 w-3 mr-1" />
                        Sign in required
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Sign In Prompt */}
            <Card className="border-l-4 border-l-vendorsoluce-green">
              <CardContent className="p-6">
                <div className="text-center">
                  <Lock className="h-12 w-12 text-vendorsoluce-green mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Sign in to unlock full dashboard
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Access all features, save your data, and get personalized insights
                  </p>
                  <div className="space-y-2">
                    <Link to="/signin">
                      <Button variant="primary" className="w-full">
                        <User className="h-4 w-4 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button variant="outline" className="w-full">
                        Create Account
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-vendorsoluce-teal" />
                  Recent Activity
                  <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full text-gray-500 dark:text-gray-400">
                    Demo
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 opacity-60">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'success' ? 'bg-green-500' :
                        activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{activity.action}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-yellow-500" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-yellow-500 mr-2" />
                      <div>
                        <h4 className="font-medium text-yellow-800 dark:text-yellow-300">Risk Assessment Expert</h4>
                        <p className="text-xs text-yellow-700 dark:text-yellow-400">Complete 5 assessments</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg opacity-60">
                    <div className="flex items-center">
                      <Target className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <h4 className="font-medium text-gray-600 dark:text-gray-400">Vendor Manager</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-500">Manage 25+ vendors</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            What you get with a VendorSoluce account
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-vendorsoluce-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-vendorsoluce-green" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Complete Risk Visibility</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Monitor all your vendors, track compliance, and get real-time risk scores
              </p>
            </Card>
            
            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-vendorsoluce-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-vendorsoluce-blue" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">NIST 800-161 Aligned</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Built-in compliance framework ensures you meet federal requirements
              </p>
            </Card>
            
            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-vendorsoluce-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-vendorsoluce-teal" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Automated Insights</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Get actionable recommendations and automated risk scoring
              </p>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-vendorsoluce-green to-vendorsoluce-light-green text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to secure your supply chain?</h2>
          <p className="text-xl text-gray-100 mb-6 max-w-2xl mx-auto">
            Join organizations using VendorSoluce to manage supply chain risks and ensure compliance
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup">
              <Button variant="secondary" size="lg" className="bg-white text-vendorsoluce-green hover:bg-gray-100">
                <User className="h-5 w-5 mr-2" />
                Start Free Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDemoPage;