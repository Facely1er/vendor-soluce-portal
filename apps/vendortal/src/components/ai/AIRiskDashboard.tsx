import { logger } from '../../utils/logger';
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Target,
  Zap,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { aiRiskService } from '../../services/aiRiskService';
import { AIRiskPrediction, AnomalyDetection, MLRiskModel } from '../../types/ai';

interface AIRiskDashboardProps {
  vendorId?: string;
  organizationId?: string;
}

const AIRiskDashboard: React.FC<AIRiskDashboardProps> = ({ vendorId, organizationId }) => {
  const [predictions, setPredictions] = useState<AIRiskPrediction[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyDetection[]>([]);
  const [models, setModels] = useState<MLRiskModel[]>([]);
  const [trends, setTrends] = useState<{
    riskScore: number;
    trend: 'up' | 'down' | 'stable';
    change: number;
    period: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'30d' | '90d' | '1y'>('90d');

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Load AI predictions
      if (vendorId) {
        const prediction = await aiRiskService.predictRisk(vendorId);
        setPredictions([prediction]);
        
        const detectedAnomalies = await aiRiskService.detectAnomalies(vendorId);
        setAnomalies(detectedAnomalies);
      }

      // Load models
      const activeModels = aiRiskService.getActiveModels();
      setModels(activeModels);

      // Load trends
      if (organizationId) {
        const trendData = await aiRiskService.getRiskTrends(organizationId, selectedTimeframe);
        setTrends(trendData);
      }
    } catch (error) {
      logger.error('Error loading AI risk data:', error);
    } finally {
      setLoading(false);
    }
  }, [vendorId, organizationId, selectedTimeframe]);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingDown className="h-4 w-4 text-green-600" />;
      case 'deteriorating': return <TrendingUp className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI-Powered Risk Assessment</h2>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as '30d' | '90d' | '1y')}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button
            onClick={loadData}
            disabled={loading}
            size="sm"
            variant="outline"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* AI Predictions */}
      {predictions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {predictions.map((prediction, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-purple-600" />
                  AI Risk Prediction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 dark:text-white">
                      {prediction.risk_score}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Risk Score</div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${getRiskLevelColor(prediction.risk_level)}`}>
                      {prediction.risk_level.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Confidence</span>
                      <span className="font-medium">{(prediction.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${prediction.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">Key Factors</h4>
                    {prediction.factors.slice(0, 3).map((factor, factorIndex) => (
                      <div key={factorIndex} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{factor.name}</span>
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">{factor.impact}</span>
                          {factor.trend === 'increasing' && <TrendingUp className="h-3 w-3 text-red-500" />}
                          {factor.trend === 'decreasing' && <TrendingDown className="h-3 w-3 text-green-500" />}
                          {factor.trend === 'stable' && <Activity className="h-3 w-3 text-gray-500" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Anomaly Detection */}
      {anomalies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
              Anomaly Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {anomalies.map((anomaly, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(anomaly.severity)}`}>
                        {anomaly.severity.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {anomaly.anomaly_type.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {(anomaly.confidence * 100).toFixed(1)}% confidence
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    {anomaly.description}
                  </p>
                  
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white">Recommendations</h5>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {anomaly.recommendations.map((rec, recIndex) => (
                        <li key={recIndex} className="flex items-start">
                          <span className="mr-2">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Trends */}
      {trends && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Risk Trends & Forecasting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Overall Trend</span>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(trends.overall_trend)}
                    <span className={`text-sm font-medium ${
                      trends.overall_trend === 'improving' ? 'text-green-600' :
                      trends.overall_trend === 'deteriorating' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {trends.overall_trend.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Recent Risk Scores</h4>
                  <div className="space-y-2">
                    {trends.trend_data.slice(-7).map((data: { date: string; score: number }, index: number) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {new Date(data.date).toLocaleDateString()}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{data.average_risk_score.toFixed(1)}</span>
                          {data.high_risk_count > 0 && (
                            <span className="text-orange-600 text-xs">
                              {data.high_risk_count}H
                            </span>
                          )}
                          {data.critical_risk_count > 0 && (
                            <span className="text-red-600 text-xs">
                              {data.critical_risk_count}C
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">30-Day Forecast</h4>
                  <div className="space-y-2">
                    {trends.forecast.slice(0, 7).map((forecast: { date: string; predicted_score: number; confidence: number }, index: number) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {new Date(forecast.date).toLocaleDateString()}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{forecast.predicted_risk_score}</span>
                          <span className="text-xs text-gray-500">
                            ±{Math.round((forecast.confidence_interval[1] - forecast.predicted_risk_score))}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ML Models Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-green-600" />
            ML Models Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {models.map((model) => (
              <div key={model.model_id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{model.model_name}</h4>
                  <span className="text-xs text-green-600 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full">
                    ACTIVE
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Accuracy</span>
                    <span className="font-medium">{(model.accuracy * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Version</span>
                    <span className="font-medium">{model.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Last Trained</span>
                    <span className="font-medium">
                      {new Date(model.last_trained).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Features</span>
                    <span className="font-medium">{model.features.length}</span>
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

export default AIRiskDashboard;