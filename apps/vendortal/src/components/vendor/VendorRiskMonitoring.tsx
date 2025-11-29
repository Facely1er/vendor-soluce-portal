import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  Bell,
  RefreshCw,
  Activity
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { VendorProfile } from '../../services/vendorService';

interface RiskMonitoringProps {
  vendors: VendorProfile[];
  onVendorSelect?: (vendor: VendorProfile) => void;
}

interface RiskAlert {
  id: string;
  vendorId: string;
  vendorName: string;
  type: 'risk_increase' | 'compliance_issue' | 'security_incident' | 'assessment_due';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  acknowledged: boolean;
  resolved: boolean;
}

interface RiskTrend {
  vendorId: string;
  vendorName: string;
  currentScore: number;
  previousScore: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

const VendorRiskMonitoring: React.FC<RiskMonitoringProps> = ({
  vendors,
  onVendorSelect: _onVendorSelect
}) => {
  const { t: _t } = useTranslation();
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [trends, setTrends] = useState<RiskTrend[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [_selectedAlert, _setSelectedAlert] = useState<RiskAlert | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    loadMonitoringData();
    // Set up real-time monitoring simulation
    const interval = setInterval(loadMonitoringData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [vendors]);

  const loadMonitoringData = async () => {
    setIsRefreshing(true);
    try {
      // Simulate loading monitoring data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock alerts
      const mockAlerts: RiskAlert[] = [
        {
          id: '1',
          vendorId: vendors[0]?.id || '1',
          vendorName: vendors[0]?.company_name || 'TechCorp Inc.',
          type: 'risk_increase',
          severity: 'high',
          title: 'Risk Score Increased',
          description: 'Vendor risk score increased by 15 points due to security incident',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          acknowledged: false,
          resolved: false
        },
        {
          id: '2',
          vendorId: vendors[1]?.id || '2',
          vendorName: vendors[1]?.company_name || 'DataFlow Systems',
          type: 'compliance_issue',
          severity: 'medium',
          title: 'Compliance Certificate Expired',
          description: 'ISO 27001 certificate expired 5 days ago',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          acknowledged: true,
          resolved: false
        },
        {
          id: '3',
          vendorId: vendors[2]?.id || '3',
          vendorName: vendors[2]?.company_name || 'CloudSecure Ltd.',
          type: 'assessment_due',
          severity: 'low',
          title: 'Annual Assessment Due',
          description: 'Annual risk assessment is due in 7 days',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          acknowledged: false,
          resolved: false
        }
      ];

      // Generate mock trends
      const mockTrends: RiskTrend[] = vendors.map((vendor, _index) => ({
        vendorId: vendor.id,
        vendorName: vendor.company_name,
        currentScore: vendor.risk_score || 50 + Math.random() * 40,
        previousScore: (vendor.risk_score || 50) + (Math.random() - 0.5) * 20,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        change: Math.random() * 20 - 10
      }));

      setAlerts(mockAlerts);
      setTrends(mockTrends);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, acknowledged: true }
        : alert
    ));
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, resolved: true, acknowledged: true }
        : alert
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-300';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'risk_increase': return <TrendingUp className="h-4 w-4" />;
      case 'compliance_issue': return <Shield className="h-4 w-4" />;
      case 'security_incident': return <AlertTriangle className="h-4 w-4" />;
      case 'assessment_due': return <Clock className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />;
      case 'stable': return <Activity className="h-4 w-4 text-gray-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const severityMatch = filterSeverity === 'all' || alert.severity === filterSeverity;
    const typeMatch = filterType === 'all' || alert.type === filterType;
    return severityMatch && typeMatch && !alert.resolved;
  });

  const unacknowledgedCount = alerts.filter(alert => !alert.acknowledged && !alert.resolved).length;
  const criticalCount = alerts.filter(alert => alert.severity === 'critical' && !alert.resolved).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Risk Monitoring Dashboard
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Real-time vendor risk monitoring and alerting
              </p>
            </div>
            <Button
              onClick={loadMonitoringData}
              disabled={isRefreshing}
              variant="ghost"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Alerts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {alerts.length}
                </p>
              </div>
              <Bell className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Unacknowledged</p>
                <p className="text-2xl font-bold text-orange-600">
                  {unacknowledgedCount}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Critical</p>
                <p className="text-2xl font-bold text-red-600">
                  {criticalCount}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Vendors Monitored</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {vendors.length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Severity
              </label>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="all">All Types</option>
                <option value="risk_increase">Risk Increase</option>
                <option value="compliance_issue">Compliance Issue</option>
                <option value="security_incident">Security Incident</option>
                <option value="assessment_due">Assessment Due</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Active Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No alerts found
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div key={alert.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {getTypeIcon(alert.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {alert.title}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                            {alert.severity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {alert.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>Vendor: {alert.vendorName}</span>
                          <span>•</span>
                          <span>{new Date(alert.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {!alert.acknowledged && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAcknowledgeAlert(alert.id)}
                        >
                          Acknowledge
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleResolveAlert(alert.id)}
                      >
                        Resolve
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Risk Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Risk Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trends.map((trend) => (
              <div key={trend.vendorId} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getTrendIcon(trend.trend)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {trend.vendorName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Current: {trend.currentScore.toFixed(1)} | Previous: {trend.previousScore.toFixed(1)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-semibold ${
                    trend.change > 0 ? 'text-red-600' : trend.change < 0 ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {trend.change > 0 ? '+' : ''}{trend.change.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {trend.trend} trend
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

export default VendorRiskMonitoring;
