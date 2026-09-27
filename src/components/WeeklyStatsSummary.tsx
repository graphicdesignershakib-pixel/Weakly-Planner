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
    <div className="bg-white border border-[#E5E7EB] rounded-lg p-4 sm:p-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Metric Cards (5 cols on large desktop) */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3">
          {/* Task Completion Percentage */}
          <div className="bg-[#F8F9FA] border border-[#E5E7EB] p-3.5 rounded-lg">
            <div className="flex items-center justify-between text-[#71717A] mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Tasks Done
              </span>
              <CheckSquare className="w-3.5 h-3.5 text-[#111111]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#111111] tabular-nums tracking-tight">
                {taskProgress.percentage}%
              </span>
              <span className="text-xs text-[#71717A] tabular-nums font-mono">
                {taskProgress.completed}/{taskProgress.total}
              </span>
            </div>
            {/* Visual thin progress track */}
            <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#111111] h-full transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, taskProgress.percentage))}%` }}
              />
            </div>
          </div>

          {/* Habit Consistency Percentage */}
          <div className="bg-[#F8F9FA] border border-[#E5E7EB] p-3.5 rounded-lg">
            <div className="flex items-center justify-between text-[#71717A] mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Habit Consistency
              </span>
              <Flame className="w-3.5 h-3.5 text-[#111111]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#111111] tabular-nums tracking-tight">
                {habitProgress.percentage}%
              </span>
              <span className="text-xs text-[#71717A] tabular-nums font-mono">
                {habitProgress.completed}/{habitProgress.total}
              </span>
            </div>
            <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#111111] h-full transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(100, Math.max(0, habitProgress.percentage))}%` }}
              />
            </div>
          </div>

          {/* Week Overview Stat 3 */}
          <div className="bg-[#F8F9FA] border border-[#E5E7EB] p-3.5 rounded-lg">
            <div className="flex items-center justify-between text-[#71717A] mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Active Habits
              </span>
              <TrendingUp className="w-3.5 h-3.5 text-[#111111]" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-[#111111] tabular-nums">
                {habits.length}
              </span>
              <span className="text-xs text-[#71717A]">habits tracked</span>
            </div>
            <p className="text-[10px] text-[#A1A1AA] mt-1 truncate">
              Daily repetition metric
            </p>
          </div>

          {/* Week Overview Stat 4 */}
          <div className="bg-[#F8F9FA] border border-[#E5E7EB] p-3.5 rounded-lg">
            <div className="flex items-center justify-between text-[#71717A] mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Total Planned
              </span>
              <BarChart3 className="w-3.5 h-3.5 text-[#111111]" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-[#111111] tabular-nums">
                {taskProgress.total}
              </span>
              <span className="text-xs text-[#71717A]">items this week</span>
            </div>
            <p className="text-[10px] text-[#A1A1AA] mt-1 truncate">
              Across 7 calendar days
            </p>
          </div>
        </div>

        {/* 7-Day Completion Bar Chart (7 cols on desktop) */}
        <div className="lg:col-span-7 bg-[#FAFAFA] border border-[#E5E7EB] p-4 rounded-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                7-Day Task Completion
              </span>
              <span className="text-[11px] text-[#71717A]">
                · Click day to jump
              </span>
            </div>
            <div className="text-[11px] font-mono text-[#71717A] tabular-nums">
              Avg: {Math.round(dailyStats.reduce((acc, d) => acc + d.progress, 0) / 7)}%
            </div>
          </div>

          {/* Chart Canvas */}
          <div className="relative pt-4 pb-1">
            {/* Guide lines (100%, 50%, 0%) */}
            <div className="absolute inset-x-0 top-4 bottom-8 flex flex-col justify-between pointer-events-none opacity-40">
              <div className="border-b border-dashed border-[#D4D4D8] w-full text-[9px] font-mono text-[#71717A] pr-1 text-right">
                100%
              </div>
              <div className="border-b border-dashed border-[#D4D4D8] w-full text-[9px] font-mono text-[#71717A] pr-1 text-right">
                50%
              </div>
              <div className="border-b border-[#D4D4D8] w-full text-[9px] font-mono text-[#71717A] pr-1 text-right">
                0%
              </div>
            </div>

            {/* 7 Vertical Bars */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 h-36 items-end relative z-10 px-1">
              {dailyStats.map((item) => (
                <button
                  key={item.dayIndex}
                  onClick={() => onSelectDay(item.dayIndex)}
                  type="button"
                  aria-label={`${item.dayAbbr}: ${item.progress}% completed (${item.completedTasks}/${item.totalTasks} tasks)`}
                  className={`group flex flex-col items-center h-full justify-end rounded p-1 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] ${
                    item.isActive
                      ? 'bg-white shadow-xs border border-[#111111]'
                      : 'hover:bg-white border border-transparent'
                  }`}
                >
                  {/* Top percentage pill / text */}
                  <span
                    className={`text-[10px] font-bold tabular-nums font-mono mb-1 transition-colors ${
                      item.progress > 0 ? 'text-[#111111]' : 'text-[#A1A1AA]'
                    } ${item.isActive ? 'text-[#111111] font-extrabold' : ''}`}
                  >
                    {item.progress}%
                  </span>

                  {/* Bar pillar */}
                  <div className="w-full max-w-[28px] bg-[#E5E7EB] rounded-t-sm h-20 flex items-end overflow-hidden p-0.5">
                    <div
                      className={`w-full rounded-t-xs transition-all duration-300 ${
                        item.progress === 100
                          ? 'bg-[#111111]'
                          : item.progress > 0
                          ? 'bg-[#333333] group-hover:bg-[#111111]'
                          : 'bg-transparent'
                      }`}
                      style={{ height: `${Math.max(item.progress > 0 ? 8 : 0, item.progress)}%` }}
                    />
                  </div>

                  {/* Day Abbreviation */}
                  <div className="mt-2 text-center">
                    <span
                      className={`text-xs font-bold block ${
                        item.isActive
                          ? 'text-[#111111] underline underline-offset-4 decoration-2'
                          : item.isToday
                          ? 'text-[#111111]'
                          : 'text-[#52525B]'
                      }`}
                    >
                      {item.dayAbbr}
                    </span>
                    <span className="text-[9px] text-[#71717A] tabular-nums block font-mono">
                      {item.completedTasks}/{item.totalTasks}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
