
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MobilityChartProps {
    data: { week: string; score: number }[];
}

const MobilityChart: React.FC<MobilityChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="score" stroke="#0077b6" strokeWidth={2} activeDot={{ r: 8 }} name="Mobility Score"/>
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MobilityChart;
