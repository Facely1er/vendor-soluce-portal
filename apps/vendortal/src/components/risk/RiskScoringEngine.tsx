import { logger } from '../../utils/logger';
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Calculator, 
  RefreshCw
} from 'lucide-react';
import { RiskAssessment, RiskFactor, Asset, Vendor, AssetVendorRelationship } from '../../types';
import { assetService } from '../../services/assetService';

interface RiskScoringEngineProps {
  assetId?: string;
  vendorId?: string;
  relationshipId?: string;
  onScoreCalculated?: (score: number, assessment: RiskAssessment) => void;
}

const RiskScoringEngine: React.FC<RiskScoringEngineProps> = ({
  assetId,
  vendorId,
  relationshipId,
  onScoreCalculated
}) => {
  const [asset, setAsset] = useState<Asset | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [relationship, setRelationship] = useState<AssetVendorRelationship | null>(null);
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);
  const [calculatedScore, setCalculatedScore] = useState<number>(0);
  const [riskLevel, setRiskLevel] = useState<string>('low');
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (assetId) {
        const assetData = await assetService.getAsset(assetId);
        setAsset(assetData);
      }
      if (vendorId) {
        const vendorData = await assetService.getVendorWithAssets(vendorId);
        setVendor(vendorData);
      }
      if (relationshipId) {
        // Load relationship data
        const relationships = await assetService.getAssetVendorRelationships(assetId || '');
        const rel = relationships.find(r => r.id === relationshipId);
        setRelationship(rel || null);
      }
    } catch (error) {
      logger.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [assetId, vendorId, relationshipId]);

  useEffect(() => {
    if (assetId || vendorId || relationshipId) {
      loadData();
    }
  }, [assetId, vendorId, relationshipId, loadData]);

  const calculateRiskScore = async () => {
    setLoading(true);
    try {
      let score = 0;
      const factors: RiskFactor[] = [];

      // Asset-based risk factors
      if (asset) {
        // Criticality factor
        const criticalityScore = getCriticalityScore(asset.criticality_level);
        factors.push({
          id: 'asset_criticality',
          name: 'Asset Criticality',
          category: 'operational',
          weight: 0.3,
          score: criticalityScore,
          description: `Asset criticality level: ${asset.criticality_level}`,
          evidence: [`Asset criticality: ${asset.criticality_level}`],
          mitigation_controls: ['Implement additional monitoring', 'Regular security assessments']
        });
        score += criticalityScore * 0.3;

        // Business impact factor
        const businessImpactScore = getBusinessImpactScore(asset.business_impact);
        factors.push({
          id: 'business_impact',
          name: 'Business Impact',
          category: 'operational',
          weight: 0.25,
          score: businessImpactScore,
          description: `Business impact level: ${asset.business_impact}`,
          evidence: [`Business impact: ${asset.business_impact}`],
          mitigation_controls: ['Business continuity planning', 'Disaster recovery procedures']
        });
        score += businessImpactScore * 0.25;

        // Data classification factor
        const dataClassificationScore = getDataClassificationScore(asset.data_classification);
        factors.push({
          id: 'data_classification',
          name: 'Data Classification',
          category: 'security',
          weight: 0.2,
          score: dataClassificationScore,
          description: `Data classification: ${asset.data_classification}`,
          evidence: [`Data classification: ${asset.data_classification}`],
          mitigation_controls: ['Data encryption', 'Access controls', 'Data loss prevention']
        });
        score += dataClassificationScore * 0.2;

        // Compliance requirements factor
        const complianceScore = getComplianceScore(asset.compliance_requirements);
        factors.push({
          id: 'compliance_requirements',
          name: 'Compliance Requirements',
          category: 'compliance',
          weight: 0.15,
          score: complianceScore,
          description: `Compliance requirements: ${asset.compliance_requirements.join(', ')}`,
          evidence: asset.compliance_requirements,
          mitigation_controls: ['Regular compliance audits', 'Policy implementation', 'Training programs']
        });
        score += complianceScore * 0.15;

        // Security controls factor
        const securityControlsScore = getSecurityControlsScore(asset.security_controls);
        factors.push({
          id: 'security_controls',
          name: 'Security Controls',
          category: 'security',
          weight: 0.1,
          score: securityControlsScore,
          description: `Security controls implemented: ${asset.security_controls.join(', ')}`,
          evidence: asset.security_controls,
          mitigation_controls: ['Additional security controls', 'Regular security testing']
        });
        score += securityControlsScore * 0.1;
      }

      // Vendor-based risk factors
      if (vendor) {
        const vendorRiskScore = vendor.overall_risk_score || 0;
        factors.push({
          id: 'vendor_risk',
          name: 'Vendor Risk Profile',
          category: 'operational',
          weight: 0.4,
          score: vendorRiskScore,
          description: `Vendor overall risk score: ${vendorRiskScore}`,
          evidence: [`Vendor risk score: ${vendorRiskScore}`],
          mitigation_controls: ['Vendor risk monitoring', 'Regular vendor assessments']
        });
        score += vendorRiskScore * 0.4;

        // Vendor compliance factor
        const vendorComplianceScore = getVendorComplianceScore(vendor.compliance_status);
        factors.push({
          id: 'vendor_compliance',
          name: 'Vendor Compliance Status',
          category: 'compliance',
          weight: 0.3,
          score: vendorComplianceScore,
          description: `Vendor compliance status: ${vendor.compliance_status}`,
          evidence: [`Compliance status: ${vendor.compliance_status}`],
          mitigation_controls: ['Compliance monitoring', 'Vendor training', 'Regular audits']
        });
        score += vendorComplianceScore * 0.3;

        // Vendor industry factor
        const industryRiskScore = getIndustryRiskScore(vendor.industry);
        factors.push({
          id: 'vendor_industry',
          name: 'Vendor Industry Risk',
          category: 'operational',
          weight: 0.3,
          score: industryRiskScore,
          description: `Vendor industry: ${vendor.industry}`,
          evidence: [`Industry: ${vendor.industry}`],
          mitigation_controls: ['Industry-specific controls', 'Regular monitoring']
        });
        score += industryRiskScore * 0.3;
      }

      // Relationship-based risk factors
      if (relationship) {
        const relationshipCriticalityScore = getCriticalityScore(relationship.criticality_to_asset);
        factors.push({
          id: 'relationship_criticality',
          name: 'Relationship Criticality',
          category: 'operational',
          weight: 0.4,
          score: relationshipCriticalityScore,
          description: `Relationship criticality: ${relationship.criticality_to_asset}`,
          evidence: [`Criticality: ${relationship.criticality_to_asset}`],
          mitigation_controls: ['Regular relationship reviews', 'Backup vendor identification']
        });
        score += relationshipCriticalityScore * 0.4;

        const dataAccessScore = getDataAccessScore(relationship.data_access_level);
        factors.push({
          id: 'data_access',
          name: 'Data Access Level',
          category: 'security',
          weight: 0.3,
          score: dataAccessScore,
          description: `Data access level: ${relationship.data_access_level}`,
          evidence: [`Access level: ${relationship.data_access_level}`],
          mitigation_controls: ['Access monitoring', 'Regular access reviews', 'Principle of least privilege']
        });
        score += dataAccessScore * 0.3;

        const integrationScore = getIntegrationRiskScore(relationship.integration_type);
        factors.push({
          id: 'integration_type',
          name: 'Integration Type Risk',
          category: 'security',
          weight: 0.3,
          score: integrationScore,
          description: `Integration type: ${relationship.integration_type}`,
          evidence: [`Integration: ${relationship.integration_type}`],
          mitigation_controls: ['Secure integration protocols', 'Regular security testing']
        });
        score += integrationScore * 0.3;
      }

      const finalScore = Math.min(Math.round(score), 100);
      const level = getRiskLevel(finalScore);

      setCalculatedScore(finalScore);
      setRiskLevel(level);
      setRiskFactors(factors);

      // Create risk assessment
      const assessment: Omit<RiskAssessment, 'id' | 'created_at' | 'updated_at'> = {
        asset_id: assetId,
        vendor_id: vendorId,
        relationship_id: relationshipId,
        assessment_type: assetId && vendorId ? 'combined_risk' : assetId ? 'asset_risk' : 'vendor_risk',
        calculated_score: finalScore,
        risk_level: level as any,
        mitigation_recommendations: generateMitigationRecommendations(factors),
        next_assessment_due: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
        assessed_by: 'system', // In real app, this would be the current user
        assessment_date: new Date().toISOString(),
        status: 'draft'
      };

      onScoreCalculated?.(finalScore, assessment as RiskAssessment);

    } catch (error) {
      logger.error('Error calculating risk score:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCriticalityScore = (level: string): number => {
    switch (level) {
      case 'critical': return 90;
      case 'high': return 70;
      case 'medium': return 50;
      case 'low': return 20;
      default: return 0;
    }
  };

  const getBusinessImpactScore = (level: string): number => {
    switch (level) {
      case 'critical': return 85;
      case 'high': return 65;
      case 'medium': return 45;
      case 'low': return 25;
      default: return 0;
    }
  };

  const getDataClassificationScore = (level: string): number => {
    switch (level) {
      case 'restricted': return 90;
      case 'confidential': return 70;
      case 'internal': return 40;
      case 'public': return 10;
      default: return 0;
    }
  };

  const getComplianceScore = (requirements: string[]): number => {
    if (requirements.length === 0) return 0;
    if (requirements.includes('PCI_DSS') || requirements.includes('SOX')) return 80;
    if (requirements.includes('GDPR') || requirements.includes('CCPA')) return 70;
    if (requirements.length > 2) return 60;
    return 40;
  };

  const getSecurityControlsScore = (controls: string[]): number => {
    if (controls.length === 0) return 100; // No controls = high risk
    if (controls.length >= 5) return 20; // Many controls = low risk
    if (controls.length >= 3) return 40;
    if (controls.length >= 1) return 60;
    return 80;
  };

  const getVendorComplianceScore = (status: string): number => {
    switch (status) {
      case 'compliant': return 20;
      case 'partial': return 60;
      case 'non-compliant': return 90;
      default: return 50;
    }
  };

  const getIndustryRiskScore = (industry: string): number => {
    const highRiskIndustries = ['Financial', 'Healthcare', 'Government', 'Defense'];
    const mediumRiskIndustries = ['Technology', 'Energy', 'Manufacturing'];
    
    if (highRiskIndustries.includes(industry)) return 70;
    if (mediumRiskIndustries.includes(industry)) return 40;
    return 20;
  };

  const getDataAccessScore = (level: string): number => {
    switch (level) {
      case 'full_access': return 90;
      case 'read_write': return 70;
      case 'read_only': return 40;
      case 'none': return 10;
      default: return 50;
    }
  };

  const getIntegrationRiskScore = (type: string): number => {
    switch (type) {
      case 'direct_access': return 90;
      case 'database': return 80;
      case 'api': return 60;
      case 'web_service': return 50;
      case 'file_transfer': return 40;
      case 'cloud_service': return 30;
      default: return 50;
    }
  };

  const getRiskLevel = (score: number): string => {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  const generateMitigationRecommendations = (factors: RiskFactor[]): string[] => {
    const recommendations: string[] = [];
    
    factors.forEach(factor => {
      if (factor.score >= 70) {
        recommendations.push(...factor.mitigation_controls);
      }
    });

    // Add general recommendations based on overall score
    if (calculatedScore >= 80) {
      recommendations.push('Immediate risk mitigation required', 'Consider alternative vendors', 'Implement additional monitoring');
    } else if (calculatedScore >= 60) {
      recommendations.push('Regular risk monitoring', 'Quarterly assessments', 'Enhanced security controls');
    } else if (calculatedScore >= 40) {
      recommendations.push('Annual risk assessment', 'Standard security controls', 'Regular vendor communication');
    }

    return [...new Set(recommendations)]; // Remove duplicates
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Risk Scoring Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Entity Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {asset && (
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Asset</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{asset.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{asset.asset_type}</p>
                </div>
              )}
              {vendor && (
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Vendor</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{vendor.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{vendor.industry}</p>
                </div>
              )}
              {relationship && (
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Relationship</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{relationship.relationship_type}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{relationship.data_access_level}</p>
                </div>
              )}
            </div>

            {/* Calculate Button */}
            <div className="flex justify-center">
              <Button
                onClick={calculateRiskScore}
                disabled={loading}
                className="px-8 py-3"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Calculator className="h-4 w-4 mr-2" />
                )}
                {loading ? 'Calculating...' : 'Calculate Risk Score'}
              </Button>
            </div>

            {/* Risk Score Display */}
            {calculatedScore > 0 && (
              <div className="text-center">
                <div className="inline-flex items-center space-x-4 p-6 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Risk Score</p>
                    <p className="text-4xl font-bold text-gray-900 dark:text-white">{calculatedScore}</p>
                  </div>
                  <div className="w-px h-16 bg-gray-300 dark:bg-gray-600"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Risk Level</p>
                    <span className={`px-3 py-1 rounded-full text-lg font-medium ${getRiskLevelColor(riskLevel)}`}>
                      {riskLevel.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Risk Factors Details */}
            {riskFactors.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Risk Factors</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDetails(!showDetails)}
                  >
                    {showDetails ? 'Hide Details' : 'Show Details'}
                  </Button>
                </div>

                {showDetails && (
                  <div className="space-y-4">
                    {riskFactors.map((factor) => (
                      <div key={factor.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">{factor.name}</h4>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              factor.score >= 70 ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                              factor.score >= 50 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400' :
                              factor.score >= 30 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                              'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            }`}>
                              {factor.score}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Weight: {(factor.weight * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{factor.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Evidence</p>
                            <ul className="text-xs text-gray-600 dark:text-gray-400">
                              {factor.evidence.map((item, index) => (
                                <li key={index}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Mitigation Controls</p>
                            <ul className="text-xs text-gray-600 dark:text-gray-400">
                              {factor.mitigation_controls.map((item, index) => (
                                <li key={index}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskScoringEngine;