import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { X, Send } from 'lucide-react';
import { logger } from '../../utils/logger';

interface Vendor {
  id: string;
  name: string;
  contact_email?: string;
}

interface Framework {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  estimatedTime: string;
  framework_type: string;
}

interface CreateAssessmentModalProps {
  vendors: Vendor[];
  frameworks: Framework[];
  onClose: () => void;
  onSuccess: (assessmentData: { vendorId: string; frameworkId: string; dueDate: string; instructions?: string }) => void;
}

const CreateAssessmentModal: React.FC<CreateAssessmentModalProps> = ({
  vendors,
  frameworks,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    vendorId: '',
    frameworkId: '',
    assessmentName: '',
    dueDate: '',
    contactEmail: '',
    message: '',
    sendReminders: true,
    allowSaveProgress: true
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const assessmentData = {
        vendorId: formData.vendorId,
        frameworkId: formData.frameworkId,
        dueDate: formData.dueDate,
        instructions: formData.message || undefined
      };
      
      onSuccess(assessmentData);
    } catch (error) {
      logger.error('Error creating assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedVendor = vendors.find(v => v.id === formData.vendorId);
  const selectedFramework = frameworks.find(f => f.id === formData.frameworkId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Create New Security Assessment
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Close modal"
            title="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Vendor Selection */}
            <div>
              <label htmlFor="vendor-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Vendor *
              </label>
              <select
                id="vendor-select"
                value={formData.vendorId}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  vendorId: e.target.value,
                  contactEmail: vendors.find(v => v.id === e.target.value)?.contact_email || ''
                }))}
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
                        ? 'border-vendorsoluce-navy bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, frameworkId: framework.id }))}
                  >
                    <div className="flex items-start">
                      <input
                        type="radio"
                        name="framework"
                        id={`framework-${framework.id}`}
                        value={framework.id}
                        checked={formData.frameworkId === framework.id}
                        onChange={() => {}}
                        className="mt-1 mr-3"
                        aria-label={`Select ${framework.name} framework`}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">{framework.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{framework.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>{framework.questionCount || 0} questions</span>
                          <span>Est. {framework.estimatedTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assessment Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assessment Name
              </label>
              <input
                type="text"
                value={formData.assessmentName}
                onChange={(e) => setFormData(prev => ({ ...prev, assessmentName: e.target.value }))}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder={`${selectedFramework?.name || 'Security'} Assessment - ${selectedVendor?.name || 'Vendor'}`}
              />
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
            </div>

            {/* Due Date */}
            <div>
              <label htmlFor="due-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Due Date *
              </label>
              <input
                id="due-date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Custom Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Custom Message (Optional)
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                rows={3}
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
                  className="h-4 w-4 text-vendorsoluce-navy focus:ring-vendorsoluce-navy border-gray-300 rounded"
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
                  className="h-4 w-4 text-vendorsoluce-navy focus:ring-vendorsoluce-navy border-gray-300 rounded"
                />
                <label htmlFor="allowSaveProgress" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Allow vendor to save progress and resume later
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading || !formData.vendorId || !formData.frameworkId || !formData.contactEmail || !formData.dueDate}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Send Assessment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAssessmentModal;