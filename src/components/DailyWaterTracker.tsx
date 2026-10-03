import React, { useState, useEffect } from 'react';
import { Droplet, Sparkles, RotateCcw, Plus, Minus } from 'lucide-react';
import { playWaterDropSound } from '../utils/waterAudio';
import { fireConfetti } from '../utils/confetti';
import { useLanguage } from '../context/LanguageContext';

interface DailyWaterTrackerProps {
  dateStr?: string;
}

const TOTAL_GLASSES = 8;
const GLASS_VOLUME_ML = 250;

export const DailyWaterTracker: React.FC<DailyWaterTrackerProps> = ({
  dateStr = new Date().toISOString().split('T')[0],
}) => {
  const { isBn } = useLanguage();
  const storageKey = `water_${dateStr}`;

  const [count, setCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? Math.min(TOTAL_GLASSES, Math.max(0, parseInt(saved, 10))) : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, count.toString());
    } catch {
      // ignore
    }
  }, [count, storageKey]);

  const handleAddGlass = () => {
    if (count < TOTAL_GLASSES) {
      const next = count + 1;
      setCount(next);
      playWaterDropSound();
      if (next === TOTAL_GLASSES) {
        fireConfetti();
      }
    }
  };

  const handleRemoveGlass = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  const currentMl = count * GLASS_VOLUME_ML;
  const targetMl = TOTAL_GLASSES * GLASS_VOLUME_ML;
  const percentage = Math.round((count / TOTAL_GLASSES) * 100);

  return (
    <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs relative overflow-hidden">
      {/* Background soft ambient glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-gradient-to-tr from-sky-500 to-cyan-500 text-white rounded-xl shadow-xs">
            <Droplet className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{isBn ? 'দৈনিক পানি পান ট্র্যাকার' : 'Daily Hydration Tracker'}</span>
              {count >= TOTAL_GLASSES && (
                <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                  ✓ {isBn ? 'সম্পূর্ণ' : 'Goal!'}
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isBn ? 'লক্ষ্য: ৮ গ্লাস (২ লিটার) পানি প্রতিদিন' : 'Goal: 8 glasses (2,000 ml) daily'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleRemoveGlass}
            disabled={count <= 0}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 cursor-pointer transition-colors"
            title={isBn ? '১ গ্লাস কমান' : 'Decrease 1 glass'}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleAddGlass}
            disabled={count >= TOTAL_GLASSES}
            className="p-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white disabled:opacity-40 cursor-pointer transition-colors shadow-2xs"
            title={isBn ? '১ গ্লাস পানি পান' : 'Drink 1 glass'}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          {count > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 cursor-pointer transition-colors ml-0.5"
              title={isBn ? 'রিসেট' : 'Reset'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar & Status */}
      <div className="mb-3.5">
        <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
          <span className="text-slate-700 dark:text-slate-300">
            {count} / {TOTAL_GLASSES} {isBn ? 'গ্লাস' : 'glasses'} ({currentMl} ml)
          </span>
          <span className="text-sky-600 dark:text-sky-400 font-mono">
            {percentage}%
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-sky-400 to-cyan-500 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* 8 Interactive Water Glasses */}
      <div className="grid grid-cols-8 gap-1.5 sm:gap-2">
        {Array.from({ length: TOTAL_GLASSES }).map((_, index) => {
          const isFilled = index < count;
          return (
            <button
              key={index}
              type="button"
              onClick={() => {
                if (isFilled && index === count - 1) {
                  handleRemoveGlass();
                } else {
                  setCount(index + 1);
                  playWaterDropSound();
                  if (index + 1 === TOTAL_GLASSES) {
                    fireConfetti();
                  }
                }
              }}
              className={`group flex flex-col items-center justify-end p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer relative overflow-hidden h-14 sm:h-16 ${
                isFilled
                  ? 'border-sky-300 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-sky-300'
              }`}
              title={`${isBn ? 'গ্লাস' : 'Glass'} ${index + 1} (250 ml)`}
            >
              {/* Water filling visual */}
              {isFilled && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-sky-500 to-cyan-400 opacity-80 h-3/4 rounded-b-lg transition-all animate-in slide-in-from-bottom duration-200" />
              )}

              <Droplet
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110 z-10 ${
                  isFilled ? 'text-white' : 'text-slate-300 dark:text-slate-600'
                }`}
              />

              <span className={`text-[10px] font-mono font-bold mt-1 z-10 ${
                isFilled ? 'text-white drop-shadow-xs' : 'text-slate-400'
              }`}>
                {index + 1}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
