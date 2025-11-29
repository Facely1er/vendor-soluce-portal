import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LineChartProps {
  data: Array<{
    [key: string]: string | number;
  }>;
  height?: number;
  width?: string;
  className?: string;
  dataKey?: string;
  xAxisKey?: string;
  lines?: Array<{
    dataKey: string;
    stroke: string;
    name?: string;
  }>;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  height = 300, 
  width = "100%", 
  className = "",
  xAxisKey = "name",
  lines = [{ dataKey: "value", stroke: "#8884d8", name: "Value" }],
  showGrid = true,
  showTooltip = true,
  showLegend = true
}) => {
  return (
    <div className={className} style={{ height: `${height}px`, width }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          {showTooltip && <Tooltip />}
          {showLegend && <Legend />}
          {lines.map((line, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.stroke}
              name={line.name || line.dataKey}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;

