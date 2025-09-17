import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GamesPlayedChartProps {
    data: { name: string; value: number }[];
}

const COLORS = ['#0077b6', '#00b4d8', '#48cae4', '#90e0ef'];

const GamesPlayedChart: React.FC<GamesPlayedChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          // FIX: The 'percent' property from recharts can be undefined if the total data value is 0.
          // Multiplying an undefined value would cause a type error, so a fallback to 0 is provided to ensure safety.
          label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default GamesPlayedChart;