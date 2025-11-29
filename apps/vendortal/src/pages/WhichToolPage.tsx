import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Shield, Zap, FileText, Eye, CheckCircle, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const WhichToolPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [selectedDetail, setSelectedDetail] = useState<string>('');

  const goals = [
    {
      id: 'nist',
      title: 'Prove NIST 800-161 Compliance',
      description: 'Need to demonstrate compliance with federal supply chain security standards',
      icon: <Shield className="h-6 w-6" />,
      color: 'bg-navy-50 dark:bg-navy-900/20 border-navy-200 dark:border-navy-700',
      textColor: 'text-navy-900 dark:text-navy-100',
      recommendation: {
        tool: 'NIST 800-161 Compliance Assessment',
        path: '/vendor-assessments',
        description: 'Complete our 24-question assessment aligned with NIST SP 800-161 Rev 1',
        time: '30 minutes',
        features: [
          '6 compliance domains',
          'Automated scoring',
          'Gap analysis with recommendations',
          'Audit-ready PDF report'
        ]
      }
    },
    {
      id: 'vendor',
      title: 'Assess Vendor Risk',
      description: 'Want to evaluate and understand vendor risks',
      icon: <Eye className="h-6 w-6" />,
      color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700',
      textColor: 'text-blue-900 dark:text-blue-100',
      needsDetail: true
    },
    {
      id: 'portfolio',
      title: 'View All Vendor Risks',
      description: 'See your entire vendor portfolio risk at a glance',
      icon: <Eye className="h-6 w-6" />,
      color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700',
      textColor: 'text-purple-900 dark:text-purple-100',
      recommendation: {
        tool: 'VendorIQ Risk Radar',
        path: '/tools/vendor-risk-radar',
        description: 'Portfolio visualization of all your vendor risk assessments',
        time: 'Real-time view',
        features: [
          'Interactive radar chart',
          'Risk level distribution',
          'Portfolio-wide trends',
          'Automated alerts'
        ]
      }
    }
  ];

  const detailLevels = [
    {
      id: 'quick',
      title: 'Quick Screening',
      description: 'Fast 5-minute preliminary risk check',
      time: '5 minutes',
      icon: <Zap className="h-5 w-5" />,
      color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700',
      recommendation: {
        tool: 'VendorIQ Quick Assessment',
        path: '/tools/vendor-iq?mode=quick',
        description: 'Free quick screening with basic risk factors',
        features: [
          '5 basic risk factors',
          'Instant risk score',
          'Free tier',
          'Lead to detailed analysis'
        ],
        price: 'FREE'
      }
    },
    {
      id: 'standard',
      title: 'Standard Assessment',
      description: 'Detailed risk profile with compliance mapping',
      time: '15 minutes',
      icon: <FileText className="h-5 w-5" />,
      color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700',
      recommendation: {
        tool: 'VendorIQ Standard Assessment',
        path: '/tools/vendor-iq?mode=standard',
        description: 'Comprehensive assessment with NIST 800-161 control mapping',
        features: [
          '6 detailed risk dimensions',
          'NIST control mapping',
          'Compliance gap analysis',
          'Automated recommendations',
          'Radar visualization'
        ],
        price: 'Professional tier'
      }
    },
    {
      id: 'comprehensive',
      title: 'Comprehensive Review',
      description: 'Full due diligence for critical vendors',
      time: '30 minutes',
      icon: <CheckCircle className="h-5 w-5" />,
      color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700',
      recommendation: {
        tool: 'VendorIQ Comprehensive Assessment',
        path: '/tools/vendor-iq?mode=comprehensive',
        description: 'Complete due diligence with multi-framework support',
        features: [
          '12+ detailed risk questions',
          'Full NIST 800-161 mapping',
          'SOC 2, ISO 27001, FedRAMP',
          'Custom questionnaire',
          'Continuous monitoring setup'
        ],
        price: 'Enterprise tier'
      }
    }
  ];

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoal(goalId);
    setSelectedDetail('');
  };

  const selectedGoalData = goals.find(g => g.id === selectedGoal);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Which Tool Should You Use?
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Answer a few questions to find the right assessment tool for your needs
          </p>
        </div>

        {/* Step 1: Select Goal */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            1. What's your primary goal?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <button
                key={goal.id}
                onClick={() => handleGoalSelect(goal.id)}
                className={`text-left p-6 rounded-lg border-2 transition-all ${
                  selectedGoal === goal.id
                    ? `${goal.color} border-2 border-current`
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={goal.textColor}>{goal.icon}</div>
                  <h3 className={`font-semibold text-lg ${selectedGoal === goal.id ? goal.textColor : 'text-gray-900 dark:text-white'}`}>
                    {goal.title}
                  </h3>
                </div>
                <p className={`text-sm ${selectedGoal === goal.id ? 'text-gray-700 dark:text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}>
                  {goal.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Select Detail Level (if vendor assessment selected) */}
        {selectedGoal === 'vendor' && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              2. How much detail do you need?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {detailLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setSelectedDetail(level.id)}
                  className={`text-left p-6 rounded-lg border-2 transition-all ${
                    selectedDetail === level.id
                      ? `${level.color} border-2 border-current`
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-blue-600 dark:text-blue-400">{level.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {level.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{level.time}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{level.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recommendation */}
        {(selectedGoal === 'nist' || selectedGoal === 'portfolio' || selectedDetail) && (
          <div className="mt-8">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-700">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  <CardTitle className="text-2xl">Our Recommendation</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {selectedGoalData?.needsDetail && selectedDetail ? (
                  <div>
                    {(() => {
                      const levelData = detailLevels.find(l => l.id === selectedDetail);
                      return (
                        <>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            {levelData?.recommendation.tool}
                          </h3>
                          <p className="text-gray-700 dark:text-gray-300 mb-4">
                            {levelData?.recommendation.description}
                          </p>
                          <div className="mb-6">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                              Features included:
                            </h4>
                            <ul className="space-y-2">
                              {levelData?.recommendation.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                  <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {levelData?.recommendation.price && (
                            <div className="mb-6">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                                {levelData.recommendation.price}
                              </span>
                            </div>
                          )}
                          <Link to={levelData?.recommendation.path || '/'}>
                            <Button size="lg" className="w-full sm:w-auto">
                              Start {levelData?.recommendation.tool}
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                          </Link>
                        </>
                      );
                    })()}
                  </div>
                ) : selectedGoalData?.recommendation ? (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      {selectedGoalData.recommendation.tool}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {selectedGoalData.recommendation.description}
                    </p>
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Features included:
                      </h4>
                      <ul className="space-y-2">
                        {selectedGoalData.recommendation.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {selectedGoalData.recommendation.time && (
                      <div className="mb-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                          Estimated time: {selectedGoalData.recommendation.time}
                        </span>
                      </div>
                    )}
                    <Link to={selectedGoalData.recommendation.path}>
                      <Button size="lg" className="w-full sm:w-auto">
                        Start Assessment
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Alternative Options */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Not sure? Try these options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/tools/vendor-iq?mode=quick">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-green-500" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Start with Quick Assessment (Free)
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      5-minute screening - upgrade to detailed analysis anytime
                    </p>
                  </div>
                </Link>
                <Link to="/vendor-assessments">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-navy-500" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Check NIST Compliance
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      30-minute assessment for federal supply chain security compliance
                    </p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WhichToolPage;

