import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { 
  Shield, 
  Building2,
  Users, 
  Lock,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  ArrowRight,
  Activity,
  Target,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface StakeholderView {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  primaryColor: string;
  metrics: Array<{
    label: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down' | 'stable';
    status?: 'good' | 'warning' | 'critical';
  }>;
  charts: Array<{
    title: string;
    type: 'pie' | 'line' | 'bar';
    data: any;
  }>;
  insights: Array<{
    title: string;
    description: string;
    action?: string;
    actionLink?: string;
  }>;
}

const StakeholderDashboardDemo: React.FC = () => {
  const [activeView, setActiveView] = useState<string>('security');

  const stakeholderViews: StakeholderView[] = [
    {
      id: 'security',
      title: 'Security Professional Dashboard',
      description: 'Monitor threats, vulnerabilities, and security posture across your supply chain',
      icon: <Shield className="h-8 w-8 text-red-600" />,
      primaryColor: 'red',
      metrics: [
        { label: 'Critical Vulnerabilities', value: 12, change: '-3 this week', trend: 'down', status: 'warning' },
        { label: 'SBOM Compliance', value: '89%', change: '+5%', trend: 'up', status: 'good' },
        { label: 'High-Risk Vendors', value: 8, change: '-2', trend: 'down', status: 'good' },
        { label: 'Security Score', value: '85/100', change: '+7 points', trend: 'up', status: 'good' }
      ],
      charts: [
        {
          title: 'Vulnerability Trends',
          type: 'line',
          data: { labels: ['Jan', 'Feb', 'Mar', 'Apr'], values: [45, 32, 28, 19] }
        },
        {
          title: 'Risk Distribution',
          type: 'pie',
          data: [
            { name: 'Low Risk', value: 72, color: '#10B981' },
            { name: 'Medium Risk', value: 45, color: '#F59E0B' },
            { name: 'High Risk', value: 12, color: '#EF4444' },
            { name: 'Critical Risk', value: 3, color: '#DC2626' }
          ]
        }
      ],
      insights: [
        {
          title: 'Immediate Action Required',
          description: '3 critical vulnerabilities detected in production systems',
          action: 'View Details',
          actionLink: '/sbom-analyzer'
        },
        {
          title: 'Compliance Improvement',
          description: 'NIST 800-161 compliance increased by 12% this quarter',
          action: 'View Report'
        }
      ]
    },
    {
      id: 'procurement',
      title: 'Procurement Manager Dashboard',
      description: 'Optimize vendor relationships, costs, and procurement efficiency',
      icon: <Building2 className="h-8 w-8 text-blue-600" />,
      primaryColor: 'blue',
      metrics: [
        { label: 'Active Vendors', value: 127, change: '+8 this month', trend: 'up', status: 'good' },
        { label: 'Cost Savings', value: '$2.4M', change: '+15%', trend: 'up', status: 'good' },
        { label: 'Assessment Time', value: '12 days', change: '-5 days', trend: 'down', status: 'good' },
        { label: 'Contract Compliance', value: '94%', change: '+3%', trend: 'up', status: 'good' }
      ],
      charts: [
        {
          title: 'Vendor Portfolio Value',
          type: 'bar',
          data: { categories: ['Technology', 'Services', 'Hardware', 'Cloud'], values: [45, 32, 18, 15] }
        },
        {
          title: 'Risk vs. Performance',
          type: 'pie',
          data: [
            { name: 'High Performance, Low Risk', value: 65, color: '#10B981' },
            { name: 'High Performance, High Risk', value: 25, color: '#F59E0B' },
            { name: 'Low Performance', value: 10, color: '#EF4444' }
          ]
        }
      ],
      insights: [
        {
          title: 'Vendor Optimization Opportunity',
          description: 'Consolidating 3 similar vendors could save $340K annually',
          action: 'View Analysis',
          actionLink: '/vendor-risk-dashboard'
        },
        {
          title: 'Contract Renewals',
          description: '12 critical vendor contracts up for renewal in Q2',
          action: 'View Calendar'
        }
      ]
    },
    {
      id: 'compliance',
      title: 'Compliance Officer Dashboard',
      description: 'Track regulatory compliance, audit readiness, and framework adherence',
      icon: <Lock className="h-8 w-8 text-green-600" />,
      primaryColor: 'green',
      metrics: [
        { label: 'NIST 800-161 Score', value: '78%', change: '+12%', trend: 'up', status: 'good' },
        { label: 'Audit Readiness', value: '92%', change: '+5%', trend: 'up', status: 'good' },
        { label: 'Policy Violations', value: 3, change: '-7', trend: 'down', status: 'good' },
        { label: 'Documentation Complete', value: '96%', change: '+8%', trend: 'up', status: 'good' }
      ],
      charts: [
        {
          title: 'Compliance Trends',
          type: 'line',
          data: { labels: ['Q1', 'Q2', 'Q3', 'Q4'], values: [65, 72, 78, 85] }
        },
        {
          title: 'Framework Coverage',
          type: 'pie',
          data: [
            { name: 'NIST 800-161', value: 78, color: '#10B981' },
            { name: 'ISO 27001', value: 82, color: '#3B82F6' },
            { name: 'SOC 2', value: 91, color: '#8B5CF6' },
            { name: 'FedRAMP', value: 74, color: '#F59E0B' }
          ]
        }
      ],
      insights: [
        {
          title: 'Regulatory Update',
          description: 'New NIST guidelines published - impact assessment needed',
          action: 'View Guidelines',
          actionLink: '/templates'
        },
        {
          title: 'Audit Preparation',
          description: 'Annual compliance audit scheduled for next month',
          action: 'Prepare Documents'
        }
      ]
    },
    {
      id: 'executive',
      title: 'Executive Dashboard',
      description: 'Strategic insights, ROI metrics, and high-level risk indicators',
      icon: <Users className="h-8 w-8 text-purple-600" />,
      primaryColor: 'purple',
      metrics: [
        { label: 'Supply Chain ROI', value: '340%', change: '+25%', trend: 'up', status: 'good' },
        { label: 'Risk Reduction', value: '45%', change: '+12%', trend: 'up', status: 'good' },
        { label: 'Time to Compliance', value: '60 days', change: '-30 days', trend: 'down', status: 'good' },
        { label: 'Business Impact', value: '$12.8M', change: 'Risk avoided', trend: 'up', status: 'good' }
      ],
      charts: [
        {
          title: 'Strategic Risk Overview',
          type: 'bar',
          data: { categories: ['Operational', 'Financial', 'Regulatory', 'Reputational'], values: [25, 35, 15, 25] }
        },
        {
          title: 'Investment vs. Return',
          type: 'line',
          data: { labels: ['2023', '2024', '2025 (Proj)'], values: [100, 180, 340] }
        }
      ],
      insights: [
        {
          title: 'Strategic Opportunity',
          description: 'Supply chain optimization could unlock $2.1M in annual savings',
          action: 'View Strategy',
          actionLink: '/contact'
        },
        {
          title: 'Competitive Advantage',
          description: 'Your supply chain security maturity is 35% above industry average',
          action: 'View Benchmark'
        }
      ]
    }
  ];

  const activeStakeholder = stakeholderViews.find(view => view.id === activeView) || stakeholderViews[0];

  const getMetricColor = (status?: string) => {
    switch (status) {
      case 'good': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'critical': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Role-Based Dashboard Demo
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience how VendorTal adapts to your role and provides relevant insights for your responsibilities
            </p>
          </div>

          {/* Stakeholder Selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {stakeholderViews.map((view) => (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                  activeView === view.id
                    ? 'bg-vendortal-purple text-white shadow-lg transform scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md'
                }`}
              >
                {view.icon}
                <span className="ml-3">{view.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Dashboard */}
        <div className="space-y-8">
          {/* Dashboard Header */}
          <Card className="border-l-4 border-l-vendortal-purple">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {activeStakeholder.icon}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {activeStakeholder.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      {activeStakeholder.description}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                  <Link to="/contact">
                    <Button variant="primary" size="sm">
                      Schedule Demo
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeStakeholder.metrics.map((metric, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {metric.label}
                      </p>
                      <p className={`text-2xl font-bold ${getMetricColor(metric.status)}`}>
                        {metric.value}
                      </p>
                      {metric.change && (
                        <div className="flex items-center mt-2">
                          {getTrendIcon(metric.trend)}
                          <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                            {metric.change}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {activeStakeholder.charts.map((chart, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-vendortal-purple" />
                    {chart.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    {chart.type === 'pie' && Array.isArray(chart.data) && (
                      <div className="flex items-center space-x-6">
                        <div className="w-32 h-32 rounded-full border-8 border-gray-200 dark:border-gray-700 relative">
                          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-vendortal-purple to-vendortal-light-purple"></div>
                        </div>
                        <div className="space-y-2">
                          {chart.data.map((item: any, i: number) => (
                            <div key={i} className="flex items-center text-sm">
                              <div 
                                className="w-3 h-3 rounded-full mr-2" 
                                style={{ backgroundColor: item.color }}
                              ></div>
                              <span className="text-gray-700 dark:text-gray-300">
                                {item.name}: {item.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {chart.type === 'line' && (
                      <div className="w-full">
                        <div className="flex justify-between items-end h-32 space-x-2">
                          {chart.data.labels?.map((label: string, i: number) => (
                            <div key={i} className="flex flex-col items-center">
                              <div 
                                className="w-8 bg-vendortal-purple rounded-t"
                                style={{ height: `${(chart.data.values[i] / Math.max(...chart.data.values)) * 100}%` }}
                              ></div>
                              <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">{label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {chart.type === 'bar' && (
                      <div className="w-full">
                        <div className="flex justify-between items-end h-32 space-x-2">
                          {chart.data.categories?.map((category: string, i: number) => (
                            <div key={i} className="flex flex-col items-center">
                              <div 
                                className="w-12 bg-vendortal-purple rounded-t"
                                style={{ height: `${(chart.data.values[i] / Math.max(...chart.data.values)) * 100}%` }}
                              ></div>
                              <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">{category}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Insights and Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeStakeholder.insights.map((insight, index) => (
              <Card key={index} className="border-l-4 border-l-vendortal-purple">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                        {insight.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                  {insight.action && (
                    <div className="flex justify-end">
                      {insight.actionLink ? (
                        <Link to={insight.actionLink}>
                          <Button variant="outline" size="sm">
                            {insight.action}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      ) : (
                        <Button variant="outline" size="sm">
                          {insight.action}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-vendortal-purple to-vendortal-light-purple text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">
                Ready to Experience VendorTal for Your Role?
              </h2>
              <p className="text-xl text-gray-100 mb-6 max-w-2xl mx-auto">
                See how our platform adapts to your specific needs and provides the insights that matter most to your role.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/vendor-assessments">
                  <Button variant="secondary" size="lg" className="bg-white text-vendortal-purple hover:bg-gray-100">
                    <Target className="h-5 w-5 mr-2" />
                    Start Free Assessment
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/20">
                    <Calendar className="h-5 w-5 mr-2" />
                    Schedule Personal Demo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default StakeholderDashboardDemo;