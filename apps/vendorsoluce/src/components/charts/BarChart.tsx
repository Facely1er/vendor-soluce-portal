import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: Array<{
    [key: string]: string | number;
  }>;
  height?: number;
  width?: string;
  className?: string;
  dataKey?: string;
  xAxisKey?: string;
  bars?: Array<{
    dataKey: string;
    fill: string;
    name?: string;
  }>;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  height = 300, 
  width = "100%", 
  className = "",
  xAxisKey = "name",
  bars = [{ dataKey: "value", fill: "#8884d8", name: "Value" }],
  showGrid = true,
  showTooltip = true,
  showLegend = true
}) => {
  return (
    <div className={className} style={{ height: `${height}px`, width }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          {showTooltip && <Tooltip />}
          {showLegend && <Legend />}
          {bars.map((bar, index) => (
            <Bar
              key={index}
              dataKey={bar.dataKey}
              fill={bar.fill}
              name={bar.name || bar.dataKey}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;

