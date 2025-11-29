import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import LazyChart from '../charts/LazyChart';
import { 
  TrendingUp, 
  AlertTriangle, 
  Move, 
  X, 
  Settings, 
  Plus, 
  Eye, 
  EyeOff, 
  Shield, 
  BarChart3, 
  PieChart 
} from 'lucide-react';

interface DashboardWidget {
  id: string;
  title: string;
  type: 'metric' | 'chart' | 'table' | 'alerts';
  size: 'small' | 'medium' | 'large';
  data: Record<string, unknown>;
  isVisible: boolean;
  position: { x: number; y: number };
}

interface MetricData {
  value: number;
  label: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

const CustomizableDashboard: React.FC = () => {
  const [editMode, setEditMode] = useState(false);
  const [widgets, setWidgets] = useState<DashboardWidget[]>([
    {
      id: 'widget-1',
      title: 'Total Vendors',
      type: 'metric',
      size: 'small',
      isVisible: true,
      position: { x: 0, y: 0 },
      data: { value: 127, label: 'Active Vendors', change: 12, trend: 'up' }
    },
    {
      id: 'widget-2',
      title: 'High Risk Vendors',
      type: 'metric',
      size: 'small',
      isVisible: true,
      position: { x: 1, y: 0 },
      data: { value: 8, label: 'Require Attention', change: -2, trend: 'down' }
    },
    {
      id: 'widget-3',
      title: 'SBOM Compliance',
      type: 'metric',
      size: 'small',
      isVisible: true,
      position: { x: 2, y: 0 },
      data: { value: 89, label: '% Compliant', change: 5, trend: 'up' }
    },
    {
      id: 'widget-4',
      title: 'Critical Vulnerabilities',
      type: 'metric',
      size: 'small',
      isVisible: true,
      position: { x: 3, y: 0 },
      data: { value: 3, label: 'Open CVEs', change: -5, trend: 'down' }
    },
    {
      id: 'widget-5',
      title: 'Risk Distribution',
      type: 'chart',
      size: 'medium',
      isVisible: true,
      position: { x: 0, y: 1 },
      data: {
        chartType: 'pie',
        data: [
          { name: 'Low Risk', value: 72, color: '#10B981' },
          { name: 'Medium Risk', value: 47, color: '#F59E0B' },
          { name: 'High Risk', value: 8, color: '#EF4444' }
        ]
      }
    },
    {
      id: 'widget-6',
      title: 'Recent Alerts',
      type: 'alerts',
      size: 'medium',
      isVisible: true,
      position: { x: 2, y: 1 },
      data: {
        alerts: [
          { id: 1, message: 'New critical vulnerability detected in vendor software', severity: 'critical', time: '2h ago' },
          { id: 2, message: 'Vendor assessment overdue for TechCorp Solutions', severity: 'high', time: '4h ago' },
          { id: 3, message: 'SBOM compliance check completed for CloudSecure', severity: 'info', time: '6h ago' }
        ]
      }
    }
  ]);

  const toggleWidget = (widgetId: string) => {
    setWidgets(prev => prev.map(widget =>
      widget.id === widgetId ? { ...widget, isVisible: !widget.isVisible } : widget
    ));
  };

  const renderMetricWidget = (widget: DashboardWidget) => {
    const data = widget.data as MetricData;
    return (
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{data.label}</p>
            </div>
            <div className={`flex items-center text-sm ${
              data.trend === 'up' ? 'text-green-600 dark:text-green-400' : 
              data.trend === 'down' ? 'text-red-600 dark:text-red-400' : 
              'text-gray-600 dark:text-gray-400'
            }`}>
              <TrendingUp className={`h-4 w-4 mr-1 ${data.trend === 'down' ? 'rotate-180' : ''}`} />
              {Math.abs(data.change)}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderChartWidget = (widget: DashboardWidget) => {
    const data = widget.data;
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">{widget.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <LazyChart
            type={data.chartType || 'pie'}
            data={data.data || []}
            height={192}
            className="w-full"
          />
        </CardContent>
      </Card>
    );
  };

  const renderAlertsWidget = (widget: DashboardWidget) => {
    const data = widget.data;
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
            {widget.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.alerts.map((alert: Record<string, unknown>) => (
              <div key={alert.id} className="border-l-4 border-orange-400 pl-3 py-2">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.message}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{alert.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderWidget = (widget: DashboardWidget) => {
    if (!widget.isVisible) return null;

    const baseClasses = `relative ${
      widget.size === 'small' ? 'col-span-1' : 
      widget.size === 'medium' ? 'col-span-2' : 'col-span-3'
    }`;

    return (
      <div key={widget.id} className={baseClasses}>
        {editMode && (
          <div className="absolute top-2 right-2 z-10 flex space-x-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Move className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0"
              onClick={() => toggleWidget(widget.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
        
        {widget.type === 'metric' && renderMetricWidget(widget)}
        {widget.type === 'chart' && renderChartWidget(widget)}
        {widget.type === 'alerts' && renderAlertsWidget(widget)}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Supply Chain Dashboard</h2>
        <div className="flex space-x-2">
          <Button
            variant={editMode ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setEditMode(!editMode)}
          >
            <Settings className="h-4 w-4 mr-2" />
            {editMode ? 'Save Layout' : 'Customize'}
          </Button>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Widget
          </Button>
        </div>
      </div>

      {editMode && (
        <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">Widget Visibility</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {widgets.map((widget) => (
                <Button
                  key={widget.id}
                  variant={widget.isVisible ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => toggleWidget(widget.id)}
                  className="justify-start"
                >
                  {widget.isVisible ? <Eye className="h-3 w-3 mr-2" /> : <EyeOff className="h-3 w-3 mr-2" />}
                  {widget.title}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {widgets.map(renderWidget)}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-supply-chain-teal" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-tour="quick-actions">
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => window.location.href = '/vendor-risk-dashboard'}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => window.location.href = '/supply-chain-assessment'}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Run Assessment
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => window.location.href = '/sbom-analyzer'}
            >
              <PieChart className="h-4 w-4 mr-2" />
              Analyze SBOM
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => {
                // In a real app, this would generate a report
                alert('Report generation would start here');
              }}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomizableDashboard;