import React from 'react';
import { getWeekDaysInfo } from '../utils/dateUtils';
import { calculateDailyProgress } from '../utils/calculations';
import { DayPlan } from '../types/planner';

interface WeekNavigationProps {
  weekStart: string;
  days: DayPlan[];
  activeDayIndex: number | null;
  onSelectDay: (index: number) => void;
}

export const WeekNavigation: React.FC<WeekNavigationProps> = ({
  weekStart,
  days,
  activeDayIndex,
  onSelectDay,
}) => {
  const daysInfo = getWeekDaysInfo(weekStart);

  return (
    <nav
      aria-label="Week day navigation"
      className="bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-2.5 overflow-x-auto custom-scrollbar shadow-sm transition-all luxury-card"
    >
      <div className="grid grid-cols-7 min-w-[500px] sm:min-w-0 gap-2">
        {daysInfo.map((info) => {
          const dayPlan = days[info.dayIndex] || days.find((d) => d.date === info.dateStr);
          const progress = calculateDailyProgress(dayPlan);
          const completedTasks = dayPlan?.tasks.filter((t) => t.completed).length || 0;
          const totalTasks = dayPlan?.tasks.length || 0;
          const isActive = activeDayIndex === info.dayIndex;

          return (
            <button
              key={info.dayIndex}
              onClick={() => onSelectDay(info.dayIndex)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl transition-all duration-200 text-center relative focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md ring-1 ring-slate-900/10 scale-[1.02]'
                  : 'bg-slate-50/80 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60'
              }`}
            >
              {/* Day abbreviation */}
              <span
                className={`text-xs font-semibold ${
                  isActive
                    ? 'text-[#D4D4D8] dark:text-[#52525B]'
                    : 'text-[#71717A] dark:text-[#A1A1AA]'
                }`}
              >
                {info.dayAbbr}
              </span>

              {/* Day Date number */}
              <span className="text-base sm:text-lg font-bold tabular-nums">
                {info.dateStr.split('-')[2]}
              </span>

              {/* Tasks or Progress Pill */}
              <div className="flex items-center gap-1 mt-0.5">
                <span
                  className={`text-[10px] font-mono tabular-nums ${
                    isActive
                      ? 'text-[#D4D4D8] dark:text-[#52525B]'
                      : progress === 100
                      ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                      : 'text-[#71717A] dark:text-[#A1A1AA]'
                  }`}
                >
                  {totalTasks > 0 ? `${completedTasks}/${totalTasks}` : '0'}
                </span>
                {progress === 100 && totalTasks > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </div>

              {/* Indicator dot for today */}
              {info.isToday && (
                <span
                  className={`absolute top-1 right-1.5 text-[9px] ${
                    isActive ? 'text-amber-400 dark:text-amber-600' : 'text-amber-500'
                  }`}
                  title="Today"
                >
                  ●
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
