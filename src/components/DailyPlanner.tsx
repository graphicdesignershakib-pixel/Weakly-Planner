import React from 'react';
import { DayPlan, DayInfo } from '../types/planner';
import { DayCard } from './DayCard';
import { CalendarDays } from 'lucide-react';

interface DailyPlannerProps {
  daysInfo: DayInfo[];
  days: DayPlan[];
  activeDayIndex: number | null;
  onToggleTask: (dayIndex: number, taskId: string) => void;
  onAddTask: (dayIndex: number, title: string) => void;
  onEditTask: (dayIndex: number, taskId: string, newTitle: string) => void;
  onDeleteTask: (dayIndex: number, taskId: string) => void;
  onMoveTask: (dayIndex: number, fromIndex: number, direction: 'up' | 'down') => void;
  onTogglePriority: (dayIndex: number, taskId: string) => void;
  onUpdateNote: (dayIndex: number, note: string) => void;
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
}) => {
  return (
    <section aria-labelledby="daily-planner-heading">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-[#111111]" />
          <h2 id="daily-planner-heading" className="text-sm font-bold text-[#111111] uppercase tracking-wider">
            Daily Planner
          </h2>
          <span className="text-xs text-[#71717A]">
            · 7 Days
          </span>
        </div>
        <span className="text-xs text-[#71717A] hidden sm:inline">
          Click task or checkbox to complete · Press Enter to add
        </span>
      </div>

      {/* Grid: 1 col on mobile, 2 cols on tablet, 3/4 cols on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {daysInfo.map((info) => {
          // Align by dayIndex first, then date fallback
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
            />
          );
        })}
      </div>
    </section>
  );
};
