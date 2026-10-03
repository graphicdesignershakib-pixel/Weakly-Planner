import React, { useState, useMemo } from 'react';
import { DayPlan, DayInfo, DayMood, DayPrayers, Task } from '../types/planner';
import { DayCard } from './DayCard';
import {
  CalendarDays,
  Clock,
  Bell,
  Check,
  ChevronRight,
  Sparkles,
  Calendar,
  Layers,
  Plus,
  Volume2,
  AlertCircle,
  CheckCircle2,
  SunMedium,
  Sunset,
  Moon,
  Smartphone,
  CalendarPlus,
} from 'lucide-react';
import { playReminderAlarmSound } from '../utils/soundEffects';
import { createGoogleCalendarUrl } from '../utils/calendarSync';
import { PhoneEmailAlertModal } from './PhoneEmailAlertModal';

interface DailyPlannerProps {
  daysInfo: DayInfo[];
  days: DayPlan[];
  activeDayIndex: number | null;
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
  onPostponeTask?: (dayIndex: number, taskId: string) => void;
  onDuplicateTask?: (dayIndex: number, taskId: string) => void;
  onClearCompletedTasks?: (dayIndex: number) => void;
  onTriggerTestReminder?: () => void;
  onToggleMinimumDay?: (dayIndex: number) => void;
  onUpdateThreeTasks?: (
    dayIndex: number,
    threeTasks: {
      must: string;
      mustDone: boolean;
      should: string;
      shouldDone: boolean;
      could: string;
      couldDone: boolean;
    }
  ) => void;
  onOpenSocialControl?: (dayIndex: number) => void;
  onOpenRestartProtocol?: (dayIndex: number) => void;
}

// Convert "09:30 AM" or "14:00" to minutes from 00:00
const parseTimeToMinutes = (timeStr: string): number | null => {
  if (!timeStr) return null;
  const cleaned = timeStr.trim().toUpperCase();
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

  return hours * 60 + minutes;
};

// Hourly block structure for Time-Blocking view (06:00 AM to 11:00 PM)
const TIME_SLOTS = [
  { hour: 6, label: '06:00 AM', period: 'সকাল', icon: '🌅' },
  { hour: 7, label: '07:00 AM', period: 'সকাল', icon: '🌅' },
  { hour: 8, label: '08:00 AM', period: 'সকাল', icon: '☕' },
  { hour: 9, label: '09:00 AM', period: 'সকাল', icon: '⚡' },
  { hour: 10, label: '10:00 AM', period: 'সকাল', icon: '⚡' },
  { hour: 11, label: '11:00 AM', period: 'সকাল', icon: '📖' },
  { hour: 12, label: '12:00 PM', period: 'দুপুর', icon: '☀️' },
  { hour: 13, label: '01:00 PM', period: 'দুপুর', icon: '🍽️' },
  { hour: 14, label: '02:00 PM', period: 'দুপুর', icon: '💻' },
  { hour: 15, label: '03:00 PM', period: 'দুপুর', icon: '💻' },
  { hour: 16, label: '04:00 PM', period: 'বিকাল', icon: '☕' },
  { hour: 17, label: '05:00 PM', period: 'বিকাল', icon: '🌆' },
  { hour: 18, label: '06:00 PM', period: 'সন্ধ্যা', icon: '🌇' },
  { hour: 19, label: '07:00 PM', period: 'সন্ধ্যা', icon: '🕌' },
  { hour: 20, label: '08:00 PM', period: 'রাত', icon: '🌙' },
  { hour: 21, label: '09:00 PM', period: 'রাত', icon: '📚' },
  { hour: 22, label: '10:00 PM', period: 'রাত', icon: '✨' },
  { hour: 23, label: '11:00 PM', period: 'রাত', icon: '🛏️' },
];

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
  onTriggerTestReminder,
  onToggleMinimumDay,
  onUpdateThreeTasks,
  onOpenSocialControl,
  onOpenRestartProtocol,
}) => {
  // Mode switcher: 'cards' (7 Days Grid) vs 'schedule' (Hourly Timeline Time-Blocking)
  const [plannerMode, setPlannerMode] = useState<'cards' | 'schedule'>('cards');

  // Selected day for the timeline view
  const defaultSelectedDay = useMemo(() => {
    const today = daysInfo.find((d) => d.isToday);
    return today ? today.dayIndex : 0;
  }, [daysInfo]);

  const [selectedTimelineDay, setSelectedTimelineDay] = useState<number>(defaultSelectedDay);

  // Quick add dialog for an hour slot in timeline mode
  const [slotQuickAddHour, setSlotQuickAddHour] = useState<string | null>(null);
  const [slotQuickAddTitle, setSlotQuickAddTitle] = useState('');
  const [slotQuickAddReminder, setSlotQuickAddReminder] = useState(true);
  const [isPhoneAlertModalOpen, setIsPhoneAlertModalOpen] = useState(false);

  // Current system time in minutes for timeline live-marker
  const [currentTimeMins, setCurrentTimeMins] = useState<number>(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTimeMins(now.getHours() * 60 + now.getMinutes());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const activeDayInfo = daysInfo[selectedTimelineDay] || daysInfo[0];
  const activeDayPlan = days[selectedTimelineDay];
  const activeDayTasks = activeDayPlan?.tasks || [];

  // Tasks with time for the selected day, sorted
  const scheduledTasks = useMemo(() => {
    return activeDayTasks
      .filter((t) => t.time)
      .sort((a, b) => (parseTimeToMinutes(a.time || '') || 0) - (parseTimeToMinutes(b.time || '') || 0));
  }, [activeDayTasks]);

  // Tasks without time
  const unscheduledTasks = useMemo(() => {
    return activeDayTasks.filter((t) => !t.time);
  }, [activeDayTasks]);

  const scheduledCompletedCount = scheduledTasks.filter((t) => t.completed).length;
  const scheduledProgress = scheduledTasks.length > 0
    ? Math.round((scheduledCompletedCount / scheduledTasks.length) * 100)
    : 0;

  // Handle slot task creation
  const handleCreateSlotTask = (hourLabel: string) => {
    if (!slotQuickAddTitle.trim()) return;
    onAddTask(
      selectedTimelineDay,
      slotQuickAddTitle.trim(),
      hourLabel,
      slotQuickAddReminder,
      undefined,
      'exact'
    );
    setSlotQuickAddTitle('');
    setSlotQuickAddHour(null);
  };

  // Notification status check
  const hasNotificationSupport = typeof window !== 'undefined' && 'Notification' in window;
  const notificationPermission = hasNotificationSupport ? Notification.permission : 'denied';

  const requestNotificationPermission = () => {
    if (hasNotificationSupport && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  };

  return (
    <section aria-labelledby="daily-planner-heading" className="space-y-4">
      {/* Top Header & Mode Toggle Bar */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-gradient-to-tr from-sky-600 via-indigo-600 to-purple-600 text-white rounded-xl shadow-xs">
            <CalendarDays className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 id="daily-planner-heading" className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                দৈনিক প্ল্যানার ও টাইম-ব্লকিং শিডিউলার
              </h2>
              <span className="text-[10px] font-mono font-bold bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 px-2 py-0.5 rounded-full border border-sky-300 dark:border-sky-800">
                স্মার্ট অ্যালার্ট সহ
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              কখন কোন কাজটি করবেন সময় ও অ্যালার্ট সেট করে ক্রমানুসারে সাজান
            </p>
          </div>
        </div>

        {/* View Mode Toggle & Reminder Utilities */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Notification Permission Indicator / Button */}
          {hasNotificationSupport && (
            <button
              type="button"
              onClick={requestNotificationPermission}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                notificationPermission === 'granted'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 animate-pulse'
              }`}
              title={notificationPermission === 'granted' ? 'ব্রাউজার পুশ নোটিফিকেশন সচল আছে' : 'ব্রাউজার নোটিফিকেশন অনুমোদন দিন'}
            >
              <Bell className="w-3.5 h-3.5 fill-current" />
              <span>{notificationPermission === 'granted' ? 'অ্যালার্ট সচল ✓' : 'নোটিফিকেশন অনুমতি দিন'}</span>
            </button>
          )}

          {/* Test Sound / Reminder Chime */}
          <button
            type="button"
            onClick={() => {
              playReminderAlarmSound();
              if (onTriggerTestReminder) {
                onTriggerTestReminder();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
            title="অ্যালার্ট সাউন্ড ও পপআপ টেস্ট করুন"
          >
            <Volume2 className="w-3.5 h-3.5 text-indigo-500" />
            <span>শব্দ টেস্ট</span>
          </button>

          {/* Phone & Email Alert Modal Button */}
          <button
            type="button"
            onClick={() => setIsPhoneAlertModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            title="মোবাইল ও ইমেইলে অ্যালার্ম ও নোটিফিকেশন সেটআপ"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>📱 ফোনে ও মেইলে এলার্ট</span>
          </button>

          {/* Mode Switcher Tabs */}
          <div className="bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl flex items-center border border-slate-200/80 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setPlannerMode('cards')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                plannerMode === 'cards'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-sky-500" />
              <span>৭ দিনের কার্ড</span>
            </button>

            <button
              type="button"
              onClick={() => setPlannerMode('schedule')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                plannerMode === 'schedule'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>দৈনিক টাইম-ব্লকিং শিডিউল</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODE 1: HOURLY TIME-BLOCKING TIMELINE */}
      {plannerMode === 'schedule' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Day Selector Pill Navigation */}
          <div className="bg-white dark:bg-[#111827] p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between gap-2 overflow-x-auto">
            <div className="flex items-center gap-1.5">
              {daysInfo.map((info) => {
                const isSelected = selectedTimelineDay === info.dayIndex;
                const dPlan = days[info.dayIndex];
                const countWithTime = (dPlan?.tasks || []).filter((t) => t.time).length;

                return (
                  <button
                    key={info.dayIndex}
                    type="button"
                    onClick={() => setSelectedTimelineDay(info.dayIndex)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                      isSelected
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60'
                    }`}
                  >
                    <span>{info.dayName}</span>
                    {info.isToday && (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-black ${
                        isSelected ? 'bg-amber-400 text-slate-900' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        আজ
                      </span>
                    )}
                    {countWithTime > 0 && (
                      <span className={`text-[10px] px-1.5 rounded-full font-mono ${
                        isSelected ? 'bg-white/20 dark:bg-black/20' : 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300'
                      }`}>
                        {countWithTime}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Sort Button */}
            {onSortTasksByTime && (
              <button
                type="button"
                onClick={() => onSortTasksByTime(selectedTimelineDay)}
                className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 px-3 py-1.5 rounded-xl border border-sky-200 dark:border-sky-800 shrink-0 cursor-pointer"
                title="সময় অনুযায়ী ক্রমানুসারে সাজান"
              >
                <Clock className="w-3.5 h-3.5 text-sky-500" />
                <span>সময় অনুযায়ী সাজান</span>
              </button>
            )}
          </div>

          {/* Schedule Summary Banner */}
          <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 dark:from-sky-950/30 dark:via-indigo-950/20 dark:to-purple-950/30 p-4 rounded-2xl border border-sky-200/80 dark:border-sky-800/40 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center border border-sky-200 dark:border-sky-800 shadow-2xs font-mono font-black text-sky-600 dark:text-sky-400 text-sm">
                {scheduledProgress}%
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{activeDayInfo.dayName}-এর শিডিউল ({activeDayInfo.formattedDate})</span>
                  {activeDayInfo.isToday && (
                    <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                      লাইভ শিডিউল
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  মোট {scheduledTasks.length}টি সময়-নির্ধারিত কাজের মধ্যে {scheduledCompletedCount}টি সম্পন্ন হয়েছে
                </p>
              </div>
            </div>

            {/* Unscheduled tasks quick notification */}
            {unscheduledTasks.length > 0 && (
              <div className="text-xs text-slate-500 bg-white/80 dark:bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                📌 আরো {unscheduledTasks.length}টি কাজের নির্দিষ্ট সময় দেওয়া হয়নি (কার্ড ভিউতে দেখুন)
              </div>
            )}
          </div>

          {/* Hourly Timeline Matrix */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800/70 overflow-hidden">
            {TIME_SLOTS.map((slot) => {
              const slotMinsStart = slot.hour * 60;
              const slotMinsEnd = (slot.hour + 1) * 60;

              // Find tasks scheduled in this hour
              const slotTasks = scheduledTasks.filter((t) => {
                const tMins = parseTimeToMinutes(t.time || '');
                if (tMins === null) return false;
                return tMins >= slotMinsStart && tMins < slotMinsEnd;
              });

              // Check if current time is inside this slot (if viewing Today)
              const isCurrentHour = activeDayInfo.isToday && currentTimeMins >= slotMinsStart && currentTimeMins < slotMinsEnd;

              return (
                <div
                  key={slot.hour}
                  className={`p-3 transition-colors relative flex items-start gap-4 ${
                    isCurrentHour
                      ? 'bg-sky-50/60 dark:bg-sky-950/20'
                      : 'hover:bg-slate-50/60 dark:hover:bg-slate-900/40'
                  }`}
                >
                  {/* Current Time Red Marker Line */}
                  {isCurrentHour && (
                    <div
                      className="absolute left-0 right-0 h-0.5 bg-rose-500 z-10 flex items-center justify-end pr-4 pointer-events-none"
                      style={{
                        top: `${Math.min(95, Math.max(5, ((currentTimeMins - slotMinsStart) / 60) * 100))}%`,
                      }}
                    >
                      <span className="text-[9px] font-mono font-bold text-white bg-rose-600 px-1.5 py-0.5 rounded shadow-sm">
                        এখন
                      </span>
                    </div>
                  )}

                  {/* Left Hour Column */}
                  <div className="w-24 shrink-0 flex flex-col">
                    <span className="text-xs font-mono font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                      <span>{slot.icon}</span>
                      <span>{slot.label}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {slot.period}
                    </span>
                  </div>

                  {/* Middle Tasks & Slot Content */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    {slotTasks.length === 0 ? (
                      <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 py-1">
                        <span className="italic">এই সময়ে কোনো শিডিউল নেই</span>
                        <button
                          type="button"
                          onClick={() => {
                            setSlotQuickAddHour(slot.label);
                            setSlotQuickAddTitle('');
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>কাজ যোগ করুন</span>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {slotTasks.map((task) => (
                          <div
                            key={task.id}
                            className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                              task.completed
                                ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-70'
                                : 'bg-white dark:bg-slate-850 border-sky-200 dark:border-sky-800 shadow-2xs hover:border-sky-400'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <button
                                type="button"
                                onClick={() => onToggleTask(selectedTimelineDay, task.id)}
                                className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                                  task.completed
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900'
                                    : 'border-slate-300 dark:border-slate-600 hover:border-slate-500'
                                }`}
                              >
                                {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                              </button>

                              <div className="min-w-0">
                                <span className={`text-xs font-bold block truncate ${
                                  task.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                                }`}>
                                  {task.title}
                                </span>
                                <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 font-bold block">
                                  {task.time}{task.endTime ? ` - ${task.endTime}` : ''}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {task.reminder ? (
                                <button
                                  type="button"
                                  onClick={() => onToggleReminder?.(selectedTimelineDay, task.id)}
                                  className="p-1 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded-md cursor-pointer shadow-2xs"
                                  title="রিমাইন্ডার সচল (ক্লিক করে বন্ধ করুন)"
                                >
                                  <Bell className="w-3 h-3 fill-current animate-pulse" />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => onToggleReminder?.(selectedTimelineDay, task.id)}
                                  className="p-1 text-slate-400 hover:text-amber-600 rounded-md cursor-pointer"
                                  title="রিমাইন্ডার অন করুন"
                                >
                                  <Bell className="w-3 h-3" />
                                </button>
                              )}

                              {/* Google Calendar Sync Button */}
                              <a
                                href={createGoogleCalendarUrl(task.title, activeDayInfo.dateStr, task.time, task.endTime, activeDayInfo.dayName)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 rounded-md cursor-pointer hover:bg-sky-50 dark:hover:bg-sky-950 transition-colors"
                                title="গুগল ক্যালেন্ডারে যোগ করুন (ফোনে অ্যালার্ম ও মেইল আসবে)"
                              >
                                <CalendarPlus className="w-3 h-3 text-sky-500" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Inline Quick Add Input for this slot */}
                    {slotQuickAddHour === slot.label && (
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-sky-300 dark:border-sky-700 flex items-center gap-2 animate-in fade-in duration-150">
                        <input
                          type="text"
                          value={slotQuickAddTitle}
                          onChange={(e) => setSlotQuickAddTitle(e.target.value)}
                          placeholder={`${slot.label}-এ কী করবেন লিখুন...`}
                          className="flex-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-900 dark:text-white focus:outline-none"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCreateSlotTask(slot.label);
                            if (e.key === 'Escape') setSlotQuickAddHour(null);
                          }}
                        />

                        <button
                          type="button"
                          onClick={() => setSlotQuickAddReminder(!slotQuickAddReminder)}
                          className={`p-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                            slotQuickAddReminder
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-white text-slate-600 border-slate-200'
                          }`}
                          title="অ্যালার্ট সেট"
                        >
                          <Bell className={`w-3.5 h-3.5 ${slotQuickAddReminder ? 'fill-current text-amber-600' : ''}`} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCreateSlotTask(slot.label)}
                          className="px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-lg cursor-pointer shadow-xs"
                        >
                          যোগ করুন
                        </button>
                        <button
                          type="button"
                          onClick={() => setSlotQuickAddHour(null)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 2: WEEKLY 7-DAY CARDS GRID */}
      {plannerMode === 'cards' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in duration-200">
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
                onToggleReminder={onToggleReminder}
                onSortTasksByTime={onSortTasksByTime}
                onUpdateNote={onUpdateNote}
                onUpdateMood={onUpdateMood}
                onTogglePrayer={onTogglePrayer}
                onUpdateWater={onUpdateWater}
                onUpdateWin={onUpdateWin}
                onPostponeTask={onPostponeTask}
                onDuplicateTask={onDuplicateTask}
                onClearCompletedTasks={onClearCompletedTasks}
                onToggleMinimumDay={onToggleMinimumDay}
                onUpdateThreeTasks={onUpdateThreeTasks}
                onOpenSocialControl={onOpenSocialControl}
                onOpenRestartProtocol={onOpenRestartProtocol}
              />
            );
          })}
        </div>
      )}

      {/* Phone & Email Alert Modal */}
      <PhoneEmailAlertModal
        isOpen={isPhoneAlertModalOpen}
        onClose={() => setIsPhoneAlertModalOpen(false)}
        tasks={activeDayTasks}
        dateStr={activeDayInfo.dateStr}
        dayName={activeDayInfo.dayName}
      />
    </section>
  );
};
