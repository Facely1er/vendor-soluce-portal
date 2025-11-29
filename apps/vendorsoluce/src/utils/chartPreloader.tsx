import { useEffect, useState } from 'react';
import React from 'react';

interface ChartPreloaderProps {
  onLoad?: () => void;
  delay?: number;
}

export const useChartPreloader = ({ onLoad, delay = 0 }: ChartPreloaderProps = {}) => {
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const preloadCharts = async () => {
      try {
        // Preload recharts components
        const rechartsModule = await import('recharts');
        
        // Preload specific chart components
        const chartComponents = [
          'RadarChart',
          'PieChart', 
          'LineChart',
          'BarChart',
          'AreaChart',
          'ResponsiveContainer',
          'PolarGrid',
          'PolarAngleAxis',
          'PolarRadiusAxis',
          'Radar',
          'Pie',
          'Cell',
          'Line',
          'Bar',
          'Area',
          'XAxis',
          'YAxis',
          'CartesianGrid',
          'Tooltip',
          'Legend'
        ];

        // Ensure all components are loaded
        for (const component of chartComponents) {
          if (rechartsModule[component]) {
            // Component is available
          }
        }

        // Add delay if specified
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        setIsPreloaded(true);
        setIsLoading(false);
        onLoad?.();
      } catch (error) {
        console.error('Failed to preload charts:', error);
        setIsLoading(false);
      }
    };

    preloadCharts();
  }, [onLoad, delay]);

  return { isPreloaded, isLoading };
};

export const ChartPreloader: React.FC<ChartPreloaderProps> = ({ onLoad, delay }) => {
  const { isPreloaded, isLoading } = useChartPreloader({ onLoad, delay });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading charts...</span>
      </div>
    );
  }

  return null;
};
