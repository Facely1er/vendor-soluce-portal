import { useMemo } from 'react';

interface ChartData {
  [key: string]: string | number | boolean | undefined;
}

interface UseChartDataOptions {
  data: ChartData[];
  type: 'radar' | 'pie' | 'line' | 'bar' | 'area';
  dataKey?: string;
  xAxisKey?: string;
}

export const useChartData = ({ data, type, dataKey = 'value', xAxisKey = 'name' }: UseChartDataOptions) => {
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    switch (type) {
      case 'radar':
        return data.map(item => ({
          dimension: item[xAxisKey] || item.dimension,
          risk: item.risk || item[dataKey] || 0,
          required: item.required || 0,
          fullMark: item.fullMark || 100
        }));

      case 'pie':
        return data.map(item => ({
          name: item[xAxisKey] || item.name,
          value: item[dataKey] || item.value || 0,
          color: item.color
        }));

      case 'line':
      case 'bar':
      case 'area':
        return data.map(item => ({
          [xAxisKey]: item[xAxisKey] || item.name,
          ...Object.keys(item).reduce((acc, key) => {
            if (key !== xAxisKey && key !== 'name') {
              acc[key] = item[key];
            }
            return acc;
          }, {} as Record<string, string | number | boolean | undefined>)
        }));

      default:
        return data;
    }
  }, [data, type, dataKey, xAxisKey]);

  const chartConfig = useMemo(() => {
    switch (type) {
      case 'radar':
        return {
          lines: [
            { dataKey: 'risk', stroke: '#ef4444', name: 'Current Risk' },
            { dataKey: 'required', stroke: '#10b981', name: 'Required Controls' }
          ]
        };

      case 'pie':
        return {
          colors: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']
        };

      case 'line':
        return {
          lines: [
            { dataKey: dataKey, stroke: '#8884d8', name: 'Value' }
          ]
        };

      case 'bar':
        return {
          bars: [
            { dataKey: dataKey, fill: '#8884d8', name: 'Value' }
          ]
        };

      case 'area':
        return {
          areas: [
            { dataKey: dataKey, stroke: '#8884d8', fill: '#8884d8', name: 'Value' }
          ]
        };

      default:
        return {};
    }
  }, [type, dataKey]);

  return {
    processedData,
    chartConfig
  };
};

