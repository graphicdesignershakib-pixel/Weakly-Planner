/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { MotivationalBanner } from './components/MotivationalBanner';
import { DailyVerseCard } from './components/DailyVerseCard';
import { WaterTracker } from './components/WaterTracker';
import { BadgesShowcase } from './components/BadgesShowcase';
import { PomodoroTimer } from './components/PomodoroTimer';
import { LifeBalanceScore } from './components/LifeBalanceScore';
import { WeeklyFocusReward } from './components/WeeklyFocusReward';
import { WeeklyStatsSummary } from './components/WeeklyStatsSummary';
import { WeekNavigation } from './components/WeekNavigation';
import { DailyPlanner } from './components/DailyPlanner';
import { MasterTodoList } from './components/MasterTodoList';
import { HabitTracker } from './components/HabitTracker';
import { MonthlyAestheticHabitTracker } from './components/MonthlyAestheticHabitTracker';
import { GoalsSection } from './components/GoalsSection';
import { WeeklyReview } from './components/WeeklyReview';
import { ResetModal } from './components/ResetModal';
import { BackupModal } from './components/BackupModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { PrintModal } from './components/PrintModal';
import { WeeklyAchievementCardModal } from './components/WeeklyAchievementCardModal';
import { UserProfileModal } from './components/UserProfileModal';
import { BoxBreathingModal } from './components/BoxBreathingModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { BrainDumpScratchpad } from './components/BrainDumpScratchpad';
import { DailyRitualsModal } from './components/DailyRitualsModal';
import { FutureLettersModal } from './components/FutureLettersModal';
import { WeeklyWrappedModal } from './components/WeeklyWrappedModal';
import { UserManualModal } from './components/UserManualModal';
import { NavigationTabs, PlannerViewMode } from './components/NavigationTabs';
import {
  PlannerState,
  WeeklyReview as WeeklyReviewType,
  HabitCategory,
  MasterTodo,
  LongTermGoal,
  ShortTermGoal,
  DayMood,
  DayPrayers,
  UserProfile,
  ThemeType,
  ScratchNote,
  Task,
} from './types/planner';
import {
  getMondayOfWeek,
  shiftWeekStart,
  getWeekDaysInfo,
} from './utils/dateUtils';
import { plannerStorage } from './storage/plannerStorage';
import { playTaskCompleteSound, playReminderAlarmSound } from './utils/soundEffects';
import { fireConfetti } from './utils/confetti';
import { downloadIcsFile } from './utils/icsExport';
import { Sparkles, Bell, Check } from 'lucide-react';

const ENCOURAGING_MESSAGES = [
  '🔥 Fantastic work! Momentum is building!',
  '💪 Another victory achieved! Keep pushing!',
  '✨ Pure discipline! You are doing amazing!',
  '🎯 Focus leads to mastery! Great job!',
  '⚡ Unstoppable energy! Crushing your goals today!',
  '🌟 Every small step leads to massive results!',
];

export default function App() {
  const initialWeekStart = useMemo(() => {
    const savedLast = plannerStorage.getLastActiveWeek();
    if (savedLast) return savedLast;
    return getMondayOfWeek(new Date());
  }, []);

  const [currentWeekStart, setCurrentWeekStart] = useState<string>(initialWeekStart);
  const [plannerState, setPlannerState] = useState<PlannerState>(() =>
    plannerStorage.load(initialWeekStart)
  );

  // Live auto-update check for day and week changes at midnight or interval
  useEffect(() => {
    // Check every 30 seconds if day or week has rolled over to auto-highlight today & update week if on current week
    const checkInterval = setInterval(() => {
      const liveMonday = getMondayOfWeek(new Date());
      // If user is currently viewing what was current week, keep them in sync
      const savedLast = plannerStorage.getLastActiveWeek();
      if (!savedLast) {
        setCurrentWeekStart((prev) => {
          if (prev !== liveMonday) {
            setPlannerState(plannerStorage.load(liveMonday));
            return liveMonday;
          }
          return prev;
        });
      }
    }, 30000);

    return () => clearInterval(checkInterval);
  }, []);

  // User Profile personalization
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('weekly_planner_user_profile');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return { name: 'Shakib', tagline: 'Creator & Architect' };
  });

  const handleSaveProfile = useCallback((profile: UserProfile) => {
    setUserProfile(profile);
    try {
      localStorage.setItem('weekly_planner_user_profile', JSON.stringify(profile));
    } catch {
      // ignore
    }
    setToastMessage(`Welcome, ${profile.name}! Profile updated ✨`);
    setTimeout(() => setToastMessage(null), 2500);
  }, []);

  const [activeDayIndex, setActiveDayIndex] = useState<number | null>(null);
  const [lastSavedText, setLastSavedText] = useState<string>('just now');
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isBreathingModalOpen, setIsBreathingModalOpen] = useState<boolean>(false);
  const [isRitualsModalOpen, setIsRitualsModalOpen] = useState<boolean>(false);
  const [isLettersModalOpen, setIsLettersModalOpen] = useState<boolean>(false);
  const [isWrappedModalOpen, setIsWrappedModalOpen] = useState<boolean>(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [backupModalMode, setBackupModalMode] = useState<'export' | 'import' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentNavTab, setCurrentNavTab] = useState<PlannerViewMode>('monthly');

  // Aesthetic Color Theme
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(() => {
    try {
      const saved = localStorage.getItem('weekly_planner_color_theme') as ThemeType;
      if (['minimal', 'sage', 'latte', 'obsidian'].includes(saved)) return saved;
    } catch {
      // ignore
    }
    return 'minimal';
  });

  useEffect(() => {
    document.body.classList.remove('theme-sage', 'theme-latte', 'theme-obsidian');
    if (currentTheme !== 'minimal') {
      document.body.classList.add(`theme-${currentTheme}`);
    }
    try {
      localStorage.setItem('weekly_planner_color_theme', currentTheme);
    } catch {
      // ignore
    }
  }, [currentTheme]);

  // Scratchpad / Brain Dump state
  const [scratchNotes, setScratchNotes] = useState<ScratchNote[]>(() => {
    try {
      const saved = localStorage.getItem('weekly_planner_scratch_notes');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const handleAddScratchNote = useCallback((content: string) => {
    const newNote: ScratchNote = {
      id: `sn-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      content,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setScratchNotes((prev) => {
      const updated = [newNote, ...prev];
      localStorage.setItem('weekly_planner_scratch_notes', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleDeleteScratchNote = useCallback((id: string) => {
    setScratchNotes((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      localStorage.setItem('weekly_planner_scratch_notes', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('weekly_planner_dark_mode') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('weekly_planner_dark_mode', isDarkMode ? 'true' : 'false');
    } catch {
      // ignore
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Show random encouraging toast
  const triggerEncouragement = useCallback(() => {
    const randomMsg = ENCOURAGING_MESSAGES[Math.floor(Math.random() * ENCOURAGING_MESSAGES.length)];
    setToastMessage(randomMsg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  // Persist state to storage on every state mutation
  useEffect(() => {
    plannerStorage.save(plannerState);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastSavedText(`at ${timeStr}`);
  }, [plannerState]);

  // Current live tick to keep isToday dynamically updated across midnight
  const [liveDateTick, setLiveDateTick] = useState<string>(() => new Date().toISOString().split('T')[0]);
  useEffect(() => {
    const timer = setInterval(() => {
      const todayStr = new Date().toISOString().split('T')[0];
      setLiveDateTick((prev) => (prev !== todayStr ? todayStr : prev));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Days metadata for the active week (re-evaluates automatically when date ticks)
  const daysInfo = useMemo(() => getWeekDaysInfo(currentWeekStart), [currentWeekStart, liveDateTick]);

  // Navigation handlers
  const handlePrevWeek = useCallback(() => {
    const prev = shiftWeekStart(currentWeekStart, -1);
    setCurrentWeekStart(prev);
    setPlannerState(plannerStorage.load(prev));
    setActiveDayIndex(null);
  }, [currentWeekStart]);

  const handleNextWeek = useCallback(() => {
    const next = shiftWeekStart(currentWeekStart, 1);
    setCurrentWeekStart(next);
    setPlannerState(plannerStorage.load(next));
    setActiveDayIndex(null);
  }, [currentWeekStart]);

  const handleCurrentWeek = useCallback(() => {
    const current = getMondayOfWeek(new Date());
    setCurrentWeekStart(current);
    setPlannerState(plannerStorage.load(current));
    setActiveDayIndex(null);
  }, []);

  const handleSelectDay = useCallback((index: number) => {
    setActiveDayIndex(index);
    const element = document.getElementById(`day-card-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, []);

  // Print Handler
  const handlePrint = useCallback(() => {
    setIsPrintModalOpen(true);
  }, []);

  // Weekly Focus & Reward handlers
  const handleUpdateFocus = useCallback((focus: string, objective?: string) => {
    setPlannerState((prev) => ({
      ...prev,
      focus,
      objective,
    }));
  }, []);

  const handleUpdateReward = useCallback((reward: string) => {
    setPlannerState((prev) => ({
      ...prev,
      reward,
    }));
  }, []);

  // Helper to ensure days array has 7 initialized elements
  const ensureDays = useCallback(
    (days: PlannerState['days']) => {
      if (days && days.length === 7) return days;
      return daysInfo.map((info, idx) => {
        const existing = days?.[idx] || days?.find((d) => d.date === info.dateStr);
        return (
          existing || {
            date: info.dateStr,
            note: '',
            tasks: [],
            waterGlasses: 0,
            winOfTheDay: '',
          }
        );
      });
    },
    [daysInfo]
  );

  // Daily Task handlers with time-blocking
  const handleToggleTask = useCallback(
    (dayIndex: number, taskId: string) => {
      setPlannerState((prev) => {
        const days = ensureDays(prev.days);
        const day = days[dayIndex];
        const task = day?.tasks.find((t) => t.id === taskId);
        if (task && !task.completed) {
          triggerEncouragement();
        }

        return {
          ...prev,
          days: days.map((d, idx) => {
            if (idx !== dayIndex) return d;
            return {
              ...d,
              tasks: d.tasks.map((t) =>
                t.id === taskId ? { ...t, completed: !t.completed } : t
              ),
            };
          }),
        };
      });
    },
    [ensureDays, triggerEncouragement]
  );

  const handleAddTask = useCallback(
    (
      dayIndex: number,
      title: string,
      time?: string,
      reminder?: boolean,
      endTime?: string,
      reminderTiming?: 'exact' | '5m' | '10m' | '15m'
    ) => {
      const newTask = {
        id: `task-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        title,
        completed: false,
        priority: 'normal' as const,
        time,
        endTime,
        reminder: reminder ?? false,
        reminderTiming: reminderTiming || 'exact',
      };

      setPlannerState((prev) => {
        const days = ensureDays(prev.days);
        return {
          ...prev,
          days: days.map((day, idx) => {
            if (idx !== dayIndex) return day;
            return {
              ...day,
              tasks: [...day.tasks, newTask],
            };
          }),
        };
      });
    },
    [ensureDays]
  );

  const handleEditTask = useCallback(
    (
      dayIndex: number,
      taskId: string,
      newTitle: string,
      newTime?: string,
      reminder?: boolean,
      newEndTime?: string,
      reminderTiming?: 'exact' | '5m' | '10m' | '15m'
    ) => {
      setPlannerState((prev) => {
        const days = ensureDays(prev.days);
        return {
          ...prev,
          days: days.map((day, idx) => {
            if (idx !== dayIndex) return day;
            return {
              ...day,
              tasks: day.tasks.map((task) =>
                task.id === taskId
                  ? {
                      ...task,
                      title: newTitle,
                      time: newTime,
                      endTime: newEndTime !== undefined ? newEndTime : task.endTime,
                      reminder: reminder !== undefined ? reminder : task.reminder,
                      reminderTiming: reminderTiming !== undefined ? reminderTiming : task.reminderTiming,
                      reminderNotified: false,
                    }
                  : task
              ),
            };
          }),
        };
      });
    },
    [ensureDays]
  );

  const handleToggleReminder = useCallback(
    (dayIndex: number, taskId: string) => {
      setPlannerState((prev) => {
        const days = ensureDays(prev.days);
        return {
          ...prev,
          days: days.map((day, idx) => {
            if (idx !== dayIndex) return day;
            return {
              ...day,
              tasks: day.tasks.map((task) => {
                if (task.id !== taskId) return task;
                const willRemind = !task.reminder;
                if (willRemind && 'Notification' in window && Notification.permission !== 'granted') {
                  Notification.requestPermission();
                }
                return { ...task, reminder: willRemind, reminderNotified: false };
              }),
            };
          }),
        };
      });
      setToastMessage('🔔 রিমাইন্ডার অ্যালার্ট আপডেট করা হয়েছে');
      setTimeout(() => setToastMessage(null), 2000);
    },
    [ensureDays]
  );

  const handleSortTasksByTime = useCallback(
    (dayIndex: number) => {
      setPlannerState((prev) => {
        const days = ensureDays(prev.days);
        return {
          ...prev,
          days: days.map((day, idx) => {
            if (idx !== dayIndex) return day;
            const sortedTasks = [...day.tasks].sort((a, b) => {
              if (!a.time && !b.time) return 0;
              if (!a.time) return 1;
              if (!b.time) return -1;
              return a.time.localeCompare(b.time);
            });
            return { ...day, tasks: sortedTasks };
          }),
        };
      });
      setToastMessage('⏱️ সময় অনুযায়ী ক্রমানুসারে সাজানো হয়েছে!');
      setTimeout(() => setToastMessage(null), 2500);
    },
    [ensureDays]
  );

  const handleDeleteTask = useCallback(
    (dayIndex: number, taskId: string) => {
      setPlannerState((prev) => {
        const days = ensureDays(prev.days);
        return {
          ...prev,
          days: days.map((day, idx) => {
            if (idx !== dayIndex) return day;
            return {
              ...day,
              tasks: day.tasks.filter((task) => task.id !== taskId),
            };
          }),
        };
      });
    },
    [ensureDays]
  );

  const handleMoveTask = useCallback(
    (dayIndex: number, fromIndex: number, direction: 'up' | 'down') => {
      setPlannerState((prev) => {
        const days = ensureDays(prev.days);
        return {
          ...prev,
          days: days.map((day, idx) => {
            if (idx !== dayIndex) return day;
            const targetIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
            if (targetIndex < 0 || targetIndex >= day.tasks.length) return day;

            const updatedTasks = [...day.tasks];
            const [moved] = updatedTasks.splice(fromIndex, 1);
            updatedTasks.splice(targetIndex, 0, moved);

            return {
              ...day,
              tasks: updatedTasks,
            };
          }),
        };
      });
    },
    [ensureDays]
  );

  const handleTogglePriority = useCallback(
    (dayIndex: number, taskId: string) => {
      setPlannerState((prev) => {
        const days = ensureDays(prev.days);
        return {
          ...prev,
          days: days.map((day, idx) => {
            if (idx !== dayIndex) return day;
            return {
              ...day,
              tasks: day.tasks.map((task) =>
                task.id === taskId
                  ? {
                      ...task,
                      priority: task.priority === 'high' ? 'normal' : 'high',
                    }
                  : task
              ),
            };
          }),
        };
      });
    },
    [ensureDays]
  );

  const handlePostponeTask = useCallback(
    (dayIndex: number, taskId: string) => {
      setPlannerState((prev) => {
        const days = ensureDays(prev.days);
        const currentDay = days[dayIndex];
        const taskToMove = currentDay?.tasks.find((t) => t.id === taskId);
        if (!taskToMove) return prev;

        const nextDayIndex = (dayIndex + 1) % 7;
        const nextDayName = daysInfo[nextDayIndex]?.dayName || 'Tomorrow';

        setToastMessage(`✓ Postponed to ${nextDayName}!`);
        setTimeout(() => setToastMessage(null), 2500);

        return {
          ...prev,
          days: days.map((day, idx) => {
            if (idx === dayIndex) {
              return {
                ...day,
                tasks: day.tasks.filter((t) => t.id !== taskId),
              };
            }
            if (idx === nextDayIndex) {
              return {
                ...day,
                tasks: [...day.tasks, { ...taskToMove, completed: false }],
              };
            }
            return day;
          }),
        };
      });
    },
    [ensureDays, daysInfo]
  );

  const handleDuplicateTask = useCallback(
    (dayIndex: number, taskId: string) => {
      setPlannerState((prev) => {
        const days = ensureDays(prev.days);
        const currentDay = days[dayIndex];
        const taskToClone = currentDay?.tasks.find((t) => t.id === taskId);
        if (!taskToClone) return prev;

        const cloned = {
          ...taskToClone,
          id: `task-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
          title: `${taskToClone.title} (Copy)`,
          completed: false,
        };

        setToastMessage('✓ Duplicated task!');
        setTimeout(() => setToastMessage(null), 2000);

        return {
          ...prev,
          days: days.map((day, idx) =>
            idx === dayIndex ? { ...day, tasks: [...day.tasks, cloned] } : day
          ),
        };
      });
    },
    [ensureDays]
  );

  const handleClearCompletedTasks = useCallback(
    (dayIndex: number) => {
      setPlannerState((prev) => {
        const days = ensureDays(prev.days);
        const count = days[dayIndex]?.tasks.filter((t) => t.completed).length || 0;
        if (count > 0) {
          setToastMessage(`✓ Cleared ${count} completed tasks!`);
          setTimeout(() => setToastMessage(null), 2500);
        }
        return {
          ...prev,
          days: days.map((day, idx) =>
            idx === dayIndex ? { ...day, tasks: day.tasks.filter((t) => !t.completed) } : day
          ),
        };
      });
    },
    [ensureDays]
  );

  const handleUpdateNote = useCallback(
    (dayIndex: number, note: string) => {
      setPlannerState((prev) => {
        const days = ensureDays(prev.days);
        return {
          ...prev,
          days: days.map((day, idx) => (idx === dayIndex ? { ...day, note } : day)),
        };
      });
    },
    [ensureDays]
  );

  // Daily Mood check-in
  const handleUpdateMood = useCallback(
    (dayIndex: number, mood: DayMood) => {
      setPlannerState((prev) => {
        const days = ensureDays(prev.days);
        return {
          ...prev,
          days: days.map((day, idx) => (idx === dayIndex ? { ...day, mood } : day)),
        };
      });
    },
    [ensureDays]
  );

  // Daily 5 Prayers toggle
  const handleTogglePrayer = useCallback(
    (dayIndex: number, prayer: keyof DayPrayers) => {
      setPlannerState((prev) => {
        const days = ensureDays(prev.days);
        const day = days[dayIndex];
        const prevPrayers = day?.prayers || { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false };
        const willBeChecked = !prevPrayers[prayer];
        if (willBeChecked) {
          playTaskCompleteSound();
          triggerEncouragement();
        }
        return {
          ...prev,
          days: days.map((d, idx) => {
            if (idx !== dayIndex) return d;
            return {
              ...d,
              prayers: {
                ...prevPrayers,
                [prayer]: willBeChecked,
              },
            };
          }),
        };
      });
    },
    [ensureDays, triggerEncouragement]
  );

  // Daily Water Tracker update
  const handleUpdateWater = useCallback(
    (dayIndex: number, glasses: number) => {
      setPlannerState((prev) => {
        const days = ensureDays(prev.days);
        return {
          ...prev,
          days: days.map((d, idx) => (idx === dayIndex ? { ...d, waterGlasses: glasses } : d)),
        };
      });
    },
    [ensureDays]
  );

  // Daily Win of the Day
  const handleUpdateWin = useCallback(
    (dayIndex: number, win: string) => {
      setPlannerState((prev) => {
        const days = ensureDays(prev.days);
        return {
          ...prev,
          days: days.map((d, idx) => (idx === dayIndex ? { ...d, winOfTheDay: win } : d)),
        };
      });
      if (win.trim()) {
        fireConfetti();
        setToastMessage('🏆 Daily Win Recorded! Keep shining!');
        setTimeout(() => setToastMessage(null), 2500);
      }
    },
    [ensureDays]
  );

  // Habit Tracker handlers
  const handleToggleHabitDay = useCallback((habitId: string, dayIndex: number) => {
    setPlannerState((prev) => {
      const targetHabit = prev.habits.find((h) => h.id === habitId);
      const willBeChecked = targetHabit ? !targetHabit.completed[dayIndex] : false;

      if (willBeChecked) {
        playTaskCompleteSound();
      }

      return {
        ...prev,
        habits: prev.habits.map((habit) => {
          if (habit.id !== habitId) return habit;
          const newCompleted = [...habit.completed];
          newCompleted[dayIndex] = !newCompleted[dayIndex];
          return {
            ...habit,
            completed: newCompleted,
          };
        }),
      };
    });
  }, []);

  const handleAddHabit = useCallback((name: string, category: HabitCategory = 'health') => {
    const newHabit = {
      id: `habit-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      name,
      category,
      completed: [false, false, false, false, false, false, false],
    };

    setPlannerState((prev) => ({
      ...prev,
      habits: [...prev.habits, newHabit],
    }));
  }, []);

  const handleRenameHabit = useCallback((habitId: string, newName: string, category?: HabitCategory) => {
    setPlannerState((prev) => ({
      ...prev,
      habits: prev.habits.map((h) =>
        h.id === habitId
          ? { ...h, name: newName, category: category || h.category || 'health' }
          : h
      ),
    }));
  }, []);

  const handleDeleteHabit = useCallback((habitId: string) => {
    setPlannerState((prev) => ({
      ...prev,
      habits: prev.habits.filter((h) => h.id !== habitId),
    }));
  }, []);

  const handleMoveHabit = useCallback((fromIndex: number, direction: 'up' | 'down') => {
    setPlannerState((prev) => {
      const targetIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
      if (targetIndex < 0 || targetIndex >= prev.habits.length) return prev;

      const updated = [...prev.habits];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(targetIndex, 0, moved);

      return {
        ...prev,
        habits: updated,
      };
    });
  }, []);

  // Master To-Do Handlers
  const handleToggleTodo = useCallback((todoId: string) => {
    setPlannerState((prev) => {
      const todos = prev.masterTodos || [];
      const item = todos.find((t) => t.id === todoId);
      if (item && !item.completed) {
        playTaskCompleteSound();
        triggerEncouragement();
      }

      return {
        ...prev,
        masterTodos: todos.map((t) =>
          t.id === todoId ? { ...t, completed: !t.completed } : t
        ),
      };
    });
  }, [triggerEncouragement]);

  const handleAddTodo = useCallback(
    (title: string, priority: MasterTodo['priority'], category: MasterTodo['category']) => {
      const newTodo: MasterTodo = {
        id: `todo-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        title,
        completed: false,
        priority,
        category,
        createdAt: new Date().toISOString().split('T')[0],
      };

      setPlannerState((prev) => ({
        ...prev,
        masterTodos: [newTodo, ...(prev.masterTodos || [])],
      }));
    },
    []
  );

  const handleDeleteTodo = useCallback((id: string) => {
    setPlannerState((prev) => ({
      ...prev,
      masterTodos: (prev.masterTodos || []).filter((t) => t.id !== id),
    }));
  }, []);

  const handleAssignTodoToDay = useCallback(
    (todo: MasterTodo, dayIndex: number) => {
      handleAddTask(dayIndex, todo.title);
      setPlannerState((prev) => ({
        ...prev,
        masterTodos: (prev.masterTodos || []).map((t) =>
          t.id === todo.id ? { ...t, completed: true, assignedDayIndex: dayIndex } : t
        ),
      }));
      setToastMessage(`✓ Added to ${daysInfo[dayIndex]?.dayName || 'Day'}!`);
      setTimeout(() => setToastMessage(null), 2500);
    },
    [handleAddTask, daysInfo]
  );

  const handleClearCompletedTodos = useCallback(() => {
    setPlannerState((prev) => ({
      ...prev,
      masterTodos: (prev.masterTodos || []).filter((t) => !t.completed),
    }));
    setToastMessage('✓ Cleaned up completed backlog tasks!');
    setTimeout(() => setToastMessage(null), 2500);
  }, []);

  const handleEditTodo = useCallback(
    (
      id: string,
      newTitle: string,
      priority?: MasterTodo['priority'],
      category?: MasterTodo['category']
    ) => {
      setPlannerState((prev) => ({
        ...prev,
        masterTodos: (prev.masterTodos || []).map((t) =>
          t.id === id
            ? {
                ...t,
                title: newTitle,
                ...(priority ? { priority } : {}),
                ...(category ? { category } : {}),
              }
            : t
        ),
      }));
    },
    []
  );

  const handleMarkAllHabitsToday = useCallback(
    (dayIndex: number) => {
      setPlannerState((prev) => {
        const allChecked = prev.habits.every((h) => h.completed[dayIndex]);
        const newState = !allChecked;

        if (newState) {
          playTaskCompleteSound();
          triggerEncouragement();
          setToastMessage('🎉 All Habits Completed for Today! Unstoppable!');
          setTimeout(() => setToastMessage(null), 2500);
        } else {
          setToastMessage('Habits unchecked for today');
          setTimeout(() => setToastMessage(null), 2000);
        }

        return {
          ...prev,
          habits: prev.habits.map((habit) => {
            const newCompleted = [...habit.completed];
            newCompleted[dayIndex] = newState;
            return { ...habit, completed: newCompleted };
          }),
        };
      });
    },
    [triggerEncouragement]
  );

  // Long & Short Term Goals Handlers
  const handleAddLongGoal = useCallback(
    (title: string, timeframe: string, category: LongTermGoal['category']) => {
      const newGoal: LongTermGoal = {
        id: `ltg-${Date.now().toString(36)}`,
        title,
        timeframe,
        category,
        progress: 0,
        milestones: [],
      };
      setPlannerState((prev) => ({
        ...prev,
        longTermGoals: [...(prev.longTermGoals || []), newGoal],
      }));
    },
    []
  );

  const handleUpdateLongGoalProgress = useCallback((id: string, progress: number) => {
    setPlannerState((prev) => ({
      ...prev,
      longTermGoals: (prev.longTermGoals || []).map((g) =>
        g.id === id ? { ...g, progress } : g
      ),
    }));
  }, []);

  const handleToggleMilestone = useCallback((goalId: string, milestoneId: string) => {
    setPlannerState((prev) => {
      const goals = prev.longTermGoals || [];
      return {
        ...prev,
        longTermGoals: goals.map((g) => {
          if (g.id !== goalId) return g;
          const updated = g.milestones.map((m) =>
            m.id === milestoneId ? { ...m, completed: !m.completed } : m
          );
          const done = updated.filter((m) => m.completed).length;
          const autoProgress = updated.length > 0 ? Math.round((done / updated.length) * 100) : g.progress;
          return {
            ...g,
            progress: autoProgress,
            milestones: updated,
          };
        }),
      };
    });
  }, []);

  const handleAddMilestone = useCallback((goalId: string, title: string) => {
    setPlannerState((prev) => ({
      ...prev,
      longTermGoals: (prev.longTermGoals || []).map((g) =>
        g.id === goalId
          ? {
              ...g,
              milestones: [
                ...g.milestones,
                { id: `m-${Date.now().toString(36)}`, title, completed: false },
              ],
            }
          : g
      ),
    }));
  }, []);

  const handleDeleteLongGoal = useCallback((id: string) => {
    setPlannerState((prev) => ({
      ...prev,
      longTermGoals: (prev.longTermGoals || []).filter((g) => g.id !== id),
    }));
  }, []);

  const handleAddShortGoal = useCallback(
    (title: string, deadline: string, category: ShortTermGoal['category']) => {
      const newGoal: ShortTermGoal = {
        id: `stg-${Date.now().toString(36)}`,
        title,
        deadline,
        category,
        status: 'in_progress',
      };
      setPlannerState((prev) => ({
        ...prev,
        shortTermGoals: [...(prev.shortTermGoals || []), newGoal],
      }));
    },
    []
  );

  const handleToggleShortGoalStatus = useCallback((id: string) => {
    setPlannerState((prev) => {
      const goals = prev.shortTermGoals || [];
      const item = goals.find((g) => g.id === id);
      const willBeComplete = item?.status !== 'completed';
      if (willBeComplete) {
        fireConfetti();
        triggerEncouragement();
      }
      return {
        ...prev,
        shortTermGoals: goals.map((g) =>
          g.id === id
            ? { ...g, status: g.status === 'completed' ? 'in_progress' : 'completed' }
            : g
        ),
      };
    });
  }, [triggerEncouragement]);

  const handleDeleteShortGoal = useCallback((id: string) => {
    setPlannerState((prev) => ({
      ...prev,
      shortTermGoals: (prev.shortTermGoals || []).filter((g) => g.id !== id),
    }));
  }, []);

  // Weekly Review handler
  const handleChangeReviewField = useCallback(
    (field: keyof WeeklyReviewType, value: string) => {
      setPlannerState((prev) => ({
        ...prev,
        review: {
          ...prev.review,
          [field]: value,
        },
      }));
    },
    []
  );

  // Reset handlers
  const handleResetToSample = useCallback(() => {
    const fresh = plannerStorage.reset(currentWeekStart, true);
    setPlannerState(fresh);
  }, [currentWeekStart]);

  const handleClearToBlank = useCallback(() => {
    const fresh = plannerStorage.clear(currentWeekStart);
    setPlannerState(fresh);
  }, [currentWeekStart]);

  const handleManualSave = useCallback(() => {
    plannerStorage.save(plannerState);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastSavedText(`at ${timeStr}`);
  }, [plannerState]);

  const handleImportSuccess = useCallback(() => {
    const reloaded = plannerStorage.load(currentWeekStart);
    setPlannerState(reloaded);
  }, [currentWeekStart]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Spotlight Search (Ctrl+K or Cmd+K)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      const target = e.target as HTMLElement | null;
      const isInputFocused =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      if (isInputFocused) return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsPrintModalOpen(true);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleManualSave();
        return;
      }

      if (e.key === '[') {
        handlePrevWeek();
      } else if (e.key === ']') {
        handleNextWeek();
      } else if (e.key.toLowerCase() === 't') {
        handleCurrentWeek();
      } else if (e.key >= '1' && e.key <= '7') {
        const dayIdx = parseInt(e.key, 10) - 1;
        handleSelectDay(dayIdx);
      } else if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        const targetDayIdx =
          activeDayIndex !== null
            ? activeDayIndex
            : daysInfo.findIndex((d) => d.isToday) !== -1
            ? daysInfo.findIndex((d) => d.isToday)
            : 0;
        const taskInput = document.getElementById(`task-input-${targetDayIdx}`);
        if (taskInput) {
          taskInput.focus();
        }
      } else if (e.key === '?') {
        setIsShortcutsModalOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [
    handlePrevWeek,
    handleNextWeek,
    handleCurrentWeek,
    handleSelectDay,
    handleManualSave,
    activeDayIndex,
    daysInfo,
  ]);

  // Active Task Reminder Popup state
  const [dueReminderTask, setDueReminderTask] = useState<{
    task: Task;
    dayIndex: number;
    dayName: string;
  } | null>(null);

  const handleSnoozeReminder = useCallback((taskId: string, dayIndex: number) => {
    setPlannerState((prev) => {
      const days = ensureDays(prev.days);
      return {
        ...prev,
        days: days.map((d, dIdx) =>
          dIdx !== dayIndex
            ? d
            : {
                ...d,
                tasks: d.tasks.map((t) =>
                  t.id === taskId
                    ? {
                        ...t,
                        reminderNotified: false,
                        snoozeUntil: Date.now() + 5 * 60 * 1000,
                      }
                    : t
                ),
              }
        ),
      };
    });
    setDueReminderTask(null);
    setToastMessage('⏰ ৫ মিনিট পর আবার রিমাইন্ডার বাজবে!');
    setTimeout(() => setToastMessage(null), 3000);
  }, [ensureDays]);

  const handleCompleteReminderTask = useCallback((taskId: string, dayIndex: number) => {
    handleToggleTask(dayIndex, taskId);
    setDueReminderTask(null);
    setToastMessage('🎉 অসাধারণ! কাজটি সম্পন্ন হয়েছে!');
    setTimeout(() => setToastMessage(null), 3000);
  }, [handleToggleTask]);

  const handleTestReminder = useCallback(() => {
    playReminderAlarmSound();
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    const sampleTask: Task = {
      id: `test-remind-${Date.now()}`,
      title: 'দৈনিক শিডিউল রিভিশন ও প্রয়োজনীয় কাজ 📚',
      completed: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reminder: true,
      priority: 'high',
    };
    const tIdx = daysInfo.findIndex((d) => d.isToday);
    const validIdx = tIdx !== -1 ? tIdx : 0;
    setDueReminderTask({
      task: sampleTask,
      dayIndex: validIdx,
      dayName: daysInfo[validIdx]?.dayName || 'আজ',
    });
    setToastMessage('🔔 রিমাইন্ডার অ্যালার্ট সফলভাবে টেস্ট করা হয়েছে!');
    setTimeout(() => setToastMessage(null), 3000);
  }, [daysInfo]);

  // Real-time Reminder Watcher for Today's Scheduled Tasks
  useEffect(() => {
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

    const reminderInterval = setInterval(() => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const todayIdx = daysInfo.findIndex((d) => d.isToday);
      if (todayIdx === -1) return;

      const todayPlan = plannerState.days[todayIdx];
      if (!todayPlan) return;

      todayPlan.tasks.forEach((task) => {
        if (!task.completed && task.reminder && task.time && !task.reminderNotified) {
          if (task.snoozeUntil && Date.now() < task.snoozeUntil) {
            return;
          }

          const baseTaskMinutes = parseTimeToMinutes(task.time);
          if (baseTaskMinutes === null) return;

          let targetMinutes = baseTaskMinutes;
          if (task.reminderTiming === '5m') targetMinutes -= 5;
          else if (task.reminderTiming === '10m') targetMinutes -= 10;
          else if (task.reminderTiming === '15m') targetMinutes -= 15;

          if (Math.abs(currentMinutes - targetMinutes) <= 1) {
            playReminderAlarmSound();
            if ('Notification' in window && Notification.permission === 'granted') {
              try {
                new Notification(`⏰ কাজের সময় হয়েছে: ${task.title}`, {
                  body: `নির্ধারিত সময়: ${task.time} (${daysInfo[todayIdx]?.dayName})`,
                  icon: '/favicon.ico',
                });
              } catch {
                // ignore
              }
            }

            setDueReminderTask({
              task,
              dayIndex: todayIdx,
              dayName: daysInfo[todayIdx]?.dayName || 'আজ',
            });

            setToastMessage(`⏰ রিমাইন্ডার: "${task.title}" করার সময় হয়েছে! (${task.time})`);
            setTimeout(() => setToastMessage(null), 6000);

            // Mark task as notified
            setPlannerState((prev) => ({
              ...prev,
              days: prev.days.map((d, dIdx) =>
                dIdx !== todayIdx
                  ? d
                  : {
                      ...d,
                      tasks: d.tasks.map((t) => (t.id === task.id ? { ...t, reminderNotified: true } : t)),
                    }
              ),
            }));
          }
        }
      });
    }, 10000);

    return () => clearInterval(reminderInterval);
  }, [daysInfo, plannerState.days]);

  // Overall Task metrics for gamification
  const totalTasksCount = plannerState.days.reduce((acc, d) => acc + d.tasks.length, 0);
  const completedTasksCount = plannerState.days.reduce(
    (acc, d) => acc + d.tasks.filter((t) => t.completed).length,
    0
  );
  const habitStreakCount = plannerState.habits.reduce(
    (acc, h) => acc + h.completed.filter(Boolean).length,
    0
  );

  // Today or active day index for Water Tracker
  const todayIdx = daysInfo.findIndex((d) => d.isToday);
  const selectedDayForWater = activeDayIndex !== null ? activeDayIndex : (todayIdx !== -1 ? todayIdx : 0);
  const currentWaterGlasses = plannerState.days[selectedDayForWater]?.waterGlasses || 0;

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#09090B] text-[#111111] dark:text-zinc-100 flex flex-col font-sans transition-colors relative">
      {/* Toast Notification for Encouragement & Actions */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#111111] dark:bg-white text-white dark:text-[#111111] px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-white/20 dark:border-black/20 animate-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-4 h-4 text-amber-400 dark:text-amber-500 shrink-0" />
          <span className="text-xs font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Floating Active Task Reminder Popup Card */}
      {dueReminderTask && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white dark:bg-[#18181B] text-slate-900 dark:text-white rounded-2xl shadow-2xl border-2 border-amber-400 dark:border-amber-500 p-4 animate-in slide-in-from-bottom-5 duration-300 ring-4 ring-amber-400/20">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded-xl shrink-0">
              <Bell className="w-5 h-5 fill-current animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-black text-amber-800 dark:text-amber-300 uppercase tracking-wider bg-amber-100/80 dark:bg-amber-900/60 px-2 py-0.5 rounded-full">
                  ⏰ কাজের সময় হয়েছে
                </span>
                <span className="text-[10px] text-slate-400 font-mono font-bold">
                  {dueReminderTask.task.time}
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1 break-words">
                {dueReminderTask.task.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {dueReminderTask.dayName}-এর শিডিউলে নির্ধারিত কাজ
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => handleCompleteReminderTask(dueReminderTask.task.id, dueReminderTask.dayIndex)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>সম্পন্ন করেছি</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSnoozeReminder(dueReminderTask.task.id, dueReminderTask.dayIndex)}
                  className="inline-flex items-center justify-center gap-1 py-2 px-3 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  title="৫ মিনিট পরে আবার মনে করাবে"
                >
                  <span>৫মি স্নুজ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDueReminderTask(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-xl cursor-pointer"
                  title="বন্ধ করুন"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Header with User Persona & Shortcuts */}
      <Header
        weekStart={currentWeekStart}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        onCurrentWeek={handleCurrentWeek}
        onSave={handleManualSave}
        onOpenResetModal={() => setIsResetModalOpen(true)}
        onExport={() => setBackupModalMode('export')}
        onImport={() => setBackupModalMode('import')}
        onPrint={handlePrint}
        onExportCalendar={() => {
          downloadIcsFile(plannerState);
          setToastMessage('📅 Exported weekly schedule (.ics) for your Calendar!');
          setTimeout(() => setToastMessage(null), 3000);
        }}
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
        onOpenAchievementCard={() => setIsAchievementModalOpen(true)}
        onOpenBreathing={() => setIsBreathingModalOpen(true)}
        onOpenRituals={() => setIsRitualsModalOpen(true)}
        onOpenLetters={() => setIsLettersModalOpen(true)}
        onOpenWrapped={() => setIsWrappedModalOpen(true)}
        onOpenManual={() => setIsManualModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        userName={userProfile.name}
        userTagline={userProfile.tagline}
        lastSavedText={lastSavedText}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        currentTheme={currentTheme}
        onChangeTheme={(th) => {
          setCurrentTheme(th);
          setToastMessage(`Theme updated to ${th.toUpperCase()} ✨`);
          setTimeout(() => setToastMessage(null), 2000);
        }}
      />

      {/* Clean Segmented Navigation Tabs */}
      <NavigationTabs
        currentTab={currentNavTab}
        onChangeTab={setCurrentNavTab}
        tasksCount={completedTasksCount}
        habitsCount={habitStreakCount}
      />

      {/* Main Clean Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 1. Monthly Aesthetic Habit Tracker (Clean Google Sheets view) */}
        {currentNavTab === 'monthly' && (
          <MonthlyAestheticHabitTracker />
        )}

        {/* 2. Daily Execution & Tasks */}
        {currentNavTab === 'planner' && (
          <div className="space-y-6">
            <WeeklyStatsSummary
              weekStart={currentWeekStart}
              days={plannerState.days}
              habits={plannerState.habits}
              activeDayIndex={activeDayIndex}
              onSelectDay={handleSelectDay}
            />

            <WeekNavigation
              weekStart={currentWeekStart}
              days={plannerState.days}
              activeDayIndex={activeDayIndex}
              onSelectDay={handleSelectDay}
            />

            <DailyPlanner
              daysInfo={daysInfo}
              days={plannerState.days}
              activeDayIndex={activeDayIndex}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onMoveTask={handleMoveTask}
              onTogglePriority={handleTogglePriority}
              onToggleReminder={handleToggleReminder}
              onSortTasksByTime={handleSortTasksByTime}
              onUpdateNote={handleUpdateNote}
              onUpdateMood={handleUpdateMood}
              onTogglePrayer={handleTogglePrayer}
              onUpdateWater={handleUpdateWater}
              onUpdateWin={handleUpdateWin}
              onPostponeTask={handlePostponeTask}
              onDuplicateTask={handleDuplicateTask}
              onClearCompletedTasks={handleClearCompletedTasks}
              onTriggerTestReminder={handleTestReminder}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <BrainDumpScratchpad
                notes={scratchNotes}
                onAddNote={handleAddScratchNote}
                onDeleteNote={handleDeleteScratchNote}
                onTransferToDay={(noteId, content, dayIdx) => {
                  handleAddTask(dayIdx, content);
                  handleDeleteScratchNote(noteId);
                  setToastMessage(`✓ Moved thought to ${daysInfo[dayIdx]?.dayName || 'Day'}!`);
                  setTimeout(() => setToastMessage(null), 2500);
                }}
                daysInfo={daysInfo}
              />
              <MasterTodoList
                todos={plannerState.masterTodos || []}
                daysInfo={daysInfo}
                onToggleTodo={handleToggleTodo}
                onAddTodo={handleAddTodo}
                onDeleteTodo={handleDeleteTodo}
                onAssignToDay={handleAssignTodoToDay}
                onClearCompletedTodos={handleClearCompletedTodos}
                onEditTodo={handleEditTodo}
              />
            </div>
          </div>
        )}

        {/* 3. Goals & Priorities */}
        {currentNavTab === 'focus' && (
          <div className="space-y-6">
            <WeeklyFocusReward
              weekStart={currentWeekStart}
              focus={plannerState.focus}
              objective={plannerState.objective}
              reward={plannerState.reward}
              onUpdateFocus={handleUpdateFocus}
              onUpdateReward={handleUpdateReward}
            />
            <GoalsSection
              longTermGoals={plannerState.longTermGoals || []}
              shortTermGoals={plannerState.shortTermGoals || []}
              onAddLongGoal={handleAddLongGoal}
              onUpdateLongGoalProgress={handleUpdateLongGoalProgress}
              onToggleMilestone={handleToggleMilestone}
              onAddMilestone={handleAddMilestone}
              onDeleteLongGoal={handleDeleteLongGoal}
              onAddShortGoal={handleAddShortGoal}
              onToggleShortGoalStatus={handleToggleShortGoalStatus}
              onDeleteShortGoal={handleDeleteShortGoal}
            />
          </div>
        )}

        {/* 4. Weekly Review & Reflection */}
        {currentNavTab === 'mindset' && (
          <div className="space-y-6">
            <WeeklyReview
              review={plannerState.review}
              onChangeReviewField={handleChangeReviewField}
            />
          </div>
        )}

        {/* 5. Deep Work Pomodoro Focus Station */}
        {currentNavTab === 'timer' && (
          <div className="max-w-2xl mx-auto py-6">
            <PomodoroTimer />
          </div>
        )}
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-[#0B0F17]/70 backdrop-blur-xl py-5 px-4 sm:px-6 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors shadow-2xs mt-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Weekly Life Planner · Crafted for {userProfile.name}
          </span>
          <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
            Local & Private · Press ⌘K for Command Palette
          </span>
        </div>
      </footer>

      {/* Modals */}
      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onResetToSample={handleResetToSample}
        onClearToBlank={handleClearToBlank}
      />

      <BackupModal
        isOpen={backupModalMode !== null}
        mode={backupModalMode || 'export'}
        onClose={() => setBackupModalMode(null)}
        onImportSuccess={handleImportSuccess}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      <PrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        state={plannerState}
        daysInfo={daysInfo}
      />

      {/* Feature #3: Weekly Achievement Card Export Modal */}
      <WeeklyAchievementCardModal
        isOpen={isAchievementModalOpen}
        onClose={() => setIsAchievementModalOpen(false)}
        state={plannerState}
        daysInfo={daysInfo}
      />

      {/* User Personalization Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={userProfile}
        onSaveProfile={handleSaveProfile}
      />

      {/* 1-Min Box Breathing Mindfulness Modal */}
      <BoxBreathingModal
        isOpen={isBreathingModalOpen}
        onClose={() => setIsBreathingModalOpen(false)}
      />

      {/* Spotlight Command Palette (Ctrl+K) */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        state={plannerState}
        daysInfo={daysInfo}
        onSelectDay={handleSelectDay}
        onQuickAddTask={(dayIdx, title) => handleAddTask(dayIdx, title)}
        onOpenBreathing={() => setIsBreathingModalOpen(true)}
        onOpenAchievement={() => setIsAchievementModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenRituals={() => setIsRitualsModalOpen(true)}
        onOpenLetters={() => setIsLettersModalOpen(true)}
        onOpenWrapped={() => setIsWrappedModalOpen(true)}
        onOpenManual={() => setIsManualModalOpen(true)}
      />

      {/* VIP Feature #1: Daily Rituals Modal (Morning Clarity & Evening Reflection) */}
      <DailyRitualsModal
        isOpen={isRitualsModalOpen}
        onClose={() => setIsRitualsModalOpen(false)}
        userName={userProfile.name}
        onAddTodayTask={(taskTitle) => {
          const todayIndex = daysInfo.findIndex((d) => d.isToday);
          const targetDay = todayIndex !== -1 ? todayIndex : 0;
          handleAddTask(targetDay, taskTitle);
        }}
      />

      {/* VIP Feature #2: Future Letters & Time Capsule */}
      <FutureLettersModal
        isOpen={isLettersModalOpen}
        onClose={() => setIsLettersModalOpen(false)}
        userName={userProfile.name}
      />

      {/* VIP Feature #3: Weekly Wrapped Spotify-Style Story */}
      <WeeklyWrappedModal
        isOpen={isWrappedModalOpen}
        onClose={() => setIsWrappedModalOpen(false)}
        state={plannerState}
        daysInfo={daysInfo}
        userName={userProfile.name}
      />

      {/* Interactive App User Manual & Guide Modal */}
      <UserManualModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
      />
    </div>
  );
}
