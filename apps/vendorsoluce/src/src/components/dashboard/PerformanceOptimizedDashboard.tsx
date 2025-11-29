import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import LazyChart from '../charts/LazyChart';
import { 
  TrendingUp, 
  AlertTriangle, 
  Shield, 
  Settings,
  Plus,
  Move,
  Eye,
  EyeOff,
  RefreshCw
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
  change?: number;
  trend: 'up' | 'down' | 'stable';
}

const PerformanceOptimizedDashboard: React.FC = () => {
  const [editMode, setEditMode] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
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
      position: { x: 1, y: 1 },
      data: {
        alerts: [
          { id: '1', message: 'High-risk vendor requires immediate attention', time: '2 hours ago' },
          { id: '2', message: 'New vulnerability detected in SBOM', time: '4 hours ago' },
          { id: '3', message: 'Compliance assessment overdue', time: '1 day ago' }
        ]
      }
    }
  ]);

  const visibleWidgets = useMemo(() => 
    widgets.filter(widget => widget.isVisible), 
    [widgets]
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  }, []);

  const toggleWidgetVisibility = useCallback((widgetId: string) => {
    setWidgets(prev => prev.map(widget => 
      widget.id === widgetId 
        ? { ...widget, isVisible: !widget.isVisible }
        : widget
    ));
  }, []);

  const renderMetricWidget = useCallback((widget: DashboardWidget) => {
    const data = widget.data as MetricData;
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{widget.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {data.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {data.label}
            </div>
            {data.change !== undefined && (
              <div className={`text-sm flex items-center justify-center ${
                data.trend === 'up' ? 'text-green-600' : 
                data.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                <TrendingUp className={`h-4 w-4 mr-1 ${
                  data.trend === 'down' ? 'rotate-180' : ''
                }`} />
                {data.change > 0 ? '+' : ''}{data.change}%
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }, []);

  const renderChartWidget = useCallback((widget: DashboardWidget) => {
    const data = widget.data;
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{widget.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <LazyChart
            type={(data.chartType as 'pie' | 'bar' | 'line' | 'area' | 'radar') || 'pie'}
            data={(data.data as Array<Record<string, string | number>>) || []}
            height={200}
            className="w-full"
          />
        </CardContent>
      </Card>
    );
  }, []);

  const renderAlertsWidget = useCallback((widget: DashboardWidget) => {
    const data = widget.data;
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
            {widget.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(data.alerts as Array<{ id: string; message: string; time: string }>)?.map((alert) => (
              <div key={alert.id} className="border-l-4 border-orange-400 pl-3 py-2">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.message}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{alert.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }, []);

  const renderWidget = useCallback((widget: DashboardWidget) => {
    switch (widget.type) {
      case 'metric':
        return renderMetricWidget(widget);
      case 'chart':
        return renderChartWidget(widget);
      case 'alerts':
        return renderAlertsWidget(widget);
      default:
        return null;
    }
  }, [renderMetricWidget, renderChartWidget, renderAlertsWidget]);

  const getGridCols = useCallback((size: string) => {
    switch (size) {
      case 'small': return 'col-span-1';
      case 'medium': return 'col-span-2';
      case 'large': return 'col-span-3';
      default: return 'col-span-1';
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Performance Optimized Dashboard
        </h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant={editMode ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setEditMode(!editMode)}
          >
            <Settings className="h-4 w-4 mr-2" />
            {editMode ? 'Done' : 'Edit'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {visibleWidgets.map((widget) => (
          <div key={widget.id} className={`${getGridCols(widget.size)} ${editMode ? 'relative' : ''}`}>
            {editMode && (
              <div className="absolute top-2 right-2 z-10 flex space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleWidgetVisibility(widget.id)}
                  className="h-8 w-8 p-0"
                >
                  {widget.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 cursor-move"
                >
                  <Move className="h-4 w-4" />
                </Button>
              </div>
            )}
            {renderWidget(widget)}
          </div>
        ))}
      </div>

      {visibleWidgets.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No widgets visible
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Enable some widgets to see your dashboard data
            </p>
            <Button onClick={() => setEditMode(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Widgets
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PerformanceOptimizedDashboard;

