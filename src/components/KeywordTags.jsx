import React from 'react';
import { Hash } from 'lucide-react';

const KeywordTags = ({ keywords }) => {
  if (!keywords || keywords.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
      {keywords.map((keyword, index) => (
        <span 
          key={index} 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '4px',
            padding: '6px 12px', 
            background: 'rgba(255, 255, 255, 0.05)', 
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px', 
            fontSize: '0.85rem', 
            color: 'var(--text-primary)',
            backdropFilter: 'blur(5px)',
            transition: 'all 0.3s ease',
            cursor: 'default'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.borderColor = 'var(--text-secondary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <Hash size={12} style={{ color: 'var(--accent-color)' }} />
          {keyword}
        </span>
      ))}
    </div>
  );
};

export default KeywordTags;
