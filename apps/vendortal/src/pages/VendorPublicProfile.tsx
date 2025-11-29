import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building, Globe, MapPin, Star, Shield, Mail, ArrowLeft, Server, FileJson, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import VendorRatingDisplay from '../components/vendor/VendorRatingDisplay';
import TrustBadges from '../components/vendor/TrustBadges';
import { vendorDirectoryService, PublicVendorProfile } from '../services/vendorDirectoryService';
import { logger } from '../utils/logger';

const VendorPublicProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [vendor, setVendor] = useState<PublicVendorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadVendorProfile();
    }
  }, [id]);

  const loadVendorProfile = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await vendorDirectoryService.getPublicVendorProfile(id);
      setVendor(data);
    } catch (err) {
      logger.error('Error loading vendor profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAssessment = () => {
    // Navigate to request assessment page or show modal
    navigate('/send-questionnaire', { state: { vendorId: id } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Vendor Not Found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This vendor profile is not available or has been removed.
              </p>
              <Button variant="primary" onClick={() => navigate('/directory')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Directory
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate('/directory')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Directory
        </Button>

        {/* Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              {vendor.logo_url && (
                <img
                  src={vendor.logo_url}
                  alt={vendor.company_name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {vendor.company_name}
                </h1>
                {vendor.legal_name && vendor.legal_name !== vendor.company_name && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Legal Name: {vendor.legal_name}
                  </p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                  {vendor.industry && (
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      {vendor.industry}
                    </div>
                  )}
                  {vendor.website && (
                    <a
                      href={vendor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:text-vendortal-purple"
                    >
                      <Globe className="w-4 h-4" />
                      Website
                    </a>
                  )}
                  {vendor.headquarters && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {vendor.headquarters}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating & Badges */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <VendorRatingDisplay
              vendorId={vendor.id}
              industry={vendor.industry}
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
                  vendorRating={vendor.vendor_rating}
                  securityPostureScore={vendor.security_posture_score}
                  frameworks={vendor.service_types || []}
                  sbomComplianceStatus={vendor.sbom_compliance_status}
                  assetCount={vendor.asset_count}
                  criticalAssetsCount={vendor.critical_assets_count}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Asset & SBOM Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Asset Relationships */}
          {vendor.asset_count !== undefined && vendor.asset_count > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-vendortal-purple" />
                  Asset Relationships
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Assets</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {vendor.asset_count}
                    </span>
                  </div>
                  {vendor.critical_assets_count !== undefined && vendor.critical_assets_count > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        Critical Assets
                      </span>
                      <span className="font-semibold text-orange-600 dark:text-orange-400">
                        {vendor.critical_assets_count}
                      </span>
                    </div>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    This vendor manages {vendor.asset_count} asset{vendor.asset_count > 1 ? 's' : ''} in your organization.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* SBOM Compliance */}
          {vendor.sbom_compliance_status && vendor.sbom_compliance_status !== 'not-assessed' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileJson className="w-5 h-5 text-vendortal-purple" />
                  SBOM Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Status</span>
                    <span
                      className={`font-semibold ${
                        vendor.sbom_compliance_status === 'compliant'
                          ? 'text-green-600 dark:text-green-400'
                          : vendor.sbom_compliance_status === 'partial'
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {vendor.sbom_compliance_status === 'compliant'
                        ? 'Compliant'
                        : vendor.sbom_compliance_status === 'partial'
                        ? 'Partial'
                        : 'Non-Compliant'}
                    </span>
                  </div>
                  {vendor.sbom_risk_score !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Risk Score</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {vendor.sbom_risk_score.toFixed(1)}/100
                      </span>
                    </div>
                  )}
                  {vendor.sbom_analyses_count !== undefined && vendor.sbom_analyses_count > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Analyses</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {vendor.sbom_analyses_count}
                      </span>
                    </div>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Software Bill of Materials compliance status based on vulnerability analysis.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Description */}
        {vendor.description && (
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {vendor.description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Service Types */}
        {vendor.service_types && vendor.service_types.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Service Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {vendor.service_types.map((type) => (
                  <span
                    key={type}
                    className="px-3 py-1 bg-vendortal-purple/10 text-vendortal-purple rounded-full text-sm"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Data Types */}
        {vendor.data_types_accessed && vendor.data_types_accessed.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Data Types Accessed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {vendor.data_types_accessed.map((type) => (
                  <span
                    key={type}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* CTA */}
        <Card className="bg-vendortal-pale-purple/10 border-vendortal-purple/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Request Assessment
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Send a security assessment questionnaire to this vendor
                </p>
              </div>
              <Button variant="primary" onClick={handleRequestAssessment}>
                <Mail className="w-4 h-4 mr-2" />
                Request Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorPublicProfile;

