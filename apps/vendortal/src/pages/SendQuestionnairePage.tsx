import { logger } from '../utils/logger';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Send, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Mail,
  FileText,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useVendors } from '../hooks/useVendors';
import { useVendorAssessments } from '../hooks/useVendorAssessments';
import BackToDashboardLink from '../components/common/BackToDashboardLink';

const SendQuestionnairePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { vendors, loading: vendorsLoading } = useVendors();
  const { 
    frameworks, 
    loading: frameworksLoading, 
    frameworksError,
    createAssessment,
    sendAssessment,
  } = useVendorAssessments();

  const [formData, setFormData] = useState({
    vendorId: '',
    frameworkId: '',
    dueDate: '',
    contactEmail: '',
    message: '',
    sendReminders: true,
    allowSaveProgress: true
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdAssessmentId, setCreatedAssessmentId] = useState<string | null>(null);

  const selectedVendor = vendors.find(v => v.id === formData.vendorId);
  const selectedFramework = frameworks.find(f => f.id === formData.frameworkId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      if (!selectedVendor || !selectedFramework) {
        throw new Error('Please select both vendor and framework');
      }

      const assessmentName = `${selectedFramework.name} Assessment - ${selectedVendor.name}`;
      
      // Create assessment
      const assessment = await createAssessment({
        vendor_id: formData.vendorId,
        framework_id: formData.frameworkId,
        assessment_name: assessmentName,
        due_date: formData.dueDate,
        contact_email: formData.contactEmail || selectedVendor.contact_email || '',
        custom_message: formData.message || null,
        send_reminders: formData.sendReminders,
        allow_save_progress: formData.allowSaveProgress
      });

      // Send assessment immediately
      await sendAssessment(assessment.id);
      
      setCreatedAssessmentId(assessment.id);
      setSuccess(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send questionnaire';
      logger.error('Error sending questionnaire:', err);
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVendorChange = (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    setFormData(prev => ({
      ...prev,
      vendorId,
      contactEmail: vendor?.contact_email || ''
    }));
  };

  const isLoading = vendorsLoading || frameworksLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vendortal-purple"></div>
        </div>
      </div>
    );
  }

  if (success && createdAssessmentId) {
    const assessmentUrl = `${window.location.origin}/vendor-assessments/${createdAssessmentId}`;
    
    return (
      <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <BackToDashboardLink />
        
        <Card className="mt-8 border-l-4 border-l-green-500">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Questionnaire Sent Successfully!
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                The security questionnaire has been sent to <strong>{selectedVendor?.name}</strong>.
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                  Shareable Link
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  The vendor can access the questionnaire using this link:
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={assessmentUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(assessmentUrl);
                      alert('Link copied to clipboard!');
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  onClick={() => navigate('/vendor-assessments')}
                >
                  View All Assessments
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSuccess(false);
                    setFormData({
                      vendorId: '',
                      frameworkId: '',
                      dueDate: '',
                      contactEmail: '',
                      message: '',
                      sendReminders: true,
                      allowSaveProgress: true
                    });
                    setCreatedAssessmentId(null);
                  }}
                >
                  Send Another
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <BackToDashboardLink />
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Shield className="h-6 w-6 text-vendortal-purple mr-2" />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            Send Questionnaire
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Send Security Questionnaire
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Quickly send a security questionnaire to a vendor for due diligence
        </p>
      </div>

      {frameworksError && (
        <Card className="mb-6 border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800 dark:text-yellow-300">
                <strong>Warning:</strong> {frameworksError}. You may not be able to send questionnaires until this is resolved.
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="mb-6 border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800 dark:text-red-300">
                <strong>Error:</strong> {error}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Questionnaire Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vendor Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Vendor *
              </label>
              <select
                value={formData.vendorId}
                onChange={(e) => handleVendorChange(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              >
                <option value="">Choose a vendor...</option>
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </option>
                ))}
              </select>
              {vendors.length === 0 && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  No vendors found. <Link to="/admin/vendors" className="text-blue-600 dark:text-blue-400 hover:underline">Add a vendor</Link> first.
                </p>
              )}
            </div>

            {/* Framework Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assessment Framework *
              </label>
              <div className="space-y-3">
                {frameworks.map((framework) => (
                  <div
                    key={framework.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      formData.frameworkId === framework.id
                        ? 'border-vendortal-navy bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, frameworkId: framework.id }))}
                  >
                    <div className="flex items-start">
                      <input
                        type="radio"
                        name="framework"
                        value={framework.id}
                        checked={formData.frameworkId === framework.id}
                        onChange={() => {}}
                        className="mt-1 mr-3"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">{framework.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{framework.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            {framework.question_count || 0} questions
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Est. {framework.estimated_time || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {frameworks.length === 0 && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  No assessment frameworks available.
                </p>
              )}
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Vendor Contact Email *
              </label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="security@vendor.com"
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                The vendor will receive an email notification at this address
              </p>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Due Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md pl-10 pr-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            {/* Custom Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Custom Message (Optional)
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Add any specific instructions or context for the vendor..."
              />
            </div>

            {/* Options */}
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="sendReminders"
                  checked={formData.sendReminders}
                  onChange={(e) => setFormData(prev => ({ ...prev, sendReminders: e.target.checked }))}
                  className="h-4 w-4 text-vendortal-navy focus:ring-vendortal-navy border-gray-300 rounded"
                />
                <label htmlFor="sendReminders" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Send automatic reminders before due date
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allowSaveProgress"
                  checked={formData.allowSaveProgress}
                  onChange={(e) => setFormData(prev => ({ ...prev, allowSaveProgress: e.target.checked }))}
                  className="h-4 w-4 text-vendortal-navy focus:ring-vendortal-navy border-gray-300 rounded"
                />
                <label htmlFor="allowSaveProgress" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Allow vendor to save progress and resume later
                </label>
              </div>
            </div>

            {/* Preview Section */}
            {selectedVendor && selectedFramework && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Preview</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>Vendor:</strong> {selectedVendor.name}</p>
                  <p><strong>Framework:</strong> {selectedFramework.name}</p>
                  <p><strong>Questions:</strong> {selectedFramework.question_count || 0}</p>
                  <p><strong>Estimated Time:</strong> {selectedFramework.estimated_time || 'N/A'}</p>
                  {formData.dueDate && (
                    <p><strong>Due Date:</strong> {new Date(formData.dueDate).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Link to="/vendor-assessments">
                <Button type="button" variant="outline" disabled={submitting}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                variant="primary"
                disabled={submitting || !formData.vendorId || !formData.frameworkId || !formData.contactEmail || !formData.dueDate || vendors.length === 0 || frameworks.length === 0}
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Send Questionnaire
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default SendQuestionnairePage;

