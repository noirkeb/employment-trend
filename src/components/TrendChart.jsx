import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const TrendChart = ({ data, color, title }) => {
  // If data doesn't exist yet, we prevent crashing
  if (!data || data.length === 0) return null;

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
      <h4 style={{ color: 'var(--text-primary)', marginBottom: '16px', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <TrendingUp size={18} style={{ color }} />
        {title ? title : '5년 취업률 추이 (2020~2024)'}
      </h4>
      <div style={{ width: '100%', height: '220px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" vertical={false} />
            <XAxis 
              dataKey="year" 
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} 
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              domain={['dataMin - 2', 'dataMax + 2']} 
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} 
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}%`}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: 'var(--text-secondary)', marginBottom: '4px' }}
              formatter={(value) => [`${value}%`, '취업률']}
              labelFormatter={(label) => `${label}년`}
            />
            <Line 
              type="monotone" 
              dataKey="rate" 
              stroke={color || 'var(--accent-color)'} 
              strokeWidth={3}
              dot={{ fill: color || 'var(--accent-color)', strokeWidth: 2, r: 4, stroke: '#0f172a' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;
