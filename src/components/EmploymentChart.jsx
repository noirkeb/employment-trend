import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip" style={{ maxWidth: '300px' }}>
        <p className="tooltip-label">{label}</p>
        <p className="tooltip-value">취업률: <span style={{ color: data.color, fontWeight: 'bold' }}>{data.rate}%</span></p>
        <p className="tooltip-value">급여 수준: {data.averageSalary}</p>
        <p className="tooltip-value">전년 대비: <span className={data.trend.startsWith('+') ? 'trend-up' : 'trend-down'}>{data.trend}</span></p>
        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p className="tooltip-value" style={{ fontSize: '0.8rem', whiteSpace: 'normal' }}>
            <strong>전망: </strong>{data.outlook}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const EmploymentChart = ({ data }) => {
  return (
    <div style={{ flex: 1, minHeight: '320px', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis 
          dataKey="name" 
          tick={{ fill: '#94a3b8', fontSize: 12 }} 
          axisLine={false} 
          tickLine={false} 
          angle={-45}
          textAnchor="end"
          height={50}
        />
        <YAxis 
          tick={{ fill: '#94a3b8', fontSize: 12 }} 
          axisLine={false} 
          tickLine={false}
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
        <Bar dataKey="rate" radius={[6, 6, 0, 0]} maxBarSize={60}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmploymentChart;
