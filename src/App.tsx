/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { MotivationalBanner } from './components/MotivationalBanner';
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
import {
  PlannerState,
  WeeklyReview as WeeklyReviewType,
  HabitCategory,
  MasterTodo,
  LongTermGoal,
  ShortTermGoal,
} from './types/planner';
import {
  getMondayOfWeek,
  shiftWeekStart,
  getWeekDaysInfo,
} from './utils/dateUtils';
import { plannerStorage } from './storage/plannerStorage';
import { playTaskCompleteSound } from './utils/soundEffects';
import { fireConfetti } from './utils/confetti';
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
    return '2026-09-28';
  }, []);

  const [currentWeekStart, setCurrentWeekStart] = useState<string>(initialWeekStart);
  const [plannerState, setPlannerState] = useState<PlannerState>(() =>
    plannerStorage.load(initialWeekStart)
  );

  const [activeDayIndex, setActiveDayIndex] = useState<number | null>(null);
  const [lastSavedText, setLastSavedText] = useState<string>('just now');
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [backupModalMode, setBackupModalMode] = useState<'export' | 'import' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  // Days metadata for the active week
  const daysInfo = useMemo(() => getWeekDaysInfo(currentWeekStart), [currentWeekStart]);

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
          }
        );
      });
    },
    [daysInfo]
  );

  // Daily Task handlers using dayIndex for guaranteed alignment
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
    (dayIndex: number, title: string) => {
      const newTask = {
        id: `task-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        title,
        completed: false,
        priority: 'normal' as const,
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
    (dayIndex: number, taskId: string, newTitle: string) => {
      setPlannerState((prev) => {
        const days = ensureDays(prev.days);
        return {
          ...prev,
          days: days.map((day, idx) => {
            if (idx !== dayIndex) return day;
            return {
              ...day,
              tasks: day.tasks.map((task) =>
                task.id === taskId ? { ...task, title: newTitle } : task
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
      // Add as task into day
      handleAddTask(dayIndex, todo.title);
      // Mark todo as completed in master list
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

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111111] flex flex-col font-sans relative">
      {/* Toast Notification for Encouragement & Actions */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#111111] text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-white/20 animate-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
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
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
        lastSavedText={lastSavedText}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Motivational Banner & Gamification Level XP */}
        <MotivationalBanner
          completedTasksCount={completedTasksCount}
          totalTasksCount={totalTasksCount}
          habitStreakCount={habitStreakCount}
        />

        {/* Weekly Focus & Reward Section */}
        <WeeklyFocusReward
          weekStart={currentWeekStart}
          focus={plannerState.focus}
          objective={plannerState.objective}
          reward={plannerState.reward}
          onUpdateFocus={handleUpdateFocus}
          onUpdateReward={handleUpdateReward}
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

        {/* 7-Day Planner Grid (Monday - Sunday) */}
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
      <footer className="border-t border-[#E5E7EB] bg-white py-4 px-4 sm:px-6 text-center text-xs text-[#71717A]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Weekly Life Planner · Swiss Editorial Productivity Workspace</span>
          <span className="font-mono text-[11px] text-[#A1A1AA]">
            Data saved locally in browser · Press ? for shortcuts
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
    </div>
  );
}
