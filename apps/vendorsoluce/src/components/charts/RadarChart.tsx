import React from 'react';
import { RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';

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
  return (
    <div className={className} style={{ height: `${height}px`, width }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10 }} />
          <PolarRadiusAxis
            angle={0}
            domain={[0, 100]}
            tick={{ fontSize: 8 }}
          />
          <Radar
            name="Current Risk"
            dataKey="risk"
            stroke="#ef4444"
            fill="#ef4444"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name="Required Controls"
            dataKey="required"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.1}
            strokeWidth={2}
          />
          <Legend />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChart;

