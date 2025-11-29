import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Send, Database, Shield, Eye, Lock, Globe, FileText, Users, AlertTriangle, Zap, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import RiskBadge from '../../components/ui/RiskBadge';
import { useTranslation } from 'react-i18next';
import { useVendors } from '../../hooks/useVendors';
import { useAuth } from '../../context/AuthContext';
import LazyChart from '../../components/charts/LazyChart';
import BackToDashboardLink from '../../components/common/BackToDashboardLink';
import { logger } from '../../utils/logger';

interface RiskDimension {
  id: string;
  name: string;
  shortName: string;
  description: string;
  weight: number;
  value: number;
  icon: React.ReactNode;
  privacyRegulations: string[];
  protectionRequirements: string[];
}

interface VendorCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  commonUseCase: string;
  riskTemplate: { [key: string]: number };
  privacyImpact: string;
  commonRegulations: string[];
}

interface RadarData {
  dimension: string;
  risk: number;
  required: number;
  fullMark: 100;
}

const VendorRiskRadar: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { createVendor } = useVendors();
  const [vendorName, setVendorName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [calculationComplete, setCalculationComplete] = useState(false);
  const [riskScore, setRiskScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Vendor categorization schemes using translations
  const vendorCategories: VendorCategory[] = useMemo(() => [
    {
      id: 'cloud_storage',
      name: t('vendorRiskRadar.vendorCategories.cloudStorage.name'),
      description: t('vendorRiskRadar.vendorCategories.cloudStorage.description'),
      icon: <Database className="h-5 w-5 text-blue-600" />,
      commonUseCase: t('vendorRiskRadar.vendorCategories.cloudStorage.commonUseCase'),
      riskTemplate: {
        data_sensitivity: 4,
        access_control: 3,
        data_residency: 4,
        retention_control: 3,
        encryption_standards: 2,
        compliance_framework: 3
      },
      privacyImpact: t('vendorRiskRadar.vendorCategories.cloudStorage.privacyImpact'),
      commonRegulations: t('vendorRiskRadar.vendorCategories.cloudStorage.commonRegulations', { returnObjects: true }) as string[]
    },
    {
      id: 'payment_processor',
      name: t('vendorRiskRadar.vendorCategories.paymentProcessor.name'),
      description: t('vendorRiskRadar.vendorCategories.paymentProcessor.description'),
      icon: <Shield className="h-5 w-5 text-green-600" />,
      commonUseCase: t('vendorRiskRadar.vendorCategories.paymentProcessor.commonUseCase'),
      riskTemplate: {
        data_sensitivity: 5,
        access_control: 4,
        data_residency: 3,
        retention_control: 4,
        encryption_standards: 5,
        compliance_framework: 5
      },
      privacyImpact: t('vendorRiskRadar.vendorCategories.paymentProcessor.privacyImpact'),
      commonRegulations: t('vendorRiskRadar.vendorCategories.paymentProcessor.commonRegulations', { returnObjects: true }) as string[]
    },
    {
      id: 'hr_software',
      name: t('vendorRiskRadar.vendorCategories.hrSoftware.name'),
      description: t('vendorRiskRadar.vendorCategories.hrSoftware.description'),
      icon: <Users className="h-5 w-5 text-purple-600" />,
      commonUseCase: t('vendorRiskRadar.vendorCategories.hrSoftware.commonUseCase'),
      riskTemplate: {
        data_sensitivity: 5,
        access_control: 4,
        data_residency: 3,
        retention_control: 4,
        encryption_standards: 3,
        compliance_framework: 4
      },
      privacyImpact: t('vendorRiskRadar.vendorCategories.hrSoftware.privacyImpact'),
      commonRegulations: t('vendorRiskRadar.vendorCategories.hrSoftware.commonRegulations', { returnObjects: true }) as string[]
    },
    {
      id: 'saas_productivity',
      name: t('vendorRiskRadar.vendorCategories.saasProductivity.name'),
      description: t('vendorRiskRadar.vendorCategories.saasProductivity.description'),
      icon: <Zap className="h-5 w-5 text-orange-600" />,
      commonUseCase: t('vendorRiskRadar.vendorCategories.saasProductivity.commonUseCase'),
      riskTemplate: {
        data_sensitivity: 3,
        access_control: 3,
        data_residency: 2,
        retention_control: 2,
        encryption_standards: 2,
        compliance_framework: 2
      },
      privacyImpact: t('vendorRiskRadar.vendorCategories.saasProductivity.privacyImpact'),
      commonRegulations: t('vendorRiskRadar.vendorCategories.saasProductivity.commonRegulations', { returnObjects: true }) as string[]
    },
    {
      id: 'analytics_marketing',
      name: t('vendorRiskRadar.vendorCategories.analyticsMarketing.name'),
      description: t('vendorRiskRadar.vendorCategories.analyticsMarketing.description'),
      icon: <Eye className="h-5 w-5 text-pink-600" />,
      commonUseCase: t('vendorRiskRadar.vendorCategories.analyticsMarketing.commonUseCase'),
      riskTemplate: {
        data_sensitivity: 4,
        access_control: 2,
        data_residency: 4,
        retention_control: 2,
        encryption_standards: 2,
        compliance_framework: 3
      },
      privacyImpact: t('vendorRiskRadar.vendorCategories.analyticsMarketing.privacyImpact'),
      commonRegulations: t('vendorRiskRadar.vendorCategories.analyticsMarketing.commonRegulations', { returnObjects: true }) as string[]
    },
    {
      id: 'infrastructure',
      name: t('vendorRiskRadar.vendorCategories.infrastructure.name'),
      description: t('vendorRiskRadar.vendorCategories.infrastructure.description'),
      icon: <Building className="h-5 w-5 text-gray-600" />,
      commonUseCase: t('vendorRiskRadar.vendorCategories.infrastructure.commonUseCase'),
      riskTemplate: {
        data_sensitivity: 3,
        access_control: 4,
        data_residency: 4,
        retention_control: 3,
        encryption_standards: 4,
        compliance_framework: 4
      },
      privacyImpact: t('vendorRiskRadar.vendorCategories.infrastructure.privacyImpact'),
      commonRegulations: t('vendorRiskRadar.vendorCategories.infrastructure.commonRegulations', { returnObjects: true }) as string[]
    }
  ], [t]);

  // Risk dimensions focused on data privacy and protection using translations
  const [riskDimensions, setRiskDimensions] = useState<RiskDimension[]>([
    {
      id: 'data_sensitivity',
      name: t('vendorRiskRadar.riskDimensions.dataSensitivity.name'),
      shortName: t('vendorRiskRadar.riskDimensions.dataSensitivity.shortName'),
      description: t('vendorRiskRadar.riskDimensions.dataSensitivity.description'),
      weight: 5,
      value: 1,
      icon: <Database className="h-5 w-5 text-red-600" />,
      privacyRegulations: t('vendorRiskRadar.riskDimensions.dataSensitivity.privacyRegulations', { returnObjects: true }) as string[],
      protectionRequirements: t('vendorRiskRadar.riskDimensions.dataSensitivity.protectionRequirements', { returnObjects: true }) as string[]
    },
    {
      id: 'access_control',
      name: t('vendorRiskRadar.riskDimensions.accessControl.name'),
      shortName: t('vendorRiskRadar.riskDimensions.accessControl.shortName'),
      description: t('vendorRiskRadar.riskDimensions.accessControl.description'),
      weight: 4,
      value: 1,
      icon: <Lock className="h-5 w-5 text-blue-600" />,
      privacyRegulations: t('vendorRiskRadar.riskDimensions.accessControl.privacyRegulations', { returnObjects: true }) as string[],
      protectionRequirements: t('vendorRiskRadar.riskDimensions.accessControl.protectionRequirements', { returnObjects: true }) as string[]
    },
    {
      id: 'data_residency',
      name: t('vendorRiskRadar.riskDimensions.dataResidency.name'),
      shortName: t('vendorRiskRadar.riskDimensions.dataResidency.shortName'),
      description: t('vendorRiskRadar.riskDimensions.dataResidency.description'),
      weight: 4,
      value: 1,
      icon: <Globe className="h-5 w-5 text-green-600" />,
      privacyRegulations: t('vendorRiskRadar.riskDimensions.dataResidency.privacyRegulations', { returnObjects: true }) as string[],
      protectionRequirements: t('vendorRiskRadar.riskDimensions.dataResidency.protectionRequirements', { returnObjects: true }) as string[]
    },
    {
      id: 'retention_control',
      name: t('vendorRiskRadar.riskDimensions.retentionControl.name'),
      shortName: t('vendorRiskRadar.riskDimensions.retentionControl.shortName'),
      description: t('vendorRiskRadar.riskDimensions.retentionControl.description'),
      weight: 3,
      value: 1,
      icon: <FileText className="h-5 w-5 text-purple-600" />,
      privacyRegulations: t('vendorRiskRadar.riskDimensions.retentionControl.privacyRegulations', { returnObjects: true }) as string[],
      protectionRequirements: t('vendorRiskRadar.riskDimensions.retentionControl.protectionRequirements', { returnObjects: true }) as string[]
    },
    {
      id: 'encryption_standards',
      name: t('vendorRiskRadar.riskDimensions.encryptionStandards.name'),
      shortName: t('vendorRiskRadar.riskDimensions.encryptionStandards.shortName'),
      description: t('vendorRiskRadar.riskDimensions.encryptionStandards.description'),
      weight: 4,
      value: 1,
      icon: <Shield className="h-5 w-5 text-orange-600" />,
      privacyRegulations: t('vendorRiskRadar.riskDimensions.encryptionStandards.privacyRegulations', { returnObjects: true }) as string[],
      protectionRequirements: t('vendorRiskRadar.riskDimensions.encryptionStandards.protectionRequirements', { returnObjects: true }) as string[]
    },
    {
      id: 'compliance_framework',
      name: t('vendorRiskRadar.riskDimensions.complianceFramework.name'),
      shortName: t('vendorRiskRadar.riskDimensions.complianceFramework.shortName'),
      description: t('vendorRiskRadar.riskDimensions.complianceFramework.description'),
      weight: 3,
      value: 1,
      icon: <Eye className="h-5 w-5 text-teal-600" />,
      privacyRegulations: t('vendorRiskRadar.riskDimensions.complianceFramework.privacyRegulations', { returnObjects: true }) as string[],
      protectionRequirements: t('vendorRiskRadar.riskDimensions.complianceFramework.protectionRequirements', { returnObjects: true }) as string[]
    }
  ]);

  // Handle category selection and apply template
  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    const category = vendorCategories.find(c => c.id === categoryId);
    if (category) {
      setRiskDimensions(prev => 
        prev.map(dimension => ({
          ...dimension,
          value: category.riskTemplate[dimension.id] || 1
        }))
      );
    }
  }, [vendorCategories]);

  const handleRiskDimensionChange = (id: string, value: number) => {
    setRiskDimensions(prev => 
      prev.map(dimension => 
        dimension.id === id ? { ...dimension, value } : dimension
      )
    );
  };

  // Generate radar chart data
  const generateRadarData = (): RadarData[] => {
    return riskDimensions.map(dimension => ({
      dimension: dimension.shortName,
      risk: dimension.value * 20, // Convert 1-5 scale to 0-100
      required: getRequiredControlLevel(dimension.id) * 20,
      fullMark: 100
    }));
  };

  // Determine required control level based on risk
  const getRequiredControlLevel = (dimensionId: string): number => {
    const dimension = riskDimensions.find(d => d.id === dimensionId);
    if (!dimension) return 1;
    
    // Required controls should be inverse of risk (high risk = high controls needed)
    return Math.min(5, dimension.value + 1);
  };

  const calculateRiskScore = async () => {
    if (!vendorName.trim()) {
      setError(t('vendorRiskRadar.errors.enterVendorName'));
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Calculate weighted risk score
      let totalWeight = 0;
      let weightedSum = 0;
      
      riskDimensions.forEach(dimension => {
        totalWeight += dimension.weight;
        weightedSum += dimension.weight * dimension.value;
      });
      
      const maxPossibleScore = totalWeight * 5;
      const calculatedRiskScore = Math.round((weightedSum / maxPossibleScore) * 100);
      
      setRiskScore(calculatedRiskScore);
      
      // Generate privacy compliance assessment
      const complianceGaps = generateComplianceAssessment();
      
      // Save to database if user is authenticated
      if (isAuthenticated) {
        const riskLevel = getRiskLevel(calculatedRiskScore);
        const selectedCat = vendorCategories.find(c => c.id === selectedCategory);
        
        await createVendor({
          name: vendorName,
          risk_score: calculatedRiskScore,
          risk_level: riskLevel,
          compliance_status: riskLevel === 'Low' ? 'Compliant' : 
                            riskLevel === 'Medium' ? 'Partial' : 'Non-Compliant',
          notes: `Category: ${selectedCat?.name || 'Custom'} | Privacy Impact: ${selectedCat?.privacyImpact || 'To be assessed'} | Compliance Gaps: ${complianceGaps.join(', ')}`
        });
      }
      
      setCalculationComplete(true);
    } catch (err) {
      logger.error('Error calculating risk:', err);
      setError(err instanceof Error ? err.message : t('vendorRiskRadar.errors.calculationFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const generateComplianceAssessment = (): string[] => {
    const gaps: string[] = [];
    riskDimensions.forEach(dimension => {
      if (dimension.value >= 4) {
        gaps.push(`High ${dimension.shortName} Risk`);
      }
    });
    return gaps;
  };

  const getRiskLevel = (score: number): 'Low' | 'Medium' | 'High' | 'Critical' => {
    if (score <= 40) return 'Low';
    if (score <= 60) return 'Medium';
    if (score <= 80) return 'High';
    return 'Critical';
  };

  const getPrivacyRecommendations = (): string[] => {
    const recommendations: string[] = [];
    const selectedCat = vendorCategories.find(c => c.id === selectedCategory);
    
    if (selectedCat) {
      recommendations.push(`Ensure compliance with: ${selectedCat.commonRegulations.join(', ')}`);
    }
    
    riskDimensions.forEach(dimension => {
      if (dimension.value >= 4) {
        recommendations.push(`Implement ${dimension.protectionRequirements.join(', ')} for ${dimension.name}`);
      }
    });
    
    return recommendations;
  };

  // Demo data for showcase
  useEffect(() => {
    if (!vendorName && !selectedCategory) {
      // Load demo data
      setVendorName('CloudCorp Document Storage');
      handleCategorySelect('cloud_storage');
    }
  }, [handleCategorySelect, selectedCategory, vendorName]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackToDashboardLink />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{t('vendorRiskRadar.title')}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {t('vendorRiskRadar.description')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="xl:col-span-2 space-y-6">
          {/* Vendor Category Selection */}
          <Card>
            <CardHeader>
              <CardTitle>{t('vendorRiskRadar.steps.selectCategory')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vendorCategories.map((category) => (
                  <div
                    key={category.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedCategory === category.id
                        ? 'border-vendorsoluce-navy bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">{category.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">{category.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{category.description}</p>
                        <div className="mt-2">
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                            {category.privacyImpact}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Vendor Details */}
          <Card>
            <CardHeader>
              <CardTitle>{t('vendorRiskRadar.steps.vendorInfo')}</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('vendorRiskRadar.form.vendorNameLabel')}
                </label>
                <input
                  type="text"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder={t('vendorRiskRadar.form.vendorNamePlaceholder')}
                />
              </div>

              {selectedCategory && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">{t('vendorRiskRadar.form.categoryOverview')}</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>{t('vendorRiskRadar.form.commonUseCase')}</strong> {vendorCategories.find(c => c.id === selectedCategory)?.commonUseCase}</p>
                    <p><strong>{t('vendorRiskRadar.form.privacyImpact')}</strong> {vendorCategories.find(c => c.id === selectedCategory)?.privacyImpact}</p>
                    <p><strong>{t('vendorRiskRadar.form.keyRegulations')}</strong> {vendorCategories.find(c => c.id === selectedCategory)?.commonRegulations.join(', ')}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Risk Dimensions */}
          <Card>
            <CardHeader>
              <CardTitle>{t('vendorRiskRadar.steps.riskDimensions')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {riskDimensions.map((dimension) => (
                  <div key={dimension.id} className="pb-6 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div className="flex items-start mb-2">
                      <div className="mr-3 mt-1">{dimension.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{dimension.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{dimension.description}</p>
                        
                        <div className="text-xs space-y-1">
                          <div>
                            <strong>{t('vendorRiskRadar.form.privacyRegulations')}</strong> {dimension.privacyRegulations.join(', ')}
                          </div>
                          <div>
                            <strong>{t('vendorRiskRadar.form.protectionRequirements')}</strong> {dimension.protectionRequirements.join(', ')}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <span>{t('vendorRiskRadar.form.lowRisk')}</span>
                        <span>{t('vendorRiskRadar.form.highRisk')}</span>
                      </div>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            className={`flex-1 py-2 rounded-md transition text-sm ${
                              dimension.value === value 
                                ? 'bg-vendorsoluce-navy text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                            onClick={() => handleRiskDimensionChange(dimension.id, value)}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button
                variant="primary"
                className="w-full mt-6"
                disabled={!vendorName.trim() || isLoading}
                onClick={calculateRiskScore}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                {t('vendorRiskRadar.buttons.generateRadar')}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Results Section */}
        <div className="xl:col-span-1">
          {calculationComplete ? (
            <div className="space-y-6">
              {/* Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('vendorRiskRadar.results.radarVisualization')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* @ts-expect-error - LazyChartProps index signature conflicts with data prop type */}
                  <LazyChart
                    type="radar"
                    data={generateRadarData() as unknown as Array<{ [key: string]: string | number }>}
                    height={320}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              {/* Risk Score */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('vendorRiskRadar.results.overallAssessment')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">{riskScore}</div>
                    <RiskBadge level={getRiskLevel(riskScore)} />
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">{t('vendorRiskRadar.results.privacyRecommendations')}</h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {getPrivacyRecommendations().slice(0, 3).map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-2 h-2 bg-vendorsoluce-navy rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Link to="/vendor-risk-dashboard">
                <Button variant="outline" className="w-full">
                  {t('vendorRiskRadar.buttons.viewFullDashboard')}
                </Button>
              </Link>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{t('vendorRiskRadar.howToUse.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-gray-100 dark:bg-gray-800 w-6 h-6 rounded-full flex items-center justify-center text-vendorsoluce-navy dark:text-vendorsoluce-blue mr-3 mt-0.5 flex-shrink-0">
                      1
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {t('vendorRiskRadar.howToUse.step1')}
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-gray-100 dark:bg-gray-800 w-6 h-6 rounded-full flex items-center justify-center text-vendorsoluce-navy dark:text-vendorsoluce-blue mr-3 mt-0.5 flex-shrink-0">
                      2
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {t('vendorRiskRadar.howToUse.step2')}
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-gray-100 dark:bg-gray-800 w-6 h-6 rounded-full flex items-center justify-center text-vendorsoluce-navy dark:text-vendorsoluce-blue mr-3 mt-0.5 flex-shrink-0">
                      3
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {t('vendorRiskRadar.howToUse.step3')}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p className="font-medium mb-1">{t('vendorRiskRadar.demo.title')}</p>
                      <p>{t('vendorRiskRadar.demo.description')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default VendorRiskRadar;