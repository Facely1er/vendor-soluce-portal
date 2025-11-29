import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Brain, 
  BarChart3,
  Calendar,
  Target,
  Zap
} from 'lucide-react';

interface PredictiveInsight {
  id: string;
  title: string;
  description: string;
  probability: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  timeframe: string;
  category: 'vendor_risk' | 'vulnerability' | 'compliance' | 'operational';
  recommendedActions: string[];
  confidence: number;
}

interface RiskForecast {
  vendorId: string;
  vendorName: string;
  currentRisk: number;
  predictedRisk: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  factors: string[];
}

const PredictiveAnalytics: React.FC = () => {
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [forecasts, setForecasts] = useState<RiskForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'30d' | '90d' | '1y'>('90d');

  useEffect(() => {
    // Simulate AI-driven predictive analytics
    const generateInsights = () => {
      const mockInsights: PredictiveInsight[] = [
        {
          id: 'insight-1',
          title: 'Vendor Risk Spike Predicted',
          description: 'TechCorp Solutions shows indicators of increasing risk based on recent security incidents in their industry segment and delayed response to security questionnaires.',
          probability: 75,
          impact: 'high',
          timeframe: 'Next 30 days',
          category: 'vendor_risk',
          confidence: 82,
          recommendedActions: [
            'Schedule immediate security review meeting',
            'Request updated security assessment',
            'Consider alternative vendor qualification'
          ]
        },
        {
          id: 'insight-2',
          title: 'Vulnerability Surge Expected',
          description: 'Based on historical patterns and current threat intelligence, a 40% increase in critical vulnerabilities is expected in JavaScript libraries during Q2.',
          probability: 68,
          impact: 'medium',
          timeframe: 'Next 60-90 days',
          category: 'vulnerability',
          confidence: 74,
          recommendedActions: [
            'Increase SBOM monitoring frequency',
            'Prepare vulnerability response team',
            'Review JavaScript component inventory'
          ]
        },
        {
          id: 'insight-3',
          title: 'Compliance Gap Emerging',
          description: 'Current vendor onboarding velocity suggests potential NIST 800-161 compliance gaps by end of quarter if assessment processes are not optimized.',
          probability: 55,
          impact: 'medium',
          timeframe: 'Next 45 days',
          category: 'compliance',
          confidence: 67,
          recommendedActions: [
            'Streamline assessment workflows',
            'Increase assessment team capacity',
            'Implement automated compliance checks'
          ]
        }
      ];

      const mockForecasts: RiskForecast[] = [
        {
          vendorId: 'vendor-1',
          vendorName: 'TechCorp Solutions',
          currentRisk: 65,
          predictedRisk: 78,
          trend: 'increasing',
          factors: ['Industry incidents', 'Response delays', 'Geographic risk']
        },
        {
          vendorId: 'vendor-2',
          vendorName: 'CloudSecure Inc',
          currentRisk: 45,
          predictedRisk: 38,
          trend: 'decreasing',
          factors: ['Recent certifications', 'Improved response times', 'Enhanced controls']
        },
        {
          vendorId: 'vendor-3',
          vendorName: 'DevTools Pro',
          currentRisk: 70,
          predictedRisk: 72,
          trend: 'stable',
          factors: ['Consistent performance', 'No significant changes']
        }
      ];

      setInsights(mockInsights);
      setForecasts(mockForecasts);
      setLoading(false);
    };

    // Simulate API call delay
    setTimeout(generateInsights, 2000);
  }, [selectedTimeframe]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-green-500" />;
      default: return <BarChart3 className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vendor_risk': return <Target className="h-4 w-4" />;
      case 'vulnerability': return <AlertTriangle className="h-4 w-4" />;
      case 'compliance': return <BarChart3 className="h-4 w-4" />;
      case 'operational': return <Zap className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-trust-blue" />
            Predictive Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
          <div className="flex items-center justify-center mt-6">
            <Brain className="h-8 w-8 text-vendorsoluce-blue animate-pulse" />
            <span className="ml-2 text-vendorsoluce-blue">Analyzing patterns...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <Brain className="h-6 w-6 mr-2 text-vendorsoluce-blue" />
          Predictive Analytics
        </h2>
        <div className="flex space-x-2">
          {[
            { value: '30d', label: '30 Days' },
            { value: '90d', label: '90 Days' },
            { value: '1y', label: '1 Year' }
          ].map(({ value, label }) => (
            <Button
              key={value}
              variant={selectedTimeframe === value ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeframe(value as '30d' | '90d' | '1y')}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 gap-4">
        {insights.map((insight) => (
          <Card key={insight.id} className="border border-gray-200 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                      {getCategoryIcon(insight.category)}
                      <span className="ml-1">{insight.impact.toUpperCase()}</span>
                    </span>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-2 py-1 rounded-full">
                      {insight.probability}% probability
                    </span>
                    <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                      {insight.confidence}% confidence
                    </span>
                  </div>
                  
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">{insight.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{insight.description}</p>
                  
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <Calendar className="h-3 w-3 mr-1" />
                    Expected timeframe: {insight.timeframe}
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <h4 className="text-xs font-medium text-gray-900 dark:text-white mb-2">Recommended Actions:</h4>
                    <ul className="space-y-1">
                      {insight.recommendedActions.map((action, index) => (
                        <li key={index} className="text-xs text-gray-600 dark:text-gray-300 flex items-start">
                          <span className="text-supply-chain-teal mr-2">•</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="ml-4">
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => {
                      // Create action plan based on insight
                      const actionPlan = {
                        title: `Action Plan: ${insight.title}`,
                        description: insight.description,
                        actions: insight.recommendedActions,
                        timeframe: insight.timeframe,
                        priority: insight.impact
                      };
                      
                      // Store in localStorage for now (in production, this would be saved to backend)
                      const existingPlans = JSON.parse(localStorage.getItem('actionPlans') || '[]');
                      existingPlans.push({
                        ...actionPlan,
                        id: `plan-${Date.now()}`,
                        createdAt: new Date().toISOString()
                      });
                      localStorage.setItem('actionPlans', JSON.stringify(existingPlans));
                      
                      // Show success message
                      alert(`Action plan created for "${insight.title}". You can view it in your action plans.`);
                    }}
                  >
                    Create Action Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Risk Forecasts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
            Vendor Risk Forecasts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {forecasts.map((forecast) => (
              <div key={forecast.vendorId} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{forecast.vendorName}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                        <span>Current: {forecast.currentRisk}</span>
                        <span>→</span>
                        <span>Predicted: {forecast.predictedRisk}</span>
                        {getTrendIcon(forecast.trend)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {forecast.predictedRisk > forecast.currentRisk ? '+' : ''}
                      {forecast.predictedRisk - forecast.currentRisk}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Risk Change</div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Key Factors:</h5>
                  <div className="flex flex-wrap gap-1">
                    {forecast.factors.map((factor, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs"
                      >
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveAnalytics;