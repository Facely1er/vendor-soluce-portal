import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, HelpCircle, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useTranslation } from 'react-i18next';

interface ChecklistItem {
  id: string;
  category: string;
  control: string;
  description: string;
  checked: boolean;
}

const NISTChecklist: React.FC = () => {
  const { t } = useTranslation();
  const [showResults, setShowResults] = useState(false);
  
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    {
      id: 'c1',
      category: 'Governance',
      control: 'C-SCRM-1',
      description: t('quickTools.nistChecklist.items.scrm1'),
      checked: false
    },
    {
      id: 'c2',
      category: 'Governance',
      control: 'C-SCRM-2',
      description: t('quickTools.nistChecklist.items.scrm2'),
      checked: false
    },
    {
      id: 'c3',
      category: 'Supplier Management',
      control: 'C-SCRM-3',
      description: t('quickTools.nistChecklist.items.scrm3'),
      checked: false
    },
    {
      id: 'c4',
      category: 'Supplier Management',
      control: 'C-SCRM-4',
      description: t('quickTools.nistChecklist.items.scrm4'),
      checked: false
    },
    {
      id: 'c5',
      category: 'Supplier Management',
      control: 'C-SCRM-5',
      description: t('quickTools.nistChecklist.items.scrm5'),
      checked: false
    },
    {
      id: 'c6',
      category: 'Product Security',
      control: 'C-SCRM-6',
      description: t('quickTools.nistChecklist.items.scrm6'),
      checked: false
    },
    {
      id: 'c7',
      category: 'Product Security',
      control: 'C-SCRM-7',
      description: t('quickTools.nistChecklist.items.scrm7'),
      checked: false
    },
    {
      id: 'c8',
      category: 'Incident Response',
      control: 'C-SCRM-8',
      description: t('quickTools.nistChecklist.items.scrm8'),
      checked: false
    },
    {
      id: 'c9',
      category: 'Incident Response',
      control: 'C-SCRM-9',
      description: t('quickTools.nistChecklist.items.scrm9'),
      checked: false
    },
    {
      id: 'c10',
      category: 'Information Sharing',
      control: 'C-SCRM-10',
      description: t('quickTools.nistChecklist.items.scrm10'),
      checked: false
    }
  ]);

  const toggleCheck = (id: string) => {
    setChecklistItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleCheckResults = () => {
    setShowResults(true);
  };

  const calculateCompliance = () => {
    const checkedCount = checklistItems.filter(item => item.checked).length;
    const totalItems = checklistItems.length;
    return Math.round((checkedCount / totalItems) * 100);
  };

  const compliancePercentage = calculateCompliance();
  
  const getComplianceLevel = (percentage: number) => {
    if (percentage >= 80) return 'High';
    if (percentage >= 50) return 'Moderate';
    return 'Low';
  };
  
  const complianceLevel = getComplianceLevel(compliancePercentage);
  
  const getComplianceColor = (level: string) => {
    if (level === 'High') return 'text-green-600 dark:text-green-400';
    if (level === 'Moderate') return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-vendorsoluce-navy dark:hover:text-vendorsoluce-blue transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('navigation.home')}
        </Link>
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{t('quickTools.nistChecklist.title')}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{t('quickTools.nistChecklist.description')}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('quickTools.nistChecklist.checklistTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4 text-sm text-blue-800 dark:text-blue-300">
                <div className="flex items-start">
                  <HelpCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <p>{t('quickTools.nistChecklist.instructions')}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {checklistItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="border border-gray-200 dark:border-gray-700 rounded-md p-4 hover:border-vendortal-navy dark:hover:border-trust-blue transition-colors"
                  >
                    <div className="flex items-start">
                      <div>
                        <input
                          type="checkbox"
                          id={item.id}
                          checked={item.checked}
                          onChange={() => toggleCheck(item.id)}
                          className="h-5 w-5 rounded border-gray-300 text-vendorsoluce-navy focus:ring-vendorsoluce-navy mr-3 mt-0.5"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded font-medium mr-2">
                            {item.control}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {item.category}
                          </span>
                        </div>
                        <label htmlFor={item.id} className="text-gray-900 dark:text-white cursor-pointer">
                          {item.description}
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={handleCheckResults}
                >
                  {t('quickTools.nistChecklist.checkCompliance')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          {showResults ? (
            <Card>
              <CardHeader>
                <CardTitle>{t('quickTools.nistChecklist.complianceResults')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 mb-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">{compliancePercentage}%</span>
                  </div>
                  <p className={`font-medium ${getComplianceColor(complianceLevel)}`}>
                    {t(`quickTools.nistChecklist.complianceLevels.${complianceLevel.toLowerCase()}`)}
                  </p>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{t('quickTools.nistChecklist.implemented')}</span>
                      <span className="text-gray-900 dark:text-white">
                        {checklistItems.filter(item => item.checked).length} / {checklistItems.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-vendorsoluce-navy h-2.5 rounded-full" 
                        style={{ width: `${compliancePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className={`p-3 rounded-md ${
                    compliancePercentage >= 80 
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                  }`}>
                    <div className="flex items-start">
                      {compliancePercentage >= 80 ? (
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className={`text-sm font-medium ${
                          compliancePercentage >= 80 
                          ? 'text-green-800 dark:text-green-300' 
                          : 'text-yellow-800 dark:text-yellow-300'
                        }`}>
                          {compliancePercentage >= 80 
                            ? t('quickTools.nistChecklist.goodCompliance') 
                            : t('quickTools.nistChecklist.improvementNeeded')
                          }
                        </p>
                        <p className={`text-xs ${
                          compliancePercentage >= 80 
                          ? 'text-green-700 dark:text-green-400' 
                          : 'text-yellow-700 dark:text-yellow-400'
                        }`}>
                          {compliancePercentage >= 80 
                            ? t('quickTools.nistChecklist.compliantMessage')
                            : t('quickTools.nistChecklist.nonCompliantMessage')
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Link to="/supply-chain-assessment">
                    <Button variant="outline" className="w-full">
                      {t('quickTools.nistChecklist.fullAssessment')}
                    </Button>
                  </Link>
                  
                  <Button variant="ghost" className="w-full flex items-center justify-center">
                    <Download className="h-4 w-4 mr-2" />
                    {t('quickTools.nistChecklist.downloadReport')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{t('quickTools.nistChecklist.aboutTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {t('quickTools.nistChecklist.aboutText1')}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {t('quickTools.nistChecklist.aboutText2')}
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-2">{t('quickTools.nistChecklist.keyAreas')}</h4>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <li>• {t('quickTools.nistChecklist.areas.governance')}</li>
                    <li>• {t('quickTools.nistChecklist.areas.supplierManagement')}</li>
                    <li>• {t('quickTools.nistChecklist.areas.productSecurity')}</li>
                    <li>• {t('quickTools.nistChecklist.areas.incidentResponse')}</li>
                    <li>• {t('quickTools.nistChecklist.areas.informationSharing')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default NISTChecklist;