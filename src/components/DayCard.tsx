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
  Copy,
  ArrowRightCircle,
  CheckCheck,
  Bell,
  BellRing,
  SunMedium,
  Sunset,
  Moon,
  Coffee,
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
  onAddTask: (
    dayIndex: number,
    title: string,
    time?: string,
    reminder?: boolean,
    endTime?: string,
    reminderTiming?: 'exact' | '5m' | '10m' | '15m'
  ) => void;
  onEditTask: (
    dayIndex: number,
    taskId: string,
    newTitle: string,
    newTime?: string,
    reminder?: boolean,
    newEndTime?: string,
    reminderTiming?: 'exact' | '5m' | '10m' | '15m'
  ) => void;
  onDeleteTask: (dayIndex: number, taskId: string) => void;
  onMoveTask: (dayIndex: number, fromIndex: number, direction: 'up' | 'down') => void;
  onTogglePriority: (dayIndex: number, taskId: string) => void;
  onToggleReminder?: (dayIndex: number, taskId: string) => void;
  onSortTasksByTime?: (dayIndex: number) => void;
  onUpdateNote: (dayIndex: number, note: string) => void;
  onUpdateMood?: (dayIndex: number, mood: DayMood) => void;
  onTogglePrayer?: (dayIndex: number, prayer: keyof DayPrayers) => void;
  onUpdateWater?: (dayIndex: number, glasses: number) => void;
  onUpdateWin?: (dayIndex: number, win: string) => void;
  onUpdateGratitude?: (dayIndex: number, gratitude: string) => void;
  onPostponeTask?: (dayIndex: number, taskId: string) => void;
  onDuplicateTask?: (dayIndex: number, taskId: string) => void;
  onClearCompletedTasks?: (dayIndex: number) => void;
}

const MOODS: { type: DayMood; emoji: string; label: string }[] = [
  { type: 'fire', emoji: '🔥', label: 'High Energy' },
  { type: 'focus', emoji: '⚡', label: 'Laser Focus' },
  { type: 'calm', emoji: '😊', label: 'Calm & Steady' },
  { type: 'tired', emoji: '🥱', label: 'Tired' },
  { type: 'rest', emoji: '🌿', label: 'Rest Day' },
];

const PRAYERS: (keyof DayPrayers)[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

// Convert 24h format "14:30" to 12h AM/PM "02:30 PM"
const formatTime24to12 = (time24: string): string => {
  if (!time24) return '';
  if (time24.toUpperCase().includes('AM') || time24.toUpperCase().includes('PM')) {
    return time24;
  }
  const parts = time24.split(':');
  if (parts.length < 2) return time24;
  let h = parseInt(parts[0], 10);
  const m = parts[1].padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h.toString().padStart(2, '0')}:${m} ${ampm}`;
};

// Calculate end time given a start time and minutes duration
const calculateEndTime = (startTimeStr: string, durationMinutes: number): string => {
  if (!startTimeStr) return '';
  const cleaned = startTimeStr.trim().toUpperCase();
  const isPM = cleaned.includes('PM');
  const isAM = cleaned.includes('AM');
  const timeOnly = cleaned.replace(/AM|PM/g, '').trim();
  const parts = timeOnly.split(':');
  if (parts.length < 2) return '';
  let hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return '';

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  let totalMins = hours * 60 + minutes + durationMinutes;
  totalMins = totalMins % (24 * 60);

  const endH = Math.floor(totalMins / 60);
  const endM = totalMins % 60;
  const endAmPm = endH >= 12 ? 'PM' : 'AM';
  let displayH = endH % 12;
  if (displayH === 0) displayH = 12;

  return `${displayH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')} ${endAmPm}`;
};

// Determine whether a task scheduled for today is currently active, upcoming, or past
const getTaskScheduleStatus = (task: Task, isToday: boolean): 'current' | 'past' | 'upcoming' | null => {
  if (!isToday || !task.time || task.completed) return null;
  const cleaned = task.time.trim().toUpperCase();
  const isPM = cleaned.includes('PM');
  const isAM = cleaned.includes('AM');
  const timeOnly = cleaned.replace(/AM|PM/g, '').trim();
  const parts = timeOnly.split(':');
  if (parts.length < 2) return null;
  let hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return null;

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  const taskMins = hours * 60 + minutes;
  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();

  if (Math.abs(currentMins - taskMins) <= 25) return 'current';
  if (currentMins > taskMins + 25) return 'past';
  return 'upcoming';
};

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
  onToggleReminder,
  onSortTasksByTime,
  onUpdateNote,
  onUpdateMood,
  onTogglePrayer,
  onUpdateWater,
  onUpdateWin,
  onPostponeTask,
  onDuplicateTask,
  onClearCompletedTasks,
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [newTaskEndTime, setNewTaskEndTime] = useState('');
  const [newTaskReminder, setNewTaskReminder] = useState(false);
  const [newTaskReminderTiming, setNewTaskReminderTiming] = useState<'exact' | '5m' | '10m' | '15m'>('exact');
  const [showTimeInput, setShowTimeInput] = useState(false);

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingTime, setEditingTime] = useState('');
  const [editingEndTime, setEditingEndTime] = useState('');
  const [editingReminder, setEditingReminder] = useState(false);
  const [editingReminderTiming, setEditingReminderTiming] = useState<'exact' | '5m' | '10m' | '15m'>('exact');

  const [isEditingNote, setIsEditingNote] = useState(false);
  const [tempNote, setTempNote] = useState(dayPlan?.note || '');
  const [isEditingWin, setIsEditingWin] = useState(false);
  const [tempWin, setTempWin] = useState(dayPlan?.winOfTheDay || '');
  const [showPrayers, setShowPrayers] = useState(false);

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
    onAddTask(
      dayInfo.dayIndex,
      trimmed,
      newTaskTime.trim() ? formatTime24to12(newTaskTime.trim()) : undefined,
      newTaskReminder,
      newTaskEndTime.trim() ? formatTime24to12(newTaskEndTime.trim()) : undefined,
      newTaskReminderTiming
    );
    setNewTaskTitle('');
    setNewTaskTime('');
    setNewTaskEndTime('');
    setNewTaskReminder(false);
    setNewTaskReminderTiming('exact');
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
    setEditingEndTime(task.endTime || '');
    setEditingReminder(task.reminder ?? false);
    setEditingReminderTiming(task.reminderTiming || 'exact');
  };

  const saveEdit = (taskId: string) => {
    const trimmed = editingTitle.trim();
    if (trimmed) {
      onEditTask(
        dayInfo.dayIndex,
        taskId,
        trimmed,
        editingTime.trim() ? formatTime24to12(editingTime.trim()) : undefined,
        editingReminder,
        editingEndTime.trim() ? formatTime24to12(editingEndTime.trim()) : undefined,
        editingReminderTiming
      );
    }
    setEditingTaskId(null);
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditingTitle('');
    setEditingTime('');
    setEditingEndTime('');
    setEditingReminder(false);
    setEditingReminderTiming('exact');
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
      className={`day-card bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border rounded-2xl flex flex-col justify-between transition-all duration-300 relative overflow-hidden shadow-xs hover:shadow-md ${
        isMastered
          ? 'border-emerald-500/80 dark:border-emerald-500/80 ring-2 ring-emerald-500/20'
          : dayInfo.isToday
          ? 'border-amber-400 dark:border-amber-500 ring-2 ring-amber-400/25'
          : isActive
          ? 'border-slate-900 dark:border-white ring-1 ring-slate-900/10 dark:ring-white/20'
          : 'border-slate-200/90 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* 100% Mastered Top Gradient Glow Bar */}
      {isMastered && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400" />
      )}
      {dayInfo.isToday && !isMastered && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400" />
      )}

      {/* Card Header */}
      <div className="p-3.5 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
              {dayInfo.dayName}
            </h3>
            {dayInfo.isToday && (
              <span className="text-[10px] uppercase font-black text-amber-800 dark:text-amber-200 bg-amber-100/90 dark:bg-amber-950/70 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700/60 shadow-2xs font-mono">
                আজ / Today
              </span>
            )}
            {isMastered && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800/60 shadow-2xs font-mono">
                <Sparkles className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                Done
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums mt-0.5 font-medium">
            {dayInfo.formattedDate}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <CompletionRing progress={progress} size={40} strokeWidth={3.5} />
        </div>
      </div>

      {/* Daily Note Strip */}
      <div className="px-3.5 py-1.5 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/60">
        {isEditingNote ? (
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={tempNote}
              onChange={(e) => setTempNote(e.target.value)}
              placeholder="আজকের মূল ফোকাস বা নোট লিখুন..."
              className="text-xs w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 shadow-inner"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveNote();
                if (e.key === 'Escape') setIsEditingNote(false);
              }}
            />
            <button
              onClick={handleSaveNote}
              className="p-1 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              title="Save note"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsEditingNote(false)}
              className="p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => setIsEditingNote(true)}
            className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer group py-0.5"
          >
            <span className="truncate italic font-medium">
              {dayPlan?.note ? dayPlan.note : 'আজকের মূল ফোকাস মটো লিখুন...'}
            </span>
            <FileText className="w-3 h-3 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 shrink-0 ml-1 opacity-60 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
      </div>

      {/* Win of the Day & Gratitude strip */}
      <div className="px-3.5 py-1.5 bg-gradient-to-r from-amber-50/60 via-amber-50/20 to-orange-50/40 dark:from-amber-950/30 dark:via-amber-950/15 dark:to-orange-950/20 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-1 text-[11px]">
        {isEditingWin ? (
          <div className="flex items-center gap-1.5 w-full">
            <span className="text-amber-500 font-bold text-xs">🏆</span>
            <input
              type="text"
              value={tempWin}
              onChange={(e) => setTempWin(e.target.value)}
              placeholder="আজকের সবচেয়ে বড় অর্জন/উইন কী ছিল? (আলহামদুলিল্লাহ)"
              className="text-xs w-full bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700/60 rounded-lg px-2.5 py-1 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-inner"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveWin();
                if (e.key === 'Escape') setIsEditingWin(false);
              }}
            />
            <button
              onClick={handleSaveWin}
              className="p-1 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-lg cursor-pointer shrink-0"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsEditingWin(false)}
              className="p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => setIsEditingWin(true)}
            className="flex items-center justify-between w-full cursor-pointer hover:opacity-85 transition-opacity"
            title="Click to write your Win of the Day"
          >
            <div className="flex items-center gap-2 truncate">
              <span className="p-0.5 bg-amber-200/50 dark:bg-amber-800/40 rounded text-amber-700 dark:text-amber-300 text-xs">🏆</span>
              <span className="text-slate-600 dark:text-slate-300 truncate font-medium">
                {dayPlan?.winOfTheDay ? (
                  <span>Daily Win: <strong className="text-slate-900 dark:text-white font-bold">{dayPlan.winOfTheDay}</strong></span>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500 italic">আজকের দিনের সেরা অর্জন লিখুন...</span>
                )}
              </span>
            </div>
            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-black shrink-0 font-mono">
              WIN ✦
            </span>
          </div>
        )}
      </div>

      {/* Daily Mood, Prayer & Water Strip */}
      <div className="px-3.5 py-1.5 border-b border-slate-100 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 flex items-center justify-between gap-1.5 flex-wrap">
        {/* Mood Selector */}
        <div className="flex items-center gap-1 bg-slate-100/70 dark:bg-slate-800/60 p-0.5 rounded-xl">
          {MOODS.map((m) => {
            const isSelected = currentMood === m.type;
            return (
              <button
                key={m.type}
                type="button"
                onClick={() => onUpdateMood?.(dayInfo.dayIndex, m.type)}
                className={`text-xs p-1 rounded-lg transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white dark:bg-slate-700 shadow-xs ring-1 ring-amber-400/50 scale-110'
                    : 'opacity-50 hover:opacity-100 hover:bg-white/50 dark:hover:bg-slate-800'
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
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border transition-all cursor-pointer flex items-center gap-1 shadow-2xs font-mono ${
              waterCount >= 8
                ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-sky-300'
            }`}
            title="পানি পান করুন (+২৫০মিলি)"
          >
            <Droplets className="w-2.5 h-2.5 text-sky-500" />
            <span>{waterCount}/8</span>
          </button>

          {/* 5 Prayers Toggle */}
          <button
            type="button"
            onClick={() => setShowPrayers(!showPrayers)}
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border transition-all cursor-pointer flex items-center gap-1 shadow-2xs font-mono ${
              completedPrayersCount === 5
                ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-purple-300'
            }`}
            title="৫ ওয়াক্ত নামাজ ট্র্যাকার"
          >
            <span>🤲</span>
            <span>{completedPrayersCount}/5</span>
          </button>
        </div>
      </div>

      {/* Expandable Prayers Checklist */}
      {showPrayers && (
        <div className="px-3.5 py-1.5 bg-purple-50/60 dark:bg-purple-950/30 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-1.5 animate-in fade-in duration-200">
          {PRAYERS.map((prayer) => {
            const isDone = prayers[prayer];
            return (
              <button
                key={prayer}
                type="button"
                onClick={() => onTogglePrayer?.(dayInfo.dayIndex, prayer)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isDone
                    ? 'bg-purple-600 text-white shadow-xs scale-105'
                    : 'bg-white dark:bg-slate-800 text-purple-900 dark:text-purple-200 border border-purple-200 dark:border-purple-800/50 hover:bg-purple-50'
                }`}
              >
                {prayer}
              </button>
            );
          })}
        </div>
      )}

      {/* Task List Content */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div className="space-y-2 min-h-[120px]">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center px-2">
              <span className="text-xl mb-1 opacity-40">📝</span>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                কোনো কাজ যোগ করা হয়নি। নিচে সময় সহ লিখুন।
              </p>
            </div>
          ) : (
            tasks.map((task, index) => {
              const isEditing = editingTaskId === task.id;
              const isHighPriority = task.priority === 'high';
              const schedStatus = getTaskScheduleStatus(task, dayInfo.isToday);

              return (
                <div
                  key={task.id}
                  className={`group flex items-start justify-between gap-2 p-2 rounded-xl transition-all border ${
                    task.completed
                      ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/40 opacity-75'
                      : schedStatus === 'current'
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-500/20 shadow-xs'
                      : isHighPriority
                      ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50 shadow-2xs'
                      : 'bg-white dark:bg-slate-900/60 border-slate-100 dark:border-slate-800/60 hover:border-slate-200 dark:hover:border-slate-700 shadow-2xs'
                  }`}
                >
                  {/* Checkbox and Title */}
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={task.completed}
                      onClick={() => handleToggle(task)}
                      className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all cursor-pointer focus:outline-none ${
                        task.completed
                          ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-900 shadow-xs'
                          : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {task.completed && (
                        <Check className="w-3 h-3 stroke-[3]" />
                      )}
                    </button>

                    {isEditing ? (
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-center gap-1 w-full">
                          <input
                            ref={editInputRef}
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="w-full text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-900 dark:border-white rounded-lg px-2 py-1 focus:outline-none"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit(task.id);
                              if (e.key === 'Escape') cancelEdit();
                            }}
                          />
                          <button
                            onClick={() => saveEdit(task.id)}
                            className="p-1 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg shrink-0 cursor-pointer"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg shrink-0 cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Edit time & reminder options */}
                        <div className="flex items-center gap-2 flex-wrap bg-slate-50 dark:bg-slate-800/80 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                            <Clock className="w-3 h-3 text-sky-500" />
                            <input
                              type="time"
                              onChange={(e) => setEditingTime(formatTime24to12(e.target.value))}
                              className="text-xs bg-transparent focus:outline-none cursor-pointer"
                              title="শুরুর সময়"
                            />
                            <input
                              type="text"
                              value={editingTime}
                              onChange={(e) => setEditingTime(e.target.value)}
                              placeholder="09:30 AM"
                              className="text-[11px] bg-transparent border-none focus:outline-none text-slate-900 dark:text-white w-18 font-mono font-bold"
                            />
                          </div>

                          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                            <span className="text-[10px] text-slate-400">শেষ:</span>
                            <input
                              type="text"
                              value={editingEndTime}
                              onChange={(e) => setEditingEndTime(e.target.value)}
                              placeholder="10:30 AM"
                              className="text-[11px] bg-transparent border-none focus:outline-none text-slate-900 dark:text-white w-18 font-mono font-bold"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => setEditingReminder(!editingReminder)}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                              editingReminder
                                ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <Bell className={`w-3 h-3 ${editingReminder ? 'fill-current text-amber-600' : ''}`} />
                            <span>{editingReminder ? 'অ্যালার্ট অন 🔔' : 'অ্যালার্ট অফ'}</span>
                          </button>

                          {editingReminder && (
                            <select
                              value={editingReminderTiming}
                              onChange={(e) => setEditingReminderTiming(e.target.value as 'exact' | '5m' | '10m' | '15m')}
                              className="text-[10px] font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md px-1.5 py-0.5 text-slate-700 dark:text-slate-300 cursor-pointer focus:outline-none"
                            >
                              <option value="exact">কাজের শুরুতে</option>
                              <option value="5m">৫ মিনিট আগে</option>
                              <option value="10m">১০ মিনিট আগে</option>
                              <option value="15m">১৫ মিনিট আগে</option>
                            </select>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          {/* Live Status Tag */}
                          {schedStatus === 'current' && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 px-1.5 py-0.5 rounded-full animate-pulse shadow-2xs font-mono">
                              ● এখন চলমান
                            </span>
                          )}
                          {schedStatus === 'past' && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/50 px-1.5 py-0.2 rounded-full font-mono">
                              অতিক্রান্ত
                            </span>
                          )}

                          {/* Time block badge */}
                          {task.time && (
                            <span
                              onClick={() => startEditing(task)}
                              className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/40 px-1.5 py-0.5 rounded-md shrink-0 cursor-pointer hover:border-sky-400 transition-colors"
                              title="ক্লিক করে সময় এডিট করুন"
                            >
                              <Clock className="w-2.5 h-2.5 text-sky-500" />
                              <span>{task.time}{task.endTime ? ` - ${task.endTime}` : ''}</span>
                            </span>
                          )}

                          {/* Reminder Bell Badge */}
                          {task.reminder ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleReminder?.(dayInfo.dayIndex, task.id);
                              }}
                              className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 px-1.5 py-0.5 rounded cursor-pointer hover:bg-amber-200 shadow-2xs"
                              title="রিমাইন্ডার অ্যালার্ট চালু আছে (ক্লিক করে বন্ধ করুন)"
                            >
                              <Bell className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400 fill-current animate-pulse" />
                              <span className="text-[9px]">
                                {task.reminderTiming === '5m' ? '৫মি আগে' : task.reminderTiming === '10m' ? '১০মি আগে' : task.reminderTiming === '15m' ? '১৫মি আগে' : 'অ্যালার্ট'}
                              </span>
                            </button>
                          ) : task.time ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleReminder?.(dayInfo.dayIndex, task.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-amber-600 transition-opacity cursor-pointer inline-flex items-center gap-0.5 text-[9px] bg-slate-100 dark:bg-slate-800 px-1 rounded"
                              title="এই সময়ে অ্যালার্ট রিমাইন্ডার সেট করুন"
                            >
                              <Bell className="w-2.5 h-2.5" />
                              <span>অ্যালার্ট</span>
                            </button>
                          ) : null}

                          <span
                            onClick={() => handleToggle(task)}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              startEditing(task);
                            }}
                            className={`text-xs break-words leading-relaxed select-text cursor-pointer hover:opacity-80 transition-opacity ${
                              task.completed
                                ? 'line-through text-slate-400 dark:text-zinc-500'
                                : isHighPriority
                                ? 'text-slate-900 dark:text-white font-bold'
                                : 'text-slate-800 dark:text-zinc-200 font-medium'
                            }`}
                            title="ক্লিক করে সম্পন্ন করুন, ডাবল ক্লিকে এডিট"
                          >
                            {task.title}
                          </span>
                        </div>
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
                            : 'text-slate-400 hover:text-amber-600'
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
                          className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded cursor-pointer"
                          title="উপরে নিন"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                      )}

                      {/* Move Down */}
                      {index < tasks.length - 1 && (
                        <button
                          type="button"
                          onClick={() => onMoveTask(dayInfo.dayIndex, index, 'down')}
                          className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded cursor-pointer"
                          title="নিচে নিন"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      )}

                      {/* Duplicate Task */}
                      {onDuplicateTask && (
                        <button
                          type="button"
                          onClick={() => onDuplicateTask(dayInfo.dayIndex, task.id)}
                          className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded transition-colors cursor-pointer"
                          title="ডুপ্লিকেট করুন"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      )}

                      {/* Postpone to Next Day */}
                      {onPostponeTask && (
                        <button
                          type="button"
                          onClick={() => onPostponeTask(dayInfo.dayIndex, task.id)}
                          className="p-1 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 rounded transition-colors cursor-pointer"
                          title="পরের দিনে পাঠান"
                        >
                          <ArrowRightCircle className="w-3 h-3" />
                        </button>
                      )}

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => startEditing(task)}
                        className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded transition-colors cursor-pointer"
                        title="এডিট করুন"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => onDeleteTask(dayInfo.dayIndex, task.id)}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors cursor-pointer"
                        title="ডিলিট করুন"
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

        {/* Card Footer: Sort by Time & Clear Completed */}
        <div className="flex items-center justify-between pt-2">
          {tasks.length > 1 && onSortTasksByTime && (
            <button
              type="button"
              onClick={() => onSortTasksByTime(dayInfo.dayIndex)}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-700 dark:text-sky-400 hover:text-sky-900 dark:hover:text-sky-300 cursor-pointer transition-colors bg-sky-50/60 dark:bg-sky-950/40 px-2 py-0.5 rounded-md border border-sky-200/50 dark:border-sky-800/40"
              title="কাজের সময় অনুযায়ী ক্রমানুসারে সাজান"
            >
              <Clock className="w-3 h-3 text-sky-500" />
              <span>সময় অনুযায়ী সাজান</span>
            </button>
          )}

          {onClearCompletedTasks && tasks.some((t) => t.completed) && (
            <button
              type="button"
              onClick={() => onClearCompletedTasks(dayInfo.dayIndex)}
              className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer transition-colors ml-auto"
              title="সম্পন্ন কাজগুলো ক্লিয়ার করুন"
            >
              <CheckCheck className="w-3 h-3" />
              <span>ক্লিয়ার {tasks.filter((t) => t.completed).length} টি</span>
            </button>
          )}
        </div>

        {/* Add Task Input with Time-Blocking & Alarm Reminder */}
        <form onSubmit={handleAddNewTask} className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/60">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <input
                id={`task-input-${dayInfo.dayIndex}`}
                ref={inputRef}
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="নতুন কাজ যোগ করুন (যেমন: সকালের পড়াশোনা, মিটিং)..."
                className="w-full text-xs text-slate-900 dark:text-white bg-slate-50/80 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-slate-900 dark:focus:border-white rounded-xl px-3 py-2 transition-all focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-2xs"
              />

              {/* Time Toggle Icon */}
              <button
                type="button"
                onClick={() => setShowTimeInput(!showTimeInput)}
                className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                  showTimeInput || newTaskTime
                    ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-300 dark:border-sky-800 text-sky-600 dark:text-sky-400 shadow-2xs font-bold text-xs'
                    : 'border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="কখন করবেন সময় ও অ্যালার্ট সেট করুন"
              >
                <Clock className="w-3.5 h-3.5" />
                {newTaskTime && <span className="text-[10px] font-mono hidden sm:inline">{newTaskTime}</span>}
              </button>

              <button
                type="submit"
                disabled={!newTaskTitle.trim()}
                className="p-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl transition-all shrink-0 cursor-pointer shadow-sm active:scale-95"
                title="কাজ যোগ করুন (Enter)"
                aria-label="Add task"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Intuitive Time-Block & Reminder Picker */}
            {showTimeInput && (
              <div className="bg-slate-100/95 dark:bg-slate-850 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2.5 animate-in fade-in duration-150 shadow-inner">
                {/* Time row */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">শুরু:</span>
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1">
                      <Clock className="w-3 h-3 text-sky-500 shrink-0" />
                      <input
                        type="time"
                        onChange={(e) => setNewTaskTime(formatTime24to12(e.target.value))}
                        className="text-xs bg-transparent focus:outline-none cursor-pointer"
                        title="ঘড়ির কাঁটা থেকে সময় বাছুন"
                      />
                      <input
                        type="text"
                        value={newTaskTime}
                        onChange={(e) => setNewTaskTime(e.target.value)}
                        placeholder="09:00 AM"
                        className="w-20 text-xs font-mono font-bold bg-transparent border-none focus:outline-none text-slate-900 dark:text-white"
                      />
                    </div>

                    <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">শেষ:</span>
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1">
                      <input
                        type="time"
                        onChange={(e) => setNewTaskEndTime(formatTime24to12(e.target.value))}
                        className="text-xs bg-transparent focus:outline-none cursor-pointer"
                        title="কাজের সমাপ্তি সময়"
                      />
                      <input
                        type="text"
                        value={newTaskEndTime}
                        onChange={(e) => setNewTaskEndTime(e.target.value)}
                        placeholder="10:00 AM"
                        className="w-20 text-xs font-mono font-bold bg-transparent border-none focus:outline-none text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Reminder Toggle */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const next = !newTaskReminder;
                        setNewTaskReminder(next);
                        if (next && 'Notification' in window && Notification.permission !== 'granted') {
                          Notification.requestPermission();
                        }
                      }}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        newTaskReminder
                          ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 shadow-2xs'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-amber-300'
                      }`}
                      title="কাজের সময় হলে অ্যালার্ট নোটিফিকেশন বাজবে"
                    >
                      <Bell className={`w-3.5 h-3.5 ${newTaskReminder ? 'fill-current text-amber-600 animate-pulse' : ''}`} />
                      <span>{newTaskReminder ? 'অ্যালার্ট অন 🔔' : 'অ্যালার্ট সেট'}</span>
                    </button>

                    {newTaskReminder && (
                      <select
                        value={newTaskReminderTiming}
                        onChange={(e) => setNewTaskReminderTiming(e.target.value as 'exact' | '5m' | '10m' | '15m')}
                        className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-800 dark:text-slate-200 font-medium cursor-pointer focus:outline-none"
                      >
                        <option value="exact">কাজের শুরুতে</option>
                        <option value="5m">৫ মিনিট আগে</option>
                        <option value="10m">১০ মিনিট আগে</option>
                        <option value="15m">১৫ মিনিট আগে</option>
                      </select>
                    )}
                  </div>
                </div>

                {/* Quick 1-tap time slots by day period */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200/70 dark:border-slate-700/60">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase font-mono">
                    <SunMedium className="w-3 h-3 text-amber-500" />
                    <span>দ্রুত সময় বাছুন:</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      { label: '07:00 AM', tag: '🌅 ৭:০০ সকাল' },
                      { label: '08:30 AM', tag: '☕ ৮:৩০ সকাল' },
                      { label: '10:00 AM', tag: '⚡ ১০:০০ সকাল' },
                      { label: '12:30 PM', tag: '☀️ ১২:৩০ দুপুর' },
                      { label: '02:30 PM', tag: '📖 ২:৩০ দুপুর' },
                      { label: '05:00 PM', tag: '🌆 ৫:০০ বিকাল' },
                      { label: '07:30 PM', tag: '🌙 ৭:৩০ সন্ধ্যা' },
                      { label: '09:30 PM', tag: '✨ ৯:৩০ রাত' },
                      { label: '11:00 PM', tag: '🛏️ ১১:০০ রাত' },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setNewTaskTime(preset.label);
                          if (!newTaskEndTime) {
                            setNewTaskEndTime(calculateEndTime(preset.label, 60));
                          }
                        }}
                        className={`text-[10px] px-2 py-1 rounded-md font-mono font-bold transition-all cursor-pointer ${
                          newTaskTime === preset.label
                            ? 'bg-sky-500 text-white shadow-xs scale-105'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-sky-400'
                        }`}
                      >
                        {preset.tag}
                      </button>
                    ))}
                  </div>

                  {/* Duration shortcuts */}
                  {newTaskTime && (
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">স্থায়িত্ব:</span>
                      {[
                        { mins: 30, label: '+৩০ মি' },
                        { mins: 45, label: '+৪৫ মি' },
                        { mins: 60, label: '+১ ঘণ্টা' },
                        { mins: 90, label: '+১.৫ ঘণ্টা' },
                        { mins: 120, label: '+২ ঘণ্টা' },
                      ].map((dur) => (
                        <button
                          key={dur.mins}
                          type="button"
                          onClick={() => setNewTaskEndTime(calculateEndTime(newTaskTime, dur.mins))}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-750 text-slate-700 dark:text-slate-300 hover:bg-sky-100 hover:text-sky-800 dark:hover:bg-sky-950 font-mono font-medium transition-colors cursor-pointer"
                        >
                          {dur.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
