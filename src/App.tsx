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
} from './types/planner';
import {
  getMondayOfWeek,
  shiftWeekStart,
  getWeekDaysInfo,
} from './utils/dateUtils';
import { plannerStorage } from './storage/plannerStorage';
import { playTaskCompleteSound } from './utils/soundEffects';
import { fireConfetti } from './utils/confetti';
import { downloadIcsFile } from './utils/icsExport';
import { Sparkles } from 'lucide-react';

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
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [backupModalMode, setBackupModalMode] = useState<'export' | 'import' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
    (dayIndex: number, title: string, time?: string) => {
      const newTask = {
        id: `task-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        title,
        completed: false,
        priority: 'normal' as const,
        time,
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
    (dayIndex: number, taskId: string, newTitle: string, newTime?: string) => {
      setPlannerState((prev) => {
        const days = ensureDays(prev.days);
        return {
          ...prev,
          days: days.map((day, idx) => {
            if (idx !== dayIndex) return day;
            return {
              ...day,
              tasks: day.tasks.map((task) =>
                task.id === taskId ? { ...task, title: newTitle, time: newTime } : task
              ),
            };
          }),
        };
      });
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

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Motivational Banner & Gamification Level XP */}
        <MotivationalBanner
          completedTasksCount={completedTasksCount}
          totalTasksCount={totalTasksCount}
          habitStreakCount={habitStreakCount}
        />

        {/* Feature #5: Daily Quran Verse / Spiritual Anchor */}
        <DailyVerseCard />

        {/* Feature #4: Daily Hydration Tracker (2 Liters Target) */}
        <WaterTracker
          currentGlasses={currentWaterGlasses}
          onUpdateGlasses={(glasses) => handleUpdateWater(selectedDayForWater, glasses)}
          dayLabel={daysInfo[selectedDayForWater]?.dayName || 'Today'}
        />

        {/* Unlockable Badges Showcase & Trophy Room */}
        <BadgesShowcase plannerState={plannerState} />

        {/* Pomodoro Focus & Synthesized Ambient Sound Station */}
        <PomodoroTimer />

        {/* Weekly Focus & Reward Section */}
        <WeeklyFocusReward
          weekStart={currentWeekStart}
          focus={plannerState.focus}
          objective={plannerState.objective}
          reward={plannerState.reward}
          onUpdateFocus={handleUpdateFocus}
          onUpdateReward={handleUpdateReward}
        />

        {/* Life Balance & 5 Pillars Holistic Radar Index */}
        <LifeBalanceScore
          habits={plannerState.habits}
          days={plannerState.days}
        />

        {/* Overall Progress & 7-Day Completion Bar Chart */}
        <WeeklyStatsSummary
          weekStart={currentWeekStart}
          days={plannerState.days}
          habits={plannerState.habits}
          activeDayIndex={activeDayIndex}
          onSelectDay={handleSelectDay}
        />

        {/* Week Day Quick Navigation Strip */}
        <WeekNavigation
          weekStart={currentWeekStart}
          days={plannerState.days}
          activeDayIndex={activeDayIndex}
          onSelectDay={handleSelectDay}
        />

        {/* 7-Day Planner Grid (with Time-blocking, Daily Win & Salah & Water) */}
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
          onUpdateNote={handleUpdateNote}
          onUpdateMood={handleUpdateMood}
          onTogglePrayer={handleTogglePrayer}
          onUpdateWater={handleUpdateWater}
          onUpdateWin={handleUpdateWin}
        />

        {/* Daily Brain Dump & Scratchpad */}
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

        {/* Master To-Do & Backlog Quick Capture */}
        <MasterTodoList
          todos={plannerState.masterTodos || []}
          daysInfo={daysInfo}
          onToggleTodo={handleToggleTodo}
          onAddTodo={handleAddTodo}
          onDeleteTodo={handleDeleteTodo}
          onAssignToDay={handleAssignTodoToDay}
        />

        {/* Categorized Habit Tracker Matrix */}
        <HabitTracker
          habits={plannerState.habits}
          daysInfo={daysInfo}
          onToggleHabitDay={handleToggleHabitDay}
          onAddHabit={handleAddHabit}
          onRenameHabit={handleRenameHabit}
          onDeleteHabit={handleDeleteHabit}
          onMoveHabit={handleMoveHabit}
        />

        {/* Life Goals & Vision Hub (Long-Term & Short-Term) */}
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

        {/* Weekly Review & Reflection */}
        <WeeklyReview
          review={plannerState.review}
          onChangeReviewField={handleChangeReviewField}
        />
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-[#E5E7EB] dark:border-[#27272A] bg-white dark:bg-[#18181B] py-4 px-4 sm:px-6 text-center text-xs text-[#71717A] dark:text-[#A1A1AA] transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Weekly Life Planner · Built for {userProfile.name}</span>
          <span className="font-mono text-[11px] text-[#A1A1AA] dark:text-[#71717A]">
            Data saved locally in browser · Press ⌘K or ? for shortcuts
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
    </div>
  );
}
