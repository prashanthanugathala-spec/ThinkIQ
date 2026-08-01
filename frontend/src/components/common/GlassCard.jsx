import React from 'react';

export const GlassCard = ({ children, className = '', hover = true, glow = false }) => {
  return (
    <div
      className={`rounded-2xl p-6 transition-all duration-300 ${
        hover ? 'glass-card' : 'glass-panel'
      } ${glow ? 'border-blue-400/40 shadow-lg shadow-blue-500/10' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
