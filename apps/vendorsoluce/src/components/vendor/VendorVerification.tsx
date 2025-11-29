import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Building, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  Download, 
  User, 
  Mail, 
  Phone,
  FileText,
  Shield,
  Award,
  Calendar,
  Clock,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { vendorService, VendorProfile, VendorContact, VendorDocument, VendorAssessment, VendorCertification } from '../../services/vendorService';
import { logger } from '../../utils/logger';
import './VendorVerification.css';

interface VendorVerificationProps {
  vendorId?: string;
  onVendorVerified?: (vendorId: string, status: 'approved' | 'rejected') => void;
}

// Progress bar component that uses CSS custom properties instead of inline styles
const AssessmentProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
  const progressRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.setProperty('--vendor-verification-progress-width', `${progress}%`);
    }
  }, [progress]);

  return (
    <div className="vendor-verification-progress-bar-container">
      <div 
        ref={progressRef}
        className="vendor-verification-progress-bar-fill"
      />
    </div>
  );
};

const VendorVerification: React.FC<VendorVerificationProps> = ({ 
  vendorId, 
  onVendorVerified 
}) => {
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [contacts, setContacts] = useState<VendorContact[]>([]);
  const [documents, setDocuments] = useState<VendorDocument[]>([]);
  const [assessments, setAssessments] = useState<VendorAssessment[]>([]);
  const [certifications, setCertifications] = useState<VendorCertification[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview');
  // const [searchTerm, setSearchTerm] = useState('');
  // const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (vendorId) {
      loadVendorData(vendorId);
    }
  }, [vendorId]);

  const loadVendorData = async (id: string) => {
    setLoading(true);
    try {
      const [vendorData, contactsData, documentsData, assessmentsData, certificationsData] = await Promise.all([
        vendorService.getVendorProfile(id),
        vendorService.getVendorContacts(id),
        vendorService.getVendorDocuments(id),
        vendorService.getVendorAssessments(id),
        vendorService.getVendorCertifications(id)
      ]);

      setVendor(vendorData);
      setContacts(contactsData);
      setDocuments(documentsData);
      setAssessments(assessmentsData);
      setCertifications(certificationsData);
    } catch (error) {
      logger.error('Error loading vendor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (status: 'approved' | 'rejected') => {
    if (!vendor) return;

    setVerifying(true);
    try {
      await vendorService.verifyVendor(vendor.id, status, verificationNotes);
      setVendor(prev => prev ? { ...prev, status } : null);
      
      if (onVendorVerified) {
        onVendorVerified(vendor.id, status);
      }
      
      setVerificationNotes('');
    } catch (error) {
      logger.error('Error verifying vendor:', error);
      alert('Failed to verify vendor. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'rejected':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'under-review':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
    }
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: 'Low', color: 'text-green-600 dark:text-green-400' };
    if (score >= 60) return { level: 'Medium', color: 'text-yellow-600 dark:text-yellow-400' };
    return { level: 'High', color: 'text-red-600 dark:text-red-400' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vendorsoluce-navy mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading vendor data...</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Vendor Not Found</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The requested vendor could not be found.
            </p>
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const riskLevel = vendor.risk_score ? getRiskLevel(vendor.risk_score) : null;

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
                  {vendor.company_name}
                </h1>
                <div className="flex items-center mt-1 space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vendor.status)}`}>
                    {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {vendor.industry}
                  </span>
                  {riskLevel && (
                    <span className={`text-sm font-medium ${riskLevel.color}`}>
                      {riskLevel.level} Risk
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => loadVendorData(vendor.id)}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              {vendor.status === 'pending' && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVerification('rejected')}
                    disabled={verifying}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleVerification('approved')}
                    disabled={verifying}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Verification Notes */}
        {vendor.status === 'pending' && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                Verification Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="Add notes about your verification decision..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                rows={3}
              />
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: Building },
                { id: 'contacts', label: 'Contacts', icon: User },
                { id: 'documents', label: 'Documents', icon: FileText },
                { id: 'assessments', label: 'Assessments', icon: Shield },
                { id: 'certifications', label: 'Certifications', icon: Award }
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
            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
                    <p className="text-gray-900 dark:text-white">{vendor.company_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Legal Name</label>
                    <p className="text-gray-900 dark:text-white">{vendor.legal_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Industry</label>
                    <p className="text-gray-900 dark:text-white">{vendor.industry}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Company Size</label>
                    <p className="text-gray-900 dark:text-white">{vendor.company_size}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Headquarters</label>
                    <p className="text-gray-900 dark:text-white">{vendor.headquarters}</p>
                  </div>
                  {vendor.website && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Website</label>
                      <p className="text-gray-900 dark:text-white">
                        <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                          {vendor.website}
                        </a>
                      </p>
                    </div>
                  )}
                  {vendor.description && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                      <p className="text-gray-900 dark:text-white">{vendor.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Risk & Compliance */}
            <Card>
              <CardHeader>
                <CardTitle>Risk & Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Risk Score</span>
                    <div className="text-right">
                      {vendor.risk_score ? (
                        <>
                          <span className={`text-2xl font-bold ${riskLevel?.color}`}>
                            {vendor.risk_score}
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {riskLevel?.level} Risk
                          </p>
                        </>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">Not assessed</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Compliance Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vendor.compliance_status)}`}>
                      {vendor.compliance_status}
                    </span>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Created</span>
                      <span className="text-gray-900 dark:text-white">
                        {new Date(vendor.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
                      <span className="text-gray-900 dark:text-white">
                        {new Date(vendor.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedTab === 'contacts' && (
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {contacts.map((contact) => (
                  <div key={contact.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {contact.name}
                          </h4>
                          <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                            contact.type === 'primary' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                            contact.type === 'security' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                            'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
                          }`}>
                            {contact.type.charAt(0).toUpperCase() + contact.type.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{contact.title}</p>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-4 w-4 text-gray-400 mr-2" />
                            <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-800">
                              {contact.email}
                            </a>
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 text-gray-400 mr-2" />
                            <a href={`tel:${contact.phone}`} className="text-blue-600 hover:text-blue-800">
                              {contact.phone}
                            </a>
                          </div>
                        </div>
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
              <CardTitle>Document Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((document) => (
                  <div key={document.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <FileText className="h-5 w-5 text-gray-400 mr-2" />
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {document.title}
                          </h4>
                          <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.status)}`}>
                            {document.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {document.file_name} • {(document.file_size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Uploaded: {new Date(document.uploaded_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Review
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedTab === 'assessments' && (
          <Card>
            <CardHeader>
              <CardTitle>Assessment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assessments.map((assessment) => (
                  <div key={assessment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {assessment.title}
                          </h4>
                          <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assessment.status)}`}>
                            {assessment.status.replace('-', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {assessment.framework} • {assessment.type.replace('-', ' ')}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Due: {new Date(assessment.due_date).toLocaleDateString()}
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
                        <div className="mt-2">
                          <AssessmentProgressBar progress={assessment.progress} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedTab === 'certifications' && (
          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certifications.map((certification) => (
                  <div key={certification.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Award className="h-5 w-5 text-gray-400 mr-2" />
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {certification.name}
                          </h4>
                          <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(certification.status)}`}>
                            {certification.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Issued by: {certification.issuer}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Issued: {new Date(certification.issued_date).toLocaleDateString()}
                          </div>
                          {certification.expiry_date && (
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              Expires: {new Date(certification.expiry_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      {certification.certificate_url && (
                        <div className="ml-4">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      )}
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

export default VendorVerification;