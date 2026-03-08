import React from 'react';
import { ArrowRight } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, color, onClick }) => {
  return (
    <div 
      className={`glass-card ${onClick ? 'clickable-card' : ''}`}
      onClick={onClick}
      style={{ 
        cursor: onClick ? 'pointer' : 'default', 
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        position: 'relative',
        border: onClick ? `1px solid rgba(${color}, 0.3)` : '1px solid var(--glass-border)',
        boxShadow: onClick ? `0 4px 20px -5px rgba(${color}, 0.15)` : 'var(--glass-shadow)',
        background: onClick ? 'rgba(255, 255, 255, 0.04)' : 'var(--glass-bg)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {title}
          </h3>
          <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            {value}
          </div>
        </div>
        <div style={{ padding: '10px', borderRadius: '12px', background: `rgba(${color}, 0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={24} style={{ color: `rgb(${color})` }} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {subtitle && (
          <p style={{ fontSize: '0.85rem', color: onClick ? `rgb(${color})` : 'var(--text-secondary)' }}>
            {subtitle}
          </p>
        )}
        {onClick && (
          <ArrowRight size={16} style={{ color: `rgb(${color})`, opacity: 0.8 }} className="stat-arrow" />
        )}
      </div>

      {onClick && (
        <style dangerouslySetInnerHTML={{__html: `
          .clickable-card:hover {
            transform: translateY(-4px) scale(1.02);
            border-color: rgb(${color});
            background: rgba(${color}, 0.08) !important;
          }
          .clickable-card:hover .stat-arrow {
            transform: translateX(4px);
            transition: transform 0.2s;
          }
        `}} />
      )}
    </div>
  );
};

export default StatCard;
