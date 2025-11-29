import React, { useState } from 'react';
import { ArrowLeft, Send, Lock, Briefcase, Shield, Building, Server, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import RiskBadge from '../../components/ui/RiskBadge';
import { useTranslation } from 'react-i18next';
import { useVendors } from '../../hooks/useVendors';
import { useAuth } from '../../context/AuthContext';
import { logger } from '../../utils/logger';

interface RiskFactor {
  id: string;
  name: string;
  description: string;
  weight: number;
  value: number;
  icon: React.ReactNode;
}

const VendorRiskCalculator: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { createVendor } = useVendors();
  const [vendorName, setVendorName] = useState('');
  const [calculationComplete, setCalculationComplete] = useState(false);
  const [riskScore, setRiskScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Define risk factors with initial values
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([
    {
      id: 'data_access',
      name: t('quickTools.riskCalculator.factors.dataAccess.name'),
      description: t('quickTools.riskCalculator.factors.dataAccess.description'),
      weight: 4,
      value: 1, // 1-5 scale
      icon: <Lock className="h-5 w-5 text-vendortal-navy" />
    },
    {
      id: 'criticality',
      name: t('quickTools.riskCalculator.factors.criticality.name'),
      description: t('quickTools.riskCalculator.factors.criticality.description'),
      weight: 3,
      value: 1,
      icon: <Briefcase className="h-5 w-5 text-vendorsoluce-teal" />
    },
    {
      id: 'security_controls',
      name: t('quickTools.riskCalculator.factors.securityControls.name'),
      description: t('quickTools.riskCalculator.factors.securityControls.description'),
      weight: 3,
      value: 1,
      icon: <Shield className="h-5 w-5 text-vendorsoluce-blue" />
    },
    {
      id: 'compliance',
      name: t('quickTools.riskCalculator.factors.compliance.name'),
      description: t('quickTools.riskCalculator.factors.compliance.description'),
      weight: 2,
      value: 1,
      icon: <Building className="h-5 w-5 text-vendorsoluce-navy" />
    },
    {
      id: 'system_exposure',
      name: t('quickTools.riskCalculator.factors.systemExposure.name'),
      description: t('quickTools.riskCalculator.factors.systemExposure.description'),
      weight: 3,
      value: 1,
      icon: <Server className="h-5 w-5 text-vendorsoluce-teal" />
    }
  ]);

  const handleRiskFactorChange = (id: string, value: number) => {
    setRiskFactors(prev => 
      prev.map(factor => 
        factor.id === id ? { ...factor, value } : factor
      )
    );
  };

  const calculateRiskScore = async () => {
    if (!vendorName.trim()) {
      setError('Please enter a vendor name');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Calculate weighted score
      let totalWeight = 0;
      let weightedSum = 0;
      
      riskFactors.forEach(factor => {
        totalWeight += factor.weight;
        weightedSum += factor.weight * factor.value;
      });
      
      const maxPossibleScore = totalWeight * 5; // 5 is max value for each factor
      // Convert to 0-100 scale, but invert (5 = low risk, 1 = high risk)
      const calculatedRiskScore = Math.round((1 - ((weightedSum / maxPossibleScore) - 0.2)) * 100);
      
      setRiskScore(calculatedRiskScore);
      
      // Save to database if user is authenticated
      if (isAuthenticated) {
        const riskLevel = getRiskLevel(calculatedRiskScore);
        await createVendor({
          name: vendorName,
          risk_score: calculatedRiskScore,
          risk_level: riskLevel,
          compliance_status: riskLevel === 'Low' ? 'Compliant' : 
                            riskLevel === 'Medium' ? 'Partial' : 'Non-Compliant',
          notes: `Risk calculation based on: ${riskFactors.map(f => `${f.name}: ${f.value}/5`).join(', ')}`
        });
      }
      
      setCalculationComplete(true);
    } catch (err) {
      logger.error('Error calculating risk:', err);
      setError(err instanceof Error ? err.message : 'Failed to calculate risk score');
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskLevel = (score: number): 'Low' | 'Medium' | 'High' | 'Critical' => {
    if (score >= 80) return 'Low';
    if (score >= 60) return 'Medium';
    if (score >= 40) return 'High';
    return 'Critical';
  };
  
  const getRiskDescription = (level: 'Low' | 'Medium' | 'High' | 'Critical'): string => {
    switch (level) {
      case 'Low':
        return t('quickTools.riskCalculator.results.low');
      case 'Medium':
        return t('quickTools.riskCalculator.results.medium');
      case 'High':
        return t('quickTools.riskCalculator.results.high');
      case 'Critical':
        return t('quickTools.riskCalculator.results.critical');
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-vendorsoluce-navy dark:hover:text-vendorsoluce-blue transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('navigation.home')}
        </Link>
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{t('quickTools.riskCalculator.title')}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{t('quickTools.riskCalculator.description')}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('quickTools.riskCalculator.inputTitle')}</CardTitle>
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
                  {t('quickTools.riskCalculator.vendorName')}
                </label>
                <input
                  type="text"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder={t('quickTools.riskCalculator.vendorNamePlaceholder')}
                />
              </div>
              
              <h3 className="font-medium text-lg mb-4 text-gray-900 dark:text-white">{t('quickTools.riskCalculator.riskFactors')}</h3>
              
              {riskFactors.map((factor) => (
                <div key={factor.id} className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <div className="flex items-start mb-2">
                    <div className="mr-3 mt-1">{factor.icon}</div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{factor.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{factor.description}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>{t('quickTools.riskCalculator.lowRisk')}</span>
                      <span>{t('quickTools.riskCalculator.highRisk')}</span>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          className={`flex-1 py-2 rounded-md transition ${
                            factor.value === value 
                              ? 'bg-vendorsoluce-navy text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                          onClick={() => handleRiskFactorChange(factor.id, value)}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                variant="primary"
                className="w-full mt-4"
                disabled={!vendorName.trim() || isLoading}
                onClick={calculateRiskScore}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                {t('quickTools.riskCalculator.calculate')}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          {calculationComplete ? (
            <Card>
              <CardHeader>
                <CardTitle>{t('quickTools.riskCalculator.resultsTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{t('quickTools.riskCalculator.vendorRiskScore')}</p>
                  <div className="text-5xl font-bold mb-2 text-gray-900 dark:text-white">{riskScore}</div>
                  <div className="mb-4">
                    <RiskBadge level={getRiskLevel(riskScore)} />
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md mb-4">
                  <h4 className="font-medium mb-2 text-gray-900 dark:text-white">{t('quickTools.riskCalculator.recommendation')}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {getRiskDescription(getRiskLevel(riskScore))}
                  </p>
                </div>
                
                <Link to="/vendor-risk-dashboard">
                  <Button variant="outline" className="w-full">
                    {t('quickTools.riskCalculator.viewDashboard')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{t('quickTools.riskCalculator.howToUse')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-gray-100 dark:bg-gray-800 w-6 h-6 rounded-full flex items-center justify-center text-vendorsoluce-navy dark:text-vendorsoluce-blue mr-3 mt-0.5 flex-shrink-0">
                      1
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {t('quickTools.riskCalculator.step1')}
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-gray-100 dark:bg-gray-800 w-6 h-6 rounded-full flex items-center justify-center text-vendorsoluce-navy dark:text-vendorsoluce-blue mr-3 mt-0.5 flex-shrink-0">
                      2
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {t('quickTools.riskCalculator.step2')}
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-gray-100 dark:bg-gray-800 w-6 h-6 rounded-full flex items-center justify-center text-vendorsoluce-navy dark:text-vendorsoluce-blue mr-3 mt-0.5 flex-shrink-0">
                      3
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {t('quickTools.riskCalculator.step3')}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('quickTools.riskCalculator.disclaimer')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorRiskCalculator;