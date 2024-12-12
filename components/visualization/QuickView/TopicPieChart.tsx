'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface TopicData {
  name: string;
  value: number;
  color: string;
}

interface TopicChartProps {
  data: TopicData[];
}

const TopicPieChart: React.FC<TopicChartProps> = ({ data }) => {
  return (
    <div className="h-[280px] w-full">
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {data.map((topic) => (
          <div key={topic.name} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: topic.color }}
            />
            <span className="text-slate-400">{topic.name}</span>
            <span className="text-white font-medium">{topic.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicPieChart;