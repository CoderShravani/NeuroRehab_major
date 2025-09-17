import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AccuracyTrendChartProps {
    data: { name: string; accuracy: number }[];
}

const AccuracyTrendChart: React.FC<AccuracyTrendChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 100]} label={{ value: '%', angle: -90, position: 'insideLeft' }} />
        <Tooltip formatter={(value: number) => `${value}%`} />
        <Legend />
        <Line type="monotone" dataKey="accuracy" stroke="#82ca9d" strokeWidth={2} name="Movement Accuracy"/>
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AccuracyTrendChart;
