/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { WeeklyFocusReward } from './components/WeeklyFocusReward';
import { WeeklyStatsSummary } from './components/WeeklyStatsSummary';
import { WeekNavigation } from './components/WeekNavigation';
import { DailyPlanner } from './components/DailyPlanner';
import { HabitTracker } from './components/HabitTracker';
import { WeeklyReview } from './components/WeeklyReview';
import { ResetModal } from './components/ResetModal';
import { BackupModal } from './components/BackupModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { PrintModal } from './components/PrintModal';
import { PlannerState, WeeklyReview as WeeklyReviewType } from './types/planner';
import {
  getMondayOfWeek,
  shiftWeekStart,
  getWeekDaysInfo,
} from './utils/dateUtils';
import { plannerStorage } from './storage/plannerStorage';

export default function App() {
  // Prefer last active week or standard reference week '2026-09-28' for rich initial data
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
        return {
          ...prev,
          days: days.map((day, idx) => {
            if (idx !== dayIndex) return day;
            return {
              ...day,
              tasks: day.tasks.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
              ),
            };
          }),
        };
      });
    },
    [ensureDays]
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
    setPlannerState((prev) => ({
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
    }));
  }, []);

  const handleAddHabit = useCallback((name: string) => {
    const newHabit = {
      id: `habit-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      name,
      completed: [false, false, false, false, false, false, false],
    };

    setPlannerState((prev) => ({
      ...prev,
      habits: [...prev.habits, newHabit],
    }));
  }, []);

  const handleRenameHabit = useCallback((habitId: string, newName: string) => {
    setPlannerState((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => (h.id === habitId ? { ...h, name: newName } : h)),
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
        // Focus task input of active day or today
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

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111111] flex flex-col font-sans">
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

        {/* Habit Tracker Matrix */}
        <HabitTracker
          habits={plannerState.habits}
          daysInfo={daysInfo}
          onToggleHabitDay={handleToggleHabitDay}
          onAddHabit={handleAddHabit}
          onRenameHabit={handleRenameHabit}
          onDeleteHabit={handleDeleteHabit}
          onMoveHabit={handleMoveHabit}
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
