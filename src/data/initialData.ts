import { PlannerState, Habit, MasterTodo, LongTermGoal, ShortTermGoal } from '../types/planner';
import { getWeekDaysInfo } from '../utils/dateUtils';

// Completely empty by default - user creates everything from scratch!
export const DEFAULT_HABITS: Habit[] = [];
export const DEFAULT_LONG_TERM_GOALS: LongTermGoal[] = [];
export const DEFAULT_SHORT_TERM_GOALS: ShortTermGoal[] = [];
export const DEFAULT_MASTER_TODOS: MasterTodo[] = [];

/**
 * Generate a 100% clean, blank planner state for a given weekStart.
 * No pre-populated sample tasks or habits.
 */
export function generateBlankWeek(
  weekStart: string,
  existingHabitNames?: Habit[],
  existingTodos?: MasterTodo[],
  existingLongGoals?: LongTermGoal[],
  existingShortGoals?: ShortTermGoal[]
): PlannerState {
  const daysInfo = getWeekDaysInfo(weekStart);

  const cleanHabits: Habit[] = existingHabitNames && existingHabitNames.length > 0
    ? existingHabitNames.map((h) => ({
        id: h.id,
        name: h.name,
        category: h.category,
        completed: [false, false, false, false, false, false, false],
      }))
    : [];

  return {
    weekStart,
    focus: '',
    objective: '',
    reward: '',
    days: daysInfo.map((info) => ({
      date: info.dateStr,
      note: '',
      tasks: [],
      waterGlasses: 0,
      winOfTheDay: '',
    })),
    habits: cleanHabits,
    review: {
      wentWell: '',
      challenges: '',
      achievement: '',
      lesson: '',
      nextWeekPriority: '',
    },
    masterTodos: existingTodos || [],
    longTermGoals: existingLongGoals || [],
    shortTermGoals: existingShortGoals || [],
  };
}

/**
 * Optional sample data - ONLY used if user explicitly requests to load a sample demo!
 */
export function generateSampleData(weekStart: string): PlannerState {
  return generateBlankWeek(weekStart);
}
