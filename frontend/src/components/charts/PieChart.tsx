import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface DataItem {
  name: string;
  value: number;
  percentage: number;
}

interface PieChartProps {
  data: Record<string, number>;
  totalResponses: number;
  title: string;
}

export function PieChart({ data, totalResponses, title }: PieChartProps) {
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
  const textColor = theme === 'dark' ? '#e5e7eb' : '#374151';
  const backgroundColor = theme === 'dark' ? '#1f2937' : '#ffffff';
  
  // Generate colors for pie slices
  const COLORS = theme === 'dark' 
    ? ['#8b5cf6', '#6366f1', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4']
    : ['#7c3aed', '#4f46e5', '#db2777', '#e11d48', '#ea580c', '#ca8a04', '#16a34a', '#0891b2'];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any)=> {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="w-full h-80 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="90%">
        <RechartsPieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
                <Cell
                    key={`cell-${index}`}
                    fill={entry.name.toLowerCase() === 'no' ? '#ef4444' : COLORS[index % COLORS.length]} // Tailwind red-500
                />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => {
              const item = chartData.find(item => item.name === name);
              return [`${value} (${item?.percentage}%)`, name];
            }}
            contentStyle={{ backgroundColor, color: textColor, border: 'none', borderRadius: '4px' }}
          />
          <Legend 
            formatter={(value: string) => (
              <span style={{ color: textColor }}>{value}</span>
            )}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}