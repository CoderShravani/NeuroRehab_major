
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AccuracyChartProps {
    data: { day: string; score: number }[];
}

const AccuracyChart: React.FC<AccuracyChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="score" fill="#48cae4" name="Accuracy Score (%)" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AccuracyChart;
