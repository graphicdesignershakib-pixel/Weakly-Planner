import React from 'react';
import { DayPlan, DayInfo, DayMood, DayPrayers } from '../types/planner';
import { DayCard } from './DayCard';
import { CalendarDays } from 'lucide-react';

interface DailyPlannerProps {
  daysInfo: DayInfo[];
  days: DayPlan[];
  activeDayIndex: number | null;
  onToggleTask: (dayIndex: number, taskId: string) => void;
  onAddTask: (dayIndex: number, title: string, time?: string) => void;
  onEditTask: (dayIndex: number, taskId: string, newTitle: string, newTime?: string) => void;
  onDeleteTask: (dayIndex: number, taskId: string) => void;
  onMoveTask: (dayIndex: number, fromIndex: number, direction: 'up' | 'down') => void;
  onTogglePriority: (dayIndex: number, taskId: string) => void;
  onUpdateNote: (dayIndex: number, note: string) => void;
  onUpdateMood?: (dayIndex: number, mood: DayMood) => void;
  onTogglePrayer?: (dayIndex: number, prayer: keyof DayPrayers) => void;
  onUpdateWater?: (dayIndex: number, glasses: number) => void;
  onUpdateWin?: (dayIndex: number, win: string) => void;
}

export const DailyPlanner: React.FC<DailyPlannerProps> = ({
  daysInfo,
  days,
  activeDayIndex,
  onToggleTask,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  onTogglePriority,
  onUpdateNote,
  onUpdateMood,
  onTogglePrayer,
  onUpdateWater,
  onUpdateWin,
}) => {
  return (
    <section aria-labelledby="daily-planner-heading">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-[#111111] dark:text-white" />
          <h2 id="daily-planner-heading" className="text-sm font-bold text-[#111111] dark:text-white uppercase tracking-wider">
            Daily Planner & Execution
          </h2>
          <span className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
            · 7 Days
          </span>
        </div>
        <span className="text-xs text-[#71717A] dark:text-[#A1A1AA] hidden sm:inline">
          Click task or checkbox to complete · Press Enter to add
        </span>
      </div>

      {/* Grid: 1 col on mobile, 2 cols on tablet, 3/4 cols on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {daysInfo.map((info) => {
          const dayPlan = days[info.dayIndex] || days.find((d) => d.date === info.dateStr);
          return (
            <DayCard
              key={info.dayIndex}
              dayInfo={info}
              dayPlan={dayPlan}
              isActive={activeDayIndex === info.dayIndex}
              onToggleTask={onToggleTask}
              onAddTask={onAddTask}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onMoveTask={onMoveTask}
              onTogglePriority={onTogglePriority}
              onUpdateNote={onUpdateNote}
              onUpdateMood={onUpdateMood}
              onTogglePrayer={onTogglePrayer}
              onUpdateWater={onUpdateWater}
              onUpdateWin={onUpdateWin}
            />
          );
        })}
      </div>
    </section>
  );
};
