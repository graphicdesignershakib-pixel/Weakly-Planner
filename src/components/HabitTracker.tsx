import React, { useState, useRef } from 'react';
import { Habit, DayInfo } from '../types/planner';
import { calculateHabitProgress, calculateOverallHabitProgress } from '../utils/calculations';
import { Flame, Plus, Trash2, Edit3, Check, X, CheckCheck, ChevronUp, ChevronDown } from 'lucide-react';

interface HabitTrackerProps {
  habits: Habit[];
  daysInfo: DayInfo[];
  onToggleHabitDay: (habitId: string, dayIndex: number) => void;
  onAddHabit: (name: string) => void;
  onRenameHabit: (habitId: string, newName: string) => void;
  onDeleteHabit: (habitId: string) => void;
  onMoveHabit: (fromIndex: number, direction: 'up' | 'down') => void;
}

export const HabitTracker: React.FC<HabitTrackerProps> = ({
  habits,
  daysInfo,
  onToggleHabitDay,
  onAddHabit,
  onRenameHabit,
  onDeleteHabit,
  onMoveHabit,
}) => {
  const [newHabitName, setNewHabitName] = useState('');
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const overall = calculateOverallHabitProgress(habits);

  const handleCreateHabit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newHabitName.trim();
    if (!trimmed) return;
    onAddHabit(trimmed);
    setNewHabitName('');
    inputRef.current?.focus();
  };

  const startRename = (habit: Habit) => {
    setEditingHabitId(habit.id);
    setEditingName(habit.name);
  };

  const saveRename = (habitId: string) => {
    const trimmed = editingName.trim();
    if (trimmed) {
      onRenameHabit(habitId, trimmed);
    }
    setEditingHabitId(null);
  };

  const cancelRename = () => {
    setEditingHabitId(null);
    setEditingName('');
  };

  return (
    <section aria-labelledby="habit-tracker-heading" className="bg-white border border-[#E5E7EB] rounded-lg p-4 sm:p-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F4F4F5]">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-[#F4F4F5] rounded text-[#111111]">
            <Flame className="w-4 h-4" />
          </span>
          <div>
            <h2 id="habit-tracker-heading" className="text-sm font-bold text-[#111111] uppercase tracking-wider">
              Habit Tracker
            </h2>
            <p className="text-xs text-[#71717A]">
              7-Day consistency matrix · Build unstoppable momentum
            </p>
          </div>
        </div>

        {/* Overall Habit Metric */}
        <div className="flex items-center gap-3 bg-[#F8F9FA] border border-[#E5E7EB] px-3 py-1.5 rounded-md self-start sm:self-auto">
          <span className="text-xs font-semibold text-[#52525B]">Weekly Consistency:</span>
          <span className="text-sm font-bold text-[#111111] tabular-nums font-mono">
            {overall.percentage}%
          </span>
          <span className="text-[11px] text-[#71717A] tabular-nums font-mono">
            ({overall.completed}/{overall.total})
          </span>
        </div>
      </div>

      {/* Spreadsheet Matrix Container */}
      <div className="overflow-x-auto custom-scrollbar mt-4">
        <table className="w-full text-left border-collapse min-w-[620px]">
          <thead>
            <tr className="border-b border-[#E5E7EB] text-[11px] uppercase tracking-wider text-[#71717A] font-bold">
              <th className="py-2.5 px-3 font-bold w-1/3 min-w-[180px]">
                Habit
              </th>
              {daysInfo.map((day) => (
                <th
                  key={day.dayIndex}
                  className={`py-2.5 px-2 text-center w-10 font-bold ${
                    day.isToday ? 'text-[#111111] bg-[#F4F4F5] rounded-t' : ''
                  }`}
                >
                  <span className="block text-xs">{day.singleLetter}</span>
                  <span className="block text-[9px] font-mono font-normal text-[#A1A1AA]">
                    {day.dateStr.split('-')[2]}
                  </span>
                </th>
              ))}
              <th className="py-2.5 px-3 text-right w-24">Consistency</th>
              <th className="py-2.5 px-2 text-center w-12">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F4F4F5] text-xs">
            {habits.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-10 text-center text-[#A1A1AA] italic">
                  No habits added yet. Add a habit to start tracking.
                </td>
              </tr>
            ) : (
              habits.map((habit, habitIndex) => {
                const habitPct = calculateHabitProgress(habit.completed);
                const isEditing = editingHabitId === habit.id;

                return (
                  <tr
                    key={habit.id}
                    className="hover:bg-[#FAFAFA] transition-colors group"
                  >
                    {/* Habit Name / Edit */}
                    <td className="py-2.5 px-3">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="w-full text-xs font-medium text-[#111111] bg-white border border-[#111111] rounded px-1.5 py-1 focus:outline-none"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveRename(habit.id);
                              if (e.key === 'Escape') cancelRename();
                            }}
                          />
                          <button
                            onClick={() => saveRename(habit.id)}
                            className="p-1 text-[#111111] hover:bg-[#E5E7EB] rounded"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={cancelRename}
                            className="p-1 text-[#71717A] hover:bg-[#E5E7EB] rounded"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <span
                            onDoubleClick={() => startRename(habit)}
                            className="font-semibold text-[#111111] cursor-pointer hover:underline underline-offset-2"
                            title="Double-click to rename"
                          >
                            {habit.name}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* 7 Checkboxes (Mon - Sun) */}
                    {Array.from({ length: 7 }, (_, dIdx) => {
                      const isChecked = Boolean(habit.completed[dIdx]);
                      const isDayToday = daysInfo[dIdx]?.isToday;

                      return (
                        <td
                          key={dIdx}
                          className={`py-2 px-2 text-center align-middle ${
                            isDayToday ? 'bg-[#FAFAFA]' : ''
                          }`}
                        >
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={isChecked}
                            aria-label={`${habit.name} on ${daysInfo[dIdx]?.dayName}`}
                            onClick={() => onToggleHabitDay(habit.id, dIdx)}
                            className={`w-5 h-5 mx-auto rounded-xs border flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] ${
                              isChecked
                                ? 'bg-[#111111] border-[#111111] text-white'
                                : 'bg-white border-[#D4D4D8] hover:border-[#71717A]'
                            }`}
                          >
                            {isChecked && <CheckCheck className="w-3 h-3 stroke-[2.5]" />}
                          </button>
                        </td>
                      );
                    })}

                    {/* Consistency Percentage + Mini Bar */}
                    <td className="py-2.5 px-3 text-right align-middle">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-12 bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="bg-[#111111] h-full transition-all duration-300 rounded-full"
                            style={{ width: `${habitPct}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-[#111111] tabular-nums">
                          {habitPct}%
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-2 text-center align-middle">
                      <div className="flex items-center justify-center gap-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
                        {habitIndex > 0 && (
                          <button
                            type="button"
                            onClick={() => onMoveHabit(habitIndex, 'up')}
                            className="p-1 text-[#A1A1AA] hover:text-[#111111] hover:bg-[#E5E7EB] rounded"
                            title="Move up"
                            aria-label="Move habit up"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                        )}
                        {habitIndex < habits.length - 1 && (
                          <button
                            type="button"
                            onClick={() => onMoveHabit(habitIndex, 'down')}
                            className="p-1 text-[#A1A1AA] hover:text-[#111111] hover:bg-[#E5E7EB] rounded"
                            title="Move down"
                            aria-label="Move habit down"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => startRename(habit)}
                          className="p-1 text-[#71717A] hover:text-[#111111] hover:bg-[#E5E7EB] rounded"
                          title="Rename habit"
                          aria-label="Rename habit"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteHabit(habit.id)}
                          className="p-1 text-[#71717A] hover:text-[#DC2626] hover:bg-[#FEE2E2] rounded"
                          title="Delete habit"
                          aria-label="Delete habit"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add New Habit Form */}
      <form onSubmit={handleCreateHabit} className="mt-4 pt-3 border-t border-[#F4F4F5] flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          placeholder="Add a new habit (e.g. Read 15 mins, Hydrate 2L)..."
          className="w-full sm:max-w-md text-xs text-[#111111] bg-[#F8F9FA] hover:bg-white focus:bg-white border border-[#E5E7EB] focus:border-[#111111] rounded px-3 py-2 transition-colors focus:outline-none placeholder:text-[#A1A1AA]"
        />
        <button
          type="submit"
          disabled={!newHabitName.trim()}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[#111111] text-white hover:bg-[#27272A] disabled:bg-[#E5E7EB] disabled:text-[#A1A1AA] rounded transition-colors whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Habit</span>
        </button>
      </form>
    </section>
  );
};
