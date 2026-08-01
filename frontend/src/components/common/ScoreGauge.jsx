import React from 'react';

export const ScoreGauge = ({ score = 0, size = 120, strokeWidth = 10, label = "Match Score" }) => {
  const normalizedScore = Math.min(Math.max(score, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  // Dynamic Apple color gradient based on score value
  let strokeColor = "#0071e3"; // Apple Blue
  if (normalizedScore >= 90) strokeColor = "#34c759"; // Apple Green
  else if (normalizedScore >= 75) strokeColor = "#0071e3"; // Apple Blue
  else if (normalizedScore >= 60) strokeColor = "#ff9500"; // Apple Orange
  else strokeColor = "#ff3b30"; // Apple Red

  return (
    <div className="relative flex flex-col items-center justify-center inline-block">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Fill Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{ transition: 'stroke-dashoffset 1s ease-out, stroke 0.5s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold tracking-tight font-sans text-slate-900">
          {normalizedScore}%
        </span>
        {label && <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">{label}</span>}
      </div>
    </div>
  );
};
