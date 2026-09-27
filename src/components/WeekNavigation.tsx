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
      className="bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] rounded-xl p-2 overflow-x-auto custom-scrollbar shadow-xs transition-colors"
    >
      <div className="grid grid-cols-7 min-w-[500px] sm:min-w-0 gap-1.5 sm:gap-2">
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
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all text-center relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] dark:focus-visible:ring-white cursor-pointer ${
                isActive
                  ? 'bg-[#111111] text-white dark:bg-white dark:text-[#111111] shadow-xs'
                  : 'bg-[#F8F9FA] dark:bg-[#121214] text-[#111111] dark:text-zinc-200 hover:bg-[#F1F3F5] dark:hover:bg-[#202024] border border-transparent'
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
