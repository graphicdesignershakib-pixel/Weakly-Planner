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
      className="bg-white border border-[#E5E7EB] rounded-lg p-2 overflow-x-auto custom-scrollbar"
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
              className={`flex flex-col items-center justify-center p-2 rounded-md transition-all text-center relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] ${
                isActive
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'bg-[#F8F9FA] text-[#111111] hover:bg-[#F1F3F5] border border-transparent'
              }`}
            >
              {/* Day abbreviation */}
              <span
                className={`text-xs font-semibold ${
                  isActive ? 'text-[#D4D4D8]' : 'text-[#71717A]'
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
                    isActive ? 'text-[#E4E4E7]' : 'text-[#52525B]'
                  }`}
                >
                  {completedTasks}/{totalTasks}
                </span>
                {totalTasks > 0 && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      progress === 100
                        ? isActive
                          ? 'bg-emerald-400'
                          : 'bg-emerald-600'
                        : isActive
                        ? 'bg-neutral-400'
                        : 'bg-neutral-400'
                    }`}
                  />
                )}
              </div>

              {/* Indicator if Today */}
              {info.isToday && (
                <span
                  className={`text-[9px] uppercase tracking-wider font-extrabold mt-0.5 ${
                    isActive ? 'text-amber-300' : 'text-amber-700'
                  }`}
                >
                  Today
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
