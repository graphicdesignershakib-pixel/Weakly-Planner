import { DayPlan, Habit } from '../types/planner';

/**
 * Daily task progress:
 * completed tasks / total tasks × 100
 * If total tasks is 0, returns 0.
 * Always returns a clean integer from 0 to 100.
 */
export function calculateDailyProgress(day?: DayPlan): number {
  if (!day || !day.tasks || day.tasks.length === 0) {
    return 0;
  }
  const completedCount = day.tasks.filter((t) => t.completed).length;
  const totalCount = day.tasks.length;
  return Math.round((completedCount / totalCount) * 100);
}

/**
 * Weekly task progress:
 * all completed tasks / all tasks × 100
 * If total tasks is 0, returns 0%.
 */
export function calculateWeeklyProgress(days: DayPlan[]): {
  completed: number;
  total: number;
  percentage: number;
} {
  if (!days || days.length === 0) {
    return { completed: 0, total: 0, percentage: 0 };
  }

  let completed = 0;
  let total = 0;

  for (const day of days) {
    if (day.tasks) {
      total += day.tasks.length;
      completed += day.tasks.filter((t) => t.completed).length;
    }
  }

  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { completed, total, percentage };
}

/**
 * Habit progress for a single habit across the 7 days:
 * completed habit days / 7 × 100
 */
export function calculateHabitProgress(completed: boolean[]): number {
  if (!completed || completed.length === 0) {
    return 0;
  }
  const completedCount = completed.filter(Boolean).length;
  const totalDays = completed.length; // usually 7
  if (totalDays === 0) return 0;
  return Math.round((completedCount / totalDays) * 100);
}

/**
 * Overall habit consistency:
 * all completed habit checkmarks / (habits.length * 7) × 100
 */
export function calculateOverallHabitProgress(habits: Habit[]): {
  completed: number;
  total: number;
  percentage: number;
} {
  if (!habits || habits.length === 0) {
    return { completed: 0, total: 0, percentage: 0 };
  }

  let completed = 0;
  let total = 0;

  for (const habit of habits) {
    const daysCount = habit.completed.length;
    total += daysCount;
    completed += habit.completed.filter(Boolean).length;
  }

  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { completed, total, percentage };
}
