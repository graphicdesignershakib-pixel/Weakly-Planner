import React from 'react';
import { CheckSquare, Flame, TrendingUp, BarChart3 } from 'lucide-react';
import { DayPlan, Habit } from '../types/planner';
import {
  calculateWeeklyProgress,
  calculateOverallHabitProgress,
  calculateDailyProgress,
} from '../utils/calculations';
import { getWeekDaysInfo } from '../utils/dateUtils';

interface WeeklyStatsSummaryProps {
  weekStart: string;
  days: DayPlan[];
  habits: Habit[];
  activeDayIndex: number | null;
  onSelectDay: (index: number) => void;
}

export const WeeklyStatsSummary: React.FC<WeeklyStatsSummaryProps> = ({
  weekStart,
  days,
  habits,
  activeDayIndex,
  onSelectDay,
}) => {
  const taskProgress = calculateWeeklyProgress(days);
  const habitProgress = calculateOverallHabitProgress(habits);
  const daysInfo = getWeekDaysInfo(weekStart);

  // Compute stats for 7-day bar chart
  const dailyStats = daysInfo.map((info, idx) => {
    const dayPlan = days[idx] || days.find((d) => d.date === info.dateStr);
    const progress = calculateDailyProgress(dayPlan);
    const completedTasks = dayPlan?.tasks.filter((t) => t.completed).length || 0;
    const totalTasks = dayPlan?.tasks.length || 0;

    return {
      dayIndex: idx,
      dayAbbr: info.dayAbbr,
      formattedDate: info.formattedDate,
      progress,
      completedTasks,
      totalTasks,
      isToday: info.isToday,
      isActive: activeDayIndex === idx,
    };
  });

  return (
    <div className="bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 transition-all shadow-sm hover:shadow-md luxury-card">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Metric Cards (5 cols on large desktop) */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3">
          {/* Task Completion Percentage */}
          <div className="bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 p-4 rounded-xl transition-all shadow-inner">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider font-mono">
                Tasks Done
              </span>
              <CheckSquare className="w-3.5 h-3.5 text-indigo-500" />
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
                {taskProgress.percentage}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {taskProgress.completed}/{taskProgress.total}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-2.5">
              <div
                className="bg-indigo-600 dark:bg-indigo-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${taskProgress.percentage}%` }}
              />
            </div>
          </div>

          {/* Habit Consistency Percentage */}
          <div className="bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 p-4 rounded-xl transition-all shadow-inner">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider font-mono">
                Habit Streak
              </span>
              <Flame className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
                {habitProgress.percentage}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {habitProgress.completed}/{habitProgress.total}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-2.5">
              <div
                className="bg-gradient-to-r from-amber-500 to-orange-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${habitProgress.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* 7-Day Completion Bar Chart (7 cols on large desktop) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-[#71717A] dark:text-[#A1A1AA]" />
              <span className="text-xs font-bold text-[#111111] dark:text-white uppercase tracking-wider">
                7-Day Task Completion
              </span>
            </div>
            <span className="text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
              Click a day bar to scroll to that day
            </span>
          </div>

          {/* Bar Chart Container */}
          <div className="grid grid-cols-7 gap-2 items-end h-28 pt-2 pb-1 border-b border-[#F4F4F5] dark:border-[#27272A]">
            {dailyStats.map((item) => {
              const heightPct = Math.max(10, item.progress);

              return (
                <button
                  key={item.dayIndex}
                  type="button"
                  onClick={() => onSelectDay(item.dayIndex)}
                  className={`flex flex-col items-center justify-end h-full group focus:outline-none rounded transition-all cursor-pointer ${
                    item.isActive
                      ? 'bg-[#F4F4F5] dark:bg-[#27272A] p-1'
                      : 'hover:bg-[#F8F9FA] dark:hover:bg-[#202024] p-1'
                  }`}
                  title={`${item.dayAbbr}: ${item.progress}% (${item.completedTasks}/${item.totalTasks} tasks)`}
                >
                  {/* Percentage on hover or active */}
                  <span
                    className={`text-[10px] font-mono font-semibold mb-1 transition-opacity ${
                      item.isActive
                        ? 'opacity-100 text-[#111111] dark:text-white font-bold'
                        : 'opacity-70 group-hover:opacity-100 text-[#71717A] dark:text-[#A1A1AA]'
                    }`}
                  >
                    {item.progress}%
                  </span>

                  {/* Vertical Bar */}
                  <div className="w-full bg-[#E5E7EB] dark:bg-[#27272A] rounded-t-sm h-16 flex items-end overflow-hidden">
                    <div
                      className={`w-full transition-all duration-300 rounded-t-sm ${
                        item.progress === 100
                          ? 'bg-emerald-500'
                          : item.isActive
                          ? 'bg-[#111111] dark:bg-white'
                          : 'bg-[#71717A] dark:bg-[#A1A1AA] group-hover:bg-[#111111] dark:group-hover:bg-white'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Day Labels below chart */}
          <div className="grid grid-cols-7 gap-2 mt-1 text-center">
            {dailyStats.map((item) => (
              <span
                key={item.dayIndex}
                className={`text-[11px] font-semibold tracking-tight ${
                  item.isToday
                    ? 'text-[#111111] dark:text-white font-extrabold underline underline-offset-2'
                    : item.isActive
                    ? 'text-[#111111] dark:text-white font-bold'
                    : 'text-[#71717A] dark:text-[#A1A1AA]'
                }`}
              >
                {item.dayAbbr}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
