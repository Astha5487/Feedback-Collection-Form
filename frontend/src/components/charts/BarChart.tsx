import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface DataItem {
  name: string;
  value: number;
  percentage: number;
}

interface BarChartProps {
  data: Record<string, number>;
  totalResponses: number;
  title: string;
}

export function BarChart({ data, totalResponses, title }: BarChartProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [chartData, setChartData] = useState<DataItem[]>([]);

  // Format data for recharts
  useEffect(() => {
    const formattedData = Object.entries(data).map(([name, value]) => ({
      name,
      value,
      percentage: Math.round((value / totalResponses) * 100)
    }));
    setChartData(formattedData);
  }, [data, totalResponses]);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Colors based on theme
  const barColor = theme === 'dark' ? '#8b5cf6' : '#6366f1';
  const textColor = theme === 'dark' ? '#e5e7eb' : '#374151';
  const gridColor = theme === 'dark' ? '#4b5563' : '#e5e7eb';
  const backgroundColor = theme === 'dark' ? '#1f2937' : '#ffffff';

  return (
    <div className="w-full h-80 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="90%">
        <RechartsBarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: textColor }}
            tickLine={{ stroke: textColor }}
          />
          <YAxis 
            tick={{ fill: textColor }}
            tickLine={{ stroke: textColor }}
            label={{ value: 'Responses', angle: -90, position: 'insideLeft', fill: textColor }}
          />
          <Tooltip
            contentStyle={{ backgroundColor, color: textColor, border: `1px solid ${gridColor}` }}
          />
          <Legend wrapperStyle={{ color: textColor }} />
          <Bar 
            dataKey="value" 
            fill={barColor} 
            name="Responses" 
            radius={[4, 4, 0, 0]}
            label={{ 
              position: 'top', 
              fill: textColor, 
              formatter: (value: any) => `${value} (${chartData.find(item => item.value === value)?.percentage}%)` 
            }}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}