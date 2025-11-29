import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Building, 
  User, 
  FileText, 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Upload,
  AlertTriangle,
  Info,
  Users,
  FileCheck
} from 'lucide-react';
// import { useAuth } from '../../context/AuthContext'; // Not used currently
import { uploadAssessmentEvidence } from '../../utils/supabaseStorage';
import { logger } from '../../utils/logger';

interface VendorOnboardingData {
  // Company Information
  companyName: string;
  legalName: string;
  website: string;
  industry: string;
  companySize: string;
  foundedYear: string;
  headquarters: string;
  description: string;
  
  // Contact Information
  primaryContact: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  securityContact: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  billingContact: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  
  // Business Information
  businessType: string;
  certifications: string[];
  complianceFrameworks: string[];
  dataProcessingActivities: string[];
  securityMeasures: string[];
  
  // Documents
  documents: {
    businessLicense?: File;
    insuranceCertificate?: File;
    securityPolicy?: File;
    complianceCertificate?: File;
    financialStatement?: File;
  };
  
  // Assessment Preferences
  preferredAssessmentType: string;
  assessmentFrequency: string;
  reportingPreferences: string[];
  communicationPreferences: string[];
}

interface VendorOnboardingWizardProps {
  onComplete?: () => void;
}

const VendorOnboardingWizard: React.FC<VendorOnboardingWizardProps> = ({ onComplete }) => {
  // const { user } = useAuth(); // Not used currently
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<VendorOnboardingData>({
    companyName: '',
    legalName: '',
    website: '',
    industry: '',
    companySize: '',
    foundedYear: '',
    headquarters: '',
    description: '',
    primaryContact: {
      name: '',
      title: '',
      email: '',
      phone: ''
    },
    securityContact: {
      name: '',
      title: '',
      email: '',
      phone: ''
    },
    billingContact: {
      name: '',
      title: '',
      email: '',
      phone: ''
    },
    businessType: '',
    certifications: [],
    complianceFrameworks: [],
    dataProcessingActivities: [],
    securityMeasures: [],
    documents: {},
    preferredAssessmentType: '',
    assessmentFrequency: '',
    reportingPreferences: [],
    communicationPreferences: []
  });
  
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    {
      id: 'company-info',
      title: 'Company Information',
      icon: Building,
      description: 'Basic company details and business information'
    },
    {
      id: 'contacts',
      title: 'Contact Information',
      icon: Users,
      description: 'Primary, security, and billing contacts'
    },
    {
      id: 'business-details',
      title: 'Business Details',
      icon: FileText,
      description: 'Industry, certifications, and compliance information'
    },
    {
      id: 'documents',
      title: 'Document Upload',
      icon: Upload,
      description: 'Required business and compliance documents'
    },
    {
      id: 'preferences',
      title: 'Assessment Preferences',
      icon: Shield,
      description: 'Configure your assessment and communication preferences'
    },
    {
      id: 'review',
      title: 'Review & Submit',
      icon: CheckCircle,
      description: 'Review all information before submission'
    }
  ];

  const handleInputChange = (field: string, value: string | number) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof VendorOnboardingData] as Record<string, unknown>),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = prev[field as keyof VendorOnboardingData] as string[];
      if (checked) {
        return {
          ...prev,
          [field]: [...currentArray, value]
        };
      } else {
        return {
          ...prev,
          [field]: currentArray.filter(item => item !== value)
        };
      }
    });
  };

  const handleFileUpload = async (field: string, files: FileList) => {
    const file = files[0];
    if (!file) return;

    setUploading(prev => ({ ...prev, [field]: true }));
    setUploadErrors(prev => ({ ...prev, [field]: '' }));

    try {
      // Validate file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png'
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please upload PDF, DOC, DOCX, JPG, or PNG files only');
      }

      // Upload to Supabase Storage
      await uploadAssessmentEvidence(file, 'vendor-onboarding', field);
      
      // Update form data with file
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [field]: file
        }
      }));

    } catch (error) {
      logger.error('File upload error:', error);
      setUploadErrors(prev => ({
        ...prev,
        [field]: error instanceof Error ? error.message : 'Upload failed'
      }));
    } finally {
      setUploading(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Here you would typically send the data to your backend
      logger.log('Submitting vendor onboarding data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message or redirect
      alert('Vendor onboarding submitted successfully!');
      
      // Call onComplete callback if provided
      if (onComplete) {
        onComplete();
      }
      
    } catch (error) {
      logger.error('Submission error:', error);
      alert('Failed to submit vendor onboarding. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Company Information
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter company name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Legal Name *
                </label>
                <input
                  type="text"
                  value={formData.legalName}
                  onChange={(e) => handleInputChange('legalName', e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter legal company name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="https://example.com"
                />
              </div>
              
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Industry *
                </label>
                <select
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select industry</option>
                  <option value="technology">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="financial">Financial Services</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="government">Government/Public Sector</option>
                  <option value="defense">Defense/Aerospace</option>
                  <option value="energy">Energy/Utilities</option>
                  <option value="retail">Retail/E-commerce</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="companySize" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Size *
                </label>
                <select
                  id="companySize"
                  value={formData.companySize}
                  onChange={(e) => handleInputChange('companySize', e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select size</option>
                  <option value="startup">Startup (1-50 employees)</option>
                  <option value="small">Small Business (51-200 employees)</option>
                  <option value="medium">Medium Business (201-1000 employees)</option>
                  <option value="large">Large Enterprise (1000+ employees)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Founded Year
                </label>
                <input
                  type="number"
                  value={formData.foundedYear}
                  onChange={(e) => handleInputChange('foundedYear', e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="2020"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Headquarters Location *
              </label>
              <input
                type="text"
                value={formData.headquarters}
                onChange={(e) => handleInputChange('headquarters', e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="City, State, Country"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                rows={4}
                placeholder="Brief description of your company and services..."
              />
            </div>
          </div>
        );

      case 1: // Contact Information
        return (
          <div className="space-y-8">
            {/* Primary Contact */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-medium text-blue-900 dark:text-blue-300 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Primary Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="primaryContact-name" className="block text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    id="primaryContact-name"
                    type="text"
                    value={formData.primaryContact.name}
                    onChange={(e) => handleInputChange('primaryContact.name', e.target.value)}
                    className="w-full border border-blue-300 dark:border-blue-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="primaryContact-title" className="block text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                    Title *
                  </label>
                  <input
                    id="primaryContact-title"
                    type="text"
                    value={formData.primaryContact.title}
                    onChange={(e) => handleInputChange('primaryContact.title', e.target.value)}
                    className="w-full border border-blue-300 dark:border-blue-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter job title"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="primaryContact-email" className="block text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                    Email *
                  </label>
                  <input
                    id="primaryContact-email"
                    type="email"
                    value={formData.primaryContact.email}
                    onChange={(e) => handleInputChange('primaryContact.email', e.target.value)}
                    className="w-full border border-blue-300 dark:border-blue-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="primaryContact-phone" className="block text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                    Phone *
                  </label>
                  <input
                    id="primaryContact-phone"
                    type="tel"
                    value={formData.primaryContact.phone}
                    onChange={(e) => handleInputChange('primaryContact.phone', e.target.value)}
                    className="w-full border border-blue-300 dark:border-blue-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Security Contact */}
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="text-lg font-medium text-green-900 dark:text-green-300 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="securityContact-name" className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    id="securityContact-name"
                    type="text"
                    value={formData.securityContact.name}
                    onChange={(e) => handleInputChange('securityContact.name', e.target.value)}
                    className="w-full border border-green-300 dark:border-green-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="securityContact-title" className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                    Title *
                  </label>
                  <input
                    id="securityContact-title"
                    type="text"
                    value={formData.securityContact.title}
                    onChange={(e) => handleInputChange('securityContact.title', e.target.value)}
                    className="w-full border border-green-300 dark:border-green-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter job title"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="securityContact-email" className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                    Email *
                  </label>
                  <input
                    id="securityContact-email"
                    type="email"
                    value={formData.securityContact.email}
                    onChange={(e) => handleInputChange('securityContact.email', e.target.value)}
                    className="w-full border border-green-300 dark:border-green-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="securityContact-phone" className="block text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                    Phone *
                  </label>
                  <input
                    id="securityContact-phone"
                    type="tel"
                    value={formData.securityContact.phone}
                    onChange={(e) => handleInputChange('securityContact.phone', e.target.value)}
                    className="w-full border border-green-300 dark:border-green-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Billing Contact */}
            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
              <h3 className="text-lg font-medium text-purple-900 dark:text-purple-300 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Billing Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="billingContact-name" className="block text-sm font-medium text-purple-800 dark:text-purple-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    id="billingContact-name"
                    type="text"
                    value={formData.billingContact.name}
                    onChange={(e) => handleInputChange('billingContact.name', e.target.value)}
                    className="w-full border border-purple-300 dark:border-purple-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="billingContact-title" className="block text-sm font-medium text-purple-800 dark:text-purple-300 mb-2">
                    Title *
                  </label>
                  <input
                    id="billingContact-title"
                    type="text"
                    value={formData.billingContact.title}
                    onChange={(e) => handleInputChange('billingContact.title', e.target.value)}
                    className="w-full border border-purple-300 dark:border-purple-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter job title"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="billingContact-email" className="block text-sm font-medium text-purple-800 dark:text-purple-300 mb-2">
                    Email *
                  </label>
                  <input
                    id="billingContact-email"
                    type="email"
                    value={formData.billingContact.email}
                    onChange={(e) => handleInputChange('billingContact.email', e.target.value)}
                    className="w-full border border-purple-300 dark:border-purple-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="billingContact-phone" className="block text-sm font-medium text-purple-800 dark:text-purple-300 mb-2">
                    Phone *
                  </label>
                  <input
                    id="billingContact-phone"
                    type="tel"
                    value={formData.billingContact.phone}
                    onChange={(e) => handleInputChange('billingContact.phone', e.target.value)}
                    className="w-full border border-purple-300 dark:border-purple-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Business Details
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Type *
              </label>
              <select
                id="businessType"
                value={formData.businessType}
                onChange={(e) => handleInputChange('businessType', e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select business type</option>
                <option value="vendor">Vendor/Supplier</option>
                <option value="service-provider">Service Provider</option>
                <option value="contractor">Contractor</option>
                <option value="partner">Business Partner</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Certifications & Standards
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  'ISO 27001',
                  'SOC 2 Type II',
                  'PCI DSS',
                  'HIPAA',
                  'GDPR',
                  'CMMC',
                  'NIST 800-171',
                  'FedRAMP',
                  'FISMA',
                  'Other'
                ].map((cert) => (
                  <label key={cert} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.certifications.includes(cert)}
                      onChange={(e) => handleArrayChange('certifications', cert, e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{cert}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Compliance Frameworks
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  'NIST SP 800-161',
                  'NIST Cybersecurity Framework',
                  'CIS Controls',
                  'ISO 27001',
                  'COBIT',
                  'ITIL',
                  'Other'
                ].map((framework) => (
                  <label key={framework} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.complianceFrameworks.includes(framework)}
                      onChange={(e) => handleArrayChange('complianceFrameworks', framework, e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{framework}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Data Processing Activities
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Personal Data Processing',
                  'Financial Data Processing',
                  'Health Information Processing',
                  'Government Data Processing',
                  'Intellectual Property Handling',
                  'Customer Data Management',
                  'Employee Data Processing',
                  'Other Sensitive Data'
                ].map((activity) => (
                  <label key={activity} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.dataProcessingActivities.includes(activity)}
                      onChange={(e) => handleArrayChange('dataProcessingActivities', activity, e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{activity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Security Measures
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Multi-Factor Authentication',
                  'Encryption at Rest',
                  'Encryption in Transit',
                  'Regular Security Audits',
                  'Incident Response Plan',
                  'Data Backup & Recovery',
                  'Access Controls',
                  'Network Security',
                  'Employee Security Training',
                  'Vulnerability Management'
                ].map((measure) => (
                  <label key={measure} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.securityMeasures.includes(measure)}
                      onChange={(e) => handleArrayChange('securityMeasures', measure, e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{measure}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 3: // Document Upload
        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                    Document Requirements
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                    Please upload the following documents. All files must be in PDF, DOC, DOCX, JPG, or PNG format and under 10MB.
                  </p>
                </div>
              </div>
            </div>

            {[
              {
                key: 'businessLicense',
                title: 'Business License',
                description: 'Valid business license or registration certificate',
                required: true
              },
              {
                key: 'insuranceCertificate',
                title: 'Insurance Certificate',
                description: 'Professional liability or general liability insurance',
                required: true
              },
              {
                key: 'securityPolicy',
                title: 'Security Policy',
                description: 'Information security policy document',
                required: false
              },
              {
                key: 'complianceCertificate',
                title: 'Compliance Certificate',
                description: 'Relevant compliance certifications (ISO, SOC, etc.)',
                required: false
              },
              {
                key: 'financialStatement',
                title: 'Financial Statement',
                description: 'Most recent financial statement or annual report',
                required: false
              }
            ].map((doc) => (
              <div key={doc.key} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {doc.title}
                      {doc.required && <span className="text-red-500 ml-1">*</span>}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{doc.description}</p>
                  </div>
                  {formData.documents[doc.key as keyof typeof formData.documents] && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>

                {uploadErrors[doc.key] && (
                  <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                    <div className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-red-700 dark:text-red-400 text-sm">{uploadErrors[doc.key]}</span>
                    </div>
                  </div>
                )}

                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                  <input
                    type="file"
                    id={`file-${doc.key}`}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files && handleFileUpload(doc.key, e.target.files)}
                    className="hidden"
                    disabled={uploading[doc.key]}
                  />
                  <label htmlFor={`file-${doc.key}`} className="cursor-pointer">
                    <div className="text-center">
                      {uploading[doc.key] ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vendorsoluce-navy mx-auto mb-2"></div>
                          <p className="text-sm text-vendorsoluce-navy font-medium">Uploading...</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            PDF, DOC, DOCX, JPG, PNG up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </label>
                </div>

                {formData.documents[doc.key as keyof typeof formData.documents] && (
                  <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                    <div className="flex items-center">
                      <FileCheck className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                      <span className="text-sm text-green-800 dark:text-green-300">
                        {formData.documents[doc.key as keyof typeof formData.documents]?.name}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 4: // Assessment Preferences
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="preferredAssessmentType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preferred Assessment Type *
              </label>
              <select
                id="preferredAssessmentType"
                value={formData.preferredAssessmentType}
                onChange={(e) => handleInputChange('preferredAssessmentType', e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select assessment type</option>
                <option value="self-assessment">Self-Assessment</option>
                <option value="guided-assessment">Guided Assessment</option>
                <option value="third-party-audit">Third-Party Audit</option>
                <option value="hybrid">Hybrid Approach</option>
              </select>
            </div>

            <div>
              <label htmlFor="assessmentFrequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assessment Frequency *
              </label>
              <select
                id="assessmentFrequency"
                value={formData.assessmentFrequency}
                onChange={(e) => handleInputChange('assessmentFrequency', e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select frequency</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="semi-annually">Semi-Annually</option>
                <option value="annually">Annually</option>
                <option value="as-needed">As Needed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Reporting Preferences
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Executive Summary',
                  'Detailed Technical Report',
                  'Compliance Dashboard',
                  'Risk Score Report',
                  'Remediation Recommendations',
                  'Trend Analysis',
                  'Custom Reports'
                ].map((pref) => (
                  <label key={pref} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.reportingPreferences.includes(pref)}
                      onChange={(e) => handleArrayChange('reportingPreferences', pref, e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{pref}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Communication Preferences
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Email Notifications',
                  'SMS Alerts',
                  'Dashboard Updates',
                  'Weekly Reports',
                  'Monthly Reviews',
                  'Quarterly Meetings',
                  'Annual Assessments'
                ].map((pref) => (
                  <label key={pref} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.communicationPreferences.includes(pref)}
                      onChange={(e) => handleArrayChange('communicationPreferences', pref, e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{pref}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 5: // Review & Submit
        return (
          <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-green-800 dark:text-green-300">
                    Ready to Submit
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                    Please review all information before submitting your vendor onboarding application.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Company Information</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Company:</span> {formData.companyName}</div>
                  <div><span className="font-medium">Industry:</span> {formData.industry}</div>
                  <div><span className="font-medium">Size:</span> {formData.companySize}</div>
                  <div><span className="font-medium">Headquarters:</span> {formData.headquarters}</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Primary Contact</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Name:</span> {formData.primaryContact.name}</div>
                  <div><span className="font-medium">Title:</span> {formData.primaryContact.title}</div>
                  <div><span className="font-medium">Email:</span> {formData.primaryContact.email}</div>
                  <div><span className="font-medium">Phone:</span> {formData.primaryContact.phone}</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Assessment Preferences</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Type:</span> {formData.preferredAssessmentType}</div>
                  <div><span className="font-medium">Frequency:</span> {formData.assessmentFrequency}</div>
                  <div><span className="font-medium">Certifications:</span> {formData.certifications.length} selected</div>
                  <div><span className="font-medium">Documents:</span> {Object.values(formData.documents).filter(Boolean).length} uploaded</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Security Measures</h3>
                <div className="text-sm">
                  <div><span className="font-medium">Measures:</span> {formData.securityMeasures.length} selected</div>
                  <div><span className="font-medium">Frameworks:</span> {formData.complianceFrameworks.length} selected</div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Vendor Onboarding
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Complete your vendor registration to start using VendorSoluce
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isCompleted 
                      ? 'bg-vendorsoluce-green border-vendorsoluce-green text-white'
                      : isActive
                      ? 'border-vendorsoluce-navy bg-vendorsoluce-navy text-white'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-2 ${
                      isCompleted ? 'bg-vendorsoluce-green' : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 text-center">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              {steps[currentStep].title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {steps[currentStep].description}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <Card>
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Step {currentStep + 1} of {steps.length}
          </div>

          {currentStep < steps.length - 1 ? (
            <Button
              variant="primary"
              onClick={handleNext}
              className="flex items-center"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Application
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorOnboardingWizard;