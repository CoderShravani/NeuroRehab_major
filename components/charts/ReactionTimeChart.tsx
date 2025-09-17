import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ReactionTimeChartProps {
    data: { name: string; time: number }[];
}

const ReactionTimeChart: React.FC<ReactionTimeChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis label={{ value: 'ms', angle: -90, position: 'insideLeft' }} />
        <Tooltip formatter={(value: number) => `${value} ms`} />
        <Legend />
        <Line type="monotone" dataKey="time" stroke="#8884d8" strokeWidth={2} name="Reaction Time"/>
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ReactionTimeChart;
