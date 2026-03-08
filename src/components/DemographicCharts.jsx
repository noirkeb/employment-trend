import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p className="tooltip-label">{data.name}</p>
        <p className="tooltip-value">취업률: <span style={{ color: data.color || payload[0].fill, fontWeight: 'bold', fontSize: '1.1rem' }}>{data.rate}%</span></p>
      </div>
    );
  }
  return null;
};

const DemographicCharts = ({ genderData, universityTypeData }) => {
  const [activeGender, setActiveGender] = useState(genderData[0]);
  const [activeUni, setActiveUni] = useState(universityTypeData[1]); // Default to 전문대학

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
      
      {/* 성별 비교 차트 */}
      <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', textAlign: 'center', color: 'var(--text-primary)' }}>성별 취업률 비교</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={genderData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#f8fafc', fontSize: 14 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar 
              dataKey="rate" 
              radius={[0, 6, 6, 0]} 
              barSize={40}
              onClick={(data) => setActiveGender(data)}
              style={{ cursor: 'pointer' }}
            >
              {genderData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  opacity={activeGender && activeGender.name === entry.name ? 1 : 0.6}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
          * 막대를 클릭하면 아래에 상세 분석이 나타납니다.
        </p>

        {activeGender && (
          <div style={{ marginTop: '16px', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', borderLeft: `4px solid ${activeGender.color}` }}>
            <h4 style={{ color: activeGender.color, marginBottom: '8px' }}>{activeGender.name} 취업 분석</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '12px' }}>
              {activeGender.insight}
            </p>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              <strong>대표 강세/추천 학과:</strong>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                {activeGender.majors.map(major => (
                  <span key={major} style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>{major}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 학제별 비교 차트 */}
      <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', textAlign: 'center', color: 'var(--text-primary)' }}>학제별 취업률 (대학 유형)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={universityTypeData}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="rate"
              onClick={(data) => setActiveUni(data.payload)}
              style={{ cursor: 'pointer' }}
            >
              {universityTypeData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  style={{ outline: 'none' }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '14px', color: '#94a3b8' }} onClick={(e) => {
              const clickedItem = universityTypeData.find(item => item.name === e.value);
              if (clickedItem) setActiveUni(clickedItem);
            }} />
          </PieChart>
        </ResponsiveContainer>
        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0px' }}>
          * 조각이나 범례를 클릭하면 아래에 상세 분석이 나타납니다.
        </p>

        {activeUni && (
          <div style={{ marginTop: '16px', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px', borderLeft: `4px solid ${activeUni.color}` }}>
            <h4 style={{ color: activeUni.color, marginBottom: '8px' }}>{activeUni.name} 취업 분석</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '12px' }}>
              {activeUni.insight}
            </p>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              <strong>유리한 추천 학과:</strong>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                {activeUni.majors.map(major => (
                  <span key={major} style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>{major}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default DemographicCharts;
