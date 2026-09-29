import React, { useState, useRef } from 'react';
import { Habit, DayInfo, HabitCategory } from '../types/planner';
import { calculateHabitProgress, calculateOverallHabitProgress } from '../utils/calculations';
import {
  Flame,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  ChevronUp,
  ChevronDown,
  Activity,
  BookOpen,
  Sparkles,
  Briefcase,
  User,
  Heart,
  Layers,
} from 'lucide-react';

interface HabitTrackerProps {
  habits: Habit[];
  daysInfo: DayInfo[];
  onToggleHabitDay: (habitId: string, dayIndex: number) => void;
  onAddHabit: (name: string, category?: HabitCategory) => void;
  onRenameHabit: (habitId: string, newName: string, category?: HabitCategory) => void;
  onDeleteHabit: (habitId: string) => void;
  onMoveHabit: (fromIndex: number, direction: 'up' | 'down') => void;
  onMarkAllHabitsToday?: (dayIndex: number) => void;
}

export const CATEGORY_CONFIG: Record<
  HabitCategory,
  { label: string; icon: React.ComponentType<{ className?: string }>; bg: string; text: string; border: string }
> = {
  health: {
    label: 'Health & Exercise',
    icon: Activity,
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800/50',
  },
  pray: {
    label: 'Pray & Mindfulness',
    icon: Sparkles,
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800/50',
  },
  study: {
    label: 'Study & Learning',
    icon: BookOpen,
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    text: 'text-sky-700 dark:text-sky-300',
    border: 'border-sky-200 dark:border-sky-800/50',
  },
  work: {
    label: 'Work & Career',
    icon: Briefcase,
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800/50',
  },
  personal: {
    label: 'Personal & Life',
    icon: User,
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-700 dark:text-rose-300',
    border: 'border-rose-200 dark:border-rose-800/50',
  },
};

export const HabitTracker: React.FC<HabitTrackerProps> = ({
  habits,
  daysInfo,
  onToggleHabitDay,
  onAddHabit,
  onRenameHabit,
  onDeleteHabit,
  onMoveHabit,
  onMarkAllHabitsToday,
}) => {
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory>('health');
  const [filterCategory, setFilterCategory] = useState<'all' | HabitCategory>('all');
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingCategory, setEditingCategory] = useState<HabitCategory>('health');
  const inputRef = useRef<HTMLInputElement>(null);

  const todayIndex = daysInfo.findIndex((d) => d.isToday);
  const targetTodayIndex = todayIndex !== -1 ? todayIndex : 0;

  const overall = calculateOverallHabitProgress(habits);

  const filteredHabits = habits.filter((h) => {
    if (filterCategory === 'all') return true;
    return (h.category || 'health') === filterCategory;
  });

  const handleCreateHabit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newHabitName.trim();
    if (!trimmed) return;
    onAddHabit(trimmed, selectedCategory);
    setNewHabitName('');
    inputRef.current?.focus();
  };

  const startRename = (habit: Habit) => {
    setEditingHabitId(habit.id);
    setEditingName(habit.name);
    setEditingCategory(habit.category || 'health');
  };

  const saveRename = (habitId: string) => {
    const trimmed = editingName.trim();
    if (trimmed) {
      onRenameHabit(habitId, trimmed, editingCategory);
    }
    setEditingHabitId(null);
  };

  const cancelRename = () => {
    setEditingHabitId(null);
    setEditingName('');
  };

  // Calculate consistency breakdown by category
  const categoryStats = (['health', 'pray', 'study', 'work', 'personal'] as HabitCategory[]).map((cat) => {
    const catHabits = habits.filter((h) => (h.category || 'health') === cat);
    if (catHabits.length === 0) return { cat, count: 0, pct: 0 };
    const totalChecks = catHabits.length * 7;
    const completedChecks = catHabits.reduce(
      (acc, h) => acc + h.completed.filter(Boolean).length,
      0
    );
    const pct = Math.round((completedChecks / totalChecks) * 100);
    return { cat, count: catHabits.length, pct };
  });

  return (
    <section aria-labelledby="habit-tracker-heading" className="bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all luxury-card">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 text-white rounded-xl shadow-md shadow-orange-500/20">
            <Flame className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 id="habit-tracker-heading" className="text-base font-bold text-[#111111] dark:text-white tracking-tight">
                Categorized Habit Matrix
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FAFAFA] dark:bg-[#202024] border border-[#E5E7EB] dark:border-[#27272A] text-[#52525B] dark:text-[#A1A1AA] px-2 py-0.5 rounded-full">
                {habits.length} Habits
              </span>
            </div>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] mt-0.5">
              Health, Prayer, Study, Work & Personal discipline
            </p>
          </div>
        </div>

        {/* Actions & Habit Metric */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {onMarkAllHabitsToday && habits.length > 0 && (
            <button
              type="button"
              onClick={() => onMarkAllHabitsToday(targetTodayIndex)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs font-bold shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer font-sans"
              title={`Toggle completion of all habits for ${daysInfo[targetTodayIndex]?.dayName || 'Today'}`}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Toggle All Today ({daysInfo[targetTodayIndex]?.dayAbbr || 'Today'})</span>
            </button>
          )}

          <div className="flex items-center gap-3 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 px-3.5 py-1.5 rounded-xl shadow-inner">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Weekly Consistency:</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums font-mono">
              {overall.percentage}%
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              ({overall.completed}/{overall.total})
            </span>
          </div>
        </div>
      </div>

      {/* Category Pills & Quick Filter Bar */}
      <div className="flex flex-wrap items-center gap-1.5 pt-4 pb-3 border-b border-[#F4F4F5] dark:border-[#27272A]">
        <span className="text-xs font-semibold text-[#71717A] dark:text-[#A1A1AA] mr-1 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" /> Filter:
        </span>
        <button
          type="button"
          onClick={() => setFilterCategory('all')}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
            filterCategory === 'all'
              ? 'bg-[#111111] text-white dark:bg-white dark:text-[#111111] shadow-xs'
              : 'bg-[#F4F4F5] dark:bg-[#202024] text-[#52525B] dark:text-[#A1A1AA] hover:bg-[#E5E7EB] dark:hover:bg-[#27272A]'
          }`}
        >
          All ({habits.length})
        </button>

        {(['health', 'pray', 'study', 'work', 'personal'] as HabitCategory[]).map((cat) => {
          const cfg = CATEGORY_CONFIG[cat];
          const Icon = cfg.icon;
          const stat = categoryStats.find((s) => s.cat === cat);
          const isSelected = filterCategory === cat;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? `${cfg.bg} ${cfg.text} border ${cfg.border} ring-1 ring-current`
                  : 'bg-[#FAFAFA] dark:bg-[#121214] hover:bg-[#F4F4F5] dark:hover:bg-[#202024] text-[#52525B] dark:text-[#A1A1AA] border border-transparent'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{cfg.label.split(' ')[0]}</span>
              {stat && stat.count > 0 && (
                <span className="text-[10px] font-mono opacity-80">({stat.pct}%)</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Spreadsheet Matrix Table */}
      <div className="overflow-x-auto mt-3">
        <table className="w-full text-left border-collapse min-w-[620px]">
          <thead>
            <tr className="border-b border-[#E5E7EB] dark:border-[#27272A] text-[#71717A] dark:text-[#A1A1AA] text-xs uppercase tracking-wider">
              <th scope="col" className="py-2.5 px-3 font-bold w-1/3">
                Habit & Category
              </th>
              {daysInfo.map((info) => (
                <th
                  key={info.dayIndex}
                  scope="col"
                  className={`py-2.5 px-1.5 text-center font-bold w-[46px] ${
                    info.isToday ? 'text-[#111111] dark:text-white bg-amber-50/70 dark:bg-amber-950/30 rounded-t' : ''
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-extrabold">{info.singleLetter}</span>
                    <span className="text-[10px] font-normal text-[#A1A1AA] dark:text-[#71717A]">
                      {info.formattedDate.split(' ')[0]}
                    </span>
                  </div>
                </th>
              ))}
              <th scope="col" className="py-2.5 px-3 text-center font-bold w-24">
                Score
              </th>
              <th scope="col" className="py-2.5 px-2 text-right font-bold w-20">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#F4F4F5] dark:divide-[#27272A] text-xs">
            {filteredHabits.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-xs text-[#A1A1AA] dark:text-[#71717A]">
                  No habits in this category yet. Use the form below to create one.
                </td>
              </tr>
            ) : (
              filteredHabits.map((habit, index) => {
                const isEditing = editingHabitId === habit.id;
                const progress = calculateHabitProgress(habit.completed);
                const isPerfect = habit.completed.every(Boolean);
                const category = habit.category || 'health';
                const catConfig = CATEGORY_CONFIG[category];
                const CatIcon = catConfig.icon;

                return (
                  <tr
                    key={habit.id}
                    className="hover:bg-[#F8F9FA]/80 dark:hover:bg-[#202024]/60 transition-colors group"
                  >
                    {/* Habit Name & Category */}
                    <td className="py-2.5 px-3">
                      {isEditing ? (
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="text-xs bg-white dark:bg-[#18181B] border border-[#111111] dark:border-white rounded px-2 py-1 text-[#111111] dark:text-white focus:outline-none flex-1"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveRename(habit.id);
                                if (e.key === 'Escape') cancelRename();
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => saveRename(habit.id)}
                              className="p-1 text-[#111111] dark:text-white hover:bg-[#E5E7EB] dark:hover:bg-[#27272A] rounded cursor-pointer"
                              title="Save"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={cancelRename}
                              className="p-1 text-[#71717A] hover:bg-[#E5E7EB] dark:hover:bg-[#27272A] rounded cursor-pointer"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <select
                            value={editingCategory}
                            onChange={(e) => setEditingCategory(e.target.value as HabitCategory)}
                            className="text-[11px] border border-[#D4D4D8] dark:border-[#27272A] rounded px-1.5 py-0.5 bg-white dark:bg-[#18181B] text-[#111111] dark:text-white"
                          >
                            <option value="health">🏃 Health & Exercise</option>
                            <option value="pray">🤲 Pray & Mindfulness</option>
                            <option value="study">📖 Study & Learning</option>
                            <option value="work">💼 Work & Career</option>
                            <option value="personal">🌿 Personal & Life</option>
                          </select>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span
                            className={`p-1 rounded ${catConfig.bg} ${catConfig.text} border ${catConfig.border} shrink-0`}
                            title={catConfig.label}
                          >
                            <CatIcon className="w-3 h-3" />
                          </span>
                          <span
                            onDoubleClick={() => startRename(habit)}
                            className="font-medium text-[#111111] dark:text-zinc-100 select-text cursor-pointer hover:underline underline-offset-2 flex-1 truncate"
                            title="Double-click to rename"
                          >
                            {habit.name}
                          </span>
                          {isPerfect && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/50 px-1 py-0.2 rounded border border-amber-300 dark:border-amber-800/60">
                              7/7 Streak
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* 7 Checkbox Days */}
                    {daysInfo.map((info) => {
                      const isChecked = habit.completed[info.dayIndex];
                      return (
                        <td
                          key={info.dayIndex}
                          className={`py-2 px-1 text-center ${
                            info.isToday ? 'bg-amber-50/40 dark:bg-amber-950/20' : ''
                          }`}
                        >
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={isChecked}
                            onClick={() => onToggleHabitDay(habit.id, info.dayIndex)}
                            className={`w-5 h-5 mx-auto rounded border flex items-center justify-center transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] dark:focus-visible:ring-white ${
                              isChecked
                                ? 'bg-[#111111] dark:bg-white border-[#111111] dark:border-white text-white dark:text-[#111111] shadow-xs'
                                : 'bg-white dark:bg-[#18181B] border-[#D4D4D8] dark:border-[#3F3F46] hover:border-[#71717A] text-transparent'
                            }`}
                            title={`${habit.name} - ${info.dayName}: ${
                              isChecked ? 'Completed' : 'Click to complete'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>
                        </td>
                      );
                    })}

                    {/* Score / Progress Bar */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="w-12 bg-[#F4F4F5] dark:bg-[#27272A] h-1.5 rounded-full overflow-hidden shrink-0">
                          <div
                            className={`h-full transition-all duration-300 ${
                              progress === 100
                                ? 'bg-emerald-600'
                                : progress >= 70
                                ? 'bg-[#111111] dark:bg-white'
                                : 'bg-[#A1A1AA]'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-semibold tabular-nums text-[#111111] dark:text-white w-8 text-right">
                          {progress}%
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-2 text-right">
                      {!isEditing && (
                        <div className="flex items-center justify-end gap-0.5 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => onMoveHabit(index, 'up')}
                              className="p-1 text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white hover:bg-[#E5E7EB] dark:hover:bg-[#27272A] rounded cursor-pointer"
                              title="Move up"
                              aria-label="Move habit up"
                            >
                              <ChevronUp className="w-3 h-3" />
                            </button>
                          )}
                          {index < filteredHabits.length - 1 && (
                            <button
                              type="button"
                              onClick={() => onMoveHabit(index, 'down')}
                              className="p-1 text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white hover:bg-[#E5E7EB] dark:hover:bg-[#27272A] rounded cursor-pointer"
                              title="Move down"
                              aria-label="Move habit down"
                            >
                              <ChevronDown className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => startRename(habit)}
                            className="p-1 text-[#71717A] hover:text-[#111111] dark:hover:text-white hover:bg-[#E5E7EB] dark:hover:bg-[#27272A] rounded cursor-pointer"
                            title="Edit habit"
                            aria-label="Edit habit"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteHabit(habit.id)}
                            className="p-1 text-[#71717A] hover:text-[#DC2626] hover:bg-[#FEE2E2] dark:hover:bg-red-950/40 rounded cursor-pointer"
                            title="Delete habit"
                            aria-label="Delete habit"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add New Habit Form */}
      <form onSubmit={handleCreateHabit} className="mt-4 pt-3.5 border-t border-[#F4F4F5] dark:border-[#27272A]">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Category Select */}
          <div className="sm:w-48 shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as HabitCategory)}
              className="w-full text-xs font-semibold text-[#111111] dark:text-white bg-[#F8F9FA] dark:bg-[#121214] border border-[#E5E7EB] dark:border-[#27272A] rounded-lg px-2.5 py-2 focus:outline-none focus:border-[#111111] dark:focus:border-white cursor-pointer"
            >
              <option value="health">🏃 Health & Exercise</option>
              <option value="pray">🤲 Pray & Mindfulness</option>
              <option value="study">📖 Study & Learning</option>
              <option value="work">💼 Work & Career</option>
              <option value="personal">🌿 Personal & Life</option>
            </select>
          </div>

          {/* Habit Name Input */}
          <div className="flex-1 flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="e.g. 5 Daily Prayers, 10k Steps, Read 20 pages..."
              className="w-full text-xs text-[#111111] dark:text-white bg-[#F8F9FA] dark:bg-[#121214] hover:bg-white dark:hover:bg-[#18181B] focus:bg-white dark:focus:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] focus:border-[#111111] dark:focus:border-white rounded-lg px-3 py-2 transition-colors focus:outline-none placeholder:text-[#A1A1AA]"
            />
            <button
              type="submit"
              disabled={!newHabitName.trim()}
              className="inline-flex items-center gap-1 px-3 py-2 bg-[#111111] dark:bg-white text-white dark:text-[#111111] disabled:bg-[#E5E7EB] dark:disabled:bg-[#27272A] disabled:text-[#A1A1AA] hover:bg-[#27272A] dark:hover:bg-zinc-200 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Habit</span>
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};
