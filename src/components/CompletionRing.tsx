import React from 'react';

interface CompletionRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
}

export const CompletionRing: React.FC<CompletionRingProps> = ({
  progress,
  size = 44,
  strokeWidth = 3.5,
}) => {
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedProgress / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
      aria-label={`Completion: ${normalizedProgress}%`}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-[#E5E7EB] dark:stroke-[#27272A]"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated fill circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={`transition-all duration-300 ease-out ${
            normalizedProgress === 100
              ? 'stroke-emerald-500'
              : 'stroke-[#111111] dark:stroke-white'
          }`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <span className="absolute text-[11px] font-bold text-[#111111] dark:text-white tabular-nums font-mono">
        {normalizedProgress}%
      </span>
    </div>
  );
};
