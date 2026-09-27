import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  FileText,
  ChevronUp,
  ChevronDown,
  Star,
  Sparkles,
  Clock,
  Droplets,
} from 'lucide-react';
import { DayPlan, Task, DayInfo, DayMood, DayPrayers } from '../types/planner';
import { CompletionRing } from './CompletionRing';
import { calculateDailyProgress } from '../utils/calculations';
import { playTaskCompleteSound } from '../utils/soundEffects';
import { playWaterDropSound } from '../utils/waterSound';
import { fireConfetti } from '../utils/confetti';

interface DayCardProps {
  dayInfo: DayInfo;
  dayPlan?: DayPlan;
  isActive: boolean;
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
  onUpdateGratitude?: (dayIndex: number, gratitude: string) => void;
}

const MOODS: { type: DayMood; emoji: string; label: string }[] = [
  { type: 'fire', emoji: '🔥', label: 'High Energy' },
  { type: 'focus', emoji: '⚡', label: 'Laser Focus' },
  { type: 'calm', emoji: '😊', label: 'Calm & Steady' },
  { type: 'tired', emoji: '🥱', label: 'Tired' },
  { type: 'rest', emoji: '🌿', label: 'Rest Day' },
];

const PRAYERS: (keyof DayPrayers)[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export const DayCard: React.FC<DayCardProps> = ({
  dayInfo,
  dayPlan,
  isActive,
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
  onUpdateGratitude,
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [showTimeInput, setShowTimeInput] = useState(false);

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingTime, setEditingTime] = useState('');

  const [isEditingNote, setIsEditingNote] = useState(false);
  const [tempNote, setTempNote] = useState(dayPlan?.note || '');
  const [isEditingWin, setIsEditingWin] = useState(false);
  const [tempWin, setTempWin] = useState(dayPlan?.winOfTheDay || '');
  const [showPrayers, setShowPrayers] = useState(false);
  const [showWaterPicker, setShowWaterPicker] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const tasks = dayPlan?.tasks || [];
  const progress = calculateDailyProgress(dayPlan);
  const isMastered = progress === 100 && tasks.length > 0;
  const waterCount = dayPlan?.waterGlasses || 0;

  useEffect(() => {
    setTempNote(dayPlan?.note || '');
  }, [dayPlan?.note]);

  useEffect(() => {
    if (editingTaskId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingTaskId]);

  const handleAddNewTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newTaskTitle.trim();
    if (!trimmed) return;
    onAddTask(dayInfo.dayIndex, trimmed, newTaskTime.trim() || undefined);
    setNewTaskTitle('');
    setNewTaskTime('');
    setShowTimeInput(false);
    inputRef.current?.focus();
  };

  const handleToggle = (task: Task) => {
    if (!task.completed) {
      playTaskCompleteSound();
      const remainingIncomplete = tasks.filter((t) => !t.completed && t.id !== task.id).length;
      if (remainingIncomplete === 0 && tasks.length > 0) {
        fireConfetti();
      }
    }
    onToggleTask(dayInfo.dayIndex, task.id);
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
    setEditingTime(task.time || '');
  };

  const saveEdit = (taskId: string) => {
    const trimmed = editingTitle.trim();
    if (trimmed) {
      onEditTask(dayInfo.dayIndex, taskId, trimmed, editingTime.trim() || undefined);
    }
    setEditingTaskId(null);
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditingTitle('');
    setEditingTime('');
  };

  const handleSaveNote = () => {
    onUpdateNote(dayInfo.dayIndex, tempNote.trim());
    setIsEditingNote(false);
  };

  const handleSaveWin = () => {
    onUpdateWin?.(dayInfo.dayIndex, tempWin.trim());
    setIsEditingWin(false);
  };

  const handleIncrementWater = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = waterCount >= 8 ? 0 : waterCount + 1;
    if (next > waterCount) playWaterDropSound(next);
    onUpdateWater?.(dayInfo.dayIndex, next);
  };

  const currentMood = dayPlan?.mood;
  const prayers = dayPlan?.prayers || { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false };
  const completedPrayersCount = Object.values(prayers).filter(Boolean).length;

  return (
    <div
      id={`day-card-${dayInfo.dayIndex}`}
      className={`day-card bg-white dark:bg-[#18181B] border rounded-xl flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
        isMastered
          ? 'border-emerald-500 dark:border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
          : isActive
          ? 'border-[#111111] dark:border-white shadow-xs ring-1 ring-[#111111]/10 dark:ring-white/20'
          : 'border-[#E5E7EB] dark:border-[#27272A] hover:border-[#D4D4D8] dark:hover:border-[#3F3F46]'
      }`}
    >
      {/* 100% Mastered Top Gradient Glow Bar */}
      {isMastered && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400" />
      )}

      {/* Card Header */}
      <div className="p-4 border-b border-[#F4F4F5] dark:border-[#27272A] flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold tracking-tight text-[#111111] dark:text-white">
              {dayInfo.dayName}
            </h3>
            {dayInfo.isToday && (
              <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800/50">
                Today
              </span>
            )}
            {isMastered && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/50">
                <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                Done
              </span>
            )}
          </div>
          <p className="text-xs text-[#71717A] dark:text-[#A1A1AA] tabular-nums mt-0.5">
            {dayInfo.formattedDate}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CompletionRing progress={progress} size={42} strokeWidth={3.5} />
        </div>
      </div>

      {/* Daily Note Strip */}
      <div className="px-4 py-2 bg-[#FAFAFA] dark:bg-[#121214] border-b border-[#F4F4F5] dark:border-[#27272A]">
        {isEditingNote ? (
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={tempNote}
              onChange={(e) => setTempNote(e.target.value)}
              placeholder="Daily focus note..."
              className="text-xs w-full bg-white dark:bg-[#18181B] border border-[#D4D4D8] dark:border-[#27272A] rounded px-2 py-1 text-[#111111] dark:text-white focus:outline-none focus:border-[#111111] dark:focus:border-white"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveNote();
                if (e.key === 'Escape') setIsEditingNote(false);
              }}
            />
            <button
              onClick={handleSaveNote}
              className="p-1 text-[#111111] dark:text-white hover:bg-[#E5E7EB] dark:hover:bg-[#27272A] rounded cursor-pointer"
              title="Save note"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsEditingNote(false)}
              className="p-1 text-[#71717A] hover:bg-[#E5E7EB] dark:hover:bg-[#27272A] rounded cursor-pointer"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => setIsEditingNote(true)}
            className="flex items-center justify-between text-xs text-[#71717A] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white cursor-pointer group py-0.5"
          >
            <span className="truncate italic">
              {dayPlan?.note ? dayPlan.note : 'Add daily focus note...'}
            </span>
            <FileText className="w-3 h-3 text-[#A1A1AA] group-hover:text-[#111111] dark:group-hover:text-white shrink-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
      </div>

      {/* Win of the Day & Gratitude strip */}
      <div className="px-4 py-1.5 bg-amber-50/30 dark:bg-amber-950/20 border-b border-[#F4F4F5] dark:border-[#27272A] flex items-center justify-between gap-1 text-[11px]">
        {isEditingWin ? (
          <div className="flex items-center gap-1.5 w-full">
            <span className="text-amber-500 font-bold">🏆</span>
            <input
              type="text"
              value={tempWin}
              onChange={(e) => setTempWin(e.target.value)}
              placeholder="What was your #1 Win today? (Alhamdulillah)"
              className="text-xs w-full bg-white dark:bg-[#18181B] border border-amber-300 dark:border-amber-700/60 rounded px-2 py-0.5 text-[#111111] dark:text-white focus:outline-none"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveWin();
                if (e.key === 'Escape') setIsEditingWin(false);
              }}
            />
            <button
              onClick={handleSaveWin}
              className="p-1 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded cursor-pointer shrink-0"
            >
              <Check className="w-3 h-3" />
            </button>
            <button
              onClick={() => setIsEditingWin(false)}
              className="p-1 text-[#71717A] hover:bg-[#E5E7EB] dark:hover:bg-[#27272A] rounded cursor-pointer shrink-0"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => setIsEditingWin(true)}
            className="flex items-center justify-between w-full cursor-pointer hover:opacity-80 transition-opacity"
            title="Click to write your Win of the Day"
          >
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-amber-500 text-xs">🏆</span>
              <span className="text-[#52525B] dark:text-zinc-300 truncate font-medium">
                {dayPlan?.winOfTheDay ? (
                  <span>Win: <strong className="text-[#111111] dark:text-white">{dayPlan.winOfTheDay}</strong></span>
                ) : (
                  <span className="text-[#A1A1AA] italic">Log today's biggest win...</span>
                )}
              </span>
            </div>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold shrink-0">
              Win ✦
            </span>
          </div>
        )}
      </div>

      {/* Daily Mood, Prayer & Water Strip */}
      <div className="px-4 py-2 border-b border-[#F4F4F5] dark:border-[#27272A] bg-white dark:bg-[#18181B] flex items-center justify-between gap-1.5 flex-wrap">
        {/* Mood Selector */}
        <div className="flex items-center gap-1">
          {MOODS.map((m) => {
            const isSelected = currentMood === m.type;
            return (
              <button
                key={m.type}
                type="button"
                onClick={() => onUpdateMood?.(dayInfo.dayIndex, m.type)}
                className={`text-xs p-1 rounded-md transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-100 dark:bg-amber-950/60 ring-1 ring-amber-400 scale-110'
                    : 'opacity-50 hover:opacity-100 hover:bg-[#F4F4F5] dark:hover:bg-[#27272A]'
                }`}
                title={m.label}
              >
                {m.emoji}
              </button>
            );
          })}
        </div>

        {/* Right Action Badges: Salah & Water */}
        <div className="flex items-center gap-1.5">
          {/* Water quick badge */}
          <button
            type="button"
            onClick={handleIncrementWater}
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
              waterCount >= 8
                ? 'bg-sky-100 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800'
                : 'bg-[#FAFAFA] dark:bg-[#202024] text-[#71717A] dark:text-[#A1A1AA] border-[#E5E7EB] dark:border-[#27272A]'
            }`}
            title="Click to add water glass (+250ml)"
          >
            <Droplets className="w-2.5 h-2.5 text-sky-500" />
            <span>{waterCount}/8</span>
          </button>

          {/* 5 Prayers Toggle */}
          <button
            type="button"
            onClick={() => setShowPrayers(!showPrayers)}
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
              completedPrayersCount === 5
                ? 'bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-300'
                : 'bg-[#FAFAFA] dark:bg-[#202024] text-[#71717A] dark:text-[#A1A1AA] border-[#E5E7EB] dark:border-[#27272A]'
            }`}
            title="Toggle 5 Daily Prayers (Salah)"
          >
            🤲 {completedPrayersCount}/5
          </button>
        </div>
      </div>

      {/* Expandable Prayers Checklist */}
      {showPrayers && (
        <div className="px-4 py-2 bg-purple-50/50 dark:bg-purple-950/20 border-b border-[#F4F4F5] dark:border-[#27272A] flex items-center justify-between gap-1">
          {PRAYERS.map((prayer) => {
            const isDone = prayers[prayer];
            return (
              <button
                key={prayer}
                type="button"
                onClick={() => onTogglePrayer?.(dayInfo.dayIndex, prayer)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                  isDone
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'bg-white dark:bg-[#27272A] text-purple-900 dark:text-purple-200 border border-purple-200 dark:border-purple-800/40'
                }`}
              >
                {prayer}
              </button>
            );
          })}
        </div>
      )}

      {/* Task List Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5 min-h-[120px]">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center px-2">
              <p className="text-xs text-[#A1A1AA] font-normal">
                No tasks planned yet. Add your first task.
              </p>
            </div>
          ) : (
            tasks.map((task, index) => {
              const isEditing = editingTaskId === task.id;
              const isHighPriority = task.priority === 'high';

              return (
                <div
                  key={task.id}
                  className={`group flex items-start justify-between gap-1.5 p-1.5 rounded-lg transition-colors ${
                    task.completed
                      ? 'bg-[#FAFAFA] dark:bg-[#151518]'
                      : isHighPriority
                      ? 'bg-[#FEFCE8] dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40'
                      : 'hover:bg-[#F8F9FA] dark:hover:bg-[#202024]'
                  }`}
                >
                  {/* Checkbox and Title */}
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={task.completed}
                      onClick={() => handleToggle(task)}
                      className={`mt-0.5 w-4 h-4 rounded-xs border flex items-center justify-center shrink-0 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] dark:focus-visible:ring-white ${
                        task.completed
                          ? 'bg-[#111111] dark:bg-white border-[#111111] dark:border-white text-white dark:text-[#111111] shadow-xs'
                          : 'bg-white dark:bg-[#18181B] border-[#D4D4D8] dark:border-[#3F3F46] hover:border-[#71717A]'
                      }`}
                    >
                      {task.completed && (
                        <Check className="w-3 h-3 stroke-[3]" />
                      )}
                    </button>

                    {isEditing ? (
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center gap-1 w-full">
                          <input
                            ref={editInputRef}
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="w-full text-xs text-[#111111] dark:text-white bg-white dark:bg-[#18181B] border border-[#111111] dark:border-white rounded px-1.5 py-0.5 focus:outline-none"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit(task.id);
                              if (e.key === 'Escape') cancelEdit();
                            }}
                          />
                          <button
                            onClick={() => saveEdit(task.id)}
                            className="p-1 text-[#111111] dark:text-white hover:bg-[#E5E7EB] dark:hover:bg-[#27272A] rounded shrink-0 cursor-pointer"
                            title="Save"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 text-[#71717A] hover:bg-[#E5E7EB] dark:hover:bg-[#27272A] rounded shrink-0 cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-[#A1A1AA]" />
                          <input
                            type="text"
                            value={editingTime}
                            onChange={(e) => setEditingTime(e.target.value)}
                            placeholder="Time block (e.g. 09:30 AM)"
                            className="text-[11px] bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] rounded px-1.5 py-0.5 text-[#111111] dark:text-white w-36"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-1.5 min-w-0 flex-1 flex-wrap">
                        {/* Time block pill */}
                        {task.time && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-bold text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/40 px-1.5 py-0.2 rounded shrink-0">
                            <Clock className="w-2.5 h-2.5" />
                            {task.time}
                          </span>
                        )}

                        <span
                          onClick={() => handleToggle(task)}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            startEditing(task);
                          }}
                          className={`text-xs break-words leading-relaxed select-text cursor-pointer hover:opacity-80 transition-opacity ${
                            task.completed
                              ? 'line-through text-[#8E8E93] dark:text-[#71717A]'
                              : isHighPriority
                              ? 'text-[#111111] dark:text-white font-semibold'
                              : 'text-[#111111] dark:text-zinc-200'
                          }`}
                          title="Click to toggle, double-click to edit"
                        >
                          {task.title}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {!isEditing && (
                    <div className="flex items-center gap-0.5 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      {/* Priority toggle */}
                      <button
                        type="button"
                        onClick={() => onTogglePriority(dayInfo.dayIndex, task.id)}
                        className={`p-1 rounded transition-colors cursor-pointer ${
                          isHighPriority
                            ? 'text-amber-600 hover:text-amber-700'
                            : 'text-[#A1A1AA] hover:text-amber-600'
                        }`}
                        title={isHighPriority ? 'High priority' : 'Mark high priority'}
                        aria-label="Toggle priority"
                      >
                        <Star className={`w-3 h-3 ${isHighPriority ? 'fill-current' : ''}`} />
                      </button>

                      {/* Move Up */}
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => onMoveTask(dayInfo.dayIndex, index, 'up')}
                          className="p-1 text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white hover:bg-[#E5E7EB] dark:hover:bg-[#27272A] rounded cursor-pointer"
                          title="Move up"
                          aria-label="Move task up"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                      )}

                      {/* Move Down */}
                      {index < tasks.length - 1 && (
                        <button
                          type="button"
                          onClick={() => onMoveTask(dayInfo.dayIndex, index, 'down')}
                          className="p-1 text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white hover:bg-[#E5E7EB] dark:hover:bg-[#27272A] rounded cursor-pointer"
                          title="Move down"
                          aria-label="Move task down"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      )}

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => startEditing(task)}
                        className="p-1 text-[#71717A] hover:text-[#111111] dark:hover:text-white hover:bg-[#E5E7EB] dark:hover:bg-[#27272A] rounded transition-colors cursor-pointer"
                        title="Edit task"
                        aria-label="Edit task"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => onDeleteTask(dayInfo.dayIndex, task.id)}
                        className="p-1 text-[#71717A] hover:text-[#DC2626] hover:bg-[#FEE2E2] dark:hover:bg-red-950/40 rounded transition-colors cursor-pointer"
                        title="Delete task"
                        aria-label="Delete task"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Add Task Input with Time-Blocking */}
        <form onSubmit={handleAddNewTask} className="mt-4 pt-3 border-t border-[#F4F4F5] dark:border-[#27272A]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <input
                id={`task-input-${dayInfo.dayIndex}`}
                ref={inputRef}
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Add a task..."
                className="w-full text-xs text-[#111111] dark:text-white bg-[#F8F9FA] dark:bg-[#121214] hover:bg-white dark:hover:bg-[#18181B] focus:bg-white dark:focus:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] focus:border-[#111111] dark:focus:border-white rounded-lg px-2.5 py-1.5 transition-colors focus:outline-none placeholder:text-[#A1A1AA]"
              />

              {/* Time Toggle Icon */}
              <button
                type="button"
                onClick={() => setShowTimeInput(!showTimeInput)}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer shrink-0 ${
                  showTimeInput || newTaskTime
                    ? 'bg-sky-50 dark:bg-sky-950/50 border-sky-300 text-sky-600'
                    : 'border-[#E5E7EB] dark:border-[#27272A] text-[#71717A] dark:text-[#A1A1AA] hover:text-[#111111]'
                }`}
                title="Add scheduled time block"
              >
                <Clock className="w-3.5 h-3.5" />
              </button>

              <button
                type="submit"
                disabled={!newTaskTitle.trim()}
                className="p-1.5 bg-[#111111] dark:bg-white text-white dark:text-[#111111] disabled:bg-[#E5E7EB] dark:disabled:bg-[#27272A] disabled:text-[#A1A1AA] hover:bg-[#27272A] dark:hover:bg-zinc-200 rounded-lg transition-colors shrink-0 cursor-pointer shadow-xs"
                title="Add task (Enter)"
                aria-label="Add task"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Optional Time-Block Input Row */}
            {showTimeInput && (
              <div className="flex items-center gap-1.5 bg-[#FAFAFA] dark:bg-[#121214] p-1.5 rounded-lg border border-[#E5E7EB] dark:border-[#27272A]">
                <Clock className="w-3 h-3 text-[#71717A]" />
                <input
                  type="text"
                  value={newTaskTime}
                  onChange={(e) => setNewTaskTime(e.target.value)}
                  placeholder="e.g. 09:30 AM or 14:00"
                  className="w-full text-[11px] text-[#111111] dark:text-white bg-transparent border-none focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setNewTaskTime('09:00 AM')}
                  className="text-[9px] px-1 py-0.5 bg-white dark:bg-[#27272A] rounded border border-[#E5E7EB] dark:border-[#3F3F46] text-[#71717A] hover:text-[#111111]"
                >
                  9am
                </button>
                <button
                  type="button"
                  onClick={() => setNewTaskTime('02:00 PM')}
                  className="text-[9px] px-1 py-0.5 bg-white dark:bg-[#27272A] rounded border border-[#E5E7EB] dark:border-[#3F3F46] text-[#71717A] hover:text-[#111111]"
                >
                  2pm
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
