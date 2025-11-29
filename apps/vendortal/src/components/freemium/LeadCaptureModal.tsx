import React, { useState } from 'react';
import { X, Mail, Lock, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (email: string) => void;
  title: string;
  description: string;
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  title,
  description,
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !email.includes('@')) {
      return;
    }

    setLoading(true);
    
    try {
      await onCapture(email);
      setSuccess(true);
      
      // Close after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error capturing lead:', error);
      setLoading(false);
    }
  };

  // If user is already authenticated, show upgrade CTA instead
  if (user) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Get More Vendors & Assessments
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You've used your free assessment. Upgrade to unlock unlimited vendors and assessments.
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => window.location.href = '/pricing'}
                variant="primary"
                className="w-full"
              >
                View Pricing Plans
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full"
              >
                Continue Free
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Success!
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Check your email for your detailed report.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {description}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-10 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center">
                <Lock className="h-3 w-3 mr-1" />
                We'll never share your email
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={loading || !email.trim()}
              className="w-full"
            >
              {loading ? 'Sending...' : 'Get Free Report'}
            </Button>
          </form>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
            By submitting, you agree to receive occasional updates about VendorTal.
          </p>
        </div>
      </div>
    </div>
  );
};

