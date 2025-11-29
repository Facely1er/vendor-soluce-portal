import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Building, 
  FileText, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Award,
  Calendar,
  Download,
  Eye,
  Edit,
  Plus,
  BarChart3,
  Bell,
  Settings,
  ExternalLink
} from 'lucide-react';

interface VendorProfile {
  id: string;
  companyName: string;
  status: 'pending' | 'approved' | 'rejected' | 'under-review';
  industry: string;
  riskScore: number;
  lastAssessment: string;
  nextAssessment: string;
  certifications: string[];
  complianceStatus: 'compliant' | 'non-compliant' | 'partial';
  documents: {
    uploaded: number;
    required: number;
  };
  assessments: {
    total: number;
    completed: number;
    pending: number;
  };
}

interface Assessment {
  id: string;
  title: string;
  type: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  dueDate: string;
  progress: number;
  score?: number;
  framework: string;
}

const VendorDashboard: React.FC = () => {
  const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock data - in real app this would be fetched from API
  useEffect(() => {
    const mockVendorProfile: VendorProfile = {
      id: 'vendor-123',
      companyName: 'TechCorp Solutions',
      status: 'approved',
      industry: 'Technology',
      riskScore: 75,
      lastAssessment: '2024-01-15',
      nextAssessment: '2024-04-15',
      certifications: ['ISO 27001', 'SOC 2 Type II'],
      complianceStatus: 'compliant',
      documents: {
        uploaded: 8,
        required: 10
      },
      assessments: {
        total: 12,
        completed: 8,
        pending: 4
      }
    };

    const mockAssessments: Assessment[] = [
      {
        id: 'assess-1',
        title: 'NIST SP 800-161 Assessment',
        type: 'Comprehensive',
        status: 'completed',
        dueDate: '2024-01-15',
        progress: 100,
        score: 85,
        framework: 'NIST SP 800-161'
      },
      {
        id: 'assess-2',
        title: 'Security Controls Review',
        type: 'Security',
        status: 'in-progress',
        dueDate: '2024-02-28',
        progress: 65,
        framework: 'NIST Cybersecurity Framework'
      },
      {
        id: 'assess-3',
        title: 'Compliance Audit',
        type: 'Compliance',
        status: 'pending',
        dueDate: '2024-03-15',
        progress: 0,
        framework: 'ISO 27001'
      },
      {
        id: 'assess-4',
        title: 'Risk Assessment',
        type: 'Risk',
        status: 'overdue',
        dueDate: '2024-01-30',
        progress: 30,
        framework: 'CIS Controls'
      }
    ];

    setTimeout(() => {
      setVendorProfile(mockVendorProfile);
      setAssessments(mockAssessments);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
      case 'compliant':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'pending':
      case 'in-progress':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'rejected':
      case 'overdue':
      case 'non-compliant':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
    }
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: 'Low', color: 'text-green-600' };
    if (score >= 60) return { level: 'Medium', color: 'text-yellow-600' };
    return { level: 'High', color: 'text-red-600' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vendorsoluce-navy mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!vendorProfile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Profile Not Found</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Unable to load your vendor profile.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const riskLevel = getRiskLevel(vendorProfile.riskScore);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-vendorsoluce-green/10 rounded-lg flex items-center justify-center mr-4">
                <Building className="h-6 w-6 text-vendorsoluce-green" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {vendorProfile.companyName}
                </h1>
                <div className="flex items-center mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vendorProfile.status)}`}>
                    {vendorProfile.status.charAt(0).toUpperCase() + vendorProfile.status.slice(1)}
                  </span>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {vendorProfile.industry}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="primary" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Assessment
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-4">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Risk Score</p>
                  <p className={`text-2xl font-bold ${riskLevel.color}`}>
                    {vendorProfile.riskScore}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {riskLevel.level} Risk
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-4">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Assessments</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {vendorProfile.assessments.completed}/{vendorProfile.assessments.total}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Completed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-4">
                  <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Documents</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {vendorProfile.documents.uploaded}/{vendorProfile.documents.required}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Uploaded
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center mr-4">
                  <Award className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Certifications</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {vendorProfile.certifications.length}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Active
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'assessments', label: 'Assessments', icon: FileText },
                { id: 'documents', label: 'Documents', icon: FileText },
                { id: 'compliance', label: 'Compliance', icon: Shield },
                { id: 'notifications', label: 'Notifications', icon: Bell }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                      selectedTab === tab.id
                        ? 'border-vendorsoluce-navy text-vendorsoluce-navy'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Assessments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Recent Assessments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assessments.slice(0, 3).map((assessment) => (
                    <div key={assessment.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {assessment.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {assessment.framework} • Due {assessment.dueDate}
                        </p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Progress</span>
                            <span className="text-gray-900 dark:text-white">{assessment.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                            <div 
                              className="bg-vendorsoluce-green h-2 rounded-full transition-all duration-300"
                              style={{ width: `${assessment.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assessment.status)}`}>
                          {assessment.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    View All Assessments
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Compliance Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vendorProfile.complianceStatus)}`}>
                      {vendorProfile.complianceStatus}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {vendorProfile.certifications.map((cert) => (
                      <div key={cert} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{cert}</span>
                        </div>
                        <span className="text-xs text-green-600 dark:text-green-400">Valid</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Last Assessment</span>
                      <span className="text-gray-900 dark:text-white">{vendorProfile.lastAssessment}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-600 dark:text-gray-400">Next Assessment</span>
                      <span className="text-gray-900 dark:text-white">{vendorProfile.nextAssessment}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'assessments' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  All Assessments
                </div>
                <Button variant="primary" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Assessment
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assessments.map((assessment) => (
                  <div key={assessment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                            {assessment.title}
                          </h4>
                          <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assessment.status)}`}>
                            {assessment.status.replace('-', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {assessment.framework} • {assessment.type} Assessment
                        </p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Due: {assessment.dueDate}
                          </div>
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            Progress: {assessment.progress}%
                          </div>
                          {assessment.score && (
                            <div className="flex items-center">
                              <Award className="h-4 w-4 mr-1" />
                              Score: {assessment.score}/100
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-vendorsoluce-green h-2 rounded-full transition-all duration-300"
                              style={{ width: `${assessment.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-6 flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {assessment.status === 'in-progress' && (
                          <Button variant="primary" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Continue
                          </Button>
                        )}
                        {assessment.status === 'completed' && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Report
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedTab === 'documents' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Document Management
                </div>
                <Button variant="primary" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Business License', status: 'uploaded', date: '2024-01-15' },
                  { name: 'Insurance Certificate', status: 'uploaded', date: '2024-01-15' },
                  { name: 'Security Policy', status: 'uploaded', date: '2024-01-20' },
                  { name: 'Compliance Certificate', status: 'uploaded', date: '2024-01-20' },
                  { name: 'Financial Statement', status: 'uploaded', date: '2024-01-25' },
                  { name: 'Data Processing Agreement', status: 'pending', date: null },
                  { name: 'Privacy Policy', status: 'pending', date: null },
                  { name: 'Incident Response Plan', status: 'pending', date: null },
                  { name: 'Business Continuity Plan', status: 'pending', date: null },
                  { name: 'Vendor Risk Assessment', status: 'pending', date: null }
                ].map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{doc.name}</h4>
                        {doc.date && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">Uploaded: {doc.date}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                      {doc.status === 'uploaded' && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      {doc.status === 'pending' && (
                        <Button variant="primary" size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedTab === 'compliance' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Compliance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Compliance</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vendorProfile.complianceStatus)}`}>
                      {vendorProfile.complianceStatus}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { framework: 'NIST SP 800-161', status: 'compliant', score: 85 },
                      { framework: 'ISO 27001', status: 'compliant', score: 92 },
                      { framework: 'SOC 2 Type II', status: 'partial', score: 78 },
                      { framework: 'PCI DSS', status: 'non-compliant', score: 45 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{item.framework}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Score: {item.score}/100</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendorProfile.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center">
                        <Award className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{cert}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Valid until 2025-12-31</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'notifications' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    title: 'Assessment Due Soon', 
                    message: 'Your Security Controls Review is due in 3 days',
                    type: 'warning',
                    date: '2024-02-25'
                  },
                  { 
                    title: 'Document Approved', 
                    message: 'Your Business License has been approved',
                    type: 'success',
                    date: '2024-02-20'
                  },
                  { 
                    title: 'New Assessment Available', 
                    message: 'A new compliance audit has been assigned to you',
                    type: 'info',
                    date: '2024-02-18'
                  },
                  { 
                    title: 'Risk Score Updated', 
                    message: 'Your risk score has been updated to 75',
                    type: 'info',
                    date: '2024-02-15'
                  }
                ].map((notification, index) => (
                  <div key={index} className="flex items-start p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                      notification.type === 'success' ? 'bg-green-500' :
                      notification.type === 'warning' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{notification.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{notification.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;