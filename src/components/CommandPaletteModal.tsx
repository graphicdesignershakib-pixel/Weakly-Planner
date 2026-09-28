import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Calendar,
  Flame,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
  X,
  Target,
} from 'lucide-react';
import { PlannerState, DayInfo } from '../types/planner';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: PlannerState;
  daysInfo: DayInfo[];
  onSelectDay: (dayIndex: number) => void;
  onQuickAddTask: (dayIndex: number, title: string) => void;
  onOpenBreathing: () => void;
  onOpenAchievement: () => void;
  onOpenProfile: () => void;
  onOpenRituals?: () => void;
  onOpenLetters?: () => void;
  onOpenWrapped?: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  state,
  daysInfo,
  onSelectDay,
  onQuickAddTask,
  onOpenBreathing,
  onOpenAchievement,
  onOpenProfile,
  onOpenRituals,
  onOpenLetters,
  onOpenWrapped,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  // Search tasks across 7 days
  const matchingTasks: { dayIndex: number; dayName: string; title: string; completed: boolean }[] = [];
  state.days.forEach((day, idx) => {
    const info = daysInfo[idx];
    day.tasks.forEach((t) => {
      if (!trimmed || t.title.toLowerCase().includes(trimmed)) {
        matchingTasks.push({
          dayIndex: idx,
          dayName: info?.dayName || 'Day',
          title: t.title,
          completed: t.completed,
        });
      }
    });
  });

  // Search habits
  const matchingHabits = state.habits.filter((h) =>
    !trimmed || h.name.toLowerCase().includes(trimmed)
  );

  const todayIndex = daysInfo.findIndex((d) => d.isToday);
  const targetDay = todayIndex !== -1 ? todayIndex : 0;

  const handleCreateNewTask = () => {
    if (!trimmed) return;
    onQuickAddTask(targetDay, query.trim());
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-black/60 backdrop-blur-xs"
    >
      <div className="bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#E5E7EB] dark:border-[#27272A]">
          <Search className="w-5 h-5 text-[#71717A] dark:text-[#A1A1AA] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, habits, or type to add to Today... (e.g. 'Gym workout')"
            className="w-full text-sm font-semibold text-[#111111] dark:text-white bg-transparent border-none outline-none placeholder:text-[#A1A1AA]"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim() && matchingTasks.length === 0) {
                handleCreateNewTask();
              }
            }}
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#71717A] hover:text-[#111111] dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="text-[10px] font-mono uppercase bg-[#F4F4F5] dark:bg-[#27272A] text-[#71717A] dark:text-[#A1A1AA] px-1.5 py-0.5 rounded border border-[#E5E7EB] dark:border-[#3F3F46]">
              ESC
            </kbd>
          )}
        </div>

        {/* Results Container */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-3">
          {/* Quick Add action if query exists */}
          {query.trim() && (
            <button
              type="button"
              onClick={handleCreateNewTask}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-900 dark:text-amber-200 border border-amber-200/60 dark:border-amber-800/40 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-bold">
                  Add "<span className="underline">{query}</span>" as new task to {daysInfo[targetDay]?.dayName || 'Today'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-amber-700 dark:text-amber-300">
                Press Enter ↵
              </span>
            </button>
          )}

          {/* Quick Actions Shortcuts */}
          {!query && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA] px-2 block">
                Quick Shortcuts & Mindfulness
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenBreathing();
                  }}
                  className="p-2 rounded-xl bg-[#FAFAFA] dark:bg-[#121214] hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] text-left border border-[#E5E7EB] dark:border-[#27272A] cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                  <span className="text-xs font-semibold text-[#111111] dark:text-white">
                    1-Min Box Breathing
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAchievement();
                  }}
                  className="p-2 rounded-xl bg-[#FAFAFA] dark:bg-[#121214] hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] text-left border border-[#E5E7EB] dark:border-[#27272A] cursor-pointer flex items-center gap-2"
                >
                  <Target className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs font-semibold text-[#111111] dark:text-white">
                    Achievement Card
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenProfile();
                  }}
                  className="p-2 rounded-xl bg-[#FAFAFA] dark:bg-[#121214] hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] text-left border border-[#E5E7EB] dark:border-[#27272A] cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                  <span className="text-xs font-semibold text-[#111111] dark:text-white">
                    Edit Your Profile
                  </span>
                </button>
                {onOpenRituals && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenRituals();
                    }}
                    className="p-2 rounded-xl bg-[#FAFAFA] dark:bg-[#121214] hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] text-left border border-[#E5E7EB] dark:border-[#27272A] cursor-pointer flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-semibold text-[#111111] dark:text-white">
                      Daily Rituals
                    </span>
                  </button>
                )}
                {onOpenLetters && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenLetters();
                    }}
                    className="p-2 rounded-xl bg-[#FAFAFA] dark:bg-[#121214] hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] text-left border border-[#E5E7EB] dark:border-[#27272A] cursor-pointer flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="text-xs font-semibold text-[#111111] dark:text-white">
                      Letters to Future Self
                    </span>
                  </button>
                )}
                {onOpenWrapped && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenWrapped();
                    }}
                    className="p-2 rounded-xl bg-[#FAFAFA] dark:bg-[#121214] hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] text-left border border-[#E5E7EB] dark:border-[#27272A] cursor-pointer flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                    <span className="text-xs font-semibold text-[#111111] dark:text-white">
                      Weekly Wrapped Story
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Jump to Day */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA] px-2 block">
              Jump to Day
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1">
              {daysInfo.map((d) => (
                <button
                  key={d.dayIndex}
                  type="button"
                  onClick={() => {
                    onSelectDay(d.dayIndex);
                    onClose();
                  }}
                  className="p-1.5 rounded-lg border border-[#E5E7EB] dark:border-[#27272A] hover:border-[#111111] dark:hover:border-white text-center cursor-pointer hover:bg-[#F8F9FA] dark:hover:bg-[#202024]"
                >
                  <span className="text-[11px] font-bold block text-[#111111] dark:text-white">{d.dayAbbr}</span>
                  <span className="text-[9px] text-[#71717A] dark:text-[#A1A1AA]">{d.formattedDate}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tasks matches */}
          {matchingTasks.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA] px-2 block">
                Tasks ({matchingTasks.length})
              </span>
              {matchingTasks.slice(0, 8).map((task, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    onSelectDay(task.dayIndex);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#F4F4F5] dark:hover:bg-[#202024] text-left cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        task.completed ? 'text-emerald-500' : 'text-[#A1A1AA]'
                      }`}
                    />
                    <span
                      className={`text-xs ${
                        task.completed
                          ? 'line-through text-[#71717A]'
                          : 'font-semibold text-[#111111] dark:text-white'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#71717A] dark:text-[#A1A1AA] bg-[#F8F9FA] dark:bg-[#121214] px-1.5 py-0.5 rounded border border-[#E5E7EB] dark:border-[#27272A]">
                    {task.dayName}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Habits matches */}
          {matchingHabits.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA] px-2 block">
                Habits ({matchingHabits.length})
              </span>
              {matchingHabits.slice(0, 5).map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#FAFAFA] dark:bg-[#121214] border border-[#E5E7EB] dark:border-[#27272A]"
                >
                  <div className="flex items-center gap-2">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-semibold text-[#111111] dark:text-white">
                      {h.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#71717A] dark:text-[#A1A1AA]">
                    {h.completed.filter(Boolean).length}/7 days done
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer tip */}
        <div className="px-4 py-2 bg-[#FAFAFA] dark:bg-[#121214] border-t border-[#E5E7EB] dark:border-[#27272A] flex justify-between items-center text-[11px] text-[#71717A] dark:text-[#A1A1AA]">
          <span>Navigation: Select day to view · Esc to close</span>
          <span className="font-mono">⌘K / Ctrl+K</span>
        </div>
      </div>
    </div>
  );
};
