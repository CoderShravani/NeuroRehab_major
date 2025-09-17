import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SessionDurationChartProps {
    data: { name: string; duration: number }[];
}

const SessionDurationChart: React.FC<SessionDurationChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis label={{ value: 'minutes', angle: -90, position: 'insideLeft' }} />
        <Tooltip formatter={(value: number) => `${value} min`} />
        <Legend />
        <Bar dataKey="duration" fill="#ffc658" name="Session Duration (min)" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SessionDurationChart;
