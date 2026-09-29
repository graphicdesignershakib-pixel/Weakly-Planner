import React from 'react';
import { Droplets, Plus, Minus, Sparkles, Check } from 'lucide-react';
import { playWaterDropSound } from '../utils/waterSound';
import { fireConfetti } from '../utils/confetti';

interface WaterTrackerProps {
  currentGlasses: number; // 0 to 8
  onUpdateGlasses: (count: number) => void;
  dayLabel?: string;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({
  currentGlasses = 0,
  onUpdateGlasses,
  dayLabel = 'Today',
}) => {
  const maxGlasses = 8;
  const glasses = Math.min(maxGlasses, Math.max(0, currentGlasses));
  const totalMl = glasses * 250;
  const progressPct = Math.round((glasses / maxGlasses) * 100);

  const handleToggleGlass = (index: number) => {
    // If clicking on current glass or next glass
    let nextCount: number;
    if (glasses === index + 1) {
      // Toggle off the last filled glass
      nextCount = index;
    } else {
      nextCount = index + 1;
    }

    if (nextCount > glasses) {
      playWaterDropSound(nextCount);
      if (nextCount === maxGlasses) {
        fireConfetti();
      }
    }
    onUpdateGlasses(nextCount);
  };

  const handleAdd = () => {
    if (glasses < maxGlasses) {
      const next = glasses + 1;
      playWaterDropSound(next);
      if (next === maxGlasses) fireConfetti();
      onUpdateGlasses(next);
    }
  };

  const handleSub = () => {
    if (glasses > 0) {
      onUpdateGlasses(glasses - 1);
    }
  };

  return (
    <div className="bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all luxury-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-gradient-to-tr from-sky-500 to-cyan-400 text-white rounded-xl shadow-md shadow-sky-500/20">
            <Droplets className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Daily Hydration Tracker ({dayLabel})
              </h3>
              {glasses >= maxGlasses && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-full border border-sky-200 dark:border-sky-800/50 shadow-2xs font-mono">
                  <Sparkles className="w-3 h-3 text-sky-500" /> Goal Reached!
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              8 Glasses Target (2,000 ml) · Tap a glass to fill
            </p>
          </div>
        </div>

        {/* Counter and controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 bg-slate-100/80 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-inner">
            <span className="text-sm font-black font-mono text-slate-900 dark:text-white tabular-nums tracking-tight">
              {totalMl} ml
            </span>
            <span className="text-xs text-[#71717A] dark:text-[#A1A1AA] font-mono">
              ({glasses}/{maxGlasses})
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleSub}
              disabled={glasses === 0}
              className="p-1 rounded border border-[#E5E7EB] dark:border-[#27272A] text-[#71717A] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white disabled:opacity-30 cursor-pointer"
              title="Decrease 1 glass"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={glasses >= maxGlasses}
              className="p-1 rounded bg-[#111111] dark:bg-white text-white dark:text-[#111111] disabled:opacity-30 cursor-pointer shadow-xs"
              title="Add 1 glass (+250ml)"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 8 Interactive Glasses Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-3">
        {Array.from({ length: maxGlasses }).map((_, i) => {
          const isFilled = i < glasses;
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleToggleGlass(i)}
              className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group ${
                isFilled
                  ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800 ring-1 ring-sky-400/40 scale-102'
                  : 'bg-[#FAFAFA] dark:bg-[#121214] border-[#E5E7EB] dark:border-[#27272A] hover:border-sky-300 hover:bg-sky-50/30'
              }`}
              title={`Glass ${i + 1} (250 ml)`}
            >
              <div
                className={`w-6 h-8 rounded-b-md border-2 flex flex-col justify-end p-0.5 transition-colors overflow-hidden relative ${
                  isFilled
                    ? 'border-sky-500 bg-sky-100 dark:bg-sky-900/40'
                    : 'border-[#D4D4D8] dark:border-[#3F3F46]'
                }`}
              >
                {/* Water level fill */}
                <div
                  className={`w-full rounded-b transition-all duration-300 ${
                    isFilled ? 'h-full bg-sky-500 shadow-inner' : 'h-0'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] font-mono font-bold ${
                  isFilled
                    ? 'text-sky-700 dark:text-sky-300'
                    : 'text-[#A1A1AA] dark:text-[#71717A]'
                }`}
              >
                {i + 1}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
