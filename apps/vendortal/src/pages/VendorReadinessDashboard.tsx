import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, AlertCircle, TrendingUp, FileText, Star, Eye, EyeOff } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import VendorRatingDisplay from '../components/vendor/VendorRatingDisplay';
import TrustBadges from '../components/vendor/TrustBadges';
import SectorGuidancePanel from '../components/vendor/SectorGuidancePanel';
import AssessmentRecommender from '../components/vendor/AssessmentRecommender';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';

const VendorReadinessDashboard: React.FC = () => {
  const [vendorProfile, setVendorProfile] = useState<any>(null);
  const [proactiveAssessments, setProactiveAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadVendorProfile();
      loadProactiveAssessments();
    }
  }, [user]);

  const loadVendorProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('vs_vendor_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setVendorProfile(data);
    } catch (err) {
      logger.error('Error loading vendor profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadProactiveAssessments = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('vs_vendor_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) return;

      const { data, error } = await supabase
        .from('vs_proactive_assessments')
        .select('*, framework:vs_assessment_frameworks(*)')
        .eq('vendor_profile_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProactiveAssessments(data || []);
    } catch (err) {
      logger.error('Error loading proactive assessments:', err);
    }
  };

  const toggleDirectoryListing = async () => {
    if (!vendorProfile || !user) return;

    try {
      const { error } = await supabase
        .from('vs_vendor_profiles')
        .update({
          directory_listing_enabled: !vendorProfile.directory_listing_enabled,
          is_public: !vendorProfile.directory_listing_enabled ? true : vendorProfile.is_public,
        })
        .eq('id', vendorProfile.id);

      if (error) throw error;
      await loadVendorProfile();
    } catch (err) {
      logger.error('Error toggling directory listing:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!vendorProfile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Vendor Profile Not Found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Please complete your vendor profile setup first.
              </p>
              <Button variant="primary" onClick={() => navigate('/vendor/profile/setup')}>
                Setup Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Vendor Readiness Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your security posture and get discovered by organizations
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={vendorProfile.directory_listing_enabled ? 'primary' : 'outline'}
              onClick={toggleDirectoryListing}
            >
              {vendorProfile.directory_listing_enabled ? (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Listed in Directory
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Not Listed
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => navigate('/vendor/assessments/proactive')}>
              <FileText className="w-4 h-4 mr-2" />
              New Assessment
            </Button>
          </div>
        </div>

        {/* Rating & Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <VendorRatingDisplay
              vendorId={vendorProfile.id}
              industry={vendorProfile.industry}
              showBreakdown={true}
              showBenchmark={true}
            />
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Trust Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <TrustBadges
                  vendorRating={vendorProfile.vendor_rating}
                  complianceStatus={vendorProfile.compliance_status}
                  securityPostureScore={vendorProfile.security_posture_score}
                  frameworks={vendorProfile.service_types || []}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Security Posture Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-vendortal-purple" />
              Security Posture Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {vendorProfile.security_posture_score || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Security Posture Score</div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {proactiveAssessments.filter((a) => a.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Completed Assessments</div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {vendorProfile.vendor_rating ? Math.round(vendorProfile.vendor_rating) : 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Overall Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Assessments */}
        {vendorProfile.service_types && vendorProfile.service_types.length > 0 && (
          <AssessmentRecommender
            serviceTypes={vendorProfile.service_types}
            dataTypes={vendorProfile.data_types_accessed || []}
            onStartAssessment={(assessmentName) => {
              navigate('/vendor/assessments/proactive', { state: { assessmentName } });
            }}
          />
        )}

        {/* Sector Guidance */}
        {vendorProfile.service_types && vendorProfile.service_types.length > 0 && (
          <SectorGuidancePanel
            vendorProfile={{
              service_types: vendorProfile.service_types,
              data_types_accessed: vendorProfile.data_types_accessed || [],
              industry: vendorProfile.industry,
            }}
          />
        )}

        {/* Assessment History */}
        <Card>
          <CardHeader>
            <CardTitle>Assessment History</CardTitle>
          </CardHeader>
          <CardContent>
            {proactiveAssessments.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No proactive assessments yet. Start your first assessment to improve your rating.
                </p>
                <Button variant="primary" onClick={() => navigate('/vendor/assessments/proactive')}>
                  Start Assessment
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {proactiveAssessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-vendortal-purple transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {assessment.assessment_name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {assessment.framework?.name || 'Framework'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Completed: {new Date(assessment.completed_at || assessment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-vendortal-purple">
                          {assessment.overall_score || 0}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">Score</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorReadinessDashboard;

