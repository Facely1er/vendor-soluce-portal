import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  BarChart3,
  FileText,
  Download,
  RefreshCw,
  Eye
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { VendorProfile } from '../../services/vendorService';

interface RiskReportingProps {
  vendors: VendorProfile[];
  onExport?: (format: 'pdf' | 'excel' | 'csv') => void;
}

interface RiskReport {
  id: string;
  title: string;
  type: 'executive' | 'detailed' | 'compliance' | 'trend';
  generatedAt: string;
  period: string;
  summary: {
    totalVendors: number;
    highRiskVendors: number;
    complianceIssues: number;
    averageRiskScore: number;
  };
  data: any;
}

interface RiskMetrics {
  totalVendors: number;
  highRiskVendors: number;
  mediumRiskVendors: number;
  lowRiskVendors: number;
  compliantVendors: number;
  nonCompliantVendors: number;
  averageRiskScore: number;
  riskTrend: 'up' | 'down' | 'stable';
  complianceTrend: 'up' | 'down' | 'stable';
}

const VendorRiskReporting: React.FC<RiskReportingProps> = ({
  vendors,
  onExport
}) => {
  const { t: _t } = useTranslation();
  const [metrics, setMetrics] = useState<RiskMetrics | null>(null);
  const [reports, setReports] = useState<RiskReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<RiskReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [reportType, setReportType] = useState<'executive' | 'detailed' | 'compliance' | 'trend'>('executive');

  useEffect(() => {
    loadMetrics();
    loadReports();
  }, [vendors, dateRange]);

  const loadMetrics = async () => {
    // Calculate risk metrics from vendor data
    const totalVendors = vendors.length;
    const highRiskVendors = vendors.filter(v => (v.risk_score || 0) >= 70).length;
    const mediumRiskVendors = vendors.filter(v => {
      const score = v.risk_score || 0;
      return score >= 40 && score < 70;
    }).length;
    const lowRiskVendors = vendors.filter(v => (v.risk_score || 0) < 40).length;
    const compliantVendors = vendors.filter(v => v.compliance_status === 'compliant').length;
    const nonCompliantVendors = vendors.filter(v => v.compliance_status === 'non-compliant').length;
    const averageRiskScore = vendors.length > 0 
      ? vendors.reduce((sum, v) => sum + (v.risk_score || 0), 0) / vendors.length 
      : 0;

    setMetrics({
      totalVendors,
      highRiskVendors,
      mediumRiskVendors,
      lowRiskVendors,
      compliantVendors,
      nonCompliantVendors,
      averageRiskScore: Math.round(averageRiskScore * 10) / 10,
      riskTrend: Math.random() > 0.5 ? 'up' : 'down',
      complianceTrend: Math.random() > 0.5 ? 'up' : 'down'
    });
  };

  const loadReports = async () => {
    // Mock reports data
    const mockReports: RiskReport[] = [
      {
        id: '1',
        title: 'Executive Risk Summary',
        type: 'executive',
        generatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        period: 'Last 30 days',
        summary: {
          totalVendors: vendors.length,
          highRiskVendors: vendors.filter(v => (v.risk_score || 0) >= 70).length,
          complianceIssues: vendors.filter(v => v.compliance_status === 'non-compliant').length,
          averageRiskScore: vendors.length > 0 
            ? Math.round(vendors.reduce((sum, v) => sum + (v.risk_score || 0), 0) / vendors.length * 10) / 10
            : 0
        },
        data: {}
      },
      {
        id: '2',
        title: 'Detailed Risk Analysis',
        type: 'detailed',
        generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        period: 'Last 30 days',
        summary: {
          totalVendors: vendors.length,
          highRiskVendors: vendors.filter(v => (v.risk_score || 0) >= 70).length,
          complianceIssues: vendors.filter(v => v.compliance_status === 'non-compliant').length,
          averageRiskScore: vendors.length > 0 
            ? Math.round(vendors.reduce((sum, v) => sum + (v.risk_score || 0), 0) / vendors.length * 10) / 10
            : 0
        },
        data: {}
      },
      {
        id: '3',
        title: 'Compliance Report',
        type: 'compliance',
        generatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        period: 'Last 30 days',
        summary: {
          totalVendors: vendors.length,
          highRiskVendors: vendors.filter(v => (v.risk_score || 0) >= 70).length,
          complianceIssues: vendors.filter(v => v.compliance_status === 'non-compliant').length,
          averageRiskScore: vendors.length > 0 
            ? Math.round(vendors.reduce((sum, v) => sum + (v.risk_score || 0), 0) / vendors.length * 10) / 10
            : 0
        },
        data: {}
      }
    ];
    setReports(mockReports);
  };

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newReport: RiskReport = {
        id: Date.now().toString(),
        title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
        type: reportType,
        generatedAt: new Date().toISOString(),
        period: getPeriodLabel(dateRange),
        summary: {
          totalVendors: vendors.length,
          highRiskVendors: vendors.filter(v => (v.risk_score || 0) >= 70).length,
          complianceIssues: vendors.filter(v => v.compliance_status === 'non-compliant').length,
          averageRiskScore: vendors.length > 0 
            ? Math.round(vendors.reduce((sum, v) => sum + (v.risk_score || 0), 0) / vendors.length * 10) / 10
            : 0
        },
        data: {}
      };

      setReports(prev => [newReport, ...prev]);
      setSelectedReport(newReport);
    } finally {
      setIsGenerating(false);
    }
  };

  const getPeriodLabel = (range: string) => {
    switch (range) {
      case '7d': return 'Last 7 days';
      case '30d': return 'Last 30 days';
      case '90d': return 'Last 90 days';
      case '1y': return 'Last year';
      default: return 'Last 30 days';
    }
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'executive': return <BarChart3 className="h-4 w-4" />;
      case 'detailed': return <FileText className="h-4 w-4" />;
      case 'compliance': return <Shield className="h-4 w-4" />;
      case 'trend': return <TrendingUp className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const _getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const _getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />;
      case 'stable': return <Clock className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Risk Reporting Dashboard
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Generate and view comprehensive vendor risk reports
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => onExport?.('pdf')}
                variant="ghost"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button
                onClick={() => onExport?.('excel')}
                variant="ghost"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Vendors</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.totalVendors}
                </p>
              </div>
              <Shield className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">High Risk</p>
                <p className="text-2xl font-bold text-red-600">
                  {metrics.highRiskVendors}
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
                <p className="text-sm text-gray-500 dark:text-gray-400">Compliant</p>
                <p className="text-2xl font-bold text-green-600">
                  {metrics.compliantVendors}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Avg Risk Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.averageRiskScore}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Generate New Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="executive">Executive Summary</option>
                <option value="detailed">Detailed Analysis</option>
                <option value="compliance">Compliance Report</option>
                <option value="trend">Trend Analysis</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time Period
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={generateReport}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Risk Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {metrics.highRiskVendors}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">High Risk</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2 dark:bg-gray-700">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${(metrics.highRiskVendors / metrics.totalVendors) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {metrics.mediumRiskVendors}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Medium Risk</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2 dark:bg-gray-700">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${(metrics.mediumRiskVendors / metrics.totalVendors) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {metrics.lowRiskVendors}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Low Risk</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2 dark:bg-gray-700">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(metrics.lowRiskVendors / metrics.totalVendors) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Recent Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {getReportTypeIcon(report.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {report.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {report.period} • Generated {new Date(report.generatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedReport(report)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onExport?.('pdf')}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Preview Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedReport.title}
              </h2>
              <Button
                variant="ghost"
                onClick={() => setSelectedReport(null)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedReport.summary.totalVendors}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Vendors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {selectedReport.summary.highRiskVendors}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">High Risk</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {selectedReport.summary.complianceIssues}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Compliance Issues</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedReport.summary.averageRiskScore}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Avg Risk Score</div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Report Summary
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  This report covers {selectedReport.period.toLowerCase()} and provides a comprehensive 
                  analysis of vendor risk across {selectedReport.summary.totalVendors} vendors. 
                  {selectedReport.summary.highRiskVendors > 0 && (
                    <> {selectedReport.summary.highRiskVendors} vendors are currently classified as high risk and require immediate attention.</>
                  )}
                  {selectedReport.summary.complianceIssues > 0 && (
                    <> {selectedReport.summary.complianceIssues} compliance issues have been identified and need to be addressed.</>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorRiskReporting;
