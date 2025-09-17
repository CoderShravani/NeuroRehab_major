import React from 'react';
import { RadialBarChart, RadialBar, Tooltip, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface GameCompletionChartProps {
    data: { name: string; value: number; fill: string }[];
}

const GameCompletionChart: React.FC<GameCompletionChartProps> = ({ data }) => {
  const percentage = data[0]?.value || 0;
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadialBarChart 
        cx="50%" 
        cy="50%" 
        innerRadius="60%" 
        outerRadius="85%" 
        barSize={20} 
        data={data}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          angleAxisId={0}
          tick={false}
        />
        <RadialBar
          background
          dataKey="value"
          cornerRadius={10}
          angleAxisId={0}
        />
        <Tooltip formatter={(value: number) => `${value}% Completed`} />
        <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
                fontSize: "28px",
                fontWeight: "bold",
                fill: '#03045e'
            }}
        >
            {`${percentage}%`}
        </text>
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

export default GameCompletionChart;
