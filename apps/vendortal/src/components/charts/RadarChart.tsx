import React from 'react';
import { RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface RadarChartProps {
  data: Array<{
    dimension: string;
    risk: number;
    required: number;
    fullMark: number;
  }>;
  height?: number;
  width?: string;
  className?: string;
}

const RadarChart: React.FC<RadarChartProps> = ({ 
  data, 
  height = 300, 
  width = "100%", 
  className = "" 
}) => {
  // Ensure we have valid data
  if (!data || data.length === 0) {
    return (
      <div className={className} style={{ height: `${height}px`, width }}>
        <div className="flex items-center justify-center h-full text-gray-500">
          No data available for radar chart
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ height: `${height}px`, width }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart 
          data={data}
          cx="50%"
          cy="50%"
          outerRadius="80%"
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <PolarGrid 
            gridType="polygon"
            radialLines={true}
            stroke="#e5e7eb"
            strokeWidth={1}
          />
          <PolarAngleAxis 
            dataKey="dimension" 
            tick={{ 
              fontSize: 11, 
              fill: '#374151',
              fontWeight: 500
            }}
            tickLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
            axisLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
          />
          <PolarRadiusAxis
            angle={0}
            domain={[0, 100]}
            tick={{ 
              fontSize: 9, 
              fill: '#6b7280',
              fontWeight: 400
            }}
            tickCount={6}
            axisLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
            tickLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
          />
          <Radar
            name="Current Risk"
            dataKey="risk"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.2}
            strokeWidth={2}
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
          />
          <Radar
            name="Required Controls"
            dataKey="required"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.1}
            strokeWidth={2}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
          />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-900 dark:text-white mb-2">{label}</p>
                    {payload.map((entry, index) => (
                      <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: {entry.value}%
                      </p>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{ 
              paddingTop: '10px',
              fontSize: '12px',
              fontWeight: '500'
            }}
            iconType="circle"
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChart;

