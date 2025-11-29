import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Building, Globe, MapPin, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import ServiceTypeSelector from '../components/vendor/ServiceTypeSelector';
import DataTypeSelector from '../components/vendor/DataTypeSelector';
import SectorGuidancePanel from '../components/vendor/SectorGuidancePanel';
import AssessmentRecommender from '../components/vendor/AssessmentRecommender';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';

const VendorProfileSetupPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [headquarters, setHeadquarters] = useState('');
  const [description, setDescription] = useState('');
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [dataTypes, setDataTypes] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [directoryListingEnabled, setDirectoryListingEnabled] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (location.state?.companyName) {
      setCompanyName(location.state.companyName);
    }
  }, [location.state]);

  const handleNext = () => {
    if (step === 1) {
      if (!companyName.trim()) {
        setError('Please enter your company name');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (serviceTypes.length === 0) {
        setError('Please select at least one service type');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (dataTypes.length === 0) {
        setError('Please select at least one data type');
        return;
      }
      setStep(4);
    }
    setError('');
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('You must be logged in to create a vendor profile');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Create vendor profile
      const { data, error: profileError } = await supabase
        .from('vs_vendor_profiles')
        .insert({
          user_id: user.id,
          company_name: companyName,
          legal_name: legalName || companyName,
          website: website || undefined,
          industry: industry || undefined,
          company_size: companySize || undefined,
          headquarters: headquarters || undefined,
          description: description || undefined,
          service_types: serviceTypes,
          data_types_accessed: dataTypes,
          is_public: isPublic,
          directory_listing_enabled: directoryListingEnabled,
          account_type: 'vendor',
          status: 'pending',
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Update user profile account type
      await supabase
        .from('vs_profiles')
        .update({ account_type: 'vendor' })
        .eq('id', user.id);

      navigate('/vendor/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create vendor profile');
      logger.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const totalSteps = 4;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round((step / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-vendortal-purple h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-start border border-red-200 dark:border-red-800">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-red-600 dark:text-red-400 text-sm">{error}</span>
          </div>
        )}

        {/* Step 1: Company Information */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5 text-vendortal-purple" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vendortal-purple"
                  placeholder="Acme Corporation"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Legal Name
                </label>
                <input
                  type="text"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vendortal-purple"
                  placeholder="Acme Corporation Inc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vendortal-purple"
                    placeholder="https://www.example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Industry
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vendortal-purple"
                    aria-label="Select industry"
                    title="Select industry"
                  >
                    <option value="">Select Industry</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Financial Services">Financial Services</option>
                    <option value="Technology">Technology</option>
                    <option value="Business Operations">Business Operations</option>
                    <option value="Analytics">Analytics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company Size
                  </label>
                  <select
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vendortal-purple"
                    aria-label="Select company size"
                    title="Select company size"
                  >
                    <option value="">Select Size</option>
                    <option value="startup">Startup (1-10)</option>
                    <option value="small">Small (11-50)</option>
                    <option value="medium">Medium (51-200)</option>
                    <option value="large">Large (201-1000)</option>
                    <option value="enterprise">Enterprise (1000+)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Headquarters
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={headquarters}
                    onChange={(e) => setHeadquarters(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vendortal-purple"
                    placeholder="San Francisco, CA, USA"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vendortal-purple"
                  placeholder="Brief description of your company and services..."
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Service Types */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Service Types</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Select the types of services your company provides
              </p>
            </CardHeader>
            <CardContent>
              <ServiceTypeSelector
                selectedTypes={serviceTypes}
                onChange={setServiceTypes}
              />
            </CardContent>
          </Card>
        )}

        {/* Step 3: Data Types */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Data Types Accessed</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Select the types of data your services access or process
              </p>
            </CardHeader>
            <CardContent>
              <DataTypeSelector
                selectedTypes={dataTypes}
                onChange={setDataTypes}
              />
            </CardContent>
          </Card>
        )}

        {/* Step 4: Guidance & Directory */}
        {step === 4 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sector-Specific Guidance</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Based on your selections, here's guidance tailored to your profile
                </p>
              </CardHeader>
              <CardContent>
                <SectorGuidancePanel
                  vendorProfile={{
                    service_types: serviceTypes,
                    data_types_accessed: dataTypes,
                    industry,
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assessment Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <AssessmentRecommender
                  serviceTypes={serviceTypes}
                  dataTypes={dataTypes}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Directory Listing Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="w-4 h-4 text-vendortal-purple rounded focus:ring-vendortal-purple"
                  />
                  <label htmlFor="isPublic" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Make profile public
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="directoryListing"
                    checked={directoryListingEnabled}
                    onChange={(e) => setDirectoryListingEnabled(e.target.checked)}
                    disabled={!isPublic}
                    className="w-4 h-4 text-vendortal-purple rounded focus:ring-vendortal-purple disabled:opacity-50"
                  />
                  <label
                    htmlFor="directoryListing"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Enable directory listing (requires public profile)
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            Back
          </Button>
          {step < totalSteps ? (
            <Button variant="primary" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Creating Profile...' : 'Complete Setup'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorProfileSetupPage;

